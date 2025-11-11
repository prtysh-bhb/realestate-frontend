import { Star, Ruler, Handshake } from "lucide-react";

const benefits = [
  {
    id: 1,
    title: "Proven Expertise",
    desc: "Our seasoned team excels in real estate with years of successful market navigation, offering informed decisions and optimal results.",
    icon: <Star size={60} />,
  },
  {
    id: 2,
    title: "Customized Solutions",
    desc: "We pride ourselves on crafting personalized strategies to match your unique goals, ensuring a seamless real estate journey.",
    icon: <Ruler size={60} />,
  },
  {
    id: 3,
    title: "Transparent Partnerships",
    desc: "Transparency is key in our client relationships. We prioritize clear communication and ethical practices, fostering trust and reliability throughout.",
    icon: <Handshake size={60} />,
  },
];

const WhyChooseSection = () => {
  return (
    <section className="px-6 md:px-20 bg-white text-center py-[100px]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h4 className="text-[#3151f3] uppercase tracking-wider text-sm font-semibold">
            Our Benefit
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Why Choose Us
          </h2>
        </div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-md transition-all duration-500"
            >
              {/* Flip Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20">
                  {/* Front side */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-800 transition-transform duration-700 transform backface-hidden group-hover:rotate-y-180">
                    {benefit.icon}
                  </div>

                  {/* Back side */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#3151f3] rotate-y-180 transition-transform duration-700 transform backface-hidden group-hover:rotate-y-0">
                    {benefit.icon}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
