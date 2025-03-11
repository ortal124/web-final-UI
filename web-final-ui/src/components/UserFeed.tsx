import React, { useCallback, useEffect, useRef, useState } from "react";
import "../styles/Feed.css";
import postService from "../services/posts_service";
import { Post } from "../services/intefaces/post";
import userService from "../services/user_service";
import commentsService from "../services/comments_service";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const currentUser = localStorage.getItem("userId") || "";

  const fetchUserData = async (userId: string) => {
    try {
      const {request} = userService.getUserProfile(userId);
      const res = await request;
      return res.data.username;
    } catch (error) {
      console.error("Failed to fetch userDetails:", error);
    }
  };

  const fetchPostComments = async (postId: string) => {
    try {
      const {request} = commentsService.getCommentsByPostId(postId);
      const res = await request;
      return res.data;
    } catch (error) {
      console.error("Failed to fetch userDetails:", error);
    }
  };

  const fetchPosts = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const { request } = postService.getPosts(page, 5);
      const response = await request;
      const { downloadedPosts, totalPages } = response.data;

      for (let post of downloadedPosts) {
        const username = await fetchUserData(post.userId);
        post.username = username;
        const comments = await fetchPostComments(post._id!!);
        post.comments = comments || [];
      }

      setPosts((prevPosts) => [...prevPosts, ...downloadedPosts]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleLike = async (postId: string) => {
    try {
      const post = posts.find((p) => p._id === postId);
      if (!post) return;

      const isLiked = post.likes.includes(currentUser);
      if (isLiked) {
        await postService.unLikePost(postId);
      } else {
        await postService.likePost(postId);
      }

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: isLiked
                  ? p.likes.filter((id) => id !== currentUser)
                  : [...p.likes, currentUser],
              }
            : p
        )
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <div className="feed-container">
      {posts.map((post, index) => {
        const isLastPost = index === posts.length - 1;
        return(
          <div key={post._id} className="post-card" ref={isLastPost ? lastPostRef : null}>
            <div className="post-header">
              <span className="post-user">@{post.username}</span>
            </div>
            <img src={post.file} alt="Post" className="post-image" />
            <p className="post-quote">"{post.text}"</p>

            <div className="post-actions">
              <button
                onClick={() => toggleLike(post._id!!)}
                className={`like-button ${post.likes.includes(currentUser) ? "liked" : ""}`}
              >
                <span className="heart-icon">{post.likes.includes(currentUser) ? "❤️" : "🤍"}</span> {post.likes.length}
              </button>
              <span className="comment-count">{post.comments?.length || 0} comments</span>
            </div>
          </div>
     )})}
      {loading && <p>טוען עוד פוסטים...</p>}
    </div>
  );
};

export default Feed;
