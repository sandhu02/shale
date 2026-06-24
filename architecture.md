ecommerce-store/
├── app/
│   ├── layout.tsx                     # Root layout (header/footer for public)
│   ├── page.tsx                       # Home page (public)
│   ├── products/
│   │   └── [slug]/page.tsx            # Product detail page (public)
│   ├── categories/
│   │   └── [slug]/page.tsx            # Category listing page (public)
│   │
│   ├── admin/
│   │   ├── layout.tsx                 # Admin layout (checks auth, includes sidebar)
│   │   ├── page.tsx                   # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx               # Login form (public, but inside /admin)
│   │   ├── items/
│   │   │   ├── page.tsx               # List all items
│   │   │   ├── new/page.tsx           # Add new item
│   │   │   └── [id]/edit/page.tsx     # Edit item
│   │   └── categories/
│   │       ├── page.tsx               # List all categories
│   │       ├── new/page.tsx           # Add category
│   │       └── [id]/edit/page.tsx     # Edit category
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts         # POST – verify credentials & set cookie
│       │   └── logout/route.ts        # POST – clear cookie
│       ├── items/
│       │   ├── route.ts               # GET (list), POST (create) – protected
│       │   └── [id]/route.ts          # GET, PUT, DELETE – protected
│       └── categories/
│           ├── route.ts
│           └── [id]/route.ts
│
├── components/                        # Reusable UI components
│   ├── ui/                            # Buttons, inputs, cards, etc.
│   ├── product/                       # ProductCard, ProductGrid
│   ├── category/                      # CategoryBadge, etc.
│   ├── admin/                         # AdminForm, AdminTable, etc.
│   └── layouts/                       # Header, Footer, AdminSidebar
│
├── lib/                               # Business logic & utilities
│   ├── db.ts                          # MongoDB connection (cached)
│   ├── auth.ts                        # signToken, verifyToken, password check
│   ├── validators.ts                  # Zod schemas for item/category input
│   └── utils.ts                       # slugify, formatPrice, etc.
│
├── models/                            # Mongoose models
│   ├── Item.ts
│   └── Category.ts
│
├── middleware.ts                      # Next.js middleware – protects /admin routes
├── .env.local                         # MONGODB_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH
├── package.json
└── tsconfig.json