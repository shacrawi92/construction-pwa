<div align="center">

# 🦺 Construction SaaS · Field PWA

### A mobile-first app for foremen and field crews that keeps working when the signal drops

Log labor · request materials · follow estimations · get notified in real time

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Workbox-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

![Offline](https://img.shields.io/badge/offline-IndexedDB%20queue-F59E0B?style=flat-square)
![i18n](https://img.shields.io/badge/i18n-English%20%C2%B7%20Amharic%20%C2%B7%20Somali-F59E0B?style=flat-square)
![Realtime](https://img.shields.io/badge/realtime-Laravel%20Echo%20%2B%20Reverb-F59E0B?style=flat-square)

**Part of the Construction SaaS suite:**
[Backend API](https://github.com/shacrawi92/construction-backend) · [Admin panel](https://github.com/shacrawi92/construction-admin) · **Field PWA** (this repo)

</div>

---

## 🧭 Overview

Construction sites have poor connectivity and crews use phones, not laptops. This PWA installs from the browser, caches the app shell with a service worker, queues work offline in IndexedDB and syncs once the connection returns.

## 📱 Screens

| Screen | What the crew can do |
|---|---|
| 🏠 **Dashboard** | Today's stats and open requests |
| 📁 **Projects** | Project list, detail and the approved estimation |
| 👷 **Labor log** | Log hours and crew, review past entries |
| 📦 **Materials** | Browse the catalog and submit material requests |
| 🔔 **Notifications** | Live approval and rejection alerts |
| 🌐 **Marketing landing** | Public product page |

Role-based routing (`RoleGuard`) gives foremen and workers the right views. An offline banner tells the user when they are working from cache.

## 🛠 Tech stack

| Concern | Library |
|---|---|
| UI | React 19, Radix UI primitives, custom CSS, Lucide icons |
| Data | TanStack Query, Axios |
| Offline | `idb`, service worker via Workbox (`vite-plugin-pwa`) |
| Realtime | Laravel Echo + Pusher protocol (Reverb) |
| i18n | i18next with `en`, `am` and `so` locales |
| Dates | date-fns |

## 🚀 Getting started

```bash
git clone https://github.com/shacrawi92/construction-pwa.git
cd construction-pwa
npm install
npm run dev
```

Optional environment variables (`.env.local`):

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ADMIN_URL=http://localhost:8000
VITE_REVERB_APP_KEY=construction-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
```

Build for production with `npm run build`. The output in `dist/` is a static, installable PWA.

## 📁 Structure

```
src/
├── api/            # Axios client & endpoints
├── store/          # Offline sync queue (IndexedDB)
├── components/     # StatCard, RoleGuard, NotificationBell, OfflineBanner, LocaleSwitcher
├── layouts/        # AuthLayout, FieldLayout
├── pages/          # Dashboard, Projects, LaborLog, Materials, Login, MarketingLanding
└── i18n/locales/   # en.json · am.json · so.json
```

## 📄 License

All rights reserved.

<div align="center">

Built by **[@shacrawi92](https://github.com/shacrawi92)**

</div>
