# Fire Department Resource Management Platform

A comprehensive web-based platform for fire department operations, resource management, and emergency response coordination.

## 🚒 Features

### Core Modules

- **Dashboard** - Real-time operational overview with KPIs and metrics
- **GIS-based Asset Management** - Interactive maps with vehicle, hydrant, and station tracking
- **Personnel Management** - Directory, profiles, assignments, and scheduling
- **Incident Management** - Complete lifecycle from creation to closure with real-time tracking
- **Reports & Analytics** - Performance metrics, trends, and comprehensive reporting
- **Notifications** - Real-time alerts and communication system
- **Admin & Settings** - System configuration and user management

### Key Capabilities

- **Real-time Tracking** - GPS tracking of vehicles and personnel
- **Interactive Maps** - Leaflet-based mapping with multiple layers
- **Role-based Access** - CC Operators, Field Responders, and Admin roles
- **Mobile Responsive** - Optimized for both desktop and mobile devices
- **Comprehensive Reporting** - Daily, weekly, and monthly analytics
- **Asset Management** - Vehicles, hydrants, stations, and equipment tracking

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Maps**: Leaflet with React-Leaflet
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Yarn package manager

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fyre
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the following variables in `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/fire_department_db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard
│   ├── map/               # GIS mapping
│   ├── personnel/         # Personnel management
│   ├── incidents/         # Incident management
│   ├── reports/           # Analytics and reporting
│   ├── notifications/     # Notification center
│   ├── admin/             # Admin panel
│   └── assets/            # Asset management
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── map/              # Map-specific components
├── lib/                  # Utility functions and configurations
└── prisma/               # Database schema and migrations
```

## 🗄️ Database Schema

The platform uses a comprehensive PostgreSQL schema with the following main entities:

- **Users** - Authentication and user management
- **Personnel** - Fire department staff information
- **Stations** - Fire stations and facilities
- **Vehicles** - Apparatus and vehicles tracking
- **Hydrants** - Water sources and hydrant management
- **Incidents** - Emergency incidents and responses
- **Assignments** - Personnel and vehicle assignments
- **Evidence** - Photos, documents, and incident evidence
- **Notifications** - System notifications and alerts

## 🎯 User Roles

### CC Operator/Dispatcher
- Full operational control on desktop
- Create, assign, and close incidents
- Manage assets and personnel
- Real-time monitoring and dispatch

### Field Responder
- Mobile-optimized interface
- View assigned incidents
- Update status and location
- Upload photos and notes
- Receive dispatch notifications

### Admin
- System configuration
- User and role management
- Data management and backups
- Security settings

## 🗺️ GIS Features

- **Interactive Maps** - Real-time vehicle and personnel tracking
- **Layer Management** - Toggle visibility of different asset types
- **Proximity Tools** - Find nearest assets to incidents
- **Routing** - Turn-by-turn navigation to scenes
- **Coverage Analysis** - Station coverage and response areas

## 📊 Reporting & Analytics

- **Real-time KPIs** - Active incidents, response times, personnel status
- **Performance Metrics** - Station and personnel performance tracking
- **Trend Analysis** - Monthly and yearly incident trends
- **Export Capabilities** - PDF and Excel report generation
- **Custom Reports** - Configurable reporting periods and filters

## 🔔 Notifications

- **Real-time Alerts** - Instant dispatch and update notifications
- **Multiple Channels** - In-app, email, and SMS notifications
- **Priority Levels** - Critical, high, medium, and low priority alerts
- **Customizable Settings** - User-configurable notification preferences

## 📱 Mobile Responsiveness

- **Responsive Design** - Optimized for all screen sizes
- **Mobile Navigation** - Touch-friendly interface
- **Offline Capabilities** - Basic functionality without internet
- **Progressive Web App** - Installable on mobile devices

## 🔧 Development

### Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn type-check   # Run TypeScript checks
```

### Database Commands

```bash
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run database migrations
npx prisma generate        # Generate Prisma client
npx prisma db seed         # Seed database with sample data
```

## 🚀 Deployment

The platform is designed for deployment on modern cloud platforms:

1. **Database Setup** - Configure PostgreSQL database
2. **Environment Variables** - Set production environment variables
3. **Build** - Run `yarn build` to create production build
4. **Deploy** - Deploy to your preferred platform (Vercel, AWS, etc.)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Fire Department Resource Management Platform** - Streamlining emergency response operations through technology.