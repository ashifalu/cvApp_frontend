import React from 'react'

const Navbar = () => {
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
                    <a href={`#home`}>home</a>
                    
                </li>
                <li>
                    <a href={`#home`}>home</a>
                    
                </li>
                <li>
                    <a href={`#home`}>home</a>
                    
                </li>
                <li>
                    <a href={`#home`}>home</a>
                    
                </li>
                <li>
                    <a href={`#home`}>home</a>
                    
                </li>
                
            </ul>
            <div>
                <button className='nav-buttonA'>Log in</button>
                <button className='nav-buttonB'>Sign up</button>
            </div>
        </div>
        
    </nav>
    </>
  )
}

export default Navbar