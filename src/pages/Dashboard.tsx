import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Award, Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Counter } from "@/components/Counter";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { CRITERIA, type CriterionKey } from "@/lib/criteria";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
      const [{ data: prof }, { data: subs }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle(),
        supabase.from("submissions").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(prof);
      setSubmissions(subs ?? []);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const total = submissions.length;
  const avg = total ? Math.round(submissions.reduce((s, x) => s + (x.overall_score ?? 0), 0) / total) : 0;
  const best = total ? Math.max(...submissions.map(s => s.overall_score ?? 0)) : 0;
  const improvement = total >= 2
    ? Math.round(((submissions[0].overall_score ?? 0) - (submissions[submissions.length - 1].overall_score ?? 0)))
    : 0;

  const chartData = [...submissions].reverse().slice(-10).map((s, i) => ({
    name: `#${i + 1}`,
    score: s.overall_score ?? 0,
  }));

  // Weak areas
  const criterionAvg: Record<CriterionKey, { sum: number; count: number }> = {} as any;
  CRITERIA.forEach(c => criterionAvg[c.key] = { sum: 0, count: 0 });
  submissions.forEach(s => {
    if (s.result_json?.criteria) {
      CRITERIA.forEach(c => {
        const v = s.result_json.criteria[c.key]?.score;
        if (typeof v === "number") {
          criterionAvg[c.key].sum += v;
          criterionAvg[c.key].count += 1;
        }
      });
    }
  });
  const weakAreas = CRITERIA
    .map(c => ({ ...c, avg: criterionAvg[c.key].count ? criterionAvg[c.key].sum / criterionAvg[c.key].count : 0, count: criterionAvg[c.key].count }))
    .filter(c => c.count > 0)
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 3);

  if (loading) return <div className="min-h-screen bg-background"><Navbar /><div className="container pt-32 text-center text-muted-foreground">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-28 pb-20">
        {/* Welcome */}
        <div className="glass-strong rounded-3xl p-8 mb-8 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold">Dashboard</span>
            <h1 className="font-display text-5xl font-semibold mt-2">
              <span className="text-gradient">Welcome, </span>
              <span className="text-luxury italic">{profile?.name || "Writer"}</span>
            </h1>
            <p className="text-muted-foreground mt-2">Track your progress, identify weak areas, and keep refining.</p>
          </div>
          <div className="flex md:justify-end">
            <Button asChild size="lg" className="bg-gradient-luxury text-primary-foreground font-semibold rounded-full h-14 px-8">
              <Link to="/evaluate"><Plus className="h-5 w-5 mr-2" /> New Paragraph</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Sparkles, label: "Submissions", value: total, suffix: "" },
            { icon: TrendingUp, label: "Average Score", value: avg, suffix: "/90" },
            { icon: Award, label: "Best Score", value: best, suffix: "/90" },
            { icon: Target, label: "Improvement", value: improvement, suffix: " pts" },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5 hover:border-primary/40 transition-all">
              <s.icon className="h-5 w-5 text-gold mb-3" />
              <div className="font-display text-4xl font-bold text-gradient">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 glass-strong rounded-2xl p-6">
            <h3 className="font-display text-2xl mb-4">Progress Over Time</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 90]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="score" stroke="url(#lineGrad)" strokeWidth={3} dot={{ fill: "hsl(var(--accent))", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                Submit your first paragraph to see your progress.
              </div>
            )}
          </div>

          {/* Weak areas */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-display text-2xl mb-4">Focus Areas</h3>
            {weakAreas.length > 0 ? (
              <ul className="space-y-3">
                {weakAreas.map(w => {
                  const Icon = w.icon;
                  return (
                    <li key={w.key} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                      <Icon className="h-5 w-5 text-gold" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{w.label}</div>
                        <div className="text-xs text-muted-foreground">Avg {w.avg.toFixed(1)}/10</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Submit a few paragraphs to discover your focus areas.</p>
            )}
          </div>
        </div>

        {/* Recent submissions */}
        <div className="mt-8 glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-2xl">Recent Submissions</h3>
            <Button variant="ghost" size="sm" asChild><Link to="/history">View all →</Link></Button>
          </div>
          {submissions.length > 0 ? (
            <div className="divide-y divide-border/50">
              {submissions.slice(0, 5).map(s => (
                <Link key={s.id} to={`/results/${s.id}`} className="flex items-center justify-between py-3 hover:bg-secondary/30 px-3 -mx-3 rounded-lg transition-colors">
                  <div>
                    <div className="font-semibold">{s.topic}</div>
                    <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-luxury text-midnight font-bold">{s.grade}</span>
                    <span className="font-display text-2xl font-bold text-gradient">{s.overall_score}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
