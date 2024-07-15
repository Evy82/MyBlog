import React, { useState } from 'react';

interface BlogPostFormData {
  title: string;
  content: string;
  author: string;
}

const AddBlogPost: React.FC = () => {
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    content: '',
    author: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logOutput = (message: string) => {
    console.log(message);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    logOutput(`Form field ${name} changed to: ${value}`);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
    });
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setError('All fields are required.');
      logOutput('Form validation failed. All fields are required.');
      return false;
    }
    setError(null); // Clear any previous errors
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    logOutput('Submitting form...');
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      logOutput('Blog post added successfully!');
      resetForm();
      alert('Blog post added successfully!');
    } catch (error) {
      setError('Failed to add blog post. Please try again.');
      logOutput('Failed to add blog determination.');
      console.error(error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Post'}
      </button>
    </form>
  );
};

export default AddBlogPost;