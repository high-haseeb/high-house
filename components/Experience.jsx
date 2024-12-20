"use client";
import React from 'react'
import { Canvas } from '@/components/lib/react-ogl';
import HoverFlowMap from './HoverFlowMap';

const Experience = () => {
    return (
        <Canvas dpr={2} renderer={{ alpha: true, premultipliedAlpha: true }} style={{ width: "100%", height: "100%", backgroundColor: "black" }}>
            <HoverFlowMap />
        </Canvas>
    )
}

export default Experience
