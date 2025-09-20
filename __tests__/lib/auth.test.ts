import { hashPassword, comparePassword, generateToken, verifyToken } from "@/lib/auth"

describe("Auth Library", () => {
  describe("Password Hashing", () => {
    it("should hash a password", async () => {
      const password = "testpassword123"
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(50)
    })

    it("should verify correct password", async () => {
      const password = "testpassword123"
      const hash = await hashPassword(password)
      const isValid = await comparePassword(password, hash)

      expect(isValid).toBe(true)
    })

    it("should reject incorrect password", async () => {
      const password = "testpassword123"
      const wrongPassword = "wrongpassword"
      const hash = await hashPassword(password)
      const isValid = await comparePassword(wrongPassword, hash)

      expect(isValid).toBe(false)
    })
  })

  describe("JWT Token Management", () => {
    const mockPayload = {
      userId: "user123",
      email: "test@example.com",
      role: "USER" as const,
    }

    it("should generate a valid JWT token", () => {
      const token = generateToken(mockPayload)

      expect(token).toBeDefined()
      expect(typeof token).toBe("string")
      expect(token.split(".")).toHaveLength(3) // JWT has 3 parts
    })

    it("should verify a valid token", () => {
      const token = generateToken(mockPayload)
      const decoded = verifyToken(token)

      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(mockPayload.userId)
      expect(decoded?.email).toBe(mockPayload.email)
      expect(decoded?.role).toBe(mockPayload.role)
    })

    it("should reject invalid token", () => {
      const invalidToken = "invalid.token.here"
      const decoded = verifyToken(invalidToken)

      expect(decoded).toBeNull()
    })

    it("should reject malformed token", () => {
      const malformedToken = "not-a-jwt-token"
      const decoded = verifyToken(malformedToken)

      expect(decoded).toBeNull()
    })
  })
})
