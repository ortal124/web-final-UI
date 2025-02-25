import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { User } from '../services/intefaces/user';
import userService from '../services/auth_service';
import "../styles/auth.css";

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
});

type RegisterFormData = z.infer<typeof schema>

const RegistrationForm: FC = () => {
    const { register, handleSubmit, formState: { errors } }
    = useForm<RegisterFormData>({ resolver: zodResolver(schema), mode: 'onChange' });
    const [error, setError] = useState<string | null>(null); // State for error message


    const onSubmit = (data: RegisterFormData) => {
        try {
            const user: User = {
                username: data.username,
                email: data.email,
                password: data.password,
            }
            const { request } = userService.register(user)
            request.then((data) => {
                const { request } = userService.login(user)
                request.then((response) => {
                    //localStorage.setItem("authToken", response.data.accessToken);

                });

                //navigate("/");
            })
            setError(null);
        } catch (err: any) {
            console.log(err)
            if (err.response) {
                setError(err.response?.data?.message || "Something went wrong!");
            } else if (err.request) {
                setError("Network error. Please try again later.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            } 
       } 
    }

    return (
        <div className="container">
            <div className="welcome-container">
                <h2>Welcome Back!</h2>
                <p>To keep connected with us please login with your personal info</p>
                <button className="btn-outline">Sign In</button>
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Create Account</h2>
                    <div className="social-icons">
                        <button className="social-btn">G+</button>
                    </div>
                    <p>or use your email for registration:</p>
                    <input {...register("username")} type="text" className="input" placeholder="Name" />
                    {errors.username && <p className="error">{errors.username.message}</p>}
                    
                    <input {...register("email")} type="text" className="input" placeholder="Email" />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                    
                    <input {...register("password")} type="password" className="input" placeholder="Password" />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                    
                    {error && <p className="error">{error}</p>}
                    
                    <button type="submit" className="btn">Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default RegistrationForm