"use client";
import { Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber'
import { useControls } from 'leva';
import { useEffect, useRef } from 'react';

const Page = () => {
    useEffect(() => {
        console.clear();
    }, []);

    return (
        <div className="w-screen h-screen overflow-hidden bg-[#181818]">
            <Experience />
        </div>
    )
}

const Experience = () => {
    return (
        <Canvas className="w-full h-full">
            <Model />
            <ModelB />
            <Environment preset='city' />
            <OrbitControls />
        </Canvas>
    )
};

const Model = () => {
    const { metalness, roughness } = useControls({
        metalness: { value: 0.8, min: 0.0, max: 1.0, step: 0.01 },
        roughness: { value: 0.2, min: 0.0, max: 1.0, step: 0.01 },
    });

    const rust = useTexture("/textures/rust.jpg");
    const ref = useRef(null);

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[1]} />
            <meshPhysicalMaterial metalness={metalness} roughness={roughness} color={"#FFD700"} reflectivity={0.8} clearcoat={0.3} clearcoatRoughness={0.1} roughnessMap={rust} />
        </mesh>
    )
}
const ModelB = () => {

    const { metalnessB, roughnessB, rustTex } = useControls({
        metalnessB: { value: 0.8, min: 0.0, max: 1.0, step: 0.01 },
        roughnessB: { value: 0.2, min: 0.0, max: 1.0, step: 0.01 },
        rustTex: { value: "/textures/rust-2.jpg" }
    });

    const rust = useTexture(rustTex);
    const ref = useRef(null);

    return (
        <mesh ref={ref} position={[2, 0, 0]}>
            <sphereGeometry args={[1]} />
            <meshPhysicalMaterial metalness={metalnessB} roughness={roughnessB} color={"silver"} roughnessMap={rust} reflectivity={0.9} clearcoat={0.3} clearcoatRoughness={0.1} />
        </mesh>
    )
}


export default Page;
