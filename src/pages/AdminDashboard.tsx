import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, BookOpen, Users, Video, Settings, LogOut,
  Plus, Eye, EyeOff, Edit, Trash2, Menu, X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import EditCourseDialog from "@/components/admin/EditCourseDialog";
import EditLectureDialog from "@/components/admin/EditLectureDialog";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "ড্যাশবোর্ড", key: "dashboard" },
  { icon: BookOpen, label: "কোর্সসমূহ", key: "courses" },
  { icon: Video, label: "লেকচার", key: "lectures" },
  { icon: Users, label: "ব্যবহারকারী", key: "users" },
  { icon: Settings, label: "সেটিংস", key: "settings" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <BookOpen className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">Admin</span>
          <button className="ml-auto lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-sidebar-border p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50">
            <LogOut className="h-4 w-4" />
            লগ আউট
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            {SIDEBAR_ITEMS.find((i) => i.key === activeTab)?.label}
          </h1>
        </header>

        <main className="p-6">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "courses" && <CoursesTab />}
          {activeTab === "lectures" && <LecturesTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "settings" && <p className="text-muted-foreground">সেটিংস পেজ শীঘ্রই আসছে।</p>}
        </main>
      </div>
    </div>
  );
};

/* ─── Dashboard ─── */
const DashboardTab = () => {
  const [stats, setStats] = useState({ courses: 0, lectures: 0, users: 0 });

  useEffect(() => {
    const load = async () => {
      const [c, l, u] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('lectures').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }),
      ]);
      setStats({ courses: c.count ?? 0, lectures: l.count ?? 0, users: u.count ?? 0 });
    };
    load();
  }, []);

  const cards = [
    { label: "মোট কোর্স", value: stats.courses, icon: BookOpen },
    { label: "মোট লেকচার", value: stats.lectures, icon: Video },
    { label: "মোট ব্যবহারকারী", value: stats.users, icon: Users },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Courses ─── */
const CoursesTab = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [editCourse, setEditCourse] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at');
    setCourses(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('কোর্সটি মুছে ফেলতে চান?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) toast({ title: 'ডিলিট ব্যর্থ', variant: 'destructive' });
    else load();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">কোর্স ম্যানেজমেন্ট</h2>
        <Button size="sm" onClick={() => { setEditCourse(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> নতুন কোর্স
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">কোর্স</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">স্ট্যাটাস</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-border/50">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{c.title}</td>
                <td className="px-4 py-3">
                  {c.is_published ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <Eye className="h-3 w-3" /> প্রকাশিত
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      <EyeOff className="h-3 w-3" /> ড্রাফট
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" onClick={() => { setEditCourse(c); setDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">কোনো কোর্স নেই</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <EditCourseDialog course={editCourse} open={dialogOpen} onOpenChange={setDialogOpen} onSaved={load} />
    </motion.div>
  );
};

/* ─── Lectures ─── */
const LecturesTab = () => {
  const [lectures, setLectures] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [editLecture, setEditLecture] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    const [l, c] = await Promise.all([
      supabase.from('lectures').select('*').order('sort_order'),
      supabase.from('courses').select('id, title'),
    ]);
    setLectures(l.data || []);
    setCourses(c.data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('লেকচারটি মুছে ফেলতে চান?')) return;
    const { error } = await supabase.from('lectures').delete().eq('id', id);
    if (error) toast({ title: 'ডিলিট ব্যর্থ', variant: 'destructive' });
    else load();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">লেকচার ম্যানেজমেন্ট</h2>
        <Button size="sm" onClick={() => { setEditLecture(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> নতুন লেকচার
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">শিরোনাম</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">দৃশ্যমানতা</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((l, i) => (
              <tr key={l.id} className="border-b border-border/50">
                <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{l.title}</td>
                <td className="px-4 py-3">
                  {l.is_public ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <Eye className="h-3 w-3" /> পাবলিক
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      <EyeOff className="h-3 w-3" /> প্রাইভেট
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" onClick={() => { setEditLecture(l); setDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(l.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {lectures.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">কোনো লেকচার নেই</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <EditLectureDialog lecture={editLecture} courses={courses} open={dialogOpen} onOpenChange={setDialogOpen} onSaved={load} />
    </motion.div>
  );
};

/* ─── Users ─── */
const UsersTab = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('user_roles').select('*');
      setUsers(data || []);
    };
    load();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="mb-4 text-lg font-bold text-foreground">ব্যবহারকারী তালিকা</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">রোল</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/50">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{u.user_id}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{u.role}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">কোনো ব্যবহারকারী নেই</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
