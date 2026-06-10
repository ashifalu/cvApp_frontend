import { useState } from "react";
import Modal from "../../Modal";
import { useNavigate } from "react-router-dom";
import {googleloginApi, loginApi, registerApi, verifyEmailApi} from "../../services/allApi";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


const UserAuth = ({ isOpen, onClose, mode }) => {

  const [sentOtp, setSentOtp] = useState(false);
  const [checkMode, setCheckmode] = useState(mode);
  const [userOtp, setUserOtp] = useState("");
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate()

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }
  const [errors, setErrors] = useState({})

  const vaidate = () => {
    const { email, password } = userDetails;
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

  }

  const handleSendOtp = async () => {
    const { email, password } = userDetails;
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const result = await verifyEmailApi({ email });
    if (result.status == 200) {
      alert(result.data.message);
      setSentOtp(true);
    }
    else if (result.status == 400) {
      alert(result.response.data.message);
    }
    else {
      alert("Failed to send OTP")
    }



  };


  const registration = async () => {
    vaidate();
    if (!userOtp.trim()) {
      alert("OTP is required");
      return;
    }

    const result = await registerApi({
      email: userDetails.email,
      password: userDetails.password,
      otp: userOtp
    });

    if (result.status == 200) {
      sessionStorage.setItem("existingUser", JSON.stringify(result.data.user))
      sessionStorage.setItem("token", result.data.token)
      alert(result.data.message);
      setSentOtp(true);
    }
    else if (result.status == 400) {
      alert(result.response.data.message);
    }
    else {
      alert("Failed to send OTP")
    }
    onClose();
    console.log(result);

    navigate(`/user-profile/${result.data.user._id}`)

  };

  const handleGoogleLogin = async(credentialResponse) => {
    const details = jwtDecode(credentialResponse.credential);
    console.log(details)
    const result = await googleloginApi({email:details.email,firstName:details.given_name,lastName:details.family_name,photo:details.picture})
    console.log(result)
  }

  const login = async () => {
    if(!userDetails.email || !userDetails.password){
      vaidate()
    }else{
      const result = await loginApi({
        email: userDetails.email,
        password: userDetails.password
      });
      if (result.status == 200) {
        sessionStorage.setItem("existingUser", JSON.stringify(result.data.user))
        sessionStorage.setItem("token", result.data.token)
        alert(result.data.message);
        navigate(`/user-profile/${result.data.user._id}`)
      }
      else if (result.status == 400 || result.status == 401) {
        alert(result.response.data.message);
      }
      else {
        alert("somethimg went wrong")
      }
      onClose();
      console.log(result);
      navigate(`/user-profile/${result.data.user._id}`)
    }
  }
  return (
    <>
       <Modal isOpen={isOpen} onClose={onClose}>

        <div className="p-8 md:p-12">
         { !sentOtp ?  <div>
          <div className="text-center mb-10">
            {checkMode === "login" ?<h2 className="font-headline-lg text-[32px] text-on-surface mb-2">Sign In</h2>
            :
            <h2 className="font-headline-lg text-[32px] text-on-surface mb-2">Sign Up</h2>
            }
            <p className="font-body-md text-on-surface-variant">Welcome back! Please enter your details.</p>
          </div>
          <form action="#" className="space-y-5">
            <div className="space-y-2">
              <label className="font-label-bold text-on-surface-variant block" for="email">Email Address</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60" onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} id="email" placeholder="name@company.com" type="email" />
                {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                {checkMode === "login" ?<label className="font-label-bold text-on-surface-variant block" htmlFor="password">Password</label>
                    :
                  <label className="font-label-bold text-on-surface-variant block" htmlFor="password">Set a Password</label>}
                <a className="text-[13px] font-bold text-primary hover:text-secondary transition-colors" href="#">Forgot
                  Password?</a>
              </div>
              <div className="relative group">
                <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60" onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}  id="password" placeholder="••••••••" type="password" />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-on-surface-variant" type="button">visibility</button>
                {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
              </div>
            </div>
            {checkMode === "login" ?<button onClick={login} className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-button text-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"  >
              Sign In
            </button>
            :
            <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-button text-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4" type="submit" onClick={handleSendOtp}>
              Send Otp
            </button>
          }
          </form>
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-container-lowest px-4 text-outline text-sm font-medium">or continue with</span>
            </div>
          </div>
          <div className="w-full">
            <GoogleLogin width={382}
                onSuccess={credentialResponse => {
                  handleGoogleLogin(credentialResponse)
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
            />;

          </div>
         { checkMode==='login'? <p className="mt-10 text-center text-on-surface-variant text-sm">
            Don't have an account?
            <a className="font-bold text-primary hover:underline underline-offset-4" onClick={()=> setCheckmode('register')} >Sign up for free</a>
          </p>
          :
           <p className="mt-10 text-center text-on-surface-variant text-sm">
            Already have an account?
            <a className="font-bold text-primary hover:underline underline-offset-4" onClick={()=> setCheckmode('login')} >Sign up for free</a>
          </p>}
          </div>
          :
             <div className="flex  flex-col justify-center items-center">
               <div className="text-center mb-10">
                     <h2 className="font-headline-lg text-[32px] text-on-surface mb-2">Verify Your Email</h2>
                 <p className="font-body-md text-on-surface-variant">Please Enter The Verification Code We Sent.</p>
               </div>
               <div className="space-y-2 w-full">
                 <label className="font-label-bold text-on-surface-variant block" htmlFor="text">Enter Otp</label>
                 <div className="relative group">
                   <span
                       className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">security</span>
                   <input
                       className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60"
                       onChange={(e) => setUserOtp(e.target.value)} id="otp"
                       placeholder="123456" type="text"/>
                 </div>
               </div>
               <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-button text-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4" type="submit" onClick={registration}>
                 Done
               </button>

             </div>
         }
        </div>
         <div className="h-1.5 w-full bg-primary-gradient"></div>

       </Modal>

      {/*<Modal isOpen={isOpen} onClose={onClose}>*/}
      {/*<div className="p-8 md:p-12">*/}

      {/*  {!sentOtp ? <div>*/}
      {/*    <div className="flex flex-col justify-center items-center">*/}
      {/*      <h1 className="text-2xl my-2 font-bold">Save & Download</h1>*/}
      {/*      <div className="w-full my-2">*/}
      {/*        <input type="text" placeholder="Email" onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} className={`border p-2 w-full rounded  ${errors.email ? "border-red-500" : "border-gray-300"}`} />*/}
      {/*        {errors.email && (*/}
      {/*          <p className="text-red-500 text-sm">{errors.email}</p>*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*      <div className="w-full my-2">*/}
      {/*        <input type="password" placeholder="Password" onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })} className={`border p-2 rounded w-full ${errors.password ? "border-red-500" : "border-gray-300"}`} />*/}
      {/*        {errors.password && (*/}
      {/*          <p className="text-red-500 text-sm">{errors.password}</p>*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*      <div className="w-full my-2">*/}
      {/*        {checkMode === "register" ?*/}
      {/*          <div>*/}
      {/*            <button className="rounded-md mt-3 w-full  px-2 py-3 bg-blue-600 text-white" onClick={handleSendOtp}>Sent OTP</button>*/}
      {/*            <p className="text-xs text-gray-800">Already have an account? <span className="text-blue-500 text-underlined" onClick={()=> setCheckmode('login')}>Log in</span></p>*/}
      {/*          </div>*/}
      {/*          :*/}
      {/*          <div>*/}
      {/*            <button className="rounded-md mt-3 w-full px-2 py-3 bg-blue-600 text-white" onClick={login}>Login</button>*/}
      {/*            <p className="text-xs text-gray-800">Create new account? <span className="text-blue-500 text-underlined" onClick={()=> setCheckmode('register')}>Register</span></p>*/}
      {/*          </div>*/}

      {/*        }*/}
      {/*      </div>*/}
      {/*    </div></div>*/}
      {/*    :*/}
      {/*    <div className="flex flex-col justify-center items-center">*/}
      {/*      <h1 className="text-2xl my-2 font-bold">Save & Download</h1>*/}
      {/*      <input type="text" className="border p-2" placeholder="Enter Otp" onChange={(e) => setUserOtp(e.target.value)} />*/}
      {/*      <button className="rounded-m mt-3  px-2 py-2 bg-blue-600 text-white" onClick={registration}>Done</button>*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*  </div>*/}
      {/*</Modal>*/}
      


    </>
  )
}

export default UserAuth