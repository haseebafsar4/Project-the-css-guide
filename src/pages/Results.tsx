import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScoreRing } from "@/components/ScoreRing";
import { CRITERIA, scoreColor, scoreBg, type CriterionKey } from "@/lib/criteria";
import jsPDF from "jspdf";

type CriterionResult = { score: number; feedback: string; issues: string[]; suggestions: string[] };
type Highlight = { text: string; type: "grammar" | "spelling" | "vocabulary" | "good"; explanation: string };
type Result = {
  overallScore: number;
  grade: string;
  summary: string;
  criteria: Record<CriterionKey, CriterionResult>;
  highlights: Highlight[];
  improvedVersion: string;
};

const gradeColor = (g: string) => {
  if (g.startsWith("A")) return "from-emerald-500 to-teal-400";
  if (g === "B") return "from-blue-500 to-cyan-400";
  if (g === "C") return "from-amber-500 to-yellow-400";
  return "from-red-500 to-rose-400";
};

const highlightStyles: Record<Highlight["type"], string> = {
  grammar: "bg-red-500/30 border-b-2 border-red-500",
  spelling: "bg-blue-500/30 border-b-2 border-blue-500",
  vocabulary: "bg-amber-500/30 border-b-2 border-amber-500",
  good: "bg-emerald-500/25 border-b-2 border-emerald-500",
};

