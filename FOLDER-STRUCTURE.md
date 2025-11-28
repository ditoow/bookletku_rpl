# Folder Structure - bookletku_7
Updated: 29 November 2025

Clean Architecture with src/ directory

## Root Structure
```
bookletku_rpl7/
├── src/                    # Source code with clean architecture
│   ├── app/               # Next.js App Router
│   ├── features/          # Feature-based modules
│   ├── shared/            # Shared resources
│   └── core/              # Core domain logic
├── public/                # Static assets
├── .next/                 # Next.js build output
├── node_modules/          # Dependencies
└── config files           # tsconfig, next.config, etc.
```

## src/ Directory Structure

### src/app/
Next.js App Router with pages and layouts
```
app/
├── (main)/
│   └── page.tsx           # Main customer page
├── admin/
│   ├── login/
│   └── pages/
│       └── dashboard/
├── layout.tsx             # Root layout
└── globals.css            # Global styles
```

### src/features/
Feature-based modules (clean architecture)

#### features/menu/
Menu management feature
```
menu/
├── components/
│   ├── FeaturedMenu/
│   │   ├── index.tsx
│   │   ├── FeaturedHeader.tsx
│   │   ├── FeaturedItem.tsx
│   │   └── ScrollButtons.tsx
│   ├── CategoryMenu.tsx
│   ├── MenuSection.tsx
│   └── MenuDish.tsx
├── hooks/
│   └── useMenuData.ts
└── services/
    └── menuServices.ts
```

#### features/cart/
Cart and checkout feature
```
cart/
├── components/
│   ├── CartSidebar/
│   │   ├── index.tsx
│   │   ├── CartHeader.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── EmptyCart.tsx
│   ├── CartButton.tsx
│   ├── CartMobile.tsx
│   └── OrderConfirmation.tsx
└── hooks/
    ├── useCart.ts
    └── useCheckout.ts
```

#### features/layout/
Layout and UI components
```
layout/
└── components/
    ├── Header.tsx
    ├── StoreBanner.tsx
    └── Sidebar.tsx
```

#### features/admin/
Admin feature
```
admin/
├── components/
└── services/
    └── orderServices.ts
```

### src/shared/
Shared resources across features
```
shared/
├── components/
│   └── ui/                # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (11 components)
├── lib/
│   ├── supabase.ts
│   ├── categoryIcons.ts
│   └── utils.ts
└── types/
    ├── menu.types.ts
    ├── cart.types.ts
    └── order.types.ts
```

### src/core/
Core domain logic (for future expansion)
```
core/
├── entities/
├── interfaces/
└── constants/
```

## Path Aliases (tsconfig.json)
```json
{
  "@/*": ["./src/*"],
  "@/features/*": ["./src/features/*"],
  "@/shared/*": ["./src/shared/*"],
  "@/core/*": ["./src/core/*"]
}
```

## Key Changes from Previous Structure
- ✅ All code moved to `src/` directory
- ✅ Feature-based organization (menu, cart, layout, admin)
- ✅ Separation of concerns (components, hooks, services)
- ✅ Shared resources centralized in `src/shared/`
- ✅ Large files split into modular components (max 200 lines)
- ✅ Type definitions centralized
- ✅ Clean architecture principles applied

## Component Splitting Examples
- **FeaturedMenu**: 256 lines → 4 files (~60-120 lines each)
- **CartSidebar**: 257 lines → 5 files (~40-120 lines each)

## Notes
- Uses Next.js 14+ App Router
- TypeScript throughout
- Modular and maintainable structure
- Easy to scale and add new features
