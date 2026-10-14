import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'Real Estate Trends'
    },
    date: {
      type: String,
      default: ''
    },
    readTime: {
      type: String,
      default: '5 min read'
    },
    author: {
      type: String,
      default: 'Gurukripa Editorial Team'
    },
    authorRole: {
      type: String,
      default: 'Senior Analyst'
    },
    featuredImage: {
      type: String,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false
    },
    excerpt: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    relatedProjects: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;
