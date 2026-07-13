"use client";

import { 
  FaLaptopCode, 
  FaTrophy, 
  FaTerminal, 
  FaComments, 
  FaDesktop, 
  FaLightbulb, 
  FaBriefcase, 
  FaUsers 
} from "react-icons/fa";

const ACTIVITIES = [
  { name: "Technical Workshops", icon: FaLaptopCode, desc: "Hands-on training in industry-demanded tools & tech." },
  { name: "Hackathons", icon: FaTrophy, desc: "Intense coding challenges to solve real-world problems." },
  { name: "Coding Competitions", icon: FaTerminal, desc: "Competitive programming matches to sharpen coding logic." },
  { name: "Technical Talks", icon: FaComments, desc: "Insightful presentations by technology experts." },
  { name: "Webinars", icon: FaDesktop, desc: "Interactive global virtual learning sessions." },
  { name: "Project Expo", icon: FaLightbulb, desc: "Exhibition to showcase innovative student prototypes." },
  { name: "Industry Sessions", icon: FaBriefcase, desc: "Connect with experts from leading tech enterprises." },
  { name: "Networking Events", icon: FaUsers, desc: "Build bridges with fellow student leaders & developers." }
];

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-ieee-deep/50">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-ieee-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[10%] w-[25vw] h-[25vw] rounded-full bg-ieee-accent/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-xs font-bold tracking-widest text-ieee-accent uppercase mb-2">
            Who We Are
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            About KARE IEEE EDUCATION SOCIETY
          </h3>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            KARE IEEE Education Society is a student-driven technical society dedicated to fostering innovation, research, leadership, technical excellence, teamwork, and professional growth. We inspire and educate the innovators of tomorrow.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white text-center mb-8 tracking-wide" data-aos="fade-up" data-aos-delay="100">
            What We Do
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACTIVITIES.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.name}
                  className="glass-panel glass-panel-hover p-6 flex flex-col items-start space-y-4 hover:border-ieee-accent/40"
                  data-aos="fade-up"
                  data-aos-delay={idx * 50}
                >
                  <div className="p-3.5 rounded-lg bg-ieee-blue/20 text-ieee-accent border border-ieee-blue/30 shadow-[0_0_15px_rgba(0,180,255,0.1)]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-base mb-1 tracking-wide">
                      {act.name}
                    </h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {act.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
