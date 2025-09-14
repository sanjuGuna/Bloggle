const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloggle', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Create admin user
const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@bloggle.com' },
        { role: 'admin' },
        { isAdmin: true }
      ]
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log(`Is Admin: ${existingAdmin.isAdmin}`);
      process.exit(0);
    }
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@bloggle.com',
      password: 'admin123',
      bio: 'Bloggle Administrator',
      location: 'Admin HQ',
      role: 'admin',
      isAdmin: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    });
    
    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@bloggle.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Username: admin');
    console.log('🔐 Role: admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    process.exit(0);
  }
};

// Run the script
createAdmin();
