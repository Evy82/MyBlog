const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  body: {
    type: String,
    required: [true, 'Body text is required']
  },
  comments: [{
    body: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

blogPostSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else if (error) {
    next(new Error('An error occurred during the save operation'));
  } else {
    next();
  }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;

const newBlogPost = new BlogPost({
});

newBlogItPost.save()
  .then(doc => console.log('Blog post saved:', doc))
  .catch(err => console.error('Error saving the blog post:', err));