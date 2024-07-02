import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BlogPost {
  id: number;
  title: string;
  body: string;
}

const BlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("An error occurred while fetching the posts", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Blog Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogPosts;