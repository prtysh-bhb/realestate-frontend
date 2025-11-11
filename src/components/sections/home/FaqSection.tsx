import {  useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Liam Anderson",
    role: "CEO Digital",
    text: `I truly appreciate the professionalism and in-depth knowledge of the brokerage team. They not only helped me find the perfect home but also assisted with legal and financial aspects, making me feel confident and secure in my decision.`,
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: 2,
    name: "Adam Will",
    role: "CEO Agency",
    text: `My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation.`,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 3,
    name: "Sophia Turner",
    role: "Investor",
    text: `The team made my buying experience smooth and transparent. Their attention to detail and quick communication impressed me.`,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    name: "Noah Davis",
    role: "Entrepreneur",
    text: `Excellent service! From finding my dream property to handling documentation — everything was handled efficiently.`,
    image: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    id: 5,
    name: "Ella Johnson",
    role: "Home Owner",
    text: `The agency helped me sell my home quickly and at a great price. Their team is reliable and trustworthy.`,
    image: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  {
    id: 6,
    name: "James Carter",
    role: "Investor",
    text: `I love how professional and transparent the process was. Highly recommended for anyone in real estate.`,
    image: "https://randomuser.me/api/portraits/men/80.jpg",
  },
];

const FaqSection = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);;
  const [autoPlay, setAutoPlay] = useState(false);

  // Scroll the slider by width of 1 card set
  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = slider.offsetWidth / 3; // show 3 per view
    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto slide
//   useEffect(() => {
//     if (!autoPlay) return;
//     const interval = setInterval(() => {
//       scroll("right");
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [autoPlay]);

  return (
    <section className="px-6 md:px-20 py-[100px] bg-[#fafafa]">
      <div className="max-w-7xl mx-auto md:flex items-start gap-8">
        {/* Left section */}
        <div>
          <h5 className="text-[#3151f3] uppercase font-semibold text-sm tracking-wide">
            Top Properties
          </h5>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            What’s People Say’s
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Our seasoned team excels in real estate with years of successful
            market navigation, offering informed decisions and optimal results.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => scroll("left")}
              className="bg-[#3151f3] hover:bg-[#2548b8] text-white p-3 rounded-md transition cursor-pointer"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-white border border-gray-300 text-gray-800 p-3 rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-2"
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-8 shadow-sm flex-shrink-0 w-[350px] md:w-[400px]"
            >
              {/* Stars */}
              <div className="flex mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} fill="#facc15" size={18} />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 italic leading-relaxed mb-6 line-clamp-6">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
