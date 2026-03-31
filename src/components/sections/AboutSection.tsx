'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="bg-zinc-100 text-black fr-section">
      <div className="fr-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
              <span>About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              United Together to Create
              <br />
              Enduring Hope
            </h2>
            <p className="text-zinc-600 text-lg leading-relaxed max-w-xl mb-8">
              We are purpose driven organization empowering health &amp; education.
            </p>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-white transition-colors">
              <span>Learn More</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="rounded-3xl border border-zinc-300 bg-white p-2">
              <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
                <Image
                  src="/assets/Together_images.avif"
                  alt="Together"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-8">
            <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
            <span>Our Trusted Supporters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center opacity-70">
            {['Logo', 'Logo', 'Logo', 'Logo', 'Logo', 'Logo'].map((t, idx) => (
              <div key={idx} className="h-10 rounded-lg bg-white/60 border border-zinc-200" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
