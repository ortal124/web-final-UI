import { FC } from "react";
import "../styles/UserProfile.css";

const UserProfile: FC = () => {
    // נתוני משתמש לדוגמה
    const user = {
        username: "your_username",
        email: "your_email@example.com",
        profilePic: "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg", // תמונת פרופיל דיפולטיבית
        posts: [
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/58/Agam_Rudberg.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShwIjkuVHQmfZc5-JIYTEe_Sqkur-4Xu3WAw&s",
        ],
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src={user.profilePic} alt="Profile" className="profile-pic" />
                <div className="profile-info">
                    <h2 className="profile-username">{user.username}</h2>
                    <p className="profile-email">{user.email}</p>
                </div>
            </div>
            <div className="posts-grid">
                {user.posts.map((post, index) => (
                    <img key={index} src={post} alt="Post" className="post-item" />
                ))}
            </div>
        </div>
    );
};

export default UserProfile;