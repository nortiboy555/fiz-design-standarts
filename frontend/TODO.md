# FIZ Creative Hub - TODO List

## Ratings Summary

| Category | Rating | Status |
|----------|--------|--------|
| Security | 3/10 | CRITICAL |
| Authentication | 2/10 | CRITICAL |
| API Protection | 8/10 | Good |
| Input Validation | 4/10 | Poor |
| Code Quality | 6/10 | Moderate |
| TypeScript Usage | 7/10 | Good |
| Error Handling | 4/10 | Poor |
| UI/UX Design | 7/10 | Good |
| Responsive Design | 8/10 | Good |
| Loading States | 8/10 | Good |
| Accessibility | 5/10 | Moderate |
| Performance | 5/10 | Moderate |
| User Feedback | 3/10 | Poor |

**Overall: 5.4/10**

---

## CRITICAL - Must Fix Immediately

### 1. API Keys Exposed in Git
- [ ] Revoke ALL API keys (Gemini, Figma, Remove.bg, Blob) - ROTATE WHEN READY
- [ ] Add `.env.local` to `.gitignore`
- [ ] Remove `.env.local` from git history
- [x] Move ALL secrets to Vercel Dashboard - DONE
  - APP_PASSWORD ✓
  - APP_MODE=PUBLIC ✓
  - GEMINI_API_KEY ✓
  - FIGMA_ACCESS_TOKEN ✓
  - BLOB_READ_WRITE_TOKEN ✓
  - REMOVEBG_API_KEY ✓

### 2. Weak Authentication System - FIXED
- [x] Replace `Math.random()` with `crypto.randomBytes()`
- [x] Use HMAC-SHA256 for token signing (instead of base64)
- [x] Use `crypto.timingSafeEqual()` for password comparison (prevents timing attacks)
- [x] Remove `NEXT_PUBLIC_APP_PASSWORD` (was exposing to client)
- [x] Add rate limiting on `/api/auth` (5 attempts per 15 min, then blocked)
- [ ] Consider replacing with NextAuth.js or Clerk (optional, for user accounts)

### 3. SSRF Vulnerability in `/api/upload-url` - FIXED
- [x] Add URL validation (only allow http/https)
- [x] Block internal IPs (localhost, 127.x, 192.168.x, 10.x, 172.16-31.x)
- [x] Block AWS metadata endpoint (169.254.169.254)
- [x] Add request timeout (10 seconds)
- [x] Same fix applied to `/api/gemini/generate` for referenceImageUrl
- [x] Created `/src/lib/url-validator.ts` with `safeFetch()` utility
- [x] APP_MODE env: LOCAL (dev) = no restrictions, PUBLIC (prod) = SSRF protection
- [x] Added APP_MODE=PUBLIC to Vercel env

---

## HIGH Priority - Should Fix

### 4. File Upload Security
- [ ] Add file type validation (only image/png, image/jpeg, image/webp)
- [ ] Add file size limit (max 10MB)
- [ ] Sanitize filenames (remove path traversal characters)
- [ ] Consider switching Blob access from "public" to "private"

### 5. Input Validation
- [ ] Add Zod schema validation to all POST endpoints
- [ ] Add text length limits to `/api/copy/check`
- [ ] Validate Figma URLs properly in `/api/figma/parse`

### 6. Error Handling
- [ ] Add try/catch to all API calls in pages
- [ ] Add error UI states (not just loading)
- [ ] Fix silent error swallowing in `logout-button.tsx`
- [ ] Add global Error Boundary component

### 7. Rate Limiting
- [ ] Install `@upstash/ratelimit`
- [ ] Add rate limits to expensive endpoints (gemini, figma, remove-bg)
- [ ] Limit: 100 requests per hour per IP

---

## MEDIUM Priority - Should Improve

### 8. User Feedback
- [ ] Install toast library (Sonner recommended)
- [ ] Add toast for clipboard copy success
- [ ] Add toast for image generation success/failure
- [ ] Add toast for file upload success
- [ ] Replace `alert()` calls with toasts
- [ ] Add confirmation dialog for "Reset All Checkboxes"

### 9. Security Headers
- [ ] Add X-Content-Type-Options: nosniff
- [ ] Add X-Frame-Options: DENY
- [ ] Add X-XSS-Protection: 1; mode=block
- [ ] Add Referrer-Policy: strict-origin-when-cross-origin

### 10. Accessibility
- [ ] Add aria-labels to carousel buttons
- [ ] Add aria-labels to language toggle buttons
- [ ] Add skip-to-main-content link
- [ ] Check color contrast ratios

---

## LOW Priority - Nice to Have

### 11. Code Quality
- [ ] Extract LanguageToggle component (duplicated in headlines, copylab)
- [ ] Create useClipboard hook (duplicated logic)
- [ ] Fix bare catch blocks - use `catch (error: unknown)`
- [ ] Group related useState calls in preview page

### 12. Performance
- [ ] Refactor preview page state (40+ useState -> useReducer)
- [ ] Replace `<img>` with Next.js `<Image>` component
- [ ] Add React.memo to heavy list components
- [ ] Consider virtualizing large tables (testplanner)

### 13. Caching
- [ ] Add localStorage caching for reference data
- [ ] Add Cache-Control headers to static API responses
- [ ] Consider SWR or React Query for data fetching

---

## Implementation Timeline

### Week 1 - Security (CRITICAL)
| Task | Effort | Done |
|------|--------|------|
| Revoke & rotate ALL API keys | 1 hour | [ ] |
| Add `.env.local` to `.gitignore` | 5 min | [ ] |
| Move secrets to Vercel Dashboard | 30 min | [ ] |
| Fix SSRF vulnerability | 2 hours | [ ] |
| Add file upload validation | 2 hours | [ ] |

### Week 2 - Auth & Input
| Task | Effort | Done |
|------|--------|------|
| Implement proper auth (NextAuth.js) | 4-8 hours | [ ] |
| Add rate limiting (Upstash) | 2 hours | [ ] |
| Add input validation (Zod) | 3 hours | [ ] |

### Week 3 - UX & Error Handling
| Task | Effort | Done |
|------|--------|------|
| Add toast notifications (Sonner) | 2 hours | [ ] |
| Add error boundaries | 2 hours | [ ] |
| Add proper error states to all pages | 3 hours | [ ] |

### Week 4 - Performance & Polish
| Task | Effort | Done |
|------|--------|------|
| Refactor Preview page state | 4 hours | [ ] |
| Add Next.js Image optimization | 2 hours | [ ] |
| Add aria-labels for accessibility | 2 hours | [ ] |
| Extract reusable components | 2 hours | [ ] |

---

## Quick Wins (Today)
- [ ] Add `.env.local` to `.gitignore` (1 min)
- [ ] Add security headers in `next.config.ts` (10 min)
- [ ] Install Sonner toast library (15 min)
- [ ] Add file size limit to upload (15 min)

---

*Generated: 2026-02-04*
*Last Review: Security Audit + Code Quality + UI/UX*
