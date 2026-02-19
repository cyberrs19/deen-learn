import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import { GraduationCap } from "lucide-react";
import quranShikhiThumbnail from "@/assets/quran-shikhi-thumbnail.jpg";

const MOCK_COURSES = [
  {
    title: "সহজ সূত্রে কুরআন শিখি",
    description: "কুরআন সহজভাবে শিখুন আস-সুন্নাহ ফাউন্ডেশনের এই কোর্সে। ২৭টি লেকচারে কুরআনের মূল বিষয়গুলো জানুন।",
    instructor: "আস-সুন্নাহ ফাউন্ডেশন",
    lectureCount: 27,
    slug: "quran-shikhi",
    thumbnail: quranShikhiThumbnail,
  },
];

const FeaturedCourses = () => {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <GraduationCap className="h-4 w-4" />
            কোর্সসমূহ
          </div>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            আমাদের কোর্সসমূহ
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            দ্বীনের জ্ঞান অর্জন করুন গোছানো কোর্সের মাধ্যমে
          </p>
        </motion.div>

        <div className="mx-auto max-w-md">
          {MOCK_COURSES.map((course) => (
            <CourseCard key={course.slug} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
