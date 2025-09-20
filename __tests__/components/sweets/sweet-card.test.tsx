import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { SweetCard } from "@/components/sweets/sweet-card"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock dependencies
jest.mock("@/contexts/auth-context")
jest.mock("@/lib/api-client")
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe("SweetCard", () => {
  const mockSweet = {
    id: "sweet123",
    name: "Chocolate Chip Cookie",
    category: "Cookies",
    price: 2.99,
    quantity: 50,
    description: "Delicious homemade cookie",
    imageUrl: "/cookie.jpg",
  }

  const mockUser = {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    role: "USER" as const,
  }

  const mockOnUpdate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders sweet information correctly", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    })

    render(<SweetCard sweet={mockSweet} onUpdate={mockOnUpdate} />)

    expect(screen.getByText("Chocolate Chip Cookie")).toBeInTheDocument()
    expect(screen.getByText("Cookies")).toBeInTheDocument()
    expect(screen.getByText("$2.99")).toBeInTheDocument()
    expect(screen.getByText("50 in stock")).toBeInTheDocument()
    expect(screen.getByText("Delicious homemade cookie")).toBeInTheDocument()
  })

  it("shows purchase button for authenticated users", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    })

    render(<SweetCard sweet={mockSweet} onUpdate={mockOnUpdate} />)

    expect(screen.getByRole("button", { name: /buy for \$2\.99/i })).toBeInTheDocument()
  })

  it("shows sign in message for unauthenticated users", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    })

    render(<SweetCard sweet={mockSweet} onUpdate={mockOnUpdate} />)

    expect(screen.getByRole("button", { name: "Sign in to Purchase" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign in to Purchase" })).toBeDisabled()
  })

  it("shows out of stock state correctly", () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    })

    render(<SweetCard sweet={outOfStockSweet} onUpdate={mockOnUpdate} />)

    expect(screen.getByText("Out of Stock")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /out of stock/i })).toBeDisabled()
  })

  it("handles purchase successfully", async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    })

    mockApiClient.purchaseSweet.mockResolvedValue({
      data: { purchase: { id: "purchase123" } },
      message: "Purchase successful",
    })

    render(<SweetCard sweet={mockSweet} onUpdate={mockOnUpdate} />)

    const purchaseButton = screen.getByRole("button", { name: /buy for \$2\.99/i })
    fireEvent.click(purchaseButton)

    await waitFor(() => {
      expect(mockApiClient.purchaseSweet).toHaveBeenCalledWith("sweet123", 1)
      expect(mockOnUpdate).toHaveBeenCalled()
    })
  })

  it("handles purchase quantity changes", () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    })

    render(<SweetCard sweet={mockSweet} onUpdate={mockOnUpdate} />)

    const quantityInput = screen.getByDisplayValue("1")
    fireEvent.change(quantityInput, { target: { value: "3" } })

    expect(screen.getByRole("button", { name: /buy for \$8\.97/i })).toBeInTheDocument()
  })

  it("limits quantity to available stock", () => {
    const lowStockSweet = { ...mockSweet, quantity: 5 }

    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    })

    render(<SweetCard sweet={lowStockSweet} onUpdate={mockOnUpdate} />)

    const quantityInput = screen.getByDisplayValue("1")
    expect(quantityInput).toHaveAttribute("max", "5")
  })
})
