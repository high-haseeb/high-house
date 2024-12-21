"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function TextAnimation({ text, ...props }) {
    const textRef = useRef();
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 1 }
        );

        if (textRef.current) {
            observer.observe(textRef.current);
        }

        return () => {
            if (textRef.current) {
                observer.unobserve(textRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isInView) {
            gsap.fromTo(
                textRef.current,
                { y: "100%" },
                {
                    y: "0%",
                    duration: 2,
                    ease: "power2.out",
                }
            );
        }
    }, [isInView]);

    return (
        <div className="overflow-hidden inline-block z-20" {...props}>
            <span
                ref={textRef}
                className="block text-8xl font-bold text-white"
            >
                {text}
            </span>
        </div>
    );
}

export default TextAnimation;
