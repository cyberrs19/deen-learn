import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { GraduationCap } from "lucide-react";
import quranShikhiThumbnail from "@/assets/quran-shikhi-thumbnail.jpg";

const COURSES = [
  {
    title: "সহজ সূত্রে কুরআন শিখি",
    description: "কুরআন সহজভাবে শিখুন আস-সুন্নাহ ফাউন্ডেশনের এই কোর্সে। ২৭টি লেকচারে কুরআনের মূল বিষয়গুলো জানুন।",
    instructor: "আস-সুন্নাহ ফাউন্ডেশন",
    lectureCount: 27,
    slug: "quran-shikhi",
    thumbnail: quranShikhiThumbnail,
  },
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <GraduationCap className="h-4 w-4" />
              সকল কোর্স
            </div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">কোর্সসমূহ</h1>
            <p className="mt-4 text-muted-foreground">দ্বীনের জ্ঞান অর্জন করুন গোছানো কোর্সের মাধ্যমে</p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-2">
            {COURSES.map((course) => (
              <CourseCard key={course.slug} {...course} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
