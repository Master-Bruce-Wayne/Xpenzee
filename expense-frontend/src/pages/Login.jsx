import {useForm } from 'react-hook-form'
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import './style.css'

function Login(){
    const{
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data);
        console.log("Frontend check 1")
        try {
            const response = await axios.post("http://localhost:8000/user/login", data,
                { withCredentials: true}
            );
            console.log("Fromtend chdeck 2")
            console.log("Response: ",response)
            console.log("User Logged in:", response.data);
            alert("Login successful!");
            navigate("/");

        } catch (error) {
            console.log("Frontend error")
            console.error("Error during login:", error);
            alert(error);
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
                <p className='mx-auto w-full mt-2 text-center'>Don't have an account?{"  "} 
                    <Link to='/signup' className='hover:underline hover:text-blue-700'>SignUp</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;