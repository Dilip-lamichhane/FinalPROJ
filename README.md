# 🏪 KhojHub - Location-Based Business Discovery Platform

A modern, mobile-first MERN stack application that connects customers with local businesses through radius-based search, real-time product availability, and community-driven reviews.

## 🌟 Features

### Core Functionality
- **🔍 Radius-Based Search**: Find businesses within customizable distance ranges (1km, 5km, 10km, 25km)
- **📍 Interactive Map**: Google Maps integration with real-time location tracking and business markers
- **⭐ Review System**: Community-driven ratings and reviews for businesses and products
- **🔔 Real-Time Updates**: Live availability status for products and services
- **📱 Mobile-First Design**: Optimized for mobile devices with responsive layouts

### User Features
- **👤 User Authentication**: Secure login/signup with Clerk authentication
- **🛍️ Product Discovery**: Browse products by category, location, and availability
- **🏪 Shop Profiles**: Detailed business information, hours, and contact details
- **💬 Review Management**: Rate and review businesses with photo uploads
- **🔖 Favorite Shops**: Save preferred businesses for quick access

### Business Features
- **🏢 Business Profiles**: Complete shop management with product listings
- **📊 Analytics Dashboard**: Track views, reviews, and customer engagement
- **🛒 Product Management**: Add, update, and manage inventory with availability status
- **📍 Location Services**: Geospatial search optimization for local visibility

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite build tool
- **Tailwind CSS v4** for modern, utility-first styling
- **Redux Toolkit** for state management
- **Clerk** for authentication
- **React Router v7** for client-side routing
- **Google Maps API** for location services
- **Axios** for API communication

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for token-based authentication
- **bcrypt** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin resource sharing

### Development Tools
- **ESLint** for code linting
- **Vite** for fast development and building
- **nodemon** for backend hot reloading
- **MongoDB Compass** for database management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Maps API key
- Clerk account and API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dilip-lamichhane/KhojUpdate.git
   cd KhojUpdate
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both frontend and backend directories:

   **Frontend `.env`:**
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

   **Backend `.env`:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start Development Servers**
   
   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/v1/health

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "customer"
}
```

#### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Shop Endpoints

#### Get All Shops (with search)
```http
GET /shops/search?lat=27.7172&lng=85.3240&radius=5&category=restaurant
```

#### Get Shop Details
```http
GET /shops/:shopId
```

#### Create Shop (Business Owner)
```http
POST /shops
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Burger Palace",
  "description": "Best burgers in town",
  "category": "restaurant",
  "location": {
    "type": "Point",
    "coordinates": [85.3240, 27.7172]
  },
  "address": "Kathmandu, Nepal",
  "phone": "+9771234567890",
  "email": "info@burgerpalace.com",
  "website": "https://burgerpalace.com",
  "operatingHours": {
    "monday": "09:00-21:00",
    "tuesday": "09:00-21:00",
    "wednesday": "09:00-21:00",
    "thursday": "09:00-21:00",
    "friday": "09:00-22:00",
    "saturday": "09:00-22:00",
    "sunday": "10:00-20:00"
  }
}
```

### Product Endpoints

#### Get Products by Shop
```http
GET /products/shop/:shopId
```

#### Create Product
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Classic Burger",
  "description": "Juicy beef patty with fresh vegetables",
  "price": 350,
  "category": "food",
  "shopId": "shop_id_here",
  "availability": true,
  "images": ["burger-image-url.jpg"]
}
```

### Review Endpoints

#### Get Reviews by Shop
```http
GET /reviews/shop/:shopId
```

#### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "shopId": "shop_id_here",
  "rating": 5,
  "comment": "Excellent food and service!",
  "images": ["review-image-url.jpg"]
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  clerkId: String,           // Clerk user ID
  name: String,
  email: String,
  role: String,              // 'customer' | 'business_owner' | 'admin'
  avatar: String,
  location: {
    type: String,            // 'Point'
    coordinates: [Number]    // [longitude, latitude]
  },
  preferences: {
    radius: Number,          // Default search radius in km
    categories: [String]     // Preferred categories
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Shop Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  ownerId: ObjectId,         // Reference to User
  location: {
    type: String,            // 'Point'
    coordinates: [Number]    // [longitude, latitude]
  },
  address: String,
  phone: String,
  email: String,
  website: String,
  operatingHours: Object,
  images: [String],
  rating: Number,
  reviewCount: Number,
  isVerified: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  shopId: ObjectId,        // Reference to Shop
  availability: Boolean,
  images: [String],
  rating: Number,
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Reference to User
  shopId: ObjectId,          // Reference to Shop
  productId: ObjectId,       // Reference to Product (optional)
  rating: Number,            // 1-5 stars
  comment: String,
  images: [String],
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── Navigation.jsx      # Glassmorphism navigation with Clerk auth
│   ├── ShopCard.jsx        # Business card component
│   ├── RatingStars.jsx     # Rating display component
│   ├── MapComponent.jsx    # Google Maps integration
│   ├── LoadingSpinner.jsx  # Loading state component
│   └── ProtectedRoute.jsx  # Route protection component
├── pages/
│   ├── HomePage.jsx        # Premium homepage (6 sections)
│   ├── ShopDetailsPage.jsx # Individual shop details
│   ├── ProfilePage.jsx     # User profile management
│   ├── LoginPage.jsx       # Authentication page
│   └── RegisterPage.jsx    # Registration page
├── store/
│   ├── store.js            # Redux store configuration
│   ├── hooks.js            # Custom Redux hooks
│   └── slices/
│       ├── authSlice.js    # Authentication state
│       ├── shopsSlice.js   # Shop data management
│       ├── reviewsSlice.js # Review system
│       ├── mapSlice.js     # Map state
│       └── uiSlice.js      # UI state
└── App.jsx                 # Main application component
```

### State Management
- **Redux Toolkit** for global state management
- **React Context** for authentication state
- **Local component state** for UI interactions
- **Custom hooks** for data fetching and caching

## 🔧 Development Guidelines

### Code Style
- Use functional components with React Hooks
- Follow consistent naming conventions (camelCase for variables, PascalCase for components)
- Implement proper error handling and loading states
- Write self-documenting code with clear variable names

### Git Workflow
- Create feature branches for new developments
- Write descriptive commit messages
- Include issue numbers in commit messages when applicable
- Test thoroughly before merging to main branch

### Performance Optimization
- Implement lazy loading for components
- Use React.memo for expensive components
- Optimize images and assets
- Implement proper caching strategies

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend Deployment (Heroku/Railway)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Environment Variables for Production
- Update API URLs to production endpoints
- Configure CORS for production domains
- Set up SSL certificates
- Configure database connection strings

## 📱 Mobile Optimization

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Touch-friendly interface elements
- Optimized images for mobile devices
- Fast loading on slow connections

### Progressive Web App (PWA)
- Service worker implementation
- Offline functionality
- Push notifications
- App-like experience

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Clerk integration for secure user management
- Password hashing with bcrypt
- Rate limiting on API endpoints

### Data Protection
- Input validation and sanitization
- XSS protection
- SQL injection prevention
- Secure HTTP headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@khojhub.com or join our Slack channel.

## 🙏 Acknowledgments

- Google Maps API for location services
- Clerk for authentication services
- Tailwind CSS for styling framework
- React community for excellent libraries
- MongoDB for database services

---

**Built with ❤️ by the KhojHub Team**