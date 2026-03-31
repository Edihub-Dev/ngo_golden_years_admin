'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black pt-24 pb-12 overflow-hidden relative" id="contact">
      <div className="max-w-7xl mx-auto px-6">

        {/* Call to Action pre-footer */}
        <div className="bg-[#121212] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden mb-24 border border-white/5">
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Get Involved<br />Today
            </h2>
            <p className="text-white/70 text-lg md:text-xl mb-12">
              Whether you want to donate, volunteer, or partner with us — we welcome you.
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center bg-[#00b749] hover:bg-[#00a040] text-white px-8 py-4 rounded-full text-base font-semibold transition-all group mt-4 z-20"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Decorative gradients */}
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-10 blur-[100px] pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, #00b749 0%, transparent 50%)' }} />
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 relative z-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6 bg-white/90 p-3 rounded-xl max-w-fit">
              <img src="/assets/Logo.png" alt="Golden Years Care Foundation" className="h-12 md:h-14 w-auto object-contain" />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 pe-4">
              Empowering communities, rebuilding hope, and driving measurable impact through innovative charitable solutions.
            </p>
            <div className="flex space-x-3">
              {['FB', 'TW', 'IG', 'LI'].map((social) => (
                <Link key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00b749] transition-colors text-white/80 hover:text-white text-xs font-medium">
                  {social}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Our Causes', href: '/causes' },
                { name: 'Programs', href: '/programs' },
                { name: 'Governance', href: '/governance' },
                { name: 'Contact', href: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-4">
              {[
                { name: 'Financials', href: '/financials' },
                { name: 'Annual Reports', href: '/annual-reports' },
                { name: 'Blog & News', href: '/blog' },
                { name: 'Success Stories', href: '/success-stories' },
                { name: 'FAQ', href: '/faq' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
            <p className="text-white/60 text-sm mb-4">
              Subscribe to our newsletter to receive the latest updates.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00b749] transition-colors"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-[#00b749] text-white p-2 rounded-full hover:bg-[#00a040] transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 w-full">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Golden Years Care Foundation. Developed by <Link href="https://edihub.in/" className='text-white/80 hover:text-green-500 transition-colors'>Edihub</Link>.
          </p>
          <div className="flex space-x-6 text-sm text-white/40">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
