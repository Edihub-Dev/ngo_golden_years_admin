'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="bg-black text-white fr-section">
      <div className="fr-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-linear-to-b from-white/5 to-white/0 p-10 md:p-14"
        >
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Be the Reason Someone Smiles.</h3>
          <p className="mt-3 text-white/70 max-w-2xl">
            Join us in the journey to empower communities and change lives.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="text-white/70 text-sm">Peoples joined already</div>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Donate Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
