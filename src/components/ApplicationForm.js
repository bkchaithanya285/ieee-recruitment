"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { Reorder, motion } from "framer-motion";
import { FaWhatsapp, FaExclamationTriangle, FaListOl, FaSpinner, FaCheckCircle, FaUserCheck } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import { checkRegistrationExists, checkEmailExists, submitApplicant } from "@/lib/db";

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
            Application Form
          </h3>
          <p className="text-slate-300 text-base sm:text-lg">
            Please fill out all the fields below carefully. Choose your desired teams and rank them in order of your preference.
          </p>
        </div>

        {/* Application Form Box */}
        <div className="glass-panel p-8 sm:p-10 hover:border-ieee-blue/20" data-aos="fade-up" data-aos-delay="100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="text-slate-300 font-semibold text-xs tracking-wider uppercase mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`bg-white/3 border px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-ieee-accent focus:ring-2 focus:ring-ieee-accent/20 transition-all ${
                    errors.name ? "border-rose-500/50" : "border-white/8"
                  }`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span className="text-rose-400 text-xs mt-1.5 font-semibold">{errors.name.message}</span>}
              </div>

              {/* Registration Number */}
              <div className="flex flex-col">
                <label className="text-slate-300 font-semibold text-xs tracking-wider uppercase mb-2">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9919004001"
                  className={`bg-white/3 border px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-ieee-accent focus:ring-2 focus:ring-ieee-accent/20 transition-all ${
                    errors.registrationNumber ? "border-rose-500/50" : "border-white/8"
                  }`}
                  {...register("registrationNumber", { required: "Registration Number is required" })}
                />
                {errors.registrationNumber && <span className="text-rose-400 text-xs mt-1.5 font-semibold">{errors.registrationNumber.message}</span>}
              </div>

              {/* Year */}
              <div className="flex flex-col">
                <label className="text-slate-300 font-semibold text-xs tracking-wider uppercase mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="year"
                  control={control}
                  rules={{ required: "Year is required" }}
                  render={({ field }) => (
                    isMounted ? (
                      <Select
                        {...field}
                        instanceId="year-select"
                        options={YEAR_OPTIONS}
                        placeholder="Select your year"
                        styles={customSelectStyles}
                        isSearchable={false}
                      />
                    ) : (
                      <div className="w-full h-[42px] bg-white/3 border border-white/8 rounded-xl animate-pulse" />
                    )
                  )}
                />
                {errors.year && <span className="text-rose-400 text-xs mt-1.5 font-semibold">{errors.year.message}</span>}
              </div>

              {/* Department */}
              <div className="flex flex-col">
                <label className="text-slate-300 font-semibold text-xs tracking-wider uppercase mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="department"
                  control={control}
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    isMounted ? (
                      <Select
                        {...field}
                        instanceId="department-select"
                        options={DEPT_OPTIONS}
                        placeholder="Select your department"
                        styles={customSelectStyles}
                        isSearchable={false}
                      />
                    ) : (
                      <div className="w-full h-[42px] bg-white/3 border border-white/8 rounded-xl animate-pulse" />
                    )
                  )}
                />
                {errors.department && <span className="text-rose-400 text-xs mt-1.5 font-semibold">{errors.department.message}</span>}
              </div>

              {/* Section */}
              <div className="flex flex-col">
                <label className="text-slate-300 font-semibold text-xs tracking-wider uppercase mb-2">
                  Section <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. A or B"
                  className={`bg-white/3 border px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-ieee-accent focus:ring-2 focus:ring-ieee-accent/20 transition-all ${
                    errors.section ? "border-rose-500/50" : "border-white/8"
                  }`}
                  {...register("section", { required: "Section is required" })}
                />
                {errors.section && <span className="text-rose-400 text-xs mt-1.5 font-semibold">{errors.section.message}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-slate-300 font-semibold text-xs tracking-wider uppercase mb-2">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  className={`bg-white/3 border px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-ieee-accent focus:ring-2 focus:ring-ieee-accent/20 transition-all ${
                    errors.email ? "border-rose-500/50" : "border-white/8"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format"
                    }
                  })}
                />
                {errors.email && <span className="text-rose-400 text-xs mt-1.5 font-semibold">{errors.email.message}</span>}
              </div>

              {/* WhatsApp Phone Number */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-slate-300 font-semibold text-xs tracking-wider uppercase mb-2">
                  WhatsApp Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="10-digit WhatsApp number"
                  className={`bg-white/3 border px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-ieee-accent focus:ring-2 focus:ring-ieee-accent/20 transition-all ${
                    errors.phone ? "border-rose-500/50" : "border-white/8"
                  }`}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be exactly 10 digits"
                    }
                  })}
                />
                {errors.phone && <span className="text-rose-400 text-xs mt-1.5 font-semibold">{errors.phone.message}</span>}
              </div>

            </div>

            {/* Role Preference Selector */}
            <div className="flex flex-col border-t border-white/5 pt-6">
              <label className="text-slate-300 font-semibold text-xs tracking-wider uppercase mb-1">
                Role Preferences (Select up to 3) <span className="text-red-500">*</span>
              </label>
              <p className="text-slate-400 text-xs mb-3">
                Select your preferred teams. You can choose a maximum of three domains.
              </p>
              {isMounted ? (
                <Select
                  instanceId="roles-select"
                  isMulti
                  options={ROLE_OPTIONS}
                  value={selectedRoles}
                  onChange={(selected) => {
                    if (selected && selected.length > 3) {
                      addToast("You can select a maximum of 3 roles.", "warning");
                      return;
                    }
                    setSelectedRoles(selected || []);
                  }}
                  placeholder="Choose preferred roles..."
                  styles={customSelectStyles}
                  closeMenuOnSelect={false}
                />
              ) : (
                <div className="w-full h-[42px] bg-white/3 border border-white/8 rounded-xl animate-pulse" />
              )}
            </div>

            {/* Drag & Drop Reordering */}
            {priorities.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col border border-white/5 rounded-2xl p-6 bg-white/2"
              >
                <label className="text-slate-300 font-semibold text-xs tracking-wider uppercase mb-1 flex items-center space-x-2">
                  <FaListOl className="text-ieee-accent" />
                  <span>Prioritize Selected Roles (Drag to Reorder)</span>
                </label>
                <p className="text-slate-400 text-xs mb-4">
                  Drag the cards up or down to set your priority order. Top card represents your highest priority choice.
                </p>
                
                {/* Reorder Group */}
                <Reorder.Group
                  axis="y"
                  values={priorities}
                  onReorder={setPriorities}
                  className="space-y-3 cursor-grab"
                >
                  {priorities.map((role, idx) => (
                    <Reorder.Item
                      key={role}
                      value={role}
                      className="glass-panel p-4 flex items-center justify-between border-white/8 hover:border-ieee-accent/30 bg-[#0A192F]/60 select-none active:cursor-grabbing"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-ieee-blue/20 text-ieee-accent font-bold text-xs flex items-center justify-center border border-ieee-blue/30">
                          {idx + 1}
                        </span>
                        <span className="text-white text-sm font-semibold tracking-wide">
                          {role}
                        </span>
                      </div>
                      <div className="text-slate-500 text-xs">
                        Priority {idx + 1}
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </motion.div>
            )}

            {/* WhatsApp Verification Gate */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-start space-x-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <FaExclamationTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                  <h5 className="font-bold text-amber-300 leading-tight mb-1">
                    WhatsApp Group Joining is Mandatory
                  </h5>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    You must join our official WhatsApp Group before submitting your application. This is where all recruitment updates and schedules will be announced.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/2 border border-white/5 p-4 rounded-xl">
                <button
                  type="button"
                  onClick={handleWhatsappJoin}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
                >
                  <FaWhatsapp size={20} />
                  <span>Join Official WhatsApp Group</span>
                </button>

                {whatsappJoined ? (
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold bg-emerald-950/20 border border-emerald-500/20 px-4 py-2.5 rounded-lg w-full sm:w-auto justify-center">
                    <FaCheckCircle size={16} />
                    <span>WhatsApp Group Verified</span>
                  </div>
                ) : (
                  <span className="text-amber-400 text-xs font-semibold">
                    Verification Pending
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || !whatsappJoined || priorities.length === 0}
                className={`w-full py-4 rounded-xl text-white font-extrabold text-base tracking-wider uppercase transition-all duration-300 ${
                  whatsappJoined && priorities.length > 0 && !submitting
                    ? "bg-ieee-blue hover:bg-ieee-light hover:shadow-[0_0_20px_rgba(0,180,255,0.4)] hover:-translate-y-0.5 border border-ieee-accent/25 cursor-pointer"
                    : "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <FaSpinner className="animate-spin" size={18} />
                    <span>Submitting Application...</span>
                  </span>
                ) : !whatsappJoined ? (
                  "You must join the WhatsApp Group before submitting"
                ) : priorities.length === 0 ? (
                  "Please select your preferred roles"
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
