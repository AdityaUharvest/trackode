import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a meta description'],
  },
  content: {
    type: String,
    required: [true, 'Please provide the blog content'],
  },
  author: {
    type: String,
    default: 'Aditya Upadhyay',
  },
  category: {
    type: String,
    default: 'Technology',
  },
  image: {
    type: String,
    default: '/og-image.png',
  },
  tags: [String],
  published: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;
