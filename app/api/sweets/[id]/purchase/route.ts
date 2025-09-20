import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { purchaseSchema } from "@/lib/validations"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = purchaseSchema.parse(body)

    // Get sweet and check availability
    const sweet = await prisma.sweet.findUnique({
      where: { id: params.id },
    })

    if (!sweet) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 })
    }

    if (sweet.quantity < validatedData.quantity) {
      return NextResponse.json({ error: "Insufficient stock available" }, { status: 400 })
    }

    // Calculate total price
    const totalPrice = sweet.price * validatedData.quantity

    // Create purchase and update sweet quantity in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create purchase record
      const purchase = await tx.purchase.create({
        data: {
          userId: user.userId,
          sweetId: params.id,
          quantity: validatedData.quantity,
          totalPrice,
        },
        include: {
          sweet: true,
        },
      })

      // Update sweet quantity
      await tx.sweet.update({
        where: { id: params.id },
        data: {
          quantity: sweet.quantity - validatedData.quantity,
        },
      })

      return purchase
    })

    return NextResponse.json({
      message: "Purchase completed successfully",
      purchase: result,
    })
  } catch (error) {
    console.error("Purchase error:", error)
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
