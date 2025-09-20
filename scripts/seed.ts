import { prisma } from "../lib/db"
import { hashPassword } from "../lib/auth"

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const adminPassword = await hashPassword("admin123")
  const admin = await prisma.user.upsert({
    where: { email: "admin@sweetshop.com" },
    update: {},
    create: {
      email: "admin@sweetshop.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  })

  // Create regular user
  const userPassword = await hashPassword("user123")
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: userPassword,
      name: "John Doe",
      role: "USER",
    },
  })

  // Create sample sweets
  const sweets = [
    {
      name: "Chocolate Chip Cookies",
      category: "Cookies",
      price: 2.99,
      quantity: 50,
      description: "Delicious homemade chocolate chip cookies",
      imageUrl: "/chocolate-chip-cookies.png",
    },
    {
      name: "Strawberry Gummies",
      category: "Gummies",
      price: 1.99,
      quantity: 100,
      description: "Sweet and chewy strawberry flavored gummies",
      imageUrl: "/strawberry-gummies.jpg",
    },
    {
      name: "Dark Chocolate Bar",
      category: "Chocolate",
      price: 4.99,
      quantity: 25,
      description: "Premium dark chocolate bar with 70% cocoa",
      imageUrl: "/dark-chocolate-bar.png",
    },
    {
      name: "Rainbow Lollipops",
      category: "Lollipops",
      price: 0.99,
      quantity: 200,
      description: "Colorful rainbow swirl lollipops",
      imageUrl: "/rainbow-lollipops.jpg",
    },
    {
      name: "Caramel Fudge",
      category: "Fudge",
      price: 3.49,
      quantity: 30,
      description: "Rich and creamy caramel fudge squares",
      imageUrl: "/caramel-fudge.jpg",
    },
    {
      name: "Sour Patch Kids",
      category: "Sour Candy",
      price: 2.49,
      quantity: 0, // Out of stock for testing
      description: "Sour then sweet chewy candy",
      imageUrl: "/sour-patch-kids.jpg",
    },
  ]

  for (const sweet of sweets) {
    await prisma.sweet.upsert({
      where: { name: sweet.name },
      update: {},
      create: sweet,
    })
  }

  console.log("✅ Database seeded successfully!")
  console.log(`👤 Admin user: admin@sweetshop.com / admin123`)
  console.log(`👤 Regular user: user@example.com / user123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
