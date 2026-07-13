"use client";

import { FaWhatsapp, FaUserCircle, FaUserAlt } from "react-icons/fa";

const STUDENTS = [
  { name: "S Sai Prakyath", phone: "9391171573" },
  { name: "B Vinay Reddy", phone: "8374148146" },
  { name: "S Greeshma", phone: "7671810135" },
];

const FACULTY = [
  { name: "Dr. P. Chinnasamy", title: "Faculty Coordinator" },
  { name: "Dr. Dhiliphan Rajkumar", title: "Faculty Coordinator" },
  { name: "Ms. P. J. Kiruthiga", title: "Faculty Coordinator" },
];

export default function Coordinators() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-ieee-deep/50">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-ieee-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-xs font-bold tracking-widest text-ieee-accent uppercase mb-2">
            Get In Touch
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Our Coordinators
          </h3>
          <p className="text-slate-300 text-base sm:text-lg">
            Have queries regarding recruitment or society operations? Reach out to our student or faculty coordinators.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="mb-16">
          <h4 className="text-lg font-bold text-white tracking-wider text-center mb-8 uppercase" data-aos="fade-up">
            Faculty Advisors
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {FACULTY.map((fac, idx) => (
              <div
                key={fac.name}
                className="glass-panel glass-panel-hover p-6 text-center border-white/5 hover:border-ieee-accent/20"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <div className="w-16 h-16 rounded-full bg-ieee-blue/10 text-ieee-blue/60 flex items-center justify-center mx-auto mb-4 border border-ieee-blue/20">
                  <FaUserCircle size={36} />
                </div>
                <h5 className="text-white font-extrabold text-lg tracking-wide mb-1">
                  {fac.name}
                </h5>
                <p className="text-ieee-accent text-xs font-semibold tracking-wider">
                  {fac.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Student Grid */}
        <div>
          <h4 className="text-lg font-bold text-white tracking-wider text-center mb-8 uppercase" data-aos="fade-up">
            Student Coordinators
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {STUDENTS.map((stud, idx) => (
              <div
                key={stud.name}
                className="glass-panel glass-panel-hover p-6 text-center border-white/5 hover:border-ieee-accent/20 flex flex-col justify-between"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <div>
                  <div className="w-16 h-16 rounded-full bg-ieee-accent/10 text-ieee-accent flex items-center justify-center mx-auto mb-4 border border-ieee-accent/20">
                    <FaUserAlt size={26} />
                  </div>
                  <h5 className="text-white font-extrabold text-lg tracking-wide mb-1">
                    {stud.name}
                  </h5>
                  <p className="text-slate-400 text-xs font-medium tracking-wide mb-6">
                    Student Representative
                  </p>
                </div>
                
                {/* Whatsapp Trigger Button */}
                <a
                  href={`https://wa.me/91${stud.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 border border-emerald-500/20"
                >
                  <FaWhatsapp size={18} />
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
