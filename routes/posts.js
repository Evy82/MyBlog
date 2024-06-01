const express = require('express');
const router = express.Router();
require('dotenv').config();

let db = [
    { id: 1, title: "First Post", content: "This is the first post." },
];

router.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

router.get('/posts', (req, res) => {
    res.status(200).json(db);
});

router.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = db.find(p => p.id === postId);
    if (post) {
        res.status(200).json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (title && content) {
        const newPost = {
            id: db.length + 1,
            title,
            content
        };
        db.push(newPost);
        res.status(201).send('Post created successfully');
    } else {
      res.status(400).send('Bad request. Both title and content are required.');
    }
});

router.put('/posts/:id', (req, res) => {
    const { title, content } = req.body;
    const postId = parseInt(req.params.id);
    const index = db.findIndex(p => p.id === postId);

    if (index > -1 && title && content) {
        db[index].title = title;
        db[index].content = content;
        res.status(200).send('Post updated successfully');
    } else {
        res.status(404).send('Post not found or bad request');
    }
});

router.delete('/posts/:youid', (req, res) => {
    const postId = parseInt(req.params.id);
    const index = db.findIndex(p => p.id === postId);

    if (index > -1) {
        db = db.filter(p => p.id !== postId);
        res.status(200).send('Post deleted successfully');
    } else {
        res.status(404).send('Post not found');
    }
});

module.exports = router;