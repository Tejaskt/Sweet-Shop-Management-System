import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { sweetSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sweets = await prisma.sweet.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ sweets })
  } catch (error) {
    console.error("Get sweets error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = sweetSchema.parse(body)

    const sweet = await prisma.sweet.create({
      data: validatedData,
    })

    return NextResponse.json({
      message: "Sweet created successfully",
      sweet,
    })
  } catch (error) {
    console.error("Create sweet error:", error)
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
