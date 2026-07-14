"use client";

import { useState } from "react";
import { FaWhatsapp, FaUserCircle, FaUserAlt, FaTimes, FaCommentAlt } from "react-icons/fa";

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

const PRE_TYPED_MESSAGES = [
  {
    id: "general",
    label: "General Enquiry",
    text: "Hi, I am interested in joining KARE IEEE Education Society. Can you please tell me more about the recruitment process and when the selections will start?"
  },
  {
    id: "schedule",
    label: "Interview Status",
    text: "Hi, I have filled out the application form for the IEEE recruitment. I would like to enquire about the status of my application and the interview schedule."
  },
  {
    id: "roles",
    label: "Domains & Roles",
    text: "Hi, I am interested in the IEEE recruitment and wanted to ask about the specific roles and tasks for the different domains (like Web Dev, AI/ML, Content, etc.)."
  }
];

export default function Coordinators() {
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [customText, setCustomText] = useState("");

  const handleOpenMsgModal = (coordinator) => {
    setSelectedCoordinator(coordinator);
    setActiveMessageIndex(0);
    setCustomText(PRE_TYPED_MESSAGES[0].text);
  };

  const handleCloseMsgModal = () => {
    setSelectedCoordinator(null);
  };

  const handleSendWhatsApp = () => {
    if (!selectedCoordinator) return;
    const encoded = encodeURIComponent(customText);
    window.open(`https://wa.me/91${selectedCoordinator.phone}?text=${encoded}`, "_blank");
    setSelectedCoordinator(null);
  };

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
                <button
                  onClick={() => handleOpenMsgModal(stud)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 border border-emerald-500/20 cursor-pointer"
                >
                  <FaWhatsapp size={18} />
                  <span>Connect on WhatsApp</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Whatsapp Inquiry Pre-typed Message Modal */}
      {selectedCoordinator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md border-white/8 bg-[#020c1b] shadow-2xl p-6 sm:p-8 relative">
            
            {/* Close button */}
            <button
              onClick={handleCloseMsgModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-6 border-b border-white/5 pb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <FaCommentAlt size={16} />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg leading-tight">
                  Enquire via WhatsApp
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Contacting <span className="text-emerald-400 font-semibold">{selectedCoordinator.name}</span>
                </p>
              </div>
            </div>

            {/* Template Selectors */}
            <div className="space-y-2 mb-5">
              <label className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block mb-1">
                Select Inquiry Topic
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRE_TYPED_MESSAGES.map((msg, idx) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setActiveMessageIndex(idx);
                      setCustomText(msg.text);
                    }}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer text-[10px] font-bold tracking-wide ${
                      activeMessageIndex === idx
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-400"
                        : "bg-white/3 border-white/8 text-slate-300 hover:bg-white/5 hover:border-white/20"
                    }`}
                  >
                    {msg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Message Area */}
            <div className="space-y-2 mb-6">
              <label className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block">
                Message Preview
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={5}
                className="w-full p-4 rounded-xl bg-white/3 border border-white/8 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 resize-none transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCloseMsgModal}
                className="flex-grow py-3 rounded-xl border border-white/8 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="flex-grow py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/20"
              >
                <FaWhatsapp size={14} />
                <span>Send via WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
