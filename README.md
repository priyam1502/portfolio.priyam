# 🌱 FarmMarket - Farmers' Direct Market Access MVP

A comprehensive platform connecting farmers directly with buyers, eliminating middlemen and ensuring fair prices for everyone.

## 🎯 Project Overview

**FarmMarket** is a full-stack web application built for SIH 2024 that enables:
- **Farmers** to list their produce and manage orders
- **Buyers** to browse fresh produce and place orders directly
- **Direct communication** between farmers and buyers
- **Fair pricing** without middleman markup

## ✨ Core Features

### 👨‍🌾 Farmer Features
- ✅ Registration & Authentication
- ✅ Add/Edit/Delete Produce Listings
- ✅ Order Management (Accept/Reject Orders)
- ✅ Dashboard with Analytics
- ✅ Real-time Notifications

### 🛒 Buyer Features
- ✅ Registration & Authentication
- ✅ Browse & Search Produce
- ✅ Place Orders with Quantity Selection
- ✅ Order Tracking & Status Updates
- ✅ Payment Mock System

### 🖥️ System Features
- ✅ RESTful API Backend
- ✅ MongoDB Database
- ✅ JWT Authentication
- ✅ Responsive Web Design
- ✅ Real-time Updates
- ✅ Demo Data for Presentation

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farmers-market-mvp
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration:
   # PORT=5000
   # MONGODB_URI=mongodb://localhost:27017/farmers_market
   # JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   # Backend: npm run server
   # Frontend: npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 📊 Demo Data

The application includes demo accounts for easy testing:

### Demo Accounts
```
Farmer Account:
- Phone: 9876543210
- Password: demo123

Buyer Account:
- Phone: 9876543211
- Password: demo123
```

### Create Demo Data
Visit: `http://localhost:5000/api/demo-data` to automatically create demo users and produce listings.

## 🎬 Demo Flow for Judges

1. **Farmer Login** → Add produce (Onions, 50kg, ₹20/kg)
2. **Buyer Login** → Browse listings → Place order for 20kg
3. **Farmer** receives notification → Accepts order
4. **Buyer** sees confirmation screen
5. **Farmer Dashboard** updates → Shows ₹400 earned, 30kg stock left

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Produce
- `GET /api/produce` - Browse all produce
- `POST /api/produce` - Create listing (farmers only)
- `PUT /api/produce/:id` - Update listing
- `GET /api/produce/farmer/my-listings` - Farmer's listings

### Orders
- `POST /api/orders` - Place order (buyers only)
- `GET /api/orders/buyer/my-orders` - Buyer's orders
- `GET /api/orders/farmer/my-orders` - Farmer's orders
- `PUT /api/orders/:id/status` - Update order status

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Material Design** - Clean and professional interface
- **Real-time Updates** - Live order status changes
- **Search & Filters** - Advanced produce filtering
- **Dashboard Analytics** - Visual insights for farmers
- **Toast Notifications** - User-friendly feedback

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes and middleware
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Render/Heroku)
```bash
cd server
# Deploy to Render or Heroku
```

### Database (MongoDB Atlas)
- Create MongoDB Atlas cluster
- Update MONGODB_URI in environment variables

## 📈 Future Enhancements

### Phase 2 Features
- [ ] AI Price Suggestions
- [ ] Negotiation Chat System
- [ ] Delivery Tracking
- [ ] Payment Gateway Integration
- [ ] Mobile App (React Native)
- [ ] Offline Mode for Farmers
- [ ] Multi-language Support
- [ ] Advanced Analytics

### Phase 3 Features
- [ ] Logistics Integration
- [ ] Quality Certification
- [ ] Farmer Community Features
- [ ] Bulk Order Management
- [ ] Seasonal Forecasting
- [ ] Government Scheme Integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**SIH 2024 Team**
- Full-stack development
- UI/UX design
- Database architecture
- API development

## 📞 Support

For support and queries:
- Email: support@farmmarket.com
- Phone: +91 98765 43210

---

**Made with ❤️ for Smart India Hackathon 2024**

*Connecting farmers directly with consumers, one order at a time.*