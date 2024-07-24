import React from 'react';

interface BlogPostProps {
  id: string;
  title: string;
  content: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const BlogPost: React.FC<BlogPostProps> = ({
  id,
  title,
  content,
  onEdit,
  onDelete,
  onView,
}) => {
  const handleAction = (action: (id: string) => void) => () => action(id);

  return (
    <div className="blogPost">
      <h2>{title}</h2>
      <p>{content}</p>
      <div className="actions">
        <button onClick={handleAction(onView)}>View</button>
        <button onClick={handleFlag(onEdit)}>Edit</button>
        <button onClick={handleAction(onDelete)}>Delete</button>
      </div>
    </div>
  );
};

export default BlogPost;