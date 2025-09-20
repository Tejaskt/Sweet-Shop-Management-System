import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const sweetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
})

export const purchaseSchema = z.object({
  quantity: z.number().int().positive("Quantity must be positive"),
})

export const restockSchema = z.object({
  quantity: z.number().int().positive("Quantity must be positive"),
})

export const searchSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
})
