import Overlay from '@/components/Overlay'
import Experience from './components/Experience'
import React from 'react'
import Hello from './components/Hello'
import "./style.css"

const Page = () => {
    return (
        <main className='w-screen h-screen overflow-hidden'>
            {/* <Hello /> */}
            <Experience />
            <Overlay />
        </main>
    )
}

export default Page
