const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  author: String,
  datePosted: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogpostSchema);

const app = express();

app.use(express.json());

app.post('/api/blogPosts', async (req, res) => {
  const { title, content, tags, author } = req.body;
  let blogPost = new BlogPost({ title, content, tags, author });

  try {
    blogPost = await blogPost.save();
    res.send(blogPost);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/api/blogPosts', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.send(blogPosts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/blogPosts/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) return res.status(404).send('The blog post with the given ID was not found.');
    res.send(blogPos t);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/api/blogPosts/:id', async (req, res) => {
  const { title, content, tags, author } = req.body;
  try {
    const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, 
      { title, content, tags, author }, 
      { new: true }
    );
    if (!blogPost) return res.status(404).send('The blog post with the given ID was not found.');
    res.send(blogPost);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/api/blogPosts/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndRemove(req.params.id);
    if (!blogPost) return res.status(404).send('The blog post with the given ID was not found.');
    res.send(blogPost);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));