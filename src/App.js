import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HashRouter, Routes, Route, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

/* ───────────── config (edit these) ───────────── */
const CLOUD = {
  name: process.env.REACT_APP_CLOUDINARY_CLOUD || 'dm9gg8yss',
  preset: process.env.REACT_APP_CLOUDINARY_PRESET || 'images',
};

// Paste your deployed Apps Script Web App URL (ends with /exec)
const API_URL = process.env.REACT_APP_API_URL || 'https://script.google.com/macros/s/AKfycbx5oHe1gQRvH2ysIg0sOaisaFAbWLe-cliGwItVNge8LkiQcs6-6oJD8DLk2KB6YLXQ/exec';

// Save your poster image as  public/appvia-poster.jpg  and it appears on the home page.
const POSTER = `${process.env.PUBLIC_URL || ''}/appvia-poster.jpg`;

/*
  PHOTOS: real photographs used as page backgrounds and side images.
  - Replace any link with your own image (Cloudinary link, or a file in /public like '/photos/team.jpg').
  - Set a value to '' to turn that photo off.
  - If a photo fails to load, the site automatically shows a built-in illustration instead, so nothing ever looks broken.
*/
const unsplash = (id, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const PHOTOS = {
  hero: unsplash('photo-1551288049-bebda4e38f71', 1800),      // analytics dashboard
  workspace: unsplash('photo-1460925895917-afdab827c52f'),    // laptop workspace
  team: unsplash('photo-1522071820081-009f0129c71c'),         // team at work
  office: unsplash('photo-1556761175-5973dc0f32e7', 1800),    // office meeting
  desk: unsplash('photo-1454165804606-c3d57bc86b40', 1800),   // business desk
  payments: unsplash('photo-1556740738-b6a63e27c4df'),        // billing / payments
};

const SITE = {
  name: 'AppVia | Business Operations App Solutions',
  short: 'AppVia',
  tagline: 'Smarter Tools. Stronger Business.',
  person: 'Vikrant Garg',
  email: 'vikrant@appvia.in',
  phone: '+91 99019 20560',
  whatsapp: '919901920560',
  address: 'Ludhiana, Punjab, India',
  updated: 'November 8, 2026',
};

/* ───────────── portfolio content (edit freely) ───────────── */
const STATS = [
  { n: 100, suf: '%', label: 'Custom built for you', d: 'Designed around your own process, never a generic template.' },
  { n: 40, suf: '%', label: 'Average admin time saved', d: 'Less chasing, less re-typing, fewer manual reports.' },
  { n: 1, suf: ' day', label: 'Reply time', d: 'A real person answers every enquiry within one working day.' },
  { n: 24, suf: '/7', label: 'Cloud access', d: 'Open your app on any phone or browser, from anywhere.' },
];

// [icon, name]
const INDUSTRIES = [
  ['🛍️', 'Retail & Shops'], ['🏭', 'Manufacturing'], ['📦', 'Wholesale & Distribution'], ['🎓', 'Education & Coaching'], ['🏥', 'Clinics & Healthcare'],
  ['🚚', 'Logistics & Transport'], ['🏠', 'Real Estate'], ['🍽️', 'Hotels & Restaurants'], ['🥛', 'Dairy & Agriculture'], ['💼', 'Agencies & Services'],
];

// From the AppVia poster: what our Mini ERP solutions do
const MINI_ERP = [
  { icon: '▤', t: 'Record Transactions', d: 'Stay on top of your finances' },
  { icon: '◔', t: 'Calculate Business Metrics', d: 'Track growth and performance' },
  { icon: '☺', t: 'Collaborate with Your Team', d: 'Work together efficiently' },
  { icon: '⌂', t: 'Maintain Book of Records', d: 'Keep your data safe and organized' },
];
const MINI_ERP_POINTS = ['Simple & easy to use', 'Tailored for SMEs', 'Accessible anytime, anywhere'];

const SOLUTIONS = [
  { id: 'inventory', icon: '▤', title: 'Inventory & Stock Control', tag: 'Stock', desc: 'Know what you have, where it is and when to reorder. No more counting by hand or running out of fast-moving items.', features: ['Live stock across shops or godowns', 'Low-stock and expiry alerts', 'Barcode and batch tracking', 'Purchase and supplier records'] },
  { id: 'crm', icon: '☎', title: 'Customer & Sales CRM', tag: 'Sales', desc: 'Keep every enquiry, follow-up and quotation in one place so no lead is forgotten and every sale is tracked.', features: ['Lead pipeline with follow-up reminders', 'Quotations in one click', 'Customer history and notes', 'Sales team performance view'] },
  { id: 'billing', icon: '₹', title: 'Billing, Invoicing & Payments', tag: 'Finance', desc: 'Professional GST-ready invoices, payment tracking and automatic reminders for outstanding dues.', features: ['GST invoices and PDF sharing', 'UPI and payment link tracking', 'Outstanding and ageing reports', 'Export for your accountant'] },
  { id: 'hr', icon: '☺', title: 'Staff, Attendance & Payroll', tag: 'People', desc: 'Digital attendance, leave and salary calculation that is fair, transparent and done in minutes, not days.', features: ['Mobile attendance with location', 'Leave and shift management', 'Automatic salary sheets', 'Staff task assignment'] },
  { id: 'orders', icon: '⇄', title: 'Orders, Dispatch & Delivery', tag: 'Operations', desc: 'Follow every order from request to delivery. Customers get updates, your team gets clarity.', features: ['Order intake from web or WhatsApp', 'Dispatch and route planning', 'Delivery proof and status updates', 'Returns and complaint handling'] },
  { id: 'reports', icon: '◔', title: 'Dashboards & Reports', tag: 'Insight', desc: 'See sales, expenses, profit and team performance at a glance, on your phone, any time.', features: ['Daily owner summary', 'Profit, expense and cash views', 'Custom charts and filters', 'Scheduled reports by email'] },
];

// [role, quote, fix, link, illustration key]
const ROLES = [
  ['Business Owner', '“I never know the real numbers until the month ends.”', 'See sales, cash and stock live on one dashboard.', '/services', 'reports'],
  ['Operations Manager', '“My team spends the day chasing updates on calls and chats.”', 'One shared app for tasks, orders and approvals.', '/services', 'orders'],
  ['Accounts & Finance', '“Invoices, payments and reminders are scattered everywhere.”', 'Automatic billing, reminders and clean reports.', '/services', 'billing'],
  ['Sales Lead', '“Good leads go cold because nobody followed up.”', 'A simple pipeline with reminders that never forget.', '/services', 'crm'],
];

const PROCESS = [
  { t: 'Listen', time: 'Week 1', d: 'We spend time with your team to understand the daily friction: where time is lost, where mistakes happen and what you wish was automatic.', out: ['Process walkthrough', 'Pain-point list', 'Fixed scope and price'] },
  { t: 'Design', time: 'Week 1–2', d: 'You see a clickable plan before a single line of code is written, so you can approve the screens and flow with confidence.', out: ['Clickable prototype', 'User roles and permissions', 'Data and report plan'] },
  { t: 'Build', time: 'Week 2–6', d: 'We deliver in small weekly releases. You test real features early and we adjust as we go, so there are no big surprises at the end.', out: ['Weekly demo releases', 'Data import from Excel/Sheets', 'Integrations (UPI, WhatsApp, email)'] },
  { t: 'Support', time: 'Ongoing', d: 'We train your staff, watch the first weeks closely and stay on call after launch. Need a change later? We make it quickly.', out: ['Staff training', 'Backups and monitoring', 'Change requests and upgrades'] },
];

// Comparison table. ['section', title] or [feature, us, them]
const COMPARE = [
  ['section', 'Everyday operations'],
  ['Orders and tasks in one place', 'One shared app for everyone', 'Scattered across chat groups'],
  ['Live stock and cash view', 'Updates on every sale', 'Counted by hand, late'],
  ['Payment reminders', 'Automatic, on schedule', 'Phone calls and memory'],
  ['Reports', 'Live dashboards, any time', 'Built manually at month-end'],
  ['section', 'Control and safety'],
  ['Staff permissions', 'Each role sees only what it needs', 'Everyone sees everything'],
  ['Backups', 'Automatic cloud backups', 'One laptop, one file'],
  ['History and audit trail', 'Every change recorded', 'Overwritten and lost'],
  ['section', 'Growth'],
  ['Adding a branch or new process', 'Small, fast update', 'Rebuild the sheet'],
  ['Ownership of your data', 'Yours, no lock-in', 'Locked inside generic software'],
  ['Support after launch', 'Training and quick changes', 'Figure it out yourself'],
];

const PLANS = [
  { name: 'Starter', art: 'billing', price: 'From ₹25,000', note: 'One focused app for one problem', pts: ['Single workflow (e.g. billing or stock)', 'Up to 3 user roles', 'Data import from Excel', 'Basic reports', '30 days of support'] },
  { name: 'Growth', art: 'orders', price: 'From ₹75,000', note: 'A connected system for your business', pts: ['Up to 4 connected modules', 'Unlimited users and roles', 'WhatsApp, UPI and email integrations', 'Owner dashboard', '90 days of support and training'], hot: true },
  { name: 'Enterprise', art: 'reports', price: 'Custom quote', note: 'Multi-branch and complex operations', pts: ['Multi-location support', 'Custom integrations and APIs', 'Advanced permissions and audit trail', 'Priority support', 'Ongoing improvement plan'] },
];

const TECH = ['React', 'Google Sheets', 'Apps Script', 'WhatsApp', 'UPI & Payments', 'PDF Invoices', 'Excel Import', 'Cloud Hosting', 'Email Alerts', 'Barcode / QR', 'Charts & Reports', 'Role Permissions'];

const FAQS = [
  ['How long does a project take?', 'A focused app usually takes 3 to 6 weeks. Larger multi-module systems take 8 to 12 weeks. You get a clear timeline in the proposal.'],
  ['Do I need to buy new software or servers?', 'No. We build on reliable cloud tools, so there is nothing to install on your side. Your team opens the app in a browser or on a phone.'],
  ['Can you move my data from Excel or my old software?', 'Yes. We clean and import your existing sheets, customers, products and balances so you start with your real data on day one.'],
  ['Will my staff be able to use it?', 'We design for non-technical users and train your team. Screens are simple, in plain language, and roles only show what each person needs.'],
  ['Is my business data safe?', 'Data is stored in access-controlled cloud storage with backups. Each person signs in with their own permissions and nobody sees more than they should.'],
  ['What if I want changes later?', 'Your app grows with you. We handle new features, reports and integrations as small, quickly delivered updates.'],
  ['What does it cost?', 'It depends on scope. Our plans start at a small single-purpose app and scale up. You get a fixed price in writing before we begin.'],
  ['Do you work with businesses outside Ludhiana?', 'Yes. We work with customers across India and abroad over calls and screen-sharing, and visit in person where it helps.'],
];

/* ───────────── API + Cloudinary ───────────── */
// Apps Script web apps don't answer CORS preflight, so POST uses text/plain.
const checkUrl = () => {
  if (!/^https:\/\/script\.google\.com\//.test(API_URL)) {
    throw new Error('Add your Apps Script Web App URL to API_URL at the top of App.js');
  }
};

async function parse(res) {
  let json;
  try { json = await res.json(); } catch (e) {
    throw new Error('Server did not return JSON. Deploy Code.gs as a Web app with access "Anyone" and use the URL ending in /exec');
  }
  if (!json.ok) throw new Error(json.error || 'Request failed');
  return json.data;
}

async function post(payload) {
  checkUrl();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  return parse(res);
}

async function get(action) {
  checkUrl();
  return parse(await fetch(`${API_URL}?action=${action}`));
}

const asList = (d) => {
  if (!Array.isArray(d)) throw new Error('Unexpected response. Redeploy Code.gs as a New version');
  return d;
};

const api = {
  works: () => get('works').then(asList),
  reviews: () => get('reviews').then(asList),
  addReview: (review) => post({ action: 'addReview', review }),
  sendMessage: (message) => post({ action: 'sendMessage', message }),
  login: (key) => post({ action: 'login', key }),
  changePassword: (key, newKey) => post({ action: 'changePassword', key, newKey }),
  addWork: (key, work) => post({ action: 'addWork', key, work }),
  updateWork: (key, work) => post({ action: 'updateWork', key, work }),
  deleteWork: (key, id) => post({ action: 'deleteWork', key, id }),
  deleteReview: (key, id) => post({ action: 'deleteReview', key, id }),
  messages: (key) => post({ action: 'listMessages', key }).then(asList),
  deleteMessage: (key, id) => post({ action: 'deleteMessage', key, id }),
};

// Only a wrong-password error should sign the admin out
const isAuthError = (e) => /wrong admin password/i.test(e.message || '');

// Unsigned upload to Cloudinary using the preset from config
async function uploadImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Image must be under 8 MB.');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUD.preset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD.name}/image/upload`, { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Image upload failed');
  return json.secure_url;
}

