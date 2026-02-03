import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel',
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Admin'],
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'receiverModel',
  },
  receiverModel: {
    type: String,
    enum: ['User', 'Admin', null],
    default: null,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  roomId: {
    type: String,
    required: true,
  },
  attachments: [
    {
      url: String,
      type: {
        type: String,
        enum: ['image', 'document', 'video'],
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      userType: {
        type: String,
        enum: ['customer', 'admin'],
        required: true,
      },
      name: String,
      avatar: String,
    },
  ],
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  lastMessage: {
    type: String,
    default: '',
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);
export const ChatRoom =
  mongoose.models.ChatRoom || mongoose.model('ChatRoom', chatRoomSchema);
