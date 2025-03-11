import React, { useState, useEffect } from 'react';
import postService from '../services/posts_service';
import commentsService from '../services/comments_service';
import userService from '../services/user_service';
import { Post } from '../services/intefaces/post';
import { Comment } from '../services/intefaces/comment';
import { useNavigate, useParams } from 'react-router-dom';
import PostActions from './PostActions';

const PostDetail: React.FC = () => {
  const postId = useParams<{ postId: string }>().postId || "";
  const currentUserId = localStorage.getItem('userId') || '';
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!postId || !currentUserId) return;
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      const postResponse = await postService.getPostById(postId).request;
      const commentsResponse = await commentsService.getCommentsByPostId(postId).request;
      const userResponse = await userService.getUserProfile(postResponse.data.userId).request;
      
      const updatedComments = await Promise.all(commentsResponse.data.map(async (comment) => {
        const userCommentResponse = await userService.getUserProfile(comment.userId).request;
        return { ...comment, username: userCommentResponse.data.username };
      }));
      
      setPost({ ...postResponse.data, username: userResponse.data.username, comments: updatedComments });
      setComments(updatedComments);
    } catch (error) {
      console.error("Failed to fetch post details:", error);
    }
  };

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
  const handleEditPost = () => {
    if (!post) return;
    setEditedText(post.text);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedImage(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setEditedImage(event.target.files[0]);
    }
  };

  const handleSaveEdit = async () => {
    if (!post || (!editedImage && editedText === post.text)) return;    
    await postService.updatePost(postId, editedImage, editedText).request;
    fetchPostDetails();
    setIsEditing(false);
  };

  const handleDeletePost = async () => {
    if (!post || post.userId !== currentUserId) return;
    await postService.deletePost(postId);
    navigate(-1);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-container">
      <button onClick={() => navigate(-1)}>Close</button>
      <div className="post-header">
        <span className="post-user">@{post.username}</span>
      </div>

      {isEditing ? (
        <div>
          <img src={editedImage ? URL.createObjectURL(editedImage) : post.file} alt="Post" className="post-image" />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      ) : (
        <div>
          <img src={post.file} alt="Post" className="post-image" />
          <p className="post-quote">"{post.text}"</p>
        </div>
      )}

      <PostActions post={post} currentUserId={currentUserId} onLikeToggle={handleLikeToggle} />

      {post.userId === currentUserId && !isEditing && (
        <div className="post-edit-actions">
          <button onClick={handleEditPost}>Edit</button>
          <button onClick={handleDeletePost}>Delete</button>
        </div>
      )}

      <div className="comments-section">
        <div className="comments-list">
          {comments.map((comment) => (
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
