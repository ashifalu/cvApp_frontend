import React from 'react'
import Navbar from '../components/Navbar'

const Home = () => {
    return (
        <div>
            <Navbar />
        <section id='hero'>
            <div className='flex-center w-400 mt-48'>
            <div className='text-center '>
                <h1 className='hero-title'>Same CV? Same rejections.</h1>
                <div className='w-[500px] mx-48 text-center'>
                <p className='hero-para'>Upload your details, paste the job description, and let our system build a CV tailored for that role.</p>
                <button className='hero-btn'>Start Building</button>
                </div>
            </div>
            </div>
            <div className='flex-center w-400 mt-20'>
                <div className='w-[650px] backdrop-blur-md bg-white/20 h-[300px] rounded-lg'>

                </div>
            </div>
            
        </section>    
        </div>
    )
}

export default Home