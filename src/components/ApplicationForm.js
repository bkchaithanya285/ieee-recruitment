"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { Reorder, motion } from "framer-motion";
import { FaWhatsapp, FaExclamationTriangle, FaListOl, FaSpinner, FaCheckCircle, FaUserCheck } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import { checkRegistrationExists, checkEmailExists, submitApplicant } from "@/lib/db";
import Link from "next/link";

const ROLE_OPTIONS = [
  { value: "Web Development Team", label: "Web Development Team" },
  { value: "AI & Machine Learning Team", label: "AI & Machine Learning Team" },
  { value: "Technical Team", label: "Technical Team" },
  { value: "Content Team", label: "Content Team" },
  { value: "Social Media Team", label: "Social Media Team" },
  { value: "Video Editing Team", label: "Video Editing Team" },
  { value: "Event Coordinators", label: "Event Coordinators" },
  { value: "PR & Outreach Team", label: "PR & Outreach Team" }
];

const YEAR_OPTIONS = [
  { value: "2nd Year", label: "2nd Year" },
  { value: "3rd Year", label: "3rd Year" }
];

const DEPT_OPTIONS = [
  { value: "CSE", label: "CSE" },
  { value: "ECE", label: "ECE" },
  { value: "OTHER", label: "OTHER" }
];

