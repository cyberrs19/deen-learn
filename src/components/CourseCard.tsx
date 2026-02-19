import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, PlayCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  title: string;
  description: string;
  instructor: string;
  lectureCount: number;
  slug: string;
  thumbnail?: string;
}

const CourseCard = ({ title, description, instructor, lectureCount, slug, thumbnail }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-elegant transition-all hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-primary/10">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-hero">
            <BookOpen className="h-12 w-12 text-primary-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          <PlayCircle className="h-3.5 w-3.5" />
          {lectureCount} টি লেকচার
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-bold text-foreground leading-snug">{title}</h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          {instructor}
        </div>
        <Button className="w-full" asChild>
          <Link to={`/course/${slug}`}>কোর্স দেখুন</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
