"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, OrthographicCamera, PresentationControls, Stage, useGLTF, useProgress, Html } from '@react-three/drei'
import { useRef, useEffect, Suspense } from "react";

const Page = () => {
    return (
        <main className='w-screen h-screen bg-[#EFEFEF] text-[#181818] font-bold'>
            <Experience />
            <Overlay />
        </main>
    )
}

const Overlay = () => {
    return (
        <div className="fixed left-1/2 -translate-x-1/2 flex items-center justify-center bottom-20 gap-4">
            <button className="w-16 h-16 rounded-full border border-black p-3"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.99997 11.2224L12.7778 15.0002M7.97485 20.975C6.60801 22.3419 4 22.0002 2 22.0002C3.0251 20.0002 1.65827 17.3921 3.0251 16.0253C4.39194 14.6585 6.60801 14.6585 7.97485 16.0253C9.34168 17.3921 9.34168 19.6082 7.97485 20.975ZM11.9216 15.9248L21.0587 6.05671C21.8635 5.18755 21.8375 3.83776 20.9999 3.00017C20.1624 2.16258 18.8126 2.13663 17.9434 2.94141L8.07534 12.0785C7.5654 12.5507 7.31043 12.7868 7.16173 13.0385C6.80514 13.6423 6.79079 14.3887 7.12391 15.0057C7.26283 15.2631 7.50853 15.5088 7.99995 16.0002C8.49136 16.4916 8.73707 16.7373 8.99438 16.8762C9.6114 17.2093 10.3578 17.195 10.9616 16.8384C11.2134 16.6897 11.4494 16.4347 11.9216 15.9248Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg></button>
            <button className="w-16 h-16 rounded-full border border-black p-3">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> <path d="M12.0004 15C13.6573 15 15.0004 13.6569 15.0004 12C15.0004 10.3431 13.6573 9 12.0004 9C10.3435 9 9.0004 10.3431 9.0004 12C9.0004 13.6569 10.3435 15 12.0004 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </svg>
            </button>
            <button className="w-16 h-16 rounded-full border border-black p-3">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </div>
    )
}

const Loader = () => {
    const { progress } = useProgress();
    return (
        <Html center className="w-screen h-screen z-[999] bg-yellow-300 absolute top-0 left-0 flex items-center justify-center text-3xl">
            {progress.toFixed(0)}%
        </Html>
    )
}

const Experience = () => {
    return (
        <>
            <Canvas className="w-full h-full absolute top-0 left-0">
                <Suspense fallback={<Loader/>}>
                    <ambientLight />
                    <OrthographicCamera makeDefault near={0.01} far={100} position={[0, 0, 5]} left={-2} right={2} top={2} bottom={-2} zoom={3} />
                    <DynamicOrthographicCamera />
                    <PresentationControls>
                        <Sandal />
                    </PresentationControls>
                    <Environment preset="city" />
                </Suspense>
            </Canvas >
        </>
    )
}

const DynamicOrthographicCamera = () => {
    const { viewport, camera } = useThree();

    useEffect(() => {
        const aspect = viewport.width / viewport.height;
        camera.left = -aspect * 5; // Adjust 5 to control zoom
        camera.right = aspect * 5;
        camera.top = 5;
        camera.bottom = -5;
        camera.updateProjectionMatrix();
    }, [viewport, camera]);

    return null;
};


export function Sandal(props) {
    const { nodes, materials } = useGLTF('/models/sandals.glb')
    const ref = useRef(null);
    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.rotation.y += delta;
    })
    return (
        <group {...props} ref={ref} dispose={null} scale={5.0} rotation={[Math.PI / 4, 0, 0]}>
            <mesh castShadow receiveShadow geometry={nodes['Rhinoceros_Binary_STL_(_Mar_12_2024_)'].geometry} material={materials.재질_1} position={[0.017, -0.019, -0.005]} />
            <mesh castShadow receiveShadow geometry={nodes['Rhinoceros_Binary_STL_(_Mar_12_2024_)_2'].geometry} material={materials.재질_1} position={[-0.032, 0.001, 0.007]} />
            <mesh castShadow receiveShadow geometry={nodes['Rhinoceros_Binary_STL_(_Mar_12_2024_)_3'].geometry} material={materials.재질_1} position={[0.015, 0.018, -0.002]} />
        </group>
    )
}

useGLTF.preload('/models/sandals.glb')

export default Page