export default function ApplicationForm() {
  const { addToast } = useToast();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [priorities, setPriorities] = useState([]); // Reorderable list
  const [whatsappJoined, setWhatsappJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appliedRegNo, setAppliedRegNo] = useState("");
  const [appliedName, setAppliedName] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      registrationNumber: "",
      year: "",
      department: "",
      section: "",
      email: "",
      phone: ""
    }
  });

  // Sync priorities list when selected roles change
  useEffect(() => {
    const rolesArray = selectedRoles.map(r => r.value);
    
    // Maintain old sorting order if roles are added/removed
    setPriorities(prev => {
      const filtered = prev.filter(r => rolesArray.includes(r));
      const added = rolesArray.filter(r => !prev.includes(r));
      return [...filtered, ...added];
    });
  }, [selectedRoles]);

  // Load WhatsApp status and application status from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const storedStatus = localStorage.getItem("whatsappJoined");
    if (storedStatus === "true") {
      setWhatsappJoined(true);
    }

    const storedRegNo = localStorage.getItem("appliedRegNo");
    const storedName = localStorage.getItem("appliedName");
    if (storedRegNo) {
      setAppliedRegNo(storedRegNo);
      setIsSuccess(true);
    }
    if (storedName) {
      setAppliedName(storedName);
    }
  }, []);

  const handleWhatsappJoin = () => {
    localStorage.setItem("whatsappJoined", "true");
    setWhatsappJoined(true);
    window.open("https://chat.whatsapp.com/LEVdBbZvnnEI3Flh1SKX6Y?s=cl&p=a&ilr=0", "_blank");
    addToast("Official WhatsApp group link opened!", "info");
  };

  const onSubmit = async (data) => {
    if (!whatsappJoined) {
      addToast("You must join the official WhatsApp Group before submitting.", "warning");
      return;
    }

    if (priorities.length === 0) {
      addToast("Please select at least one role preference.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Duplicate registration number check
      const regExists = await checkRegistrationExists(data.registrationNumber);
      if (regExists) {
        addToast("An application with this Registration Number already exists.", "error");
        setSubmitting(false);
        return;
      }

      // 2. Duplicate email check
      const emailExists = await checkEmailExists(data.email);
      if (emailExists) {
        addToast("An application with this Email Address already exists.", "error");
        setSubmitting(false);
        return;
      }

      // 3. Save to database
      await submitApplicant({
        ...data,
        year: data.year.value,
        department: data.department.value,
        priorities
      });

      // Save locally to lock out further applications from this device
      const finalRegNo = data.registrationNumber.trim().toUpperCase();
      const finalName = data.name.trim();
      localStorage.setItem("appliedRegNo", finalRegNo);
      localStorage.setItem("appliedName", finalName);
      setAppliedRegNo(finalRegNo);
      setAppliedName(finalName);

      addToast("Application submitted successfully!", "success");
      setIsSuccess(true);
      reset();
      setSelectedRoles([]);
      setPriorities([]);
    } catch (error) {
      console.error("Submission error:", error);
      addToast("Submission failed. Please try again later.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // React Select Custom Styling for Dark Theme
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      background: "rgba(255, 255, 255, 0.03)",
      borderColor: state.isFocused ? "#00B4FF" : "rgba(255, 255, 255, 0.08)",
      boxShadow: state.isFocused ? "0 0 10px rgba(0, 180, 255, 0.15)" : "none",
      borderRadius: "0.75rem",
      padding: "0.15rem",
      color: "white",
      "&:hover": {
        borderColor: "rgba(0, 180, 255, 0.3)"
      }
    }),
    menu: (base) => ({
      ...base,
      background: "#0A192F",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "0.75rem",
      zIndex: 50
    }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected 
        ? "#00629B" 
        : state.isFocused 
          ? "rgba(0, 180, 255, 0.1)" 
          : "transparent",
      color: "white",
      cursor: "pointer",
      "&:active": {
        background: "#00B4FF"
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: "white"
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(255, 255, 255, 0.3)",
      fontSize: "0.875rem"
    }),
    multiValue: (base) => ({
      ...base,
      background: "rgba(0, 180, 255, 0.12)",
      border: "1px solid rgba(0, 180, 255, 0.25)",
      borderRadius: "0.5rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#00B4FF",
      fontWeight: "600",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#00B4FF",
      cursor: "pointer",
      "&:hover": {
        background: "rgba(0, 180, 255, 0.25)",
        color: "white",
      }
    })
  };

  if (isSuccess) {
    return (
      <section id="apply" className="py-24 relative overflow-hidden bg-[#020c1b]">
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-ieee-blue/5 blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 relative z-30 text-center">
          <div className="glass-panel p-8 sm:p-12 border-emerald-500/20 bg-emerald-950/5 shadow-[0_0_50px_rgba(16,185,129,0.15)] rounded-2xl relative overflow-hidden">
            
            {/* Glowing check circle indicator */}
            <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/25 shadow-[0_0_35px_rgba(16,185,129,0.25)] animate-pulse">
              <FaCheckCircle size={44} />
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-wide leading-tight">
              Application Reached Us! 🎉
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto mb-8">
              Your application has been successfully saved in our database. We are excited to review your candidacy for the <strong>KARE IEEE Education Society</strong>!
            </p>

            {/* Candidate Details Card */}
            <div className="bg-[#0A192F]/60 border border-white/5 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto space-y-3.5">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2 mb-1 flex items-center justify-between">
                <span>Registration Summary</span>
                <span className="text-emerald-400 animate-pulse font-extrabold">• Live Status</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Full Name</span>
                <strong className="text-white font-bold">{appliedName || "Candidate"}</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Registration Number</span>
                <strong className="text-ieee-accent font-mono tracking-wider text-sm">{appliedRegNo}</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Submission Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  Received
                </span>
              </div>
            </div>

            {/* Urgent Warning Note */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-6 text-left max-w-lg mx-auto mb-8 space-y-2.5">
              <h4 className="text-amber-300 font-extrabold text-sm flex items-center space-x-2">
                <FaExclamationTriangle className="shrink-0 animate-bounce" size={16} />
                <span>Important: Wait for Updates in WhatsApp Group</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                All subsequent recruitment updates, interview slot selections, technical test links, and schedules will be announced **exclusively** inside our official WhatsApp community.
              </p>
              <p className="text-amber-300/80 text-[10px] font-bold leading-normal">
                * Please do not leave or exit the group to ensure you do not miss your scheduled interview slot!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                onClick={handleWhatsappJoin}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 border border-emerald-500/25 cursor-pointer"
              >
                <FaWhatsapp size={16} />
                <span>Open WhatsApp Group</span>
              </button>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-24 relative overflow-hidden bg-ieee-deep">
      
      {/* Glow effects */}
      <div className="absolute top-1/4 right-[10%] w-[30vw] h-[30vw] rounded-full bg-ieee-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[10%] w-[30vw] h-[30vw] rounded-full bg-ieee-accent/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-xs font-bold tracking-widest text-ieee-accent uppercase mb-2">
            Join Our Community
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Recruitment Completed
          </h3>
          <p className="text-slate-300 text-base sm:text-lg">
            Thank you for your interest! The recruitment process for this academic session has been completed.
          </p>
        </div>

        {/* Beautiful glass panel showing Recruitment Process Completed */}
        <div className="glass-panel p-8 sm:p-12 border-ieee-blue/20 bg-slate-900/50 shadow-[0_0_50px_rgba(0,180,255,0.1)] rounded-2xl text-center max-w-2xl mx-auto relative overflow-hidden" data-aos="fade-up" data-aos-delay="100">
          <div className="w-20 h-20 bg-gradient-to-tr from-ieee-blue/20 to-ieee-accent/10 text-ieee-accent rounded-2xl flex items-center justify-center mx-auto mb-8 border border-ieee-blue/20 shadow-[0_0_30px_rgba(0,180,255,0.2)]">
            <FaUserCheck size={36} />
          </div>

          <h4 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-wide">
            Recruitment Closed
          </h4>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            The registration window is now closed. We have successfully completed our recruitment drive for the 2026-2027 academic year. 
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/status"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-ieee-blue hover:bg-ieee-light text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,180,255,0.4)] hover:-translate-y-0.5 border border-ieee-accent/25"
            >
              Check Application Status
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
