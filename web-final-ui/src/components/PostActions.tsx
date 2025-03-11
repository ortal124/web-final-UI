import React from 'react';
import { Post } from '../services/intefaces/post';

interface PostActionsProps {
  post: Post;
  currentUserId: string;
  onLikeToggle: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  currentUserId,
  onLikeToggle
}) => {
  return (
    <div className="post-actions">
      <button
        onClick={onLikeToggle}
        className={`like-button ${post.likes.includes(currentUserId) ? "liked" : ""}`}
      >
        <span className="heart-icon">{post.likes.includes(currentUserId) ? "❤️" : "🤍"}</span> {post.likes.length}
      </button>
      <span className="comment-count">
        {post.comments?.length || 0} comments
      </span>
    </div>
  );
};

export default PostActions;
