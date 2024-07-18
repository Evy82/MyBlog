import React, { useState } from 'react';

interface BlogPost {
  title: string;
  content: string;
  author: string;
}

const AddBlogPostForm: React.FC = () => {
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: '',
    content: '',
    author: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const debugLog = (message: string) => {
    console.log(message);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    debugLog(`Form field ${name} changed to: ${value}`);
    setBlogPost({
      ...blogPost,
      [name]: value,
    });
  };

  const clearForm = () => {
    setBlogPost({
      title: '',
      content: '',
      author: '',
    });
  };

  const isFormValid = (): boolean => {
    if (!blogPost.title.trim() || !blogPost.content.trim() || !blogPost.author.trim()) {
      setFormError('All fields are required.');
      debugLog('Form validation failed. All fields are required.');
      return false;
    }
    setFormError(null); // Clear any previous errors
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    debugLog('Submitting form...');
    setIsSubmitting(true); // Start loading
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPost),
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      debugLog('Blog post added successfully!');
      clearForm();
      alert('Blog post added successfully!');
    } catch (error) {
        setFormError('Failed to add blog post. Please try again.');
        debugLoading('Failed to add blog post.');
        console.error(error);
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {formError && <div style={{ color: 'red' }}>{formError}</div>}
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={blogPost.title}
          onChange={handleFieldChange}
        />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={blogPost.content}
          onChange={handleFieldChange}
        />
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          value={blogItem.author}
          onChange={handleFieldChange}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Post'}
      </button>
    </form>
  );
};

export default AddBlogPostForm;