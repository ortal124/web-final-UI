import React, { useState, useEffect } from 'react';
import postService from '../services/posts_service';
import commentsService from '../services/comments_service';
import { Post } from '../services/intefaces/post';
import { Comment } from '../services/intefaces/comment';
import { useParams } from 'react-router-dom';

const PostDetail: React.FC = () => {
  const postId = useParams<{ postId: string }>().postId || "";
  const currentUserId = localStorage.getItem('userId') || '';
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchPostDetails = async () => {
    try {
      let postRequest = postService.getPostById(postId).request;
      const postResponse =  await postRequest;
      let commentRequest = commentsService.getCommentsByPostId(postId).request;
      const commentsResponse = await commentRequest;

      setPost(postResponse.data);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Failed to fetch post details:", error);
    }
  };

  useEffect(() => {
    if(!postId || !currentUserId) return;
    fetchPostDetails();
  }, [postId]);

  const handleLikeToggle = async () => {
    if (!post) return;

    const isLiked = post.likes.includes(currentUserId);
    if (isLiked) {
      await postService.unLikePost(postId);
    } else {
      await postService.likePost(postId);
    }

    setPost({
      ...post,
      likes: isLiked ? post.likes.filter((id) => id !== currentUserId) : [...post.likes, currentUserId],
    });
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await commentsService.addComment(postId, newComment).request;
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleEditPost = async () => {
    if (!post) return;

    // כאן תוכל לפתוח דיאלוג או טופס לעריכת הפוסט (טקסט/תמונה)
    const updatedText = prompt("Edit your post:", post.text);
    if (updatedText) {
      await postService.updatePost(postId, null, updatedText).request;
      setPost({ ...post, text: updatedText });
    }
  };

  const onClose = () => {
    window.history.back();
  };

  const handleDeletePost = async () => {
    if (!post || post.userId !== currentUserId) return;

    await postService.deletePost(postId);
    onClose();
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-container">
      <button onClick={onClose}>Close</button>

      <div className="post-header">
        <span className="post-user">@{post.username}</span>
      </div>

      <img src={post.file} alt="Post" className="post-image" />
      <p className="post-quote">"{post.text}"</p>

      <div className="post-actions">
        <button
          onClick={handleLikeToggle}
          className={`like-button ${post.likes.includes(currentUserId) ? "liked" : ""}`}
        >
          <span className="heart-icon">{post.likes.includes(currentUserId) ? "❤️" : "🤍"}</span> {post.likes.length}
        </button>
        <span className="comment-count">{comments.length} comments</span>
      </div>

      {post.userId === currentUserId && (
        <div className="post-edit-actions">
          <button onClick={handleEditPost}>Edit</button>
          <button onClick={handleDeletePost}>Delete</button>
        </div>
      )}

      <div className="comments-section">
        <div className="comments-list">
          {comments.map((comment: any) => (
            <div key={comment._id} className="comment">
              <span className="comment-user">@{comment.username}</span>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>

        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleCommentSubmit}>Post Comment</button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
