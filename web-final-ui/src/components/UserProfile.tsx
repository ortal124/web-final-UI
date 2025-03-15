import { FC, useEffect, useRef, useState } from "react";
import "../styles/UserProfile.css";
import userService from "../services/user_service";
import postService from "../services/posts_service";
import { Post } from "../services/intefaces/post";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../icons/defaule-profile.avif";

const UserProfile: FC = () => {
    const id = localStorage.getItem("userId");
    const [user, setUser] = useState<{ username: string; email: string; profileImage?: string | null } | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.username || "");
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
    const [oldProfileImage, setOldProfileImage] = useState<String | null>(null);
    const [editProfileImageError, setEditProfileImageError] = useState<string | null>(null);
    const [profileImageChanged, setProfileImageChanged] = useState(false); 
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!id) return;
            try {
                const { request } = userService.getUserProfile(id);
                const res = await request;
                setUser({ username: res.data.username, email: res.data.email, profileImage: res.data.file });
                setNewUsername(res.data.username);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        const fetchUserPosts = async () => {
            if (!id) return;
            try {
                const { request } = postService.getPostsByUserId(id);
                const res = await request;
                setPosts(res.data);
            } catch (error) {
                console.error("Error fetching user posts:", error);
            }
        };

        Promise.all([fetchUserProfile(), fetchUserPosts()]).finally(() => setLoading(false));
    }, [id, location]);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUsername(e.target.value);
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return; 
    
        setOldProfileImage(user?.profileImage ?? null);    
        setNewProfileImage(file);
        
        const imageUrl = URL.createObjectURL(file);
        setUser((prev) => prev ? { ...prev, profileImage: imageUrl } : null);
        setProfileImageChanged(true); 
    };
    
    const handlePostClick = (postId: string) => {
        navigate(`/post/${postId}`);
    };

    const handleEditUsername = async () => {
        if (newUsername !== user?.username) {
            try {
                await userService.updateUserName(newUsername);
                setUser((prev) => prev ? { ...prev, username: newUsername } : null);
            } catch (error) {
                console.error("Error updating username:", error);
            }
        }
        setIsEditingUsername(false);
    };

    const cancelEditUsername = () => {
        setIsEditingUsername(false);
        setNewUsername(user?.username || "");
    }

    const handleEditProfileImage = async () => {
        if (newProfileImage) {
            try {
                await userService.addUserPhoto(id!!, newProfileImage);
                setUser((prev) => prev ? { ...prev, profileImage: URL.createObjectURL(newProfileImage) } : null);
                setProfileImageChanged(false); // Reset after success
            } catch (error) {
                console.error("Error updating profile image:", error);
                setEditProfileImageError("Failed to update profile picture. Please try again.");
            }
        }
    };

    const handleCancelProfileImageChange = () => {
        // Reset
        setProfileImageChanged(false);
        setUser((prev) => prev ? { ...prev, profileImage: oldProfileImage as string | undefined } : user);
        setNewProfileImage(null);
        setOldProfileImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-pic-container">
                    <img
                        src={user.profileImage || defaultProfilePic}
                        alt="Profile"
                        className="profile-pic"
                    />
                    <input
                        type="file"
                        id="profile-image-input"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleProfileImageChange}
                    />
                    {profileImageChanged ? (
                        <div className="profile-image-actions">
                            <button onClick={handleEditProfileImage} className="edit-action-button">
                                Save
                            </button>
                            <button onClick={handleCancelProfileImageChange} className="edit-action-button">
                                Cancel
                            </button>
                        </div>
                    ):
                    <button className="edit-button" onClick={() => document.getElementById("profile-image-input")?.click()}>
                    ✏️
                    </button>
                    }
                </div>
                <div className="profile-info">
                    {isEditingUsername ? (
                        <div>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={handleUsernameChange}
                                className="username-input"
                            />
                            <button 
                                onClick={handleEditUsername}
                                className="edit-action-button"
                                disabled={!newUsername || newUsername === user.username}>
                                Save
                            </button>
                            <button onClick={cancelEditUsername} className="edit-action-button">
                                cancel
                            </button>
                        </div>
                    ) : (
                        <h2 className="profile-username">
                            {user.username || user.username}
                            <button className="edit-button" onClick={() => setIsEditingUsername(true)}>
                                ✏️
                            </button>
                        </h2>
                    )}
                    <p className="profile-email">{user.email}</p>
                    {editProfileImageError && <p className="error-message">{editProfileImageError}</p>}
                </div>
            </div>
            <div className="posts-grid">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <img key={index} src={post.file} alt="Post" className="post-item" onClick={() => handlePostClick(post._id!!)}/>
                    ))
                ) : (
                    <p>No posts yet</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
