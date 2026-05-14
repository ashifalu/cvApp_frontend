import React from 'react'
import { useState } from 'react'

const TemplateList = () => {
    const [temp_id, setTempId] = useState(1)
    return (
        <>

            <div className='w-full h-screen flex flex-col justify-center items-center bg-background px-16 py-20'>
                <div  className='text-center  mb-16 max-w-2xl '>
                    <h1 className='font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-4'>Please select a template for your resume.</h1>
                    <h1 className='font-headline-lg text-headline-lg-mobile md:text-md text-on-background mb-4'>You can always change it later.</h1>
                    <p className='text-on-surface-variant text-body-lg'>Recruiters do appreciate readability and one-page resumes, though.</p>
                    <p className='text-on-surface-variant text-body-lg'></p>
                </div>
                <div className='flex mx-10 mb-10'>
                <a href={`/create-cv/${temp_id}`}>
                    <button onClick={()=> setTempId(2)} className='w-[350px]  p-4 mx-5 bg-gray-400/20 hover:bg-purple-300/20 group rounded-2xl hover:scale-105 transition-all duration-300 '>
                        <div className='w-full relative flex flex-col justify-center items-center hover:border hover:border-purple-300 '>
                        <img src="/images/template3.jpeg" alt="template3" className='w-full object-cover transition-transform duration-500' />
                        <button className="absolute hidden group-hover:flex transition-all duration-300 hover:shadow-xl group-hover:opacity-100 gradient-button text-on-primary px-8 py-4 rounded-xl text-lsm shadow-lg shadow-primary/10 hover:shadow-xl transition-all z-10">Use Template</button>
                        </div>
                        <div className='w-full flex flex-col justify-center items-center py-2'>
                            <h2 className='text-gray-700 font-semibold'>Double Column</h2>
                            <p className='text-xs text-gray-500'>Selected by 43% of your peers.</p>
                        </div>
                    </button>
                </a>

                <a href={`/create-cv/${temp_id}`}>
                    <button onClick={()=> setTempId(3)} className='w-[350px]  p-4 mx-5 bg-gray-400/20 hover:bg-purple-300/20 group rounded-2xl hover:scale-105 transition-all duration-300 '>
                        <div className='w-full relative flex flex-col justify-center items-center hover:border hover:border-purple-300 '>
                        <img src="/images/template2.jpeg" alt="template3" className='w-full object-cover transition-transform duration-500' />
                        <button className="absolute hidden group-hover:flex transition-all duration-300 hover:shadow-xl group-hover:opacity-100 gradient-button text-on-primary px-8 py-4 rounded-xl text-lsm shadow-lg shadow-primary/10 hover:shadow-xl transition-all z-10">Use Template</button>
                        </div>
                        <div className='w-full flex flex-col justify-center items-center py-2'>
                            <h2 className='text-gray-700 font-semibold'>Double Column</h2>
                            <p className='text-xs text-gray-500'>Selected by 43% of your peers.</p>
                        </div>
                    </button>
                </a>

                <a href={`/create-cv/${temp_id}`}>    
                    <button  className='w-[350px]  p-4 mx-5 bg-gray-400/20 hover:bg-purple-300/20 group rounded-2xl hover:scale-105 transition-all duration-300 '>
                        <div className='w-full relative flex flex-col justify-center items-center hover:border hover:border-purple-300 '>
                        <img src="/images/template3.jpeg" alt="template3" className='w-full object-cover transition-transform duration-500' />
                        <button className="absolute hidden group-hover:flex transition-all duration-300 hover:shadow-xl group-hover:opacity-100 gradient-button text-on-primary px-8 py-4 rounded-xl text-lsm shadow-lg shadow-primary/10 hover:shadow-xl transition-all z-10">Use Template</button>
                        </div>
                        <div className='w-full flex flex-col justify-center items-center py-2'>
                            <h2 className='text-gray-700 font-semibold'>Double Column</h2>
                            <p className='text-xs text-gray-500'>Selected by 43% of your peers.</p>
                        </div>
                    </button>
                </a>

                <a href={`/create-cv/${temp_id}`}>    
                    <div className='w-[350px]  p-4 mx-5 bg-gray-400/20 hover:bg-purple-300/20 group rounded-2xl hover:scale-105 transition-all duration-300 '>
                        <div className='w-full relative flex flex-col justify-center items-center hover:border hover:border-purple-300 '>
                        <img src="/images/template3.jpeg" alt="template3" className='w-full object-cover transition-transform duration-500' />
                        <button className="absolute hidden group-hover:flex transition-all duration-300 hover:shadow-xl group-hover:opacity-100 gradient-button text-on-primary px-8 py-4 rounded-xl text-lsm shadow-lg shadow-primary/10 hover:shadow-xl transition-all z-10">Use Template</button>
                        </div>
                        <div className='w-full flex flex-col justify-center items-center py-2'>
                            <h2 className='text-gray-700 font-semibold'>Double Column</h2>
                            <p className='text-xs text-gray-500'>Selected by 43% of your peers.</p>
                        </div>
                    </div>
                </a>    
                </div>
            </div>
        </>
    )
}

export default TemplateList