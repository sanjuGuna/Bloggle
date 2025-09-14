# Bloggle Admin Panel

A comprehensive admin panel for managing the Bloggle blogging platform.

## Features

### Dashboard
- Overview statistics (total blogs, users, published/draft counts)
- Recent blogs and users
- Quick access to all admin functions

### Blog Management
- View all blogs with search and filtering
- Change blog status (draft/published)
- Delete blogs
- View blog details and edit links

### User Management
- View all users with search functionality
- Change user status (active/suspended/banned)
- Delete users
- View user profiles and blog counts

### Settings
- Site configuration
- User registration settings
- Content settings (comments, likes)
- Maintenance mode

## Access

The admin panel is accessible at `/admin` for users with admin privileges.

### Admin User Requirements
Users need either:
- `role: 'admin'` in their user profile, OR
- `isAdmin: true` in their user profile

## Routes

- `/admin` - Dashboard
- `/admin/blogs` - Blog management
- `/admin/users` - User management
- `/admin/settings` - Site settings

## API Endpoints

All admin endpoints are prefixed with `/api/admin/` and require admin authentication:

### Blog Management
- `GET /api/admin/blogs/stats` - Get blog statistics
- `GET /api/admin/blogs` - Get all blogs with pagination
- `PATCH /api/admin/blogs/:id/status` - Update blog status
- `DELETE /api/admin/blogs/:id` - Delete blog

### User Management
- `GET /api/admin/users/stats` - Get user statistics
- `GET /api/admin/users` - Get all users with pagination
- `PATCH /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user

### Settings
- `GET /api/admin/settings` - Get site settings
- `PUT /api/admin/settings` - Update site settings

## Security

- All admin routes are protected with authentication middleware
- Additional admin role checking prevents unauthorized access
- Admin users cannot delete their own accounts
- All admin actions are logged for audit purposes

## Responsive Design

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Styling

The admin panel uses a modern, clean design with:
- Dark sidebar navigation
- Light main content area
- Consistent color scheme
- Hover effects and transitions
- Mobile-friendly layout
