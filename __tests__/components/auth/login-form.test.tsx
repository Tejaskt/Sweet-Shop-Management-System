import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"
import jest from "jest" // Import jest to declare the variable

// Mock the auth context
jest.mock("@/contexts/auth-context", () => ({
  useAuth: jest.fn(),
}))

// Mock the toast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe("LoginForm", () => {
  const mockLogin = jest.fn()
  const mockOnToggleMode = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
    })
  })

  it("renders login form correctly", () => {
    render(<LoginForm onToggleMode={mockOnToggleMode} />)

    expect(screen.getByText("Welcome Back")).toBeInTheDocument()
    expect(screen.getByText("Sign in to your Sweet Shop account")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
  })

  it("shows demo account information", () => {
    render(<LoginForm onToggleMode={mockOnToggleMode} />)

    expect(screen.getByText("Demo accounts:")).toBeInTheDocument()
    expect(screen.getByText("Admin: admin@sweetshop.com / admin123")).toBeInTheDocument()
    expect(screen.getByText("User: user@example.com / user123")).toBeInTheDocument()
  })

  it("handles form submission with valid data", async () => {
    mockLogin.mockResolvedValue({ success: true })

    render(<LoginForm onToggleMode={mockOnToggleMode} />)

    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const submitButton = screen.getByRole("button", { name: "Sign In" })

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123")
    })
  })

  it("displays error message on login failure", async () => {
    mockLogin.mockResolvedValue({ success: false, error: "Invalid credentials" })

    render(<LoginForm onToggleMode={mockOnToggleMode} />)

    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const submitButton = screen.getByRole("button", { name: "Sign In" })

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    })
  })

  it("shows loading state during submission", async () => {
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100)))

    render(<LoginForm onToggleMode={mockOnToggleMode} />)

    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const submitButton = screen.getByRole("button", { name: "Sign In" })

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it("calls onToggleMode when sign up link is clicked", () => {
    render(<LoginForm onToggleMode={mockOnToggleMode} />)

    const signUpLink = screen.getByText("Sign up")
    fireEvent.click(signUpLink)

    expect(mockOnToggleMode).toHaveBeenCalled()
  })

  it("requires email and password fields", () => {
    render(<LoginForm onToggleMode={mockOnToggleMode} />)

    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")

    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })
})
