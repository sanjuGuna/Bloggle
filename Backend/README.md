# Bloggle Backend API

A Node.js/Express backend with MongoDB integration for the Bloggle blogging platform.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Blog Management**: Full CRUD operations for blog posts
- **User Profiles**: Comprehensive user profile management
- **Search & Pagination**: Advanced blog search with pagination
- **Social Features**: User following, likes, and comments
- **Data Validation**: Input validation using express-validator
- **MongoDB Integration**: Mongoose ODM with optimized schemas

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bloggle
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   - **Local MongoDB**: Start your local MongoDB service
   - **MongoDB Atlas**: Use your connection string in `.env`

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The database will be created automatically when you first run the application

### Option 2: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `.env` file with your Atlas connection string

### Seed Initial Data
```bash
node seeder/seeder.js
```

This will create sample users and blogs for testing.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Blogs
- `GET /api/blogs` - Get all published blogs (with search & pagination)
- `GET /api/blogs/:id` - Get blog by ID
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/blogs/:id/like` - Like/unlike blog
- `POST /api/blogs/:id/comment` - Add comment to blog

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/avatar` - Update user avatar
- `PUT /api/users/password` - Change password
- `GET /api/users/:username` - Get public profile by username
- `GET /api/users/:username/blogs` - Get blogs by username
- `POST /api/users/:userId/follow` - Follow/unfollow user

## Database Models

### User Model
- Username, email, password
- Profile information (bio, location, website)
- Privacy settings
- Followers/following relationships
- Account preferences

### Blog Model
- Title, content, excerpt
- Author information
- Tags and categories
- Status (draft/published/archived)
- Engagement metrics (likes, comments, views)
- SEO metadata

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Built-in Express rate limiting

## Testing the API

### Using Postman or similar tools:

1. **Register a new user:**
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json
   
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Create a blog (with auth token):**
   ```
   POST http://localhost:5000/api/blogs
   Content-Type: application/json
   x-auth-token: YOUR_JWT_TOKEN
   
   {
     "title": "My First Blog",
     "content": "This is the content of my first blog post...",
     "excerpt": "A brief excerpt of my blog post",
     "tags": ["test", "first-post"]
   }
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/bloggle` |
| `JWT_SECRET` | Secret key for JWT tokens | `fallback_secret` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for Atlas

2. **JWT Token Issues:**
   - Check JWT_SECRET in `.env`
   - Ensure token is sent in `x-auth-token` header

3. **Port Already in Use:**
   - Change PORT in `.env`
   - Kill existing process using the port

### Logs:
Check console output for detailed error messages and connection status.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
