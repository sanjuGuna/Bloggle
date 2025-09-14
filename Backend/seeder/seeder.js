const mongoose = require('mongoose');
const User = require('../models/User');
const Blog = require('../models/Blog');
require('dotenv').config();

// Sample users data
const users = [
  {
    username: 'admin',
    email: 'admin@bloggle.com',
    password: 'admin123',
    bio: 'Bloggle Administrator',
    location: 'Admin HQ',
    role: 'admin',
    isAdmin: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'ethan_siegel',
    email: 'ethan@example.com',
    password: 'password123',
    bio: 'Science writer and astrophysicist',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'esha_brahmbhatt',
    email: 'esha@example.com',
    password: 'password123',
    bio: 'Public health researcher and writer',
    location: 'New York, NY',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'lawrence_lessig',
    email: 'lawrence@example.com',
    password: 'password123',
    bio: 'Legal scholar and political activist',
    location: 'Cambridge, MA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  }
];

// Sample blogs data
const blogs = [
  {
    publication: "Starts With A Bang!",
    title: "What a nuclear reactor on the Moon really means for NASA's future",
    excerpt: "There are real concerns with long-term power generation on the Moon; nuclear could be the solution we've been searching for...",
    content: "The Moon presents unique challenges for long-term human habitation, particularly when it comes to power generation. Solar power, while abundant, has limitations during the lunar night which lasts approximately 14 Earth days. Nuclear power could provide a reliable, continuous energy source that could revolutionize our ability to establish permanent lunar bases.\n\nNASA's Artemis program aims to return humans to the Moon by 2024, and establishing sustainable power sources will be crucial for long-term missions. Nuclear reactors could power everything from life support systems to scientific instruments, enabling unprecedented exploration of the lunar surface.\n\nThe technology isn't new - NASA has been developing nuclear power systems for space applications for decades. The Kilopower project, for example, demonstrated a small nuclear reactor that could provide up to 10 kilowatts of electrical power for at least 10 years.",
    tags: ["Space", "Technology", "NASA", "Nuclear Power"],
    category: "Science",
    status: "published"
  },
  {
    publication: "Cabin Fever Magazine",
    title: "An Introduction to Media Epidemiology",
    excerpt: "A deep dive into how media and communications are intimately related to the health of a population...",
    content: "Media epidemiology is an emerging field that examines how information spreads through populations and how it affects public health outcomes. Just as diseases can spread through contact, information and misinformation can spread through social networks, with potentially serious consequences for public health.\n\nDuring the COVID-19 pandemic, we've seen firsthand how quickly misinformation can spread and how it can undermine public health efforts. Understanding the mechanisms of information spread is crucial for developing effective communication strategies.\n\nThis field combines elements of epidemiology, communication theory, and social network analysis to understand how messages travel through populations and how they influence health behaviors. By understanding these patterns, public health officials can design more effective interventions.",
    tags: ["Media", "Public Health", "Sociology", "Communication"],
    category: "Health",
    status: "published"
  },
  {
    publication: "Lessig",
    title: "Courage versus Complicity [updated]",
    excerpt: "As retired Admiral Mark Montgomery recently put it, the strategy of Donald Trump is not unusual for authoritarian leaders...",
    content: "The choice between courage and complicity has never been more critical in American politics. When leaders fail to speak truth to power, when institutions fail to hold the powerful accountable, democracy itself is at risk.\n\nHistory shows us that authoritarian leaders often follow similar patterns: they attack the press, undermine the judiciary, and seek to consolidate power. Recognizing these patterns early is crucial for preventing democratic backsliding.\n\nThe question for every citizen, every public official, every institution is simple: will you choose courage or complicity? Will you stand up for democratic values, or will you remain silent in the face of threats to democracy?\n\nThis is not a partisan issue - it's a question of whether we value democracy itself. The future of our republic depends on the choices we make today.",
    tags: ["Politics", "Leadership", "History", "Democracy"],
    category: "Politics",
    status: "published"
  }
];

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

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany();
    console.log('Cleared existing users');
    
    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }
    
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error.message);
    throw error;
  }
};

// Seed blogs
const seedBlogs = async (users) => {
  try {
    // Clear existing blogs
    await Blog.deleteMany();
    console.log('Cleared existing blogs');
    
    // Create blogs with authors
    for (let i = 0; i < blogs.length; i++) {
      const blogData = blogs[i];
      const author = users[i % users.length]; // Distribute blogs among users
      
      const blog = new Blog({
        ...blogData,
        author: author._id,
        authorAvatar: author.avatar
      });
      
      await blog.save();
      console.log(`Created blog: ${blog.title}`);
    }
    
    console.log('Blogs seeded successfully');
  } catch (error) {
    console.error('Error seeding blogs:', error.message);
    throw error;
  }
};

// Main seeding function
const seedAll = async () => {
  try {
    await connectDB();
    console.log('Starting database seeding...');
    
    const createdUsers = await seedUsers();
    await seedBlogs(createdUsers);
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedAll();
}

module.exports = { seedAll, seedUsers, seedBlogs };
