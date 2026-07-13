import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyJoin from "@/components/WhyJoin";
import Process from "@/components/Process";
import Roles from "@/components/Roles";
import ApplicationForm from "@/components/ApplicationForm";
import Coordinators from "@/components/Coordinators";

export default function Home() {
  return (
    <>
      {/* Landing Hero Section */}
      <Hero />

      {/* About Us & Activities Grid */}
      <About />

      {/* Perks Grid */}
      <WhyJoin />

      {/* Recruitment Stages Timeline */}
      <Process />

      {/* Role Descriptions */}
      <Roles />

      {/* Application Registration Form */}
      <ApplicationForm />

      {/* Faculty and Student contact representatives */}
      <Coordinators />
    </>
  );
}
