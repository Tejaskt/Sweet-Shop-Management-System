# Sweet Shop Management System

A modern, full-stack sweet shop management system built with Next.js, TypeScript, and Prisma. This application provides user authentication, sweet catalog browsing, purchase functionality, and comprehensive admin management features.

## 🍭 Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Sweet Catalog**: Browse and search through available sweets
- **Advanced Search**: Filter by name, category, and price range
- **Purchase System**: Buy sweets with quantity selection and stock validation
- **Responsive Design**: Modern, mobile-first interface

### Admin Features
- **Inventory Management**: Full CRUD operations for sweets
- **Stock Management**: Restock functionality with quantity tracking
- **Analytics Dashboard**: View inventory statistics and low stock alerts
- **User Management**: Role-based access control

### Technical Features
- **RESTful API**: Comprehensive backend with proper error handling
- **Database Integration**: SQLite with Prisma ORM
- **Test Coverage**: Comprehensive test suite with Jest and React Testing Library
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tejaskt/Sweet-Shop-Management-System.git
   cd sweet-shop-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Accounts

The system comes with pre-configured demo accounts:

- **Admin Account**: 
  - Email: `admin@sweetshop.com`
  - Password: `admin123`
  - Access: Full admin privileges

- **User Account**: 
  - Email: `user@example.com`
  - Password: `user123`
  - Access: Standard user features

## 📁 Project Structure

```
sweet-shop-management/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── sweets/        # Sweet management endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── sweets/            # Sweet-related components
│   ├── admin/             # Admin-specific components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database connection
│   ├── validations.ts     # Zod validation schemas
│   └── api-client.ts      # API client
├── prisma/                # Database schema and migrations
├── scripts/               # Utility scripts
├── __tests__/             # Test files
└── public/                # Static assets
```

## 🛠 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
\`\`\`

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

### Sweet Management Endpoints

#### GET `/api/sweets`
Retrieve all available sweets.

**Headers:** `Authorization: Bearer <token>`

**Response:**
\`\`\`json
{
  "sweets": [
    {
      "id": "sweet_id",
      "name": "Chocolate Chip Cookie",
      "category": "Cookies",
      "price": 2.99,
      "quantity": 50,
      "description": "Delicious homemade cookie",
      "imageUrl": "/cookie.jpg"
    }
  ]
}
\`\`\`

#### GET `/api/sweets/search`
Search and filter sweets.

**Query Parameters:**
- `name`: Filter by sweet name
- `category`: Filter by category
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter

#### POST `/api/sweets` (Admin Only)
Create a new sweet.

**Request Body:**
\`\`\`json
{
  "name": "New Sweet",
  "category": "Candy",
  "price": 1.99,
  "quantity": 100,
  "description": "Optional description",
  "imageUrl": "Optional image URL"
}
\`\`\`

#### PUT `/api/sweets/:id` (Admin Only)
Update an existing sweet.

#### DELETE `/api/sweets/:id` (Admin Only)
Delete a sweet from inventory.

#### POST `/api/sweets/:id/purchase`
Purchase a sweet.

**Request Body:**
\`\`\`json
{
  "quantity": 2
}
\`\`\`

#### POST `/api/sweets/:id/restock` (Admin Only)
Restock a sweet.

**Request Body:**
\`\`\`json
{
  "quantity": 50
}
\`\`\`

## 🧪 Testing

The project includes comprehensive test coverage:

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
\`\`\`

### Test Categories

1. **Unit Tests**: Core utilities and validation logic
2. **API Tests**: Backend endpoint functionality
3. **Component Tests**: React component behavior
4. **Integration Tests**: End-to-end workflows

### Test Coverage Areas

- Authentication flow (registration, login, JWT handling)
- Sweet management (CRUD operations, search, filtering)
- Purchase system (stock validation, transaction handling)
- Admin functionality (inventory management, restocking)
- UI components (forms, cards, navigation)

## 🎨 Design System

The application uses a cohesive design system with:

- **Color Palette**: Warm coral/orange primary colors with neutral grays
- **Typography**: Geist Sans for headings, system fonts for body text
- **Components**: Consistent UI components built with Radix UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run test suite
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

### Environment Variables

Create a `.env.local` file for local development:

\`\`\`env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change in production)
JWT_SECRET="your-secret-key-here"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

### Manual Deployment

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set up production database**
   - Configure production database URL
   - Run migrations: `npm run db:migrate`
   - Seed data: `npm run db:seed`

3. **Start production server**
   \`\`\`bash
   npm start
   \`\`\`

## 🤖 My AI Usage

This project was developed with extensive AI assistance to demonstrate modern development workflows and best practices.

### AI Tools Used

- **v0 by Vercel**: Primary development assistant for full-stack application development
- **GitHub Copilot**: Code completion and boilerplate generation
- **ChatGPT**: Architecture planning and problem-solving discussions

### How AI Was Used

1. **Project Architecture**: AI helped design the overall system architecture, including database schema, API structure, and component hierarchy.

2. **Code Generation**: AI generated significant portions of the codebase, including:
   - API routes with proper error handling and validation
   - React components with TypeScript interfaces
   - Database models and relationships
   - Authentication and authorization logic
   - Test suites with comprehensive coverage

3. **Best Practices Implementation**: AI ensured adherence to:
   - RESTful API design principles
   - React and Next.js best practices
   - TypeScript type safety
   - Test-driven development (TDD) patterns
   - Accessibility standards

4. **Problem Solving**: AI assisted with:
   - Debugging complex authentication flows
   - Optimizing database queries and transactions
   - Implementing responsive design patterns
   - Creating comprehensive error handling

### AI Impact on Workflow

The use of AI tools significantly accelerated development while maintaining high code quality:

- **Speed**: Reduced development time by approximately 60-70%
- **Quality**: AI helped implement best practices and catch potential issues early
- **Learning**: AI explanations helped understand complex concepts and patterns
- **Testing**: AI generated comprehensive test cases covering edge cases
- **Documentation**: AI assisted in creating detailed documentation and comments

### Reflection

AI tools proved invaluable for rapid prototyping and implementation while maintaining professional standards. The combination of AI assistance with human oversight and decision-making created an efficient development workflow that produced a robust, well-tested application.

The key to successful AI collaboration was:
- Clear problem definition and requirements
- Iterative refinement of AI-generated code
- Human review and validation of all AI suggestions
- Integration of AI outputs with domain knowledge and business logic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
