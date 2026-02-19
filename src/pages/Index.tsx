import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedCourses from "@/components/FeaturedCourses";
import AppPromotion from "@/components/AppPromotion";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedCourses />
        <AppPromotion />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
