import { FC, useState } from 'react';
import "../styles/AddPost.css";
import { useNavigate } from 'react-router-dom';
import postService from '../services/posts_service';
import { Post } from '../services/intefaces/post';

const AddPost: FC = () => {
    const navigate = useNavigate();
    
    const [text, setText] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);

    const handleAddPost = async () => {
        if (!text || !image) {
            console.log('Please fill in both text and image fields.');
            return;
        }

        const postData: Partial<Post> = {
            text,
            image
        };

        try {
            const { request } = postService.createPost(postData.image!!, postData.text!!);
            const res = await request;
            if (res.status === 201) {
                console.log("Post added successfully");
                navigate('/feed');
            }
        } catch (err: any) {
            console.log("Error adding post:", err);
        }
    };

    return (
        <div className="add-post-container">
            <div className="form-container">
                <h2>Add a New Post</h2>
                <input
                    type="text"
                    className="input"
                    placeholder="Enter your quote"
                    value={text}
                    onChange={(e) => setText(e.target.value)}  // Update the text state
                />
                <input
                    type="file"
                    className="input"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}  // Update the image state
                />
                <button className="btn" onClick={handleAddPost}>Post</button>
            </div>
        </div>
    );
};

export default AddPost;
