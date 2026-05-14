import { useState } from "react";
import Modal from "../../Modal";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi, verifyEmailApi } from "../../services/allApi";


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
      sessionStorage.setItem("existingUser",JSON.stringify(result.data.user))
      sessionStorage.setItem("token",result.data.token)
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

  const login = async () => {
    const result = await loginApi({
      email: userDetails.email,
      password: userDetails.password
    });
    if (result.status == 200) {
      sessionStorage.setItem("existingUser",JSON.stringify(result.data.user))
      sessionStorage.setItem("token",result.data.token)
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
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        {!sentOtp ? <div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl my-2 font-bold">Save & Download</h1>
            <div className="w-full my-2">
              <input type="text" placeholder="Email" onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} className={`border p-2 w-full rounded  ${errors.email ? "border-red-500" : "border-gray-300"}`} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="w-full my-2">
              <input type="password" placeholder="Password" onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })} className={`border p-2 rounded w-full ${errors.password ? "border-red-500" : "border-gray-300"}`} />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="w-full my-2">
              {checkMode === "register" ?
                <div>
                  <button className="rounded-md mt-3 w-full  px-2 py-3 bg-blue-600 text-white" onClick={handleSendOtp}>Sent OTP</button>
                  <p className="text-xs text-gray-800">Already have an account? <span className="text-blue-500 text-underlined" onClick={()=> setCheckmode('login')}>Log in</span></p>
                </div>
                :
                <div>
                  <button className="rounded-md mt-3 w-full px-2 py-3 bg-blue-600 text-white" onClick={login}>Login</button>
                  <p className="text-xs text-gray-800">Create new account? <span className="text-blue-500 text-underlined" onClick={()=> setCheckmode('register')}>Register</span></p>
                </div>

              }
            </div>
          </div></div>
          :
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl my-2 font-bold">Save & Download</h1>
            <input type="text" className="border p-2" placeholder="Enter Otp" onChange={(e) => setUserOtp(e.target.value)} />
            <button className="rounded-m mt-3  px-2 py-2 bg-blue-600 text-white" onClick={registration}>Done</button>
          </div>
        }
      </Modal>


    </>
  )
}

export default UserAuth