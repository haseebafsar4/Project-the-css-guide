import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail, Sparkles } from "lucide-react";

export const Footer = () => (
  <footer className="relative border-t border-border/50 mt-32">
    <div className="container py-16 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <Link to="/" className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-gold" />
          <span className="font-display text-2xl font-semibold text-gradient">The CSS Guide</span>
        </Link>
        <p className="text-muted-foreground max-w-sm leading-relaxed">
          Distinguished academy for CSS and PMS preparation, led by visionary educator 
          and mentor Haseeb Swati. Supporting aspirants through structured methodology.
        </p>
      </div>
      <div>
        <h4 className="font-display text-lg mb-4 text-gold">Product</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/evaluate" className="hover:text-foreground transition-colors">Evaluate</Link></li>
          <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
          <li><Link to="/history" className="hover:text-foreground transition-colors">History</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-lg mb-4 text-gold">Connect</h4>
        <div className="flex gap-3">
          <a 
            href="https://www.instagram.com/the_css_guide/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-gold/40 transition-all hover:scale-110"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a 
            href="https://www.youtube.com/@haseebswati1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-gold/40 transition-all hover:scale-110"
          >
            <Youtube className="h-4 w-4" />
          </a>
          <a 
            href="mailto:contact@thecssguide.com" 
            className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-gold/40 transition-all hover:scale-110"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-border/50">
      <div className="container py-6 flex flex-col md:flex-row justify-between text-xs text-muted-foreground">
        <span>© 2026 The CSS Guide. Crafted for excellence in competitive exams.</span>
        <span>Lead Mentor: Haseeb Swati · AI Evaluation Engine</span>
      </div>
    </div>
  </footer>
);

export default Footer;