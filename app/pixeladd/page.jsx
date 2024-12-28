'use client';
import Overlay from '@/components/Overlay'
import React, { useEffect, useRef } from 'react'

const PixelAdd = () => {
    return (
        <div className='w-screen h-screen overflow-hidden bg-[#181818] text-white text-4xl flex items-center justify-center'>
            <div className='absolute top-10 left-10 flex flex-col items-start text-[#efefef]'>
                <span className='text-4xl'>Pixel Add</span>
                <span className='text-base'>canvas template</span>
            </div>
            <Canvas />
            <Overlay />
        </div>
    )
}

const Canvas = ({logoImage, title, description, bgImage, buttonText }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

    }, [canvasRef])

    return (
        <canvas ref={canvasRef} className='w-1/2 h-1/2 bg-white'/>
    )
}


export default PixelAdd
