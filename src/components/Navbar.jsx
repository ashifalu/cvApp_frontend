import { useState } from 'react'
import UserAuth from '../users/components/UserAuth'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [authMode, setAuthMode] = useState('login')
    return (
        <>
            <nav>
                <div className='div-main'>
                    <a href="#home" className='flex items-center gap-2'>
                        <img className='logo' src="/images/logo.png" alt="logo" />
                        <span >Smartcv</span>
                    </a>

                    <ul>

                        <li>
                            <a href={`#home`}>Home</a>

                        </li>
                        <li>
                            <a href={`#home`}>Templates</a>

                        </li>
                        <li>
                            <a href={`#home`}>Job-based CV</a>

                        </li>
                        <li>
                            <a href={`#home`}>home</a>

                        </li>


                    </ul>
                    <div>
                        <button className='nav-buttonA' onClick={() => {setOpen(true); setAuthMode('login')}}>Log in</button>
                        <button className='nav-buttonB' onClick={() => {setOpen(true); setAuthMode('register')}}>Sign up</button>
                    </div>
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