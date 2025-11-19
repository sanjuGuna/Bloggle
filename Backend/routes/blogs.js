const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all published blogs with pagination and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const tag = req.query.tag || '';
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { status: 'published' };
    
    if (search && search.trim()) {
      // Use regex search instead of text search to avoid index issues
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Execute query with pagination
    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content'); // Don't send full content in list
    
    // Get total count for pagination
    const total = await Blog.countDocuments(query);
    
    res.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/user/:userId
// @desc    Get blogs by specific user (published only)
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find({ 
      author: req.params.userId, 
      status: 'published' 
    })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');
    
    const total = await Blog.countDocuments({ 
      author: req.params.userId, 
      status: 'published' 
    });
    
    res.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total
      }
    });
  } catch (error) {
    console.error('Get user blogs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/me
// @desc    Get blogs of the authenticated user (all statuses)
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { author: req.user.id };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total
      }
    });
  } catch (error) {
    console.error('Get my blogs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/:id/edit
// @desc    Get full blog for editing (author only)
// @access  Private
router.get('/:id/edit', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username avatar');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get blog for edit error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('comments.user', 'username avatar');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    if (blog.status !== 'published') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Increment view count
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private
router.post('/', [
  auth,
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and cannot exceed 200 characters'),
  body('content')
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('excerpt')
    .isLength({ min: 1, max: 300 })
    .withMessage('Excerpt is required and cannot exceed 300 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, content, excerpt, publication, tags, status } = req.body;
    
    // Create new blog
    const blog = new Blog({
      title,
      content,
      excerpt,
      publication,
      tags: tags || [],
      status: status || 'draft',
      author: req.user.id,
      authorAvatar: req.user.avatar || ''
    });
    
    await blog.save();
    
    // Populate author info
    await blog.populate('author', 'username avatar');
    
    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private (author only)
router.put('/:id', [
  auth,
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and cannot exceed 200 characters'),
  body('content')
    .isLength({ min: 1 })
    .withMessage('Content is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { title, content, excerpt, publication, tags, status } = req.body;
    
    // Update blog
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.excerpt = excerpt || blog.excerpt;
    blog.publication = publication || blog.publication;
    blog.tags = tags || blog.tags;
    blog.status = status || blog.status;
    
    await blog.save();
    
    // Populate author info
    await blog.populate('author', 'username avatar');
    
    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await blog.remove();
    
    res.json({ message: 'Blog removed' });
  } catch (error) {
    console.error('Delete blog error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/:id/like
// @desc    Like/unlike a blog
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const likeIndex = blog.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push(req.user.id);
    }
    
    await blog.save();
    
    res.json({ likes: blog.likes, likeCount: blog.likes.length });
  } catch (error) {
    console.error('Like blog error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/:id/comment
// @desc    Add a comment to a blog
// @access  Private
router.post('/:id/comment', [
  auth,
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment content is required and cannot exceed 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const { content } = req.body;
    
    // Add comment
    blog.comments.unshift({
      user: req.user.id,
      content
    });
    
    await blog.save();
    
    // Populate comment user info
    await blog.populate('comments.user', 'username avatar');
    
    res.json(blog.comments);
  } catch (error) {
    console.error('Add comment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

 

module.exports = router;
