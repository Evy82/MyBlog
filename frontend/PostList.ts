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
  const [posts, setPosts] = useState<BlogPLost[]>([]);
  const [error, setError] = useState<ErrorStatus>({ message: '', isError: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5); // can be adjusted based on your preference

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts`);
        setPosts(response.data);
        if (error.isError) setError({ message: '', isError: false });
      } catch (err) {
        handleAxiosError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [error.isError, currentPage]);

  const handleAxiosError = (err: unknown) => {
    let errorMessage = "An unexpected error occurred.";
    if (axios.isAxiosError(err)) {
      errorMessage = err.response ? `Server responded with a status code of ${err.response.status}` : err.request ? "The request was made but no response was received" : err.message;
    }
    console.error(errorMessage, err);
    setError({ message: errorMessage, isError: true });
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Blog Posts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error.isError ? (
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      ) : (
        <>
          <ul>
            {currentPosts.map((post) => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </li>
            ))}
          </ul>
          <div>
            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
              <button key={index + 1} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
          <button onClick={() => setCurrentPage(1)}>Refresh Posts</button>
        </>
      )}
    </div>
  );
}

export default BlogPosts;