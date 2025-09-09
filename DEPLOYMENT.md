# 🚀 Fire Department Platform - Free Deployment Guide

## 🆓 Free Services Used

- **GitHub** - Repository hosting
- **Vercel** - Application hosting (unlimited personal projects)
- **Supabase** - PostgreSQL database (500MB free)
- **Google Maps** - Maps API ($3,250/month free credit)

## 📋 Deployment Steps

### 1. GitHub Setup
```bash
# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/fyre-fire-department.git
git branch -M main
git push -u origin main
```

### 2. Supabase Database Setup
1. Go to [supabase.com](https://supabase.com)
2. Create new project: `fyre-fire-department`
3. Copy database URL from Settings → Database
4. Run migrations in Supabase SQL editor:
```sql
-- Copy contents from prisma/migrations/20250908230304_init/migration.sql
-- Copy contents from prisma/migrations/20250909123228_add_password_field/migration.sql
```

### 3. Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Add environment variables:
   - `DATABASE_URL` - Your Supabase connection string
   - `NEXTAUTH_URL` - Your Vercel app URL
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps API key

### 4. Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Set up billing (required even for free tier)
4. Add domain restrictions:
   - `your-app.vercel.app/*`
   - `localhost:3000/*`

## 🔧 Environment Variables

### Local Development (.env)
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### Production (Vercel)
- Set the same variables in Vercel dashboard
- Use your Vercel app URL for NEXTAUTH_URL

## 🎯 Features Included

- ✅ User authentication (login/signup/logout)
- ✅ Role-based access control
- ✅ Interactive maps (Google Maps + OpenStreetMap fallback)
- ✅ Real-time vehicle tracking
- ✅ Incident management
- ✅ Personnel management
- ✅ Station management
- ✅ Responsive design
- ✅ Database integration

## 💰 Cost Breakdown

- **GitHub**: Free
- **Vercel**: Free (unlimited personal projects)
- **Supabase**: Free (500MB database, 50k rows)
- **Google Maps**: Free ($3,250/month credit)
- **Total Monthly Cost**: $0

## 🚨 Important Notes

1. **Database**: Supabase free tier includes 500MB storage
2. **Maps**: Google Maps free tier includes $3,250/month credit
3. **Hosting**: Vercel free tier includes unlimited personal projects
4. **Custom Domain**: Can be added for free on Vercel

## 🔒 Security

- Passwords are hashed with bcryptjs
- JWT tokens for session management
- Environment variables for sensitive data
- HTTPS enabled by default on Vercel
