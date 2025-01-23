import { zodResolver } from '@hookform/resolvers/zod'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { User } from '../services/intefaces/user';
import userService from '../services/auth_service';

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

    const onSubmit = (data: RegisterFormData) => {
        console.log(data)
        const user: User = {
            username: data.username,
            email: data.email,
            password: data.password,
        }
        const { request } = userService.register(user)
        request.then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.error(error)
        })   
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'lightgray',
                    padding: '10px',
                    margin: '10px',
                    borderRadius: '5px',
                    width: '50%',
                    justifyContent: 'center',
                    gap: '5px'
                }}>
                    <h2 style={{ alignSelf: 'center' }}>Registration Form</h2>
                    <label>username:</label>
                    <input {...register("username")} type="text" className='form-control' />
                    {errors.username && <p className='text-danger'>{errors.username.message}</p>}
                    <label>email:</label>
                    <input {...register("email")} type="text" className='form-control' />
                    {errors.email && <p className='text-danger'>{errors.email.message}</p>}
                    <label>password:</label>
                    <input {...register("password")} type="password" className='form-control' />
                    {errors.password && <p className='text-danger'>{errors.password.message}</p>}
                    <button type="submit" className="btn btn-outline-primary mt-3" >Register</button>
                </div>
            </div>
        </form>
    )
}

export default RegistrationForm