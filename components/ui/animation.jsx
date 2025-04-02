"use client"
import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import movingAnimation from './Moving.json'; // Ensure the path to your JSON file is correct.

function Animation() {
    const animationContainer = useRef(null);

    useEffect(() => {
        const animationInstance = lottie.loadAnimation({
            container: animationContainer.current, // Reference to the container div
            renderer: 'svg', // Render the animation in SVG
            loop: true, // Animation loops by default
            autoplay: true, // Animation starts playing automatically
            animationData: movingAnimation, // JSON file for the Lottie animation
        });

        // Clean up the animation instance when the component unmounts
        return () => animationInstance.destroy();
    }, []);

    return (
        <div
            ref={animationContainer}
            style={{ width: '400px', height: '400px', margin: '0 auto' }} // Adjust size and centering
        ></div>
    );
}

export default Animation;
