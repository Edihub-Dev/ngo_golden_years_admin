'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    q: 'What is your NGO’s mission?',
    a: 'Our mission is to deliver sustainable support through health, education, and emergency relief programs that create lasting impact.',
  },
  {
    q: 'How are donations used?',
    a: 'Donations directly fund programs, logistics, and community partnerships. We prioritize transparency and measurable outcomes.',
  },
  {
    q: 'Can I volunteer?',
    a: 'Yes. You can volunteer on-ground, remotely, or by supporting program coordination and outreach depending on availability.',
  },
  {
    q: 'Besides donating, how else can I help?',
    a: 'You can sponsor initiatives, share resources, partner with us, or help amplify our message through your network.',
  },
  {
    q: 'Can I sponsor a child or family?',
    a: 'We offer sponsorship-style programs through selected initiatives. Contact us and we’ll guide you to the best option.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-zinc-100 text-black fr-section">
      <div className="fr-container">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
            <span>FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">What You’re Thinking, We’ve Answered.</h2>
          <p className="mt-3 text-zinc-600">
            Find helpful answers to common questions about donating, volunteering &amp; fundraising.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                className="rounded-2xl border border-zinc-200 bg-white"
              >
                <button
                  type="button"
                  className="w-full text-left px-5 py-4 font-medium"
                  onClick={() => setOpen(isOpen ? null : idx)}
                >
                  {f.q}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
