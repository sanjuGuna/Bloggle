# Admin Panel Login Instructions

## Default Admin Credentials

The admin panel comes with a default admin user that you can use to access the admin panel.

### 🔐 Admin Login Details

- **Email:** `admin@bloggle.com`
- **Password:** `admin123`
- **Username:** `admin`
- **Role:** `admin`

## How to Access Admin Panel

### Method 1: Using the Admin Login Button
1. Click the **"Admin"** button in the navigation bar
2. Enter the admin credentials above
3. You'll be automatically redirected to the admin panel

### Method 2: Using the Login Modal
1. Click **"Sign In"** in the navigation bar
2. Click **"🔐 Admin Login"** in the login modal
3. Enter the admin credentials above
4. You'll be automatically redirected to the admin panel

## Creating Admin Users

### Option 1: Run the Seeder (Recommended)
The seeder now includes an admin user by default:

```bash
cd Backend
npm run seed
```

This will create the admin user along with sample data.

### Option 2: Create Admin User Only
If you only want to create an admin user without sample data:

```bash
cd Backend
npm run create-admin
```

### Option 3: Manual Creation
You can also create admin users manually through the registration process and then update their role in the database.

## Admin Panel Features

Once logged in as admin, you'll have access to:

- **Dashboard:** Overview of site statistics
- **Blog Management:** View, edit, and manage all blog posts
- **User Management:** View and manage user accounts
- **Settings:** Configure site-wide settings

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Password:** After first login, change the default admin password
2. **Use Strong Passwords:** Ensure admin accounts use strong, unique passwords
3. **Limit Admin Access:** Only give admin privileges to trusted users
4. **Regular Updates:** Keep the system updated with security patches

## Troubleshooting

### Can't Access Admin Panel?
1. Make sure you're using the correct email and password
2. Check that the user has `role: 'admin'` or `isAdmin: true` in the database
3. Ensure the backend server is running
4. Check browser console for any error messages

### Admin User Not Created?
1. Run `npm run create-admin` to create the admin user
2. Check MongoDB connection
3. Verify the User model includes the admin fields

## Database Verification

To verify admin user exists in MongoDB:

```javascript
// In MongoDB shell or compass
db.users.findOne({ email: "admin@bloggle.com" })
```

The user should have:
- `role: "admin"`
- `isAdmin: true`
