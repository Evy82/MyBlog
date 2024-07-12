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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      setFormData({
        title: '',
        content: '',
        author: '',
      });
      
      alert('Blog post added successfully!');
    } catch (error) {
      alert('Failed to add blog post. Please try again.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Add Post</button>
    </form>
  );
};

export default AddBlogPost;