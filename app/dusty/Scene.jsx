import React, { useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

// Cube Component
function Cube() {
    return (
        <RigidBody type="fixed" colliders="cuboid" name="cube">
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="gold" />
            </mesh>
        </RigidBody>
    );
}

// Ground Component
function Ground() {
    return (
        <RigidBody type="fixed" colliders="cuboid" name="ground">
            <mesh rotation={[0, 0, 0]} position={[0, -0.5, 0]}>
                <boxGeometry args={[10, 0.1, 10]} />
                <meshStandardMaterial color="green" />
            </mesh>
        </RigidBody>
    );
}

// Dust Particle Component
function DustParticle({ position }) {
    const ref = useRef(null);

    const handleCollision = () => {
        if (ref.current) {
            ref.current.setLinvel({ x: 0, y: 0, z: 0 });
            ref.current.setAngvel({ x: 0, y: 0, z: 0 });
            ref.current.setBodyType("fixed");
        }
    };

    return (
        <RigidBody
            ref={ref}
            colliders="cuboid"
            position={position}
            onCollisionEnter={handleCollision}
        >
            <mesh>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="brown" />
            </mesh>
        </RigidBody>
    );
}

// Dust Effect Component
function DustEffect({ particleCount = 10000 }) {
    const particles = useMemo(() => {
        const positions = [];
        for (let i = 0; i < particleCount; i++) {
            positions.push([
                THREE.MathUtils.randFloat(-1, 1), // Random X
                THREE.MathUtils.randFloat(2, 5), // Random Y above the cube
                THREE.MathUtils.randFloat(-1, 1), // Random Z
            ]);
        }
        return positions;
    }, [particleCount]);

    return (
        <>
            {particles.map((pos, index) => (
                <DustParticle key={index} position={pos} />
            ))}
        </>
    );
}

// Main Scene Component
function Scene() {
    return (
        <Canvas>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <Physics gravity={[0, -9.8, 0]} colliders="ball">
                <Ground />
                <Cube />
                <DustEffect particleCount={1000} />
            </Physics>
        </Canvas>
    );
}

export default Scene;
