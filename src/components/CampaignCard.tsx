import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  category: string;
}

export default function CampaignCard({ 
  id, 
  title, 
  description, 
  image, 
  raised, 
  goal, 
  category 
}: CampaignCardProps) {
  const progress = (raised / goal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="card-dark overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-500 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white">Raised: ${raised.toLocaleString()}</span>
            <span className="text-gray-400">Goal: ${goal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-400 mt-1">
            {progress.toFixed(1)}% funded
          </div>
        </div>

        {/* Action */}
        <Link 
          href={`/campaign/${id}`}
          className="flex items-center justify-between text-green-500 hover:text-green-400 transition-colors"
        >
          <span className="font-medium">Learn More</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
