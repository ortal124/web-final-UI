import React, { useState } from "react";
import "../styles/Feed.css";

// מבנה נתוני פוסט
interface Post {
  id: number;
  user: string;
  image: string;
  quote: string;
  likes: number;
  likedByUser: boolean;
  comments: { user: string; text: string }[];
}

// רשימת פוסטים לדוגמה
const initialPosts: Post[] = [
  {
    id: 1,
    user: "Alice",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
    quote: "The best way to predict the future is to create it.",
    likes: 10,
    likedByUser: false,
    comments: [
      { user: "Bob", text: "Amazing!" },
      { user: "Charlie", text: "Love this!" },
    ],
  },
  {
    id: 2,
    user: "Bob",
    image: "https://source.unsplash.com/600x400?city",
    quote: "Believe you can and you're halfway there.",
    likes: 5,
    likedByUser: false,
    comments: [{ user: "Alice", text: "So true!" }],
  },
];

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const currentUser = "You"; // היוזר הנוכחי

  // פונקציה ללייק/הסרת לייק
  const toggleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              likedByUser: !post.likedByUser,
            }
          : post
      )
    );
  };

  // פונקציה להוספת תגובה
  const addComment = (postId: number, commentText: string) => {
    if (!commentText.trim()) return;
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { user: currentUser, text: commentText }],
            }
          : post
      )
    );
  };

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <span className="post-user">@{post.user}</span>
          </div>
          <img src={post.image} alt="Post" className="post-image" />
          <p className="post-quote">"{post.quote}"</p>

          <div className="post-actions">
            <button
              onClick={() => toggleLike(post.id)}
              className={`like-button ${post.likedByUser ? "liked" : ""}`}
            >
              <span className="heart-icon">❤️</span> {post.likes}
            </button>
          </div>

          <div className="comments-section">
            {post.comments.map((comment, index) => (
              <p key={index} className="comment">
                <strong>@{comment.user}:</strong> {comment.text}
              </p>
            ))}
            <input
              type="text"
              placeholder="Add a comment..."
              className="comment-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addComment(post.id, e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
