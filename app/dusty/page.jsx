"use client";
import Overlay from '@/components/Overlay';
import { useEffect } from 'react';
import Scene from './Scene';

const Page = () => {
    useEffect(() => {
        console.clear();
    }, []);

    return (
        <div className="w-screen h-screen overflow-hidden bg-[#181818]">
            <Scene/>
            <div className='absolute top-10 left-10 text-lg text-white'>
                <div className='text-4xl'>Dust Effect</div>
                <div className='text-lg font-normal'>version 0.0.1</div>
                <div className='text-sm font-extralight italic w-[15rem]'>The sliders controls the intensity of roughness and metallness. We can set different rust textures from the input on the right.</div>
            </div>
            <Overlay />
        </div>
    )
}

export default Page;
