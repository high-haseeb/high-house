"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

function MenuButton({ open, ...props }) {
    const buttonRef = useRef();
    const containerRef = useRef();
    const [textCol, setCol] = useState('text-white');

    useEffect(() => {
        const container = containerRef.current;
        const button = buttonRef.current;

        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;

        gsap.set(button, {
            x: centerX,
            y: centerY,
            transform: "translate(-50%, -50%)"
        });

        const handleMouseMove = (event) => {
            setCol('text-[purple]');
            const containerRect = container.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();
            const relativeX = event.clientX - containerRect.left;
            const relativeY = event.clientY - containerRect.top;
            const maxX = containerRect.width - buttonRect.width / 2;
            const maxY = containerRect.height - buttonRect.height / 2;
            const constrainedX = Math.max(Math.min(relativeX, maxX), buttonRect.width / 2);
            const constrainedY = Math.max(Math.min(relativeY, maxY), buttonRect.height / 2);

            gsap.to(button, {
                x: constrainedX,
                y: constrainedY,
                duration: 2,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            setCol("text-white");
            gsap.to(button, {
                x: centerX,
                y: centerY,
                duration: 1,
                ease: "power2.out",
            });
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);


    return (
        <div className="w-[350px] h-56 absolute top-5 right-0 z-50" ref={containerRef} {...props}>
            <div className="relative w-full h-full">
                <button
                    ref={buttonRef}
                    className="relative h-24 w-24 rounded-full flex flex-col justify-center items-center border"
                >
                    <div className={`text-xl ${textCol}`}>{open ? "CLOSE" : "MENU"}</div>
                </button>
            </div>
        </div>
    );
}

export default MenuButton;
