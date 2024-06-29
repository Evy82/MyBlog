import React, { useState, useEffect } from 'react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
}

const App: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const BLOG_POSTS_API_URL = "https://example.com/api/posts";

    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(BLOG_POSTS_API_URL);
        const postsData = await response.json();
        setBlogPosts(postsData);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      {blogPosts.length > 0 ? (
        <ul>
          {blogPosts.map(post => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
};

export default App;