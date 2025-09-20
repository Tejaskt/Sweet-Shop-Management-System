import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sweetSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: sweets, error } = await supabase.from("sweets").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Get sweets error:", error)
      return NextResponse.json({ error: "Failed to fetch sweets" }, { status: 500 })
    }

    return NextResponse.json({ sweets })
  } catch (error) {
    console.error("Get sweets error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !userProfile || userProfile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = sweetSchema.parse(body)

    const { data: sweet, error } = await supabase.from("sweets").insert([validatedData]).select().single()

    if (error) {
      console.error("Create sweet error:", error)
      return NextResponse.json({ error: "Failed to create sweet" }, { status: 500 })
    }

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
