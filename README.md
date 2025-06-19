# StayFinder - Full-Stack Airbnb Clone

A modern, full-stack web application for property rentals built with Next.js, MongoDB, and TypeScript.

## 🚀 Features

### Frontend
- **Property Listings**: Browse and search properties with advanced filters
- **Property Details**: Detailed property pages with image galleries and amenities
- **User Authentication**: Secure login/register with JWT tokens
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Search**: Filter by location, price, property type, and amenities

### Backend
- **RESTful API**: Complete API for properties, users, and bookings
- **MongoDB Integration**: Robust data models with Mongoose ODM
- **Authentication**: JWT-based authentication with secure password hashing
- **Booking System**: Complete booking management with date validation
- **Data Validation**: Comprehensive input validation and error handling

### Database Models
- **Users**: User profiles with authentication and host capabilities
- **Properties**: Detailed property listings with location and amenities
- **Bookings**: Booking management with status tracking and pricing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Styling**: Tailwind CSS with custom components

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd stayfinder
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update the `.env.local` file with your MongoDB connection string and JWT secret:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/stayfinder
   JWT_SECRET=your-super-secret-jwt-key-here
   \`\`\`

4. **Start MongoDB**
   - For local MongoDB: Make sure MongoDB is running on your system
   - For MongoDB Atlas: Use your Atlas connection string in MONGODB_URI

5. **Seed the database (optional)**
   \`\`\`bash
   npm run seed
   \`\`\`

6. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB on your system
2. Start the MongoDB service
3. Use `mongodb://localhost:27017/stayfinder` as your connection string

### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and replace `<username>`, `<password>`, and `<cluster-url>`
4. Use the Atlas connection string in your `.env.local` file

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/[id]` - Get single property
- `POST /api/properties` - Create new property (authenticated)
- `PUT /api/properties/[id]` - Update property (host only)
- `DELETE /api/properties/[id]` - Delete property (host only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

## 🎯 Usage

### For Guests
1. **Browse Properties**: Search and filter properties by location, price, and amenities
2. **View Details**: Click on any property to see detailed information
3. **Create Account**: Register to start booking properties
4. **Make Bookings**: Select dates and book your stay

### For Hosts
1. **Register as Host**: Create an account and add properties
2. **Manage Listings**: Add, edit, and manage your property listings
3. **Handle Bookings**: View and manage incoming booking requests

## 🔒 Security Features

- **Password Hashing**: Secure password storage with bcrypt
- **JWT Authentication**: Stateless authentication with secure tokens
- **Input Validation**: Comprehensive data validation on all endpoints
- **CORS Protection**: Secure API access controls
- **Environment Variables**: Sensitive data stored securely

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed on any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
