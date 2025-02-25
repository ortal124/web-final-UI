import { FC } from 'react';
import "../styles/AddPost.css";

const AddPost: FC = () => {
    return (
        <div className="container">
            <div className="form-container">
                <h2>Add a New Post</h2>
                <input type="text" className="input" placeholder="Enter your quote" />
                <input type="file" className="input" />
                <button className="btn">Post</button>
            </div>
        </div>
    );
};
export default AddPost;