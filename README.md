# 🎯 KhojHub - Location-Based Business Discovery Platform

**KhojHub** is a comprehensive location-based business discovery platform that connects customers with local businesses through radius-based search, real-time product availability, and community-driven reviews. Built with modern web technologies, it serves as a bridge between local businesses and their customers.

## 🚀 Live Demo
- **Frontend**: http://localhost:5173/admin (Admin Portal)
- **Backend API**: http://localhost:5000/api/v1/health
- **Development**: Both frontend and backend servers running concurrently

## ✨ Key Features

### 🔍 Smart Business Discovery
- **Radius-Based Search**: Find businesses within your specified distance
- **Category Filtering**: Browse by business categories (Restaurants, Electronics, Fitness, etc.)
- **Geospatial Intelligence**: Location-aware recommendations using PostGIS
- **Real-Time Availability**: Live product and service status updates

### 🏪 Business Management
- **Shop Registration**: Complete business profile setup with location
- **Product Catalog**: Comprehensive product management system
- **Business Hours**: Flexible scheduling with weekly availability
- **Verification System**: Trust badges for verified businesses
- **Media Gallery**: Logo and image uploads for visual branding

### ⭐ Customer Engagement
- **Review System**: 5-star rating with detailed feedback
- **Photo Reviews**: Image attachments for authentic reviews
- **Rating Aggregation**: Automatic average rating calculations
- **Community Features**: User-generated content and interactions

### 🎨 Modern User Interface
- **Dark/Light Theme**: Complete theme toggle with system detection
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Admin Dashboard**: shadcn-admin inspired modern interface
- **Loading States**: Smooth transitions and loading indicators
- **Accessibility**: ARIA labels and keyboard navigation support

### 🔐 Security & Authentication
- **Clerk Integration**: Enterprise-grade authentication system
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: User, Shopkeeper, and Admin roles
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Proper cross-origin request handling

## 🏗️ Technology Stack

### Frontend Architecture
```
React 19.2.0 + Vite → Redux Toolkit → Tailwind CSS → Clerk Auth
```

**Core Technologies:**
- **React 19.2.0**: Modern functional components with hooks
- **Redux Toolkit**: Predictable state management with async thunks
- **Tailwind CSS 4.1.18**: Utility-first CSS framework
- **Vite**: Lightning-fast build tool and dev server
- **Clerk**: Complete authentication solution
- **Google Maps**: Geospatial mapping and location services
- **Recharts**: Data visualization and analytics charts
- **Lucide React**: Beautiful icon library

### Backend Architecture
```
Node.js + Express.js → MongoDB + Mongoose → JWT Auth → Supabase
```

**Core Technologies:**
- **Node.js**: JavaScript runtime environment
- **Express.js 5.2.1**: Minimal web application framework
- **MongoDB**: Primary NoSQL database with geospatial support
- **Mongoose**: Elegant MongoDB object modeling
- **Supabase**: Secondary PostgreSQL database with PostGIS
- **JWT**: JSON Web Token authentication
- **bcrypt**: Password hashing and security
- **Express-validator**: Input validation middleware

### Database Design

#### MongoDB Collections
- **Users**: Complete user profiles with authentication
- **Shops**: Business information with 2dsphere geospatial indexing
- **Products**: Catalog items with pricing and availability
- **Reviews**: Customer feedback with ratings and photos
- **Categories**: Business categorization system

#### Supabase Tables (PostGIS Enabled)
- **shops**: Business data with geographic coordinates
- **products**: Product catalog with foreign key relationships
- **Spatial Indexing**: PostGIS geography point data type
- **Foreign Keys**: Proper referential integrity constraints

## 📊 Data Statistics

### Seeded Database (Ready for Testing)
- **20 Shops** across 10 different business categories
- **200 Products** (10 products per shop)
- **10 Categories**: Restaurant, Electronics, Fitness, Health/Medicine, Automobile, Grocery, Clothing, Books, Pet Supplies, Gardening
- **Geographic Coverage**: All shops located in Lalitpur area, Nepal
- **PostGIS Integration**: Full spatial data support with radius queries

### Sample Business Categories
1. **Restaurants**: The Lazy Griller, Newari Dhaba
2. **Electronics**: Delta Tech Store, Smartcare Home Appliances  
3. **Fitness**: Iron Temple Gym & Shop, Zen Yoga Studio
4. **Health**: Nepal Pharma Distributors, Herbal Life Store
5. **Automobile**: Mahindra Auto Parts, Hero Bike Zone
6. **And More**: Grocery, Clothing, Books, Pet Supplies, Gardening

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Supabase account (for PostGIS features)
- Google Maps API key
- Clerk account for authentication

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/Dilip-lamichhane/DEFENCE.git
cd DEFENCE
```

2. **Install dependencies**
```bash
# Install all dependencies (root, frontend, backend)
npm install
```

3. **Environment Configuration**
```bash
# Frontend (.env in frontend/)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_API_URL=http://localhost:5000/api/v1

# Backend (.env in backend/)
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLERK_SECRET_KEY=your_clerk_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

4. **Database Setup**
```bash
# Run Supabase schema setup
cd backend
node check-schema.js

# Seed the database with sample data
node supabase-seeder-expanded.js
```

