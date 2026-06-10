import UserAuth from '../users/components/UserAuth'
import { useEffect, useState } from 'react'


const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [authMode, setAuthMode] = useState('login')
    const [token, setToken] = useState('')
    const [existingUser, setExistingUser] = useState({})
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
<button className=" text-black font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300" onClick={() => { setOpen(true); setAuthMode('login') }} >Sign In</button>
<a href="/select-template"><button className="gradient-button text-on-primary font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300" >Create Resume</button></a>
</div>
</nav>
            {/* <nav className='fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl '>
                <div className='w-full flex justify-between items-center px-20'>
                    <div>
                        <a href="#home" className='flex items-center gap-1'>
                            <img className='logo' src="/images/logo.png" alt="logo" />
                            <span className='text-white font-bold text-2xl' >Smartcv</span>
                        </a>
                    </div>

                    <div>
                        <ul className='flex gap-4 justify-center items-center'>

                            <li className='px-2 py-1 bg-purple'>
                                <a className='text-white font-semibold' href={`#home`}>Home</a>

                            </li>
                            <li>
                                <a className='text-white font-semibold'  href={`#home`}>Templates</a>

                            </li>
                            <li>
                                <a className='text-[#fff] font-semibold'  href={`#home`}>Job-based CV</a>

                            </li>
                            <li>
                                <a className='text-white font-semibold'  href={`#home`}>home</a>

                            </li>


                        </ul>
                    </div>
                    <div>
                        {!token ?
                            <div>
                                <button className='nav-buttonA' onClick={() => { setOpen(true); setAuthMode('login') }}>Log in</button>
                                <button className='nav-buttonB' onClick={() => { setOpen(true); setAuthMode('register') }}>Sign up</button>
                            </div>
                            :
                            <button className='nav-buttonA'><a href={`/user-profile/${existingUser._id}`}>Profile</a></button>}
                    </div>
                </div>

            </nav> */}
            <UserAuth
                isOpen={open}
                mode={authMode}
                onClose={() => setOpen(false)}
            />
        </>
    )
}

export default Navbar