const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  author: String,
  datePosted: { type: Date, default: Date.now },
  comments: [{ body: String, date: Date }]
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let user = new User({ username, password: hashedPassword });
  try {
    user = await user.save();
    res.send({ username: user.username });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/auth', async (req, res) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username });
  if (!user) return res.status(400).send('Invalid username or password.');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.send(token);
});

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

app.post('/api/blogPosts', auth, async (req, res) => {
  const { title, content, tags, author } = req.body;
  let blogPost = new BlogPost({ title, content, tags, author });

  try {
    blogPost = await blogPost.save();
    res.send(blogPost);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/api/blogPosts/:id/comments', async (req, res) => {
  const { body } = req.body;

  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) return res.status(404).send('Blog post not found.');

    blogPost.comments.push({ body, date: Date.now() });
    await blogPost.save();
    res.send(blogPost);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));