// models/UserModel.ts
import { getInitialTopics } from '@/utils/initializeTopics';
import mongoose, { Schema, Document } from 'mongoose';

export interface Topic {
  name: string;
  category: 'DSA' | 'CS';
  completed: boolean;
}

export interface User extends Document {
  fullName: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  ethereumAddress?: string;
  topics: Topic[];
}

const TopicSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['DSA', 'CS'],
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const UserSchema: Schema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['teacher', 'student'],
    required: [true, 'Role is required'],
  },
  ethereumAddress: {
    type: String,
    unique: true,
    sparse: true,
  },
  topics: {
    type: [TopicSchema], // Reference the TopicSchema directly
    default: getInitialTopics, // Use the function to initialize topics
  },
});

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User', UserSchema);

export default UserModel;
