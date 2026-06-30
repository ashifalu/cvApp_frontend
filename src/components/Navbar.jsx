import UserAuth from '../users/components/UserAuth'
import { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom";


const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [authMode, setAuthMode] = useState('login')
    const [token, setToken] = useState('')
    const [existingUser, setExistingUser] = useState({})

    const navigate = useNavigate();

    useEffect(() => {

        if (sessionStorage.getItem("token")) {
            setToken(sessionStorage.getItem("token"))
            setExistingUser(JSON.parse(sessionStorage.getItem("existingUser")))
        }
        console.log(existingUser._id);
        console.log(token);
    }, [])
    return (
        <>
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-black/5 bg-white/70 backdrop-blur-[24px] shadow-lg flex justify-between items-center px-8 py-4 z-50">
        <div className="font-display-lg text-primary tracking-tighter text-2xl">ResumeAI</div>
<div className="hidden md:flex gap-8 items-center">
<a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md" href="#">Features</a>
<a className="text-on-surface-variant hover:text-on-surface transition-colors font-body-md text-body-md" href="#">Templates</a>
<a className="text-on-surface-variant hover:text-on-surface transition-colors font-body-md text-body-md" href="#">Pricing</a>
<a className="text-on-surface-variant hover:text-on-surface transition-colors font-body-md text-body-md" href="#">Dashboard</a>
</div>
<div className="flex gap-4 items-center">
    {!token? <button className=" text-black font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
             onClick={() => {
                 setOpen(true);
                 setAuthMode('login')
             }}>Sign In</button>
        :
        <button className=" text-black font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
        onClick={() => { navigate(`/user-profile/${existingUser._id}`);}}>Profile</button>
    }<a href="/select-template"><button className="gradient-button text-on-primary font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300" >Create Resume</button></a>
</div>
</nav>
            <UserAuth
                isOpen={open}
                mode={authMode}
                onClose={() => setOpen(false)}
            />
        </>
    )
}

export default Navbar