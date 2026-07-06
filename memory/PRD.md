# String Creations 03 — Product Requirements

## Original Problem Statement
Build a website for string art selling. Brand: "String Creations 03". Contact channel: WhatsApp. User later requested support for adding photos, videos, price, size, colour, thread, About string art details and contact info.

## Architecture
- Frontend: React 19 + Tailwind + shadcn/ui + framer-motion + sonner (toasts). Routes: `/` (Landing) and `/admin` (CRUD).
- Backend: FastAPI + Motor (MongoDB). All routes under `/api`.
- Auth: shared-secret admin header `X-Admin-Token` (value in `backend/.env ADMIN_TOKEN`).
- Storage: MongoDB. Images stored as base64 data URLs on each product doc for MVP.

## Data Models
- Product: `id, title, description, price, size, colour, thread, category, images[], video_url, in_stock, featured, order, created_at`
- Settings (single doc `id="site"`): `brand_name, tagline, about_short, about_long, whatsapp, email, phone, instagram, facebook, youtube, location, hours, turnaround`

## Public Landing (`/`)
- Hero with logo image (customer asset), brand tagline, "Commission a Piece" WhatsApp CTA
- Marquee of service categories
- Works gallery — reads `/api/products`, filters by category, opens ProductDialog on click (photos, video embed, price, size, colour, thread, WhatsApp order CTA)
- About String Art section (uses `settings.about_long`)
- Process (01-04 steps)
- Commissions grid (each card = WhatsApp deep-link with prefilled category)
- About Studio + Testimonials
- Contact section with WhatsApp / Email / Phone / Instagram / Facebook / YouTube / Location / Hours
- Floating WhatsApp bubble (persistent)

## Admin Panel (`/admin`)
- Token login (localStorage `sc03_admin_token`)
- Products tab: list, create, edit, delete; upload multiple photos (converted to base64), YouTube/IG video URL, category, stock/featured/order
- Settings tab: brand, tagline, about copy (short + long), WhatsApp number, email, phone, socials, location, hours, turnaround

## Implemented (2026-12-06)
- Dark, metallic-themed landing (Cormorant Garamond + Great Vibes + Outfit)
- Full products & settings CRUD backend with admin-token auth
- Admin panel with product editor + settings editor
- Product dialog with image carousel + video embed
- WhatsApp deep-linking across every CTA using settings.whatsapp
- Testing agent: 100% backend + 100% frontend passing

## Backlog / Next
### P0
- Replace placeholder WhatsApp number `919999999999` with the real number via `/admin` → Settings.
### P1
- Sitemap.xml + Open Graph + favicon from logo for social sharing.
- Optimize image storage: switch from base64-in-Mongo to Cloudinary or S3 to keep DB lean when many photos are added.
- Testimonials editable from admin panel.
### P2
- Wishlist / “Save for later” with local storage.
- Instagram feed embed on landing.
- Stripe / Razorpay checkout (currently WhatsApp-only ordering).
- Multi-image cover carousel on product cards.
