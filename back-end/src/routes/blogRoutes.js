import express from 'express';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

let fallbackBlogs = [];

router.get('/', async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(fallbackBlogs);
  }

  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    return res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
});

router.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;
  if (!isDatabaseConnected()) {
    const found = fallbackBlogs.find(b => b.id === idOrSlug || b.slug === idOrSlug);
    if (found) return res.json(found);
    return res.status(404).json({ message: 'Blog post not found' });
  }

  try {
    const blog = await Blog.findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }]
    });
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const blogData = req.body || {};
    const newId = blogData.id || `blog-${Date.now()}`;
    const slug = blogData.slug || blogData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `blog-${Date.now()}`;

    const blogToCreate = {
      ...blogData,
      id: newId,
      slug
    };

    if (!isDatabaseConnected()) {
      fallbackBlogs.unshift(blogToCreate);
      return res.status(201).json(blogToCreate);
    }

    const createdBlog = await Blog.create(blogToCreate);
    return res.status(201).json(createdBlog);
  } catch (error) {
    console.error('Error creating blog:', error.message);
    return res.status(500).json({ message: 'Failed to create blog', error: error.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body || {};

    if (!isDatabaseConnected()) {
      const idx = fallbackBlogs.findIndex((b) => b.id === id);
      if (idx !== -1) {
        fallbackBlogs[idx] = { ...fallbackBlogs[idx], ...updatedFields };
        return res.json(fallbackBlogs[idx]);
      }
      return res.status(404).json({ message: 'Blog not found' });
    }

    const updated = await Blog.findOneAndUpdate(
      { id },
      { $set: updatedFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Error updating blog:', error.message);
    return res.status(500).json({ message: 'Failed to update blog', error: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      fallbackBlogs = fallbackBlogs.filter((b) => b.id !== id);
      return res.json({ message: 'Blog deleted successfully' });
    }

    const deleted = await Blog.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error.message);
    return res.status(500).json({ message: 'Failed to delete blog', error: error.message });
  }
});

export default router;
