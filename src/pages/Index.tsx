import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles, FileText, Brain, BarChart3, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShaderBackground from "@/components/ShaderBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrbitalFeatures from "@/components/OrbitalFeatures";
import { Counter } from "@/components/Counter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ShaderBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />

        <div className="relative z-10 container text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs font-medium tracking-widest uppercase text-foreground/80">
              AI-Powered Writing Evaluation · Built for CSS Aspirants
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-semibold leading-[0.95] mb-6"
          >
            <span className="block text-gradient">The CSS Guide</span>
            <span className="block text-luxury italic">by Haseeb Swati</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Distinguished educator, mentor, and motivational speaker, widely recognized for 
            his exceptional contribution to competitive exam preparation in Pakistan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild className="bg-gradient-luxury text-primary-foreground font-semibold text-base px-8 h-14 rounded-full glow-primary hover:scale-105 transition-transform">
              <Link to="/evaluate">
                Start Evaluating Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="glass border-border/50 text-base px-8 h-14 rounded-full hover:border-gold/50">
              <PlayCircle className="mr-2 h-5 w-5 text-gold" /> Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-20 text-xs text-muted-foreground tracking-widest uppercase"
          >
            ↓ Scroll to discover
          </motion.div>
        </div>
      </section>

      {/* ORBITAL FEATURES */}
      <OrbitalFeatures />

      {/* PROGRAMS & MENTORSHIP */}
      <section className="relative py-32">
        <div className="container">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold text-gold tracking-widest uppercase mb-6">
              Our Programs
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold">
              <span className="text-gradient">Professional </span>
              <span className="text-luxury italic">Mentorship</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Mentorship Program Card */}
            <div className="glass-strong rounded-3xl p-10 hover:border-gold/40 transition-all border border-white/5">
              <h3 className="text-3xl font-display font-bold mb-4 text-gold">Compulsory Subjects Program</h3>
              <p className="text-muted-foreground mb-6">A complete 60-90 day roadmap covering Pakistan Affairs, Current Affairs, Precis, GSA, and Islamic Studies.</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">✅ Syllabus Breakdown & Notes Evaluation</li>
                <li className="flex items-center gap-2">✅ Live Sessions (9:00 - 11:00 PM)</li>
                <li className="flex items-center gap-2">✅ Just Rs. 2,000/- Per Subject</li>
              </ul>
              <Button className="w-full bg-gradient-gold text-midnight font-bold">View Program Details</Button>
            </div>

            {/* Essay Writing Card */}
            <div className="glass-strong rounded-3xl p-10 hover:border-gold/40 transition-all border border-white/5">
              <h3 className="text-3xl font-display font-bold mb-4 text-luxury">The Art of Essay Writing</h3>
              <p className="text-muted-foreground mb-6">3-month comprehensive session starting from beginner grammar to full-length CSS/PMS essays.</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">✅ 10+ Sentence & Paragraph Classes</li>
                <li className="flex items-center gap-2">✅ 15+ Essay Classes & Mock Evaluations</li>
                <li className="flex items-center gap-2">✅ Complete Session for only Rs. 9,000/-</li>
              </ul>
              <Button className="w-full bg-gradient-luxury text-white font-bold">Master Essay Writing</Button>
            </div>
          </div>
        </div>
      </section>

      {/* AUTHOR & BOOK SECTION */}
    <section className="py-24 bg-black/40 overflow-hidden border-y border-white/5">
      <div className="container grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center items-center"
        >
          <div className="relative group">
            {/* Subtle glow instead of heavy blur */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 to-luxury/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img 
              src="/src/images/book.png" 
              alt="Pakistan Affairs on Fingertips by Haseeb Swati" 
              className="relative z-10 rounded-lg shadow-2xl transition-transform duration-500 w-full max-w-[450px] md:max-w-[500px] h-auto object-contain" 
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gold font-bold tracking-widest uppercase text-xs mb-4 block">Bestselling Author</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Pakistan Affairs <br />
            <span className="text-gradient font-italic font-serif">on Fingertips</span>
          </h2>
          <p className="text-lg text-foreground/90 leading-relaxed mb-6">
            The most top-selling book for Pakistan Affairs preparation, authored by <span className="text-gold font-semibold underline decoration-gold/30">Haseeb Swati</span>[cite: 17, 83, 84]. This resource is the primary choice for CSS & PMS aspirants across Pakistan.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 border-l-4 border-gold/50 pl-6 italic bg-white/5 py-4 rounded-r-lg">
            "This book comprehensively covers the history of Pakistan, contemporary national and international issues, and ongoing crises with practical, exam-oriented solutions"[cite: 18].
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-gradient-gold text-midnight font-bold px-10 h-14 rounded-full text-base hover:scale-105 transition-transform shadow-lg shadow-gold/20">
              <a href="https://shop.nearpeer.org/products/pakistan-affairs-at-your-fingertips" target="_blank" rel="noopener noreferrer">
                Order from Nearpeer
              </a>
            </Button>
            <Button variant="outline" asChild className="border-white/20 text-foreground hover:border-gold px-10 h-14 rounded-full text-base backdrop-blur-sm">
              <a href="https://www.instagram.com/the_css_guide/" target="_blank" rel="noopener noreferrer">
                View Book Details
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
    
    {/* DETAILED COURSE BREAKDOWN */}
      <section className="py-24 bg-midnight/50 relative">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 glass-strong p-8 rounded-3xl border border-gold/20">
              <h3 className="text-2xl font-display font-bold text-gold mb-6">Compulsory Subjects</h3>
              <ul className="space-y-4">
                {["Pakistan Affairs", "Current Affairs", "English Precis & Composition", "General Science & Ability", "Islamic Studies"].map((subject, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground/80 font-medium">
                    <span className="text-gold font-bold">0{idx + 1}.</span> {subject}
                  </li>
                ))}
              </ul>
              <div className="mt-10 p-6 bg-gold/5 rounded-2xl border border-gold/10">
                <p className="text-xs text-gold font-bold uppercase tracking-widest mb-1">Session Duration</p>
                <p className="text-xl font-display font-semibold">60 to 90 Days</p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="glass p-8 rounded-3xl border border-white/5">
                <h3 className="text-2xl font-display font-bold mb-6">What this Mentorship Covers</h3>
                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
                  {["Syllabus Breakdown", "Notes Samples & Templates", "Past Paper Analysis", "Paper Presentation", "Notes Evaluation", "Grand Test & Mock Exams"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-muted-foreground group">
                      <div className="h-2 w-2 rounded-full bg-gold/50 group-hover:bg-gold transition-colors" /> {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-gold/15 to-transparent border border-gold/20">
                  <p className="text-gold font-bold text-xs uppercase tracking-tighter mb-2">Package 01</p>
                  <h4 className="text-xl font-bold mb-1">PA & CA Combined</h4>
                  <p className="text-3xl font-display font-bold text-white mb-4">Rs. 5,000/-</p>
                  <Button variant="link" className="text-gold p-0 h-auto text-xs font-bold uppercase">Enroll Now →</Button>
                </div>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-luxury/15 to-transparent border border-luxury/20">
                  <p className="text-luxury font-bold text-xs uppercase tracking-tighter mb-2">Full Access</p>
                  <h4 className="text-xl font-bold mb-1">All 5 Subjects</h4>
                  <p className="text-3xl font-display font-bold text-white mb-4">Rs. 10,000/-</p>
                  <Button variant="link" className="text-luxury p-0 h-auto text-xs font-bold uppercase">Enroll Now →</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO LECTURES SECTION */}
      <section className="py-24 border-t border-white/5 bg-black/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Demo <span className="text-gold italic">Lectures</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Watch these sample classes to experience Haseeb Swati's conceptual teaching methodology.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Sentence Writing", url: "https://www.youtube.com/watch?v=AGJH_4y8Gwg" },
              { title: "Paragraph Writing", url: "https://www.youtube.com/watch?v=WPL0uOivAfE" },
              { title: "Essay Writing", url: "https://www.youtube.com/watch?v=HT4lBUUISe0" }
            ].map((demo, i) => (
              <a key={i} href={demo.url} target="_blank" className="group block glass p-6 rounded-2xl border-white/5 hover:border-gold/30 transition-all">
                <div className="aspect-video bg-white/5 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <PlayCircle className="text-gold w-12 h-12 relative z-10 opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                  <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
                </div>
                <h4 className="font-bold text-lg group-hover:text-gold transition-colors text-center">{demo.title}</h4>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="container relative z-10">
          <motion.div className="glass-strong rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-luxury/10" />
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-8">Join the <span className="text-gradient">Community</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
              Connect with thousands of aspirants in our WhatsApp community and follow us on Instagram for daily CSS/PMS updates and tips.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" asChild className="bg-[#25D366] hover:bg-[#128C7E] text-white px-10 h-16 rounded-full font-bold">
                <a href="https://chat.whatsapp.com/JaDSDvjc6kEI8l8Vajms4i" target="_blank">WhatsApp Community</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="glass px-10 h-16 rounded-full font-bold border-white/20">
                <a href="https://www.instagram.com/the_css_guide/" target="_blank">Instagram Page</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
