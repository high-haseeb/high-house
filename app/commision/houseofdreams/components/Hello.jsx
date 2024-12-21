import Image from 'next/image'
import React from 'react'

const Hello = ({ introDone }) => {
    const leaves = Array.from({ length: 20 });

    return (
        <div className="absolute top-0 left-0 w-screen h-screen overflow-hidden bg-none select-none pointer-events-none z-20">
            <div className="relative w-full h-full">
                {leaves.map((_, index) => (
                    <Image
                        key={index}
                        src={`/commision/images/leaves/${(index % 6) + 1}.png`}
                        width={400}
                        height={300}
                        className={`leaf leaf-${index + 1} ${introDone ? 'animate' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hello;
