const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && !req.user.isAdmin)) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// @route   GET /api/admin/blogs/stats
// @desc    Get blog statistics for admin dashboard
// @access  Private (Admin only)
router.get('/blogs/stats', [auth, adminAuth], async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });
    
    const recentBlogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title author status createdAt');
    
    res.json({
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      recentBlogs
    });
  } catch (error) {
    console.error('Get blog stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users/stats
// @desc    Get user statistics for admin dashboard
// @access  Private (Admin only)
router.get('/users/stats', [auth, adminAuth], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt');
    
    res.json({
      totalUsers,
      recentUsers
    });
  } catch (error) {
    console.error('Get user stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/blogs
// @desc    Get all blogs for admin management
// @access  Private (Admin only)
router.get('/blogs', [auth, adminAuth], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Execute query with pagination
    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Blog.countDocuments(query);
    
    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get admin blogs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/admin/blogs/:id/status
// @desc    Update blog status
// @access  Private (Admin only)
router.patch('/blogs/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    blog.status = status;
    await blog.save();
    
    res.json({ message: 'Blog status updated', status: blog.status });
  } catch (error) {
    console.error('Update blog status error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/blogs/:id
// @desc    Delete a blog (Admin only)
// @access  Private (Admin only)
router.delete('/blogs/:id', [auth, adminAuth], async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    await blog.remove();
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin management
// @access  Private (Admin only)
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    if (search && search.trim()) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get blog count for each user
    const usersWithBlogCount = await Promise.all(
      users.map(async (user) => {
        const blogCount = await Blog.countDocuments({ author: user._id });
        return {
          ...user.toObject(),
          blogCount
        };
      })
    );
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    res.json({
      users: usersWithBlogCount,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get admin users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin only)
router.patch('/users/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = status;
    await user.save();
    
    res.json({ message: 'User status updated', status: user.status });
  } catch (error) {
    console.error('Update user status error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user (Admin only)
// @access  Private (Admin only)
router.delete('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't allow admin to delete themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Delete all blogs by this user
    await Blog.deleteMany({ author: user._id });
    
    await user.remove();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/settings
// @desc    Get site settings
// @access  Private (Admin only)
router.get('/settings', [auth, adminAuth], async (req, res) => {
  try {
    // For now, return default settings
    // In a real app, you'd store these in a database
    const settings = {
      siteName: 'Bloggle',
      siteDescription: 'A modern blogging platform',
      allowRegistration: true,
      requireEmailVerification: false,
      maxBlogsPerUser: 50,
      enableComments: true,
      enableLikes: true,
      maintenanceMode: false,
      maintenanceMessage: 'Site is under maintenance. Please check back later.'
    };
    
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/settings
// @desc    Update site settings
// @access  Private (Admin only)
router.put('/settings', [auth, adminAuth], async (req, res) => {
  try {
    // For now, just return success
    // In a real app, you'd save these to a database
    const settings = req.body;
    
    console.log('Settings updated:', settings);
    
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Update settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
