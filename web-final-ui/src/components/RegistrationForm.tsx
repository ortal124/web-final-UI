import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { User } from '../services/intefaces/user';
import userService from '../services/auth_service';
import "../styles/auth.css";
import { useNavigate } from 'react-router-dom';

const schema = z.object({
    username: z
        .string()
        .nonempty("Username is required")
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),
    password: z
        .string()
        .nonempty("Password is required")
        .min(5, "Password must be at least 5 characters long"),
    email: z
        .string()
        .nonempty("Email is required")
        .email("Email must be in a valid format"),
    profileImage: z.instanceof(File).optional(),
});

type RegisterFormData = z.infer<typeof schema>

const RegistrationForm: FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isValid } }
    = useForm<RegisterFormData>({ resolver: zodResolver(schema), mode: 'onChange' });
    const [error, setError] = useState<string | null>(null); // State for error message
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('email', data.email);
            formData.append('password', data.password);
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }
    
            const response = await userService.register(formData);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="container">
            <div className="welcome-container">
                <h2>Welcome Back!</h2>
                <p>To keep connected with us please login with your personal info</p>
                <button className="btn-outline" onClick={() => navigate('/login')}>Sign In</button>
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Create Account</h2>
                    <div className="social-icons">
                        <button className="social-btn">G+</button>
                    </div>
                    <p>or use your email for registration:</p>
                    <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: "none" }}  id="fileInput"  />
                    {preview && (
                        <div className="image-preview-container">
                            <img src={preview} alt="Profile Preview" className="profile-preview" />
                        </div>
                    )}
                    <button 
                        type="button" 
                        className="upload-btn" 
                        onClick={() => document.getElementById("fileInput")?.click()}>
                        {preview ? "Change Image" : "Upload Image"}
                    </button>
                    <input {...register("username")} type="text" className="input" placeholder="Name" />
                    {errors.username && <p className="error">{errors.username.message}</p>}
                    
                    <input {...register("email")} type="text" className="input" placeholder="Email" />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                    
                    <input {...register("password")} type="password" className="input" placeholder="Password" />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                    
                    {error && <p className="error">{error}</p>}
                    
                    <button type="submit" className="btn" disabled={!isValid}>Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default RegistrationForm