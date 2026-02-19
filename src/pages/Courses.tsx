import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at');
      setCourses(data || []);
      setLoading(false);
    };
    load();
  }, []);

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

          {loading ? (
            <p className="text-center text-muted-foreground">লোড হচ্ছে...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-muted-foreground">কোনো কোর্স পাওয়া যায়নি</p>
          ) : (
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-2">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description || ''}
                  instructor={course.instructor || ''}
                  lectureCount={0}
                  slug={course.slug}
                  thumbnail={course.thumbnail_url}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
