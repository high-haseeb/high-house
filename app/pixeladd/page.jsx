'use client';
import Overlay from '@/components/Overlay'
import React, { useEffect, useRef } from 'react'
import { useControls } from 'leva';

const PixelAdd = () => {
    const { title } = useControls({title: "hello"});
    return (
        <div className="w-2/3">
            {/* <Canvas */}
            {/*     title="Toyota" */}
            {/*     description="Let's go places" */}
            {/*     buttonText="Buy now" */}
            {/*     logoImage={'images/toyota-logo.jpg'} */}
            {/*     bgImage={'images/2d.jpg'} */}
            {/* /> */}
            <Overlay />
        </div>
    );
};

const Canvas = ({ logoImage, title, description, bgImage, buttonText, template }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!canvas || !ctx) return;

        const width = canvas.width = window.innerWidth / 2;
        const height = canvas.height = window.innerHeight / 2;

        const background = new Image();
        background.src = bgImage;
        background.onload = () => {
            ctx.globalAlpha = template.bgOpacity;
            ctx.drawImage(background, 0, 0, width * template.bgScale, height * template.bgScale);
        };

        const drawTextWithBackground = (text, options, x, y) => {
            ctx.font = options.font;
            ctx.fillStyle = options.color;
            const textWidth = ctx.measureText(text).width;
            const textHeight = parseInt(options.font, 10);
            const padding = options.background.padding;
            const radius = options.background.borderRadius;

            ctx.fillStyle = options.background.color;
            ctx.beginPath();
            ctx.moveTo(x - padding + radius, y - padding);
            ctx.arcTo(x + textWidth + padding + radius, y - padding, x + textWidth + padding + radius, y + textHeight + padding, radius);
            ctx.arcTo(x + textWidth + padding + radius, y + textHeight + padding, x - padding + radius, y + textHeight + padding, radius);
            ctx.arcTo(x - padding + radius, y + textHeight + padding, x - padding + radius, y - padding, radius);
            ctx.arcTo(x - padding + radius, y - padding, x + textWidth + padding + radius, y - padding, radius);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = options.color;
            ctx.fillText(text, x, y + textHeight / 2);
        };

        const titleWidth = ctx.measureText(title).width;
        const titleX = template.title.horizontal === 'center' ? width / 2 - titleWidth / 2 : width - titleWidth - 50;
        const titleY = height / 4;
        drawTextWithBackground(title, template.title, titleX, titleY);

        const descriptionWidth = ctx.measureText(description).width;
        const descriptionX = template.description.horizontal === 'center' ? width / 2 - descriptionWidth / 2 : width - descriptionWidth - 50;
        const descriptionY = height / 2 + 40;
        drawTextWithBackground(description, template.description, descriptionX, descriptionY);

        const buttonWidth = ctx.measureText(buttonText).width;
        const buttonX = template.button.horizontal === 'center' ? width / 2 - buttonWidth / 2 : width - buttonWidth - 50;
        const buttonY = height - 50;
        drawTextWithBackground(buttonText, template.button, buttonX, buttonY);

        const logo = new Image();
        logo.src = logoImage;
        logo.onload = () => {
            const logoX = width / 2 - template.logo.size.width / 2;
            const logoY = 0;
            ctx.drawImage(logo, logoX, logoY, template.logo.size.width, template.logo.size.height);
        };

    }, [logoImage, title, description, bgImage, buttonText, template]);

    return <canvas ref={canvasRef} className="w-full h-full bg-white" />;
};

export default PixelAdd;
