import { registerSchema, sweetSchema, purchaseSchema } from "@/lib/validations"

describe("Validation Schemas", () => {
  describe("Register Schema", () => {
    it("should validate correct registration data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("should reject invalid email", () => {
      const invalidData = {
        name: "John Doe",
        email: "invalid-email",
        password: "password123",
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject short password", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "123",
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject short name", () => {
      const invalidData = {
        name: "J",
        email: "john@example.com",
        password: "password123",
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("Sweet Schema", () => {
    it("should validate correct sweet data", () => {
      const validData = {
        name: "Chocolate Chip Cookie",
        category: "Cookies",
        price: 2.99,
        quantity: 50,
        description: "Delicious cookie",
        imageUrl: "https://example.com/image.jpg",
      }

      const result = sweetSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("should reject negative price", () => {
      const invalidData = {
        name: "Test Sweet",
        category: "Test",
        price: -1,
        quantity: 10,
      }

      const result = sweetSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject negative quantity", () => {
      const invalidData = {
        name: "Test Sweet",
        category: "Test",
        price: 1.99,
        quantity: -5,
      }

      const result = sweetSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should accept optional fields as undefined", () => {
      const validData = {
        name: "Test Sweet",
        category: "Test",
        price: 1.99,
        quantity: 10,
      }

      const result = sweetSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe("Purchase Schema", () => {
    it("should validate positive quantity", () => {
      const validData = { quantity: 5 }
      const result = purchaseSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("should reject zero quantity", () => {
      const invalidData = { quantity: 0 }
      const result = purchaseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject negative quantity", () => {
      const invalidData = { quantity: -1 }
      const result = purchaseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
