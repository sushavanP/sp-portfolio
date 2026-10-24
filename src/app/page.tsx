import About from "@/components/About";
import Closing from "@/components/Closing";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Motion from "@/components/Motion";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Experience />
      </main>
      <Closing />
      <Motion />
    </>
  );
}
