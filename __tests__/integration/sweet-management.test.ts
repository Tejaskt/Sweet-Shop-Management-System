/**
 * @jest-environment node
 */

import { POST as createSweet } from "@/app/api/sweets/route"
import { POST as purchaseSweet } from "@/app/api/sweets/[id]/purchase/route"
import { POST as restockSweet } from "@/app/api/sweets/[id]/restock/route"
import { prisma } from "@/lib/db"
import { generateToken } from "@/lib/auth"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock Prisma
jest.mock("@/lib/db", () => ({
  prisma: {
    sweet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    purchase: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe("Sweet Management Integration", () => {
  const adminToken = generateToken({
    userId: "admin123",
    email: "admin@example.com",
    role: "ADMIN",
  })

  const userToken = generateToken({
    userId: "user123",
    email: "user@example.com",
    role: "USER",
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Sweet Creation (Admin Only)", () => {
    it("should allow admin to create sweet", async () => {
      const sweetData = {
        name: "Test Sweet",
        category: "Test Category",
        price: 1.99,
        quantity: 100,
        description: "Test description",
      }

      mockPrisma.sweet.create.mockResolvedValue({
        id: "sweet123",
        ...sweetData,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest("http://localhost:3000/api/sweets", {
        method: "POST",
        body: JSON.stringify(sweetData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      })

      const response = await createSweet(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Sweet created successfully")
      expect(data.sweet).toBeDefined()
    })

    it("should reject non-admin sweet creation", async () => {
      const sweetData = {
        name: "Test Sweet",
        category: "Test Category",
        price: 1.99,
        quantity: 100,
      }

      const request = new NextRequest("http://localhost:3000/api/sweets", {
        method: "POST",
        body: JSON.stringify(sweetData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })

      const response = await createSweet(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe("Admin access required")
    })
  })

  describe("Sweet Purchase", () => {
    it("should allow user to purchase sweet", async () => {
      const mockSweet = {
        id: "sweet123",
        name: "Test Sweet",
        category: "Test",
        price: 2.99,
        quantity: 50,
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockPurchase = {
        id: "purchase123",
        userId: "user123",
        sweetId: "sweet123",
        quantity: 2,
        totalPrice: 5.98,
        createdAt: new Date(),
        sweet: mockSweet,
      }

      mockPrisma.sweet.findUnique.mockResolvedValue(mockSweet)
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          purchase: {
            create: jest.fn().mockResolvedValue(mockPurchase),
          },
          sweet: {
            update: jest.fn().mockResolvedValue({ ...mockSweet, quantity: 48 }),
          },
        })
      })

      const request = new NextRequest("http://localhost:3000/api/sweets/sweet123/purchase", {
        method: "POST",
        body: JSON.stringify({ quantity: 2 }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })

      const response = await purchaseSweet(request, { params: { id: "sweet123" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Purchase completed successfully")
      expect(data.purchase).toBeDefined()
    })

    it("should reject purchase when insufficient stock", async () => {
      const mockSweet = {
        id: "sweet123",
        name: "Test Sweet",
        category: "Test",
        price: 2.99,
        quantity: 1, // Only 1 in stock
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.sweet.findUnique.mockResolvedValue(mockSweet)

      const request = new NextRequest("http://localhost:3000/api/sweets/sweet123/purchase", {
        method: "POST",
        body: JSON.stringify({ quantity: 5 }), // Trying to buy 5
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })

      const response = await purchaseSweet(request, { params: { id: "sweet123" } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Insufficient stock available")
    })
  })

  describe("Sweet Restocking (Admin Only)", () => {
    it("should allow admin to restock sweet", async () => {
      const mockSweet = {
        id: "sweet123",
        name: "Test Sweet",
        category: "Test",
        price: 2.99,
        quantity: 10,
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedSweet = { ...mockSweet, quantity: 35 }

      mockPrisma.sweet.findUnique.mockResolvedValue(mockSweet)
      mockPrisma.sweet.update.mockResolvedValue(updatedSweet)

      const request = new NextRequest("http://localhost:3000/api/sweets/sweet123/restock", {
        method: "POST",
        body: JSON.stringify({ quantity: 25 }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      })

      const response = await restockSweet(request, { params: { id: "sweet123" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Sweet restocked successfully")
      expect(data.sweet.quantity).toBe(35)
    })

    it("should reject non-admin restock attempt", async () => {
      const request = new NextRequest("http://localhost:3000/api/sweets/sweet123/restock", {
        method: "POST",
        body: JSON.stringify({ quantity: 25 }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })

      const response = await restockSweet(request, { params: { id: "sweet123" } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe("Admin access required")
    })
  })
})
