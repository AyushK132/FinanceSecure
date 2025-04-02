"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from './ui/button';
import * as React from 'react';
import {BackgroundBeams} from "components/ui/background-beams"
import FeatureGrid from "components/ui/features"
 
 function HeroSection() {
    const imageRef = useRef();

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if(scrollPosition > scrollThreshold){
                imageElement.classList.add("scrolled")
            }else {
                imageElement.classList.remove("scrolled")
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])


     return (

<div>
        <BackgroundBeams/>
      
        
         <div className = "pb-20 px-4 overflow-hidden">





            <div className = "container mx-auto text-center">
                
                <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 bg-gradient-to-r from-[#f5a293] to-[#8e89f0] font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text overflow-x-hidden">Welcome To<br/>FinanceSecure</h1>

                

                <p className = "text-xl text-black mb-8 max-w-2xl mx-auto">
                Take control of your money, one budget at a time
                </p>
                <div className = "flex justify-center space-x-4">
                    <Link href = "/dashboard">
                        <Button size = "lg" className ="px-8 bg-[#8e89f0]  hover:bg-[#5249f5]" >Get Started</Button>
                    </Link>

                  
                </div>

                <div className = "hero-image-wrapper">
                    <div ref = {imageRef} className = "hero-image flex col">
                        <Image src = "/dashboard.png"   width = {1200} height = {420} alt = "Dashboard Preview" className = "rounded-lg shadow-2xl border mx-auto mt-2" priority />
                        
                    </div>
                    
                </div>
                    

            </div>

      {/* <div style={{ backgroundColor: "white" }} className = "mt-[200px] bg-neutral-50">
            
    </div> */}
            
         </div>

         </div>
        



     )
 }
 
 export default HeroSection
 