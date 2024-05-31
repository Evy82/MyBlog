const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const blogPosts = [];

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/posts', (req, res) => {
  res.status(200).json(blogPosts);
});

app.post('/posts', (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).send('Title, content, and author are required to create a post.');
  }

  const newPost = { id: blogPosts.length + 1, title, content, author, createdAt: new Date() };
  blogPosts.push(newPost);
  res.status(201).send(newPost);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});