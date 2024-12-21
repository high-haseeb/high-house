"use client";
import React, { useEffect, useState } from "react";
import TextAnimation from "./TextAnimation";

function MenuPage({ open }) {
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        setTimeout(() => setOpacity(100), 1000);
    }, []);

    const menuItems = [
        { item: "HOME", value: ["test", "test", "test"] },
        { item: "ABOUT", value: ["test", "test", "test"] },
        { item: "CONTACT", value: ["test", "test", "test"] },
    ];

    const [activeMenuItem, setActiveMenuItem] = useState(null);

    return (
        <div
            className={`fixed flex justify-center items-center bottom-0 right-0 w-screen h-screen bg-gradient-to-r to-[pink] from-blue-400 
            transition-transform duration-200 ease-in-out ${open ? "translate-x-0 translate-y-0" : "translate-x-full translate-y-full"} z-40`}
        >
            <div
                className="w-1/2 h-full flex flex-col justify-center items-center text-white space-y-8"
                style={{ opacity }}
            >
                {menuItems.map((menuItem, idx) => (
                    <div key={idx}>
                        {/* Main Menu Item */}
                        {activeMenuItem === null &&
                            <TextAnimation
                                text={menuItem.item}
                                onClick={() => setActiveMenuItem(item => item === null ? menuItem.item : null)}
                            />
                        }
                    </div>
                ))}
                {
                    activeMenuItem != null &&
                    <TextAnimation
                        text={activeMenuItem}
                        onClick={() => setActiveMenuItem(item => item === null ? activeMenuItem : null)}
                    />
                }
                {
                    menuItems.map((menuItem, idx) => (
                        activeMenuItem === menuItem.item &&
                        menuItem.value.map((subItem, subIdx) => (
                            <TextAnimation text={subItem} key={`${idx}-${subIdx}`} />
                        ))
                    ))
                }
            </div>
        </div>
    );
}

export default MenuPage;
