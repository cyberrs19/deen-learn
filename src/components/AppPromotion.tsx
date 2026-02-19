import { motion } from "framer-motion";
import { ExternalLink, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import quranlyLogo from "@/assets/quranly-logo.webp";

const AppPromotion = () => {
  return (
    <section className="bg-card py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Smartphone className="h-4 w-4 text-accent" />
            প্রস্তাবিত অ্যাপ
          </div>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            প্রস্তাবিত কুরআন অ্যাপ
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            কুরআন তিলাওয়াত, অনুবাদ ও তাফসীর সহ একটি সম্পূর্ণ কুরআন অ্যাপ। এখনই ডাউনলোড করুন এবং প্রতিদিন কুরআন পড়ুন।
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-8 shadow-elegant max-w-lg w-full text-center">
            <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-2xl shadow-md">
              <img src={quranlyLogo} alt="Quranly App" className="h-full w-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Quranly App</h3>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              কুরআন পড়ুন, শুনুন এবং বুঝুন। বাংলা অনুবাদ ও তাফসীর সহ।
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
              asChild
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.quranly.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Download on Play Store
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export default AppPromotion;
