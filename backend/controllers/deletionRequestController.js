const DeletionRequest = require('../models/DeletionRequest');
const Transaction = require('../models/Transaction');
const ResponseHelper = require('../utils/responseHelper');

class DeletionRequestController {
  /**
   * Create deletion request (Member only)
   * POST /deletion-requests
   */
  static async create(req, res, next) {
    try {
      const { transaction_id, reason } = req.body;
      console.log('=== CREATE DELETION REQUEST ===');
      console.log('User:', req.user);
      console.log('Body:', { transaction_id, reason });

      // Check if transaction exists
      const transaction = await Transaction.findById(transaction_id);
      console.log('Transaction found:', transaction);
      if (!transaction) {
        return ResponseHelper.notFound(res, 'Transaction not found');
      }

      // Member can only request deletion for their own transactions
      if (req.user.role === 'member' && transaction.created_by !== req.user.id) {
        return ResponseHelper.forbidden(res, 'You can only request deletion for your own transactions');
      }

      // Check if request already exists
      const exists = await DeletionRequest.existsForTransaction(transaction_id, req.user.id);
      console.log('Request already exists:', exists);
      if (exists) {
        return ResponseHelper.error(res, 'Deletion request already exists for this transaction', null, 409);
      }

      // Create deletion request
      const requestId = await DeletionRequest.create({
        transaction_id,
        requested_by: req.user.id,
        reason
      });
      console.log('Created request ID:', requestId);

      const deletionRequest = await DeletionRequest.findById(requestId);
      console.log('Created deletion request:', deletionRequest);

      return ResponseHelper.success(
        res,
        'Deletion request submitted successfully. Admin will review your request.',
        { deletionRequest },
        201
      );
    } catch (error) {
      console.error('Error creating deletion request:', error);
      next(error);
    }
  }

  /**
   * Get all deletion requests
   * GET /deletion-requests
   */
  static async getAll(req, res, next) {
    try {
      const { status } = req.query;
      console.log('=== GET ALL DELETION REQUESTS ===');
      console.log('User:', req.user);
      console.log('Filter status:', status);
      
      const filters = {};
      if (status) filters.status = status;
      
      // Member can only see their own requests
      if (req.user.role === 'member') {
        filters.requested_by = req.user.id;
      }
      
      console.log('Filters:', filters);

      const requests = await DeletionRequest.getAll(filters);
      console.log('Found requests:', requests.length);

      return ResponseHelper.success(res, 'Deletion requests retrieved successfully', {
        requests,
        total: requests.length
      });
    } catch (error) {
      console.error('Error getting deletion requests:', error);
      next(error);
    }
  }

  /**
   * Get deletion request by ID
   * GET /deletion-requests/:id
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const deletionRequest = await DeletionRequest.findById(id);

      if (!deletionRequest) {
        return ResponseHelper.notFound(res, 'Deletion request not found');
      }

      // Member can only view their own requests
      if (req.user.role === 'member' && deletionRequest.requested_by !== req.user.id) {
        return ResponseHelper.forbidden(res, 'Access denied');
      }

      return ResponseHelper.success(res, 'Deletion request retrieved successfully', { deletionRequest });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve deletion request (Admin only)
   * POST /deletion-requests/:id/approve
   */
  static async approve(req, res, next) {
    try {
      const { id } = req.params;
      const { admin_note } = req.body;

      const deletionRequest = await DeletionRequest.findById(id);
      if (!deletionRequest) {
        return ResponseHelper.notFound(res, 'Deletion request not found');
      }

      if (deletionRequest.status !== 'pending') {
        return ResponseHelper.error(res, 'This request has already been reviewed', null, 400);
      }

      // Approve the request
      await DeletionRequest.approve(id, req.user.id, admin_note);

      // Delete the transaction
      await Transaction.delete(deletionRequest.transaction_id);

      return ResponseHelper.success(res, 'Deletion request approved and transaction deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject deletion request (Admin only)
   * POST /deletion-requests/:id/reject
   */
  static async reject(req, res, next) {
    try {
      const { id } = req.params;
      const { admin_note } = req.body;

      const deletionRequest = await DeletionRequest.findById(id);
      if (!deletionRequest) {
        return ResponseHelper.notFound(res, 'Deletion request not found');
      }

      if (deletionRequest.status !== 'pending') {
        return ResponseHelper.error(res, 'This request has already been reviewed', null, 400);
      }

      // Reject the request
      await DeletionRequest.reject(id, req.user.id, admin_note);

      return ResponseHelper.success(res, 'Deletion request rejected successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending count (Admin only)
   * GET /deletion-requests/pending/count
   */
  static async getPendingCount(req, res, next) {
    try {
      const count = await DeletionRequest.getPendingCount();
      return ResponseHelper.success(res, 'Pending count retrieved successfully', { count });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeletionRequestController;
