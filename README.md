This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Option 1: Using Deployment Scripts
```bash
# Via npm script
npm run deploy

# Or using the PowerShell script (Windows)
.\deploy.ps1

# Or bash script (Linux/macOS)
./deploy.sh
```

### Option 2: Import from Git into Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import the `AI-Agent-Travel-Guide-UI` repository.
3. Under **Environment Variables**, add:
   - `BACKEND_URL`: URL of your deployed FastAPI backend (e.g., `https://your-backend.railway.app`)
4. Click **Deploy**.

### Option 3: GitHub Actions CI/CD
A GitHub workflow is provided at `.github/workflows/deploy.yml`. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` to your GitHub repo secrets to deploy automatically on push to `main`.
