"use client"
import React, { useState } from 'react'
import Button from '@/components/Button'
import ParticleEffect from '@/components/ParticleEffect'
import MenuButton from '@/components/MenuButton'
import MenuPage from '@/components/MenuPage'



function page() {
    const [menu,setMeun]=useState(false);
    return (
        <div className="flex justify-center items-center w-screen h-screen relative overflow-hidden">
            {/* <div className='w-60 h-60 bg-black flex flex-col justify-center items-center'>
                <div className='text-white hover:translate-y-20 bg-[red] w-10 h-16 transition-all duration-300'>ABCD</div>
                <div className='w-full h-20 bg-[green] z-10'></div>
            </div> */}
            {/* <Button /> */}
            {/* <div className='w-[800px] h-[800px] bg-black z-50'>

            <ParticleEffect/>
            </div> */}
            <div onClick={()=>{menu ? setMeun(false):setMeun(true)}}>
            <MenuButton/>
            </div>
            {menu &&(
            <MenuPage state={menu}/>
            )
            }
        </div>
    )
}

export default page
 