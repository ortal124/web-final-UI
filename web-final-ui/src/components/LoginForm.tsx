import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useAuth } from "./auth-utils/AuthContext";
import userService from '../services/auth_service';
import "../styles/auth.css";
import { useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

const schema = z.object({
    username: z
        .string()
        .nonempty("Username is required"),
    password: z
        .string()
        .nonempty("Password is required")
});

type LoginFormData = z.infer<typeof schema>;

const LoginForm: FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isValid } } 
    = useForm<LoginFormData>({ resolver: zodResolver(schema), mode: 'onChange' });
    const [error, setError] = useState<string | null>(null);
    const {login} = useAuth();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const { request } = await userService.login({ username: data.username, password: data.password });
            const res = await request;
            login(res.data.userId, res.data.accessToken, res.data.refreshToken);
            setError(null);
            navigate('/feed');
        } catch (err: any) {
            const errorMessage = handleError(err);
            setError(errorMessage);
        }
    };

    const onGoogleSuccess = async (response: CredentialResponse) => {
        try {
            if (!response.credential) {
                setError("Google Sign In Failed");
                return;
            }
            const { request } = userService.googleSignIn(response.credential);
            const res = await request;
            login(res.data.userId, res.data.accessToken, res.data.refreshToken);
            setError(null);
            navigate('/feed');
        } catch (err: any) {
            const errorMessage = handleError(err);
            setError(errorMessage);
        }
    };

    const onGoogleFailure = () => {
        setError("Google Sign In Failed");
    };

    const handleError = (err: any) => {
        return err.response?.data?.message ||
            (err.response?.status === 400 ? "Invalid username or password." :
            err.response?.status === 500 ? "Server error. Please try again later." :
            err.request ? "Network error. Please check your connection." :
            "An unexpected error occurred. Please try again.");
    };

    return (
        <div className="container">
            <div className="welcome-container">
                <h2>Hello, Friend!</h2>
                <p>New here? Create an account to join us!</p>
                <button className="btn-outline" onClick={() => navigate('/register')}>Sign Up</button>
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Sign In</h2>
                    <div className="social-icons">
                        <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleFailure} />
                    </div>
                    <p>or use your email account:</p>
                    <input {...register("username")} type="text" className="input" placeholder="username" />
                    {errors.username && <p className="error">{errors.username.message}</p>}
                    
                    <input {...register("password")} type="password" className="input" placeholder="Password" />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                    
                    {error && <p className="error">{error}</p>}
                    
                    <button type="submit" className="btn" disabled={!isValid}>Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
