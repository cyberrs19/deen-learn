import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  PlayCircle,
  Lock,
  CheckCircle2,
  FileText,
  ChevronLeft,
  User,
  Clock,
} from "lucide-react";

const MOCK_LECTURES = Array.from({ length: 27 }, (_, i) => ({
  id: i + 1,
  title: `লেকচার ${i + 1}`,
  duration: "25:00",
  isPublic: i < 5,
  isCompleted: false,
  orderNo: i + 1,
}));

const CourseDetail = () => {
  const { slug } = useParams();
  const [selectedLecture, setSelectedLecture] = useState<number | null>(null);

  const course = {
    title: "সহজ সূত্রে কুরআন শিখি",
    description:
      "কুরআন সহজভাবে শিখুন আস-সুন্নাহ ফাউন্ডেশনের এই কোর্সে। ২৭টি ভিডিও লেকচার এবং পিডিএফ নোটসের মাধ্যমে কুরআনের মূল বিষয়গুলো জানুন।",
    instructor: "আস-সুন্নাহ ফাউন্ডেশন",
    lectureCount: 27,
  };

  const activeLecture = selectedLecture
    ? MOCK_LECTURES.find((l) => l.id === selectedLecture)
    : null;

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
                {activeLecture && activeLecture.isPublic ? (
                  <div className="aspect-video bg-foreground/5 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <PlayCircle className="mx-auto mb-2 h-16 w-16" />
                      <p className="text-lg font-medium">{activeLecture.title}</p>
                      <p className="text-sm">ভিডিও প্লেয়ার (YouTube Embed)</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-hero flex items-center justify-center">
                    <div className="text-center text-primary-foreground">
                      <PlayCircle className="mx-auto mb-3 h-16 w-16 opacity-60" />
                      <p className="text-xl font-bold">{course.title}</p>
                      <p className="mt-2 text-sm opacity-70">
                        একটি লেকচার নির্বাচন করুন
                      </p>
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
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {course.instructor}
                  </span>
                  <span className="flex items-center gap-1">
                    <PlayCircle className="h-4 w-4" />
                    {course.lectureCount} টি লেকচার
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                {/* PDF Notes placeholder */}
                {activeLecture && (
                  <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      পিডিএফ নোটস
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      এই লেকচারের নোটস শীঘ্রই যোগ করা হবে।
                    </p>
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
                  {MOCK_LECTURES.map((lecture) => (
                    <button
                      key={lecture.id}
                      onClick={() =>
                        lecture.isPublic && setSelectedLecture(lecture.id)
                      }
                      disabled={!lecture.isPublic}
                      className={`flex w-full items-center gap-3 border-b border-border/50 p-3 text-left transition-colors last:border-0 ${
                        selectedLecture === lecture.id
                          ? "bg-primary/10"
                          : lecture.isPublic
                          ? "hover:bg-muted/50"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                        {lecture.isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : !lecture.isPublic ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          lecture.orderNo
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {lecture.title}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lecture.duration}
                        </p>
                      </div>
                    </button>
                  ))}
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
