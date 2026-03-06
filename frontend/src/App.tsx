import { useState, useEffect, useRef } from "react";
import { ArrowRight, Users, Heart, Sparkles, Menu, X, Instagram, Mail, MapPin, Check, Calendar, Clock, Search, UserPlus, GraduationCap, Target, MessageCircle, Send, Loader2, Eye, LogOut, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BEIGE_L="#f5f0ea", ROSE="#3e2723", ROSE_D="#2e1a17";
const API = import.meta.env.VITE_API_URL || "https://onpilateslane.com";
const CHAT_URL = import.meta.env.VITE_CHAT_URL || "https://onpilateslane.com";

// Auth helpers
const getToken = () => sessionStorage.getItem("opl_token");

const authHeaders = (): Record<string, string> => {
  const t = getToken();
  return t
    ? { "Authorization": `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

const authHeadersNoJson = (): Record<string, string> => {
  const t = getToken();
  return t ? { "Authorization": `Bearer ${t}` } : {};
};

// Login Page
function LoginPage({ onLogin }: { onLogin: (token: string, role: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ic = "w-full px-4 py-3 rounded-xl border border-stone-200 outline-none text-sm bg-white";

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true); setError("");
    try {
      const body = new URLSearchParams({ username: email, password });
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Invalid credentials."); return; }
      sessionStorage.setItem("opl_token", data.access_token);
      sessionStorage.setItem("opl_role", data.role);
      onLogin(data.access_token, data.role);
    } catch { setError("Could not connect. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: BEIGE_L }}>
      <div className="bg-white rounded-3xl p-10 shadow-sm w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#e8ddd0" }}>
            <Lock size={28} style={{ color: ROSE_D }} />
          </div>
          <h1 className="text-3xl font-serif font-light text-gray-800 mb-1">Admin Login</h1>
          <p className="text-sm text-gray-400">On Pilates Lane · Staff Access</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
              placeholder="bibi@onpilateslane.co.uk" className={ic} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
              placeholder="••••••••" className={ic} />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3 text-white rounded-full font-medium disabled:opacity-50 transition-all"
            style={{ background: ROSE }}
            onMouseEnter={e => (e.currentTarget.style.background = ROSE_D)}
            onMouseLeave={e => (e.currentTarget.style.background = ROSE)}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Navbar
function Navbar({ currentPath, onNavigate, isLoggedIn, onLogout }: { currentPath: string; onNavigate: (p: string) => void; isLoggedIn: boolean; onLogout: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const links = [{ path: "/", label: "Home" }, { path: "/about", label: "About" }, { path: "/classes", label: "Classes" }, { path: "/private", label: "Private" }, ...(isLoggedIn ? [{ path: "/clients", label: "Clients" }, { path: "/bookings", label: "Bookings" }] : [])];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => onNavigate("/")} className="text-2xl font-serif font-light tracking-wide text-gray-800">On Pilates Lane</button>
          <div className="hidden md:flex items-center space-x-6">
            {links.map(l => (
              <button key={l.path} onClick={() => onNavigate(l.path)} className="text-sm tracking-wide transition-colors text-gray-600 hover:text-gray-900" style={currentPath === l.path ? { color: ROSE_D, fontWeight: 500 } : {}}>{l.label}</button>
            ))}
            {isLoggedIn ? (
              <button onClick={onLogout} className="px-5 py-2 text-sm rounded-full border border-stone-200 text-gray-600 hover:bg-stone-100 flex items-center gap-2">
                <LogOut size={14} /> Sign Out
              </button>
            ) : (
              <button onClick={() => onNavigate("/login")} className="px-5 py-2 text-sm rounded-full text-white" style={{ background: "#3e2723" }} onMouseEnter={e => e.currentTarget.style.background = "#2e1a17"} onMouseLeave={e => e.currentTarget.style.background = "#3e2723"}>Staff Login</button>
            )}
            <button onClick={() => onNavigate("/classes")} className="px-5 py-2 text-sm rounded-full text-white" style={{ background: "#3e2723" }} onMouseEnter={e => e.currentTarget.style.background = "#2e1a17"} onMouseLeave={e => e.currentTarget.style.background = "#3e2723"}>Book Now</button>
          </div>
          <button className="md:hidden text-gray-800" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {open && <div className="md:hidden pb-4 space-y-2">{links.map(l => <button key={l.path} onClick={() => { onNavigate(l.path); setOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-stone-100">{l.label}</button>)}</div>}
      </div>
    </nav>
  );
}

function Footer() {
  const contacts: [LucideIcon, string][] = [[MapPin, "Leeds, UK"], [Mail, "hello@onpilateslane.co.uk"], [Instagram, "@on.pilates.lane"]];
  return (
    <footer style={{ background: BEIGE_L, borderTop: `1px solid #e8ddd0` }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div><h3 className="text-2xl font-serif font-light mb-2 text-gray-800">On Pilates Lane</h3><p className="text-xs tracking-widest text-gray-400 mb-4">OPL · LEEDS</p><p className="text-gray-600 text-sm">Premium Pilates in Leeds, led by Bibi Behbehani.</p></div>
          <div><h4 className="font-medium text-gray-800 mb-4 text-sm">Contact</h4><div className="space-y-3">{contacts.map(([Icon, text], i) => <div key={i} className="flex items-start gap-3 text-sm text-gray-600"><Icon size={16} style={{ color: ROSE_D }} /><span>{text}</span></div>)}</div></div>
          <div><h4 className="font-medium text-gray-800 mb-4 text-sm">Studio Hours</h4><div className="space-y-2 text-sm text-gray-600">{[["Mon – Fri", "6am – 8pm"], ["Saturday", "8am – 4pm"], ["Sunday", "Closed"]].map(([d, t]) => <div key={d} className="flex justify-between"><span>{d}</span><span>{t}</span></div>)}</div></div>
        </div>
        <div className="mt-12 pt-8 text-center text-xs text-gray-400" style={{ borderTop: `1px solid #e8ddd0` }}>© 2026 On Pilates Lane. All rights reserved.</div>
      </div>
    </footer>
  );
}

function Home({ onNavigate, onOpenChat }: { onNavigate: (p: string) => void; onOpenChat: () => void }) {
  const testimonials = [
    { text: "Bibi's sessions changed the way I move. I feel so much more in tune with my body.", author: "Sarah M.", location: "Leeds" },
    { text: "The attention to detail and personalised approach makes every session worthwhile.", author: "James L.", location: "Leeds" },
    { text: "I've tried many studios but OPL is on another level. My posture has improved dramatically.", author: "Emma K.", location: "Headingley" },
  ];
  const features: [LucideIcon, string, string][] = [
    [Heart, "Expert Instruction", "Led by Bibi Behbehani, bringing precision and passion to every session."],
    [Users, "Personalised Approach", "Small class sizes ensure individual attention and customised guidance."],
    [Sparkles, "Premium Experience", "A calming studio space designed for focused, mindful practice in Leeds."]
  ];
  return (
    <div style={{ background: BEIGE_L }}>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/background.png" alt="Pilates Studio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-stone-50/50 to-white/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-medium tracking-[0.3em] text-gray-600 mb-6 uppercase">Leeds · UK</p>
          <h1 className="text-6xl md:text-8xl font-serif font-light text-gray-900 mb-4 leading-tight">Move with<br /><span style={{ color: "#3e2723" }}>intention</span></h1>
          <p className="text-xl text-gray-700 mb-12">Premium Pilates in Leeds</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate("/private")} className="px-8 py-4 text-white rounded-full shadow-lg flex items-center justify-center gap-2 group transition-all" style={{ background: "#3e2723" }} onMouseEnter={e => e.currentTarget.style.background = "#2e1a17"} onMouseLeave={e => e.currentTarget.style.background = "#3e2723"}><span>Book Private Session</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
            <button onClick={() => onNavigate("/classes")} className="px-8 py-4 bg-white text-gray-800 rounded-full shadow border border-stone-200 hover:bg-stone-50 transition-all">View Classes</button>
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16"><h2 className="text-5xl font-serif font-light text-gray-800 mb-4">Why OPL?</h2><p className="text-gray-500">Thoughtful Pilates for every body and every level</p></div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(([Icon, title, desc], i) => (
              <div key={i} className="rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{ background: BEIGE_L }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: "#e8ddd0" }}><Icon size={26} style={{ color: ROSE_D }} /></div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6" style={{ background: BEIGE_L }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16"><h2 className="text-5xl font-serif font-light text-gray-800 mb-4">What Clients Say</h2></div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="pt-4" style={{ borderTop: `1px solid #e8ddd0` }}><p className="font-medium text-gray-800 text-sm">{t.author}</p><p className="text-xs text-gray-400">{t.location}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-light text-gray-800 mb-4">Have Questions?</h2>
          <p className="text-gray-500 mb-8">Our assistant can help with schedules, bookings, and studio info.</p>
          <button onClick={onOpenChat} className="px-8 py-4 text-white rounded-full shadow-lg inline-flex items-center gap-2 transition-all" style={{ background: ROSE }} onMouseEnter={e => e.currentTarget.style.background = ROSE_D} onMouseLeave={e => e.currentTarget.style.background = ROSE}><span>Chat with us</span><ArrowRight size={18} /></button>
        </div>
      </section>
    </div>
  );
}

