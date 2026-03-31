
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[calc(100dvh-72px)] min-h-[600px] flex items-center justify-center pt-32 pb-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/hero_happy.png")' }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-start justify-center">
          <p className="text-[#00b749] font-bold text-base md:text-lg mb-3 tracking-wider uppercase">
          Give Love. Give Care. Give Dignity.
        </p>

        <h1 className="text-white font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-6 max-w-4xl">
          Empowering the<br />
          Elderly Generation
        </h1>

        <p className="text-white/90 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          At Golden Years Care Foundation, we believe every senior deserves a life of respect, 
          comfort, and compassion. We provide care, shelter, and emotional support to elderly 
          individuals who need it the most.
          <br /><br />
          Be a part of their journey.
        </p>

        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          <Link
            href="/donate"
            className="group bg-[#00b749] hover:bg-[#00a040] text-white px-3 md:px-7 py-2.5 md:py-3 rounded-full text-[11px] xs:text-xs md:text-base font-semibold transition-all flex items-center gap-1 md:gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap"
          >
            Donate Now
            <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/contact"
            className="group bg-white hover:bg-white/90 text-black px-3 md:px-7 py-2.5 md:py-3 rounded-full text-[11px] xs:text-xs md:text-base font-semibold transition-all flex items-center gap-1 md:gap-2 flex-1 sm:flex-none justify-center border border-black/5 whitespace-nowrap"
          >
            Become a Volunteer
          </Link>
        </div>
      </div>
    </section>
  );
}
