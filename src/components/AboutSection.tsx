'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section className="bg-[#f0f1f2] py-24" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
          <div className="flex-1 w-full max-w-xl">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00b749]" />
                <span className="text-black/80 font-medium">About Us</span>
             </div>
             <h2 className="text-black text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
               We Care for the Forgotten Generation
             </h2>
             <p className="text-black/70 text-lg mb-8 leading-relaxed">
               Golden Years Care Foundation is dedicated to improving the quality of life for senior 
               citizens by providing safe shelter, healthcare, and emotional support.
               <br /><br />
               We work to ensure that no elderly person feels abandoned, neglected, or alone.
             </p>
             <Link 
                href="/about"
                className="inline-flex group/button items-center justify-center py-3.5 px-8 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300 gap-2 text-sm max-w-fit"
             >
                Learn More
                <ArrowRight className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-300" />
             </Link>
          </div>
          <div className="flex-1 w-full">
            <div className="h-[400px] lg:h-[450px] w-full bg-cover bg-center rounded-3xl shadow-xl" style={{ backgroundImage: 'url("/assets/day_care.png")' }} />
          </div>
        </div>

        <div>
           <div className="flex items-center gap-2 mb-8">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00b749]" />
              <span className="text-black/80 font-medium">Our Trusted Supporters</span>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="flex justify-center"><h3 className="text-2xl font-bold italic mix-blend-multiply text-black">lumina</h3></div>
              <div className="flex justify-center"><h3 className="text-2xl font-black mix-blend-multiply flex items-center gap-1 text-black"><span className="w-6 h-6 rounded-full border-4 border-black inline-block"/> spiral</h3></div>
              <div className="flex justify-center"><h3 className="text-3xl font-black mix-blend-multiply text-black">LOQO</h3></div>
              <div className="flex justify-center"><h3 className="text-3xl font-bold italic tracking-tighter mix-blend-multiply text-black">cico</h3></div>
              <div className="flex justify-center"><h3 className="text-2xl font-bold mix-blend-multiply flex items-center gap-1 text-black"><span className="w-6 h-6 rounded-sm bg-black inline-block rotate-45"/> Logoipsum</h3></div>
              <div className="flex justify-center"><h3 className="text-2xl font-black tracking-widest mix-blend-multiply text-black">IPSUM</h3></div>
           </div>
        </div>
      </div>
    </section>
  );
}
