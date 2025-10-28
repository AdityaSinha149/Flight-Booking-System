This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Local environment
-----------------

This project reads environment variables at runtime from `process.env`. For local development create a `my-app/.env.local` file (already added with example values) and keep secrets out of version control. There's also `my-app/.env.example` with placeholders you can copy.

Make sure `.env.local` is listed in your global or repository `.gitignore` so you don't accidentally commit secrets.

Using Supabase (optional)
------------------------

You can run this project using Supabase-managed Postgres. Steps:

1. Create a Supabase project at https://app.supabase.com.
2. In the Supabase dashboard go to `SQL` → `New query` and paste the SQL from `my-app/Database/create_tables_supabase.sql`. Run it to create tables.
3. Copy your `SUPABASE_URL` and `anon` key from Project Settings → API and paste them into `my-app/.env.local` (or copy `.env.supabase.example` to a safe `.env` file and edit).
4. If you want the app server to connect to Postgres directly, copy the `Connection string` (DATABASE_URL) from Supabase Project Settings → Database and set `DATABASE_URL` in `my-app/.env.local`.
5. Start the dev server:

```bash
cd my-app
npm install
npm run dev
```

6. Use Supabase SQL editor to re-run or modify schema, and Supabase dashboard to inspect rows.

