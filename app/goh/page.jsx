"use client";
import { applyProps, Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, OrthographicCamera, useGLTF, useProgress, Html, Center, useTexture } from '@react-three/drei';
import { useRef, useEffect, Suspense } from "react";
import useStateStore from "./stateStore";
import Image from "next/image";

const Page = () => {
    return (
        <main className='w-screen h-screen bg-[#EFEFEF] text-black font-bold relative overflow-hidden'>
            <Menu />
            <Experience />
            <Overlay />
        </main>
    )
}
const Menu = () => {
    const { menuOpen, setMenuOpen, activeModel, setActiveModel, colors, setActiveColor, activeColor, straps } = useStateStore();
    const Option = ({ title, imgUrl }) => {
        let isOn = activeModel === title;
        return (
            <button className="flex flex-col gap-2" onClick={() => setActiveModel(title)}>
                <Image src={imgUrl} width={100} height={100} alt={title} className="border border-black" />
                <div className="flex gap-1 items-center justify-center">
                    <div className={`${isOn ? "bg-black " : "bg-transparent"} border border-black h-3 w-3 rounded-full`} />
                    <span className="capitalize">{title}</span>
                </div>
            </button>
        )
    }
    const ColorOptions = () => {
        return (
            <div className="flex items-start justify-start gap-4 w-full">
                {
                    colors[activeModel].map((color, index) => (
                        <button className="flex flex-col items-center justify-center" onClick={() => setActiveColor(color.value)} key={index}>
                            <div className={`h-6 w-6 rounded-full ${activeColor === color.value ? "ring-black ring-2" : "border-none"}`} style={{ backgroundColor: color.value }}></div>
                            <div className="capitalize">{color.name}</div>
                        </button>)
                    )
                }
            </div>
        )
    }
    return (
        <div className={`absolute h-screen w-screen top-0 left-0 bg-white z-50 ${menuOpen == "edit" ? "translate-y-0" : "translate-y-full"} transition-transform p-6`}>
            <div className="relative w-full h-full flex flex-col gap-4">
                <div className="text-3xl font-bold">Shoes</div>
                <div className="flex items-center justify-between">
                    <Option title="sandals" imgUrl={"/images/shoetype_sandal.png"} />
                    <Option title="slippers" imgUrl={"/images/shoetype_strapslipper.png"} />
                    <Option title="clogs" imgUrl={"/images/shoetype_muleclog.png"} />
                </div>
                <ColorOptions />

                <div className="text-3xl font-bold">Strap</div>
                <div className="grid grid-cols-2 w-full">
                    {
                        straps.map((strap, index) => (
                            <div className="flex flex-col w-full p-4" key={index}>
                                <Image src={`/models/images/${strap.src}`} alt={strap.name} width={200} height={100} className="object-cover w-full h-auto"/>
                                <div>{strap.name}</div>
                            </div>
                        ))
                    }
                </div>

                <div className="flex w-full items-center justify-around absolute bottom-4">
                    <button className="bg-[#181818] text-white px-6 py-3 w-1/3 capitalize rounded-xl" onClick={() => setMenuOpen(false)}>cancel</button>
                    <button className="bg-[#181818] text-white px-6 py-3 w-1/3 capitalize rounded-xl" onClick={() => setMenuOpen(false)}>apply</button>
                </div>
            </div>
        </div>
    )
}

const Overlay = () => {
    const { setMenuOpen } = useStateStore();
    return (
        <div className="fixed left-1/2 -translate-x-1/2 flex items-center justify-center bottom-20 gap-4">
            <button className="w-16 h-16 rounded-full border border-black p-3" onClick={() => setMenuOpen("edit")}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.99997 11.2224L12.7778 15.0002M7.97485 20.975C6.60801 22.3419 4 22.0002 2 22.0002C3.0251 20.0002 1.65827 17.3921 3.0251 16.0253C4.39194 14.6585 6.60801 14.6585 7.97485 16.0253C9.34168 17.3921 9.34168 19.6082 7.97485 20.975ZM11.9216 15.9248L21.0587 6.05671C21.8635 5.18755 21.8375 3.83776 20.9999 3.00017C20.1624 2.16258 18.8126 2.13663 17.9434 2.94141L8.07534 12.0785C7.5654 12.5507 7.31043 12.7868 7.16173 13.0385C6.80514 13.6423 6.79079 14.3887 7.12391 15.0057C7.26283 15.2631 7.50853 15.5088 7.99995 16.0002C8.49136 16.4916 8.73707 16.7373 8.99438 16.8762C9.6114 17.2093 10.3578 17.195 10.9616 16.8384C11.2134 16.6897 11.4494 16.4347 11.9216 15.9248Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <button className="w-16 h-16 rounded-full border border-black p-3" onClick={() => setMenuOpen("view")}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> <path d="M12.0004 15C13.6573 15 15.0004 13.6569 15.0004 12C15.0004 10.3431 13.6573 9 12.0004 9C10.3435 9 9.0004 10.3431 9.0004 12C9.0004 13.6569 10.3435 15 12.0004 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </svg>
            </button>
            <button className="w-16 h-16 rounded-full border border-black p-3" onClick={() => console.log("download image")} id="screenshot">
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
                <Suspense fallback={<Loader />}>
                    <ambientLight />
                    <OrthographicCamera makeDefault near={0.01} far={100} position={[0, 0, 5]} left={-2} right={2} top={2} bottom={-2} zoom={3} />
                    <DynamicOrthographicCamera />
                    <OrbitControls/>
                    <Center>
                        <Model />
                    </Center>

                    <Environment preset="city" />
                </Suspense>
                <ScreenShot />
            </Canvas >
        </>
    )
}

const ScreenShot = () => {
    const { gl, scene, camera } = useThree();
    const takeScreenshot = () => {
        gl.render(scene, camera);
        const dataURL = gl.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'screenshot.png';
        link.click();
    };
    useEffect(() => {
        const button = document.getElementById("screenshot");
        button.onclick = takeScreenshot;
    }, []);
    return null;
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

const Model = () => {
    const ref = useRef(null);
    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.rotation.y += delta;
    });
    const { activeModel } = useStateStore();
    return (
        <group ref={ref} scale={5.0} rotation={[Math.PI / 4, 0, 0]}>
            {
                activeModel === "sandals" ? <Sandals /> : activeModel === "slippers" ? <Slippers /> : <Clogs />
            }
        </group>
    )
}


function Sandals(props) {
    const { nodes, materials } = useGLTF('/models/sandals.glb')
    const { activeColor } = useStateStore();
    applyProps(materials['Procedural Rubber'], { color: activeColor })
    const tex = useTexture('models/images/2.png');
    return (
        <group {...props} dispose={null} >
      <mesh castShadow receiveShadow geometry={nodes['Rhinoceros_Binary_STL_(_Mar_12_2024_)'].geometry} material={materials['Procedural Rubber']} />
      <mesh castShadow receiveShadow geometry={nodes['Rhinoceros_Binary_STL_(_Mar_12_2024_)_2'].geometry} material={nodes['Rhinoceros_Binary_STL_(_Mar_12_2024_)_2'].material} />
      <mesh castShadow receiveShadow geometry={nodes['Rhinoceros_Binary_STL_(_Mar_12_2024_)_3'].geometry} >
                <meshStandardMaterial map={tex} />
            </mesh>
        </group>
    )
}

function Slippers(props) {
    const { nodes } = useGLTF('/models/slippers.glb')
    const { materials } = useGLTF('/models/sandals.glb')
    const { activeColor } = useStateStore();
    applyProps(materials['Procedural Rubber'], { color: activeColor })
    return (
        <group {...props} dispose={null} >
            <mesh castShadow receiveShadow geometry={nodes.TrimSrf_1069.geometry} material={materials['Procedural Rubber']} position={[-0.033, 0.143, 0.253]} scale={0.001} />
        </group>
    )
}

function Clogs(props) {
    const { nodes } = useGLTF('/models/clog.glb')
    const { materials } = useGLTF('/models/sandals.glb')
    const { activeColor } = useStateStore();
    applyProps(materials['Procedural Rubber'], { color: activeColor })
    return (
        <group {...props} dispose={null}>
            <group position={[0.51, -0.195, -0.021]} scale={0.001}>
                <mesh castShadow receiveShadow geometry={nodes['COLOR=�,MATERIAL=��_11'].geometry} material={materials['Procedural Rubber']} position={[-508.633, 217.022, 10.933]} />
            </group>
        </group>
    )
}

useGLTF.preload('/models/clog.glb')
useGLTF.preload('/models/slippers.glb')
useGLTF.preload('/models/sandals.glb')

export default Page
