import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Muslims<span className="text-gradient-gold">Deen</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              দ্বীন শিখুন সহজ ও সুন্দরভাবে। কুরআন, হাদিস, আকীদাহ ও ফিকহ শিখুন ধাপে ধাপে।
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">লিংক</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">কোর্সসমূহ</Link>
              <Link to="/app" className="text-sm text-muted-foreground hover:text-primary transition-colors">কুরআন অ্যাপ</Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">লগইন</Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">যোগাযোগ</h4>
            <p className="text-sm text-muted-foreground">
              MuslimsDeen একটি ইসলামিক শিক্ষা প্ল্যাটফর্ম।
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MuslimsDeen. সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
