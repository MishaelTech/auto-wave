import ApplyToBeAMechanic from "@/components/ApplyToBeAMechanic";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      {/* <AboutUs /> */}

      <div className="bg-blue-50">
        <ApplyToBeAMechanic />
      </div>
    </main>

  );
}
