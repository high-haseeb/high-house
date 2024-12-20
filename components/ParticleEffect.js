// components/ParticleEffect.js
"use client";  // Ensures this is a client-side component

import dynamic from 'next/dynamic';

// Dynamically import the react-tsparticles component with ssr: false to avoid server-side rendering
const ParticleComponent = dynamic(() => import('react-tsparticles'), { ssr: false });

const ParticleEffect = () => {
  return (
    <div className="absolute inset-0"> {/* Absolute positioning to cover the entire screen */}
      <ParticleComponent
        id="tsparticles"
        options={{
          particles: {
            number: {
              value: 200, // Increased particle count
              density: {
                enable: true,
                value_area: 800,
              },
            },
            shape: {
              type: 'image',
              image: {
                src: '/images/particle.webp', // Correct path to your WebP image
                width: 60, // Increased size of particles
                height: 60,
              },
            },
            move: {
              enable: true,
              speed: 2, // Increased speed of particles
            },
            opacity: {
              value: 0.7, // Adjust opacity to make particles more visible
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0,
              },
            },
          },
          interactivity: {
            detectsOn: 'canvas',
            events: {
              onHover: {
                enable: true,
                mode: 'repulse', // Particles should repulse when hovered
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ParticleEffect;
