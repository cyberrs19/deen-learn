import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  Settings,
  LogOut,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Menu,
  X,
  Save,
  Link as LinkIcon,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "ড্যাশবোর্ড", key: "dashboard" },
  { icon: BookOpen, label: "কোর্সসমূহ", key: "courses" },
  { icon: Video, label: "লেকচার", key: "lectures" },
  { icon: Users, label: "ব্যবহারকারী", key: "users" },
  { icon: Settings, label: "সেটিংস", key: "settings" },
];

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  instructor: string;
  is_published: boolean;
}

interface Lecture {
  id: string;
  course_id: string;
  title: string;
  order_no: number;
  video_url: string;
  duration: string;
  is_public: boolean;
}

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
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
          <button
            className="ml-auto lg:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setSidebarOpen(false);
              }}
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
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-4 w-4" />
            লগ আউট
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
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
          {activeTab === "settings" && (
            <p className="text-muted-foreground">সেটিংস পেজ শীঘ্রই আসছে।</p>
          )}
        </main>
      </div>
    </div>
  );
};

/* ─── Dashboard ─── */
const DashboardTab = () => {
  const [stats, setStats] = useState({ courses: 0, lectures: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [coursesRes, lecturesRes, usersRes] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("lectures").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        courses: coursesRes.count ?? 0,
        lectures: lecturesRes.count ?? 0,
        users: usersRes.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const statItems = [
    { label: "মোট কোর্স", value: stats.courses, icon: BookOpen },
    { label: "মোট লেকচার", value: stats.lectures, icon: Video },
    { label: "মোট ব্যবহারকারী", value: stats.users, icon: Users },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid gap-4 md:grid-cols-3">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-6 shadow-elegant"
          >
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: "", description: "", thumbnail_url: "", instructor: "" });

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (data) setCourses(data);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("কোর্সের নাম দিন"); return; }
    
    if (editingCourse) {
      const { error } = await supabase.from("courses").update(form).eq("id", editingCourse.id);
      if (error) { toast.error("আপডেট ব্যর্থ: " + error.message); return; }
      toast.success("কোর্স আপডেট হয়েছে");
    } else {
      const { error } = await supabase.from("courses").insert({ ...form, is_published: true });
      if (error) { toast.error("কোর্স তৈরি ব্যর্থ: " + error.message); return; }
      toast.success("কোর্স তৈরি হয়েছে");
    }
    
    setForm({ title: "", description: "", thumbnail_url: "", instructor: "" });
    setShowForm(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setForm({ title: course.title, description: course.description, thumbnail_url: course.thumbnail_url || "", instructor: course.instructor || "" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই কোর্সটি মুছে ফেলতে চান?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) { toast.error("মুছে ফেলা ব্যর্থ"); return; }
    toast.success("কোর্স মুছে ফেলা হয়েছে");
    fetchCourses();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">কোর্স ম্যানেজমেন্ট</h2>
        <Button size="sm" onClick={() => { setShowForm(!showForm); setEditingCourse(null); setForm({ title: "", description: "", thumbnail_url: "", instructor: "" }); }}>
          <Plus className="mr-2 h-4 w-4" />
          নতুন কোর্স
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-foreground">{editingCourse ? "কোর্স এডিট করুন" : "নতুন কোর্স যোগ করুন"}</h3>
          <Input placeholder="কোর্সের নাম" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="কোর্সের বর্ণনা" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="ইনস্ট্রাক্টর নাম" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
          <Input placeholder="থাম্বনেইল URL" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} />
          <div className="flex gap-2">
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />{editingCourse ? "আপডেট" : "সেভ"}</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditingCourse(null); }}>বাতিল</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">কোর্স</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ইনস্ট্রাক্টর</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">স্ট্যাটাস</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">কোনো কোর্স নেই</td></tr>
            ) : courses.map((course) => (
              <tr key={course.id} className="border-b border-border/50">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{course.title}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{course.instructor || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${course.is_published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {course.is_published ? <><Eye className="h-3 w-3" /> প্রকাশিত</> : <><EyeOff className="h-3 w-3" /> ড্রাফট</>}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(course)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(course.id)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

/* ─── Lectures ─── */
const LecturesTab = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [form, setForm] = useState({ course_id: "", title: "", video_url: "", duration: "", order_no: 1, is_public: true });

  const fetchData = async () => {
    const [lecturesRes, coursesRes] = await Promise.all([
      supabase.from("lectures").select("*").order("order_no"),
      supabase.from("courses").select("*"),
    ]);
    if (lecturesRes.data) setLectures(lecturesRes.data);
    if (coursesRes.data) setCourses(coursesRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const extractEmbedUrl = (url: string): string => {
    // Support: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    // If already an embed URL or other URL, return as-is
    return url;
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("লেকচারের নাম দিন"); return; }
    if (!form.course_id) { toast.error("কোর্স নির্বাচন করুন"); return; }
    if (!form.video_url.trim()) { toast.error("ভিডিও URL দিন"); return; }

    const embedUrl = extractEmbedUrl(form.video_url);
    const payload = { ...form, video_url: embedUrl };

    if (editingLecture) {
      const { error } = await supabase.from("lectures").update(payload).eq("id", editingLecture.id);
      if (error) { toast.error("আপডেট ব্যর্থ: " + error.message); return; }
      toast.success("লেকচার আপডেট হয়েছে");
    } else {
      const { error } = await supabase.from("lectures").insert(payload);
      if (error) { toast.error("লেকচার তৈরি ব্যর্থ: " + error.message); return; }
      toast.success("লেকচার তৈরি হয়েছে");
    }

    setForm({ course_id: "", title: "", video_url: "", duration: "", order_no: 1, is_public: true });
    setShowForm(false);
    setEditingLecture(null);
    fetchData();
  };

  const handleEdit = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setForm({
      course_id: lecture.course_id,
      title: lecture.title,
      video_url: lecture.video_url || "",
      duration: lecture.duration || "",
      order_no: lecture.order_no,
      is_public: lecture.is_public,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই লেকচারটি মুছে ফেলতে চান?")) return;
    const { error } = await supabase.from("lectures").delete().eq("id", id);
    if (error) { toast.error("মুছে ফেলা ব্যর্থ"); return; }
    toast.success("লেকচার মুছে ফেলা হয়েছে");
    fetchData();
  };

  const toggleVisibility = async (lecture: Lecture) => {
    await supabase.from("lectures").update({ is_public: !lecture.is_public }).eq("id", lecture.id);
    fetchData();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">লেকচার ম্যানেজমেন্ট</h2>
        <Button size="sm" onClick={() => { setShowForm(!showForm); setEditingLecture(null); setForm({ course_id: courses[0]?.id || "", title: "", video_url: "", duration: "", order_no: lectures.length + 1, is_public: true }); }}>
          <Plus className="mr-2 h-4 w-4" />
          নতুন লেকচার
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-foreground">{editingLecture ? "লেকচার এডিট করুন" : "নতুন লেকচার যোগ করুন"}</h3>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">কোর্স নির্বাচন</label>
            <select
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">কোর্স নির্বাচন করুন</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <Input placeholder="লেকচারের নাম" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
              <LinkIcon className="h-4 w-4 text-primary" />
              YouTube ভিডিও URL / Embed URL
            </label>
            <Input
              placeholder="https://www.youtube.com/watch?v=xxxxx অথবা https://youtu.be/xxxxx"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              YouTube লিংক পেস্ট করুন — অটোমেটিক embed URL এ কনভার্ট হবে
            </p>
            {form.video_url && (
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <iframe
                  src={extractEmbedUrl(form.video_url)}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Preview"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="সময়কাল (যেমন: 25:00)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            <Input type="number" placeholder="ক্রম নং" value={form.order_no} onChange={(e) => setForm({ ...form, order_no: parseInt(e.target.value) || 1 })} />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="rounded" />
            পাবলিক (সবাই দেখতে পারবে)
          </label>

          <div className="flex gap-2">
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />{editingLecture ? "আপডেট" : "সেভ"}</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditingLecture(null); }}>বাতিল</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">শিরোনাম</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ভিডিও</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">দৃশ্যমানতা</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {lectures.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">কোনো লেকচার নেই</td></tr>
            ) : lectures.map((lecture) => (
              <tr key={lecture.id} className="border-b border-border/50">
                <td className="px-4 py-3 text-sm text-muted-foreground">{lecture.order_no}</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{lecture.title}</td>
                <td className="px-4 py-3 text-sm">
                  {lecture.video_url ? (
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      <LinkIcon className="h-3 w-3" /> এম্বেড আছে
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">নেই</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleVisibility(lecture)}>
                    {lecture.is_public ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <Eye className="h-3 w-3" /> পাবলিক
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        <EyeOff className="h-3 w-3" /> প্রাইভেট
                      </span>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(lecture)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(lecture.id)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

/* ─── Users ─── */
const UsersTab = () => {
  const [users, setUsers] = useState<{ id: string; full_name: string; email: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, email");
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="mb-4 text-lg font-bold text-foreground">ব্যবহারকারী তালিকা</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">নাম</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ইমেইল</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-sm text-muted-foreground">কোনো ব্যবহারকারী নেই</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="border-b border-border/50">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{user.full_name || "—"}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
