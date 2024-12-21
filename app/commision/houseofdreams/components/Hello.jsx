import Image from 'next/image'
import React from 'react'

const Hello = () => {
    const leaves = Array.from({ length: 20 });

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-40 overflow-hidden">
            <div className="relative w-full h-full">
                {leaves.map((_, index) => (
                    <Image
                        key={index}
                        src={`/commision/images/leaves/${(index % 6) + 1}.png`}
                        width={400}
                        height={300}
                        className={`leaf leaf-${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hello;
