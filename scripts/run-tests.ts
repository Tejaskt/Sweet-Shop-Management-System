import { execSync } from "child_process"

console.log("🧪 Running Sweet Shop Management System Test Suite")
console.log("=".repeat(60))

try {
  // Run all tests with coverage
  console.log("📊 Running tests with coverage...")
  execSync("npm run test:coverage", { stdio: "inherit" })

  console.log("\n✅ All tests completed successfully!")
  console.log("\n📋 Test Summary:")
  console.log("- Unit tests for authentication and validation logic")
  console.log("- API endpoint tests for auth and sweet management")
  console.log("- Component tests for UI functionality")
  console.log("- Integration tests for complete workflows")
} catch (error) {
  console.error("\n❌ Tests failed!")
  console.error(error)
  process.exit(1)
}
