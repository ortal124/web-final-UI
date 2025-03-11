import { FC, useEffect, useState } from "react";
import "../styles/UserProfile.css";
import userService from "../services/user_service";
import postService from "../services/posts_service";
import { Post } from "../services/intefaces/post";

const UserProfile: FC = () => {
    const id = localStorage.getItem("userId") ;
    const [user, setUser] = useState<{ username: string; email: string; profileImage?: string } | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!id) return;
            try {
                const { request } = userService.getUserProfile(id);
                const res = await request;
                setUser({ username: res.data.username, email: res.data.email, profileImage: res.data.profileImage });
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
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src={user.profileImage} alt="Profile" className="profile-pic" />
                <div className="profile-info">
                    <h2 className="profile-username">{user.username}</h2>
                    <p className="profile-email">{user.email}</p>
                </div>
            </div>
            <div className="posts-grid">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <img key={index} src={post.file} alt="Post" className="post-item" />
                    ))
                ) : (
                    <p>No posts yet</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;