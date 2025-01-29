"use client"
import SignInButton from "@/components/Signin";
// import { auth } from '@/auth';
// import { useSession } from "next-auth/react"
import axios from "axios";
import  Link  from "next/link";
import {useState} from "react"
import {toast} from "react-toastify"
import { useRouter } from "next/navigation";
export default function SignUp(){
    
    const router= useRouter();
    const [email,setEmail]=useState('');
    const [password,setPassword]= useState('');
    const [name ,setName]=useState('');
    const [phone ,setPhone]=useState('');
    const submitHandler=async(e:any)=>{
        e.preventDefault();
        if (!email || !password || !name) {
            toast.error("Please fill all the fields", {
              autoClose: 3000, 
              closeOnClick: true, 
            });
            return; 
        }
        const response = await axios.post(
            'api/user/signup',
            {
                email,password,
                phone,name
            }
        )
        
        // if(response.status===400 && response.data.success){
        //     toast.error(response.data.message || "Error in Registration");
        // }
        console.log("on submit",response);
        if (response.data.success){
            
            toast.success(response.data.message || "Successfully Registered");
            setTimeout(() => {
                router.push('/signin');
            }, 2000);   
            
        }
        else if(response.data.message==="User is already registered"){
            toast.error(response.data.message || "User is already registered");
            router.push('/signin');
        }
        else 
        {
            toast.error(response.data.message || "Error in Registration");
        }
    }
    return (
        <div className="min-h-screen  bg-neutral-900 text-white  flex justify-center">
            <div className="max-w-screen-xl  sm:m-5 bg-neutral-900   sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 mt-2 mb-4 shadow-blue-900 shadow-inner bg-neutral-900  rounded-lg p-6 sm:p-6">

                    <div className="  flex flex-col items-center">
                        <h1 className=" text-2xl  xl:text-3xl font-extrabold">
                            Sign Up
                        </h1>
                        <div className="w-full flex-1 mt-8">
                            <div className="flex flex-col b mb-8 items-center ">
                                <SignInButton />
                                
                            </div>

                            <div className="mx-auto max-w-xs">
                            <form method="post" onSubmit={submitHandler}>
                            <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-neutral-900 border border-gray-600 placeholder-white text-sm focus:outline-none focus:border-gray-400 focus:bg-neutral-950"
                                    type="text" name="name" placeholder="Full Name" 
                                    value ={name}
                                    onChange={(e)=>{
                                        setName(e.target.value);
                                    }}
                                    required
                                    />
                                <input
                                    className="w-full mt-3 px-8 py-4 rounded-lg font-medium bg-neutral-900 border border-gray-600 placeholder-white text-sm focus:outline-none focus:border-gray-400 focus:bg-neutral-950"
                                    type="email" name="email" placeholder="Email" 
                                    value ={email}
                                    onChange={(e)=>{
                                        setEmail(e.target.value);
                                    }}
                                    required
                                    />
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-neutral-900 border border-gray-600 placeholder-white text-sm focus:outline-none focus:border-gray-400 focus:bg-neutral-950 mt-5"
                                    type="password" name="password" placeholder="Password" 
                                    value ={password}
                                    onChange={
                                        (e)=>{
                                            setPassword(e.target.value);
                                        }
                                    }
                                    required
                                    />
                                    <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-neutral-900 border border-gray-600 placeholder-white text-sm focus:outline-none focus:border-gray-400 focus:bg-neutral-950 mt-5"
                                    type="text" name="phone" placeholder="Phone" 
                                    value ={phone}
                                    onChange={
                                        (e)=>{
                                            setPhone(e.target.value);
                                        }
                                    }
                                    />
                                <button type="submit"
                                    className="mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                    <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">
                                        Register
                                    </span>
                                </button>
                                </form>
                                <Link href="/signin" className="mt-5 text-xs text-gray-600 text-center">
                                   Alread have an account, Login
                                </Link>
                                <p className="mt-6 text-xs text-gray-600 text-center">
                                    I agree to abide by trackode's
                                    <a href="#" className="border-b border-gray-500 border-dotted">
                                        Terms of Service
                                    </a>
                                    and its
                                    <a href="#" className="border-b border-gray-500 border-dotted">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-neutral-900 text-center hidden lg:flex">
                    <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat bg-designer-life">
                    </div>
                </div>
            </div>
        </div>
    )
}