import mongoose, { Schema, Document } from 'mongoose';
import { User } from './User';

export interface IDiscussionResponse extends Document {
  content: string;
  author: User['_id'];
  createdAt: Date;
}

export interface IDiscussion extends Document {
  topic: string;
  content: string;
  author: User['_id'];
  responses: IDiscussionResponse[];
  createdAt: Date;
  updatedAt: Date;
}

const DiscussionResponseSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Response content is required'],
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DiscussionSchema = new Schema({
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Discussion content is required'],
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  responses: [DiscussionResponseSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
DiscussionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const DiscussionModel = mongoose.models.Discussion || 
  mongoose.model<IDiscussion>('Discussion', DiscussionSchema);

export default DiscussionModel;