import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, Users, Heart, Sparkles, Menu, X, Instagram, Mail, MapPin,
  Check, Calendar, Clock, User, Phone, Search, UserPlus, GraduationCap,
  Target, MessageCircle, Send, Loader2
} from "lucide-react";

const BEIGE   = "#e8ddd0";
const BEIGE_L = "#f5f0ea";
const ROSE    = "#f9a8b8";
const ROSE_D  = "#f38ba0";

function Navbar({ currentPath, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/classes", label: "Classes" },
  { path: "/private", label: "Private" },
  { path: "/clients", label: "Clients" },
  { path: "/bookings", label: "Bookings" },
];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => onNavigate("/")} className="text-2xl font-serif font-light tracking-wide text-gray-800 hover:text-rose-300 transition-colors">
            On Pilates Lane
          </button>
          <div className="hidden md:flex items-center space-x-8">
            {links.map(l => (
              <button key={l.path} onClick={() => onNavigate(l.path)}
                className={`text-sm tracking-wide transition-colors ${currentPath === l.path ? "font-medium" : "text-gray-600 hover:text-gray-900"}`}
                style={currentPath === l.path ? { color: ROSE_D } : {}}>
                {l.label}
              </button>
            ))}
            <button onClick={() => onNavigate("/private")}
              className="px-5 py-2 text-sm rounded-full text-white transition-all duration-300"
              style={{ background: ROSE }}
              onMouseEnter={e => e.currentTarget.style.background = ROSE_D}
              onMouseLeave={e => e.currentTarget.style.background = ROSE}>
              Book Now
            </button>
          </div>
          <button className="md:hidden text-gray-800" onClick={() => setOpen(!open)}>
            {open ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map(l => (
              <button key={l.path} onClick={() => { onNavigate(l.path); setOpen(false); }}
                className="block w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-stone-100 transition-colors">
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: BEIGE_L, borderTop: `1px solid ${BEIGE}` }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-serif font-light mb-2 text-gray-800">On Pilates Lane</h3>
            <p className="text-xs font-medium tracking-widest text-gray-400 mb-4">OPL · LEEDS</p>
            <p className="text-gray-600 text-sm leading-relaxed">Premium Pilates in Leeds, led by Bibi Behbehani.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-4 text-sm tracking-wide">Contact</h4>
            <div className="space-y-3">
              {[[MapPin,"Leeds, UK"],[Mail,"hello@onpilateslane.co.uk"],[Instagram,"@onpilateslane"]].map(([Icon,text],i) => (
                <div key={i} className="flex items-start space-x-3 text-sm text-gray-600">
                  <Icon size={16} className="mt-0.5 flex-shrink-0" style={{ color: ROSE_D }}/>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-4 text-sm tracking-wide">Studio Hours</h4>
            <div className="space-y-2 text-sm text-gray-600">
              {[["Mon – Fri","6am – 8pm"],["Saturday","8am – 4pm"],["Sunday","Closed"]].map(([d,t]) => (
                <div key={d} className="flex justify-between"><span>{d}</span><span>{t}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 text-center text-xs text-gray-400" style={{ borderTop: `1px solid ${BEIGE}` }}>
          © 2026 On Pilates Lane. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function Home({ onNavigate, onOpenChat }) {
  const testimonials = [
    { text: "Bibi's sessions changed the way I move. I feel so much more in tune with my body.", author: "Sarah M.", location: "Leeds" },
    { text: "The attention to detail and personalised approach makes every session worthwhile.", author: "James L.", location: "Leeds" },
    { text: "I've tried many studios but OPL is on another level. My posture has improved dramatically.", author: "Emma K.", location: "Headingley" },
  ];
  return (
    <div style={{ background: BEIGE_L }}>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${BEIGE_L} 0%, #f7f2ec 60%, #fde8ed 100%)` }}/>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 70% 40%, #f9a8b8 0%, transparent 55%)" }}/>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">Leeds · UK</p>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-light text-gray-800 mb-4 tracking-tight leading-tight">
            Move with<br/>
            <span style={{ color: ROSE_D }}>intention</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Premium Pilates in Leeds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate("/private")}
              className="px-8 py-4 text-white rounded-full shadow-lg flex items-center justify-center space-x-2 group transition-all duration-300"
              style={{ background: ROSE }}
              onMouseEnter={e => e.currentTarget.style.background = ROSE_D}
              onMouseLeave={e => e.currentTarget.style.background = ROSE}>
              <span>Book Private Session</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
            <button onClick={() => onNavigate("/classes")}
              className="px-8 py-4 bg-white text-gray-800 rounded-full hover:bg-stone-50 transition-all duration-300 shadow border border-stone-200">
              View Classes
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-800 mb-4">Why OPL?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Thoughtful Pilates for every body and every level</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              [Heart,    "Expert Instruction",    "Led by Bibi Behbehani, bringing precision and passion to every session."],
              [Users,    "Personalised Approach", "Small class sizes and private sessions ensure individual attention and customised guidance."],
              [Sparkles, "Premium Experience",    "A calming studio space designed for focused, mindful practice in the heart of Leeds."],
            ].map(([Icon, title, desc], i) => (
              <div key={i} className="rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{ background: BEIGE_L }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: BEIGE }}>
                  <Icon size={26} style={{ color: ROSE_D }}/>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6" style={{ background: BEIGE_L }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-800 mb-4">What Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-700 leading-relaxed mb-6 italic text-sm">"{t.text}"</p>
                <div style={{ borderTop: `1px solid ${BEIGE}` }} className="pt-4">
                  <p className="font-medium text-gray-800 text-sm">{t.author}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-light text-gray-800 mb-4">Have Questions?</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">Our assistant can help with schedules, bookings, and studio info.</p>
          <button onClick={onOpenChat}
            className="px-8 py-4 text-white rounded-full shadow-lg inline-flex items-center space-x-2 transition-all duration-300"
            style={{ background: ROSE }}
            onMouseEnter={e => e.currentTarget.style.background = ROSE_D}
            onMouseLeave={e => e.currentTarget.style.background = ROSE}>
            <span>Chat with us</span><ArrowRight size={18}/>
          </button>
          <p className="text-xs text-gray-400 mt-4">For general guidance only. Not medical advice.</p>
        </div>
      </section>
    </div>
  );
}

function About() {
  const values = [
    [Heart,         "Mindful Movement",    "Every exercise is an opportunity to connect with your body and discover what it's capable of."],
    [GraduationCap, "Thoughtful Teaching", "Instruction that's careful, considered, and tailored to how you move."],
    [Sparkles,      "Individual Focus",    "Personalised attention to help you achieve your unique wellness goals."],
    [Target,        "Sustainable Practice","Building strength and flexibility that supports your daily life."],
  ];
  return (
    <div style={{ background: BEIGE_L }}>
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-4 uppercase">About</p>
            <h1 className="text-5xl md:text-6xl font-serif font-light text-gray-800 mb-6">On Pilates Lane</h1>
            <p className="text-xl text-gray-500 leading-relaxed">A premium Pilates studio in Leeds</p>
          </div>
          <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm mb-16">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/3">
                <div className="aspect-square rounded-2xl" style={{ background: `linear-gradient(135deg, ${BEIGE} 0%, #fde8ed 100%)` }}/>
              </div>
              <div className="md:w-2/3 space-y-5">
                <h2 className="text-3xl font-serif font-light text-gray-800">Meet Bibi Behbehani</h2>
                <p className="text-gray-600 leading-relaxed text-sm">Bibi brings warmth, precision, and a genuine passion for movement to every session. Her teaching style is hands-on, attentive, and always tailored to you.</p>
                <p className="text-gray-600 leading-relaxed text-sm">A medical student with a deep love for the body and how it moves, Bibi understands how to help you get the most out of your practice — whether you're brand new to Pilates or looking to deepen your work.</p>
                <p className="text-gray-600 leading-relaxed text-sm">She founded On Pilates Lane to create a studio where people feel seen, supported, and genuinely challenged — a space to slow down and move well.</p>
                <p className="text-xs text-gray-400 italic leading-relaxed pl-4" style={{ borderLeft: `2px solid ${BEIGE}` }}>
                  OPL is a movement and wellness studio. Sessions are not a substitute for medical treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light text-gray-800 mb-4">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map(([Icon, title, desc], i) => (
              <div key={i} className="rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{ background: BEIGE_L }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: BEIGE }}>
                  <Icon size={26} style={{ color: ROSE_D }}/>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Classes() {
  const classes = [
    { name:"Foundations",       level:"Beginner",    duration:"60 min", capacity:"6", price:"£25", desc:"Perfect for those new to Pilates. Learn fundamental movements and breathing techniques.", times:["Mon 9:00 AM","Wed 6:00 PM","Sat 10:00 AM"] },
    { name:"Core Flow",         level:"Intermediate", duration:"60 min", capacity:"8", price:"£28", desc:"Dynamic sequences focusing on core strength with flowing transitions.", times:["Tue 7:00 AM","Thu 6:00 PM","Sat 11:30 AM"] },
    { name:"Advanced Practice", level:"Advanced",     duration:"75 min", capacity:"6", price:"£32", desc:"Challenging sequences for experienced practitioners.", times:["Tue 6:00 PM","Fri 7:00 AM"] },
    { name:"Restorative",       level:"All Levels",   duration:"60 min", capacity:"8", price:"£25", desc:"Gentle movements for flexibility, breath work, and mindful relaxation.", times:["Wed 7:00 AM","Fri 6:00 PM","Sun 9:00 AM"] },
  ];
  const levelColor = { Beginner:"#d1fae5", Intermediate:"#dbeafe", Advanced:"#ede9fe", "All Levels":"#fef9c3" };
  const levelText  = { Beginner:"#065f46", Intermediate:"#1e40af", Advanced:"#5b21b6", "All Levels":"#713f12" };
  return (
    <div style={{ background: BEIGE_L }} className="min-h-screen">
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-4 uppercase">OPL</p>
            <h1 className="text-5xl md:text-6xl font-serif font-light text-gray-800 mb-6">Class Schedule</h1>
            <p className="text-gray-500 max-w-xl mx-auto">Small group classes designed for focused attention and community</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {classes.map((c, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-light text-gray-800 mb-2">{c.name}</h3>
                    <span className="inline-block px-3 py-1 text-xs rounded-full font-medium"
                      style={{ background: levelColor[c.level], color: levelText[c.level] }}>
                      {c.level}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-medium text-gray-800">{c.price}</div>
                    <div className="text-xs text-gray-400">per class</div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{c.desc}</p>
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Clock size={15} style={{ color: ROSE_D }}/>{c.duration}</span>
                  <span className="flex items-center gap-1"><Users size={15} style={{ color: ROSE_D }}/>Max {c.capacity}</span>
                </div>
                <div className="pt-4 flex items-start gap-2 text-sm" style={{ borderTop: `1px solid ${BEIGE}` }}>
                  <Calendar size={16} style={{ color: ROSE_D }} className="mt-0.5 flex-shrink-0"/>
                  <div className="space-y-1 text-gray-600">{c.times.map((t,j) => <div key={j}>{t}</div>)}</div>
                </div>
                <button className="w-full mt-6 py-3 text-white rounded-full transition-all duration-300 text-sm font-medium"
                  style={{ background: ROSE }}
                  onMouseEnter={e => e.currentTarget.style.background = ROSE_D}
                  onMouseLeave={e => e.currentTarget.style.background = ROSE}>
                  Book This Class
                </button>
              </div>
            ))}
          </div>
          <div className="rounded-3xl p-10 md:p-14 text-center" style={{ background: BEIGE }}>
            <h2 className="text-3xl font-serif font-light text-gray-800 mb-3">Class Packages</h2>
            <p className="text-gray-600 text-sm mb-10">Save when you commit to your practice</p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[["5","£120","Save £20"],["10","£230","Save £50"],["20","£440","Save £120"]].map(([n,p,s],i) => (
                <div key={i} className="bg-white rounded-2xl p-6" style={i===1?{outline:`2px solid ${ROSE_D}`}:{}}>
                  {i===1 && <div className="text-xs font-semibold tracking-widest mb-3" style={{ color: ROSE_D }}>POPULAR</div>}
                  <div className="text-5xl font-serif font-light text-gray-800 mb-1">{n}</div>
                  <div className="text-xs text-gray-400 mb-4">Classes</div>
                  <div className="text-2xl font-medium text-gray-800 mb-3">{p}</div>
                  <div className="text-xs font-medium" style={{ color: ROSE_D }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Private() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:"",email:"",phone:"",preferredDate:"",preferredTime:"",experience:"",goals:"",injuries:"" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone || !form.preferredDate || !form.preferredTime) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name:"",email:"",phone:"",preferredDate:"",preferredTime:"",experience:"",goals:"",injuries:"" });
    }, 3000);
  };
  const inputCls = "w-full px-4 py-3 rounded-xl border border-stone-200 outline-none transition-all text-sm bg-white";
  return (
    <div style={{ background: BEIGE_L }} className="min-h-screen">
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-4 uppercase">One-on-One</p>
            <h1 className="text-5xl md:text-6xl font-serif font-light text-gray-800 mb-6">Private Sessions</h1>
            <p className="text-gray-500 max-w-xl mx-auto">Tailored instruction for your unique needs and goals</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-14">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-light text-gray-800 mb-5">What to Expect</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {["Comprehensive movement assessment","Personalised exercise programming","Hands-on guidance & coaching","Flexible scheduling"].map((t,i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={18} className="mt-0.5 flex-shrink-0" style={{ color: ROSE_D }}/>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-light text-gray-800 mb-5">Pricing</h3>
              <div className="space-y-4">
                {[["Single Session","£35","60 minutes"],["5 Session Package","£165","Save £10"],["10 Session Package","£315","Save £35"]].map(([label,price,sub],i,arr) => (
                  <div key={i} className="pb-4" style={i<arr.length-1?{borderBottom:`1px solid ${BEIGE}`}:{}}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-gray-700 font-medium text-sm">{label}</span>
                      <span className="text-xl text-gray-800">{price}</span>
                    </div>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-14 shadow-sm">
            <h2 className="text-3xl font-serif font-light text-gray-800 mb-10 text-center">Book Your Session</h2>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: BEIGE }}>
                  <Check size={32} style={{ color: ROSE_D }}/>
                </div>
                <h3 className="text-2xl font-medium text-gray-800 mb-2">Request Received!</h3>
                <p className="text-gray-500 text-sm">We'll be in touch shortly to confirm your session.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[["text","name","Full Name *","Your name"],["email","email","Email *","your@email.com"]].map(([type,name,label,ph]) => (
                    <div key={name}>
                      <label className="block text-xs font-medium text-gray-600 mb-2">{label}</label>
                      <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={ph} className={inputCls}/>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Phone *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="07XXX XXXXXX" className={inputCls}/>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Preferred Date *</label>
                    <input type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange} className={inputCls}/>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Preferred Time *</label>
                    <select name="preferredTime" value={form.preferredTime} onChange={handleChange} className={inputCls}>
                      <option value="">Select a time</option>
                      <option value="morning">Morning (6am–12pm)</option>
                      <option value="afternoon">Afternoon (12pm–5pm)</option>
                      <option value="evening">Evening (5pm–8pm)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Experience Level</label>
                  <select name="experience" value={form.experience} onChange={handleChange} className={inputCls}>
                    <option value="">Select level</option>
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Goals & Objectives</label>
                  <textarea name="goals" value={form.goals} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} placeholder="What would you like to achieve through Pilates?"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Injuries or Health Considerations</label>
                  <textarea name="injuries" value={form.injuries} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Any relevant information (optional)"/>
                </div>
                <button onClick={handleSubmit}
                  className="w-full py-4 text-white rounded-full font-medium shadow-lg transition-all duration-300"
                  style={{ background: ROSE }}
                  onMouseEnter={e => e.currentTarget.style.background = ROSE_D}
                  onMouseLeave={e => e.currentTarget.style.background = ROSE}>
                  Submit Booking Request
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Clients() {
  const API = "https://glorious-halibut-jj5v9v9jrx6wfqxrg-8000.app.github.dev";
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [newClient, setNewClient] = useState({ name:"", email:"", phone:"", age:"", package_type:"" });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/clients`);
      if (!res.ok) throw new Error("Failed to fetch");
      setClients(await res.json());
      setError(null);
    } catch { setError("Could not connect to backend."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleAdd = async () => {
    if (!newClient.name || !newClient.email) return;
    try {
      const res = await fetch(`${API}/api/clients`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newClient, age: newClient.age ? parseInt(newClient.age) : null }),
      });
      if (!res.ok) { const e = await res.json(); alert(e.detail); return; }
      setShowAdd(false);
      setNewClient({ name:"", email:"", phone:"", age:"", package_type:"" });
      fetchClients();
    } catch { alert("Failed to add client."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this client? This will also delete their bookings.")) return;
    setDeleting(id);
    try {
      await fetch(`${API}/api/clients/${id}`, { method: "DELETE" });
      fetchClients();
    } catch { alert("Failed to delete."); }
    finally { setDeleting(null); }
  };

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full px-3 py-2 rounded-xl border border-stone-200 outline-none text-sm bg-white";

  return (
    <div style={{ background: BEIGE_L }} className="min-h-screen">
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h1 className="text-4xl font-serif font-light text-gray-800 mb-1">Clients</h1>
              <p className="text-gray-500 text-sm">Manage your client database</p>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="mt-4 md:mt-0 px-6 py-3 text-white rounded-full inline-flex items-center gap-2 text-sm transition-all"
              style={{ background: ROSE }}
              onMouseEnter={e => e.currentTarget.style.background = ROSE_D}
              onMouseLeave={e => e.currentTarget.style.background = ROSE}>
              <UserPlus size={16}/><span>Add Client</span>
            </button>
          </div>

          {/* Add Client Modal */}
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-serif font-light text-gray-800 mb-6">New Client</h2>
                <div className="space-y-4">
                  {[["text","name","Full Name *",""],["email","email","Email *",""],["tel","phone","Phone",""],["number","age","Age",""]].map(([type,field,label]) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                      <input type={type} value={newClient[field]} onChange={e => setNewClient({...newClient,[field]:e.target.value})} className={inputCls}/>
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Package</label>
                    <select value={newClient.package_type} onChange={e => setNewClient({...newClient,package_type:e.target.value})} className={inputCls}>
                      <option value="">Select package</option>
                      <option value="drop-in">Drop-in</option>
                      <option value="10-class">10-class</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleAdd}
                    className="flex-1 py-3 text-white rounded-full text-sm font-medium transition-all"
                    style={{ background: ROSE }}
                    onMouseEnter={e => e.currentTarget.style.background = ROSE_D}
                    onMouseLeave={e => e.currentTarget.style.background = ROSE}>
                    Add Client
                  </button>
                  <button onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-stone-100 text-gray-700 rounded-full text-sm hover:bg-stone-200 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6" style={{ borderBottom: `1px solid ${BEIGE}` }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                <input type="text" placeholder="Search clients…" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 outline-none text-sm"/>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-400 text-sm">Loading clients…</div>
            ) : error ? (
              <div className="p-12 text-center text-red-400 text-sm">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: BEIGE_L }}>
                    <tr>
                      {["Name","Contact","Package","Joined","Actions"].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.id} className="hover:bg-stone-50 transition-colors" style={{ borderTop: `1px solid ${BEIGE}` }}>
                        <td className="px-6 py-4 font-medium text-gray-800">{c.name}</td>
                        <td className="px-6 py-4"><div className="text-gray-600">{c.email}</div><div className="text-gray-400">{c.phone}</div></td>
                        <td className="px-6 py-4 text-gray-500 capitalize">{c.package_type || "—"}</td>
                        <td className="px-6 py-4 text-gray-500">{c.join_date ? new Date(c.join_date).toLocaleDateString("en-GB") : "—"}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                            className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-colors disabled:opacity-40">
                            {deleting === c.id ? "…" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">No clients found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="p-5 text-center text-xs text-gray-400" style={{ borderTop: `1px solid ${BEIGE}` }}>
              {filtered.length} client{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Bookings() {
  const API = "https://glorious-halibut-jj5v9v9jrx6wfqxrg-8000.app.github.dev";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/bookings`);
      if (!res.ok) throw new Error("Failed to fetch");
      setBookings(await res.json());
      setError(null);
    } catch { setError("Could not connect to backend."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const booking = bookings.find(b => b.id === id);
      await fetch(`${API}/api/bookings/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: booking.client_id, class_id: booking.class_id, status }),
      });
      fetchBookings();
    } catch { alert("Failed to update booking."); }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await fetch(`${API}/api/bookings/${id}`, { method: "DELETE" });
      fetchBookings();
    } catch { alert("Failed to delete."); }
  };

  const statusStyle = {
    confirmed: { background: "#d1fae5", color: "#065f46" },
    waitlist:  { background: "#fef9c3", color: "#713f12" },
    cancelled: { background: "#fee2e2", color: "#991b1b" },
  };

  return (
    <div style={{ background: BEIGE_L }} className="min-h-screen">
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-serif font-light text-gray-800 mb-1">Bookings</h1>
              <p className="text-gray-500 text-sm">Manage all class bookings</p>
            </div>
            <button onClick={fetchBookings} className="px-4 py-2 text-sm rounded-full bg-white border border-stone-200 text-gray-600 hover:bg-stone-50 transition-all">
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-400 text-sm shadow-sm">Loading bookings…</div>
          ) : error ? (
            <div className="bg-white rounded-3xl p-12 text-center text-red-400 text-sm shadow-sm">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
              <Calendar className="mx-auto mb-4" size={44} style={{ color: BEIGE }}/>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings yet</h3>
              <p className="text-gray-400 text-sm">Bookings will appear here once created.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: BEIGE_L }}>
                    <tr>
                      {["ID","Client","Class","Date","Status","Actions"].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-stone-50 transition-colors" style={{ borderTop: `1px solid ${BEIGE}` }}>
                        <td className="px-6 py-4 text-gray-400">#{b.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {b.client?.name || `Client #${b.client_id}`}
                          <div className="text-xs text-gray-400">{b.client?.email}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {b.pilates_class?.name || `Class #${b.class_id}`}
                          <div className="text-xs text-gray-400">{b.pilates_class?.day_of_week} {b.pilates_class?.time}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {b.booking_date ? new Date(b.booking_date).toLocaleDateString("en-GB") : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                            style={statusStyle[b.status] || statusStyle.confirmed}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {b.status !== "confirmed" && (
                              <button onClick={() => updateStatus(b.id, "confirmed")}
                                className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                                Confirm
                              </button>
                            )}
                            {b.status !== "cancelled" && (
                              <button onClick={() => updateStatus(b.id, "cancelled")}
                                className="px-3 py-1 text-xs rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors">
                                Cancel
                              </button>
                            )}
                            <button onClick={() => deleteBooking(b.id)}
                              className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-5 text-center text-xs text-gray-400" style={{ borderTop: `1px solid ${BEIGE}` }}>
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Chatbot({ forceOpen }) {
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState([]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const suggestions = ["Book a private session","Show classes","Check availability","How do waitlists work?"];
  useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);
  const send = async txt => {
    if (!txt.trim() || loading) return;
    setMsgs(p => [...p, { role:"user", content:txt }]);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setMsgs(p => [...p, { role:"assistant", content:"Thanks for reaching out! For bookings or queries please email hello@onpilateslane.co.uk or use the booking form." }]);
    setLoading(false);
  };
  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 text-white rounded-full shadow-xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-110"
        style={{ background: ROSE }}
        onMouseEnter={e => e.currentTarget.style.background = ROSE_D}
        onMouseLeave={e => e.currentTarget.style.background = ROSE}>
        {open ? <X size={24}/> : <MessageCircle size={24}/>}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[580px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${ROSE} 0%, ${ROSE_D} 100%)` }}>
            <h3 className="font-medium">OPL Assistant</h3>
            <p className="text-xs opacity-80">How can we help you today?</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {msgs.length === 0 && (
              <div className="text-center text-gray-400 text-sm">
                <p className="mb-5">Ask me about classes, bookings, or our studio.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((s,i) => (
                    <button key={i} onClick={() => send(s)}
                      className="px-4 py-2 text-xs rounded-full transition-colors"
                      style={{ background: BEIGE_L, color: "#6b7280" }}
                      onMouseEnter={e => e.currentTarget.style.background = BEIGE}
                      onMouseLeave={e => e.currentTarget.style.background = BEIGE_L}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m,i) => (
              <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={m.role==="user"?{background:ROSE,color:"white"}:{background:BEIGE_L,color:"#374151"}}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl" style={{ background: BEIGE_L }}>
                  <Loader2 size={18} style={{ color: ROSE_D }} className="animate-spin"/>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>
          <div className="p-4" style={{ borderTop: `1px solid ${BEIGE}` }}>
            <p className="text-xs text-gray-400 text-center mb-3">For general guidance only. Not medical advice.</p>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { send(input); } }}
                placeholder="Type your message…"
                className="flex-1 px-4 py-3 rounded-full border border-stone-200 outline-none text-sm"
                disabled={loading}/>
              <button onClick={() => send(input)} disabled={loading || !input.trim()}
                className="w-11 h-11 text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all"
                style={{ background: ROSE }}
                onMouseEnter={e => e.currentTarget.style.background = ROSE_D}
                onMouseLeave={e => e.currentTarget.style.background = ROSE}>
                <Send size={16}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [path, setPath]       = useState("/");
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = p => { setPath(p); window.scrollTo({ top:0, behavior:"smooth" }); };
  const pages = {
    "/":         <Home onNavigate={navigate} onOpenChat={() => setChatOpen(true)}/>,
    "/about":    <About/>,
    "/classes":  <Classes/>,
    "/private":  <Private/>,
    "/clients":  <Clients/>,
    "/bookings": <Bookings/>,
  };
  return (
    <div className="min-h-screen flex flex-col" style={{ background: BEIGE_L }}>
      <Navbar currentPath={path} onNavigate={navigate}/>
      <main className="flex-grow pt-20">{pages[path] || pages["/"]}</main>
      <Footer/>
      <Chatbot forceOpen={chatOpen}/>
    </div>
  );
}