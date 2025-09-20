/**
 * @jest-environment node
 */

import { POST as registerPOST } from "@/app/api/auth/register/route"
import { POST as loginPOST } from "@/app/api/auth/login/route"
import { prisma } from "@/lib/db"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock Prisma
jest.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe("Auth API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("User registered successfully")
      expect(data.user).toBeDefined()
      expect(data.token).toBeDefined()
    })

    it("should reject registration with existing email", async () => {
      const userData = {
        name: "John Doe",
        email: "existing@example.com",
        password: "password123",
      }

      mockPrisma.user.findUnique.mockResolvedValue({
        id: "existing123",
        name: "Existing User",
        email: "existing@example.com",
        password: "hashedpassword",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("User with this email already exists")
    })

    it("should reject invalid registration data", async () => {
      const invalidData = {
        name: "J", // Too short
        email: "invalid-email",
        password: "123", // Too short
      }

      const request = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: JSON.stringify(invalidData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid input data")
    })
  })

  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      const loginData = {
        email: "john@example.com",
        password: "password123",
      }

      // Mock bcrypt comparison to return true
      const bcrypt = require("bcryptjs")
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true)

      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await loginPOST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Login successful")
      expect(data.user).toBeDefined()
      expect(data.token).toBeDefined()
    })

    it("should reject login with non-existent email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      }

      mockPrisma.user.findUnique.mockResolvedValue(null)

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await loginPOST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Invalid email or password")
    })

    it("should reject login with incorrect password", async () => {
      const loginData = {
        email: "john@example.com",
        password: "wrongpassword",
      }

      // Mock bcrypt comparison to return false
      const bcrypt = require("bcryptjs")
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false)

      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "Content-Type": "application/json" },
      })

      const response = await loginPOST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Invalid email or password")
    })
  })
})