function About() {
  const values: [LucideIcon, string, string][] = [
    [Heart, "Mindful Movement", "Every exercise is an opportunity to connect with your body."],
    [GraduationCap, "Thoughtful Teaching", "Instruction that's careful, considered, and tailored to how you move."],
    [Sparkles, "Individual Focus", "Personalised attention to help you achieve your unique goals."],
    [Target, "Sustainable Practice", "Building strength and flexibility that supports your daily life."]
  ];
  return (
    <div style={{ background: BEIGE_L }}>
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16"><p className="text-xs tracking-[0.3em] text-gray-400 mb-4 uppercase">About</p><h1 className="text-6xl font-serif font-light text-gray-800 mb-6">On Pilates Lane</h1></div>
          <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm mb-16">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/3"><div className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"><img src="/bibi.png" alt="Bibi Behbehani - Pilates Instructor" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div></div>
              <div className="md:w-2/3 space-y-5">
                <h2 className="text-3xl font-serif font-light text-gray-800">Meet Bibi Behbehani</h2>
                <p className="text-gray-600 text-sm leading-relaxed">Bibi brings warmth, precision, and a genuine passion for movement to every session. Her teaching style is hands-on, attentive, and always tailored to you.</p>
                <p className="text-gray-600 text-sm leading-relaxed">A medical student with a deep love for the body and how it moves, Bibi understands how to help you get the most out of your practice.</p>
                <p className="text-gray-600 text-sm leading-relaxed">She founded On Pilates Lane to create a studio where people feel seen, supported, and genuinely challenged.</p>
                <p className="text-xs text-gray-400 italic pl-4" style={{ borderLeft: `2px solid #e8ddd0` }}>OPL is a movement and wellness studio. Sessions are not a substitute for medical treatment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16"><h2 className="text-4xl font-serif font-light text-gray-800 mb-4">Our Values</h2></div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map(([Icon, title, desc], i) => (
              <div key={i} className="rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{ background: BEIGE_L }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: "#e8ddd0" }}><Icon size={26} style={{ color: ROSE_D }} /></div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Classes() {
  const [classes, setClasses] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [avail, setAvail] = useState<Record<number, any>>({});
  const [bookingClass, setBookingClass] = useState<any>(null);
  const [clientId, setClientId] = useState("");
  const [selectedStudio, setSelectedStudio] = useState("");
  const [bookMsg, setBookMsg] = useState("");
  const [booking, setBooking] = useState(false);
  const lc: Record<string, string> = { beginner: "#d1fae5", intermediate: "#dbeafe", advanced: "#ede9fe", "all levels": "#fef9c3" };
  const lt: Record<string, string> = { beginner: "#065f46", intermediate: "#1e40af", advanced: "#5b21b6", "all levels": "#713f12" };
  useEffect(() => {
    const load = async () => {
      try {
        const [cl, st] = await Promise.all([
          fetch(`${API}/api/clients`, { headers: authHeadersNoJson() }).then(r => r.json()),
          fetch(`${API}/api/studios`, { headers: authHeadersNoJson() }).then(r => r.json())
        ]);
        setClients(cl); setStudios(st);
      } catch (e) { console.error(e); }
    }; load();
  }, []);
  useEffect(() => {
    if (!selectedStudio) return;
    const loadClasses = async () => {
      setLoading(true);
      try {
        const cr = await fetch(`${API}/api/classes`, { headers: authHeadersNoJson() }).then(r => r.json());
        setClasses(cr);
        const av: Record<number, any> = {};
        await Promise.all(cr.map(async (c: any) => { try { const r = await fetch(`${API}/api/classes/${c.id}/availability`, { headers: authHeadersNoJson() }); av[c.id] = await r.json(); } catch { } }));
        setAvail(av);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }; loadClasses();
  }, [selectedStudio]);
  const handleBook = async () => {
    if (!clientId) { setBookMsg("Please select a client."); return; }
    setBooking(true); setBookMsg("");
    try {
      const res = await fetch(`${API}/api/bookings`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ client_id: parseInt(clientId), class_id: bookingClass.id, status: "confirmed" }) });
      const data = await res.json();
      if (!res.ok) { setBookMsg(data.detail || "Booking failed."); return; }
      setBookMsg(data.status === "waitlist" ? "Added to waitlist!" : "Booking confirmed! ✓");
      const r = await fetch(`${API}/api/classes/${bookingClass.id}/availability`, { headers: authHeadersNoJson() });
      const newAv = await r.json();
      setAvail(p => ({ ...p, [bookingClass.id]: newAv }));
      setTimeout(() => { setBookingClass(null); setBookMsg(""); setClientId(""); }, 2000);
    } catch { setBookMsg("Failed. Please try again."); } finally { setBooking(false); }
  };
  const inp = "w-full px-3 py-2 rounded-xl border border-stone-200 outline-none text-sm bg-white";
  const filteredClasses = selectedStudio ? classes.filter(c => c.studio_id === parseInt(selectedStudio)) : [];
  return (
    <div style={{ background: BEIGE_L }} className="min-h-screen">
      {bookingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md mx-4">
            <h2 className="text-2xl font-serif font-light text-gray-800 mb-1">Book Class</h2>
            <p className="text-sm text-gray-500 mb-5">{bookingClass.name} · {bookingClass.day_of_week} {bookingClass.time}</p>
            <div className="mb-5 px-4 py-3 rounded-2xl text-sm bg-stone-50">
              <div className="font-medium text-gray-700 mb-1">Location</div>
              <div className="text-gray-600 text-xs">{studios.find(s => s.id === bookingClass.studio_id)?.name || "Loading..."}</div>
            </div>
            {avail[bookingClass.id] && <div className="mb-5 px-4 py-3 rounded-2xl text-sm" style={{ background: BEIGE_L }}><span className="font-medium text-gray-700">{avail[bookingClass.id].available_spots}</span><span className="text-gray-500"> of {avail[bookingClass.id].capacity} spots left</span>{avail[bookingClass.id].is_full && <span className="ml-2 text-yellow-600 font-medium">· Waitlist</span>}</div>}
            <label className="block text-xs font-medium text-gray-500 mb-1">Select Client *</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} className={inp}>
              <option value="">Choose a client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
            </select>
            {bookMsg && <p className={`mt-4 text-sm text-center font-medium ${bookMsg.includes("✓") || bookMsg.includes("waitlist") ? "text-green-600" : "text-red-400"}`}>{bookMsg}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={handleBook} disabled={booking} className="flex-1 py-3 text-white rounded-full text-sm font-medium disabled:opacity-50" style={{ background: ROSE }} onMouseEnter={e => e.currentTarget.style.background = ROSE_D} onMouseLeave={e => e.currentTarget.style.background = ROSE}>{booking ? "Booking…" : "Confirm"}</button>
              <button onClick={() => { setBookingClass(null); setBookMsg(""); }} className="flex-1 py-3 bg-stone-100 text-gray-700 rounded-full text-sm hover:bg-stone-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-4 uppercase">OPL</p>
            <h1 className="text-6xl font-serif font-light text-gray-800 mb-6">Class Schedule</h1>
            <p className="text-gray-500">Small group classes at Leeds leisure centres</p>
          </div>
          <div className="mb-12 max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Location</label>
            <select value={selectedStudio} onChange={e => setSelectedStudio(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none text-sm bg-white">
              <option value="">Choose a Location</option>
              {studios.map(s => <option key={s.id} value={s.id}>{s.name} - {s.city}</option>)}
            </select>
          </div>
          {loading ? <div className="text-center text-gray-400 py-20">Loading classes…</div> : (
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {filteredClasses.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-gray-400">{selectedStudio ? "No classes at this location yet" : "Please select a location to see classes"}</div>
              ) : (
                filteredClasses.map((c, i) => {
                  const a = avail[c.id]; const full = a?.is_full; const lvl = (c.level || "").toLowerCase();
                  const studio = studios.find(s => s.id === c.studio_id);
                  return (
                    <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div><h3 className="text-2xl font-serif font-light text-gray-800 mb-2">{c.name}</h3><span className="inline-block px-3 py-1 text-xs rounded-full font-medium" style={{ background: lc[lvl] || "#f3f4f6", color: lt[lvl] || "#374151" }}>{c.level}</span></div>
                        <div className="text-right">{a && <div className={`text-xs font-medium mb-1 ${full ? "text-yellow-500" : "text-green-600"}`}>{full ? "Waitlist only" : `${a.available_spots} spots left`}</div>}<div className="text-xs text-gray-400">Cap. {c.capacity}</div></div>
                      </div>
                      {studio && <div className="mb-4 px-3 py-2 rounded-lg bg-stone-50"><div className="text-xs font-medium text-gray-500 mb-1">Location</div><div className="text-sm text-gray-700">{studio.name}</div></div>}
                      <div className="flex gap-4 mb-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Clock size={14} style={{ color: ROSE_D }} />{c.duration_minutes} min</span>
                        <span className="flex items-center gap-1"><Users size={14} style={{ color: ROSE_D }} />Max {c.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 pt-4" style={{ borderTop: `1px solid #e8ddd0` }}><Calendar size={15} style={{ color: ROSE_D }} />{c.day_of_week} at {c.time}</div>
                      <button onClick={() => setBookingClass(c)} className="w-full mt-6 py-3 text-white rounded-full text-sm font-medium transition-all" style={{ background: full ? "#d1d5db" : ROSE }} onMouseEnter={e => { if (!full) e.currentTarget.style.background = ROSE_D; }} onMouseLeave={e => { if (!full) e.currentTarget.style.background = ROSE; }}>{full ? "Join Waitlist" : "Book This Class"}</button>
                    </div>
                  );
                })
              )}
            </div>
          )}
          <div className="rounded-3xl p-10 text-center" style={{ background: "#e8ddd0" }}>
            <h2 className="text-3xl font-serif font-light text-gray-800 mb-3">Class Packages</h2>
            <p className="text-gray-600 text-sm mb-10">Save when you commit to your practice</p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[["5", "£120", "Save £20"], ["10", "£230", "Save £50"], ["20", "£440", "Save £120"]].map(([n, p, s], i) => (
                <div key={i} className="bg-white rounded-2xl p-6" style={i === 1 ? { outline: `2px solid ${ROSE_D}` } : {}}>
                  {i === 1 && <div className="text-xs font-semibold tracking-widest mb-3" style={{ color: ROSE_D }}>POPULAR</div>}
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", preferredDate: "", preferredTime: "", experience: "", goals: "", injuries: "" });
  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const hs = async () => {
    if (!form.name || !form.email || !form.phone || !form.preferredDate || !form.preferredTime) return;
    try {
      const res = await fetch(`${API}/api/private-sessions`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, preferred_date: form.preferredDate, preferred_time: form.preferredTime, experience: form.experience, goals: form.goals, injuries: form.injuries }) });
      if (!res.ok) { const error = await res.json(); alert(error.detail || "Failed to submit request"); return; }
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", preferredDate: "", preferredTime: "", experience: "", goals: "", injuries: "" }); }, 3000);
    } catch (err) { console.error(err); alert("Failed to submit. Please try again."); }
  };
  const ic = "w-full px-4 py-3 rounded-xl border border-stone-200 outline-none text-sm bg-white";
  const packages = [{ price: "£25", label: "Single Session", sub: "60 minutes · max 2 people", highlight: false }, { price: "£65", label: "3 Session Package", sub: "Save £10 · max 2 people per session", highlight: false }, { price: "£105", label: "5 Session Package", sub: "Save £20 · max 2 people per session", highlight: true }];
  return (
    <div style={{ background: BEIGE_L }} className="min-h-screen">
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14"><p className="text-xs tracking-[0.3em] text-gray-400 mb-4 uppercase">One-on-One</p><h1 className="text-6xl font-serif font-light text-gray-800 mb-6">Private Sessions</h1><p className="text-gray-500">Tailored instruction for your unique needs and goals</p></div>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-light text-gray-800 mb-5">What to Expect</h3>
              <ul className="space-y-3 text-sm text-gray-700">{["Comprehensive movement assessment", "Personalised exercise programming", "Hands-on guidance & coaching", "Flexible scheduling", "Max 2 people per session", "Free body analysis included"].map((t, i) => <li key={i} className="flex items-start gap-3"><Check size={18} style={{ color: ROSE_D }} className="mt-0.5 flex-shrink-0" /><span>{t}{i === 5 && <span className="ml-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#e8ddd0", color: ROSE_D }}>FREE</span>}</span></li>)}</ul>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-light text-gray-800 mb-2">Pricing</h3>
              <div className="space-y-4">{packages.map(({ price, label, sub, highlight }, i, arr) => (<div key={i} className={`py-4 ${highlight ? "px-4 -mx-4 rounded-2xl" : ""}`} style={{ ...(highlight ? { background: BEIGE_L } : {}), ...(!highlight && i < arr.length - 1 ? { borderBottom: `1px solid #e8ddd0` } : {}) }}><div className="flex justify-between items-baseline mb-1"><span className="text-gray-700 font-medium text-sm">{label}</span><span className="text-xl text-gray-800">{price}</span></div><p className="text-xs text-gray-400">{sub}</p>{highlight && <span className="inline-block mt-2 text-xs font-semibold tracking-widest px-2 py-0.5 rounded-full" style={{ background: "#e8ddd0", color: ROSE_D }}>POPULAR</span>}</div>))}</div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-14 shadow-sm">
            <h2 className="text-3xl font-serif font-light text-gray-800 mb-10 text-center">Book Your Session</h2>
            {submitted ? (
              <div className="text-center py-12"><div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#e8ddd0" }}><Check size={32} style={{ color: ROSE_D }} /></div><h3 className="text-2xl font-medium text-gray-800 mb-2">Request Received!</h3><p className="text-gray-500 text-sm">We'll be in touch shortly to confirm your session.</p></div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">{[["text", "name", "Full Name *", "Your name"], ["email", "email", "Email *", "your@email.com"]].map(([type, name, label, ph]) => <div key={name}><label className="block text-xs font-medium text-gray-600 mb-2">{label}</label><input type={type} name={name} value={(form as any)[name]} onChange={hc} placeholder={ph} className={ic} /></div>)}</div>
                <div><label className="block text-xs font-medium text-gray-600 mb-2">Phone *</label><input type="tel" name="phone" value={form.phone} onChange={hc} placeholder="07XXX XXXXXX" className={ic} /></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-medium text-gray-600 mb-2">Preferred Date *</label><input type="date" name="preferredDate" value={form.preferredDate} onChange={hc} className={ic} /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-2">Preferred Time *</label><select name="preferredTime" value={form.preferredTime} onChange={hc} className={ic}><option value="">Select a time</option><option value="morning">Morning (6am–12pm)</option><option value="afternoon">Afternoon (12pm–5pm)</option><option value="evening">Evening (5pm–8pm)</option></select></div>
                </div>
                <div><label className="block text-xs font-medium text-gray-600 mb-2">Experience Level</label><select name="experience" value={form.experience} onChange={hc} className={ic}><option value="">Select level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-2">Goals & Objectives</label><textarea name="goals" value={form.goals} onChange={hc} rows={4} className={`${ic} resize-none`} placeholder="What would you like to achieve?" /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-2">Injuries or Health Considerations</label><textarea name="injuries" value={form.injuries} onChange={hc} rows={3} className={`${ic} resize-none`} placeholder="Any relevant information (optional)" /></div>
                <button onClick={hs} className="w-full py-4 text-white rounded-full font-medium shadow-lg transition-all" style={{ background: ROSE }} onMouseEnter={e => e.currentTarget.style.background = ROSE_D} onMouseLeave={e => e.currentTarget.style.background = ROSE}>Submit Booking Request</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editClient, setEditClient] = useState<any>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [viewClientDetails, setViewClientDetails] = useState<any>(null);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", age: "", package_type: "" });
  const fetch_ = async () => { try { setLoading(true); const r = await fetch(`${API}/api/clients`, { headers: authHeadersNoJson() }); if (!r.ok) throw new Error(); setClients(await r.json()); setError(null); } catch { setError("Could not connect to backend."); } finally { setLoading(false); } };
  useEffect(() => { fetch_(); }, []);
  const handleSave = async () => {
    if (!newClient.name || !newClient.email) return;
    try {
      const url = editClient ? `${API}/api/clients/${editClient.id}` : `${API}/api/clients`;
      const res = await fetch(url, { method: editClient ? "PUT" : "POST", headers: authHeaders(), body: JSON.stringify({ ...newClient, age: newClient.age ? parseInt(newClient.age) : null }) });
      if (!res.ok) { const e = await res.json(); alert(e.detail); return; }
      setShowAdd(false); setEditClient(null); setNewClient({ name: "", email: "", phone: "", age: "", package_type: "" }); fetch_();
    } catch { alert("Failed to save client."); }
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this client and all their bookings?")) return;
    setDeleting(id); try { await fetch(`${API}/api/clients/${id}`, { method: "DELETE", headers: authHeadersNoJson() }); fetch_(); } catch { alert("Failed."); } finally { setDeleting(null); }
  };
  const viewProfile = async (id: number) => { try { const res = await fetch(`${API}/api/clients/${id}`, { headers: authHeadersNoJson() }); setViewClientDetails(await res.json()); } catch { alert("Failed."); } };
  const filtered = clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));
  const ic = "w-full px-3 py-2 rounded-xl border border-stone-200 outline-none text-sm bg-white";
  return (
    <div style={{ background: BEIGE_L }} className="min-h-screen">
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div><h1 className="text-4xl font-serif font-light text-gray-800 mb-1">Clients</h1><p className="text-gray-500 text-sm">Manage your client database</p></div>
            <button onClick={() => { setEditClient(null); setNewClient({ name: "", email: "", phone: "", age: "", package_type: "" }); setShowAdd(true); }} className="mt-4 md:mt-0 px-6 py-3 text-white rounded-full inline-flex items-center gap-2 text-sm" style={{ background: ROSE }} onMouseEnter={e => e.currentTarget.style.background = ROSE_D} onMouseLeave={e => e.currentTarget.style.background = ROSE}><UserPlus size={16} /><span>Add Client</span></button>
          </div>
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-serif font-light text-gray-800 mb-6">{editClient ? "Edit Client" : "New Client"}</h2>
                <div className="space-y-4">
                  {[["text", "name", "Full Name *"], ["email", "email", "Email *"], ["tel", "phone", "Phone"], ["number", "age", "Age"]].map(([type, field, label]) => (
                    <div key={field}><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label><input type={type} value={(newClient as any)[field]} onChange={e => setNewClient({ ...newClient, [field]: e.target.value })} className={ic} /></div>
                  ))}
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Package</label><select value={newClient.package_type} onChange={e => setNewClient({ ...newClient, package_type: e.target.value })} className={ic}><option value="">Select package</option><option value="drop-in">Drop-in</option><option value="10-class">10-class</option><option value="monthly">Monthly</option></select></div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSave} className="flex-1 py-3 text-white rounded-full text-sm font-medium" style={{ background: ROSE }} onMouseEnter={e => e.currentTarget.style.background = ROSE_D} onMouseLeave={e => e.currentTarget.style.background = ROSE}>{editClient ? "Save Changes" : "Add Client"}</button>
                  <button onClick={() => { setShowAdd(false); setEditClient(null); }} className="flex-1 py-3 bg-stone-100 text-gray-700 rounded-full text-sm hover:bg-stone-200">Cancel</button>
                </div>
              </div>
            </div>
          )}
          {viewClientDetails && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-serif font-light text-gray-800 mb-6">Client Profile</h2>
                <div className="space-y-3 text-sm">{[["Client ID", `#${viewClientDetails.id}`], ["Name", viewClientDetails.name], ["Email", viewClientDetails.email], ["Phone", viewClientDetails.phone || "—"], ["Age", viewClientDetails.age || "—"], ["Package", viewClientDetails.package_type || "—"], ["Joined", viewClientDetails.join_date ? new Date(viewClientDetails.join_date).toLocaleDateString("en-GB") : "—"]].map(([l, v]) => (<div key={l} className="flex justify-between py-2" style={{ borderBottom: `1px solid #e8ddd0` }}><span className="text-gray-500">{l}:</span><span className="font-medium text-gray-800">{v}</span></div>))}</div>
                <button onClick={() => setViewClientDetails(null)} className="w-full mt-6 py-3 bg-stone-100 text-gray-700 rounded-full text-sm hover:bg-stone-200">Close</button>
              </div>
            </div>
          )}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6" style={{ borderBottom: `1px solid #e8ddd0` }}><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input type="text" placeholder="Search clients…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 outline-none text-sm" /></div></div>
            {loading ? <div className="p-12 text-center text-gray-400 text-sm">Loading clients…</div> : error ? <div className="p-12 text-center text-red-400 text-sm">{error}</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: BEIGE_L }}><tr>{["Name", "Contact", "Package", "Joined", "Actions"].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody>{filtered.map((c: any) => (
                    <tr key={c.id} className="hover:bg-stone-50 transition-colors" style={{ borderTop: `1px solid #e8ddd0` }}>
                      <td className="px-6 py-4 font-medium text-gray-800">{c.name}</td>
                      <td className="px-6 py-4"><div className="text-gray-600">{c.email}</div><div className="text-gray-400 text-xs">{c.phone}</div></td>
                      <td className="px-6 py-4 text-gray-500 capitalize">{c.package_type || "—"}</td>
                      <td className="px-6 py-4 text-gray-500">{c.join_date ? new Date(c.join_date).toLocaleDateString("en-GB") : "—"}</td>
                      <td className="px-6 py-4"><div className="flex gap-2">
                        <button onClick={() => viewProfile(c.id)} className="px-3 py-1 text-xs rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center gap-1"><Eye size={12} />View</button>
                        <button onClick={() => { setEditClient(c); setNewClient({ name: c.name, email: c.email, phone: c.phone || "", age: c.age || "", package_type: c.package_type || "" }); setShowAdd(true); }} className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-400 hover:bg-blue-100">Edit</button>
                        <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id} className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-400 hover:bg-red-100 disabled:opacity-40">{deleting === c.id ? "…" : "Delete"}</button>
                      </div></td>
                    </tr>
                  ))}{filtered.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">No clients found</td></tr>}</tbody>
                </table>
              </div>
            )}
            <div className="p-5 text-center text-xs text-gray-400" style={{ borderTop: `1px solid #e8ddd0` }}>{filtered.length} client{filtered.length !== 1 ? "s" : ""}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewBooking, setViewBooking] = useState<any>(null);
  const fetch_ = async () => { try { setLoading(true); const r = await fetch(`${API}/api/bookings`, { headers: authHeadersNoJson() }); if (!r.ok) throw new Error(); setBookings(await r.json()); setError(null); } catch { setError("Could not connect to backend."); } finally { setLoading(false); } };
  useEffect(() => { fetch_(); }, []);
  const updateStatus = async (id: number, status: string) => { try { const b = bookings.find(b => b.id === id); await fetch(`${API}/api/bookings/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ client_id: b.client_id, class_id: b.class_id, status }) }); fetch_(); } catch { alert("Failed."); } };
  const del = async (id: number) => { if (!confirm("Delete this booking?")) return; try { await fetch(`${API}/api/bookings/${id}`, { method: "DELETE", headers: authHeadersNoJson() }); fetch_(); } catch { alert("Failed."); } };
  const viewDetails = async (id: number) => { try { const res = await fetch(`${API}/api/bookings/${id}`, { headers: authHeadersNoJson() }); setViewBooking(await res.json()); } catch { alert("Failed."); } };
  const ss: Record<string, React.CSSProperties> = { confirmed: { background: "#d1fae5", color: "#065f46" }, waitlist: { background: "#fef9c3", color: "#713f12" }, cancelled: { background: "#fee2e2", color: "#991b1b" } };
  return (
    <div style={{ background: BEIGE_L }} className="min-h-screen">
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div><h1 className="text-4xl font-serif font-light text-gray-800 mb-1">Bookings</h1><p className="text-gray-500 text-sm">Manage all class bookings</p></div>
            <button onClick={fetch_} className="px-4 py-2 text-sm rounded-full bg-white border border-stone-200 text-gray-600 hover:bg-stone-50">Refresh</button>
          </div>
          {viewBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-serif font-light text-gray-800 mb-6">Booking Details</h2>
                <div className="space-y-3 text-sm">{[["Booking ID", `#${viewBooking.id}`], ["Client", viewBooking.client_id], ["Class", viewBooking.class_id], ["Status", viewBooking.status], ["Date", viewBooking.booking_date ? new Date(viewBooking.booking_date).toLocaleDateString("en-GB") : "—"]].map(([l, v]) => (<div key={l} className="flex justify-between py-2" style={{ borderBottom: `1px solid #e8ddd0` }}><span className="text-gray-500">{l}:</span><span className="font-medium text-gray-800">{v}</span></div>))}</div>
                <button onClick={() => setViewBooking(null)} className="w-full mt-6 py-3 bg-stone-100 text-gray-700 rounded-full text-sm hover:bg-stone-200">Close</button>
              </div>
            </div>
          )}
          {loading ? <div className="bg-white rounded-3xl p-12 text-center text-gray-400 text-sm shadow-sm">Loading bookings…</div> : error ? <div className="bg-white rounded-3xl p-12 text-center text-red-400 text-sm shadow-sm">{error}</div> : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm"><Calendar className="mx-auto mb-4" size={44} style={{ color: "#e8ddd0" }} /><h3 className="text-xl font-medium text-gray-800 mb-2">No bookings yet</h3><p className="text-gray-400 text-sm">Bookings will appear here once created.</p></div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: BEIGE_L }}><tr>{["ID", "Client", "Class", "Date", "Status", "Actions"].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody>{bookings.map(b => (
                    <tr key={b.id} className="hover:bg-stone-50 transition-colors" style={{ borderTop: `1px solid #e8ddd0` }}>
                      <td className="px-6 py-4 text-gray-400">#{b.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{b.client?.name || `Client #${b.client_id}`}<div className="text-xs text-gray-400">{b.client?.email}</div></td>
                      <td className="px-6 py-4 text-gray-600">{b.pilates_class?.name || `Class #${b.class_id}`}<div className="text-xs text-gray-400">{b.pilates_class?.day_of_week} {b.pilates_class?.time}</div></td>
                      <td className="px-6 py-4 text-gray-500">{b.booking_date ? new Date(b.booking_date).toLocaleDateString("en-GB") : "—"}</td>
                      <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs font-medium capitalize" style={ss[b.status?.toLowerCase()] || ss.confirmed}>{b.status?.toLowerCase()}</span></td>
                      <td className="px-6 py-4"><div className="flex gap-2">
                        <button onClick={() => viewDetails(b.id)} className="px-3 py-1 text-xs rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center gap-1"><Eye size={12} />View</button>
                        {b.status?.toLowerCase() !== "confirmed" && <button onClick={() => updateStatus(b.id, "confirmed")} className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-600 hover:bg-green-100">Confirm</button>}
                        {b.status?.toLowerCase() !== "cancelled" && <button onClick={() => updateStatus(b.id, "cancelled")} className="px-3 py-1 text-xs rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100">Cancel</button>}
                        <button onClick={() => del(b.id)} className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-400 hover:bg-red-100">Delete</button>
                      </div></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="p-5 text-center text-xs text-gray-400" style={{ borderTop: `1px solid #e8ddd0` }}>{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function formatMsg(text = "") {
  const lines = String(text).split("\n"); const els: React.ReactNode[] = []; let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.includes("|") && lines[i + 1] && lines[i + 1].includes("---")) {
      const headers = line.split("|").map(h => h.trim()).filter(Boolean); i += 2; const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) { rows.push(lines[i].split("|").map(c => c.trim()).filter(Boolean)); i++; }
      els.push(<div key={"t" + i} className="overflow-x-auto my-2 rounded-xl border" style={{ borderColor: "#e8ddd0" }}><table className="w-full text-xs"><thead style={{ background: "#f5f0ea" }}><tr>{headers.map((h, j) => <th key={j} className="px-3 py-2 text-left font-medium text-gray-600">{h.replace(/\*\*/g, "")}</th>)}</tr></thead><tbody>{rows.map((r, j) => <tr key={j} style={{ borderTop: "1px solid #e8ddd0" }}>{r.map((c, k) => <td key={k} className="px-3 py-2 text-gray-700">{c.replace(/\*\*/g, "")}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((p, j) => p.startsWith("**") && p.endsWith("**") ? <strong key={j}>{p.slice(2, -2)}</strong> : <span key={j}>{p}</span>);
    if (line.trim()) els.push(<p key={"p" + i} className="mb-1 whitespace-pre-wrap">{rendered}</p>);
    i++;
  }
  return els;
}

function cleanAssistantReply(text = "") {
  return String(text).replace(/^\s{0,3}#{1,6}\s+/gm, "").replace(/^\s*#\d+\s*/gm, "").trim();
}

function Chatbot({ forceOpen }: { forceOpen: boolean }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [msgs, setMsgs] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const suggestions = ["Book a private session", "Show classes", "Check availability", "How do waitlists work?"];
  useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open, expanded]);
  const send = async (txt: string) => {
    if (!txt.trim() || loading) return;
    setMsgs(p => [...p, { role: "user", content: txt }]); setInput(""); setLoading(true);
    try {
      const res = await fetch(`${CHAT_URL}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: txt }) });
      const data = await res.json();
      setMsgs(p => [...p, { role: "assistant", content: cleanAssistantReply(data.reply ?? "") }]);
    } catch { setMsgs(p => [...p, { role: "assistant", content: "Sorry, something went wrong. Please email hello@onpilateslane.co.uk" }]); }
    finally { setLoading(false); }
  };
  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 w-16 h-16 text-white rounded-full shadow-xl flex items-center justify-center z-50 transition-all hover:scale-110" style={{ background: ROSE }} onMouseEnter={e => e.currentTarget.style.background = ROSE_D} onMouseLeave={e => e.currentTarget.style.background = ROSE}>
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col bg-white shadow-2xl overflow-hidden" style={{ width: expanded ? "660px" : "400px", maxWidth: "calc(100vw - 2rem)", height: expanded ? "75vh" : "580px", borderRadius: "20px", border: "1px solid #e8ddd0", transition: "width 0.25s ease, height 0.25s ease" }}>
          <div className="flex items-center justify-between px-6 py-4 text-white" style={{ background: `linear-gradient(135deg,${ROSE} 0%,${ROSE_D} 100%)` }}>
            <div><h3 className="font-medium">OPL Assistant</h3><p className="text-xs opacity-80">How can we help you today?</p></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setExpanded(v => !v)} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-sm">{expanded ? "↙" : "↗"}</button>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"><X size={16} color="white" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {msgs.length === 0 && <div className="text-center text-gray-400 text-sm"><p className="mb-5">Ask me about classes, bookings, or our studio.</p><div className="flex flex-wrap gap-2 justify-center">{suggestions.map((s, i) => <button key={i} onClick={() => send(s)} className="px-4 py-2 text-xs rounded-full transition-colors" style={{ background: BEIGE_L, color: "#6b7280" }} onMouseEnter={e => e.currentTarget.style.background = "#e8ddd0"} onMouseLeave={e => e.currentTarget.style.background = BEIGE_L}>{s}</button>)}</div></div>}
            {msgs.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed" style={m.role === "user" ? { background: ROSE, color: "white" } : { background: BEIGE_L, color: "#374151" }}>{m.role === "assistant" ? formatMsg(m.content) : m.content}</div></div>)}
            {loading && <div className="flex justify-start"><div className="px-4 py-3 rounded-2xl" style={{ background: BEIGE_L }}><Loader2 size={18} style={{ color: ROSE_D }} className="animate-spin" /></div></div>}
            <div ref={endRef} />
          </div>
          <div className="p-4" style={{ borderTop: `1px solid #e8ddd0` }}>
            <p className="text-xs text-gray-400 text-center mb-3">For general guidance only. Not medical advice.</p>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(input); }} placeholder="Type your message…" className="flex-1 px-4 py-3 rounded-full border border-stone-200 outline-none text-sm" disabled={loading} />
              <button onClick={() => send(input)} disabled={loading || !input.trim()} className="w-11 h-11 text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40" style={{ background: ROSE }} onMouseEnter={e => e.currentTarget.style.background = ROSE_D} onMouseLeave={e => e.currentTarget.style.background = ROSE}><Send size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// App Root
export default function App() {
  const [path, setPath] = useState("/");
  const [chatOpen, setChatOpen] = useState(false);
  const [token, setToken] = useState(getToken());

  const navigate = (p: string) => { setPath(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleLogin = (t: string, r: string) => {
    setToken(t);
    sessionStorage.setItem("opl_role", r);
    navigate("/clients");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("opl_token");
    sessionStorage.removeItem("opl_role");
    setToken(null);
    navigate("/");
  };

  const isLoggedIn = !!token;

  const adminPages = ["/clients", "/bookings"];
  if (adminPages.includes(path) && !isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: BEIGE_L }}>
        <Navbar currentPath={path} onNavigate={navigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main className="flex-grow pt-20"><LoginPage onLogin={handleLogin} /></main>
        <Footer />
      </div>
    );
  }

  const pages: Record<string, React.ReactNode> = {
    "/": <Home onNavigate={navigate} onOpenChat={() => setChatOpen(true)} />,
    "/about": <About />,
    "/classes": <Classes />,
    "/private": <Private />,
    "/login": <LoginPage onLogin={handleLogin} />,
    "/clients": <Clients />,
    "/bookings": <Bookings />,
  };
  return (
    <div className="min-h-screen flex flex-col" style={{ background: BEIGE_L }}>
      <Navbar currentPath={path} onNavigate={navigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="flex-grow pt-20">{pages[path] || pages["/"]}</main>
      <Footer />
      <Chatbot forceOpen={chatOpen} />
    </div>
  );
}// force redeploy
// trigger frontend deploy
