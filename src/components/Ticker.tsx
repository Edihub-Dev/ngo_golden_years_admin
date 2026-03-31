export default function Ticker() {
  const messages = [
    "GOLDEN YEARS CARE FOUNDATION",
    "•",
    "DIGNITY IN OLD AGE CARE",
    "•",
    "SPIRITUAL & MORAL VALUES",
    "•",
    "ENVIRONMENT PROTECTION",
    "•",
    "HEALTH & HYGIENE AWARENESS",
    "•",
    "SUPPORT OUR ELDERS",
    "•",
    "EDUCATIONAL EMPOWERMENT",
    "•",
    "CONSERVE NATURAL RESOURCES",
    "•",
    "FOSTERING COMPANIONSHIP",
    "•"
  ];

  return (
    <div className="bg-[#00b749] py-4 overflow-hidden select-none">
      <div className="flex animate-marquee white-space-nowrap">
        <div className="flex gap-12 items-center mx-4">
          {messages.map((msg, i) => (
            <span key={i} className="text-white font-black text-2xl md:text-3xl tracking-tighter uppercase shrink-0">
              {msg}
            </span>
          ))}
        </div>
        <div className="flex gap-12 items-center mx-4">
          {messages.map((msg, i) => (
            <span key={`dup-${i}`} className="text-white font-black text-2xl md:text-3xl tracking-tighter uppercase shrink-0">
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
