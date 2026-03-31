import { ArrowRight, Heart, Sun, BookOpen, Leaf } from 'lucide-react';
import Link from 'next/link';

const programs = [
  {
    id: 'old-age-homes',
    category: 'Residential Care',
    title: 'Old Age Homes',
    icon: <Heart className="w-6 h-6" />,
    description: 'Providing long-term residential care with dignity and safety.',
    image: '/assets/hero_happy.png',
  },
  {
    id: 'day-care-centers',
    category: 'Daily Care',
    title: 'Day Care Centers',
    icon: <Sun className="w-6 h-6" />,
    description: 'A place for seniors to engage, socialize, and receive care during the day.',
    image: '/assets/feature_day_care.png',
  },
  {
    id: 'healthcare-services',
    category: 'Medical Support',
    title: 'Healthcare Services',
    icon: <Heart className="w-6 h-6" />,
    description: 'Medical support including check-ups, physiotherapy, and nursing.',
    image: '/assets/health_camp.png',
  },
  {
    id: 'food-shelter-support',
    category: 'Spiritual',
    title: 'Food & Shelter Support',
    icon: <Sun className="w-6 h-6" />,
    description: 'Helping elderly individuals with basic necessities and care.',
    image: '/assets/program_food.png',
  }
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-24" id="programs">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00b749]" />
              <span className="text-black/80 font-medium tracking-wide">Initiatives</span>
            </div>
            <h2 className="text-black text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Our Key Programs
            </h2>
          </div>
          <p className="text-black/60 text-lg max-w-sm">
            Nurturing a dignified and supportive world for our seniors to live with comfort and honor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program.id} className="group bg-[#f9fafb] rounded-[3rem] p-8 md:p-12 border border-black/5 hover:bg-black hover:text-white transition-all duration-500 overflow-hidden relative shadow-sm">
              <div className="relative z-10 flex flex-col h-full">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e5f7ed] text-[#00b749] text-xs font-bold rounded-full mb-8 w-fit group-hover:bg-[#00b749] group-hover:text-white transition-colors duration-500">
                  {program.category}
                </div>
                
                <h3 className="text-3xl font-bold mb-6 tracking-tight">
                  {program.title}
                </h3>
                
                <p className="text-black/60 group-hover:text-white/70 text-lg mb-10 leading-relaxed max-w-xl transition-colors duration-500">
                  {program.description}
                </p>

                <div className="mt-auto pt-8 border-t border-black/5 group-hover:border-white/10 transition-colors duration-500 overflow-hidden rounded-[2.5rem]">
                   <img src={program.image} alt={program.title} className="w-full h-56 object-cover rounded-[2rem] group-hover:scale-105 transition-transform duration-700 shadow-sm" />
                </div>
                
                <Link 
                  href={`/programs/${program.id}`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold group-hover:text-[#00b749] transition-colors"
                >
                  View Initiative Details
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
