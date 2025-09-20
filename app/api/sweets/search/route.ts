import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { searchSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const searchData = {
      name: searchParams.get("name") || undefined,
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined,
    }

    const validatedData = searchSchema.parse(searchData)

    const whereClause: any = {}

    if (validatedData.name) {
      whereClause.name = {
        contains: validatedData.name,
        mode: "insensitive",
      }
    }

    if (validatedData.category) {
      whereClause.category = {
        contains: validatedData.category,
        mode: "insensitive",
      }
    }

    if (validatedData.minPrice !== undefined || validatedData.maxPrice !== undefined) {
      whereClause.price = {}
      if (validatedData.minPrice !== undefined) {
        whereClause.price.gte = validatedData.minPrice
      }
      if (validatedData.maxPrice !== undefined) {
        whereClause.price.lte = validatedData.maxPrice
      }
    }

    const sweets = await prisma.sweet.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ sweets })
  } catch (error) {
    console.error("Search sweets error:", error)
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid search parameters", details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