const renderAnnotated = (text: string, highlights: Highlight[]) => {
  if (!highlights?.length) return text;
  const sorted = [...highlights].sort((a, b) => b.text.length - a.text.length);
  const matches: { start: number; end: number; h: Highlight }[] = [];
  for (const h of sorted) {
    if (!h.text) continue;
    let from = 0;
    const lower = text.toLowerCase();
    const needle = h.text.toLowerCase();
    while (from < text.length) {
      const idx = lower.indexOf(needle, from);
      if (idx === -1) break;
      const overlaps = matches.some(m => !(idx + needle.length <= m.start || idx >= m.end));
      if (!overlaps) matches.push({ start: idx, end: idx + needle.length, h });
      from = idx + needle.length;
    }
  }
  matches.sort((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start > cursor) parts.push(text.slice(cursor, m.start));
    parts.push(
      <mark
        key={i}
        title={m.h.explanation}
        className={`${highlightStyles[m.h.type]} px-1 rounded text-foreground cursor-help`}
      >
        {text.slice(m.start, m.end)}
      </mark>
    );
    cursor = m.end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
};

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<any>(null);
  const [showImproved, setShowImproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from("submissions").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        toast.error("Submission not found");
        navigate("/dashboard");
        return;
      }
      setSubmission(data);
      setLoading(false);
    });
  }, [id, navigate]);

  const result: Result | null = submission?.result_json ?? null;

  const downloadPDF = () => {
    if (!submission || !result) return;
    const doc = new jsPDF();
    doc.setFontSize(20); doc.text("Lexora — Evaluation Report", 20, 20);
    doc.setFontSize(11); doc.text(`Topic: ${submission.topic}`, 20, 32);
    doc.text(`Date: ${new Date(submission.created_at).toLocaleDateString()}`, 20, 40);
    doc.setFontSize(16); doc.text(`Score: ${result.overallScore} / 90  Grade: ${result.grade}`, 20, 54);
    doc.setFontSize(11);
    const summary = doc.splitTextToSize(result.summary, 170);
    doc.text(summary, 20, 66);
    let y = 66 + summary.length * 6 + 8;
    doc.setFontSize(13); doc.text("Criterion Breakdown", 20, y); y += 8;
    doc.setFontSize(10);
    CRITERIA.forEach(c => {
      const r = result.criteria[c.key];
      doc.text(`${c.label}: ${r.score}/10 — ${r.feedback.slice(0, 90)}`, 20, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save(`lexora-${submission.id.slice(0, 8)}.pdf`);
  };

  if (loading || !result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 pb-20 text-center">
          <div className="animate-pulse text-muted-foreground">Loading evaluation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-28 pb-20">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-3">
              <Link to="/history"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
            </Button>
            <h1 className="font-display text-4xl md:text-5xl font-semibold">
              <span className="text-gradient">{submission.topic}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadPDF} className="glass">
              <Download className="h-4 w-4 mr-2" /> PDF Report
            </Button>
            <Button asChild className="bg-gradient-luxury text-primary-foreground">
              <Link to="/evaluate"><Sparkles className="h-4 w-4 mr-2" /> New Evaluation</Link>
            </Button>
          </div>
        </div>

        {/* Overall score */}
        <div className="glass-strong rounded-3xl p-10 mb-10 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-center gap-4">
            <ScoreRing value={result.overallScore} />
            <div className={`px-6 py-2 rounded-full bg-gradient-to-r ${gradeColor(result.grade)} text-midnight font-display text-2xl font-bold`}>
              Grade {result.grade}
            </div>
          </div>
          <div>
            <h3 className="font-display text-3xl mb-4 text-gold">AI Summary</h3>
            <p className="text-foreground/90 leading-relaxed text-lg">{result.summary}</p>
          </div>
        </div>

        {/* Breakdown grid */}
        <h2 className="font-display text-3xl mb-6">Score Breakdown</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {CRITERIA.map((c) => {
            const r = result.criteria[c.key];
            const Icon = c.icon;
            return (
              <div key={c.key} className="glass rounded-xl p-5 hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gold" />
                    <span className="font-semibold">{c.label}</span>
                  </div>
                  <span className={`font-display text-2xl font-bold ${scoreColor(r.score)}`}>
                    {r.score}<span className="text-xs text-muted-foreground">/10</span>
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${scoreBg(r.score)} transition-all duration-1000`}
                    style={{ width: `${(r.score / 10) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed feedback tabs */}
        <h2 className="font-display text-3xl mb-6">Detailed Feedback</h2>
        <div className="glass-strong rounded-2xl p-2 mb-12">
          <Tabs defaultValue={CRITERIA[0].key}>
            <TabsList className="grid grid-cols-3 md:grid-cols-9 h-auto bg-transparent gap-1">
              {CRITERIA.map(c => (
                <TabsTrigger key={c.key} value={c.key} className="text-xs data-[state=active]:bg-gradient-luxury data-[state=active]:text-midnight">
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {CRITERIA.map(c => {
              const r = result.criteria[c.key];
              return (
                <TabsContent key={c.key} value={c.key} className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${scoreBg(r.score)} text-midnight font-bold text-sm`}>
                      {r.score} / 10
                    </span>
                    <h3 className="font-display text-2xl">{c.label}</h3>
                  </div>
                  <p className="text-foreground/90 leading-relaxed">{r.feedback}</p>
                  {r.issues?.length > 0 && (
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-gold mb-2">Issues</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {r.issues.map((i, k) => <li key={k} className="flex gap-2"><span className="text-destructive">●</span>{i}</li>)}
                      </ul>
                    </div>
                  )}
                  {r.suggestions?.length > 0 && (
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-gold mb-2">Suggestions</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {r.suggestions.map((s, k) => <li key={k} className="flex gap-2"><span className="text-emerald-400">●</span>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        {/* Annotated paragraph */}
        <h2 className="font-display text-3xl mb-3">Annotated Paragraph</h2>
        <div className="flex gap-3 text-xs mb-4 flex-wrap">
          {[
            { c: "bg-red-500/30 border-red-500", l: "Grammar" },
            { c: "bg-blue-500/30 border-blue-500", l: "Spelling" },
            { c: "bg-amber-500/30 border-amber-500", l: "Vocabulary" },
            { c: "bg-emerald-500/25 border-emerald-500", l: "Good usage" },
          ].map((k, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded ${k.c} border`} />
              <span className="text-muted-foreground">{k.l}</span>
            </div>
          ))}
        </div>
        <div className="glass-strong rounded-2xl p-8 mb-10">
          <p className="text-foreground/90 leading-loose text-lg whitespace-pre-wrap">
            {renderAnnotated(submission.paragraph_text, result.highlights || [])}
          </p>
        </div>

        {/* Improved version toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl">AI-Improved Version</h2>
          <Button variant="outline" onClick={() => setShowImproved(!showImproved)} className="glass">
            <FileText className="h-4 w-4 mr-2" />
            {showImproved ? "Hide" : "Show"} side-by-side
          </Button>
        </div>
        {showImproved && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-6">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Original</h4>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{submission.paragraph_text}</p>
            </div>
            <div className="glass-strong rounded-2xl p-6 border-gold/30">
              <h4 className="text-xs uppercase tracking-widest text-gold mb-3">Improved</h4>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{result.improvedVersion}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Results;
