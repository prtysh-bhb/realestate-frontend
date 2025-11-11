import { useEffect, useState, useRef } from "react";
import { Home, Key, House } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Buy A New Home",
    desc: "Discover your dream home effortlessly. Explore diverse properties and expert guidance for a seamless buying experience.",
    icon: <Home size={60} />,
  },
  {
    id: 2,
    title: "Rent A Home",
    desc: "Discover your perfect rental effortlessly. Explore a diverse variety of listings tailored precisely to suit your unique lifestyle needs.",
    icon: <Key size={60} />,
  },
  {
    id: 3,
    title: "Sell A Home",
    desc: "Sell confidently with expert guidance and effective strategies, showcasing your property's best features for a successful sale.",
    icon: <House size={60} />,
  },
];

const counters = [
  { id: 1, value: 85, label: "Satisfied Clients" },
  { id: 2, value: 112, label: "Awards Received" },
  { id: 3, value: 32, label: "Successful Transactions" },
  { id: 4, value: 66, label: "Monthly Traffic" },
];

const ServicesSection = () => {
  const [counts, setCounts] = useState(counters.map(() => 0));
  const [started, setStarted] = useState(false);
  const counterRef = useRef(null);

  // Intersection Observer to start animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) observer.observe(counterRef.current);

    return () => {
      if (counterRef.current) observer.unobserve(counterRef.current);
    };
  }, [started]);

  // Counter animation
  useEffect(() => {
    if (!started) return;

    counters.forEach((counter, index) => {
      let start = 0;
      const end = counter.value;
      const duration = 2000;
      const incrementTime = 20;
      const increment = end / (duration / incrementTime);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(start);
          return newCounts;
        });
      }, incrementTime);
    });
  }, [started]);

  return (
    <section className="px-6 md:px-20 py-[100px] bg-[#fafafa] text-center">
      <div className="mb-12">
        <h4 className="text-[#134ef2] uppercase tracking-wider text-sm font-semibold">
          Our Services
        </h4>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          What We Do?
        </h2>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-800 transition-transform duration-700 transform group-hover:rotate-y-180 backface-hidden">
                    {service.icon}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-[#134ef2] rotate-y-180 backface-hidden transform group-hover:rotate-y-0 transition-transform duration-700">
                    {service.icon}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
              <a
                href="#"
                className="text-[#134ef2] font-medium hover:underline flex items-center justify-center gap-1"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>

        {/* Counters */}
        <div ref={counterRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {counters.map((counter, i) => (
            <div key={counter.id} className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-[#134ef2]">
                {counts[i]}
              </h3>
              <p className="text-gray-800 font-semibold uppercase tracking-wide mt-2">
                {counter.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
