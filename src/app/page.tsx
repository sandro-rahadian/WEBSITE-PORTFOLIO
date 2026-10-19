import FloatingNav from "@/components/FloatingNav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import LightZone from "@/components/sections/LightZone";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <FloatingNav />
      <main>
        <Hero />
        <About />
        <Work />
        <LightZone />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
