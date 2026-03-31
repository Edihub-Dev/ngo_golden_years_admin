'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from "../../lib/utils";

export default function HeroFramer() {
  return (
    <section className={cn('relative', 'min-h-[92vh]', 'bg-black')}>
      <div className={cn('absolute', 'inset-0')}>
        <Image
          src="/assets/Hero_image_2.avif"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
        <div className={cn('absolute', 'inset-0', 'bg-black/55')} />
        <div className={cn('absolute', 'inset-0', 'bg-linear-to-b', 'from-black/20', 'via-black/40', 'to-black/90')} />
      </div>

      <div className={cn('relative', 'z-10', 'fr-container', 'pt-28', 'pb-20')}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className={cn('text-green-400', 'text-sm', 'font-medium', 'mb-4')}>
            Together, We Create Impact
          </div>

          <h1 className={cn('text-5xl', 'sm:text-6xl', 'md:text-7xl', 'font-semibold', 'tracking-tight', 'text-white', 'leading-[1.05]')}>
            Unite. Act.
            <br />
            Transform
          </h1>

          <p className={cn('mt-6', 'text-white/70', 'max-w-md')}>
            Your support powers life changing missions feeding families &amp; rebuilding hope.
          </p>

          <div className={cn('mt-10', 'flex', 'flex-col', 'sm:flex-row', 'gap-3')}>
            <Link
              href="/login"
              className={cn('inline-flex', 'items-center', 'justify-center', 'gap-2', 'rounded-full', 'bg-green-600', 'px-6', 'py-3', 'text-sm', 'font-semibold', 'text-white', 'hover:bg-green-700', 'transition-colors')}
            >
              <span>Login Now</span>
              <ArrowRight className={cn('h-4', 'w-4')} />
            </Link>

            <Link
              href="/register"
              className={cn('inline-flex', 'items-center', 'justify-center', 'rounded-full', 'bg-white', 'px-6', 'py-3', 'text-sm', 'font-semibold', 'text-black', 'hover:bg-zinc-100', 'transition-colors')}
            >
              Register Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
