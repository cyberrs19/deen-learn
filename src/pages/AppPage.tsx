import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppPromotion from "@/components/AppPromotion";

const AppPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <AppPromotion />
      </main>
      <Footer />
    </div>
  );
};

export default AppPage;
