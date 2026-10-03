# ShotMatch

ShotMatch is a marketplace web app that connects brands with photographers, stylists, and production teams. Users can post projects, create professional profiles, find suitable creatives through a matching process, and manage the booking and payment workflow.

## Project Overview

Ye project monorepo structure mein hai:

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB + Mongoose
- Authentication: JWT + cookies
- Real-time: Socket.IO
- Payment: Stripe
- File/media: Cloudinary
- API docs: Swagger

## Main Features

- User registration and login
- Brand and photographer profile management
- Project creation and management
- Matching service for suitable photographers/stylists
- JWT-based protected routes
- Dashboard screens for different user roles
- API health checks and Swagger docs
- MongoDB integration for persistent data

## Folder Structure

```bash
software_photograph/
├─ apps/
│  ├─ backend/
│  │  ├─ src/
│  │  ├─ .env.example
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ frontend/
│     ├─ src/
│     ├─ package.json
│     ├─ next.config.mjs
│     └─ tailwind.config.ts
├─ package.json
├─ README.md
└─ test-results/
```

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form + Zod
- Zustand

### Backend
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT
- Helmet + CORS + Cookie Parser
- Express Rate Limit
- Socket.IO
- Stripe
- Cloudinary
- Swagger

## Prerequisites

Aapke system mein ye cheezein honi chahiye:

- Node.js 18+
- npm 9+
- MongoDB running locally OR MongoDB Atlas connection string
- Git

## Installation

Root directory se commands run karein:

```bash
npm install
```

Backend env file create karna:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Windows PowerShell mein:

```powershell
Copy-Item apps/backend/.env.example apps/backend/.env
```

Ab `.env` file ko edit karke proper values set karein.

## Environment Variables

Backend `.env` file ka example is project mein available hai. Important variables:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shotmatch
JWT_SECRET=your_secure_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret
CLIENT_URL=http://localhost:3000
COOKIE_SECURE=false
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
SMTP_FROM=no-reply@shotmatch.com
UPLOAD_MAX_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Notes:
- `MONGO_URI` ke liye localhost MongoDB ya Atlas URI use karo.
- `CLIENT_URL` frontend ka URL hota hai.
- `PORT` default app config mein `8000` hai, lekin agar aap `.env` mein koi alag port set karte ho to wahi use hoga.
- For production, `COOKIE_SECURE=true` and HTTPS use karo.

## Run Process / How It Works

### 1. Root app starts
Root project ke `package.json` mein scripts define hain:

```json
"dev": "concurrently \"npm run dev --workspace backend\" \"npm run dev --workspace frontend\""
```

Iska matlab hai ke jab aap `npm run dev` run karte ho, to dono services ek sath start hote hain:
- backend API
- frontend Next.js app

### 2. Backend startup flow
Backend app ka entry point hai:

- `apps/backend/src/server.ts`

Server file `mongoose.connect(env.mongoUri)` ke through MongoDB se connect karta hai. Phir `app.listen(...)` ke through backend port par listen karta hai.

Main startup sequence:

```ts
await mongoose.connect(env.mongoUri);
app.listen(env.port, () => {
  console.log(`ShotMatch API listening on port ${env.port}`);
});
```

### 3. Express app setup
`apps/backend/src/app.ts` mein Express app configur hai:

- CORS enable
- Helmet security
- JSON body parsing
- Cookies parse
- Logging via Morgan
- Rate limiting
- Swagger docs at `/api/docs`
- Health endpoint at `/api/health`
- Route registration

Routes include:

- `/api/auth`
- `/api/projects`
- `/api/photographers`
- `/api/profile`

### 4. Frontend startup flow
Frontend app ka entry point hai Next.js app.

- Root page checks cookies for access token.
- Agar token milta hai to `/home` redirect hota hai.
- Warna `/login` page open hota hai.

User actions frontend se backend API ko hit karte hain, and backend auth/validation se process karta hai.

### 5. Request lifecycle
Typical flow is:

1. User frontend se form/login/project request bhejta hai.
2. Frontend API client request backend ke route par bhejta hai.
3. Express route controller ko call karta hai.
4. Controller service layer se business logic execute karta hai.
5. Mongoose model database se interaction karta hai.
6. Response frontend ko milta hai.
7. Frontend UI state update karta hai.

### 6. Auth flow
Project JWT-based auth use karta hai:

- User login
- Backend JWT token generate karta hai
- Token cookie ya headers me send hota hai
- Protected routes middleware token verify karti hai
- Authorized requests allow hoti hain

## Run Commands

At root:

```bash
npm run dev
```

This runs both backend and frontend together.

Individual services:

```bash
npm run dev:backend
npm run dev:frontend
```

Build commands:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Test:

```bash
npm run test
```

## Backend Commands

Inside `apps/backend`:

```bash
npm install
npm run dev
npm run build
npm run start
npm run test
```

## Frontend Commands

Inside `apps/frontend`:

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## Default Ports

- Backend: `http://localhost:8000` (default app port; change karna ho to `.env` mein `PORT` update karo)
- Frontend: `http://localhost:3000`
- Swagger API docs: `http://localhost:8000/api/docs`
- Health check: `http://localhost:8000/api/health`

## Common Development Workflow

1. Install dependencies
2. Create backend `.env` file
3. Start MongoDB service
4. Run `npm run dev`
5. Open frontend in browser
6. Use backend API docs for test endpoints
7. Make changes and run lint/test build before release

## Production Notes

For production deployment:

- Use secure env variables
- Set `NODE_ENV=production`
- Use MongoDB Atlas or managed MongoDB
- Use HTTPS and secure cookies
- Set Cloudinary, Stripe, and SMTP credentials properly
- Use reverse proxy / load balancer for deployment

## Troubleshooting

### MongoDB connection error
- Check `MONGO_URI` in backend `.env`
- Ensure MongoDB service is running
- Verify network access for Atlas

### Frontend not loading
- Confirm frontend dev server started on port 3000
- Check if backend is running and accessible

### JWT/auth issues
- Ensure JWT secret values are set correctly
- Keep cookie and CORS origin consistent
- Check `CLIENT_URL` and frontend/back-end URL alignment

## License

This project is a custom application and currently uses the repository default setup. You can add your preferred license later if needed.

## Summary

Yeh project ek full-stack marketplace app hai jisme frontend aur backend alag-alag services ke roop mein kaam karte hain. Root command `npm run dev` dono ko ek sath run karta hai, backend MongoDB se connect hota hai, aur frontend user-facing experience provide karta hai. Project ko samajhne ke liye sabse zaroori steps hain:

- dependencies install
- environment config
- MongoDB connection
- run `npm run dev`
- use frontend + backend together

Agar aap chaho, main next step mein is project ke liye ek aur detailed developer guide bana sakta hoon jisme har module (auth, projects, photographers, profile, matching) ki technical explanation bhi include ho. 
