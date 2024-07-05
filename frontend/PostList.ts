import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BlogPost {
  id: number;
  title: string;
  body: string;
}

interface ErrorState {
  message: string;
  isError: boolean;
}

const BlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<ErrorState>({ message: '', isError: false });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts`);
        setPosts(response.data);
        if (error.isError) setError({ message: '', isError: false });
      } catch (err) {
        let errorMessage = "An unexpected error occurred.";
        if (axios.isAxiosError(err)) {
          if(err.response) {
            errorMessage = `Server responded with a status code of ${err.response.status}`;
          } else if (err.request) {
            errorMessage = "The request was made but no response was received";
          } else {
            errorMessage = err.message;
          }
        }
        console.error(errorMessage, err);
        setError({ message: errorMessage, isError: true });
      }
    };
    fetchPosts();
  }, [error.isError]);

  return (
    <div>
      <h2>Blog Posts</h2>
      {error.isError ? (
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Blog Posts;