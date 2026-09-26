# Prisma (Project Manager App)

Next.js 14 application configured with TypeScript, Tailwind CSS, Supabase, and Prisma ORM.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Update `.env` with your Supabase credentials:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?schema=public"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?schema=public"
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

3. **Prisma ORM Migrations & Generation**:
   - Apply migrations to your Supabase Postgres database:
     ```bash
     npx prisma migrate deploy
     # or for development tracking:
     npx prisma migrate dev
     ```
   - Generate the Prisma Client:
     ```bash
     npx prisma generate
     ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
