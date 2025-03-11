import { FC, useState } from "react";
import "../styles/AddPost.css";
import { useNavigate } from "react-router-dom";
import postService from "../services/posts_service";
import { Sparkles } from "lucide-react";
import icon from "../../fairy-icon.webp";

const AddPost: FC = () => {
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCreatePost = async () => {
        try {
            if (!text) {
                alert("הזן טקסט לפני הפרסום!");
                return;
            }
            if (!image) {
                alert("הזן תמונה לפני הפרסום או תבקש מפיקסי לעזור לך");
                return;
            }
            const { request } = postService.createPost(image, text);
            const res = await request;
            if (res.status === 201) {
                console.log("Post added successfully");
                navigate("/feed");
            }
        } catch (err: any) {
            console.error("Error adding post:", err);
        }
    };

    const handleGenerateText = async () => {
        if (!image) {
            alert("אנא העלה תמונה תחילה.");
            return;
        }
        setLoading(true);
        try {
            const { request } = postService.generateTextFromImage(image); 
            const res = await request;
            setText(res.data.text.quote);
        } catch (error) {
            console.error("Error generating text:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-post-container">
            <div className="add-post-form-container">
                <h2>Add a New Post</h2>
                <input
                    type="file"
                    className="input"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <div className="text-input-container">
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter your quote"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="fairy-icon" onClick={handleGenerateText}>
                        {loading ? <Sparkles className="loading-icon" /> : <img src={icon} alt="Pixie" />}
                    </div>
                </div>
                <button className="btn" onClick={handleCreatePost}>Post</button>
            </div>
        </div>
    );
};

export default AddPost;
