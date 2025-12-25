const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseHelper = require('../utils/responseHelper');

class AuthController {
  /**
   * Register new user
   * POST /auth/register
   */
  static async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return ResponseHelper.error(res, 'Email already registered', null, 409);
      }

      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create user
      const userId = await User.create({
        name,
        email,
        password_hash,
        role: role || 'member'
      });

      // Get created user
      const user = await User.findById(userId);

      return ResponseHelper.success(
        res,
        'User registered successfully',
        { user },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return ResponseHelper.error(res, 'Invalid email or password', null, 401);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return ResponseHelper.error(res, 'Invalid email or password', null, 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Return user data without password
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      return ResponseHelper.success(res, 'Login successful', {
        token,
        user: userData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /auth/me
   */
  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return ResponseHelper.notFound(res, 'User not found');
      }

      return ResponseHelper.success(res, 'Profile retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users (Admin only)
   * GET /auth/users
   */
  static async getAllUsers(req, res, next) {
    try {
      const users = await User.getAll();
      
      return ResponseHelper.success(res, 'Users retrieved successfully', { 
        users,
        total: users.length 
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user (Admin only)
   * DELETE /auth/users/:id
   */
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Cek apakah user ada
      const user = await User.findById(id);
      if (!user) {
        return ResponseHelper.notFound(res, 'User not found');
      }

      // Tidak bisa menghapus diri sendiri
      if (parseInt(id) === req.user.id) {
        return ResponseHelper.error(res, 'You cannot delete your own account', null, 400);
      }

      await User.delete(id);

      return ResponseHelper.success(res, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user role (Admin only)
   * PUT /auth/users/:id/role
   */
  static async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validasi role
      if (!['admin', 'member'].includes(role)) {
        return ResponseHelper.error(res, 'Invalid role. Must be admin or member', null, 400);
      }

      // Cek apakah user ada
      const user = await User.findById(id);
      if (!user) {
        return ResponseHelper.notFound(res, 'User not found');
      }

      // Tidak bisa mengubah role diri sendiri
      if (parseInt(id) === req.user.id) {
        return ResponseHelper.error(res, 'You cannot change your own role', null, 400);
      }

      await User.updateRole(id, role);
      const updatedUser = await User.findById(id);

      return ResponseHelper.success(res, 'User role updated successfully', { user: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
