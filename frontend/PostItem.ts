import React from 'react';

interface BlogPostProps {
    id: string;
    title: string;
    content: string;
    onEdit: (id: string) => void;
    onDelete: (id:string) => void;
    onView: (id: string) => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ id, title, content, onEdit, onDelete, onView }) => {
    return (
        <div className="blogPost">
            <h2>{title}</h2>
            <p>{content}</p>
            <div className="actions">
                <button onClick={() => onView(id)}>View</button>
                <button onClick={() => onEdit(id)}>Edit</button>
                <button onClick={() => onDelete(id)}>Delete</button>
            </div>
        </div>
    );
};

export default BlogPost;