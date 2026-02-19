import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero opacity-85" />
        <div className="absolute inset-0 bg-pattern-islamic" />
      </div>

      <div className="container relative z-10 flex min-h-[85vh] flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/90">
            <BookOpen className="h-4 w-4" />
            ইসলামিক শিক্ষা প্ল্যাটফর্ম
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
            দ্বীন শিখুন{" "}
            <span className="text-gradient-gold">সহজ সূত্রে</span>
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-primary-foreground/80 md:text-xl">
            কুরআন, হাদিস, আকীদাহ ও ফিকহ — সব কিছু শিখুন গোছানো ভিডিও কোর্স ও নোটসের মাধ্যমে।
            আপনার শেখার অগ্রগতি ট্র্যাক করুন।
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold text-base px-8"
              asChild
            >
              <Link to="/courses">
                <Play className="mr-2 h-5 w-5" />
                কোর্স শুরু করুন
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm text-base px-8"
              asChild
            >
              <Link to="/register">ফ্রি রেজিস্টার করুন</Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-8 md:gap-16"
        >
          {[
            { value: "২৭", label: "লেকচার" },
            { value: "১", label: "কোর্স" },
            { value: "ফ্রি", label: "সম্পূর্ণ বিনামূল্যে" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary-foreground md:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
