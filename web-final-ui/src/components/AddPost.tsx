import { FC, useState } from "react";
import "../styles/AddPost.css";
import { useNavigate } from "react-router-dom";
import postService from "../services/posts_service";
import { Sparkles } from "lucide-react";
import icon from "../icons/fairy-icon.webp";
import default_preview from "../icons/default_add_image.jpeg";


const AddPost: FC = () => {
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string>(default_preview);

    const handleCreatePost = async () => {
        try {
            if(!text && !image) {
                alert("הזן תמונה וטקסט לפני הפרסום!");
                return;
            }  
            if (!image) {
                alert("הזן תמונה לפני הפרסום");
                return;
            }
            if (!text) {
                alert("הזן טקסט לפני הפרסום! או תבקש מפיקסי לעזור לך");
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="add-post-container">
            <div className="add-post-form-container">
                <h2>✨ Add a New Post ✨</h2>   
                <input
                    type="file" 
                    className="input" 
                    onChange={handleImageChange} />
                <img src={preview} alt="Preview" className="preview-img" />
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
                <button 
                    className="btn"
                    onClick={handleCreatePost}
                    disabled={!text || !image}>
                        Post
                    </button>
            </div>
        </div>
    );
};

export default AddPost;
