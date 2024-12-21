"use client";
import React, { Suspense, useState } from 'react'
import Overlay from '@/components/Overlay'
import Experience from './components/Experience'
import MenuButton from './components/MenuButton'
import MenuPage from './components/MenuPage'
import Button from './components/Button';
import Hello from './components/Hello'
import "./style.css"

const Page = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [introDone, setIntroDone] = useState(false);

    return (
        <Suspense fallback={null}>
            <main className='w-screen h-screen overflow-hidden isolate'>
                <Overlay />

                <MenuButton onClick={() => { setMenuOpen(state => !state) }} open={menuOpen} />
                <MenuPage open={menuOpen} />
                <Button className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-[600px] h-52" onClick={() => setIntroDone(true)} introDone={introDone} />
                <Hello introDone={introDone}/>
                <Experience introDone={introDone} />
            </main>
        </Suspense>
    )
}

export default Page