// Cloudinary on-the-fly optimisation. Only resizes (never crops), so the whole image stays visible.
const optimise = (url, w = 800) =>
  url && url.includes('/upload/') ? url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${w}/`) : url;

/* ───────────── small helpers ───────────── */
function useAsync(fn) {
  const [state, setState] = useState({ loading: true, data: null, error: '' });
  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    fn()
      .then((data) => setState({ loading: false, data, error: '' }))
      .catch((e) => setState({ loading: false, data: null, error: e.message }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { run(); }, [run]);
  return { ...state, reload: run };
}

// Works come only from what you add in Admin
function useWorks() {
  const r = useAsync(api.works);
  return { ...r, list: r.data || [] };
}

// True only after the image has really loaded (so a bad link never shows a broken background)
function useLoaded(url) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!url) { setOk(false); return undefined; }
    let live = true;
    const im = new Image();
    im.onload = () => live && setOk(true);
    im.onerror = () => live && setOk(false);
    im.src = url;
    return () => { live = false; };
  }, [url]);
  return ok;
}

// Faint photo layer used inside coloured bands and banners
function BgPhoto({ url }) {
  const ok = useLoaded(url);
  return ok ? <div className="bg-photo" style={{ backgroundImage: `url(${url})` }} aria-hidden="true" /> : null;
}

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const inr = (n) => '₹ ' + Math.round(n).toLocaleString('en-IN');

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1200, 1);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <strong ref={ref}>{v}{suffix}</strong>;
}

const Stars = ({ value, onChange }) => (
  <span className={`stars ${onChange ? 'input' : ''}`} aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button type="button" key={n} disabled={!onChange} className={n <= value ? 'on' : ''} onClick={() => onChange && onChange(n)} aria-label={`${n} star`}>★</button>
    ))}
  </span>
);

// Coloured circle with initials, used for reviewers
const AV = ['#056e7f', '#8347b9', '#0a8aa0', '#6f38a2', '#102732', '#0f8a5f'];
function Avatar({ name = '' }) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const initials = ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  const c = AV[(String(name).length + (parts[0] || '?').charCodeAt(0)) % AV.length];
  return <span className="avatar" style={{ background: c }} aria-hidden="true">{initials}</span>;
}

function Status({ loading, error, empty, children }) {
  if (loading) return <div className="status"><span className="spinner" /> Loading…</div>;
  if (error) return <div className="status err">Couldn’t load data: {error}. Check API_URL at the top of App.js.</div>;
  if (empty) return <div className="status">{empty}</div>;
  return children;
}

function PageHead({ title, sub, bg }) {
  return (
    <header className="page-head">
      <BgPhoto url={bg} />
      <span className="ph-shape a" aria-hidden="true" />
      <span className="ph-shape b" aria-hidden="true" />
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </header>
  );
}

// Full-width coloured band (tone: '', 'pale', 'mist', 'dark', 'grad') wrapping a normal section. Optional photo background.
function Full({ tone = '', photo, children }) {
  return (
    <div className={`full ${tone}`}>
      {photo && <BgPhoto url={photo} />}
      {children}
    </div>
  );
}

// Eyebrow + title + purple line
function SecIntro({ eyebrow, title, sub }) {
  return (
    <Reveal>
      <div className="sec-intro">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        <hr className="divider" aria-hidden="true" />
        {sub && <p>{sub}</p>}
      </div>
    </Reveal>
  );
}

/* ───────────── illustrations (inline SVG, no files needed) ───────────── */
const ILLO_KEYS = ['inventory', 'crm', 'billing', 'hr', 'orders', 'reports'];

function Illo({ k }) {
  const t = '#056e7f', s = '#6cb4c4', i = '#c4e6ed', p = '#8347b9', n = '#102732';
  let art;
  switch (k) {
    case 'inventory':
      art = (
        <>
          <rect x="30" y="116" width="260" height="8" rx="4" fill={t} />
          <rect x="50" y="76" width="64" height="40" rx="5" fill={s} />
          <rect x="124" y="50" width="76" height="66" rx="5" fill="#fff" stroke={t} strokeWidth="3" />
          <path d="M162 50v66M124 83h76" stroke={t} strokeWidth="3" />
          <rect x="210" y="84" width="60" height="32" rx="5" fill={p} />
          <circle cx="252" cy="42" r="16" fill="#fff" stroke={p} strokeWidth="3" />
          <path d="M245 42l5 5 9-10" stroke={p} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
      break;
    case 'crm':
      art = (
        <>
          <path d="M70 26h140l-48 44v38l-44 12V70z" fill={s} />
          <circle cx="92" cy="16" r="6" fill={p} />
          <circle cx="140" cy="12" r="6" fill={t} />
          <circle cx="188" cy="16" r="6" fill={p} />
          <rect x="222" y="52" width="76" height="44" rx="10" fill={p} />
          <path d="M240 96l-8 16 22-16z" fill={p} />
          <path d="M236 68h46M236 80h30" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="116" cy="120" r="5" fill={t} />
        </>
      );
      break;
    case 'billing':
      art = (
        <>
          <rect x="108" y="14" width="104" height="124" rx="8" fill="#fff" stroke={t} strokeWidth="3" />
          <path d="M124 38h72M124 54h72M124 70h46" stroke={i} strokeWidth="5" strokeLinecap="round" />
          <rect x="124" y="92" width="72" height="30" rx="6" fill={i} />
          <circle cx="226" cy="108" r="26" fill={t} />
          <text x="226" y="118" textAnchor="middle" fontSize="28" fontWeight="700" fill="#fff" fontFamily="Montserrat, Arial, sans-serif">₹</text>
          <circle cx="86" cy="60" r="16" fill={p} opacity=".9" />
          <path d="M79 60l5 5 9-10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
      break;
    case 'hr':
      art = (
        <>
          <circle cx="110" cy="52" r="17" fill={s} />
          <rect x="88" y="74" width="44" height="52" rx="14" fill={s} />
          <circle cx="160" cy="44" r="19" fill={t} />
          <rect x="136" y="68" width="48" height="60" rx="15" fill={t} />
          <circle cx="212" cy="52" r="17" fill={p} />
          <rect x="190" y="74" width="44" height="52" rx="14" fill={p} />
          <rect x="30" y="20" width="44" height="40" rx="6" fill="#fff" stroke={n} strokeWidth="2.5" />
          <path d="M30 32h44" stroke={n} strokeWidth="2.5" />
          <path d="M40 44h8M54 44h8M40 52h8" stroke={t} strokeWidth="3" strokeLinecap="round" />
        </>
      );
      break;
    case 'orders':
      art = (
        <>
          <path d="M20 128h280" stroke={n} strokeWidth="3" strokeDasharray="8 8" opacity=".35" />
          <rect x="40" y="52" width="130" height="60" rx="6" fill={s} />
          <path d="M170 70h42l24 24v18h-66z" fill={t} />
          <rect x="182" y="78" width="22" height="16" rx="2" fill={i} />
          <circle cx="82" cy="116" r="14" fill={n} />
          <circle cx="82" cy="116" r="5" fill="#fff" />
          <circle cx="204" cy="116" r="14" fill={n} />
          <circle cx="204" cy="116" r="5" fill="#fff" />
          <path d="M64 70h66M64 84h40" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <path d="M268 22a14 14 0 0 1 14 14c0 11-14 26-14 26s-14-15-14-26a14 14 0 0 1 14-14z" fill={p} />
          <circle cx="268" cy="36" r="5" fill="#fff" />
        </>
      );
      break;
    default:
      art = (
        <>
          <path d="M30 124h260" stroke={n} strokeWidth="3" opacity=".3" />
          <rect x="50" y="86" width="34" height="38" rx="4" fill={i} />
          <rect x="98" y="66" width="34" height="58" rx="4" fill={s} />
          <rect x="146" y="76" width="34" height="48" rx="4" fill={s} />
          <rect x="194" y="46" width="34" height="78" rx="4" fill={t} />
          <rect x="242" y="26" width="34" height="98" rx="4" fill={p} />
          <path d="M44 76l54-22 48 12 48-30 64-14" stroke={n} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
  }
  return (
    <div className="illo" aria-hidden="true">
      <svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="320" height="150" fill="#e6f0f2" />
        {art}
      </svg>
    </div>
  );
}

const illoFor = (w) => ILLO_KEYS[(String(w.title || '').length + String(w.category || '').length) % ILLO_KEYS.length];

// Large scenes, used when a photo is turned off or fails to load
function Scene({ k }) {
  const t = '#056e7f', s = '#6cb4c4', i = '#c4e6ed', p = '#8347b9', n = '#102732';
  let art;
  if (k === 'team') {
    art = (
      <>
        <rect x="70" y="40" width="340" height="130" rx="12" fill="#fff" stroke={t} strokeWidth="4" />
        <path d="M100 150l50-40 46 22 58-52 56 30 50-34" stroke={p} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="100" y="62" width="70" height="8" rx="4" fill={i} />
        <rect x="100" y="78" width="46" height="8" rx="4" fill={i} />
        <rect x="40" y="262" width="400" height="14" rx="7" fill={t} />
        <circle cx="130" cy="206" r="24" fill={s} /><rect x="102" y="232" width="56" height="34" rx="16" fill={s} />
        <circle cx="240" cy="198" r="28" fill={t} /><rect x="208" y="228" width="64" height="38" rx="18" fill={t} />
        <circle cx="350" cy="206" r="24" fill={p} /><rect x="322" y="232" width="56" height="34" rx="16" fill={p} />
        <rect x="372" y="176" width="86" height="40" rx="12" fill="#fff" stroke={p} strokeWidth="3" />
        <path d="M388 192h54M388 203h34" stroke={p} strokeWidth="4" strokeLinecap="round" />
      </>
    );
  } else if (k === 'contact') {
    art = (
      <>
        <path d="M0 240C100 200 160 280 260 230S400 200 480 240V340H0z" fill={i} opacity=".7" />
        <path d="M40 60h160M40 110h260M120 20v300M300 60v260M380 90v200" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity=".9" />
        <path d="M240 70a46 46 0 0 1 46 46c0 38-46 88-46 88s-46-50-46-88a46 46 0 0 1 46-46z" fill={p} />
        <circle cx="240" cy="116" r="18" fill="#fff" />
        <rect x="46" y="212" width="150" height="92" rx="12" fill="#fff" stroke={t} strokeWidth="4" />
        <path d="M54 224l67 44 67-44" stroke={t} strokeWidth="4" fill="none" strokeLinejoin="round" />
        <rect x="350" y="180" width="86" height="130" rx="14" fill={n} />
        <rect x="358" y="196" width="70" height="92" rx="6" fill={s} />
        <circle cx="393" cy="300" r="4" fill="#fff" />
      </>
    );
  } else {
    art = (
      <>
        <rect x="104" y="46" width="272" height="170" rx="12" fill={n} />
        <rect x="116" y="58" width="248" height="146" rx="6" fill="#fff" />
        <rect x="132" y="146" width="28" height="42" rx="4" fill={i} />
        <rect x="172" y="122" width="28" height="66" rx="4" fill={s} />
        <rect x="212" y="134" width="28" height="54" rx="4" fill={s} />
        <rect x="252" y="96" width="28" height="92" rx="4" fill={t} />
        <rect x="292" y="76" width="28" height="112" rx="4" fill={p} />
        <path d="M128 112l46-28 40 12 46-34 60-10" stroke={n} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M216 216h48l12 28H204z" fill={s} />
        <rect x="40" y="262" width="400" height="14" rx="7" fill={t} />
        <rect x="396" y="150" width="52" height="106" rx="10" fill={p} />
        <rect x="402" y="162" width="40" height="76" rx="4" fill="#fff" />
        <path d="M410 176h24M410 188h18" stroke={p} strokeWidth="4" strokeLinecap="round" />
        <path d="M60 262c-6-22-4-42 6-60 8 14 12 36 8 60z" fill={t} />
        <path d="M80 262c0-20 8-38 22-50 2 20-2 38-12 50z" fill={s} />
        <rect x="56" y="254" width="40" height="10" rx="3" fill={n} />
      </>
    );
  }
  return (
    <div className="scene" aria-hidden="true">
      <svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <rect width="480" height="340" fill="#e6f0f2" />
        <circle cx="400" cy="60" r="90" fill="#c4e6ed" opacity=".6" />
        <circle cx="60" cy="300" r="70" fill="#6cb4c4" opacity=".25" />
        {art}
      </svg>
    </div>
  );
}

// Small illustrations for the four project steps (drawn for a dark panel)
function StepArt({ k }) {
  const t = '#6cb4c4', i = '#c4e6ed', p = '#a874d8';
  let art;
  if (k === 0) {
    art = (
      <>
        <rect x="24" y="20" width="96" height="50" rx="12" fill={t} /><path d="M44 70l-6 16 22-16z" fill={t} />
        <path d="M40 38h60M40 52h38" stroke="#102732" strokeWidth="5" strokeLinecap="round" />
        <rect x="90" y="62" width="88" height="46" rx="12" fill={p} /><path d="M158 108l8 14-22-14z" fill={p} />
        <path d="M106 80h56M106 92h34" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      </>
    );
  } else if (k === 1) {
    art = (
      <>
        <rect x="24" y="14" width="152" height="104" rx="10" fill="none" stroke={i} strokeWidth="3" />
        <path d="M24 34h152" stroke={i} strokeWidth="3" />
        <rect x="36" y="46" width="44" height="60" rx="5" fill={t} />
        <rect x="90" y="46" width="74" height="24" rx="5" fill={p} />
        <rect x="90" y="80" width="34" height="26" rx="5" fill={i} />
        <rect x="130" y="80" width="34" height="26" rx="5" fill={t} />
      </>
    );
  } else if (k === 2) {
    art = (
      <>
        <path d="M70 30L30 66l40 36M130 30l40 36-40 36" stroke={i} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M112 22L88 112" stroke={p} strokeWidth="9" strokeLinecap="round" />
      </>
    );
  } else {
    art = (
      <>
        <path d="M44 80a56 56 0 0 1 112 0" stroke={i} strokeWidth="9" fill="none" strokeLinecap="round" />
        <rect x="32" y="74" width="26" height="40" rx="9" fill={t} />
        <rect x="142" y="74" width="26" height="40" rx="9" fill={t} />
        <path d="M155 112c0 14-14 20-34 20" stroke={p} strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="116" cy="132" r="7" fill={p} />
      </>
    );
  }
  return (
    <div className="step-art" aria-hidden="true">
      <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">{art}</svg>
    </div>
  );
}

// City skyline silhouette along the bottom of the hero
const SKY = [[0, 70, 90], [70, 50, 140], [120, 80, 110], [200, 44, 170], [244, 90, 100], [334, 56, 150], [390, 70, 120], [460, 50, 180], [510, 84, 130], [594, 60, 100], [654, 52, 160], [706, 80, 120], [786, 46, 190], [832, 90, 110], [922, 60, 150], [982, 74, 100], [1056, 50, 170], [1106, 86, 130], [1192, 56, 110], [1248, 70, 150], [1318, 54, 120], [1372, 68, 90]];
function HeroScape() {
  return (
    <svg className="skyline" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
      {SKY.map(([x, w, h], n) => (
        <g key={n}>
          <rect x={x} y={220 - h} width={w} height={h} fill="rgba(255,255,255,.055)" />
          {[0, 1, 2].map((r) => <rect key={r} x={x + 10} y={220 - h + 16 + r * 26} width={w - 20} height="6" rx="3" fill="rgba(196,230,237,.13)" />)}
        </g>
      ))}
    </svg>
  );
}

// A photo with an automatic illustration fallback
function Photo({ src, scene, alt, badge }) {
  const [bad, setBad] = useState(false);
  const showPhoto = src && !bad;
  return (
    <figure className="photo">
      {showPhoto ? <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} /> : <Scene k={scene} />}
      {badge && <figcaption className="photo-badge"><i /> {badge}</figcaption>}
    </figure>
  );
}

// Image on one side, copy on the other
function Showcase({ photo, scene, badge, eyebrow, title, sub, points, reverse, cta }) {
  return (
    <div className={`showcase ${reverse ? 'rev' : ''}`}>
      <Reveal><Photo src={photo} scene={scene} alt={title} badge={badge} /></Reveal>
      <Reveal delay={100}>
        <div className="show-copy">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          <hr className="divider left" aria-hidden="true" />
          {sub && <p>{sub}</p>}
          <ul className="ticks">{points.map((x) => <li key={x}>{x}</li>)}</ul>
          {cta && <div className="cta-row"><Link className="btn primary" to={cta[1]}>{cta[0]}</Link></div>}
        </div>
      </Reveal>
    </div>
  );
}

// The poster is optional: if the file is missing, the block simply hides the image
function PosterImg() {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="poster-wrap">
      <img src={POSTER} alt="AppVia: Business Operations Made Easy with Mini ERP solutions" loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}

/* ───────────── layout ───────────── */
const NAV = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/works', 'Works'], ['/reviews', 'Reviews'], ['/contact', 'Contact']];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  // The admin page has no dark banner under the header, so keep the header solid there
  const solid = scrolled || pathname === '/admin' || open;
  return (
    <header className={`site-header ${solid ? 'solid' : ''}`}>
      <Link to="/" className="brand" aria-label={SITE.name}>
        <span className="logo"><i /><i /><i /></span>
        <span><b>{SITE.short}</b><small>Business Operations App Solutions</small></span>
      </Link>
      <button className="burger" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu"><span /><span /></button>
      <nav className={open ? 'open' : ''}>
        {NAV.filter(([to]) => to !== '/contact').map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
        <NavLink to="/contact" className="nav-cta">Talk to us</NavLink>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-grid">
        <div>
          <strong className="foot-brand">{SITE.name}</strong>
          <p>Automate. Organize. Grow.<br />{SITE.tagline}</p>
        </div>
        <div>
          <h4>Explore</h4>
          {NAV.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
        </div>
        <div>
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
        <div>
          <h4>Reach us</h4>
          <span>{SITE.person}</span>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>
          <span>{SITE.address}</span>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© {new Date().getFullYear()} {SITE.short}. All rights reserved.</span>
        {/* Visible on mobile only (CSS). Desktop uses Ctrl + Shift + A */}
        <Link to="/admin" className="admin-link">Admin</Link>
      </div>
    </footer>
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 1000);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <button className={`back-top ${show ? 'show' : ''}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>;
}

