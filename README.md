# Bookletku - Kelompok 3 - Digital Menu Ordering System
bookletku.vercel.app

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)

**Bookletku** adalah aplikasi web modern untuk digital menu ordering system dengan fitur customer interface dan admin panel. Dibangun dengan clean architecture .

---

### Anggota 
- Ghifari Wira Andanito - **A11.2024.15775** 
- Damia Balqis Setyodhiyauddin - **A11.2024.15803** 
- Onalla Aldeanuva - **A11.2024.15952** 
- Muhamad Aris Setiawan - **A11.2024.15984** 


## Features

### Customer Features
- **Digital Menu Browsing** - Browse menu dengan kategori dan search
- **Shopping Cart** - Add to cart dengan quantity management
- **Featured Menu Carousel** - Horizontal scrollable popular items
- **Category Filtering** - Filter menu by category
- **Search Function** - Real-time search menu items
- **Order Checkout** - WhatsApp integration untuk order confirmation
- **Responsive Design** - Mobile-first, desktop optimized
- **Dual Theme** - Minimalist & Colorful theme toggle
- **Multi-language** - Indonesian & English support

### Admin Features
- **Dashboard Analytics** - Revenue charts, statistics, trends
- **Product Management** - CRUD operations untuk menu items
- **Order Tracking** - Monitor orders dan revenue
- **Category Analytics** - Pie chart category distribution
- **Cart Tracking** - Area chart cart additions trends
- **QR Code Generator** - Generate QR code untuk menu access
- **Glassmorphism UI** - Modern, premium admin interface
- **Authentication** - Secure admin login

---


## Quick Start

### Prerequisites
- **Node.js** 18+ atau 20+
- **npm** atau **yarn** atau **pnpm**
- **Supabase Account** (untuk database)

### Installation

**1. Clone repository**
```bash
git clone <repository-url>
cd bookletku_rpl7
```

**2. Install dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

**3. Setup Environment Variables**

Create `.env` file di root folder:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4. Setup Database**

Buat tables di Supabase dengan schema:
- `menu` - Menu items 
- `orders` - Orders 
- `order_items` - Order items 
- `cart_tracking` - Cart tracking analytics

**5. Run Development Server**
```bash
npm run dev
```

