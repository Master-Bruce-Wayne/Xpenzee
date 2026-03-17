import {useForm } from 'react-hook-form'
import { useNavigate,Link } from "react-router-dom";
import './style.css'
import { toast } from 'react-toastify';

import { auth, googleProvider } from "../firebase.js";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function Login(){
    const{
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const navigate = useNavigate();

    // added fire-base
    const onSubmit = async (data) => {
        console.log(data);
        try {
            await signInWithEmailAndPassword(auth,data.email,data.password);
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Failed to login!");
        }
    }

    // added fire-base
    const handleGoogleSignIn = async() => {
        try {
            await signInWithPopup(auth,googleProvider);
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Failed to login!");
        }
    }

    return (
        <div className='bg-slate-800 h-screen w-screen flex flex-col justify-center align-middle'>

            <div className='mx-auto text-black font-montserrat flex-col'>

                <h2 className='w-full flex justify-center mb-2'>LOGIN</h2>
                <form action="" onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>

                    <input {...register('email')} type="text" id='' placeholder='Email'
                    className='p-3 rounded-3xl mb-2 w-80 '
                    />
                    {errors.email && <p>Email is required</p>}

                    <input {...register('password')} type="text" id='' placeholder='Password'
                    className='p-3 rounded-3xl mb-2 w-80 '
                    />
                    {errors.password && <p>Password is required</p>}

                    <input 
                    className='p-3 rounded-3xl bg-white w-80 text-black hover:bg-blue-600 hover:text-white'
                    type="submit" value='Submit' />
                </form>

                <button onClick={handleGoogleSignIn}>
                    Sign in with Google
                </button>
                <p className='mx-auto w-full mt-2 text-center'>Don't have an account?{"  "} 
                    <Link to='/signup' className='hover:underline hover:text-blue-700'>SignUp</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;