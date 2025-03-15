import React from 'react';
import { Post } from '../services/intefaces/post';
import "../styles/PostActions.css";

interface PostActionsProps {
  post: Post;
  currentUserId: string;
  onLikeToggle: () => void;
  showComments?: boolean 
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  currentUserId,
  onLikeToggle,
  showComments = true
}) => {
  return (
    <div className="post-actions">
      <button
        onClick={onLikeToggle}
        className={`like-button`}
      >
        <span className="heart-icon">{post.likes.includes(currentUserId) ? "❤️" : "🤍"}</span> {post.likes.length}
      </button>
      { showComments &&
        <span className="comment-count">
          comments ({post.comments?.length || 0})
        </span>
      }
    </div>
  );
};

export default PostActions;
