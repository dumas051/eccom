import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['General Inquiry', 'Product Support', 'Order Status', 'Technical Support', 'Returns & Refunds', 'Billing', 'Other']
  },
  priority: {
    type: String,
    default: 'Medium',
    enum: ['Low', 'Medium', 'High', 'Urgent']
  },
  status: {
    type: String,
    default: 'Open',
    enum: ['Open', 'In Progress', 'Resolved', 'Closed']
  },
  assignedTo: {
    type: String,
    default: null
  },
  responses: [{
    from: {
      type: String,
      required: true,
      enum: ['user', 'admin']
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date,
    default: null
  }
});

// Update the updatedAt field before saving
supportTicketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const SupportTicket = mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema);

export default SupportTicket; 