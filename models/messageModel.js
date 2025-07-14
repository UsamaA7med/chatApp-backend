import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reciver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
    },
    image: {
      type: Object,
      default: {
        publicId: null,
        url: null,
      },
    },
  },
  {
    timestamps: true,
  }
)

export const Message = mongoose.model('Message', messageSchema)
