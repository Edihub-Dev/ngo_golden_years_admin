import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const campaigns = [
  {
    id: 'elderly-care-and-shelter',
    title: 'Elderly Care & Shelter',
    description: 'Providing safe homes, food, and daily care for seniors in need.',
    image: '/assets/hero_happy.png',
  },
  {
    id: 'healthcare-and-medical-aid',
    title: 'Healthcare & Medical Aid',
    description: 'Regular check-ups, nursing care, physiotherapy, and health camps.',
    image: '/assets/health_camp.png',
  },
  {
    id: 'emotional-and-spiritual-support',
    title: 'Emotional & Spiritual Support',
    description: 'Creating a sense of belonging through counseling, community, and spiritual programs.',
    image: '/assets/cause_spiritual.png',
  },
  {
    id: 'education-and-awareness',
    title: 'Education & Awareness',
    description: 'Workshops and programs on health, hygiene, and social responsibility.',
    image: '/assets/cause_education.png',
  },
  {
    id: 'environment-protection',
    title: 'Environment Protection',
    description: 'Tree plantation, water conservation, and sustainability initiatives.',
    image: '/assets/environment.png',
  }
];

export default function CampaignsSection() {
  return (
    <section className="bg-[#050505] py-24 relative overflow-hidden" id="causes">
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00b749]" />
                <span className="text-white/80 font-medium">Our Causes</span>
             </div>
             <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">
               What We Stand For
             </h2>
          </div>
          <p className="text-white/70 text-lg max-w-sm">
            Empowering elderly individuals with the care, dignity, and support they deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp) => {
            return (
              <div key={camp.id} className="group bg-[#111111] rounded-[2rem] overflow-hidden border border-white/10 hover:border-[#00b749]/50 transition-all duration-300 p-6 flex flex-col">
                <div className="h-56 overflow-hidden rounded-[1.5rem] relative mb-8">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                    style={{ backgroundImage: `url(${camp.image})` }} 
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                </div>
                
                <div className="flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{camp.title}</h3>
                  <p className="text-white/60 text-base leading-relaxed mb-8 flex-1">
                    {camp.description}
                  </p>

                  <Link 
                    href={`/causes/${camp.id}`}
                    className="group/button outline-none mt-auto flex flex-row items-center justify-center w-full py-4 px-6 rounded-full bg-[#00b749] text-white font-bold hover:bg-[#00a040] transition-all duration-300 gap-2 shadow-sm"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
