# DCLM Church — Frontend

The public-facing website for Deeper Christian Life Ministry (DCLM), built with Next.js and Tailwind CSS. It fetches content from a NestJS backend API and displays sermons, events, announcements, gallery, and church information.

**Live site:** [https://dclm-frontend.vercel.app](https://dclm-frontend.vercel.app)

---

## Tech stack

- **Framework** — Next.js 16 (App Router)
- **Styling** — Tailwind CSS
- **Language** — TypeScript
- **Deployment** — Vercel

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, service times, quick links |
| About | `/about` | Church history, vision, mission |
| Sermons | `/sermons` | List of published sermons |
| Sermon detail | `/sermons/:id` | Single sermon with audio/video |
| Events | `/events` | Upcoming events and programs |
| Announcements | `/announcements` | Published announcements |
| Gallery | `/gallery` | Photo and video albums |
| Contact | `/contact` | Church contact information |

---

## Project structure

```
src/
├── app/
│   ├── about/
│   ├── announcements/
│   ├── contact/
│   ├── events/
│   ├── gallery/
│   ├── sermons/
│   │   └── [id]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
└── lib/
    └── api.ts
```

---

## Getting started

### Prerequisites

- Node.js 20+
- npm
- DCLM backend running (see backend README)

### Installation

```bash
# Clone the repository
git clone https://github.com/SK-B99/dclm-frontend.git
cd dclm-frontend

# Install dependencies
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.dev
```

### Running locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Deployment

The frontend is deployed on **Vercel** and connected to the GitHub repository. Every push to the `main` branch triggers an automatic deployment.

### Environment variables on Vercel

Set the following in your Vercel project settings under **Settings → Environment Variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Your backend API URL |

---

## Backend

The frontend consumes the DCLM Church NestJS backend API. All data fetching is done server-side via the functions in `src/lib/api.ts`.

**API endpoints used:**

| Endpoint | Description |
|----------|-------------|
| `GET /sermons` | Fetch published sermons |
| `GET /sermons/:id` | Fetch single sermon |
| `GET /events` | Fetch upcoming events |
| `GET /announcements` | Fetch published announcements |
| `GET /gallery/albums` | Fetch gallery albums |
| `GET /church-profile` | Fetch church info |

---

## License

MIT
