"use client";
import { useTexture } from "@react-three/drei";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import React, { useRef } from "react";
import { Plane } from "@react-three/drei";
import { lerp } from "three/src/math/MathUtils";

const Experience = ({ introDone }) => {
    return (
        <Canvas className="h-full w-full z-10">
            <Background introDone={introDone} />
            <EffectComposer>
                <Fluid />
            </EffectComposer>
            <ambientLight intensity={1.0} />
        </Canvas>
    );
};

const layers = [
    { texture: "/commision/images/layer_1.png", z: 0 },
    { texture: "/commision/images/layer_2.png", z: -0.5 },
    { texture: "/commision/images/layer_3.png", z: -1 },
    { texture: "/commision/images/background.jpg", z: -1.5 },
];

const Background = ({ introDone }) => {
    const { viewport } = useThree();
    return (
        <>
            {layers.map((layer, index) => (
                <ParallaxLayer
                    introDone={introDone}
                    key={index}
                    texture={layer.texture}
                    z={layer.z}
                    viewport={viewport}
                />
            ))}
        </>
    );
};

const ParallaxLayer = ({ introDone, texture: texturePath, z, viewport }) => {
    const texture = useTexture(texturePath);
    const planeRef = useRef();

    useFrame(({ pointer }) => {

        if (planeRef.current && introDone) {
            const parallaxFactor = 1.2 - Math.abs(z) * 0.2;
            planeRef.current.rotation.z = lerp(planeRef.current.rotation.z, pointer.x * 0.1 * parallaxFactor, 0.1);
            planeRef.current.position.z = lerp(planeRef.current.position.z, Math.abs(pointer.x) * 0.5 * parallaxFactor, 0.1);
        }

        if (!introDone) {
            planeRef.current.position.z = lerp(planeRef.current.position.z, -1.0, 0.1);
        }
    });

    return (
        <Plane
            args={[viewport.width, viewport.height]}
            position={[0, 0, z * 0.1]}
            ref={planeRef}
        >
            <meshBasicMaterial attach="material" transparent map={texture} />
        </Plane>
    );
};

export default Experience;
