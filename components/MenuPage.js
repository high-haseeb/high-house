"use client";
import React, { useEffect, useState } from "react";
import TextAnimation from "./TextAnimation";

function MenuPage({state}) {
    const [isVisible, setIsVisible] = useState(false);
    const [op,setOpacity]=useState('opacity-0')

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(state);
            setTimeout(() => {
                setOpacity('opacity-100')
            }, 600);
        }, 50);
    }, []);
    


    return (
        <div
            className={`fixed flex justify-center items-center bottom-0 right-0 w-screen h-screen bg-gradient-to-r to-[pink] from-blue-400 
            transition-transform duration-1000 ease-in-out ${
                isVisible ? "translate-x-0 translate-y-0" : "translate-x-full translate-y-full"
            }`}
            style={{
                boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.6), inset 0 0 30px 10px rgba(0, 0, 0, 0.4)",
            }}
        >
            <div className={`${op} w-1/2 h-full flex flex-col justify-center items-center text-white space-y-8`}>
                <TextAnimation text="HOME"/>
                <TextAnimation text="CONTACT"/>
                <TextAnimation text="SERVICE"/>
            </div>
        </div>
    );
}

export default MenuPage;
