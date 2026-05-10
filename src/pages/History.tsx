import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Trash2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const History = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data } = await supabase.from("submissions").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
      setSubmissions(data ?? []);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setSubmissions(s => s.filter(x => x.id !== id));
    toast.success("Deleted");
  };

  const filtered = submissions.filter(s => s.topic.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-28 pb-20">
        <div className="mb-10">
          <h1 className="font-display text-5xl font-semibold mb-2">
            <span className="text-gradient">Submission </span>
            <span className="text-luxury italic">history</span>
          </h1>
          <p className="text-muted-foreground">All your past evaluations in one place.</p>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search by topic..." className="pl-10 h-12 bg-card border-border" />
        </div>

        {loading ? (
          <div className="text-muted-foreground text-center py-20">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="glass-strong rounded-2xl p-16 text-center">
            <p className="text-muted-foreground mb-6">No submissions yet.</p>
            <Button asChild className="bg-gradient-luxury text-primary-foreground"><Link to="/evaluate">Submit your first</Link></Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(s => (
              <div key={s.id} className="glass rounded-xl p-5 flex flex-wrap items-center gap-4 hover:border-primary/40 transition-all">
                <div className="flex-1 min-w-[200px]">
                  <Link to={`/results/${s.id}`} className="font-display text-xl font-semibold hover:text-gold transition-colors">{s.topic}</Link>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(s.created_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gradient-luxury text-midnight font-bold">Grade {s.grade}</span>
                  <span className="font-display text-3xl font-bold text-gradient">{s.overall_score}<span className="text-xs text-muted-foreground">/90</span></span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" asChild><Link to={`/results/${s.id}`}><Eye className="h-4 w-4" /></Link></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(s.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default History;
