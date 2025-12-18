import {useForm } from 'react-hook-form'
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function SignUp(){
    const{
        register,
        handleSubmit,
        formState: { errors,isSubmitting }
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async(data) => {
        console.log(data)
        try {
            const response = await axios.post("http://localhost:8000/user/signup", data ,{
                headers: {
                  'Access-Control-Allow-Origin':'*',
                },},
                { withCredentials: true }
              );
            console.log("User Registered:", response.data);
            console.log('Response received: ', response)
            console.log('Response.data: ', response.data)
            alert("Sign-up successful!");
            navigate("/");
            
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert("Failed to register. Please try again.");
        }
    }

    return (
    
        <div className='bg-slate-800 h-screen w-screen flex flex-col justify-center align-middle'>

            <div className='mx-auto text-black font-montserrat flex-col'>

                <h2 className='w-full flex justify-center mb-2'>SIGN-UP</h2>
                <form action="" onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>

                    <input {...register('name', { required:true})} type="text" id='' placeholder='Name' className='p-3 rounded-3xl mb-2 w-80 '/>
                    {errors.name && <div>Username is required</div>}

                    <input {...register('email', { required:true})} type="text" id='' placeholder='Email' className='p-3 rounded-3xl mb-2 w-80 '/>
                    {errors.email && <div>Email is required</div>}

                    <input {...register('password', { required:true})} type="password" id='' placeholder='Password' className='p-3 rounded-3xl mb-2 w-80 '/>
                    {errors.password && <div>Password is required</div>}

                    <input className='p-3 rounded-3xl bg-white w-80 text-black hover:bg-blue-600 hover:text-white' type="submit" value='Submit' disabled={isSubmitting} />
                </form>
                <p className='mx-auto w-full text-center mt-2'>Already a signed-up user?{" "}
                    <Link to='/login' className='hover:underline hover:text-blue-600'>Login</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp;