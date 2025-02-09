import { Flowmap, Texture, Vec2, Vec4 } from 'ogl'
import * as React from 'react'
import { useFrame, useOGL } from '@/components/lib/react-ogl'
import { fragment, vertex } from '@/shadres/hoverFlowMap/index';

class TextureLoader extends Texture {
    load(src) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => (this.image = img)
        img.src = src
        return this
    }
}

const HoverFlowMap = () => {
    const meshRef = React.useRef()
    const lastTimeRef = React.useRef()
    const mouse = React.useMemo(() => new Vec2(-1), [])
    const velocity = React.useMemo(() => new Vec2(), [])
    const lastMouse = React.useMemo(() => new Vec2(), [])
    const { gl } = useOGL()
    const flowmap = new Flowmap(gl, { falloff: 0.2, dissipation: 0.9 })

    const getIsTouchCapable = () => {
        return (
            'ontouchstart' in window || // Touch events
            (navigator.maxTouchPoints > 0) || // Pointer events API
            (navigator.msMaxTouchPoints > 0) // Older IE touch points
        );
    };
    const isTouchCapable = getIsTouchCapable();

    const texture = new TextureLoader(gl, {
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
        premultiplyAlpha: true
    }).load(
        isTouchCapable
            ? '/images/high-house-flowmap-mobile.svg'
            : '/images/high-house-flowmap.svg'
    )
    const aspect = window.innerWidth / window.innerHeight

    let imgSize = isTouchCapable ? [800, 1000] : [1600, 1200]
    const imageAspect = imgSize[1] / imgSize[0]
    let a1, a2
    if (window.innerHeight / window.innerWidth < imageAspect) {
        a1 = 1
        a2 = window.innerHeight / window.innerWidth / imageAspect
    } else {
        a1 = (window.innerWidth / window.innerHeight) * imageAspect
        a2 = 1
    }

    const updateMouse = React.useCallback(
        (e) => {
            e.preventDefault();

            let clientX, clientY;

            if ('touches' in e && e.touches.length > 0) {
                // Handle touch event
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                // Handle mouse event
                clientX = e.clientX || e.pageX;
                clientY = e.clientY || e.pageY;
            }

            // Get mouse value in 0 to 1 range, with y flipped
            mouse.set(clientX / gl.renderer.width, 1.0 - clientY / gl.renderer.height);

            // Calculate velocity
            if (!lastTimeRef.current) {
                // First frame
                lastTimeRef.current = window.performance.now();
                lastMouse.set(clientX, clientY);
            }

            const deltaX = clientX - lastMouse.x;
            const deltaY = clientY - lastMouse.y;

            lastMouse.set(clientX, clientY);

            const time = window.performance.now();

            // Avoid dividing by 0
            const delta = Math.max(10.4, time - lastTimeRef.current);
            lastTimeRef.current = time;
            velocity.x = deltaX / delta;
            velocity.y = deltaY / delta;

            // Flag update to prevent hanging velocity values when not moving
            velocity.needsUpdate = true;
        },
        [gl.renderer.height, gl.renderer.width, lastMouse, mouse, velocity]
    );

    useFrame((_, delta) => {
        if (!velocity.needsUpdate) {
            mouse.set(-1)
            velocity.set(0)
        }
        velocity.needsUpdate = false
        // Update flowmap inputs
        flowmap.aspect = aspect
        flowmap.mouse.copy(mouse)
        // Ease velocity input, slower when fading out
        flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1)
        flowmap.update()
        if (meshRef.current) {
            meshRef.current.program.uniforms.uTime.value = delta * 0.01
        }
    })

    React.useEffect(() => {
        if (isTouchCapable) {
            window.addEventListener('touchstart', updateMouse, false)
            window.addEventListener('touchmove', updateMouse, { passive: false })
        } else {
            window.addEventListener('mousemove', updateMouse, false)
        }

        return () => {
            if (isTouchCapable) {
                window.removeEventListener('touchstart', updateMouse, false)
                window.removeEventListener('touchmove', updateMouse, { passive: false })
            } else {
                window.removeEventListener('mousemove', updateMouse, false)
            }
        }
    }, [isTouchCapable, updateMouse])

    return (
        <mesh ref={meshRef}>
            <program
                vertex={vertex}
                fragment={fragment}
                uniforms={{
                    uTime: { value: 0 },
                    tWater: {
                        value: texture
                    },
                    res: {
                        value: new Vec4(window.innerWidth, window.innerHeight, a1, a2)
                    },
                    img: { value: new Vec2(imgSize[0], imgSize[1]) },
                    tFlow: flowmap.uniform
                }}
            />
            <geometry
                position={{ size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) }}
                uv={{ size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }}
            />
        </mesh>
    )
}

export default HoverFlowMap
