Developer Name : Vishal kumawat <br>
role : full-stack developer <br>
Email : vishalskumawat9@gmail.com <br>
<br>
<br>
Developer Name : Dinesh kumawat <br>
role : full-stack developer <br>
Email : dineshkumawatdtr123@gmail.com 
<br>
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

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# ElderCare Platform - Full-Stack NGO Elder Care Solution

A comprehensive elder care platform built with modern technologies to provide compassionate care services for senior citizens in India.

## 🌟 Features

### For Elderly Users
- **Mobile OTP Login** - Easy authentication using Indian mobile numbers
- **Service Requests** - Book doctor visits, nurse care, physiotherapy, and more
- **Emergency SOS** - One-click emergency assistance
- **Real-time Tracking** - Monitor service status and staff location
- **WhatsApp Integration** - Receive updates via WhatsApp
- **Secure Payments** - Razorpay integration for hassle-free payments

### For Administrators
- **Dashboard Analytics** - Comprehensive insights and metrics
- **User Management** - Manage elderly users and their profiles
- **Staff Assignment** - Assign and manage healthcare staff
- **Service Tracking** - Monitor all service requests in real-time
- **Payment Management** - Track revenue and process refunds
- **Emergency Response** - Immediate alerts for critical situations

## 🏗️ Tech Stack

### Frontend (User App)
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend API
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Secure authentication
- **Twilio** - SMS and WhatsApp services
- **Razorpay** - Payment gateway

### Admin Dashboard
- **Next.js 14** - React framework
- **Recharts** - Data visualization
- **Heroicons** - Icon library
- **TypeScript** - Type safety

### Cloud & Deployment
- **AWS S3** - File storage
- **Vercel** - Frontend deployment
- **Render** - Backend hosting

## 📁 Project Structure

```
NGO/
├── frontend/          # Next.js user application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/ # Reusable components
│   │   └── lib/       # Utilities and helpers
│   └── package.json
├── backend/           # Node.js API server
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   ├── utils/         # Helper functions
│   └── server.js      # Main server file
├── admin/             # Admin dashboard
│   ├── src/
│   │   ├── app/       # Admin pages
│   │   └── components/ # Admin components
│   └── package.json
└── docs/              # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Twilio account (for SMS/WhatsApp)
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd NGO
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Admin Dashboard
cd ../admin
npm install
```

3. **Environment Setup**
```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your credentials

# Required environment variables:
# - MONGODB_URI
# - JWT_SECRET
# - TWILIO_ACCOUNT_SID
# - TWILIO_AUTH_TOKEN
# - TWILIO_PHONE_NUMBER
# - RAZORPAY_KEY_ID
# - RAZORPAY_KEY_SECRET
```

4. **Start the applications**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev

# Admin Dashboard (Terminal 3)
cd admin
npm run dev
```

### Access Points
- **User App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:5000

## 📱 Core Features

### Authentication System
- Mobile OTP-based login for elderly users
- JWT token-based session management
- Role-based access control (User/Admin)

### Service Management
- **Doctor Visit**: In-home medical consultations
- **Nurse Care**: 24/7 nursing support
- **Physiotherapy**: Rehabilitation services
- **Old Age Home**: Residential care admission
- **Emergency Help**: Immediate assistance

### Payment System
- Razorpay integration for secure payments
- Multiple payment methods (cards, UPI, wallets)
- Automatic receipt generation
- Refund processing

### Communication
- SMS notifications for service updates
- WhatsApp integration for family updates
- Email notifications for important events
- Emergency alerts to contacts

## 🛡️ Security Features

- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize all user inputs
- **CORS Protection**: Secure cross-origin requests
- **Helmet.js**: Security headers
- **OTP Verification**: Secure mobile authentication

## 📊 Analytics & Monitoring

- User registration and activity tracking
- Service request analytics
- Revenue and payment insights
- Staff performance metrics
- Emergency response times

## 🌐 Location Services

- Google Maps integration for service areas
- Geospatial staff assignment
- Real-time location tracking
- Service radius optimization

## 🏥 Emergency Features

- **SOS Button**: One-click emergency assistance
- **Auto-alert System**: Notify emergency contacts
- **Staff Dispatch**: Immediate staff assignment
- **Location Sharing**: Share location with responders

## 💳 Subscription Plans

- **Basic Care**: ₹999/month - Essential services
- **Premium Care**: ₹1,999/month - Enhanced support
- **VIP Care**: ₹3,999/month - Comprehensive care

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Email**: support@eldercare.com
- **Phone**: 1800-123-4567
- **Emergency**: 108

## 🙏 Acknowledgments

- Thanks to all healthcare workers who care for our elderly
- Special thanks to the open-source community
- Built with ❤️ for senior citizens in India

---

**ElderCare Platform** - Compassionate care, delivered with technology.

#   g o l d e n _ y e a r s _ a d m i n 
 
 
