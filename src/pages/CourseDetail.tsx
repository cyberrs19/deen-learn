import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import {
  PlayCircle,
  Lock,
  CheckCircle2,
  FileText,
  ChevronLeft,
  User,
  Clock,
  BookOpen,
} from "lucide-react";

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [lectures, setLectures] = useState<any[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Fetch course by slug
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (courseData) {
        setCourse(courseData);
        // Fetch lectures for this course
        const { data: lectureData } = await supabase
          .from('lectures')
          .select('*')
          .eq('course_id', courseData.id)
          .order('sort_order');
        setLectures(lectureData || []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const activeLecture = selectedLecture
    ? lectures.find((l) => l.id === selectedLecture)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center py-32">
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex flex-col items-center justify-center py-32">
          <p className="text-muted-foreground mb-4">কোর্স পাওয়া যায়নি</p>
          <Button asChild><Link to="/courses">সকল কোর্স</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container">
          <Link
            to="/courses"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            সকল কোর্স
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 overflow-hidden rounded-xl border border-border bg-card"
              >
                {activeLecture && activeLecture.is_public && activeLecture.youtube_url ? (
                  <div className="aspect-video">
                    <iframe
                      src={activeLecture.youtube_url}
                      title={activeLecture.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : activeLecture && activeLecture.is_public ? (
                  <div className="aspect-video bg-foreground/5 relative">
                    {activeLecture.thumbnail_url ? (
                      <img src={activeLecture.thumbnail_url} alt={activeLecture.title} className="h-full w-full object-cover" />
                    ) : null}
                    <div className={`absolute inset-0 flex items-center justify-center ${activeLecture.thumbnail_url ? 'bg-foreground/30' : ''}`}>
                      <div className="text-center text-primary-foreground">
                        <PlayCircle className="mx-auto mb-2 h-16 w-16" />
                        <p className="text-lg font-medium">{activeLecture.title}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video relative">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10">
                        <BookOpen className="h-16 w-16 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                      <div className="text-center text-primary-foreground">
                        <PlayCircle className="mx-auto mb-3 h-16 w-16 opacity-80" />
                        <p className="text-xl font-bold">{course.title}</p>
                        <p className="mt-2 text-sm opacity-70">
                          একটি লেকচার নির্বাচন করুন
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Course Info */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h1 className="mb-3 text-2xl font-bold text-foreground">
                  {course.title}
                </h1>
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {course.instructor && (
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {course.instructor}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <PlayCircle className="h-4 w-4" />
                    {lectures.length} টি লেকচার
                  </span>
                </div>
                {course.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                )}

                {/* PDF Notes */}
                {activeLecture?.pdf_url && (
                  <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      পিডিএফ নোটস
                    </h3>
                    <a
                      href={activeLecture.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline hover:text-primary/80"
                    >
                      নোটস ডাউনলোড করুন
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Lecture List */}
            <div>
              <div className="sticky top-20 rounded-xl border border-border bg-card">
                <div className="border-b border-border p-4">
                  <h2 className="font-bold text-foreground">লেকচার তালিকা</h2>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>অগ্রগতি</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  {lectures.map((lecture, i) => (
                    <button
                      key={lecture.id}
                      onClick={() =>
                        lecture.is_public && setSelectedLecture(lecture.id)
                      }
                      disabled={!lecture.is_public}
                      className={`flex w-full items-center gap-3 border-b border-border/50 p-3 text-left transition-colors last:border-0 ${
                        selectedLecture === lecture.id
                          ? "bg-primary/10"
                          : lecture.is_public
                          ? "hover:bg-muted/50"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                        {!lecture.is_public ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {lecture.title}
                        </p>
                      </div>
                    </button>
                  ))}
                  {lectures.length === 0 && (
                    <p className="p-4 text-center text-sm text-muted-foreground">কোনো লেকচার নেই</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
