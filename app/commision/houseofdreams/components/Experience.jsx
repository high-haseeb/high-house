"use client";
import { useTexture } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { Fluid } from '@whatisjery/react-fluid-distortion'
import React from 'react'
import { Plane } from '@react-three/drei'
import Image from 'next/image'

const Experience = () => {

    return (
        <Canvas className='h-full w-full'>
            <Background />
            <EffectComposer>
                <Fluid />
            </EffectComposer>
        </Canvas>
    )
}
const Background = () => {
    const texture = useTexture('/commision/images/background.jpg');
    const { viewport } = useThree();
    const aspectRatio = viewport.width / viewport.height;

    return (
        <Plane args={[viewport.width, viewport.height]} position={[0, 0, -1]}>
            <meshBasicMaterial attach="material" map={texture} />
        </Plane>
    );
}

export default Experience