**6. Open Application**
- Customer Interface: [http://localhost:3000](http://localhost:3000)
- Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server di port 3000 (dengan network access) |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint untuk code quality check |

---

## Architecture

### Clean Architecture + Feature-Based Organization

```
src/
├── app/              # Next.js App Router (pages & layouts)
├── features/         # Feature modules (menu, cart, admin)
│   ├── main/         # Customer features
│   └── admin/        # Admin features
└── shared/           # Shared components, lib, types
    ├── components/   # UI components (shadcn/ui)
    ├── lib/          # Utilities & supabase client
    └── types/        # TypeScript type definitions
```

**Benefits:**
- Separation of concerns
- Easy to maintain & scale
- Clear code organization
- Reusable components
- Type-safe dengan TypeScript

**Detailed Structure**: Lihat [FOLDER-STRUCTURE.md](./FOLDER-STRUCTURE.md)

---

## Tech Stack

### **Frontend Framework**
- **Next.js 16** - React framework dengan App Router
- **React 19.2** - UI library
- **TypeScript 5** - Type safety

### **Styling**
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Icon library
- **tw-animate-css** - Tailwind animations

### **Backend & Database**
- **Supabase** - PostgreSQL database & authentication
- **@supabase/supabase-js** - Supabase client

### **Charts & Visualization**
- **Recharts** - Chart library untuk analytics
- **react-qr-code** - QR code generation

### **UI Libraries**
- **Radix UI** - Headless UI primitives
- **@dnd-kit** - Drag & drop functionality (future use)

---

## Application Structure

### Customer Interface (`/`)
```
┌─────────────────────────────┐
│   Header (Search, Theme)    │
├─────────────────────────────┤
│   Store Banner (Stats)      │
├─────────────────────────────┤
│   Featured Menu Carousel    │
├─────────────────────────────┤
│   Category Filter Pills     │
├─────────────────────────────┤
│   Menu Grid                 │  ← Main Content
│   (Menu Items Cards)        │
└─────────────────────────────┘

┌──────────────┐
│ Cart Sidebar │  ← Desktop
│ (Sticky)     │
└──────────────┘

┌───────────────────────┐
│  Cart Bottom Sheet   │  ← Mobile
└───────────────────────┘
```

### Admin Panel (`/admin`)
```
┌────────────┬──────────────────────┐
│            │   Dashboard          │
│  Sidebar   │   - Stats Cards      │
│  Menu      │   - Revenue Chart    │
│            │   - Category Chart   │
│  - Login   │                      │
│  - Dash    ├──────────────────────┤
│  - Product │   Product Management │
│  - QR      │   - Product Table    │
│            │   - Add/Edit/Delete  │
│            ├──────────────────────┤
│            │   QR Code Generator  │
└────────────┴──────────────────────┘
```

---

## Data Flow

### Customer Order Flow
```
User Browse Menu
    ↓
Add to Cart (useCart hook)
    ↓
Modify Quantities
    ↓
Click Checkout (useCheckout hook)
    ↓
Confirm Order Dialog
    ↓
Submit to Database (Supabase)
    ↓
WhatsApp Redirect (Order confirmation)
```

### Admin Product Management
```
Admin Login
    ↓
Dashboard View (statsServices)
    ↓
Product Management
    ↓
CRUD Operations (productService)
    ↓
Update Database (Supabase)
    ↓
Real-time Update di Customer Interface
```

---

## Key Features Deep Dive

### Shopping Cart System
- **Desktop**: Sticky sidebar dengan glassmorphism
- **Mobile**: Bottom sheet dengan smooth animations
- **Features**: Quantity controls, item removal, price calculation
- **Persistence**: State management dengan React hooks

### Admin Dashboard
- **Stats Cards**: Revenue, total orders, products, pending orders
- **Charts**: 
  - Revenue by category (Bar chart)
  - Category distribution (Pie chart)
  - Cart additions trends (Area chart)
- **Real-time Data**: Fetch dari Supabase dengan auto-refresh

### Theme System
- **Minimalist**: Cream background (`#DCD7C9`), clean aesthetics
- **Colorful**: Gradient purple-pink background, vibrant colors
- **Toggle**: Seamless theme switching dengan transition effects

### Multi-language Support
- **Languages**: Indonesian (ID) & English (EN)
- **Scope**: UI labels, buttons, messages
- **Implementation**: Language state management dengan conditional rendering

---

## Environment Variables

Create `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: WhatsApp Business API
NEXT_PUBLIC_WHATSAPP_NUMBER=+62xxxxxxxxxx
```

---

## Database Schema

### `menu` Table
```sql
CREATE TABLE menu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `orders` Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `order_items` Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  menu_id UUID REFERENCES menu(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);
```

### `cart_tracking` Table
```sql
CREATE TABLE cart_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID REFERENCES menu(id),
  added_at TIMESTAMP DEFAULT NOW()
);
```

---


## Key Patterns

### Custom Hooks
```typescript
// Cart management
const { cartItems, handleAdd, totalQuantity } = useCart();

// Menu data fetching
const { menuDishes, loading, categories } = useMenuData(search, category);

// Checkout process
const { handleCheckout, isProcessing } = useCheckout();

// Product CRUD
const { products, createProduct, updateProduct } = useProduct();
```

### Service Layer
```typescript
// Menu services
const items = await fetchMenuItems();
const featured = await fetchFeaturedItems();

// Product services
await createProduct(productData);
await updateProduct(id, updates);

// Stats services
const stats = await getStats();
const revenue = await getRevenue();
```

---

---

## Support

Untuk pertanyaan atau issues:
- Check documentation di `FOLDER-STRUCTURE.md`

---

## Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Excellent hosting platform
- **Supabase** - Powerful backend platform
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Fantastic utility-first CSS

---

<div align="center">

**Built with Next.js, TypeScript, and Modern Web Technologies**


</div>
