const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('bio')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Bio cannot exceed 200 characters'),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please enter a valid website URL')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, bio, location, website, notifications, newsletter, privacy, showEmail } = req.body;
    
    // Check if username is being changed and if it's already taken
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }
    
    // Update user profile
    const user = await User.findById(req.user.id);
    
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (notifications !== undefined) user.notifications = notifications;
    if (newsletter !== undefined) user.newsletter = newsletter;
    if (privacy !== undefined) user.privacy = privacy;
    if (showEmail !== undefined) user.showEmail = showEmail;
    
    await user.save();
    
    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/avatar
// @desc    Update user avatar
// @access  Private
router.put('/avatar', [
  auth,
  body('avatar')
    .isURL()
    .withMessage('Please provide a valid avatar URL')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { avatar } = req.body;
    
    const user = await User.findById(req.user.id);
    user.avatar = avatar;
    await user.save();
    
    res.json({ avatar: user.avatar });
  } catch (error) {
    console.error('Update avatar error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put('/password', [
  auth,
  body('currentPassword')
    .exists()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:username
// @desc    Get public profile by username
// @access  Public
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email -notifications -newsletter -privacy -showEmail');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check privacy settings
    if (user.privacy === 'private') {
      return res.status(403).json({ message: 'Profile is private' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:username/blogs
// @desc    Get blogs by username
// @access  Public
router.get('/:username/blogs', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find({ 
      author: user._id, 
      status: 'published' 
    })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');
    
    const total = await Blog.countDocuments({ 
      author: user._id, 
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

// @route   POST /api/users/:userId/follow
// @desc    Follow/unfollow a user
// @access  Private
router.post('/:userId/follow', auth, async (req, res) => {
  try {
    if (req.user.id === req.params.userId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    
    const userToFollow = await User.findById(req.params.userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentUser = await User.findById(req.user.id);
    
    const isFollowing = currentUser.following.includes(req.params.userId);
    
    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.userId
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      // Follow
      currentUser.following.push(req.params.userId);
      userToFollow.followers.push(req.user.id);
    }
    
    await currentUser.save();
    await userToFollow.save();
    
    res.json({ 
      isFollowing: !isFollowing,
      followingCount: currentUser.following.length,
      followersCount: userToFollow.followers.length
    });
  } catch (error) {
    console.error('Follow user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users
// @desc    Delete user account
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Delete all user's blogs
    await Blog.deleteMany({ author: req.user.id });
    
    // Delete user account
    await user.remove();
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
