"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

function Button({ introDone, ...props }) {
    const buttonRef = useRef();
    const containerRef = useRef();
    const imageRef = useRef();
    const [buttonColor, setColor] = useState("#FFFFFF80");
    const [textTrans, setTrans] = useState("translate-y-5 opacity-100"); // Initial state for white text
    const [newTrans, setNewTrans] = useState("translate-y-20 opacity-0"); // Initial state for green text

    useEffect(() => {
        const container = containerRef.current;
        const button = buttonRef.current;
        const image = imageRef.current;

        const rect = container.getBoundingClientRect();
        const initialX = rect.width / 2;
        const initialY = rect.height / 2;

        gsap.set(button, { x: initialX, y: initialY, transform: "translate(-50%, -50%)" });
        gsap.set(image, { x: initialX, y: initialY, transform: "translate(-50%, -50%)" });

        const handleMouseMove = (event) => {
            const containerRect = container.getBoundingClientRect();
            const relativeX = event.clientX - containerRect.left;
            const relativeY = event.clientY - containerRect.top;

            const constrainedX = Math.min(
                Math.max(relativeX, button.offsetWidth / 2),
                containerRect.width - button.offsetWidth / 2
            );
            const constrainedY = Math.min(
                Math.max(relativeY, button.offsetHeight / 2),
                containerRect.height - button.offsetHeight / 2
            );

            gsap.to(button, {
                x: constrainedX,
                y: constrainedY,
                duration: 0.2,
                ease: "power2.out",
            });

            gsap.to(image, {
                x: relativeX,
                y: relativeY,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                x: rect.width / 2,
                y: rect.height / 2,
                duration: 0.5,
                ease: "power2.out",
            });

            gsap.to(image, {
                x: rect.width / 2,
                y: rect.height / 2,
                duration: 0.8,
                ease: "power2.out",
                opacity: 0,
            });
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const handleMouseEnter = () => {
        setColor("#FFFFFFD9");
        gsap.to(imageRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" });
        setTrans("translate-y-20 opacity-0");
        setNewTrans("-translate-y-5 opacity-100");
    };

    const handleMouseLeave = () => {
        setColor("#FFFFFF80");
        gsap.to(imageRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
        setTrans("translate-y-5 opacity-100");
        setNewTrans("translate-y-20 opacity-0");
    };

    return (
        <div
            {...props}
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`relative w-full h-full ${introDone ? "opacity-0" : "opacity-1"} transition-opacity`}>
                <Image
                    ref={imageRef}
                    height={600}
                    width={600}
                    src="/key.webp"
                    alt="Background"
                    className="absolute w-[350px] h-[350px] object-contain opacity-0 transition-opacity duration-500 ease-out pointer-events-none"
                />

                <button
                    ref={buttonRef}
                    className="relative h-20 w-48 flex flex-col justify-center items-center"
                >
                    <div className="w-full h-40 p-1 flex flex-col justify-between">
                        <div className={`text-2xl text-white transition-all duration-300 ${textTrans} z-50`}>Entrez</div>
                        <div className={`text-2xl text-[green] transition-all duration-300 ${newTrans} z-50`}>Entrez</div>
                    </div>


                    <svg
                        width="130.77187mm"
                        height="54.420452mm"
                        viewBox="0 0 130.77187 54.420452"
                        version="1.1"
                        id="svg1"
                        className="transition-all duration-500 scale-50 scale-x-75 absolute"
                    >
                        <defs id="defs1" />
                        <g id="layer1" transform="translate(-60.682595,-130.3755)">
                            <path
                                id="rect1"
                                stroke="white"
                                style={{
                                    fill: buttonColor,
                                    stroke: "#ffffff",
                                    strokeWidth: 1.5,
                                }}
                                d="m 77.683114,130.5078 a 16.868332,16.868332 0 0 1 -16.868221,16.86822 v 20.41942 a 16.868332,16.868332 0 0 1 16.868221,16.86822 h 96.770836 a 16.868332,16.868332 0 0 1 16.86822,-16.86822 V 147.37602 A 16.868332,16.868332 0 0 1 174.45395,130.5078 Z"
                            />
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Button;
