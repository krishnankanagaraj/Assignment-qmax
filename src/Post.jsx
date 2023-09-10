import React from 'react';

const Post = ({ id, title, onDelete }) => {
  const handleDelete = () => onDelete(id);

  return (
    <div>
      <h3>{title}</h3>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Post;
