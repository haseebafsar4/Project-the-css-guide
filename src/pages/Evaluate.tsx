import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, Loader2, FileText, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mammoth from "mammoth";

const TIPS = [
  "Open with a clear topic sentence that announces your central claim.",
  "Vary sentence length — mix short, punchy lines with longer, complex ones.",
  "Replace generic verbs ('do', 'make') with precise, vivid alternatives.",
  "Use one transition per shift in idea: however, moreover, consequently.",
  "End with a sentence that synthesizes — don't just summarize.",
];

const Evaluate = () => {
  const [topic, setTopic] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const wordCount = paragraph.trim() ? paragraph.trim().split(/\s+/).length : 0;
  const canSubmit = topic.trim().length > 0 && wordCount >= 50 && !loading;

  const handleFile = async (file: File) => {
    setFilename(file.name);
    try {
      if (file.name.endsWith(".txt")) {
        setParagraph(await file.text());
      } else if (file.name.endsWith(".docx")) {
        const buf = await file.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
        setParagraph(value);
      } else {
        toast.error("Only .txt and .docx files are supported");
      }
    } catch {
      toast.error("Could not read file");
    }
  };

  const submit = async () => {
    if (!user) {
      toast.error("Please sign in to evaluate");
      navigate("/auth");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-paragraph", {
        body: { topic, paragraph },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const { data: ins, error: insErr } = await supabase.from("submissions").insert({
        user_id: user.id,
        topic,
        paragraph_text: paragraph,
        result_json: data.result,
        overall_score: data.result.overallScore,
        grade: data.result.grade,
      }).select("id").single();
      if (insErr) throw insErr;

      toast.success("Evaluation complete");
      navigate(`/results/${ins.id}`);
    } catch (e: any) {
      toast.error(e.message || "Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold text-gold tracking-widest uppercase mb-4">
              Evaluation Engine
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold">
              <span className="text-gradient">Submit your </span>
              <span className="text-luxury italic">paragraph</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 glass-strong rounded-2xl p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm uppercase tracking-widest text-gold">Topic</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Climate Change and its Effects"
                  className="h-14 text-lg bg-background/50 border-border"
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="para" className="text-sm uppercase tracking-widest text-gold">Paragraph</Label>
                  <span className={`text-xs ${wordCount >= 50 ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {wordCount} words {wordCount < 50 && `(min 50)`}
                  </span>
                </div>
                <Textarea
                  id="para"
                  value={paragraph}
                  onChange={(e) => setParagraph(e.target.value)}
                  placeholder="Start writing your paragraph..."
                  className="min-h-[260px] bg-background/50 border-border text-base leading-relaxed resize-y"
                  maxLength={5000}
                />
              </div>

              {/* Upload */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFile(f);
                }}
                className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-gold/50 transition-all"
              >
                <Upload className="h-6 w-6 mx-auto mb-2 text-gold" />
                <p className="text-sm text-muted-foreground">
                  {filename ? <span className="text-foreground">{filename}</span> : "Drop a .txt or .docx file, or click to upload"}
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt,.docx"
                  hidden
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>

              <Button
                onClick={submit}
                disabled={!canSubmit}
                className="w-full h-16 text-base bg-gradient-luxury text-primary-foreground font-semibold rounded-xl glow-primary disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI is analyzing your paragraph...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" /> Evaluate My Writing
                  </>
                )}
              </Button>
            </div>

            {/* Tips Sidebar */}
            <aside className="space-y-6">
              <div className="glass-strong rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-gold" />
                  <h3 className="font-display text-xl font-semibold">Writing Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {TIPS.map((t, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-gold font-bold">{i + 1}.</span>
                      <span className="leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-gold" />
                  <h4 className="text-sm font-semibold tracking-widest uppercase text-gold">Scoring</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each paragraph is graded out of <span className="text-foreground font-semibold">90</span> across <span className="text-foreground font-semibold">9 criteria</span>: 10 points each.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Evaluate;