function HotKey() {
  const nav = useNavigate();
  useEffect(() => {
    const h = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') { e.preventDefault(); nav('/admin'); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [nav]);
  return null;
}

/* ───────────── reusable sections ───────────── */
function StatStrip() {
  return (
    <Full tone="mist">
      <section className="section tight">
        <div className="stat-strip">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}><div className="stat"><Counter to={s.n} suffix={s.suf} /><span>{s.label}</span><small>{s.d}</small></div></Reveal>
          ))}
        </div>
      </section>
    </Full>
  );
}

function IndustryMarquee() {
  const row = [...INDUSTRIES, ...INDUSTRIES];
  return (
    <section className="marquee-wrap" aria-label="Industries we serve">
      <p className="marquee-title">Digital solutions for every kind of business</p>
      <div className="marquee"><div className="marquee-track">{row.map(([ic, n], i) => <span key={i}><i>{ic}</i>{n}</span>)}</div></div>
    </section>
  );
}

function SolutionCard({ s, i = 0 }) {
  return (
    <Reveal delay={i * 70}>
      <article className="card solution">
        <Illo k={s.id} />
        <div className="sol-top"><span className="ic">{s.icon}</span><em className="pill">{s.tag}</em></div>
        <h3>{s.title}</h3>
        <p>{s.desc}</p>
        <ul className="ticks">{s.features.map((f) => <li key={f}>{f}</li>)}</ul>
      </article>
    </Reveal>
  );
}