5. **Start Development Servers**
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually
npm run frontend  # Frontend on http://localhost:5174
npm run backend   # Backend on http://localhost:5000
```

## 🎯 Development Workflow

### Frontend Development
- **Hot Reload**: Instant code changes without page refresh
- **Component Architecture**: Modular, reusable React components
- **State Management**: Redux with proper action/reducer patterns
- **Styling**: Tailwind CSS with custom component classes
- **Build Optimization**: Vite with tree shaking and code splitting

### Backend Development
- **API Design**: RESTful endpoints with proper HTTP methods
- **Error Handling**: Comprehensive error responses and logging
- **Validation**: Server-side input validation with detailed messages
- **Database Queries**: Optimized MongoDB queries with indexing
- **Security**: JWT authentication with role-based access control

### Database Management
- **MongoDB**: Primary database for application data
- **Supabase**: Secondary database for geospatial features
- **Seeding**: Automated data seeding for development/testing
- **Migration**: Schema versioning and migration scripts
- **Backup**: Regular database backup procedures

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Shops
- `GET /api/v1/shops` - Get all shops
- `GET /api/v1/shops/search` - Search shops by location/radius
- `GET /api/v1/shops/:id` - Get shop details
- `POST /api/v1/shops` - Create new shop
- `PUT /api/v1/shops/:id` - Update shop information

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/shop/:shopId` - Get shop products
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Reviews
- `GET /api/v1/reviews/shop/:shopId` - Get shop reviews
- `POST /api/v1/reviews` - Create new review
- `PUT /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review

## 🎨 UI Components

### Custom Components
- **ThemeToggle**: Dark/light mode switcher
- **SearchBar**: Location and keyword search
- **ShopCard**: Business display card with ratings
- **RatingStars**: Interactive star rating component
- **MapComponent**: Google Maps integration
- **LoadingSpinner**: Loading state indicator
- **ProtectedRoute**: Route authentication guard

### Admin Dashboard Components
- **Analytics Cards**: Revenue and user statistics
- **Charts**: Line charts, area charts, pie charts
- **Data Tables**: Sortable and filterable tables
- **Action Buttons**: CRUD operation buttons
- **Status Indicators**: Online/offline badges

## 📱 Mobile Responsiveness

### Breakpoint Strategy
- **Mobile**: 320px - 768px (Single column layout)
- **Tablet**: 768px - 1024px (Two column layout)
- **Desktop**: 1024px+ (Multi-column layout)

### Touch Optimizations
- **Touch-Friendly Buttons**: Minimum 44px touch targets
- **Swipe Gestures**: Support for swipe navigation
- **Optimized Images**: Responsive images with proper sizing
- **Performance**: Fast loading on mobile networks

## 🔒 Security Features

### Authentication Security
- **JWT Token Expiry**: Configurable token expiration
- **Password Requirements**: Strong password validation
- **Rate Limiting**: API request rate limiting
- **CORS Configuration**: Proper cross-origin setup

### Data Protection
- **Environment Variables**: Sensitive data in .env files
- **Input Sanitization**: XSS and SQL injection prevention
- **Error Messages**: Non-sensitive error responses
- **HTTPS Ready**: SSL/TLS configuration support

## 📈 Performance Optimization

### Frontend Performance
- **Code Splitting**: Lazy loading for routes and components
- **Image Optimization**: Responsive images with proper formats
- **Bundle Size**: Tree shaking and dead code elimination
- **Caching**: Browser caching strategies

### Backend Performance
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized MongoDB aggregation pipelines
- **Response Compression**: Gzip compression for API responses

## 🧪 Testing Strategy

### Unit Testing
- **Component Testing**: React component unit tests
- **API Testing**: Backend endpoint testing
- **Database Testing**: Database query testing
- **Integration Testing**: Full workflow testing

### Manual Testing
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: iOS and Android devices
- **Performance Testing**: Load testing and stress testing
- **Security Testing**: Vulnerability assessment

## 🚀 Deployment Options

### Development
- **Local Development**: Full stack on localhost
- **Database**: Local MongoDB and Supabase
- **Hot Reload**: Instant code changes

### Production Deployment
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Heroku, AWS EC2, or DigitalOcean
- **Database**: MongoDB Atlas or AWS DocumentDB
- **CDN**: CloudFlare or AWS CloudFront

## 📚 Documentation

### Available Documentation
- **[updates.md](updates.md)**: Complete project development log
- **[techstack.md](techstack.md)**: Detailed technology stack
- **[instructions.md](instructions.md)**: Development setup guide
- **[MONGODB_COMPASS_SETUP.md](MONGODB_COMPASS_SETUP.md)**: Database setup

### Code Documentation
- **Inline Comments**: Detailed code comments
- **API Documentation**: Swagger/OpenAPI ready
- **Component Stories**: Storybook integration ready
- **Architecture Diagrams**: System architecture documentation

## 🤝 Contributing

### Development Guidelines
1. Follow the existing code style and patterns
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed
5. Submit pull requests for review

### Code Style
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Naming Conventions**: Follow React and JavaScript conventions
- **Component Structure**: Use functional components with hooks

## 📞 Support & Contact

### Project Maintainer
- **GitHub**: [Dilip-lamichhane](https://github.com/Dilip-lamichhane)
- **Repository**: [DEFENCE](https://github.com/Dilip-lamichhane/DEFENCE)

### Issues & Bug Reports
- Use GitHub Issues for bug reports
- Provide detailed reproduction steps
- Include environment information
- Attach screenshots if applicable

---

**🎯 KhojHub** - Connecting local businesses with customers through intelligent location-based discovery.

*Built with ❤️ using React, Node.js, MongoDB, and Supabase*