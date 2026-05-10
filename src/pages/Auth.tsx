import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ShaderBackground from "@/components/ShaderBackground";
import { z } from "zod";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(100);
const nameSchema = z.string().trim().min(1, "Name required").max(80);

const Auth = () => {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard");
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const emailV = emailSchema.parse(email);
      const passV = passwordSchema.parse(password);

      if (mode === "signup") {
        const nameV = nameSchema.parse(name);
        const { error } = await supabase.auth.signUp({
          email: emailV,
          password: passV,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name: nameV },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: emailV, password: passV });
        if (error) throw error;
        toast.success("Welcome back");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <ShaderBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-background/80" />
        <div className="relative z-10 px-12 max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <Sparkles className="h-7 w-7 text-gold" />
            <span className="font-display text-3xl font-semibold text-gradient">Lexora</span>
          </Link>
          <h2 className="font-display text-5xl font-semibold mb-4">
            <span className="text-gradient">Begin your</span>
            <br />
            <span className="text-luxury italic">writing journey</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Join thousands of CSS aspirants and English learners who have elevated their writing with precise,
            AI-powered evaluation across 9 critical pillars.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Sparkles className="h-6 w-6 text-gold" />
            <span className="font-display text-2xl font-semibold text-gradient">Lexora</span>
          </Link>

          <div className="glass-strong rounded-2xl p-8">
            <h1 className="font-display text-3xl font-semibold mb-2">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              {mode === "signin" ? "Sign in to continue your journey" : "Start evaluating in seconds"}
            </p>

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10 h-12" placeholder="Ayesha Khan" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 h-12" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 h-12" placeholder="••••••••" />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-luxury text-primary-foreground font-semibold rounded-xl">
                {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="text-center mt-6 text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-gold hover:underline font-medium">Sign up</button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setMode("signin")} className="text-gold hover:underline font-medium">Sign in</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