function MiniErp() {
  return (
    <Full tone="pale">
      <section className="section">
        <SecIntro eyebrow="Mini ERP" title="Business operations made easy" sub="Our Mini ERP solutions help small and medium businesses run everyday work from one simple app." />
        <div className="grid4">
          {MINI_ERP.map((m, i) => (
            <Reveal key={m.t} delay={i * 70}>
              <article className="card erp"><span className="ic">{m.icon}</span><h3>{m.t}</h3><p>{m.d}</p></article>
            </Reveal>
          ))}
        </div>
        <div className="poster-split" style={{ marginTop: 56 }}>
          <Reveal><PosterImg /></Reveal>
          <Reveal delay={100}>
            <div className="poster-copy">
              <span className="eyebrow">{SITE.tagline}</span>
              <h2>Grow your business with the power of smart technology</h2>
              <ul className="ticks">{MINI_ERP_POINTS.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="cta-row">
                <Link className="btn primary" to="/contact">Talk to {SITE.person.split(' ')[0]}</Link>
                <a className="btn wa" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Full>
  );
}

function ProcessTabs() {
  const [i, setI] = useState(0);
  const p = PROCESS[i];
  return (
    <div className="process">
      <div className="tabs" role="tablist">
        {PROCESS.map((s, n) => (
          <button key={s.t} role="tab" aria-selected={n === i} className={n === i ? 'on' : ''} onClick={() => setI(n)}>
            <b>{n + 1}</b>{s.t}
          </button>
        ))}
      </div>
      <div className="card tab-panel" key={p.t}>
        <div>
          <span className="num">0{i + 1}</span>
          <em className="pill">{p.time}</em>
          <h3>{p.t}</h3>
          <p>{p.d}</p>
        </div>
        <div className="panel-side">
          <StepArt k={i} />
          <ul className="ticks">{p.out.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

function CompareTable() {
  const [more, setMore] = useState(false);
  return (
    <div className="comp-wrap">
      <div className="comp-scroll">
        <div className={`comp-clip ${more ? '' : 'collapsed'}`}>
          <table className="comp">
            <thead><tr><th>Capabilities</th><th>Your own app</th><th>Spreadsheets &amp; chats</th></tr></thead>
            <tbody>
              {COMPARE.map((r, n) => r[0] === 'section'
                ? <tr className="sec" key={n}><td colSpan={3}>{r[1]}</td></tr>
                : <tr key={n}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <div className={`fade-bottom ${more ? 'off' : ''}`} />
      <div className="center"><button className="btn ghost" onClick={() => setMore(!more)}>{more ? 'Show less' : 'Show more'}</button></div>
    </div>
  );
}

function Calculator() {
  const [team, setTeam] = useState(10);
  const [hrs, setHrs] = useState(5);
  const [rate, setRate] = useState(300);
  const lost = team * hrs * 52;
  const cost = lost * rate;
  const saved = cost * 0.6;
  const Row = ({ label, val, set, min, max, step = 1, fmt = (x) => x }) => (
    <label className="range">
      <span>{label}<strong>{fmt(val)}</strong></span>
      <input type="range" min={min} max={max} step={step} value={val} style={{ '--p': `${((val - min) / (max - min)) * 100}%` }} onChange={(e) => set(Number(e.target.value))} />
    </label>
  );
  return (
    <div className="calc">
      <div className="form">
        <h3>Your team today</h3>
        <Row label="People doing manual work" val={team} set={setTeam} min={1} max={200} />
        <Row label="Hours per person each week on repeat tasks" val={hrs} set={setHrs} min={1} max={25} fmt={(x) => `${x} h`} />
        <Row label="Average cost per hour" val={rate} set={setRate} min={100} max={2000} step={50} fmt={inr} />
      </div>
      <div className="card calc-out">
        <div className="res main"><p>Estimated yearly cost of repeat work</p><strong className="big">{inr(cost)}</strong></div>
        <div className="res"><p>Time spent every year</p><strong className="big">{lost.toLocaleString('en-IN')} hours</strong></div>
        <div className="res"><p>Possible saving with automation (about 60%)</p><strong className="big">{inr(saved)}</strong></div>
        <small>An estimate for illustration only. Real results depend on your processes.</small>
        <Link className="btn primary" to="/contact">Get my free plan</Link>
      </div>
    </div>
  );
}

function Testimonials({ items }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const n = items.length;
  useEffect(() => {
    if (n < 2 || hold) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n, hold]);
  if (!n) return null;
  const go = (d) => setI((x) => (x + d + n) % n);
  return (
    <div className="testi" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="testi-view">
        <div className="testi-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {items.map((r) => (
            <div className="testi-slide" key={r.id}>
              <blockquote className="card review">
                <span className="qmark" aria-hidden="true">“</span>
                <Stars value={Number(r.rating)} />
                <p>{r.message}</p>
                <footer className="who"><Avatar name={r.name} /><div><strong>{r.name}</strong>{r.role && <span> · {r.role}</span>}</div></footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
      {n > 1 && (
        <div className="testi-nav">
          <button className="arrow" onClick={() => go(-1)} aria-label="Previous review">←</button>
          <div className="dots">{items.map((r, k) => <button key={r.id} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Review ${k + 1}`} />)}</div>
          <button className="arrow" onClick={() => go(1)} aria-label="Next review">→</button>
        </div>
      )}
    </div>
  );
}

function Faq({ items = FAQS }) {
  return (
    <div className="faq">
      {items.map(([q, a]) => (
        <Reveal key={q}><details className="card"><summary>{q}</summary><p>{a}</p></details></Reveal>
      ))}
    </div>
  );
}

function Band({ title = 'Ready to bring light to your daily operations?', text = 'Tell us what slows your team down. We’ll reply within one working day.' }) {
  return (
    <section className="section">
      <Reveal>
        <div className="band">
          <BgPhoto url={PHOTOS.office} />
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="cta-row center-row">
            <Link className="btn primary" to="/contact">Talk to us</Link>
            <Link className="btn ghost" to="/works">See our work</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────── home ───────────── */
function Home() {
  const works = useWorks();
  const reviews = useAsync(api.reviews);
  const latest = works.list.slice(0, 3);
  const topReviews = (reviews.data || []).filter((r) => Number(r.rating) >= 4).slice(0, 6);
  return (
    <>
      <section className="hero">
        <div className="orbs" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <HeroScape />
        <div className="hero-copy">
          <p className="hero-kicker">Mini ERP and business apps built around how you work</p>
          <h1>
            Smarter tools.
            <span>Stronger business.</span>
          </h1>
          <p className="lead">We design custom business operations apps that automate your routine tasks, organize your data and help your company grow.</p>
          <div className="cta-row">
            <Link className="btn primary" to="/contact">Start a project</Link>
            <Link className="btn ghost" to="/works">See our work</Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="glass dash">
            <div className="dash-top"><i /><i /><i /></div>
            <div className="bars"><b style={{ '--h': '35%' }} /><b style={{ '--h': '55%' }} /><b style={{ '--h': '48%' }} /><b style={{ '--h': '78%' }} /><b style={{ '--h': '95%' }} /></div>
            <p>Revenue this quarter <strong>+32%</strong></p>
          </div>
          <div className="glass chip-float c1"><i className="dot" /> Stock synced · 128 items</div>
          <div className="glass chip-float c2">Invoice paid <b>₹ 48,200</b></div>
          <div className="glass chip-float c3">3 follow-ups due today</div>
        </div>
      </section>

      <IndustryMarquee />
      <StatStrip />

      <section className="section">
        <SecIntro eyebrow="What we build" title="The six pillars of smooth business operations" sub="Pick one app or connect several. Each one is built around your own process." />
        <div className="grid3">
          {SOLUTIONS.map((s, i) => <SolutionCard key={s.id} s={s} i={i % 3} />)}
        </div>
        <div className="center"><Link className="btn ghost" to="/services">Explore all services</Link></div>
      </section>

      <Full tone="mist">
        <section className="section">
          <Showcase
            photo={PHOTOS.workspace}
            scene="workspace"
            badge="Live on every phone and browser"
            eyebrow="One app, one source of truth"
            title="Your whole business, on one screen"
            sub="Stop jumping between sheets, chat groups and notebooks. Your team works in one place and you see the real picture, live."
            points={['Orders, stock and payments update together', 'Each person sees only what their role needs', 'Works on any phone, tablet or computer']}
            cta={['See how it works', '/services']}
          />
        </section>
      </Full>

      <MiniErp />

      <section className="section">
        <SecIntro eyebrow="Built for your role" title="What’s slowing your business down?" sub="Different jobs, same app. See how it helps you and your team." />
        <div className="grid4">
          {ROLES.map(([role, quote, fix, to, art], i) => (
            <Reveal key={role} delay={i * 70}>
              <article className="card role">
                <Illo k={art} />
                <em className="pill">{role}</em>
                <p className="quote">{quote}</p>
                <p><strong>{fix}</strong></p>
                <Link to={to} className="more">See how →</Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Full tone="dark">
        <section className="section">
          <SecIntro eyebrow="Our approach" title="How a project runs" sub="A clear, weekly rhythm so you always know what is happening and what comes next." />
          <ProcessTabs />
        </section>
      </Full>

      {latest.length > 0 && (
        <section className="section">
          <SecIntro eyebrow="Recent work" title="Apps we’ve built for real businesses" />
          <div className="grid3">{latest.map((w) => <WorkCard key={w.id} w={w} />)}</div>
          <div className="center"><Link className="btn ghost" to="/works">View all works</Link></div>
        </section>
      )}

      <Full tone="pale">
        <section className="section">
          <SecIntro eyebrow="Why your own app" title="Optimize the way your business runs" sub="Your own app sits on top of the tools you already use and replaces the patchwork behind them." />
          <CompareTable />
        </section>
      </Full>

      <section className="section">
        <SecIntro eyebrow="Savings calculator" title="How much is manual work costing you?" sub="Adjust the sliders to match your team and see what repeat work could be costing each year." />
        <Calculator />
      </section>

      {topReviews.length > 0 && (
        <Full tone="mist">
          <section className="section">
            <SecIntro eyebrow="Success stories" title="What clients say" />
            <Testimonials items={topReviews} />
            <div className="center"><Link className="btn ghost" to="/reviews">Read all reviews</Link></div>
          </section>
        </Full>
      )}

      <section className="section narrow">
        <SecIntro eyebrow="FAQ" title="Common questions" />
        <Faq items={FAQS.slice(0, 4)} />
        <div className="center"><Link className="btn ghost" to="/services">More questions</Link></div>
      </section>

      <Full tone="grad" photo={PHOTOS.office}>
        <section className="section narrow center-text">
          <SecIntro eyebrow="Get started" title="Unlock your hidden time savings" sub="Tell us what slows your team down. We’ll reply within one working day with a simple first step." />
          <div className="cta-row center-row"><Link className="btn primary" to="/contact">Talk to us</Link></div>
        </section>
      </Full>
    </>
  );
}

/* ───────────── about ───────────── */
function About() {
  const values = [
    ['Clarity', 'Plain language, fixed scopes and honest timelines.', '◎'],
    ['Care', 'Your data is treated like our own. Backed up and access-controlled.', '♡'],
    ['Growth', 'Every feature has to save time or make money, or we don’t build it.', '↗'],
    ['Simplicity', 'If your newest staff member can’t use a screen without help, we redesign it.', '✦'],
    ['Ownership', 'Your data and your app belong to you. No lock-in, no hidden fees.', '⌂'],
    ['Partnership', 'We stay after launch. Your success is how we measure ours.', '⇄'],
  ];
  const before = ['Orders on paper and chat groups', 'Stock counted by hand', 'Payments chased by phone', 'Reports built at month-end', 'Knowledge lives in one person’s head'];
  const after = ['Orders flow into one shared app', 'Stock updates itself on every sale', 'Automatic reminders for dues', 'Live dashboards any time', 'Every process documented in the system'];
  return (
    <>
      <PageHead title="We make everyday business work lighter" sub="AppVia builds simple, dependable software for growing companies." bg={PHOTOS.team} />
      <section className="section narrow">
        <Reveal>
          <p className="prose-lg">Most businesses run on a patchwork of spreadsheets, chat groups and memory. It works until it doesn’t. We replace that patchwork with one organized app: orders, staff, stock, payments and reports in one place, designed around your process rather than a generic template.</p>
        </Reveal>
        <div className="stats">
          {[['100%', 'Custom built'], ['1 day', 'Reply time'], ['24/7', 'Cloud access']].map(([n, l]) => (
            <Reveal key={l}><div className="stat"><strong>{n}</strong><span>{l}</span></div></Reveal>
          ))}
        </div>
      </section>

      <Full tone="mist">
        <section className="section">
          <Showcase
            photo={PHOTOS.team}
            scene="team"
            badge="Built with your team, not for them"
            eyebrow="Who we are"
            title="A small team that sits beside yours"
            sub="We start by watching how your people really work, then build only what saves them time."
            points={['Direct access to the person building your app', 'Weekly demos so there are no surprises', 'Training and support after launch']}
            cta={['Meet us on a call', '/contact']}
            reverse
          />
        </section>
      </Full>

      <MiniErp />

      <section className="section">
        <SecIntro eyebrow="The difference" title="Before and after" />
        <div className="compare">
          <Reveal><div className="card cmp"><h3>Before</h3><ul className="crosses">{before.map((t) => <li key={t}>{t}</li>)}</ul></div></Reveal>
          <Reveal delay={90}><div className="card cmp good"><h3>With your own app</h3><ul className="ticks">{after.map((t) => <li key={t}>{t}</li>)}</ul></div></Reveal>
        </div>
      </section>

      <Full tone="dark">
        <section className="section">
          <SecIntro eyebrow="Our approach" title="How a project runs" />
          <ProcessTabs />
        </section>
      </Full>

      <section className="section">
        <SecIntro eyebrow="Our values" title="What we stand for" />
        <div className="grid3">
          {values.map(([t, d, ic], i) => (
            <Reveal key={t} delay={(i % 3) * 90}><article className="card value"><span className="ic">{ic}</span><h3>{t}</h3><p>{d}</p></article></Reveal>
          ))}
        </div>
      </section>

      <Full tone="mist">
        <section className="section">
          <SecIntro eyebrow="Who we help" title="Industries we work with" />
          <div className="ind-grid">
            {INDUSTRIES.map(([ic, n], i) => (
              <Reveal key={n} delay={(i % 5) * 60}><div className="ind"><span>{ic}</span><b>{n}</b></div></Reveal>
            ))}
          </div>
        </section>
      </Full>

      <Band title="Let’s map your first workflow together" text="A short call is enough to find the one process worth automating first." />
    </>
  );
}

/* ───────────── services ───────────── */
function Services() {
  return (
    <>
      <PageHead title="Digital solutions for your business" sub="Pick one app or connect several. Every solution is built around your own process." bg={PHOTOS.workspace} />
      <section className="section">
        <div className="grid3">{SOLUTIONS.map((s, i) => <SolutionCard key={s.id} s={s} i={i % 3} />)}</div>
      </section>

      <Full tone="mist">
        <section className="section">
          <Showcase
            photo={PHOTOS.payments}
            scene="workspace"
            badge="GST invoice sent · payment received"
            eyebrow="From order to payment"
            title="Get paid faster, with less chasing"
            sub="Invoices go out in one click and reminders go out on schedule, so your team spends time on customers, not calls."
            points={['GST-ready invoices shared by WhatsApp or email', 'UPI links and live outstanding reports', 'One clean export for your accountant']}
            cta={['Get a quote', '/contact']}
          />
        </section>
      </Full>

      <Full tone="pale">
        <section className="section">
          <SecIntro eyebrow="Pricing" title="Simple, fixed-price plans" />
          <div className="grid3">
            {PLANS.map((p, i) => (
              <Reveal key={p.name} delay={i * 90}>
                <article className={`card plan ${p.hot ? 'hot' : ''}`}>
                  {p.hot && <em className="pill">Most popular</em>}
                  <div className="plan-illo"><Illo k={p.art} /></div>
                  <h3>{p.name}</h3>
                  <strong className="price">{p.price}</strong>
                  <p>{p.note}</p>
                  <ul className="ticks">{p.pts.map((x) => <li key={x}>{x}</li>)}</ul>
                  <Link className={`btn ${p.hot ? 'primary' : 'ghost'}`} to="/contact">Get a quote</Link>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="fine center-text" style={{ marginTop: 24 }}>Prices are indicative starting points. You receive a fixed written quote after we understand your needs.</p>
        </section>
      </Full>

      <section className="section">
        <SecIntro eyebrow="Technology" title="Tools and integrations" />
        <div className="chips tags">{TECH.map((n) => <span key={n} className="tagchip">{n}</span>)}</div>
      </section>

      <Full tone="pale">
        <section className="section narrow">
          <SecIntro eyebrow="FAQ" title="Frequently asked questions" />
          <Faq />
        </section>
      </Full>

      <Band />
    </>
  );
}

/* ───────────── works ───────────── */
function WorkCard({ w, onOpen }) {
  return (
    <Reveal>
      <article className="card work" onClick={() => onOpen && onOpen(w)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen && onOpen(w)}>
        <div className="thumb">
          {w.image ? <img src={optimise(w.image, 700)} alt={w.title} loading="lazy" /> : <Illo k={illoFor(w)} />}
          <em>{w.category}</em>
        </div>
        <h3>{w.title}</h3>
        <p className="clamp">{w.description}</p>
      </article>
    </Reveal>
  );
}

function Works() {
  const { loading, error, list } = useWorks();
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null);
  const cats = ['All', ...new Set(list.map((w) => w.category).filter(Boolean))];
  const shown = cat === 'All' ? list : list.filter((w) => w.category === cat);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  return (
    <>
      <PageHead title="Our works" sub="Apps and systems we’ve built for real businesses." bg={PHOTOS.desk} />
      <section className="section">
        <Status loading={loading} error={error} empty={!list.length && 'No works added yet. Please check back soon.'}>
          <div className="chips">{cats.map((c) => <button key={c} className={c === cat ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}</div>
          <div className="grid3">{shown.map((w) => <WorkCard key={w.id} w={w} onOpen={setOpen} />)}</div>
        </Status>
      </section>
      <Band title="Have a similar challenge?" text="We can adapt any of these into a solution for your business." />
      {open && (
        <div className="modal" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="x" onClick={() => setOpen(null)} aria-label="Close">×</button>
            {open.image && <div className="modal-img"><img src={optimise(open.image, 1200)} alt={open.title} /></div>}
            <div className="modal-body">
              <em className="tag">{open.category}</em>
              <h2>{open.title}</h2>
              <p>{open.description}</p>
              <small>Published {fmtDate(open.createdAt)}</small>
              <div className="cta-row">
                {open.link && <a className="btn primary" href={open.link} target="_blank" rel="noreferrer">Visit project</a>}
                <Link className="btn ghost" to="/contact" style={{ color: 'var(--teal)', borderColor: 'var(--teal)' }}>Ask for something similar</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ───────────── reviews ───────────── */
function Reviews() {
  const { loading, error, data, reload } = useAsync(api.reviews);
  const blank = { name: '', role: '', rating: 5, message: '' };
  const [f, setF] = useState(blank);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const list = data || [];
  const avg = list.length ? (list.reduce((a, r) => a + Number(r.rating || 0), 0) / list.length).toFixed(1) : null;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setNote(null);
    try {
      await api.addReview(f);
      setF(blank);
      setShow(false);
      setNote({ ok: true, t: 'Thank you! Your review is now live.' });
      reload();
    } catch (err) { setNote({ ok: false, t: err.message }); }
    setBusy(false);
  };

  return (
    <>
      <PageHead title="What clients say" sub={avg ? `${avg} out of 5 from ${list.length} review${list.length > 1 ? 's' : ''}` : 'Be the first to share your experience.'} bg={PHOTOS.office} />
      <section className="section narrow">
        <div className="toolbar">
          <h2>All reviews</h2>
          <button className="btn primary" onClick={() => { setShow(!show); setNote(null); }}>{show ? 'Close form' : '+ Add a review'}</button>
        </div>

        {show && (
          <form className="card form form-panel" onSubmit={submit}>
            <h3>Write a review</h3>
            <label>Your name<input required maxLength={80} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label>Role or company (optional)<input maxLength={80} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} /></label>
            <label>Rating<Stars value={f.rating} onChange={(rating) => setF({ ...f, rating })} /></label>
            <label>Your review<textarea required rows={4} maxLength={800} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></label>
            <div className="cta-row" style={{ marginTop: 0 }}>
              <button className="btn primary" disabled={busy}>{busy ? 'Posting…' : 'Post review'}</button>
              <button type="button" className="btn ghost" onClick={() => setShow(false)}>Cancel</button>
            </div>
            {note && !note.ok && <p className="note bad">{note.t}</p>}
          </form>
        )}
        {note && note.ok && <p className="note ok" style={{ marginBottom: 24 }}>{note.t}</p>}

        <Status loading={loading} error={error} empty={!list.length && 'No reviews yet.'}>
          <div className="reviews">
            {list.map((r) => (
              <Reveal key={r.id}>
                <blockquote className="card review">
                  <Stars value={Number(r.rating)} />
                  <p>{r.message}</p>
                  <footer className="who">
                    <Avatar name={r.name} />
                    <div><strong>{r.name}</strong>{r.role && <span> · {r.role}</span>}<small>{fmtDate(r.createdAt)}</small></div>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </Status>
      </section>
    </>
  );
}

/* ───────────── contact ───────────── */
function Contact() {
  const blank = { name: '', email: '', phone: '', message: '', website: '' };
  const [f, setF] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setNote(null);
    try {
      await api.sendMessage(f);
      setF(blank);
      setNote({ ok: true, t: 'Message sent. We’ll reply within one working day.' });
    } catch (err) { setNote({ ok: false, t: err.message }); }
    setBusy(false);
  };

  return (
    <>
      <PageHead title="Let’s talk about your business" sub="Share a few details and we’ll suggest the simplest way to get started." bg={PHOTOS.office} />
      <section className="section split">
        <div className="info">
          <Reveal><Photo src={PHOTOS.team} scene="contact" alt="Talk to the AppVia team" badge="We reply within one working day" /></Reveal>
          <div className="card info-card"><span>Contact person</span><strong>{SITE.person}</strong></div>
          <a className="card info-card" href={`mailto:${SITE.email}`}><span>Email</span><strong>{SITE.email}</strong></a>
          <a className="card info-card" href={`tel:${SITE.phone.replace(/\s/g, '')}`}><span>Phone</span><strong>{SITE.phone}</strong></a>
          <div className="card info-card"><span>Office</span><strong>{SITE.address}</strong></div>
          <div className="card info-card"><span>Hours</span><strong>Mon–Sat, 10 am – 7 pm IST</strong></div>
          <a className="btn wa" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          <div className="card info-card"><span>What happens next</span>
            <ul className="ticks small-list"><li>We reply within one working day</li><li>A short call to understand your process</li><li>A fixed quote and plan, no obligation</li></ul>
          </div>
        </div>
        <form className="card form" onSubmit={submit}>
          <h3>Send a message</h3>
          <label>Name<input required maxLength={80} value={f.name} onChange={set('name')} /></label>
          <div className="two">
            <label>Email<input required type="email" maxLength={120} value={f.email} onChange={set('email')} /></label>
            <label>Phone (optional)<input type="tel" maxLength={30} value={f.phone} onChange={set('phone')} /></label>
          </div>
          <label>How can we help?<textarea required rows={5} maxLength={1500} value={f.message} onChange={set('message')} /></label>
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} />
          <p className="fine">By sending this you agree to our <Link to="/privacy">Privacy Policy</Link>.</p>
          <button className="btn primary" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
          {note && <p className={`note ${note.ok ? 'ok' : 'bad'}`}>{note.t}</p>}
        </form>
      </section>
    </>
  );
}

/* ───────────── legal ───────────── */
const PRIVACY = [
  ['Who we are', `${SITE.name} (“we”, “us”) provides custom business operations software and related services. This policy explains what personal information we collect through this website and how we handle it.`],
  ['Information we collect', 'Contact details you send us (name, email, phone, message); reviews you post (name, role, rating, text); and basic technical data such as browser type and pages visited. We do not collect payment card details on this site.'],
  ['How we use it', 'To reply to your enquiries, display your review on our Reviews page, improve our website and services, keep the site secure and meet legal obligations. We do not sell your personal information.'],
  ['Where data is stored', 'Messages and reviews are stored in Google Sheets through Google Apps Script. Project images are hosted by Cloudinary. These providers process data on our behalf under their own security and privacy terms.'],
  ['Reviews are public', 'Anything you write in a review, including your name and role, is shown publicly. Do not include private information. You can ask us to remove your review at any time.'],
  ['Cookies and local storage', 'We use only essential browser storage (for example, keeping an administrator signed in during a session). We do not use advertising cookies.'],
  ['How long we keep data', 'Enquiries are kept for as long as needed to respond and for up to 24 months afterwards. Reviews stay online until you ask us to delete them.'],
  ['Your rights', `You may request access, correction or deletion of your personal information by emailing ${SITE.email}. We will respond within 30 days.`],
  ['Security', 'We use HTTPS, access-controlled admin tools and input validation. No online system is perfectly secure, so we cannot guarantee absolute security.'],
  ['Children', 'This website is not directed to children under 13, and we do not knowingly collect their data.'],
  ['Changes', 'We may update this policy and will change the date above when we do.'],
  ['Contact', `Questions about privacy? Email ${SITE.email}.`],
];
const TERMS = [
  ['Acceptance', 'By using this website you agree to these Terms & Conditions. If you do not agree, please do not use the site.'],
  ['Our services', 'We design and build custom software. The scope, price, timeline and deliverables of each project are set in a separate written proposal or agreement, which prevails over these terms if they conflict.'],
  ['Using the website', 'You agree not to misuse the site: no attempts to gain unauthorized access, upload harmful code, scrape it at harmful volumes or send spam through the forms.'],
  ['Reviews and submissions', 'You confirm that reviews are honest, based on real experience and do not contain unlawful, defamatory or private content. You grant us a free licence to display your review on our website. We may remove any submission at our discretion.'],
  ['Intellectual property', 'Website content, branding and the project showcases are owned by us or our clients and are protected by law. Ownership of delivered software is defined in each project agreement.'],
  ['Payments', 'Fees, milestones and payment schedules are stated in the project proposal. Late payments may pause work.'],
  ['No warranty', 'The website is provided “as is”. We try to keep it accurate and available but do not guarantee that it will be error-free or uninterrupted.'],
  ['Limitation of liability', 'To the extent permitted by law, we are not liable for indirect or consequential losses arising from use of this website. Liability for project work is limited as stated in the project agreement.'],
  ['Third-party links', 'Showcased projects may link to external sites. We are not responsible for their content or practices.'],
  ['Governing law', 'These terms are governed by the laws of India. Disputes fall under the courts of Ludhiana, Punjab.'],
  ['Changes', 'We may update these terms at any time. Continued use of the site means you accept the updated terms.'],
  ['Contact', `Questions about these terms? Email ${SITE.email}.`],
];

function Legal({ title, items }) {
  return (
    <>
      <PageHead title={title} sub={`Last updated: ${SITE.updated}`} />
      <section className="section narrow legal">
        {items.map(([h, p], i) => (
          <article key={h}><h2>{i + 1}. {h}</h2><p>{p}</p></article>
        ))}
        <p className="fine">This document is a general template. Have a qualified lawyer review it before relying on it.</p>
      </section>
    </>
  );
}

/* ───────────── admin ───────────── */
const EMPTY_WORK = { id: '', title: '', category: '', description: '', image: '', link: '' };

function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem('boas_key') || '');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('works');

  const login = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try { await api.login(pw); sessionStorage.setItem('boas_key', pw); setKey(pw); }
    catch (x) { setErr(x.message); }
    setBusy(false);
  };
  const logout = () => { sessionStorage.removeItem('boas_key'); setKey(''); setPw(''); };
  const rekey = (next) => { sessionStorage.setItem('boas_key', next); setKey(next); };

  if (!key) {
    return (
      <section className="section narrow pad-top">
        <form className="card form login" onSubmit={login}>
          <h1>Admin sign in</h1>
          <label>Password<input type="password" autoFocus required value={pw} onChange={(e) => setPw(e.target.value)} /></label>
          <button className="btn primary" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
          {err && <p className="note bad">{err}</p>}
        </form>
      </section>
    );
  }

  return (
    <section className="section narrow admin">
      <div className="admin-bar">
        <h1>Admin</h1>
        <div className="chips">
          {[['works', 'Works'], ['reviews', 'Reviews'], ['messages', 'Messages'], ['settings', 'Settings']].map(([k, l]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
          ))}
          <button onClick={logout}>Sign out</button>
        </div>
      </div>
      {tab === 'works' && <AdminWorks k={key} onAuthFail={logout} />}
      {tab === 'reviews' && <AdminReviews k={key} onAuthFail={logout} />}
      {tab === 'messages' && <AdminMessages k={key} onAuthFail={logout} />}
      {tab === 'settings' && <AdminSettings k={key} onAuthFail={logout} onChanged={rekey} />}
    </section>
  );
}

function AdminWorks({ k, onAuthFail }) {
  const { loading, error, data, reload } = useAsync(api.works);
  const [form, setForm] = useState(EMPTY_WORK);
  const [show, setShow] = useState(false);
  const [up, setUp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const fail = (e) => { if (isAuthError(e)) onAuthFail(); setNote({ ok: false, t: e.message }); };

  const closeForm = () => { setShow(false); setForm(EMPTY_WORK); };

  const pick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUp(true); setNote(null);
    try { const image = await uploadImage(file); setForm((f) => ({ ...f, image })); }
    catch (x) { setNote({ ok: false, t: x.message }); }
    setUp(false);
    e.target.value = '';
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true); setNote(null);
    try {
      const editing = !!form.id;
      if (editing) await api.updateWork(k, form); else await api.addWork(k, form);
      setNote({ ok: true, t: editing ? 'Work updated.' : 'Work added.' });
      closeForm();
      reload();
    } catch (x) { fail(x); }
    setBusy(false);
  };

  const remove = async (w) => {
    if (!window.confirm(`Delete “${w.title}”? This can’t be undone.`)) return;
    try { await api.deleteWork(k, w.id); setNote({ ok: true, t: 'Work deleted.' }); reload(); } catch (x) { fail(x); }
  };

  const edit = (w) => {
    setForm({ id: w.id, title: w.title, category: w.category, description: w.description, image: w.image, link: w.link });
    setShow(true); setNote(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="toolbar">
        <h3>Posted works</h3>
        <button className="btn primary" onClick={() => { if (show) closeForm(); else { setForm(EMPTY_WORK); setShow(true); } setNote(null); }}>{show ? 'Close form' : '+ Add work'}</button>
      </div>

      {show && (
        <form className="card form form-panel" onSubmit={save}>
          <h3>{form.id ? 'Edit work' : 'Add a work'}</h3>
          <label>Title<input required maxLength={120} value={form.title} onChange={set('title')} /></label>
          <label>Category<input maxLength={40} placeholder="e.g. Inventory, CRM, Billing" value={form.category} onChange={set('category')} /></label>
          <label>Description<textarea rows={4} maxLength={1200} value={form.description} onChange={set('description')} /></label>
          <label>Project link (optional)<input type="url" placeholder="https://" value={form.link} onChange={set('link')} /></label>
          <div className="upload">
            {form.image ? <img src={optimise(form.image, 400)} alt="Preview" /> : <span className="noimg">◈</span>}
            <div>
              <label className="btn ghost small">{up ? 'Uploading…' : form.image ? 'Replace image' : 'Upload image'}<input type="file" accept="image/*" hidden onChange={pick} disabled={up} /></label>
              {form.image && <button type="button" className="link-btn" onClick={() => setForm({ ...form, image: '' })}>Remove</button>}
            </div>
          </div>
          <div className="cta-row" style={{ marginTop: 0 }}>
            <button className="btn primary" disabled={busy || up}>{busy ? 'Saving…' : form.id ? 'Save changes' : 'Add work'}</button>
            <button type="button" className="btn ghost" onClick={closeForm}>Cancel</button>
          </div>
        </form>
      )}
      {note && <p className={`note ${note.ok ? 'ok' : 'bad'}`} style={{ marginBottom: 20 }}>{note.t}</p>}

      <Status loading={loading} error={error} empty={!(data || []).length && 'No works yet. Click “+ Add work” to add your first one.'}>
        <ul className="rows">
          {(data || []).map((w) => (
            <li key={w.id} className="card row">
              {w.image ? <img src={optimise(w.image, 200)} alt="" /> : <span className="noimg sm">◈</span>}
              <div><strong>{w.title}</strong><small>{w.category} · {fmtDate(w.createdAt)}</small></div>
              <div className="row-actions">
                <button className="btn ghost small" onClick={() => edit(w)}>Edit</button>
                <button className="btn danger small" onClick={() => remove(w)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </Status>
    </div>
  );
}

function AdminReviews({ k, onAuthFail }) {
  const { loading, error, data, reload } = useAsync(api.reviews);
  const [note, setNote] = useState('');
  const remove = async (r) => {
    if (!window.confirm(`Delete the review by ${r.name}?`)) return;
    try { await api.deleteReview(k, r.id); reload(); }
    catch (e) { if (isAuthError(e)) onAuthFail(); setNote(e.message); }
  };
  return (
    <Status loading={loading} error={error} empty={!(data || []).length && 'No reviews posted yet.'}>
      {note && <p className="note bad">{note}</p>}
      <ul className="rows">
        {(data || []).map((r) => (
          <li key={r.id} className="card row review-row">
            <div>
              <Stars value={Number(r.rating)} />
              <p>{r.message}</p>
              <small>{r.name}{r.role && ` · ${r.role}`} · {fmtDate(r.createdAt)}</small>
            </div>
            <button className="btn danger small" onClick={() => remove(r)}>Delete</button>
          </li>
        ))}
      </ul>
    </Status>
  );
}

function AdminMessages({ k, onAuthFail }) {
  const { loading, error, data, reload } = useAsync(() => api.messages(k));
  const remove = async (m) => {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    try { await api.deleteMessage(k, m.id); reload(); } catch (e) { if (isAuthError(e)) onAuthFail(); }
  };
  return (
    <Status loading={loading} error={error} empty={!(data || []).length && 'No messages yet.'}>
      <ul className="rows">
        {(data || []).map((m) => (
          <li key={m.id} className="card row review-row">
            <div>
              <strong>{m.name}</strong>
              <small><a href={`mailto:${m.email}`}>{m.email}</a>{m.phone && ` · ${m.phone}`} · {fmtDate(m.createdAt)}</small>
              <p>{m.message}</p>
            </div>
            <button className="btn danger small" onClick={() => remove(m)}>Delete</button>
          </li>
        ))}
      </ul>
    </Status>
  );
}

function AdminSettings({ k, onAuthFail, onChanged }) {
  const blank = { current: '', next: '', again: '' };
  const [f, setF] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const set = (n) => (e) => setF({ ...f, [n]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setNote(null);
    if (f.current !== k) { setNote({ ok: false, t: 'Current password is not correct.' }); return; }
    if (f.next.length < 6) { setNote({ ok: false, t: 'New password must be at least 6 characters.' }); return; }
    if (f.next !== f.again) { setNote({ ok: false, t: 'The two new passwords do not match.' }); return; }
    setBusy(true);
    try {
      await api.changePassword(k, f.next);
      onChanged(f.next);
      setF(blank);
      setNote({ ok: true, t: 'Password changed. Use the new password next time you sign in.' });
    } catch (x) {
      if (isAuthError(x)) onAuthFail();
      setNote({ ok: false, t: x.message });
    }
    setBusy(false);
  };

  return (
    <form className="card form form-panel" onSubmit={submit}>
      <h3>Change admin password</h3>
      <label>Current password<input type="password" required autoComplete="current-password" value={f.current} onChange={set('current')} /></label>
      <label>New password<input type="password" required minLength={6} maxLength={100} autoComplete="new-password" value={f.next} onChange={set('next')} /></label>
      <label>Repeat new password<input type="password" required minLength={6} maxLength={100} autoComplete="new-password" value={f.again} onChange={set('again')} /></label>
      <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Update password'}</button>
      {note && <p className={`note ${note.ok ? 'ok' : 'bad'}`}>{note.t}</p>}
    </form>
  );
}

/* ───────────── error boundary: shows errors on screen instead of a blank page ───────────── */
class Boundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) {
      return (
        <div className="status err" style={{ padding: '120px 20px' }}>
          <h2>Something went wrong</h2>
          <p>{String(this.state.err.message || this.state.err)}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ───────────── app ───────────── */
function NotFound() {
  return <><PageHead title="Page not found" sub="That page doesn’t exist." /><div className="center" style={{ padding: '40px 0 80px' }}><Link className="btn primary" to="/">Back to home</Link></div></>;
}

export default function App() {
  return (
    <Boundary>
    <HashRouter>
      <ScrollTop />
      <HotKey />
      <Header />
      <main>
        <Boundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/works" element={<Works />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Legal title="Privacy Policy" items={PRIVACY} />} />
          <Route path="/terms" element={<Legal title="Terms & Conditions" items={TERMS} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Boundary>
      </main>
      <Footer />
      <BackToTop />
    </HashRouter>
    </Boundary>
  );
}