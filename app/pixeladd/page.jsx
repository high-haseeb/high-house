"use client";
import Overlay from '@/components/Overlay'
import React, { useEffect, useRef } from 'react'
import { folder, useControls } from 'leva';

const PixelAdd = () => {
    const {
        title,
        description,
        buttonText,
        logoImage,
        bgImage,
        titleFont,
        titleColor,
        titleHorizontal,
        titleVertical,
        titleBgColor,
        titlePadding,
        titleBorderRadius,
        descFont,
        descColor,
        descHorizontal,
        descVertical,
        descBgColor,
        descPadding,
        descBorderRadius,
        buttonFont,
        buttonColor,
        buttonHorizontal,
        buttonVertical,
        buttonBgColor,
        buttonPadding,
        buttonBorderRadius,
        logoWidth,
        logoHeight,
        logoHorizontal,
        logoVertical,
        bgOpacity,
        bgScale,
    } = useControls('Main Properties', {
        General: folder({
            title: 'Toyota',
            description: "Let's go places",
            buttonText: 'Buy now',
            logoImage: 'images/toyota-logo.jpg',
            bgImage: 'images/2d.jpg',
        }),
        Title: folder({
            titleFont: '30px Arial',
            titleColor: 'black',
            titleHorizontal: { value: 'center', options: ['left', 'center', 'right'] },
            titleVertical: { value: 'middle', options: ['top', 'middle', 'bottom'] },
            titleBgColor: 'rgba(255, 255, 255, 0.5)',
            titlePadding: 10,
            titleBorderRadius: 5,
        }),
        Description: folder({
            descFont: '20px Arial',
            descColor: 'black',
            descHorizontal: { value: 'center', options: ['left', 'center', 'right'] },
            descVertical: { value: 'middle', options: ['top', 'middle', 'bottom'] },
            descBgColor: 'rgba(255, 255, 255, 0.5)',
            descPadding: 10,
            descBorderRadius: 5,
        }),
        Button: folder({
            buttonFont: '25px Arial',
            buttonColor: 'blue',
            buttonHorizontal: { value: 'center', options: ['left', 'center', 'right'] },
            buttonVertical: { value: 'bottom', options: ['top', 'middle', 'bottom'] },
            buttonBgColor: 'rgba(0, 0, 255, 0.5)',
            buttonPadding: 10,
            buttonBorderRadius: 5,
        }),
        Logo: folder({
            logoWidth: 100,
            logoHeight: 100,
            logoHorizontal: { value: 'center', options: ['left', 'center', 'right'] },
            logoVertical: { value: 'top', options: ['top', 'middle', 'bottom'] },
        }),
        Background: folder({
            bgOpacity: 0.5,
            bgScale: 0.5,
        }),
    });

    const template = {
        title: {
            font: titleFont,
            color: titleColor,
            horizontal: titleHorizontal,
            vertical: titleVertical,
            background: {
                color: titleBgColor,
                padding: titlePadding,
                borderRadius: titleBorderRadius,
            },
        },
        description: {
            font: descFont,
            color: descColor,
            horizontal: descHorizontal,
            vertical: descVertical,
            background: {
                color: descBgColor,
                padding: descPadding,
                borderRadius: descBorderRadius,
            },
        },
        button: {
            font: buttonFont,
            color: buttonColor,
            horizontal: buttonHorizontal,
            vertical: buttonVertical,
            background: {
                color: buttonBgColor,
                padding: buttonPadding,
                borderRadius: buttonBorderRadius,
            },
        },
        logo: {
            size: {
                width: logoWidth,
                height: logoHeight,
            },
            horizontal: logoHorizontal,
            vertical: logoVertical,
        },
        bgOpacity,
        bgScale,
    };

    return (
        <div className="w-screen h-screen bg-[#181818] flex items-center justify-center">
            <div className='absolute top-10 left-10 flex flex-col text-[#efefef]'>
                <span className='text-4xl'> Pixel Add</span>
                <span className='text-lg'>Canvas Template</span>
            </div>
            <div className='w-1/2 h-1/2 rounded-xl'>
                <Canvas
                    title={title}
                    description={description}
                    buttonText={buttonText}
                    logoImage={logoImage}
                    bgImage={bgImage}
                    template={template}
                />
            </div>
            <div className="absolute bottom-10 left-10 text-sm z-50 text-white">
                made by high-house
            </div>
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

    return <canvas ref={canvasRef} className="w-full h-full bg-white rounded-xl" />;
};

export default PixelAdd;
