'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Invisible Overlay for click-outside closure */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-transparent"
          onClick={closeMenu}
        />
      )}

      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50">
        <nav className="bg-white/80 backdrop-blur-xl rounded-full px-6 py-2 border border-black/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center px-3 py-1.5 rounded-xl space-x-2" onClick={closeMenu}>
            <img src="/assets/Logo.png" alt="Golden Years Care Foundation" className="h-7 md:h-9 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-sm font-bold text-black/60 hover:text-black transition-colors">About</Link>
            <Link href="/causes" className="text-sm font-bold text-black/60 hover:text-black transition-colors">Causes</Link>
            <Link href="/programs" className="text-sm font-bold text-black/60 hover:text-black transition-colors">Programs</Link>
            <Link href="/governance" className="text-sm font-bold text-black/60 hover:text-black transition-colors">Governance</Link>
            <Link href="/blog" className="text-sm font-bold text-black/60 hover:text-black transition-colors">Blog</Link>
            <Link href="/contact" className="text-sm font-bold text-black/60 hover:text-black transition-colors">Contact</Link>
          </div>

          <div className="hidden md:block">
            <Link href="/donate" className="bg-[#00B749] hover:bg-[#00A040] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2">
              Donate Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation - Kept Original Theme Precisely */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-2 bg-white/90 backdrop-blur-2xl border border-black/5 rounded-2xl overflow-hidden shadow-2xl relative z-50"
          >
            <div className="px-4 py-4 space-y-4">
              <Link href="/about" onClick={closeMenu} className="block text-black/70 hover:text-black font-medium">About</Link>
              <Link href="/causes" onClick={closeMenu} className="block text-black/70 hover:text-black font-medium">Causes</Link>
              <Link href="/programs" onClick={closeMenu} className="block text-black/70 hover:text-black font-medium">Programs</Link>
              <Link href="/governance" onClick={closeMenu} className="block text-black/70 hover:text-black font-medium">Governance</Link>
              <Link href="/blog" onClick={closeMenu} className="block text-black/70 hover:text-black font-medium">Blog</Link>
              <Link href="/contact" onClick={closeMenu} className="block text-black/70 hover:text-black font-medium">Contact</Link>
              <Link href="/donate" onClick={closeMenu} className="bg-[#00B749] text-white px-5 py-3 rounded-xl font-semibold w-full flex justify-center text-center">
                Donate Now
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}