"use client";

export default function Marquee() {
  return (
    <section className="py-24 bg-[#FAFAFA] text-[#050505] overflow-hidden flex flex-col gap-4 relative">
      
      {/* This invisible style block gives us the smooth infinite scrolling math */}
      <style>{`
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .marquee-left { animation: scrollLeft 30s linear infinite; }
        .marquee-right { animation: scrollRight 30s linear infinite; }
      `}</style>

      {/* ROW 1: Scrolling Left (Solid Text) */}
      <div className="flex w-[200%] marquee-left">
        <div className="flex whitespace-nowrap">
          <span className="text-6xl md:text-9xl font-black uppercase tracking-tighter pr-8">
            INNOVATE • CREATE • ELEVATE • 
          </span>
          <span className="text-6xl md:text-9xl font-black uppercase tracking-tighter pr-8">
            INNOVATE • CREATE • ELEVATE • 
          </span>
          <span className="text-6xl md:text-9xl font-black uppercase tracking-tighter pr-8">
            INNOVATE • CREATE • ELEVATE • 
          </span>
          <span className="text-6xl md:text-9xl font-black uppercase tracking-tighter pr-8">
            INNOVATE • CREATE • ELEVATE • 
          </span>
        </div>
      </div>

      {/* ROW 2: Scrolling Right (Outlined "Stroke" Text) */}
      <div className="flex w-[200%] marquee-right">
        <div className="flex whitespace-nowrap">
          <span 
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter pr-8 text-transparent"
            style={{ WebkitTextStroke: '2px #050505' }}
          >
            ASTONISH • INSPIRE • CONVERT • 
          </span>
          <span 
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter pr-8 text-transparent"
            style={{ WebkitTextStroke: '2px #050505' }}
          >
            ASTONISH • INSPIRE • CONVERT • 
          </span>
          <span 
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter pr-8 text-transparent"
            style={{ WebkitTextStroke: '2px #050505' }}
          >
            ASTONISH • INSPIRE • CONVERT • 
          </span>
          <span 
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter pr-8 text-transparent"
            style={{ WebkitTextStroke: '2px #050505' }}
          >
            ASTONISH • INSPIRE • CONVERT • 
          </span>
        </div>
      </div>

    </section>
  );
}