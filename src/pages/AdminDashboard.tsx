import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "ড্যাশবোর্ড", key: "dashboard" },
  { icon: BookOpen, label: "কোর্সসমূহ", key: "courses" },
  { icon: Video, label: "লেকচার", key: "lectures" },
  { icon: Users, label: "ব্যবহারকারী", key: "users" },
  { icon: Settings, label: "সেটিংস", key: "settings" },
];

const MOCK_USERS = [
  { id: 1, name: "আবদুল্লাহ", email: "abdullah@example.com", progress: 40 },
  { id: 2, name: "ফাতিমা", email: "fatima@example.com", progress: 75 },
  { id: 3, name: "ইউসুফ", email: "yusuf@example.com", progress: 20 },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50">
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

const DashboardTab = () => {
  const stats = [
    { label: "মোট কোর্স", value: "১", icon: BookOpen },
    { label: "মোট লেকচার", value: "২৭", icon: Video },
    { label: "মোট ব্যবহারকারী", value: "৩", icon: Users },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-6 shadow-elegant"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
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

const CoursesTab = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground">কোর্স ম্যানেজমেন্ট</h2>
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        নতুন কোর্স
      </Button>
    </div>
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">কোর্স</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">লেকচার</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">স্ট্যাটাস</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            <td className="px-4 py-3 text-sm font-medium text-foreground">সহজ সূত্রে কুরআন শিখি</td>
            <td className="px-4 py-3 text-sm text-muted-foreground">২৭</td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Eye className="h-3 w-3" /> প্রকাশিত
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="rounded-md p-1.5 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </motion.div>
);

const LecturesTab = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground">লেকচার ম্যানেজমেন্ট</h2>
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        নতুন লেকচার
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
          {Array.from({ length: 5 }, (_, i) => (
            <tr key={i} className="border-b border-border/50">
              <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3 text-sm font-medium text-foreground">লেকচার {i + 1}</td>
              <td className="px-4 py-3">
                {i < 3 ? (
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
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="rounded-md p-1.5 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const UsersTab = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h2 className="mb-4 text-lg font-bold text-foreground">ব্যবহারকারী তালিকা</h2>
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">নাম</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ইমেইল</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">অগ্রগতি</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_USERS.map((user) => (
            <tr key={user.id} className="border-b border-border/50">
              <td className="px-4 py-3 text-sm font-medium text-foreground">{user.name}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{user.progress}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default AdminDashboard;
