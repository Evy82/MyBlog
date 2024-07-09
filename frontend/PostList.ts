import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BlogPost {
  id: number;
  title: string;
  body: string;
}

interface ErrorState {
  message: string;
  isError: booln;
}

const BlogPosts: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [fetchError, setFetchError] = useState<ErrorState>({ message: '', isError: false });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [postsPerPage] = useState<number>(5);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts`);
        setBlogPosts(response.data);
        if (fetchError.isError) setFetchError({ message: '', isError: false });
      } catch (error) {
        handleFetchError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogPosts();
  }, [fetchError.isError, currentPageNumber]);

  const handleFetchError = (error: unknown) => {
    let errorMessage = "An unexpected error occurred.";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response ? `Server responded with status code ${error.response.status}` : error.request ? "The request was made but no response was received" : error.message;
    }
    console.error(errorMessage, error);
    setFetchError({ message: errorMessage, isError: true });
  };

  const indexOfLastPost = currentPageNumber * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const displayedPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  const changePage = (pageNumber: number) => setCurrentPageNumber(pageNumber);

  return (
    <div>
      <h2>Blog Posts</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : fetchError.isError ? (
        <p style={{ color: 'red' }}>Error: {fetchError.message}</p>
      ) : (
        <>
          <ul>
            {displayedPosts.map((post) => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </li>
            ))}
          </ul>
          <nav>
            {Array.from({ length: Math.ceil(blogPosts.length / postsPerPage) }, (_, index) => (
              <button key={index + 1} onClick={() => changePage(index + 1)}>
                {index + 1}
              </button>
            ))}
          </nav>
          <button onClick={() => setCurrentPageNumber(1)}>Refresh Posts</button>
        </>
      )}
    </div>
  );
}

export default BlogPosts;