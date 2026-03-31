'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: 'Innovating Youth Engagement Developing creative programs to inspire and involve young people in community initiatives.',
    author: 'Liam Carter',
    role: 'Program Director',
  },
  {
    quote: 'Innovating Youth Engagement Developing creative programs to inspire and involve young people in community initiatives.',
    author: 'Liam Carter',
    role: 'Program Director',
  },
  {
    quote: 'Innovating Youth Engagement Developing creative programs to inspire and involve young people in community initiatives.',
    author: 'Liam Carter',
    role: 'Program Director',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-zinc-100 text-black fr-section">
      <div className="fr-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Stories Bringing Hope</h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="text-zinc-600">
              Real stories from those we've helped and those who help sharing the hope &amp; heart.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-3xl border border-zinc-200 bg-white p-8"
            >
              <p className="text-zinc-800 leading-relaxed">{t.quote}</p>
              <div className="mt-6 text-sm text-zinc-600">
                — {t.author}, {t.role}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
