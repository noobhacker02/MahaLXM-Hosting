import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, FlaskConical, Factory, Globe, Award, CheckCircle2, ArrowRight, ArrowLeft,
  MessageSquare, Phone, Mail, Menu, X, Package, HardHat, Truck, ExternalLink,
  ChevronDown, MapPin, Users, Star, Download, Calendar, Zap, Flag, Search, Filter,
  FileText, ChevronRight, ChevronLeft, Building2, Droplets, Wrench, Briefcase, Microscope, LayoutGrid, Layers, HelpCircle
} from 'lucide-react';

// ========================================
// SCROLL TO TOP ON ROUTE CHANGE
// ========================================
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ========================================
// SEO HEAD COMPONENT
// ========================================
const PageHead = ({ title, description, path = '' }) => {
  useEffect(() => {
    const base = 'Mahalaxmi Group';
    document.title = title ? `${title} | ${base} — Industrial Excellence Since 1942` : `${base} | Industrial Excellence Since 1942`;
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) metaDesc.setAttribute('content', description);
    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://themahalaxmigroup.com${path}`);
    // Update og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.appendChild(ogUrl); }
    ogUrl.setAttribute('content', `https://themahalaxmigroup.com${path}`);
  }, [title, description, path]);
  return null;
};

// ========================================
// FORM SUBMISSION HOOK
// ========================================
const useFormSubmit = () => {
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [formTimestamp] = useState(() => Math.floor(Date.now() / 1000));

  const submitForm = async (formData) => {
    setStatus('sending');
    setErrorMsg('');
    try {
      // Add anti-bot fields
      const payload = {
        ...formData,
        _ts: formTimestamp,  // timestamp for bot detection
        // 'website' field is honeypot — if filled, PHP silently discards
      };
      const res = await fetch('/contact-form.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  };

  const reset = () => { setStatus('idle'); setErrorMsg(''); };
  return { status, errorMsg, submitForm, reset };
};

// ========================================
// SITE MODE HOOK (ADMIN TOGGLE)
// ========================================
const useSiteMode = () => {
  const [siteMode, setSiteMode] = useState('group_only');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/admin/data/site-mode.json')
      .then(res => res.ok ? res.json() : { mode: 'group_only' })
      .then(data => setSiteMode(data.mode || 'group_only'))
      .catch(() => setSiteMode('group_only'))
      .finally(() => setLoading(false));
  }, []);

  return { siteMode, loading };
};

// ========================================
// HOOKS & UTILITIES
// ========================================

const useScrollAnimation = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isVisible];
};

const AnimatedSection = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const dirClass = direction === 'left' ? 'fade-left' : direction === 'right' ? 'fade-right' : 'fade-up';
  return (
    <div ref={ref} className={`${dirClass} ${isVisible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const AnimatedCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollAnimation(0.3);
  useEffect(() => {
    if (!isVisible) return;
    const num = parseInt(String(target).replace(/[^0-9]/g, ''));
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return <span ref={ref}>{typeof count === 'number' ? count.toLocaleString() : count}{suffix}</span>;
};

const useDocumentTitle = (title) => {
  useEffect(() => {
    const base = 'Mahalaxmi Group';
    document.title = title ? `${title} | ${base} — Industrial Excellence Since 1942` : `${base} | Industrial Excellence Since 1942`;
  }, [title]);
};

// ========================================
// PARALLAX IMAGE
// ========================================

const ParallaxImage = ({ src, alt, className = "" }) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const speed = 0.05; // Slower speed
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setOffset((window.innerHeight - rect.top) * speed - 50);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] transition-transform duration-75 ease-out will-change-transform" style={{ transform: `translateY(${offset}px)` }}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
    </div>
  );
};

// ========================================
// DATA
// ========================================

const PRODUCT_DATA = [
  { id: 'gs-308', name: 'Flash Set GS 308', category: 'Repair Mortar', desc: 'Rapid-setting cement for plugging leaks and emergency repairs.', code: 'Flash-Set', packaging: '20kg Bag', coverage: 'Variable', mixing: 'Quick mix', substrates: 'Concrete, Masonry', features: ['Stops running water', 'Sets in 1 minute', 'High early strength', 'Durable'], img: "https://images.pexels.com/photos/5691629/pexels-photo-5691629.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'hsm-600', name: 'GS HSM 600', category: 'Repair Mortar', desc: 'High strength fibre-reinforced mortar for structural repairs.', code: 'HSM-600', packaging: '25kg Bag', coverage: 'Variable', mixing: 'Mechanical', substrates: 'Concrete', features: ['High compressive strength', 'Non-shrink', 'Fibre reinforced', 'Abrasion resistant'], img: "https://images.pexels.com/photos/5691630/pexels-photo-5691630.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-126', name: 'Greengrout 126', category: 'Grouts', desc: 'General purpose non-shrink cementitious grout.', code: 'Grout-126', packaging: '25kg Bag', coverage: '13L yield', mixing: 'Mechanical', substrates: 'Base plates', features: ['Non-shrink', 'High flow', 'Chloride free', 'Good strength'], img: "https://images.pexels.com/photos/5582597/pexels-photo-5582597.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-306', name: 'Injection Grout GS 306', category: 'Grouts', desc: 'High strength injection grout for crack sealing.', code: 'Inj-306', packaging: '20kg Bag', coverage: 'Variable', mixing: 'Low shear', substrates: 'Cracks', features: ['Deep penetration', 'High strength', 'Non-shrink', 'Fills hairline cracks'], img: "https://images.pexels.com/photos/5582598/pexels-photo-5582598.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-309', name: 'Self Levelling Screed GS 309', category: 'Screeds', desc: 'Flowable self-levelling underlayment for floor preparation.', code: 'SLS-309', packaging: '25kg Bag', coverage: '1.6kg/mm/m2', mixing: 'High speed', substrates: 'Concrete floors', features: ['Self smoothing', 'Fast setting', 'Pumpable', 'Thin layer application'], img: "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-511', name: 'GS 511 (C1)', category: 'Tile Adhesives', desc: 'Standard polymer modified tile adhesive.', code: 'C1 Std', packaging: '20kg Bag', coverage: '3-6kg/m2', mixing: 'Mechanical', substrates: 'Concrete, Plaster', features: ['Good workability', 'Slip resistant', 'Extended open time', 'Economical'], img: "https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-512', name: 'GS 512 (C2)', category: 'Tile Adhesives', desc: 'High performance flexible tile adhesive.', code: 'C2 High', packaging: '20kg Bag', coverage: '3-6kg/m2', mixing: 'Mechanical', substrates: 'Tiles, Stone', features: ['High bond strength', 'Flexible', 'Water resistant', 'For large tiles'], img: "https://images.pexels.com/photos/6474475/pexels-photo-6474475.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-307', name: 'Greenseal Ultramix GS 307', category: 'Floor Hardener', desc: 'Non-metallic dry shake floor hardener.', code: 'Ultramix', packaging: '25kg Bag', coverage: '3-5kg/m2', mixing: 'Dry shake', substrates: 'Fresh concrete', features: ['Wear resistant', 'Dust proof', 'Impact resistant', 'Monolithic bond'], img: "https://images.pexels.com/photos/5691626/pexels-photo-5691626.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-513bc', name: 'Skim Coat Base GS 513BC', category: 'Wall Finishing', desc: 'Base coat for wall smoothing.', code: 'Base-513', packaging: '25kg', coverage: '1.2kg/mm/m2', mixing: 'Mechanical', substrates: 'Blockwork', features: ['Fills voids', 'Good adhesion', 'Easy sanding', 'Breathable'], img: "https://images.pexels.com/photos/5582865/pexels-photo-5582865.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-513tc', name: 'Skim Coat Top GS 513TC', category: 'Wall Finishing', desc: 'Finish coat for smooth wall surface.', code: 'Top-513', packaging: '25kg', coverage: '1.0kg/mm/m2', mixing: 'Mechanical', substrates: 'Base coat', features: ['Smooth finish', 'White/Grey', 'crack resistant', 'Paint ready'], img: "https://images.pexels.com/photos/5582866/pexels-photo-5582866.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-515', name: 'Plaster Mortar GS 515', category: 'Plaster Mortar', desc: 'Premixed dry plaster for internal/external walls.', code: 'Plaster-515', packaging: '40kg', coverage: '18kg/10mm/m2', mixing: 'Mechanical', substrates: 'Brick, Block', features: ['Consistent quality', 'Minimal wastage', 'Crack control', 'Weather resistant'], img: "https://images.pexels.com/photos/5691627/pexels-photo-5691627.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-516', name: 'Greenscreed GS 516', category: 'Screeds', desc: 'Premixed floor screed mortar.', code: 'Screed-516', packaging: '40kg', coverage: '20kg/10mm/m2', mixing: 'Mechanical', substrates: 'Concrete', features: ['High strength', 'Suitable for falls', 'Tile bed', 'Durable'], img: "https://images.pexels.com/photos/5691625/pexels-photo-5691625.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-flexi', name: 'Greenseal Flexi 201/202', category: 'Waterproofing', desc: 'Flexible cementitious waterproofing coating.', code: 'Flexi-200', packaging: '35kg Set', coverage: '1kg/layer/m2', mixing: 'Mechanical', substrates: 'Concrete, Masonry', features: ['Flexible', 'Crack bridging', 'Non-toxic', 'Positive pressure'], img: "https://images.pexels.com/photos/5691623/pexels-photo-5691623.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'gs-5000', name: 'GS 5000 (PU)', category: 'Waterproofing', desc: 'Liquid applied polyurethane waterproofing membrane.', code: 'PU-5000', packaging: '20kg Pail', coverage: '1.2kg/m2', mixing: 'Ready to use', substrates: 'Roofs, Decks', features: ['Seamless', 'UV resistant', 'High elongation', 'Root resistant'], img: "https://images.pexels.com/photos/5691624/pexels-photo-5691624.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'polydek', name: 'Polydek', category: 'Waterproofing', desc: 'Acrylic polymer waterproofing membrane.', code: 'Polydek', packaging: '20kg Pail', coverage: '0.5kg/coat/m2', mixing: 'Ready to use', substrates: 'Roofs, Walls', features: ['Water based', 'UV resistant', 'Decorative Pail', 'Easy apply'], img: "https://images.pexels.com/photos/8961162/pexels-photo-8961162.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'multiseal', name: 'Multiseal 2000', category: 'Waterproofing', desc: 'Crystalline liquid waterproofing.', code: 'MS-2000', packaging: '20L/200L', coverage: '5m2/L', mixing: 'Spray', substrates: 'Concrete', features: ['Deep penetration', 'Permanent', 'Self-healing', 'Cost effective'], img: "https://images.pexels.com/photos/7218525/pexels-photo-7218525.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'greenshield', name: 'Greenshield 108', category: 'Heat Coating', desc: 'Heat reflective waterproofing coating.', code: 'GS-108', packaging: '20kg Pail', coverage: '0.3kg/m2', mixing: 'Ready to use', substrates: 'Roofs', features: ['Reduces heat', 'Energy saving', 'Waterproof', 'Elastic'], img: "https://images.pexels.com/photos/5582600/pexels-photo-5582600.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 'waterstop', name: 'Greenseal PVC Waterstop', category: 'Waterproofing', desc: 'PVC waterstop for construction joints.', code: 'PVC-WS', packaging: 'Roll', coverage: 'Linear', mixing: 'N/A', substrates: 'Joints', features: ['High tensile', 'Chemical resistant', 'Ribbed profile', 'Welded joints'], img: "https://images.pexels.com/photos/5582599/pexels-photo-5582599.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

const PROJECT_DATA = [
  {
    id: 'bullet-train',
    name: "National Bullet Train",
    loc: "Ahmedabad-Mumbai",
    type: "High-Speed Rail",
    products: "GS 512, Silica Sand",
    year: "2023-Present",
    desc: "Supplying high-grade silica sand and structural adhesives for the casting yards of India's first high-speed rail corridor.",
    challenge: "Consistent supply of 500 tons/day with strict grading.",
    solution: "Dedicated mining lines and automated washing units deployed.",
    img: "/images/bullet-train-main.jpeg",
    gallery: ["/images/bullet-train-detail-1.webp"]
  },
  {
    id: 'shenzhen-metro',
    name: "Shenzhen Metro Line 20",
    loc: "China",
    type: "Infrastructure",
    products: "Injection Grouts",
    year: "2021",
    desc: "Provided specialized waterproofing injection grouts for tunnel segments in high water-table zones.",
    challenge: "High-pressure water ingress prevention.",
    solution: "Custom formulated rapid-setting polyurethane grout.",
    img: "/images/shenzhen-metro-main.jpeg",
    gallery: ["/images/shenzhen-metro-detail-1.jpg", "/images/shenzhen-metro-detail-2.webp"]
  },
  {
    id: 'singapore-lrt',
    name: "Singapore LRT",
    loc: "Singapore",
    type: "Mass Transit",
    products: "Repair Mortars",
    year: "2020",
    desc: "Structural repair works for aging viaducts using high-strength polymer mortars.",
    challenge: "Fast turnaround time during maintenance windows.",
    solution: "GS 306 High-Early strength mortar.",
    img: "/images/singapore-lrt-main.webp",
    gallery: ["/images/singapore-lrt-detail-1.jpg"]
  },
  {
    id: 'mumbai-metro',
    name: "Mumbai Metro Line 3",
    loc: "Mumbai",
    type: "Mass Transit",
    products: "Self-Levelling Screeds",
    year: "2022",
    desc: "Underground station flooring leveling for platform screen door installation.",
    challenge: "Zero-tolerance flatness requirement.",
    solution: "GS 309 Flow-Master screed system.",
    img: "/images/mumbai-metro-main.jpeg",
    gallery: ["/images/mumbai-metro-detail-1.webp"]
  },
  {
    id: 'one-avighna',
    name: "One Avighna Park",
    loc: "Mumbai",
    type: "Luxury Residential",
    products: "Greenseal Waterproofing",
    year: "2019",
    desc: "Complete wet-area waterproofing for 60+ story luxury residential towers.",
    challenge: "Leak-free guarantee for premium finishing.",
    solution: "Integrated Greenseal crystalline system.",
    img: "/images/one-avighna-main.jpg",
    gallery: ["/images/one-avighna-detail-1.jpg"]
  },
  {
    id: 'nhai-highway',
    name: "NHAI Highway NH-08",
    loc: "Gujarat",
    type: "Highway",
    products: "Silica Sand, Basalt",
    year: "2021",
    desc: "Mineral material supply for major national highway construction and repair.",
    challenge: "Logistical coordination across remote sites.",
    solution: "Regional warehousing hubs and dedicated fleet.",
    img: "/images/nhai-highway-main.jpg",
    gallery: ["/images/nhai-highway-detail-1.jpeg"]
  },
  {
    id: 'lodha-project',
    name: "Lodha World Towers",
    loc: "Mumbai",
    type: "Premium Residential",
    products: "GS 512, Skim Coats",
    year: "2020",
    desc: "Premium tiling and wall finishing for one of Mumbai's tallest residential complexes.",
    challenge: "Large-format tile fixing at height.",
    solution: "GS 512 C2 high-strength system with technical guidance.",
    img: "/images/lodha-towers-main.webp",
    gallery: ["/images/lodha-towers-detail-1.webp"]
  },
  {
    id: 'dlf-mall',
    name: "DLF Mall of India",
    loc: "Noida",
    type: "Commercial",
    products: "GS 511, GS 309",
    year: "2019",
    desc: "Floor leveling and tile fixing for one of India's largest shopping malls.",
    challenge: "Fast-track schedule with zero rework tolerance.",
    solution: "Pre-planned system approach with on-site engineer.",
    img: "/images/dlf-mall-main.jpg",
    gallery: ["/images/dlf-mall-detail-1.avif"]
  },
  {
    id: 'jsw-plant',
    name: "JSW Steel Plant",
    loc: "Maharashtra",
    type: "Industrial",
    products: "Basalt, M-Sand",
    year: "2022-Present",
    desc: "Continuous supply of mineral aggregates for plant expansion and maintenance.",
    challenge: "24/7 supply chain without interruptions.",
    solution: "Automated stockpile management with GPS fleet tracking.",
    img: "/images/jsw-steel-main.jpeg",
    gallery: ["/images/jsw-steel-detail-1.jpg"]
  },
];

const DIVISION_DATA = [
  { id: 'chemicals', view: 'chemicals', name: "Mahalaxmi Construction Chemicals", role: "Construction Chemicals", desc: "Greenseal waterproofing, tile adhesives, and repair mortars. UK Technology transfer.", icon: <FlaskConical size={32} /> },
  { id: 'millennium', view: 'millennium', name: "Mahalaxmi Millennium", role: "Mining & Aggregates", desc: "Basalt mining, M-Sand, and aggregate supply for mega-projects (Bullet Train, Expressways).", icon: <HardHat size={32} /> },
  { id: 'shiv', view: 'shiv', name: "Shiv Minerals", role: "Foundry & Glass Sand", desc: "Industrial silica sand processing (20,000 MT/month). Supplying Metso, Mahindra, Tata.", icon: <Microscope size={32} /> },
  { id: 'oem', view: 'oem', name: "Contract Manufacturing", role: "OEM Services", desc: "Private label manufacturing facility for international construction chemical brands.", icon: <Factory size={32} /> },
  { id: 'logistics', view: 'transport', name: "Logistics & Fleet", role: "Transport", desc: "Proprietary fleet of 50+ tippers and bulk carriers ensuring on-time material delivery.", icon: <Truck size={32} /> },
  { id: 'infra', view: 'infra', name: "Infrastructure", role: "RMC & Infra", desc: "Ready-Mix Concrete (RMC) and infrastructure development solutions.", icon: <Building2 size={32} /> },
];

// ========================================
// NEW COMPONENTS
// ========================================

const TrustedByMarquee = () => (
  <section className="py-12 border-y border-gray-100 bg-gray-50/50 overflow-hidden">
    <div className="container mx-auto px-4 md:px-16 mb-8">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500">Trusted by Industry Leaders</p>
    </div>
    <div className="relative flex overflow-x-hidden group">
      <div className="flex animate-scroll whitespace-nowrap pause-on-hover">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-12 mx-6 items-center flex-nowrap">
            {[
              { name: 'Shapoorji Pallonji', img: '/images/logo-shapoorji.svg' },
              { name: 'DLF', img: '/images/logo-dlf.svg' },
              { name: 'Metso', img: '/images/logo-metso.webp' },
              { name: 'Sandvik', img: '/images/logo-sandvik.webp' },
              { name: 'Ultratech', img: '/images/logo-ultratech.webp' },
              { name: 'L&T', img: '/images/logo-lt.webp' },
              { name: 'JSW', img: '/images/logo-jsw.webp' },
              { name: 'Tata Motors', img: '/images/logo-tata-motors.webp' },
              { name: 'Mahindra', img: '/images/logo-mahindra.webp' },
              { name: 'ACC', img: '/images/logo-acc.webp' },
              { name: 'Godrej', img: '/images/logo-godrej.svg' }
            ].map((logo, j) => (
              <div key={j} className="flex-shrink-0 flex justify-center items-center h-20 w-40 bg-white rounded-lg shadow-sm border border-gray-100 px-4 opacity-70 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0">
                <img src={logo.img} alt={logo.name} className="max-h-12 w-auto object-contain" width="120" height="48" loading="lazy" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = ({ division }) => {
  const images = {
    'Chemicals': '/images/chemicals-product-range.webp',
    'Shiv Minerals': '/images/mining-operations.webp',
    'Transport & Logistics': '/images/logistics-fleet.webp',
    'OEM Manufacturing': '/images/oem-manufacturing.webp',
    'Infrastructure': '/images/infrastructure-background.webp',
    'Mahalaxmi Group (HQ)': '/images/mahalaxmi-group-hq.webp',
    'Mahalaxmi Millennium': '/images/basalt-mining.jpeg'
  };
  const divisionFormTypes = {
    'Chemicals': 'chemicals',
    'Shiv Minerals': 'shiv',
    'Transport & Logistics': 'transport',
    'OEM Manufacturing': 'oem',
    'Infrastructure': 'infra',
    'Mahalaxmi Group (HQ)': 'general',
    'Mahalaxmi Millennium': 'millennium'
  };
  const bgImage = images[division] || '/images/mahalaxmi-group-hq.webp';
  const formType = divisionFormTypes[division] || 'general';

  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const { status, errorMsg, submitForm, reset } = useFormSubmit();
  const loading = status === 'sending';
  const success = status === 'success';

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm({ ...formData, form_type: formType, division });
  };

  return (
    <section className="py-20 bg-white mt-auto overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2">
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-2">Let's Talk</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-emerald-950 mb-6 tracking-tight">Contact Us</h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Partner with {division} for specialized technical support, commercial inquiries, or project consultation. Our team ensures a response within 24 hours.
            </p>
            {success ? (
              <div className="text-center py-12 bg-emerald-50 rounded-2xl">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} className="text-emerald-600" /></div>
                <h3 className="text-xl font-bold text-emerald-950 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-4">We'll get back to you within 24 hours.</p>
                <button onClick={() => { reset(); setFormData({ name: '', email: '', message: '', website: '' }); }} className="text-emerald-600 font-bold hover:underline">Send another message</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Honeypot — hidden from users, bots fill it */}
                <input type="text" name="website" value={formData.website} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-base focus:ring-2 focus:ring-emerald-500 outline-none transition-all card-hover" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Your email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-base focus:ring-2 focus:ring-emerald-500 outline-none transition-all card-hover" />
                <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Your message" rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-base focus:ring-2 focus:ring-emerald-500 outline-none transition-all card-hover"></textarea>
                {errorMsg && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{errorMsg}</div>}
                <div className="w-full md:w-1/3">
                  <Button variant="primary" className="w-full py-4 uppercase tracking-widest font-bold" onClick={handleSubmit}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </div>
          <div className="lg:w-1/2 w-full mt-10 lg:mt-0">
            <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 border-8 border-white">
              <img src={bgImage} alt={`${division} Operations`} className="w-full h-[400px] object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CallbackSection = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', website: '' });
  const { status, errorMsg, submitForm, reset } = useFormSubmit();
  const loading = status === 'sending';
  const success = status === 'success';

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm({ ...formData, email: 'callback@placeholder.com', message: 'Callback request', form_type: 'callback' });
  };

  return (
    <section className="py-12 bg-emerald-50/30 dot-pattern">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-2">Let's Talk</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-emerald-950 mb-4 tracking-tight">Request a Callback</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Need expert advice? Leave your details and our technical team will reach out to discuss your project requirements.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {success ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle2 size={24} className="text-emerald-600" /></div>
              <h3 className="text-lg font-bold text-emerald-950 mb-1">We'll call you back!</h3>
              <p className="text-gray-500 text-sm">Our team will reach out within a few hours.</p>
            </div>
          ) : (
            <form className="grid md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
              {/* Honeypot */}
              <input type="text" name="website" value={formData.website} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className="w-full bg-white border border-gray-100 rounded-xl p-4 text-base shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all card-hover" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Your phone number" className="w-full bg-white border border-gray-100 rounded-xl p-4 text-base shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all card-hover" />
              <Button variant="gold" className="w-full py-4 uppercase tracking-widest font-bold shadow-lg" onClick={handleSubmit}>
                {loading ? 'Sending...' : 'Submit Request'}
              </Button>
            </form>
          )}
          {errorMsg && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg mt-4 text-center">{errorMsg}</div>}
        </div>
      </div>
    </section>
  );
};

const ProductGallerySection = () => {
  const slides = [
    [
      "/images/chemicals-lab-testing.webp",
      "/images/chemicals-product-range.webp",
      "/images/oem-manufacturing.webp",
      "/images/mahalaxmi-group-hq.webp"
    ],
    [
      "/images/mining-operations.webp",
      "/images/warehouse-interior.webp",
      "/images/product-catalogue-cover.webp",
      "/images/logistics-trucks.webp"
    ],
    [
      "/images/infrastructure-project.webp",
      "/images/construction-site.webp",
      "/images/infrastructure-background.webp",
      "/images/safety-equipment.webp"
    ],
    [
      "/images/logistics-fleet.webp",
      "/images/logistics-fleet-2.jpeg",
      "/images/transport-contracts.jpg",
      "/images/basalt-mining.jpeg"
    ],
    [
      "/images/warehousing-hub.webp",
      "/images/warehousing-interior.jpeg",
      "/images/chemical-company.jpg",
      "/images/chemical-plant-exterior.webp"
    ]
  ];
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-2">Showcase</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-emerald-950 mb-4 tracking-tight">Our Gallery</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Witness our industrial operations and product applications across various high-growth sectors.
          </p>
        </div>

        <div className="relative group">
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
            {slides.map((slide, idx) => (
              <div key={idx} className="w-full flex-shrink-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                  {slide.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md card-hover group/item relative">
                      <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" alt="Gallery" loading="lazy" />
                      <div className="absolute inset-0 bg-emerald-950/0 group-hover/item:bg-emerald-950/20 transition-all duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button aria-label="Previous gallery slide" onClick={() => setCurrent(prev => (prev === 0 ? slides.length - 1 : prev - 1))} className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-emerald-950 hover:bg-emerald-950 hover:text-white transition-colors opacity-0 group-hover:opacity-100 group-hover:left-0 z-20">
            <ArrowLeft size={20} />
          </button>
          <button aria-label="Next gallery slide" onClick={() => setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1))} className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-emerald-950 hover:bg-emerald-950 hover:text-white transition-colors opacity-0 group-hover:opacity-100 group-hover:right-0 z-20">
            <ArrowRight size={20} />
          </button>

          <div className="flex justify-center gap-3 mt-12">
            {slides.map((_, i) => (
              <button key={i} aria-label={`Go to gallery slide ${i + 1}`} onClick={() => setCurrent(i)} className={`h-1.5 transition-[width] duration-300 rounded-full ${current === i ? 'w-8 bg-amber-500' : 'w-4 bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ========================================
// SEPARATE DIVISION VIEWS (PHASE 2)
// ========================================

const GroupView = ({ setView }) => (
  <>
    <PageHead title="Mahalaxmi Group" description="A fourth-generation industrial powerhouse spanning mining, chemicals, and logistics." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/95 to-emerald-950/80"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10"><AnimatedSection className="max-w-4xl">
        <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">Since 1942</div>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4">Mahalaxmi Group</h1>
        <p className="text-xl text-emerald-100/90 mb-8 font-light">A Fourth-Generation Industrial Powerhouse Est. 1942</p>
        <p className="text-lg text-emerald-100/80 mb-12 max-w-2xl leading-relaxed font-medium">A ₹100+ Crore conglomerate spanning mineral processing, construction chemicals, transportation, and warehousing.</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="gold" onClick={() => setView('divisions')}>View Divisions <ArrowRight size={18} /></Button>
          <Button variant="ghost" onClick={() => setView('contact')}>Contact Us</Button>
        </div>
      </AnimatedSection></div>
    </section>
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed md:prose-xl max-w-4xl">
          <AnimatedSection>
            <p>From humble beginnings in trading and mining, we have evolved into a diversified conglomerate with operations across India and international markets. Our legacy is built on trust, adaptability, and an unyielding commitment to "Make in India".</p>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="grid md:grid-cols-4 gap-4 my-12 not-prose">
              {[{ n: '82+', l: 'Years Legacy' }, { n: 'ISO', l: '9001:2015' }, { n: 'UK', l: 'Technology' }, { n: '₹100Cr+', l: 'Revenue' }].map((item, i) => (
                <div key={i} className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 font-bold text-emerald-900 text-center">
                  <div className="text-2xl font-black text-emerald-950 mb-1">{item.n}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500">{item.l}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
    <ContactSection division="Mahalaxmi Group (HQ)" />
  </>
);

const MillenniumView = ({ setView }) => (
  <>
    <PageHead title="Mahalaxmi Millennium" description="Strategic basalt mining and M-Sand production for mega-infrastructure projects." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/95 to-emerald-950/80"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10"><AnimatedSection className="max-w-4xl">
        <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">Mining & Aggregates</div>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4">Mahalaxmi Millennium</h1>
        <p className="text-xl text-emerald-100/90 mb-8 font-light">Powering Mega-Projects with Basalt & M-Sand</p>
        <p className="text-lg text-emerald-100/80 mb-12 max-w-2xl leading-relaxed font-medium">Strategic mining operations supplying high-grade aggregates for India's most critical infrastructure projects — from the Mumbai-Ahmedabad Bullet Train corridor to national expressways and metro rail systems.</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="gold" onClick={() => setView('projects')}>View Projects <ArrowRight size={18} /></Button>
          <Button variant="ghost" onClick={() => setView('contact')}>Request Quote</Button>
        </div>
      </AnimatedSection></div>
    </section>

    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <AnimatedSection direction="left">
            <img src="/images/mining-operations.webp" className="rounded-2xl shadow-2xl h-[400px] object-cover w-full" alt="Mahalaxmi Millennium Mining Operations" />
          </AnimatedSection>
          <AnimatedSection direction="right" delay={200}>
            <h3 className="text-2xl font-bold text-emerald-950 mb-6 uppercase tracking-tight">Strategic Mining Operations</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">Operating from Phonda Ghat and Wada Palghar, we manage the entire value chain — selective basalt mining, advanced crushing, screening, and washing — to deliver aggregates that meet the exacting specifications of India's largest infrastructure contractors.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">Our operations are designed for scale. With automated crushing lines processing 500+ tons daily, we ensure uninterrupted supply even during peak construction seasons. Every batch is tested for gradation, flakiness index, and impact value before dispatch.</p>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start"><HardHat className="text-amber-500 shrink-0" /> <div><strong>Bullet Train (HSR) Supplier:</strong> Delivered 4 Lakh tons in 18 months.</div></li>
              <li className="flex gap-3 items-start"><Factory className="text-amber-500 shrink-0" /> <div><strong>Key Clients:</strong> L&T, UltraTech, ACC, Milan Infrastructure, Megha Engineering.</div></li>
              <li className="flex gap-3 items-start"><Truck className="text-amber-500 shrink-0" /> <div><strong>Capacity:</strong> 500+ tons/day with automated crushing lines.</div></li>
            </ul>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={300}>
          <div className="grid md:grid-cols-4 gap-6">
            {[{ n: '4L+', s: 'Tons Delivered', l: 'For Bullet Train' }, { n: '500', s: 'T/Day', l: 'Mining Capacity' }, { n: '2', s: 'Active Sites', l: 'Mining Locations' }, { n: '50+', s: 'Vehicles', l: 'Transport Fleet' }].map((s, i) => (
              <div key={i} className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100 text-center card-hover">
                <div className="text-3xl font-black text-emerald-950 mb-1">{s.n}</div>
                <div className="text-xs font-bold text-amber-600 mb-2">{s.s}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Silica Sand & Aggregate Products */}
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="right" className="order-2 lg:order-1">
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Product Range</div>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-6 uppercase tracking-tight">Silica Sand & Aggregate Supply</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">At our Phonda Ghat operations, we produce high-quality silica sand alongside our basalt aggregate portfolio. Our silica sand meets the stringent quality requirements of both the glass manufacturing and foundry casting industries.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">The operation spans surface mining, washing, grading, and packaging — all conducted under strict environmental compliance. We maintain dedicated stockpiles for different grades, enabling rapid fulfillment of large-volume orders without compromising quality consistency.</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { n: "Basalt Aggregates", d: "10mm & 20mm", img: "/images/millennium-basalt-20mm.jpeg", badge: "Stone" },
                { n: "Crush Sand", d: "For Concrete", img: "/images/millennium-crush-sand.jpeg", badge: "M-Sand" },
                { n: "Construction Sand", d: "15–20 AFS Wet", img: "/images/millennium-construction-sand.jpeg", badge: "Construction" },
                { n: "Road Metal", d: "WBM & Base Course", img: "/images/basalt-mining.jpeg", badge: "Aggregate" }
              ].map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm card-hover">
                  <div className="aspect-square overflow-hidden">
                    <img src={p.img} alt={p.n} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-3 text-center">
                    <div className="font-black text-emerald-950 text-sm">{p.n}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5 px-2 py-0.5 rounded-full inline-block bg-amber-50 text-amber-600">{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection direction="left" delay={200} className="order-1 lg:order-2">
            <img src="/images/basalt-mining.jpeg" className="rounded-2xl shadow-2xl h-[400px] object-cover w-full" alt="Mining operations at Phonda Ghat" />
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* Historical Operations & Legacy */}
    <section className="py-16 md:py-24 bg-emerald-950 text-white">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-4">Our Legacy</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Decades of Mining Excellence</h3>
            <p className="text-emerald-100/80 text-lg leading-relaxed">Mahalaxmi Millennium builds on a legacy that stretches back decades. From early silica sand mining operations under MSMC lease (1998–2014) to today's large-scale basalt and aggregate operations, we have continuously evolved our capabilities to match the growing demands of India's infrastructure boom.</p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { y: "1998–2014", t: "Silica Sand Mining", d: "Operated silica sand mine under Maharashtra State Mining Corporation (MSMC) lease, building expertise in mineral extraction and processing." },
            { y: "2015–2020", t: "Basalt & Aggregate Expansion", d: "Scaled operations to Phonda Ghat and Wada Palghar with automated crushing lines, serving Bullet Train HSR and national expressway projects." },
            { y: "2020–Present", t: "Integrated Operations", d: "Full value chain from mining to transport. Partnered with Amazon India for warehousing, expanded to serve ACC, Megha Engineering, and Milan Infrastructure." }
          ].map((era, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 card-hover h-full">
                <div className="text-amber-500 font-black text-lg mb-2">{era.y}</div>
                <h4 className="text-lg font-bold mb-3">{era.t}</h4>
                <p className="text-emerald-100/60 text-sm leading-relaxed">{era.d}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Warehousing & Partnerships */}
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <ParallaxImage src="/images/warehousing-hub.webp" alt="Warehousing operations" className="h-[350px] md:h-[400px] w-full shadow-2xl" />
          </AnimatedSection>
          <AnimatedSection direction="right" delay={200}>
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Strategic Partnerships</div>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-6 uppercase tracking-tight">Mega Infrastructure Partnerships</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">Our proven track record in fulfilling massive volume requirements has made Mahalaxmi Millennium the preferred aggregate partner for India's leading infrastructure and cement conglomerates.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">Through dedicated supply lines, automated crushing plants, and our robust logistics network, we ensure zero-downtime raw material availability for critical national projects, including high-speed rail networks, expressways, and heavy industrial applications.</p>
            <div className="flex flex-wrap gap-3">
              {['L&T', 'UltraTech', 'ACC', 'Milan Infra', 'Megha Engg', 'Shapoorji Pallonji'].map(c => <span key={c} className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 text-xs font-bold uppercase tracking-wider">{c}</span>)}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

    <ProductGallerySection />
    <ContactSection division="Mahalaxmi Millennium" />
  </>
);

const ShivMineralsView = ({ setView }) => (
  <>
    <PageHead title="Shiv Minerals" description="Industrial-scale silica sand mining and processing for foundry and glass industries." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.pexels.com/photos/2988232/pexels-photo-2988232.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/95 to-emerald-950/80"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10"><AnimatedSection className="max-w-4xl">
        <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">Silica & Sand</div>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4">Shiv Minerals</h1>
        <p className="text-xl text-emerald-100/90 mb-8 font-light">Industrial-Scale Silica & Sand Supply</p>
        <p className="text-lg text-emerald-100/80 mb-12 max-w-2xl leading-relaxed font-medium">Shiv Minerals operates a dedicated silica mining setup in Bharuch with a 20,000-ton monthly capacity. We serve the Glass and Foundry industries, ensuring a constant, high-quality reservoir of raw material for our partners.</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="gold" onClick={() => setView('contact')}>Request Sample <ArrowRight size={18} /></Button>
          <Button variant="ghost" onClick={() => setView('divisions')}>All Divisions</Button>
        </div>
      </AnimatedSection></div>
    </section>

    {/* About Shiv Minerals */}
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="bg-amber-50 rounded-3xl p-8 md:p-12 border border-amber-100 mb-16">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-emerald-950 mb-4 uppercase tracking-tight">Industrial-Scale Silica Processing</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">Shiv Minerals, established in 2017 at Jhagadia, is one of the largest silica sand manufacturers and processors in India. We specialise in silica sand for the foundry and glass industries.</p>
                <p className="text-gray-700 mb-6 leading-relaxed">This industrial-scale operation ensures a constant, high-quality reservoir of raw material, mitigating supply chain risks and guaranteeing uninterrupted availability for our partners. Silica sand is sourced from Bharuch, while M-sand and construction sand are produced at our <strong>Manor factory, Palghar</strong> (Wada Palghar), maintaining clear structure and quality control.</p>
                <p className="text-gray-700 font-bold mb-4">Key Clients:</p>
                <div className="flex flex-wrap gap-3">
                  {['Metso', 'Mahindra CIE', 'Tata Motors (Telco)', 'Sandvik', 'Canpack Glass', 'Haldyn Glass'].map(c => <span key={c} className="bg-white px-4 py-2 rounded-full border border-gray-200 text-xs font-bold uppercase tracking-wider shadow-sm">{c}</span>)}
                </div>
              </div>
              <div className="w-40 h-40 bg-amber-500 rounded-full flex flex-col items-center justify-center text-white text-center shrink-0 shadow-xl border-8 border-white">
                <div className="text-3xl font-black">20K</div>
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">MT/Month</div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
              <h4 className="text-lg font-bold text-emerald-950 uppercase mb-4">Foundry Sand</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">Silica sand for the foundry industry, serving major clients such as Metso, Sandvik, Tata Motors (Telco), and Mahindra CIE. We specialise in consistent quality supply for casting applications.</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
              <h4 className="text-lg font-bold text-emerald-950 uppercase mb-4">Glass Grade Sand</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">Silica sand for the glass industry, supplying Canpack Glass and Haldyn Glass Limited. Our industrial-scale operation guarantees uninterrupted availability and consistent quality for glass manufacturing.</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Available AFS Grades */}
        <AnimatedSection delay={300}>
          <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-2">Available Grades</div>
          <h4 className="text-xl font-bold text-emerald-950 mb-6 uppercase tracking-tight">Silica Sand — AFS Grades</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "30–40 AFS", type: "Dry", img: "/images/shiv-dry-30-40.jpeg" },
              { label: "40–50 AFS", type: "Dry", img: "/images/shiv-dry-40-50.jpeg" },
              { label: "50–60 AFS", type: "Dry", img: "/images/shiv-dry-50-60.jpeg" },
              { label: "40–50 AFS", type: "Wet", img: "/images/shiv-wet-40-50.jpeg" },
              { label: "50–60 AFS", type: "Wet (MT)", img: "/images/shiv-wet-50-60.jpeg" },
            ].map((g, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm card-hover">
                <div className="aspect-square overflow-hidden">
                  <img src={g.img} alt={`${g.label} ${g.type} Silica Sand`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-3 text-center">
                  <div className="font-black text-emerald-950 text-sm">{g.label}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 px-2 py-0.5 rounded-full inline-block ${g.type.startsWith('Wet') ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>{g.type}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">* 15–20 AFS Wet (Construction grade) also available. Contact us for specifications.</p>
        </AnimatedSection>
      </div>
    </section>

    {/* Growth Journey */}
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <img src="/images/basalt-mining.jpeg" className="rounded-2xl shadow-2xl h-[400px] object-cover w-full" alt="Shiv Minerals operations" />
          </AnimatedSection>
          <AnimatedSection direction="right" delay={200}>
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Our Growth Journey</div>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-6 uppercase tracking-tight">From 4,000 to 20,000 Tons</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">Shiv Minerals started with a capacity of 4,000 tons/month. Through continuous expansion, we have grown four times to reach our current capacity of 20,000 tons/month today.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">We specialise in silica sand for the foundry and glass industries. Key clients include Metso, Mahindra, Tata Motors (Telco), Sandvik, and several reputed multinational corporations.</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl font-black text-emerald-950">4x</div>
                <div className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">Expansion</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl font-black text-emerald-950">20K</div>
                <div className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">MT/Month</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <div className="text-2xl font-black text-emerald-950">2017</div>
                <div className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">Established</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* Operations & Supply */}
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="right" delay={200} className="order-2 lg:order-1">
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Mining Operations</div>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-6 uppercase tracking-tight">Our Leadership & Mining Strength</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">Shiv Minerals operates a dedicated silica mining setup in Bharuch with a 20,000-ton monthly capacity. Silica sand is sourced from Bharuch, while M-sand is produced at Wada Palghar, maintaining clear structure and quality control.</p>
            <p className="text-gray-600 mb-8 leading-relaxed">We serve the Glass and Foundry industries, supplying major clients such as Mahindra CIE, Metso, Sandvik, Canpack Glass, and Haldyn Glass Limited. This industrial-scale operation mitigates supply chain risks and guarantees uninterrupted availability for our partners.</p>
          </AnimatedSection>
          <AnimatedSection direction="left" className="order-1 lg:order-2">
            <img src="/images/warehousing-interior.jpeg" className="rounded-2xl shadow-2xl h-[400px] object-cover w-full" alt="Shiv Minerals mining operations" />
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* Closing Note */}
    <section className="py-16 md:py-24 bg-emerald-950 text-white">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-4">Our Commitment</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Building Long-Term Relationships</h3>
            <p className="text-emerald-100/80 text-lg leading-relaxed mb-6">We believe in building long-term relationships with strong organizations. With decades of experience, robust resources, and a commitment to excellence, we are confident of delivering value and fulfilling every responsibility we undertake.</p>
            <p className="text-emerald-100/80 text-lg leading-relaxed">Together, we aim to achieve mutual growth and success.</p>
          </div>
        </AnimatedSection>
      </div>
    </section>

    <ProductGallerySection />
    <ContactSection division="Shiv Minerals" />
  </>
);



const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('menu'); // 'menu', 'faq', 'whatsapp'
  const [msg, setMsg] = useState('');

  const faqs = [
    { q: "What products do you offer?", a: "We offer technical mortars, waterproofing systems, tile adhesives, and industrial minerals." },
    { q: "Where can I buy?", a: "Our products are available through our distributor network across India. Contact us for details." },
    { q: "Do you provide technical support?", a: "Yes, our engineers can assist with product selection and application guidance." },
    { q: "How to apply waterproofing?", a: "Clean the surface, mix the product as per datasheet, and apply two coats." }
  ];

  const handleWhatsApp = () => {
    const text = msg.trim() || "Hi, I need assistance.";
    window.open(`https://wa.me/919821050005?text=${encodeURIComponent(text)}`, '_blank');
  };

  const reset = () => {
    setIsOpen(false);
    setTimeout(() => {
      setView('menu');
      setMsg('');
    }, 300);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3 font-sans">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-[calc(100vw-2rem)] max-w-[320px] md:w-80 mb-1 border border-emerald-100 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-emerald-950 p-3 md:p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-2">
              {view !== 'menu' && <button onClick={() => setView('menu')} className="hover:bg-white/10 p-1 rounded-full transition-colors"><ChevronLeft size={16} /></button>}
              <div>
                <h4 className="font-bold text-xs md:text-sm">{view === 'menu' ? 'Mahalaxmi Support' : view === 'faq' ? 'Technical FAQs' : 'Chat on WhatsApp'}</h4>
                {view === 'whatsapp' && <p className="text-[10px] text-emerald-200 opacity-80">Online • Typically replies in 5m</p>}
              </div>
            </div>
            <button onClick={reset} className="hover:bg-white/10 p-1 rounded-full transition-colors"><X size={16} /></button>
          </div>

          {/* Content */}
          <div className="p-3 md:p-4 bg-gray-50/50 min-h-[250px] max-h-[350px] md:min-h-[300px] md:max-h-[400px] overflow-y-auto">
            {view === 'menu' && (
              <div className="space-y-2">
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Select an option</p>
                <button onClick={() => setView('faq')} className="w-full text-left p-2.5 md:p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex justify-between items-center group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0"><HelpCircle size={14} /></div>
                    <span className="text-xs md:text-sm font-bold text-gray-700 group-hover:text-emerald-900">Technical Support (FAQs)</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 shrink-0" />
                </button>
                <button onClick={() => setView('whatsapp')} className="w-full text-left p-2.5 md:p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#25D366] transition-all flex justify-between items-center group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-green-50 rounded-full flex items-center justify-center text-[#25D366] shrink-0"><MessageSquare size={14} /></div>
                    <span className="text-xs md:text-sm font-bold text-gray-700 group-hover:text-emerald-900">Chat on WhatsApp</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-[#25D366] shrink-0" />
                </button>
                <div className="border-t border-gray-100 my-2 pt-1"></div>
                <Link to="/contact" onClick={reset} className="w-full text-left p-2.5 md:p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex justify-between items-center group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0"><FileText size={14} /></div>
                    <span className="text-xs md:text-sm font-bold text-gray-700 group-hover:text-emerald-900">Request Quote</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-emerald-500 shrink-0" />
                </Link>
              </div>
            )}

            {view === 'faq' && (
              <div className="space-y-2.5">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="font-bold text-emerald-950 text-[11px] mb-1.5 flex gap-2"><HelpCircle size={12} className="text-amber-500 shrink-0 mt-0.5" /> {f.q}</div>
                    <div className="text-gray-600 text-[11px] leading-relaxed pl-5 border-l-2 border-emerald-100">{f.a}</div>
                  </div>
                ))}
              </div>
            )}

            {view === 'whatsapp' && (
              <div>
                <div className="bg-green-50 p-3 rounded-xl border border-green-100 mb-3">
                  <p className="text-[11px] text-emerald-900 leading-relaxed"><strong>How can we help?</strong><br />Type your message below and we'll open WhatsApp for you.</p>
                </div>
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent mb-3 h-28 resize-none shadow-inner"
                  placeholder="Hi, I'm interested in..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  autoFocus
                />
                <button onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
                  Start WhatsApp Chat <MessageSquare size={16} fill="white" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <button aria-label={isOpen ? 'Close chat' : 'Open chat support'} onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 md:w-16 md:h-16 bg-emerald-950 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 group border-[3px] md:border-4 border-white z-50">
        {isOpen ? <X size={20} /> : <MessageSquare size={20} className="group-hover:animate-bounce" />}
      </button>
    </div>
  );
};

const HeroSlider = ({ setView }) => {
  const slides = [
    {
      img: "/images/oem-manufacturing.webp",
      category: "Diversified Industrial Conglomerate",
      title: "Mahalaxmi Group",
      sub: "A fourth-generation business house with a rich legacy dating back to 1942.",
      link: 'about'
    },
    {
      img: "/images/product-catalogue-cover.webp",
      category: "Construction Chemicals",
      title: "Mahalaxmi Construction Chemicals",
      sub: "Greenseal waterproofing, tile adhesives, and repair mortars. UK Technology transfer.",
      link: 'chemicals'
    },
    {
      img: "/images/mining-operations.webp",
      category: "Mining & Aggregates",
      title: "Mahalaxmi Millennium",
      sub: "Basalt mining, M-Sand, and aggregate supply for mega-projects (Bullet Train, Expressways).",
      link: 'millennium'
    },
    {
      img: "/images/warehouse-interior.webp",
      category: "Foundry & Glass Sand",
      title: "Shiv Minerals",
      sub: "Industrial silica sand processing (20,000 MT/month). Supplying Metso, Mahindra, Tata.",
      link: 'shiv'
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-screen min-h-[700px] bg-emerald-950 overflow-hidden">
      {slides.map((slide, index) => (
        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <img src={slide.img} alt={slide.title} className="w-full h-full object-cover filter brightness-[0.4] grayscale-[20%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-transparent to-transparent"></div>
          </div>

          {/* Content Layer */}
          <div className="container mx-auto px-4 md:px-16 h-full flex items-center relative z-20">
            <div className="max-w-4xl text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-12 bg-amber-500"></div>
                <span className="text-amber-400 font-bold uppercase tracking-[0.4em] text-xs md:text-sm">{slide.category}</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl text-emerald-50/90 mb-12 max-w-2xl font-light leading-relaxed">
                {slide.sub}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="gold" className="px-10" onClick={() => { setView(slide.link); window.scrollTo(0, 0); }}>
                  View Division <ArrowRight size={20} />
                </Button>
                <Button variant="white" className="px-10" onClick={() => { setView('contact'); window.scrollTo(0, 0); }}>
                  Inquire Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots Navigation */}
      <div className="absolute bottom-12 right-12 z-30 flex gap-4">
        {slides.map((_, i) => (
          <button key={i} aria-label={`Go to slide ${i + 1}: ${slides[i].title}`} onClick={() => setCurrent(i)} className={`h-1 bg-white transition-[opacity,width] duration-300 ${current === i ? 'w-12 opacity-100' : 'w-6 opacity-30 hover:opacity-100'}`} />
        ))}
      </div>
    </section>
  );
};

// ========================================
// SHARED COMPONENTS
// ========================================

const Button = ({ children, variant = 'primary', className = "", onClick }) => {
  const base = "px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold transition-all duration-300 text-xs md:text-sm tracking-wide flex items-center justify-center gap-3 active:scale-95 shadow-sm hover:shadow-md btn-shine";
  const variants = {
    primary: "bg-emerald-950 text-white hover:bg-emerald-900",
    outline: "border border-emerald-950 text-emerald-950 hover:bg-emerald-50",
    gold: "bg-amber-500 text-emerald-950 hover:bg-amber-400 border border-amber-400",
    white: "bg-white text-emerald-950 border border-gray-100 hover:bg-gray-50",
    ghost: "text-white border border-white/20 hover:bg-white/10 hover:border-white/40"
  };
  return <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>{children}</button>;
};

const SectionHeader = ({ title, subtitle, light = false, center = false }) => (
  <AnimatedSection className={`mb-8 md:mb-12 ${center ? 'text-left md:text-center mx-auto' : 'text-left'} max-w-4xl px-4 md:px-0`}>
    <div className={`h-1 w-16 bg-amber-500 mb-6 rounded-full ${center ? 'md:mx-auto' : ''}`}></div>
    <h2 className={`text-2xl md:text-4xl font-bold tracking-tight mb-4 leading-tight ${light ? 'text-white' : 'text-emerald-950'}`}>{title}</h2>
    {subtitle && <p className={`text-sm md:text-lg text-opacity-80 font-medium leading-relaxed ${light ? 'text-emerald-100' : 'text-gray-500'}`}>{subtitle}</p>}
  </AnimatedSection>
);

// ========================================
// NAVBAR (MEGA MENU)
// ========================================

const Navbar = ({ view, setView, siteMode = 'full_access' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeView = (v) => {
    setView(v);
    setIsOpen(false);
    setActiveMega(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine navbar styling based on page and scroll
  const getNavBg = () => {
    if (scrolled) return 'bg-emerald-950 shadow-lg py-3';
    if (!isHome) return 'bg-emerald-950 shadow-md py-4';
    return 'bg-transparent py-6';
  };
  const getTextColor = () => {
    if (scrolled) return 'text-white';
    return 'text-white';
  };
  const getLogoTextColor = () => {
    if (scrolled) return 'text-white';
    return 'text-white';
  };

  const allMenu = [
    { n: 'About', v: 'about', sub: [{ n: 'History', v: 'about' }, { n: 'Leadership', v: 'about' }] },
    {
      n: 'Divisions', v: 'divisions', sub: [
        { n: 'Construction Chemicals', v: 'chemicals' }, { n: 'OEM Manufacturing', v: 'oem' },
        { n: 'Mahalaxmi Millennium', v: 'millennium' }, { n: 'Shiv Minerals', v: 'shiv' },
        { n: 'Transport & Logistics', v: 'transport' }, { n: 'Infrastructure', v: 'infra' }
      ]
    },
    { n: 'Solutions', v: 'applications' },
    { n: 'Catalogue', v: 'products' },
    { n: 'Projects', v: 'projects' },
    { n: 'Contact', v: 'contact' }
  ];

  // Filter out Chemicals, Projects, and Catalogue in group_only mode
  const menu = siteMode === 'group_only'
    ? allMenu.map(item => item.n === 'Divisions'
      ? { ...item, sub: item.sub.filter(s => s.v !== 'chemicals') }
      : item).filter(item => !['Projects', 'Catalogue'].includes(item.n))
    : allMenu;

  const megaMenus = {
    'Divisions': {
      img: '/images/oem-manufacturing.webp',
      title: 'Our Business Units', desc: 'Specialized industrial divisions operating with unified quality standards.',
      items: [
        { n: 'Construction Chemicals', v: 'chemicals', i: <FlaskConical size={16} /> },
        { n: 'OEM Manufacturing', v: 'oem', i: <Factory size={16} /> },
        { n: 'Mahalaxmi Millennium', v: 'millennium', i: <HardHat size={16} /> },
        { n: 'Shiv Minerals', v: 'shiv', i: <Microscope size={16} /> },
        { n: 'Transport & Logistics', v: 'transport', i: <Truck size={16} /> },
        { n: 'Infrastructure', v: 'infra', i: <Building2 size={16} /> }
      ].filter(item => siteMode === 'group_only' ? item.v !== 'chemicals' : true)
    },
    'Catalogue': {
      img: '/images/product-catalogue-cover.webp',
      title: 'Product Catalogue', desc: 'High-performance Greenseal formulations.',
      items: [
        { n: 'Tile Adhesives', v: 'products', i: <Wrench size={16} /> },
        { n: 'Screeds & Floors', v: 'products', i: <Droplets size={16} /> },
        { n: 'Repair Mortars', v: 'products', i: <Zap size={16} /> },
        { n: 'View All Products', v: 'products', i: <ArrowRight size={16} /> }
      ]
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${getNavBg()}`} onMouseLeave={() => setActiveMega(null)}>
      <div className="container mx-auto px-10 md:px-16 flex justify-between items-center relative">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => changeView('home')}>
          <img src="/images/mahalaxmi-group-logo.png" alt="Mahalaxmi Group" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform" />
          <div className="flex flex-col leading-none">
            <span className={`font-bold text-xl md:text-2xl tracking-tight ${getLogoTextColor()} transition-colors`}>MAHALAXMI</span>
            <span className="text-amber-500 font-semibold text-[9px] tracking-[0.3em] uppercase">Group Industrial</span>
          </div>
        </div>

        <div className={`hidden lg:flex items-center gap-10 font-semibold text-sm uppercase tracking-wider ${getTextColor()}`}>
          <button onClick={() => changeView('about')} className="hover:text-amber-500 transition-colors py-4 hover-underline">About</button>
          {['Divisions', ...(siteMode === 'group_only' ? [] : ['Catalogue'])].map(m => (
            <div key={m} className="py-4" onMouseEnter={() => setActiveMega(m)}>
              <button className={`flex items-center gap-1 hover:text-amber-500 transition-colors ${activeMega === m ? 'text-amber-500' : ''}`}>
                {m} <ChevronDown size={14} className={`transition-transform duration-300 ${activeMega === m ? 'rotate-180' : ''}`} />
              </button>
            </div>
          ))}
          {siteMode !== 'group_only' && <button onClick={() => changeView('projects')} className="hover:text-amber-500 transition-colors py-4 hover-underline">Projects</button>}
          <button onClick={() => changeView('contact')} className="hover:text-amber-500 transition-colors py-4 hover-underline">Contact</button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {siteMode !== 'group_only' && (
            <button onClick={() => changeView('downloads')} className={`hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${getTextColor()} hover:text-amber-500`}>
              <Download size={16} /> Downloads
            </button>
          )}
          <Button variant="gold" className="hidden md:flex py-3 px-6 text-xs" onClick={() => changeView('contact')}>Quick Inquiry</Button>
          <button aria-label={isOpen ? 'Close menu' : 'Open menu'} className={`lg:hidden p-2 rounded-lg backdrop-blur-md ${scrolled ? 'text-white bg-white/20' : !isHome ? 'text-white bg-white/20' : 'text-white bg-white/20'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mega Menu */}
      <div className={`absolute top-full left-0 w-full pt-2 transition-all duration-300 transform origin-top ${activeMega ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}>
        <div className="bg-white shadow-2xl border-t border-emerald-900/10 p-0 flex rounded-b-2xl overflow-hidden mx-8 mt-2">
          {activeMega && megaMenus[activeMega] && (
            <>
              <div className="w-1/3 bg-gray-100 relative overflow-hidden">
                <img src={megaMenus[activeMega].img} className="absolute inset-0 w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-emerald-950/80 p-10 flex flex-col justify-end text-white">
                  <h4 className="text-2xl font-bold mb-2">{megaMenus[activeMega].title}</h4>
                  <p className="text-sm text-emerald-100/70">{megaMenus[activeMega].desc}</p>
                </div>
              </div>
              <div className="w-2/3 p-10 grid grid-cols-2 gap-6 bg-white">
                {megaMenus[activeMega].items.map((item, idx) => (
                  <button key={idx} onClick={() => changeView(item.v)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-all group text-left">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-900 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-colors">{item.i}</div>
                    <div>
                      <div className="font-bold text-emerald-950 text-sm uppercase tracking-wide group-hover:text-amber-600 transition-colors">{item.n}</div>
                      <div className="text-xs text-gray-400 mt-1 font-medium">Click to explore</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full glass-panel border-t border-gray-100 shadow-2xl p-6 flex flex-col gap-6 max-h-[85vh] overflow-y-auto animate-fade-in-up">
          {menu.map(m => (
            <div key={m.n} className="border-b border-gray-100 pb-4 last:border-0">
              <button onClick={() => changeView(m.v)} className="text-left w-full flex justify-between items-center text-base font-bold text-emerald-950 uppercase">
                {m.n} {m.sub && <ChevronRight size={16} />}
              </button>
              {m.sub && (
                <div className="pl-4 mt-4 grid gap-4 border-l-2 border-amber-500/20 ml-1">
                  {m.sub.map((s, idx) => <button key={idx} onClick={() => changeView(s.v)} className="text-left text-xs font-medium text-gray-600 uppercase tracking-wide">{s.n}</button>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

// ========================================
// HOME VIEW
// ========================================

const HomeView = ({ setView, siteMode = 'full_access' }) => (
  <>
    <PageHead title="Home" description="Mahalaxmi Group: Industrial excellence in Construction Chemicals, Mining, and Logistics since 1942." />
    <HeroSlider setView={setView} />
    <TrustedByMarquee />

    {/* Chemicals Section — hidden in group_only mode */}
    {siteMode === 'full_access' && (
      <section className="py-12 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-16">
          <div className="flex flex-col-reverse lg:flex-row gap-12 md:gap-24 items-center">
            <AnimatedSection direction="left" className="lg:w-1/2 w-full">
              <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Construction Excellence</div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6 leading-tight">Advanced Greenseal <br />Chemical Solutions</h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                Developed through UK Technology transfer, our Greenseal range provides specialized waterproofing, high-strength adhesives, and structural repair solutions for modern infrastructure.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100"><div className="text-2xl font-bold text-emerald-950 mb-1">UK Tech</div><div className="text-xs text-gray-500 uppercase tracking-wider">Formulation Standard</div></div>
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100"><div className="text-2xl font-bold text-emerald-950 mb-1">In-House Lab</div><div className="text-xs text-gray-500 uppercase tracking-wider">R&D & Testing</div></div>
              </div>
              <Button variant="primary" onClick={() => setView('chemicals')}>View Products Range</Button>
            </AnimatedSection>
            <AnimatedSection direction="right" delay={200} className="lg:w-1/2 w-full">
              <ParallaxImage src="/images/chemicals-product-range.webp" alt="Greenseal Products Range" className="h-[300px] md:h-[500px] w-full shadow-2xl" />
            </AnimatedSection>
          </div>
        </div>
      </section>
    )}

    {/* Mining Parallax Section */}
    <section className="py-12 md:py-20 bg-emerald-50/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex flex-col lg:flex-row gap-12 md:gap-24 items-center">
          <AnimatedSection direction="left" className="lg:w-1/2 w-full">
            <ParallaxImage src="/images/mining-operations.webp" alt="Mahalaxmi Mining Operations" className="h-[300px] md:h-[500px] w-full shadow-2xl" />
          </AnimatedSection>
          <AnimatedSection direction="right" delay={200} className="lg:w-1/2 w-full">
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Strategic Sourcing</div>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6 leading-tight">Sustainable Mining & <br />Mineral Processing</h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              Controlling the supply chain from the ground up. Our dedicated mining leases for silica sand and basalt ensure highest purity raw materials.
            </p>
            <ul className="space-y-4 mb-8">
              {['20,000 Tons Monthly Capacity', 'Wet-Processing Units', 'Zero-Waste Initiative'].map(item => (
                <li key={item} className="flex items-center gap-3 text-emerald-900 font-semibold"><CheckCircle2 size={18} className="text-amber-500" /> {item}</li>
              ))}
            </ul>
            <Button variant="outline" onClick={() => setView('millennium')}>View Minerals Division</Button>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* Logistics Parallax Section */}
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex flex-col-reverse lg:flex-row gap-12 md:gap-24 items-center">
          <AnimatedSection direction="left" className="lg:w-1/2 w-full">
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Global Reach</div>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6 leading-tight">Zero-Delay Logistics <br />Network</h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              Our proprietary fleet of 50+ heavy-duty bulk carriers and strategic warehousing across India ensures your material arrives exactly when the site engineer needs it.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-emerald-50/50 p-6 rounded-xl shadow-sm card-hover border border-emerald-100"><div className="text-3xl font-bold text-emerald-950 mb-1"><AnimatedCounter target="48" suffix="h" /></div><div className="text-xs text-gray-500 uppercase tracking-wider">Avg. Dispatch Time</div></div>
              <div className="bg-emerald-50/50 p-6 rounded-xl shadow-sm card-hover border border-emerald-100"><div className="text-3xl font-bold text-emerald-950 mb-1"><AnimatedCounter target="10" suffix="+" /></div><div className="text-xs text-gray-500 uppercase tracking-wider">Distribution Hubs</div></div>
            </div>
            <Button variant="primary" onClick={() => setView('divisions')}>Explore Logistics</Button>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={200} className="lg:w-1/2 w-full">
            <ParallaxImage src="/images/logistics-fleet.webp" alt="Mahalaxmi Logistics & Fleet" className="h-[300px] md:h-[500px] w-full shadow-2xl" />
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* Expertise Grid */}
    <section className="py-16 md:py-20 bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-16">
        <SectionHeader title="Our Divisions" subtitle="Operating across high-growth sectors with vertical integration." center={true} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {DIVISION_DATA.map((d, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="bg-white p-10 rounded-2xl border border-gray-100 card-hover h-full flex flex-col group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer" onClick={() => { setView(d.view); window.scrollTo(0, 0); }}>
                <div className="mb-6 text-emerald-950 bg-emerald-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-emerald-950 group-hover:text-amber-500 transition-colors">{d.icon}</div>
                <div className="text-amber-600 font-bold uppercase tracking-widest text-[10px] mb-2">{d.role}</div>
                <h3 className="text-xl font-bold text-emerald-950 mb-3 leading-tight group-hover:text-emerald-800 transition-colors">{d.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-4">{d.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-widest group-hover:gap-4 transition-all mt-auto">View Division <ArrowRight size={14} /></div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {siteMode === 'full_access' && <ProductGallerySection />}
    <CallbackSection />
  </>
);

// ========================================
// ABOUT VIEW
// ========================================

const AboutView = ({ setView }) => (
  <>
    <PageHead title="About Us" description="Our legacy of trust and innovation since 1942. Vision, Mission, and Leadership." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 relative overflow-hidden text-center text-white">
      <div className="container mx-auto px-4 md:px-16 relative z-10">
        <AnimatedSection>
          <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">Our Story</div>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 uppercase tracking-tighter">About Mahalaxmi</h1>
          <div className="h-1.5 w-24 bg-amber-500 mx-auto rounded-full"></div>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-16">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <AnimatedSection direction="left">
            <SectionHeader title="A Legacy of Trust & Innovation" subtitle="Fourth-Generation Business House Est. 1942." />
            <div className="space-y-6 text-gray-600 font-medium text-base md:text-lg leading-relaxed">
              <p>Mahalaxmi Group of Companies is a fourth-generation business house with a rich legacy dating back to 1942. With roots in trading and mining, the group has successfully diversified into mineral processing, transportation, warehousing, infrastructure, chemicals, and financial ventures. Over the decades, we have built a reputation for reliability, innovation, and excellence, achieving a consolidated turnover of over ₹100 Crores.</p>
              <p>We are proud to be a fourth-generation enterprise continuing the vision and values of our forefathers who laid the foundation in 1942. From humble beginnings, we have expanded into diverse industries including trading, mining, mineral processing, real estate development, transportation, financing, and warehousing.</p>
              <p>Our legacy is built on trust, experience, and adaptability, which has enabled us to work with some of the most reputed Indian and multinational corporations. Today, Mahalaxmi Group stands as a trusted partner in growth, combining tradition with modern business practices.</p>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-12 border-t border-gray-100 pt-10">
              <div><div className="text-3xl md:text-4xl font-bold text-emerald-950 mb-2"><AnimatedCounter target="82" suffix="+" /></div><div className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Years of Legacy</div></div>
              <div><div className="text-3xl md:text-4xl font-bold text-emerald-950 mb-2">₹100 Cr+</div><div className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Consolidated Turnover</div></div>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={200}>
            <div className="bg-emerald-50/50 p-8 md:p-12 rounded-3xl border border-emerald-100">
              <h4 className="text-2xl font-bold text-emerald-950 mb-10 uppercase tracking-tight">Vision & Mission</h4>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0 text-amber-600"><Zap size={24} /></div>
                  <div>
                    <div className="text-amber-600 mb-2 font-bold uppercase text-xs tracking-widest">Vision</div>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">To be the global benchmark for industrial reliability and technical innovation in the construction ecosystem.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0 text-amber-600"><Flag size={24} /></div>
                  <div>
                    <div className="text-amber-600 mb-2 font-bold uppercase text-xs tracking-widest">Mission</div>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">To deliver precision-engineered industrial solutions through continuous R&D and scalable manufacturing for national growth.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-16">
        <SectionHeader title="Core Leadership" center={true} />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { n: "Mahendra Shah", r: "Leadership Team", p: "+91 98200 61842" },
            { n: "Chirag Shah", r: "Leadership Team", p: "+91 98210 50005" },
            { n: "Dhhruv Shah", r: "Leadership Team", p: "+91 91521 57578" }
          ].map((l, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center card-hover group">
                <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center text-emerald-950 overflow-hidden border-4 border-emerald-50 group-hover:border-amber-500 transition-colors">
                  <Users size={48} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-xl font-bold text-emerald-950 uppercase mb-2 tracking-tight">{l.n}</h4>
                <div className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-6">{l.r}</div>
                {l.p && <div className="text-xs font-bold text-gray-400 flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 rounded-full w-fit mx-auto group-hover:bg-emerald-950 group-hover:text-white transition-colors"><Phone size={12} /> {l.p}</div>}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-16">
        <SectionHeader title="The Industrial Journey" center={true} />
        <div className="relative mt-20">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 hidden lg:block transform -translate-y-1/2"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { y: "1942", t: "Pioneer Sales Agencies", d: "Established as the oldest trading firm in Masjid Bunder. Specialized in chemical trading with exclusive rights for Saurashtra Chemicals, Nirma, and Borax Morarji." },
              { y: "1970s", t: "International Chemical Co.", d: "Pioneered Sodium Silicate production at Sakinaka. Later ventured into RMC with Ashoka Buildcon (12+ yrs). Currently operating a successful JV with ACC Ltd." },
              { y: "1983", t: "Chirag Warehousing", d: "Exclusive warehousing partner for the American Embassy (1983-2002), handling high-value requirements with precision. Trusted logistics partner for MNCs." },
              { y: "1993", t: "Chirag Mining Pvt Ltd", d: "Executed mining partnerships with SESA Goa, Formento, and key contributions to Konkan Railway & Khed Station development." },
              { y: "1998", t: "Mahalaxmi Millennium", d: "Began mining Silica Sand at Phonda Ghat. Supplied 4 lakh tons to the Mumbai-Ahmedabad Bullet Train project. Partnered with Amazon India." },
              { y: "2017", t: "Shiv Minerals", d: "Est. one of India's largest silica sand processing units at Jhagadia. Scaled from 4k to 20,000 MT/month. Supplying Metso, Mahindra, Tata Motors, Sandvik." },
              { y: "2024", t: "Mahalaxmi Enterprises", d: "Entered transportation with a modern fleet of 10+ 16-tyre tippers. Contracts with Ultratech, L&T, JSW.", highlight: true },
              { y: "Future", t: "Maa Ambika LLP", d: "High-capacity RMC Plant at Mahol in partnership with Infra Market. Serving Central & South Mumbai infrastructure." }
            ].map((y, i) => (
              <AnimatedSection key={i} delay={i * 100} className="col-span-1">
                <div className={`h-full text-left bg-white p-6 rounded-xl border ${y.highlight ? 'border-amber-500 shadow-md transform scale-105' : 'border-gray-50 hover:border-amber-500'} transition-all card-hover flex flex-col`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-black text-emerald-950 opacity-20">{y.y}</div>
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950 mb-2 leading-tight">{y.t}</h4>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed flex-grow">{y.d}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-16 text-center">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Other Entities & Ventures</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              As venture capitalists, Mahalaxmi Group also undertakes strategic financial projects across industries. Depending on the opportunity and partnering expertise, we invest and support promising ventures that align with our growth vision.
            </p>
            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <p className="italic text-lg text-emerald-100">"We believe in building long-term relationships with strong organizations. With decades of experience, robust resources, and a commitment to excellence, we are confident of delivering value and fulfilling every responsibility we undertake."</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-24 md:py-32 bg-emerald-50/50">
      <div className="container mx-auto px-4 md:px-16 text-center">
        <AnimatedSection>
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-8"><Award size={32} className="text-amber-500" /></div>
          <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 uppercase tracking-tight italic mb-8">Proudly Committed to <span className="text-amber-600">Make in India</span></h2>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg font-medium mb-12 leading-relaxed">Building self-reliant industrial ecosystems by leveraging indigenous minerals and local technical talent.</p>
          <Button variant="gold" className="mx-auto shadow-xl"><Download size={20} /> Download Corporate Profile PDF</Button>
        </AnimatedSection>
      </div>
    </section>
  </>
);

// ========================================
// DIVISIONS VIEW
// ========================================

const DivisionsViewDeprecated = ({ setView }) => {
  const divisions = [
    { id: 'chemicals', title: "Mahalaxmi Chemicals", desc: "Premium Greenseal construction chemicals and R&D lab.", icon: <FlaskConical /> },
    { id: 'oem', title: "Contract Manufacturing", desc: "Full-cycle OEM solutions for global brands.", icon: <Factory /> },
    { id: 'divisions', title: "Mahalaxmi Millennium", desc: "Advanced mineral processing of Basalt and M-sand.", icon: <HardHat /> },
    { id: 'divisions', title: "Shiv Minerals", desc: "Large-scale extraction and wet-processing of Silica Sand.", icon: <Package /> },
    { id: 'divisions', title: "Logistics & Fleet", desc: "Proprietary delivery network and warehousing.", icon: <Truck /> },
    { id: 'infra', title: "Infrastructure", desc: "Site preparation, transportation, and RMC solutions.", icon: <Shield /> }
  ];
  return (
    <section className="py-16 md:py-32 bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-16">
        <SectionHeader title="Multiple Divisions. One Commitment." subtitle="Reliability across every stage of the industrial value chain." center={true} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {divisions.map((d, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="bg-white p-12 rounded-2xl border border-gray-100 card-hover group cursor-pointer h-full" onClick={() => { setView(d.id); window.scrollTo(0, 0); }}>
                <div className="w-16 h-16 bg-emerald-50 text-emerald-950 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-950 group-hover:text-amber-400 transition-colors shadow-sm">
                  {React.cloneElement(d.icon, { size: 32 })}
                </div>
                <h3 className="text-2xl font-bold text-emerald-950 mb-4 uppercase leading-tight tracking-tight group-hover:text-amber-600 transition-colors">{d.title}</h3>
                <p className="text-gray-500 mb-10 leading-relaxed font-medium line-clamp-3">{d.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-widest group-hover:gap-4 transition-all">View Division <ArrowRight size={14} /></div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ========================================
// CHEMICALS VIEW
// ========================================

// ========================================
// DIVISIONS VIEW
// ========================================

const DivisionsView = ({ setView }) => {
  return (
    <section className="py-20 md:py-32 bg-gray-50 min-h-screen">
      <PageHead title="Our Divisions" description="Explore our diversified industrial divisions: Chemicals, Mining, Logistics, and OEM." />
      <div className="container mx-auto px-4 md:px-16">
        <div className="text-center mb-8 md:mb-12 max-w-4xl mx-auto">
          <div className="h-1 w-16 bg-amber-500 mb-6 rounded-full mx-auto"></div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 leading-tight text-emerald-950">Our Divisions</h1>
          <p className="text-sm md:text-lg text-opacity-80 font-medium leading-relaxed text-gray-500">Operating across high-growth sectors with vertical integration.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
          {DIVISION_DATA.map((d, i) => (
            <AnimatedSection key={d.id} delay={i * 100}>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 card-hover h-full flex flex-col group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 text-emerald-950">{d.icon}</div>
                <div className="mb-6 text-emerald-950 bg-emerald-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-emerald-950 group-hover:text-amber-500 transition-colors">{d.icon}</div>
                <div className="text-amber-600 font-bold uppercase tracking-widest text-[10px] mb-2">{d.role}</div>
                <h3 className="text-xl font-bold text-emerald-950 mb-3 leading-tight group-hover:text-emerald-800 transition-colors">{d.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-4">{d.desc}</p>
                <Button variant="outline" className="w-full mt-auto group-hover:bg-emerald-950 group-hover:text-white group-hover:border-emerald-950 transition-all" onClick={() => setView('contact')}>Inquire Now</Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ========================================
// CHEMICALS VIEW
// ========================================

const ChemicalsView = ({ setView }) => (
  <>
    <PageHead title="Mahalaxmi Construction Chemicals" description="Greenseal waterproofing, tile adhesives, and repair mortars." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-16 relative z-10">
        <AnimatedSection className="max-w-4xl">
          <SectionHeader light={true} title="Mahalaxmi Construction Chemicals" subtitle="Greenseal Construction Chemical Solutions." />
          <p className="text-lg md:text-xl text-emerald-100/80 mb-12 max-w-2xl leading-relaxed font-medium">International-standard construction chemicals manufactured locally with UK technology transfer.</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="gold" onClick={() => setView('products')}>Explore Products <ArrowRight size={18} /></Button>
            <Button variant="ghost" onClick={() => setView('downloads')}><Download size={16} /> Download Catalogue</Button>
            <Button variant="outline" className="border-emerald-100 text-emerald-100 hover:bg-white hover:text-emerald-950" onClick={() => setView('contact')}>Request Quote</Button>
          </div>
        </AnimatedSection>
      </div>
      <FlaskConical className="absolute bottom-[-100px] right-[-50px] text-white/5 rotate-12" size={500} />
    </section>

    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="bg-emerald-50/30 p-8 md:p-16 rounded-3xl border border-emerald-100 flex flex-col md:flex-row gap-16 items-center">
            <div className="lg:w-2/3">
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-6 uppercase tracking-tight italic">Partnership & Integration</h3>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 font-medium italic">"Mahalaxmi Group is the exclusive manufacturing and distribution partner for Greenseal technology products in India."</p>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { t: "UK Tech Transfer", d: "European formulations adapted for tropical climates." },
                  { t: "Batch Consistency", d: "Automated dosing and mixing for zero-defect output." },
                  { t: "ISO Alignment", d: "Stringent EN 12004 and ISO standard compliance." }
                ].map((b, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-emerald-50 card-hover">
                    <div className="text-amber-600 font-bold text-[10px] uppercase mb-3 tracking-widest">{b.t}</div>
                    <div className="text-emerald-950 text-sm font-bold leading-tight">{b.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3 text-center">
              <div className="w-56 h-56 md:w-64 md:h-64 bg-emerald-950 rounded-full mx-auto flex flex-col items-center justify-center text-white p-8 shadow-2xl border-8 border-emerald-50">
                <div className="text-4xl md:text-5xl font-black mb-2 text-amber-500">UK</div>
                <ArrowRight size={24} className="mb-2 opacity-50" />
                <div className="text-4xl md:text-5xl font-black mb-4">IN</div>
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Technology Integration</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Greenseal Product Ecosystem */}
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <SectionHeader title="Integrated Product Ecosystem" subtitle="Greenseal: The Professional Choice — High-Performance Tiling, Wall Finishing & Waterproofing Solutions" />

        {/* T-Series Adhesives */}
        <AnimatedSection>
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-950 rounded-lg flex items-center justify-center text-amber-500"><Wrench size={20} /></div>
              <h4 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">Greenseal T-Series Adhesives (Type 1–4)</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">Our Greenseal T-Series adhesives are engineered to exceed IS 15477 and EN 12004 standards. By replacing traditional cement slurry with polymer-modified formulations like GS 511 (C1) and GS 512 (C2), we ensure permanent bonding for modern tiles. The range offers superior grab and flexibility, eliminating the risk of de-bonding or hollow sounds common in conventional fixing.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-2">Type 1 & Type 2</div>
                <p className="text-gray-700 text-xs leading-relaxed">General & High Performance — covering standard ceramic and vitrified tiles for walls and floors, ensuring slip-resistant fixing.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-2">Type 3 & Type 4</div>
                <p className="text-gray-700 text-xs leading-relaxed">Specialized Applications — designed for glass mosaics, swimming pools, and difficult substrates like drywall that require maximum flexibility.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Mortars & Screeds */}
        <AnimatedSection delay={100}>
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-950 rounded-lg flex items-center justify-center text-amber-500"><Droplets size={20} /></div>
              <h4 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">Greenseal Mortars & Screeds</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">We revolutionize wall and floor finishing with our ready-to-use mortar range, designed to save labor and reduce material wastage. These ready-to-use solutions speed up project timelines significantly.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-2">Ready-Mix Plaster (GS 515)</div>
                <p className="text-gray-700 text-xs leading-relaxed">A pre-blended cementitious plaster that eliminates on-site sieving, ensuring a crack-free and durable finish.</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-2">Precision Skim Coats (GS 513)</div>
                <p className="text-gray-700 text-xs leading-relaxed">Available as Base Coat and Top Coat, these polymer-modified renders provide a breathable, weather-resistant smooth finish.</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-2">Block Joint Mortar</div>
                <p className="text-gray-700 text-xs leading-relaxed">Thin-Bed adhesive for AAC blocks that reduces joint thickness from 15mm to 3mm, saving material costs.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Structural Bonding & Flooring */}
        <AnimatedSection delay={200}>
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-950 rounded-lg flex items-center justify-center text-amber-500"><Zap size={20} /></div>
              <h4 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">Structural Bonding & Flooring</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">Specialized structural solutions to complete the building envelope — including high-strength Block Joint Mortars and Floor Screeds.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-2">Thin-Bed Block Joint</div>
                <p className="text-gray-700 text-xs leading-relaxed">A high-strength polymer mortar for AAC blocks that reduces joint thickness from 15mm to 3mm, saving material costs.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-2">Engineered Floor Screeds (GS 516/309)</div>
                <p className="text-gray-700 text-xs leading-relaxed">High-impact resistant screeds that prevent shrinkage cracks and provide a perfectly level base for premium flooring. GS 309 is a Self-Levelling Screed.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Core Value Proposition */}
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Our Core Value Proposition</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-emerald-950 mb-4 tracking-tight">European Quality. Indian Economics.</h2>
            <p className="text-gray-500 text-lg leading-relaxed">The smartest way to build global-standard products.</p>
          </div>
        </AnimatedSection>
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <AnimatedSection direction="left">
            <div className="bg-rose-50 p-8 md:p-10 rounded-2xl border border-rose-100">
              <div className="bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block mb-4">The Industry Challenge</div>
              <p className="text-gray-700 text-base leading-relaxed">For developers and brands, the choice has always been difficult: import expensive high-quality chemicals or settle for inconsistent local mixes. Imported goods suffer from long lead times and shipping costs, while local mixes often fail to meet BS/EN standards.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={200}>
            <div className="bg-emerald-50 p-8 md:p-10 rounded-2xl border border-emerald-100">
              <div className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block mb-4">The Mahalaxmi Solution</div>
              <p className="text-gray-700 text-base leading-relaxed">Mahalaxmi Group bridges this gap. We have established a manufacturing ecosystem that replicates UK Technology right here in Bharuch. This allows us to offer world-class Greenseal waterproofing and adhesive solutions at competitive domestic rates.</p>
            </div>
          </AnimatedSection>
        </div>
        <AnimatedSection delay={300}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white"><Building2 size={20} /></div>
                <h4 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">For Developers</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">You get international specs (ISO/EN Standards) that protect your building's lifespan, without the import price tag.</p>
            </div>
            <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white"><Package size={20} /></div>
                <h4 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">For Private Label Brands</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">You get a "Plug-and-Play" factory. We handle the formulation, testing, and packaging, allowing you to focus purely on sales and distribution.</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Quality Control Laboratory */}
    <section className="py-12 md:py-20 bg-emerald-50/30">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto mb-12">
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">International Quality Control</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-6 tracking-tight">In-House Quality Laboratory</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">Building upon our robust infrastructure in Bharuch, the core of our operational excellence lies in our International Quality Control Laboratory. We view our manufacturing setup and our quality testing as inseparable; the precision of our automated systems is constantly validated by rigorous scientific analysis to ensure that the "UK Technology Transfer" is a measurable reality in every batch.</p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <AnimatedSection delay={100}>
            <div className="bg-white p-8 rounded-2xl border border-emerald-100 card-hover h-full">
              <CheckCircle2 className="text-amber-500 mb-4" size={28} />
              <h4 className="text-lg font-bold text-emerald-950 mb-3 uppercase tracking-tight">Continuous In-House Validation</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Unlike competitors who rely on periodic external checks, our internal validation ensures immediate adaptation to client specifications.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="bg-white p-8 rounded-2xl border border-emerald-100 card-hover h-full">
              <Globe className="text-amber-500 mb-4" size={28} />
              <h4 className="text-lg font-bold text-emerald-950 mb-3 uppercase tracking-tight">Global Quality, Local Logistics</h4>
              <p className="text-gray-600 text-sm leading-relaxed">We deliver European-grade quality manufacturing without the logistical delays or high costs associated with imported goods.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="bg-white p-8 rounded-2xl border border-emerald-100 card-hover h-full">
              <Microscope className="text-amber-500 mb-4" size={28} />
              <h4 className="text-lg font-bold text-emerald-950 mb-3 uppercase tracking-tight">End-to-End Testing Mandate</h4>
              <p className="text-gray-600 text-sm leading-relaxed">We test every single raw material input, eliminating batch variance at the source before production even begins.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={400}>
            <div className="bg-white p-8 rounded-2xl border border-emerald-100 card-hover h-full">
              <Shield className="text-amber-500 mb-4" size={28} />
              <h4 className="text-lg font-bold text-emerald-950 mb-3 uppercase tracking-tight">Risk-Free Private Labeling</h4>
              <p className="text-gray-600 text-sm leading-relaxed">We safeguard your brand reputation through certified compliance and total operational transparency, ensuring your products meet the highest safety specifications.</p>
            </div>
          </AnimatedSection>
        </div>
        <AnimatedSection delay={500}>
          <div className="bg-emerald-950 text-white p-8 md:p-12 rounded-3xl">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <p className="text-emerald-100/80 text-base leading-relaxed mb-6">Our in-house laboratory is driven by a specialized team — an expert engineer, lab technician, operator, and a Production Manager who personally monitors every batch before dispatch. Adhering to global standards, we rigorously test all raw materials and finished goods for bonding strength and durability.</p>
                <p className="text-emerald-100/80 text-base leading-relaxed">We operate under a zero-tolerance policy for deviation, backed by our <strong className="text-white">ISO 9001:2015</strong> (Quality Management) and <strong className="text-white">ISO 14001:2015</strong> (Environmental Management) certifications.</p>
              </div>
              <div className="flex gap-4 shrink-0">
                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                  <div className="text-2xl font-black text-amber-500 mb-1">ISO</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">9001:2015</div>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                  <div className="text-2xl font-black text-amber-500 mb-1">ISO</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">14001:2015</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Government Initiatives & National Standards */}
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <SectionHeader title="Government Initiatives & National Standards" subtitle="Our products meet the highest international and national compliance certifications." center={true} />
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {[
            { name: "Make in India", cat: "Government of India", desc: "An initiative encouraging companies to develop, manufacture, and assemble products in India." },
            { name: "ISI Mark", cat: "Indian Standards", desc: "Certifies that a product conforms to specific Indian quality standards set by the Bureau of Indian Standards." },
            { name: "CE Mark", cat: "European Compliance", desc: "Conformité Européenne — indicates compliance with EU health, safety, and environmental protection standards." },
            { name: "REACH Compliant", cat: "EU Regulation", desc: "EU regulation ensuring the safe use of chemicals to protect human health and the environment." },
            { name: "RoHS Compliant", cat: "EU Directive", desc: "Restriction of Hazardous Substances — restricts use of specific dangerous materials in products." },
            { name: "WRAS Approved", cat: "UK Certification", desc: "Water Regulations Advisory Scheme — certifies materials safe for use with drinking water supply." },
            { name: "NSF International", cat: "Health Standards", desc: "Certifies products to strict public health and safety standards for water and food service equipment." },
            { name: "GreenLabel Singapore", cat: "Environmental", desc: "Singapore's leading environmental certification mark indicating an eco-friendly product." },
            { name: "ISO 9001:2015", cat: "Quality Management", desc: "International standard specifying requirements for a quality management system." },
            { name: "ISO 45001:2018", cat: "Health & Safety", desc: "International standard for occupational health and safety management systems." },
            { name: "SPAN Malaysia", cat: "Malaysian Standards", desc: "National regulatory body for the water and sewerage industry in Malaysia." },
            { name: "SIRIM Malaysia", cat: "Quality Standard", desc: "National organization for standards and quality in Malaysia." }
          ].map((cert, i) => (
            <AnimatedSection key={i} delay={i * 50}>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 card-hover h-full group">
                <div className="w-12 h-12 bg-emerald-950 rounded-xl flex items-center justify-center text-amber-500 mb-4 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-colors">
                  <Award size={24} />
                </div>
                <div className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-2">{cert.cat}</div>
                <h4 className="text-sm font-bold text-emerald-950 mb-2 uppercase tracking-tight">{cert.name}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{cert.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Waterproofing Systems */}
    <section className="py-12 md:py-20 bg-emerald-950 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-4">Waterproofing Solutions</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Greenseal Waterproofing Systems</h3>
            <p className="text-emerald-100/80 text-lg leading-relaxed">Complete waterproofing ecosystems — from integral crystallization to flexible membranes and critical joint solutions.</p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          <AnimatedSection delay={100}>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 card-hover h-full">
              <Shield className="text-amber-500 mb-4" size={28} />
              <h4 className="text-base font-bold mb-3 uppercase tracking-tight">Integral Crystallization (GS 100 & 200)</h4>
              <p className="text-emerald-100/60 text-sm leading-relaxed">Products like GS 100 and GS 200 penetrate deep into the concrete. They react with moisture to form non-soluble crystals, effectively sealing pores and capillaries permanently. This "self-healing" technology blocks water passageways — ideal for basements, water tanks, and tunnels.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 card-hover h-full">
              <Droplets className="text-amber-500 mb-4" size={28} />
              <h4 className="text-base font-bold mb-3 uppercase tracking-tight">Flexible & Liquid Membranes</h4>
              <p className="text-emerald-100/60 text-sm leading-relaxed">Greenseal Flexi 201/202 provides a tough, elastic cementitious coating for wet areas. GS 5000 (PU) and Polydek (Acrylic) liquid membranes create a seamless, UV-resistant barrier. Multiseal 2000 waterproofs without changing surface appearance. Greenshield 108 acts as a heat-reflective thermal blanket for roofs.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 card-hover h-full">
              <CheckCircle2 className="text-amber-500 mb-4" size={28} />
              <h4 className="text-base font-bold mb-3 uppercase tracking-tight">Joint Solutions & Hardeners</h4>
              <p className="text-emerald-100/60 text-sm leading-relaxed">PVC and Bentonite Waterstops expand upon contact with water to lock joints tight. Complimented by Polysulphide and PU Sealants for watertight expansion joints. Ultramix Floor Hardener strengthens concrete floors against heavy traffic impact.</p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <SectionHeader title="TDS & Documentation" subtitle="Buyers trust what they can verify." />
        <div className="grid md:grid-cols-3 gap-8">
          {["Product Catalogue 2024", "Full TDS Library", "MSDS & Safety Sheets"].map((d, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="p-8 border border-gray-100 rounded-xl flex justify-between items-center group hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer card-hover">
                <div>
                  <div className="font-bold text-emerald-950 uppercase tracking-tight mb-2 text-sm">{d}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF Download — 12MB</div>
                </div>
                <div className="text-emerald-900 group-hover:text-amber-600 bg-emerald-50 group-hover:bg-white p-3 rounded-lg transition-colors"><Download size={24} /></div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <ProductGallerySection />
    <ContactSection division="Construction Chemicals" />
  </>
);

// ========================================
// PRODUCTS VIEW
// ========================================

const ProductsView = ({ setActiveProduct, setView }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Tile Adhesives', 'Screeds', 'Repair Mortar', 'Plaster Mortar', 'Wall Finishing', 'Grouts', 'Waterproofing', 'Floor Hardener', 'Heat Coating'];
  const filtered = filter === 'All' ? PRODUCT_DATA : PRODUCT_DATA.filter(p => p.category.includes(filter));

  return (
    <>
      <PageHead title="Product Catalogue" description="Browse our complete range of construction chemicals and technical mortars." />
      <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 text-white text-center">
        <div className="container mx-auto px-6"><AnimatedSection>
          <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">Greenseal</div>
          <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter">Product Catalogue</h1>
          <p className="text-emerald-100/60 text-lg mt-4 max-w-2xl mx-auto">Industrial-grade construction chemicals, waterproofing systems, and technical mortars.</p>
        </AnimatedSection></div>
      </section>

      <section className="py-16 md:py-32 bg-white min-h-screen">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/4">
              <AnimatedSection>
                <div className="sticky top-32 space-y-3">
                  <div className="flex items-center gap-3 mb-6 text-emerald-950 font-black uppercase text-xs tracking-widest border-b-2 border-emerald-950 pb-4"><Filter size={16} /> Filter Categories</div>
                  {categories.map(c => (
                    <button key={c} onClick={() => setFilter(c)} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${filter === c ? 'bg-emerald-950 text-white shadow-lg transform translate-x-2' : 'bg-gray-50 text-gray-500 hover:bg-emerald-50 hover:text-emerald-900'}`}>
                      {c}
                      <span className="float-right text-[10px] opacity-60">{c === 'All' ? PRODUCT_DATA.length : PRODUCT_DATA.filter(p => p.category.includes(c)).length}</span>
                    </button>
                  ))}
                </div>
              </AnimatedSection>
            </div>
            <div className="lg:w-3/4 grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p, idx) => (
                <AnimatedSection key={p.id} delay={(idx % 6) * 80}>
                  <div className="bg-white border border-gray-100 rounded-2xl group card-hover flex flex-col h-full overflow-hidden cursor-pointer" onClick={() => { setActiveProduct(p); setView('product-detail'); window.scrollTo(0, 0); }}>
                    <div className="aspect-square overflow-hidden relative bg-gray-50">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-950 text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-emerald-100/50">{p.category}</div>
                      <div className="absolute top-3 right-3 bg-amber-500 text-emerald-950 text-[9px] px-2.5 py-1 rounded-full font-black tracking-tight">{p.code}</div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h4 className="text-base font-bold text-emerald-950 mb-2 uppercase tracking-tight leading-tight group-hover:text-emerald-800 transition-colors">{p.name}</h4>
                      <p className="text-gray-500 text-xs mb-4 leading-relaxed font-medium line-clamp-2 flex-grow">{p.desc}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Pack</span>
                          <span className="text-xs font-bold text-emerald-950">{p.packaging}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-950 uppercase tracking-widest group-hover:gap-3 transition-all">
                          Details <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

// ========================================
// PRODUCT DETAIL VIEW
// ========================================

const ProductDetailView = ({ product, setView }) => {
  if (!product) return <div className="py-32 text-center"><p className="text-gray-500">No product selected.</p><Button variant="primary" onClick={() => setView('products')}>Back to Catalogue</Button></div>;
  return (
    <>
      <PageHead title={product.name} description={product.desc} />
      <section className="bg-emerald-950 pt-40 pb-20 text-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <button onClick={() => { setView('projects'); window.scrollTo(0, 0); }} className="flex items-center gap-2 text-emerald-100/60 hover:text-white text-xs uppercase tracking-widest font-bold mb-8"><ArrowLeft size={16} /> Back to Catalogue</button>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <img src={product.img} className="rounded-2xl shadow-2xl border-4 border-white/10 w-full h-[400px] object-cover" alt={product.name} />
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-emerald-800/50 text-amber-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                  <span className="text-emerald-100/50 text-sm font-bold">{product.code}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">{product.name}</h1>
                <p className="text-lg text-emerald-100/70 mt-4 leading-relaxed">{product.desc}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <AnimatedSection>
              <h3 className="text-2xl font-bold text-emerald-950 uppercase mb-8">Key Benefits</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {product.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={20} /> <span className="text-emerald-950 font-semibold">{f}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <h3 className="text-2xl font-bold text-emerald-950 uppercase mb-8">Technical Data</h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                {[{ l: "Packaging", v: product.packaging }, { l: "Coverage", v: product.coverage }, { l: "Mixing", v: product.mixing || "Per TDS" }, { l: "Substrate", v: product.substrates || "Concrete, Masonry" }].map((r, i) => (
                  <div key={i} className={`flex justify-between items-center px-8 py-5 ${i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{r.l}</span>
                    <span className="text-sm font-bold text-emerald-950">{r.v}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
          <div className="space-y-8">
            <AnimatedSection delay={200}>
              <div className="bg-emerald-950 text-white p-10 rounded-2xl">
                <h4 className="text-xl font-bold uppercase tracking-tight mb-6">Request TDS</h4>
                <p className="text-emerald-100/60 text-sm mb-8 leading-relaxed">Get the full TDS and MSDS documentation.</p>
                <Button variant="gold" className="w-full"><Download size={16} /> Download TDS</Button>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100">
                <h4 className="text-xl font-bold text-emerald-950 uppercase tracking-tight mb-6">Quick Inquiry</h4>
                <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <textarea rows={3} placeholder="Your requirement..." className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                  <Button variant="primary" className="w-full">Submit Inquiry</Button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

    </>
  );
};

// ========================================
// PROJECTS VIEW
// ========================================

const ProjectsView = ({ setView, setActiveProject }) => (
  <>
    <PageHead title="Projects Portfolio" description="Landmark infrastructure projects powered by Mahalaxmi Group." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 text-white text-center">
      <div className="container mx-auto px-6"><AnimatedSection>
        <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">Portfolio</div>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter">Landmark Projects</h1>
      </AnimatedSection></div>
    </section>
    <section className="py-16 md:py-32 bg-white">
      <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECT_DATA.map((p, i) => (
          <AnimatedSection key={p.id} delay={(i % 3) * 100}>
            <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover cursor-pointer h-full flex flex-col" onClick={() => { setActiveProject(p); setView('project-detail'); window.scrollTo(0, 0); }}>
              <div className="h-52 relative overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-6 z-20 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">{p.type}</div>
                  <div className="font-bold text-lg">{p.name}</div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-4">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {p.loc}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {p.year}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">{p.desc}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-widest group-hover:gap-4 transition-all mt-auto">View Case Study <ArrowRight size={14} /></div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  </>
);

// ========================================
// PROJECT DETAIL VIEW
// ========================================

const ProjectDetailView = ({ project, setView }) => {
  if (!project) return <div className="py-32 text-center"><p className="text-gray-500">No project selected.</p><Button variant="primary" onClick={() => setView('projects')}>Back to Projects</Button></div>;
  return (
    <>
      <PageHead title={project.name} description={project.desc} />
      <section className="bg-emerald-950 pt-40 pb-24 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={project.img} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/95 to-emerald-950/80"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10"><AnimatedSection>
          <button onClick={() => { setView('projects'); window.scrollTo(0, 0); }} className="flex items-center gap-2 text-emerald-100/60 hover:text-white text-xs uppercase tracking-widest font-bold mb-8"><ArrowLeft size={16} /> All Projects</button>
          <div className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-4">{project.type}</div>
          <h1 className="text-3xl md:text-6xl font-bold uppercase tracking-tighter mb-4">{project.name}</h1>
          <div className="flex items-center gap-6 text-emerald-100/60 text-sm font-bold">
            <span className="flex items-center gap-2"><MapPin size={14} /> {project.loc}</span>
            <span className="flex items-center gap-2"><Calendar size={14} /> {project.year}</span>
          </div>
        </AnimatedSection></div>
      </section>
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <AnimatedSection>
              <h3 className="text-2xl font-bold text-emerald-950 uppercase mb-6">Overview</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{project.desc}</p>
            </AnimatedSection>
            {project.challenge && (
              <AnimatedSection delay={100}>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100">
                    <h4 className="text-lg font-bold text-rose-800 uppercase mb-4">Challenge</h4>
                    <p className="text-rose-700 text-sm leading-relaxed">{project.challenge}</p>
                  </div>
                  <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
                    <h4 className="text-lg font-bold text-emerald-800 uppercase mb-4">Solution</h4>
                    <p className="text-emerald-700 text-sm leading-relaxed">{project.solution}</p>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
          <AnimatedSection delay={200}>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 space-y-6">
              <h4 className="text-lg font-bold text-emerald-950 uppercase mb-6">Project Facts</h4>
              {[{ l: "Location", v: project.loc }, { l: "Type", v: project.type }, { l: "Products", v: project.products }, { l: "Year", v: project.year }].map((f, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{f.l}</span>
                  <span className="text-sm font-bold text-emerald-950">{f.v}</span>
                </div>
              ))}
              <Button variant="primary" className="w-full mt-6" onClick={() => setView('contact')}>Discuss Similar Project</Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h3 className="text-2xl font-bold text-emerald-950 uppercase mb-8">Project Gallery</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[project.img, ...(project.gallery || [])].map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow-lg border-4 border-white h-64 group cursor-pointer">
                  <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={`${project.name} view ${i + 1}`} />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

// ========================================
// TRANSPORT & LOGISTICS VIEW
// ========================================

const TransportView = ({ setView }) => (
  <>
    <PageHead title="Logistics & Fleet" description="Zero-delay transport solutions with our proprietary fleet of 50+ vehicles." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-16 relative z-10">
        <AnimatedSection className="max-w-4xl">
          <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">Logistics & Fleet</div>
          <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4">Transport, Logistics & Fleet</h1>
          <p className="text-xl text-emerald-100/90 mb-8 font-light">Proprietary fleet ensuring zero-delay material delivery across India.</p>
          <p className="text-lg md:text-xl text-emerald-100/80 mb-12 max-w-2xl leading-relaxed font-medium">Mahalaxmi Group operates one of the region's most reliable proprietary fleets — 50+ tippers and bulk carriers — delivering raw materials and finished goods across Maharashtra, Gujarat, and beyond.</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="gold" onClick={() => setView('contact')}>Get a Transport Quote <ArrowRight size={18} /></Button>
            <Button variant="ghost" onClick={() => setView('divisions')}>View All Divisions</Button>
          </div>
        </AnimatedSection>
      </div>
      <Truck className="absolute bottom-[-80px] right-[-40px] text-white/5 rotate-12" size={400} />
    </section>

    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { n: "50+", d: "Active Tippers" },
              { n: "24/7", d: "Operations" },
              { n: "Pan-India", d: "Coverage" },
              { n: "On-Time", d: "Delivery Rate" }
            ].map((s, i) => (
              <div key={i} className="bg-emerald-50 p-8 rounded-2xl text-center border border-emerald-100">
                <div className="text-3xl md:text-4xl font-black text-emerald-950 mb-2">{s.n}</div>
                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">{s.d}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-16 items-center mb-20">
          <AnimatedSection direction="left" className="lg:w-1/2">
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Our Fleet</div>
            <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6 leading-tight">Purpose-Built for<br />Heavy Industry</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">Our fleet comprises 16-tyre tippers, bulk carriers, and specialized transport vehicles designed for mining output, aggregate supply, and construction chemical delivery. Each vehicle is GPS-tracked and maintained to the highest safety standards.</p>
            <div className="space-y-4">
              {[
                "16-tyre heavy-duty tippers for mining output",
                "Bulk carriers for aggregate & sand transport",
                "Temperature-controlled vehicles for chemical products",
                "GPS tracking on every vehicle for real-time monitoring",
                "Dedicated maintenance bay for zero-downtime operations"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={200} className="lg:w-1/2">
            <ParallaxImage src="/images/logistics-fleet-2.jpeg" alt="Mahalaxmi Fleet" className="h-[300px] md:h-[450px] w-full shadow-2xl" />
          </AnimatedSection>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
          <AnimatedSection direction="left" delay={200} className="lg:w-1/2">
            <ParallaxImage src="/images/transport-contracts.jpg" alt="Transport Operations" className="h-[300px] md:h-[450px] w-full shadow-2xl" />
          </AnimatedSection>
          <AnimatedSection direction="right" className="lg:w-1/2">
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Key Partners</div>
            <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6 leading-tight">Trusted by India's<br />Largest Corporations</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">We handle transport contracts for some of the country's most demanding industrial operations, ensuring on-time delivery for mega-infrastructure projects.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "Ultratech Cement", r: "Bulk Transport" },
                { n: "L&T Construction", r: "Project Logistics" },
                { n: "JSW Steel", r: "Material Haulage" },
                { n: "Amazon India", r: "Warehousing & Last-Mile" },
                { n: "ACC Cement", r: "Aggregate Supply" },
                { n: "Megha Engineering", r: "Infrastructure" }
              ].map((p, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="font-bold text-emerald-950 text-sm">{p.n}</div>
                  <div className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">{p.r}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-emerald-950 text-white">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Warehousing & Distribution</h3>
            <p className="text-emerald-100/80 text-lg leading-relaxed mb-12">Beyond transport, we provide warehousing solutions across key industrial corridors. Our facilities feature covered storage, mechanized loading/unloading, and inventory management systems.</p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { n: "Mumbai Warehouse", d: "50,000+ sq. ft. covered storage near Andheri industrial zone." },
            { n: "Gujarat Facility", d: "Adjacent to Bharuch manufacturing plant for seamless dispatch." },
            { n: "Distribution Network", d: "Multi-modal connectivity via road, rail, and port access." }
          ].map((w, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 card-hover">
                <MapPin className="text-amber-500 mb-4" size={28} />
                <h4 className="text-lg font-bold mb-3">{w.n}</h4>
                <p className="text-emerald-100/60 text-sm leading-relaxed">{w.d}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <ProductGallerySection />
    <ContactSection division="Transport & Logistics" />
  </>
);

// ========================================
// OEM VIEW
// ========================================

const OEMView = ({ setView }) => (
  <>
    <PageHead title="Contract Manufacturing" description="Private label construction chemical manufacturing services." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 text-white">
      <div className="container mx-auto px-6"><AnimatedSection className="max-w-4xl">
        <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">OEM Services</div>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4">Contract Manufacturing</h1>
        <p className="text-xl text-emerald-100/90 mb-8 font-light">Private-label production for international and domestic brands.</p>
        <p className="text-lg text-emerald-100/70 mb-12 max-w-2xl">Leverage our Bharuch manufacturing facility for white-label production of dry-mix construction chemicals.</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="gold" onClick={() => setView('contact')}>Partner With Us</Button>
          <Button variant="ghost" onClick={() => setView('infra')}>View Facility</Button>
        </div>
      </AnimatedSection></div>
    </section>
    <section className="py-16 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <SectionHeader title="OEM Capabilities" center={true} />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {[
            { t: "Custom Formulation", d: "We develop or adapt formulations to your spec.", i: <FlaskConical /> },
            { t: "Private Label Packing", d: "Your brand identity on our production output.", i: <Package /> },
            { t: "Quality Assurance", d: "ISO 9001:2015 certified processing.", i: <Shield /> },
            { t: "Scale Flexibility", d: "From 1-ton trial to 500-ton monthly supply.", i: <Factory /> }
          ].map((c, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100 card-hover text-center group h-full">
                <div className="text-emerald-950 mb-6 flex justify-center group-hover:text-amber-500 transition-colors">{React.cloneElement(c.i, { size: 40 })}</div>
                <h4 className="text-lg font-bold text-emerald-950 uppercase mb-4 tracking-tight">{c.t}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{c.d}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
    <section className="py-16 md:py-24 bg-emerald-950 text-white">
      <div className="container mx-auto px-6"><AnimatedSection>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[{ n: "5000", s: "MT/Month", l: "Capacity" }, { n: "200", s: "+", l: "SKUs Produced" }, { n: "15", s: "+", l: "Brands Served" }, { n: "99", s: "%", l: "On-Time Delivery" }].map((s, i) => (
            <div key={i} className="p-8">
              <div className="text-4xl md:text-5xl font-black text-amber-500 mb-2"><AnimatedCounter target={s.n} suffix={s.s} /></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/60">{s.l}</div>
            </div>
          ))}
        </div>
      </AnimatedSection></div>
    </section>
  </>
);

// ========================================
// INFRASTRUCTURE VIEW
// ========================================

const InfraView = ({ setView }) => (
  <>
    <PageHead title="Infrastructure" description="Infrastructure development and manufacturing hubs." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/infrastructure-background.webp" alt="Infrastructure Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/90 to-emerald-950/50"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10"><AnimatedSection>
        <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">Building Tomorrow</div>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter">Manufacturing & Infrastructure</h1>
        <p className="text-emerald-100/60 text-lg mt-4 max-w-2xl mx-auto">State-of-the-art production units, automated mineral processing, and end-to-end project execution capabilities.</p>
      </AnimatedSection></div>
    </section>

    <section className="py-16 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        {/* Bharuch Hub */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <AnimatedSection direction="left">
            <ParallaxImage src="https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Bharuch Manufacturing Plant" className="h-[400px] shadow-2xl" />
          </AnimatedSection>
          <AnimatedSection direction="right" delay={200}>
            <div className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-4">Production Capabilities</div>
            <SectionHeader title="Bharuch Manufacturing Hub" subtitle="Gujarat-based automated dry-mix production facility." />
            <p className="text-gray-600 text-lg leading-relaxed mb-8">Our flagship facility in Bharuch is equipped with automated dosing and mixing lines, ensuring consistent quality for our Greenseal range. The plant operates 24/7 with a dedicated quality control laboratory.</p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              {[{ n: "5,000", l: "MT/Month Capacity" }, { n: "4", l: "Production Lines" }, { n: "24/7", l: "Operations" }, { n: "ISO", l: "9001 & 14001" }].map((s, i) => (
                <div key={i} className="bg-emerald-50 p-6 rounded-xl text-center card-hover border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-950 mb-1">{s.n}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{s.l}</div>
                </div>
              ))}
            </div>
            <Button variant="primary" className="mt-10" onClick={() => setView('contact')}>Schedule Plant Visit</Button>
          </AnimatedSection>
        </div>

        {/* Integrated Solutions */}
        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          <AnimatedSection className="lg:col-span-1">
            <h3 className="text-3xl font-bold text-emerald-950 mb-6 uppercase tracking-tight">End-to-End Solutions</h3>
            <p className="text-gray-600 leading-relaxed mb-8">We don't just supply materials; we integrate layout, logistics, and on-site application support to ensure project success. From quarry to construction site, we control every step.</p>
            <ul className="space-y-4">
              {['RMC Plant Partnerships', 'Aggregate Supply Chain', 'Custom Formulations', 'On-Site Technical Support'].map(item => (
                <li key={item} className="flex items-center gap-3 text-emerald-900 font-semibold"><CheckCircle2 size={18} className="text-amber-500" /> {item}</li>
              ))}
            </ul>
          </AnimatedSection>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {[
              { t: "Mining Operations", d: "Dedicated silica sand and basalt mining leases ensuring raw material independence.", i: <HardHat /> },
              { t: "Logistics Fleet", d: "50+ proprietary tippers and bulk carriers for zero-delay delivery.", i: <Truck /> },
              { t: "Quality Lab", d: "In-house R&D facility for batch testing and new product development.", i: <FlaskConical /> },
              { t: "Warehousing", d: "Strategic storage hubs in Mumbai and Gujarat for rapid distribution.", i: <Package /> }
            ].map((c, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 card-hover h-full group">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-900 mb-6 group-hover:bg-emerald-950 group-hover:text-amber-500 transition-colors">
                    {React.cloneElement(c.i, { size: 24 })}
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950 mb-3">{c.t}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.d}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <AnimatedSection>
          <div className="bg-emerald-950 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">Ready to Scale?</h3>
              <p className="text-emerald-100/80 text-lg mb-10">Partner with an infrastructure leader that understands the value of time, quality, and reliability.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gold" onClick={() => setView('contact')}>Get a Quote</Button>
                <Button variant="ghost" onClick={() => setView('projects')}>View Our Projects</Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-700 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  </>

);

// ========================================
// APPLICATIONS VIEW
// ========================================

const ApplicationsView = ({ setView }) => (
  <>
    <PageHead title="Solutions" description="Application areas and technical solutions for construction challenges." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 text-white text-center">
      <div className="container mx-auto px-6"><AnimatedSection>
        <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">Solutions</div>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter">Application Areas</h1>
      </AnimatedSection></div>
    </section>
    <section className="py-16 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { p: "Rising damp in heritage structures", s: "Chemical DPC injection with Greenseal 306." },
            { p: "Leaking podiums and terraces", s: "Elastomeric coating GS-flex with fiber mesh." },
            { p: "Heavy traffic industrial floors", s: "High-strength screed GS 516 with hardener." },
            { p: "Tile de-bonding in high-rises", s: "C2TE certified adhesive GS 512." }
          ].map((a, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100 card-hover h-full flex flex-col justify-center">
                <div className="flex gap-4 mb-4">
                  <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest h-fit">Problem</div>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-6">{a.p}</h4>
                <div className="w-full h-px bg-gray-200 mb-6"></div>
                <div className="flex gap-4 mb-2">
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest h-fit">Solution</div>
                </div>
                <p className="text-emerald-950 font-bold text-lg">{a.s}</p>
                <button onClick={() => setView('contact')} className="mt-8 text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">Get Spec <ArrowRight size={12} /></button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </>
);

// ========================================
// DOWNLOADS VIEW
// ========================================

const DownloadsView = () => (
  <>
    <PageHead title="Downloads" description="Technical Data Sheets, Company Profiles, and Brochures." />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-24 md:pb-32 text-white text-center">
      <div className="container mx-auto px-6"><AnimatedSection>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter">Technical Library</h1>
        <p className="text-emerald-100/60 text-lg mt-4">Access technical data sheets, certifications, and brochures.</p>
      </AnimatedSection></div>
    </section>
    <section className="py-16 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Group Profile & Overview", file: "mahalaxmi-group-profile.pdf", size: "4.3 MB" },
            { name: "Construction Chemicals Division Profile", file: "mahalaxmi-chemicals-profile.pdf", size: "17.4 MB" },
            { name: "GSP Company Profile 2024", file: "gsp-company-profile-2024.pdf", size: "2.7 MB" },
            { name: "Project Reference List (India)", file: "project-reference-india.pdf", size: "0.1 MB" },
            { name: "Active Projects - Mumbai", file: "project-list-mumbai.pdf", size: "1.7 MB" },
            { name: "Active Projects - Delhi", file: "project-list-delhi.pdf", size: "1.8 MB" },
            { name: "Active Projects - Chennai", file: "project-list-chennai.pdf", size: "2.1 MB" },
            { name: "Technical Appendix (Rasa)", file: "appendix-rasa-infrachem.pdf", size: "0.02 MB" }
          ].map((d, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <a href={`/downloads/${d.file}`} target="_blank" rel="noopener noreferrer" className="block h-full group">
                <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors cursor-pointer text-center card-hover h-full flex flex-col items-center justify-between">
                  <div>
                    <div className="bg-white w-16 h-16 rounded-2xl shadow-sm mx-auto mb-6 flex items-center justify-center text-emerald-900 group-hover:text-amber-500 transition-colors"><FileText size={32} /></div>
                    <h4 className="font-bold text-emerald-950 mb-2">{d.name}</h4>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">PDF • {d.size}</div>
                  </div>
                  <Button variant="outline" className="w-full justify-center group-hover:bg-white"><Download size={14} /> Download</Button>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </>
);

// ========================================
// CONTACT VIEW
// ========================================

const ContactView = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', message: '' });
  const { status, errorMsg, submitForm, reset } = useFormSubmit();
  const loading = status === 'sending';
  const success = status === 'success';
  const error = errorMsg;

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm({ ...formData, form_type: activeTab });
  };

  return (
    <>
      <PageHead title="Contact Us" description="Get in touch with our team for quotes, support, and inquiries." />
      <section className="bg-emerald-950 pt-28 md:pt-48 pb-12 md:pb-32 text-white text-center">
        <div className="container mx-auto px-4 md:px-6"><AnimatedSection>
          <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Get in Touch</div>
          <h1 className="text-2xl md:text-7xl font-bold uppercase tracking-tighter">Start a Conversation</h1>
        </AnimatedSection></div>
      </section>

      <section className="py-6 md:py-32 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-16">
            <AnimatedSection>
              <div className="bg-white md:shadow-2xl rounded-2xl md:rounded-3xl p-4 md:p-12 md:border border-gray-100">
                {/* Tabs — General & Mahalaxmi Construction Chemicals only */}
                <div className="flex gap-2 mb-5 md:mb-8">
                  {[
                    { id: 'general', l: 'General Inquiry' },
                    { id: 'chemicals', l: 'Mahalaxmi Construction Chemicals' }
                  ].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-emerald-950 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{t.l}</button>
                  ))}
                </div>

                {success ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={28} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-950 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                    <button onClick={reset} className="mt-4 text-xs font-bold text-emerald-600 uppercase tracking-widest">Send Another</button>
                  </div>
                ) : (
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    {/* Honeypot — hidden from users, visible to bots */}
                    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                    <div className="space-y-1.5">
                      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" placeholder="Your full name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Company</label>
                      <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" placeholder="Company name" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" placeholder="+91 98210 50005" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Message</label>
                      <textarea rows={4} name="message" value={formData.message} onChange={handleChange} className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm resize-none" placeholder="Tell us about your requirements..."></textarea>
                    </div>
                    {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{error}</div>}
                    <Button variant="primary" type="submit" className="w-full py-3 md:py-4 shadow-lg text-sm" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'} {!loading && <ArrowRight size={16} />}
                    </Button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="space-y-6 md:space-y-12">
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-emerald-950 mb-3 md:mb-6">Headquarters</h3>
                  <p className="text-gray-600 text-sm md:text-lg leading-relaxed mb-4 md:mb-8">Ground Floor, 74/C, Kalpasutra Co-op Hsg Society Ltd,<br />Sarojini Road, Opp McDonald's, Vile Parle West,<br />Mumbai - 400 056, India</p>
                  <div className="space-y-3">
                    <a href="tel:+919821050005" className="flex items-center gap-3 text-emerald-950 font-bold hover:text-amber-600 transition-colors text-sm md:text-base"><Phone size={18} className="text-amber-500 shrink-0" /> +91 98210 50005</a>
                    <a href="mailto:info@themahalaxmigroup.com" className="flex items-center gap-3 text-emerald-950 font-bold hover:text-amber-600 transition-colors text-sm md:text-base break-all"><Mail size={18} className="text-amber-500 shrink-0" /> info@themahalaxmigroup.com</a>
                  </div>
                </div>
                <div className="w-full h-48 md:h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.588468792036!2d72.86314847525287!3d19.125701682090287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c828d1323f6b%3A0xe104394017772740!2sMahalaxmi%20Corporation!5e0!3m2!1sen!2sin!4v1715424911470!5m2!1sen!2sin"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mahalaxmi Corporation Location"
                  ></iframe>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
};

// ========================================
// FOOTER
// ========================================

const Footer = ({ setView, siteMode = 'full_access' }) => (
  <footer className="bg-emerald-950 text-white pt-16 md:pt-24 pb-8 md:pb-12 overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-800 to-transparent"></div>
    <div className="container mx-auto px-4 md:px-6 relative z-10">
      <div className="flex flex-col lg:flex-row gap-10 md:gap-16 mb-12 md:mb-24">
        {/* Brand + Social */}
        <div className="lg:w-1/4">
          <div className="flex items-center gap-3 mb-5 md:mb-8">
            <img src="/images/mahalaxmi-group-logo.png" alt="Mahalaxmi Group" className="w-10 h-10 object-contain" />
            <div className="leading-none">
              <div className="font-bold text-xl tracking-tight">MAHALAXMI</div>
              <div className="text-[8px] text-amber-500 uppercase tracking-[0.2em] font-bold">Group Industrial</div>
            </div>
          </div>
          <p className="text-emerald-100/60 leading-relaxed mb-5 md:mb-8 text-sm">Since 1942, delivering excellence in construction chemicals and mineral processing.</p>
          <div className="flex gap-3">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 md:w-10 md:h-10 border border-emerald-800 rounded-full flex items-center justify-center text-emerald-400 hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-500 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-9 h-9 md:w-10 md:h-10 border border-emerald-800 rounded-full flex items-center justify-center text-emerald-400 hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-500 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 md:w-10 md:h-10 border border-emerald-800 rounded-full flex items-center justify-center text-emerald-400 hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-500 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
          </div>
        </div>

        {/* Links Grid — 2 columns on mobile, stays compact */}
        <div className="grid grid-cols-2 gap-6 md:gap-12 lg:w-1/3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4 md:mb-8">Quick Links</h2>
            <ul className="space-y-3 text-emerald-100/70 text-sm font-medium">
              {['Home', 'About Us', 'Divisions', ...(siteMode === 'group_only' ? [] : ['Projects']), 'Contact'].map(l => (
                <li key={l}><button onClick={() => { setView(l.toLowerCase().split(' ')[0]); window.scrollTo(0, 0); }} className="hover:text-white hover:translate-x-1 transition-all block">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4 md:mb-8">Divisions</h2>
            <ul className="space-y-3 text-emerald-100/70 text-sm font-medium">
              {[{ n: 'Construction Chemicals', v: 'chemicals' }, { n: 'Millennium', v: 'millennium' }, { n: 'Shiv Minerals', v: 'shiv' }, { n: 'Transport', v: 'transport' }, { n: 'OEM', v: 'oem' }, { n: 'Infrastructure', v: 'infra' }].filter(l => siteMode === 'group_only' ? l.v !== 'chemicals' : true).map(l => (
                <li key={l.n}><button onClick={() => { setView(l.v); window.scrollTo(0, 0); }} className="hover:text-white hover:translate-x-1 transition-all block">{l.n}</button></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="lg:w-1/4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4 md:mb-8">Contact</h2>
          <div className="space-y-3 text-emerald-100/70 text-sm font-medium">
            <div className="leading-relaxed">Ground Floor, 74/C, Kalpasutra Co-op Hsg Society,<br />Sarojini Road, Vile Parle West,<br />Mumbai - 400 056</div>
            <div className="space-y-1.5">
              <a href="tel:+919152157578" className="text-white hover:text-amber-400 transition-colors block text-sm">+91 91521 57578</a>
              <a href="tel:+919820061842" className="text-white hover:text-amber-400 transition-colors block text-sm">+91 98200 61842</a>
              <a href="tel:+919821050005" className="text-white hover:text-amber-400 transition-colors block text-sm">+91 98210 50005</a>
            </div>
            <div className="text-sm break-all">info@themahalaxmigroup.com</div>
          </div>
        </div>
      </div>
      <div className="border-t border-emerald-900 pt-6 md:pt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-emerald-200/80 uppercase tracking-widest font-bold">
        <div>&copy; 2024 Mahalaxmi Group. All Rights Reserved.</div>
        <div className="flex gap-6">
          <button onClick={() => { setView('privacy'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">Privacy Policy</button>
          <button onClick={() => { setView('terms'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">Terms of Service</button>
        </div>
      </div>
    </div>
  </footer>
);

// ========================================
// PRIVACY POLICY VIEW
// ========================================

const PrivacyPolicyView = () => (
  <>
    <PageHead title="Privacy Policy" />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-16 md:pb-20">
      <div className="container mx-auto px-4 md:px-16">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-emerald-100/60 text-lg">Last updated: February 2026</p>
      </div>
    </section>
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-16 max-w-4xl">
        <div className="prose prose-lg prose-emerald max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">We collect information you provide directly, such as your name, email address, phone number, and company details when you fill out a contact form, request a quote, or subscribe to our communications. We also collect technical data such as IP addresses, browser type, and pages visited through standard web analytics.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">We use collected information to: respond to your inquiries and provide customer support; process your orders and deliver products; send you technical documents, catalogues, and updates; improve our website and services; comply with legal obligations and protect our rights.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">3. Cookies & Tracking</h2>
            <p className="text-gray-600 leading-relaxed">Our website uses cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings. Essential cookies for site functionality cannot be disabled.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">4. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">We may share your data with trusted third-party providers for analytics, email delivery, and payment processing. These providers are bound by strict data processing agreements. We do not sell your personal information to any third parties.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">We implement industry-standard security measures including SSL encryption, secure servers, and access controls to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">You have the right to access, update, or delete your personal information at any time. You may also opt out of marketing communications. To exercise these rights, please contact us at info@themahalaxmigroup.com.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">7. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">For privacy-related inquiries, contact:<br />Mahalaxmi Group<br />Ground Floor, 74/C, Kalpasutra Co-op Hsg Society, Sarojini Road, Vile Parle West, Mumbai - 400 056<br />Email: info@themahalaxmigroup.com<br />Phone: +91 98210 50005</p>
          </div>
        </div>
      </div>
    </section>
  </>
);

// ========================================
// TERMS OF SERVICE VIEW
// ========================================

const TermsOfServiceView = () => (
  <>
    <PageHead title="Terms of Service" />
    <section className="bg-emerald-950 pt-40 md:pt-48 pb-16 md:pb-20">
      <div className="container mx-auto px-4 md:px-16">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-emerald-100/60 text-lg">Last updated: February 2026</p>
      </div>
    </section>
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-16 max-w-4xl">
        <div className="prose prose-lg prose-emerald max-w-none space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">By accessing and using the Mahalaxmi Group website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you should not use this website.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">2. Use of Website</h2>
            <p className="text-gray-600 leading-relaxed">This website is intended for informational purposes and to facilitate business inquiries. You may not use this site for any unlawful purpose, to solicit others to engage in unlawful acts, or to violate any international, federal, or state regulations, rules, or laws.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">3. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">All content on this website, including text, graphics, logos, images, product photos, and software, is the property of Mahalaxmi Group and is protected by Indian and international intellectual property laws. The Greenseal brand and all related trademarks are property of their respective owners and used under license.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">4. Product Information</h2>
            <p className="text-gray-600 leading-relaxed">While we strive to provide accurate product information, specifications, and pricing, we reserve the right to correct errors and update information without prior notice. Product availability and specifications may vary by region and application.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">Mahalaxmi Group shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of this website or our products. Our total liability shall not exceed the amount paid for the specific product or service in question.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">6. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 mb-4">7. Contact</h2>
            <p className="text-gray-600 leading-relaxed">For questions about these Terms of Service, contact:<br />Mahalaxmi Group<br />Ground Floor, 74/C, Kalpasutra Co-op Hsg Society, Sarojini Road, Vile Parle West, Mumbai - 400 056<br />Email: info@themahalaxmigroup.com<br />Phone: +91 98210 50005</p>
          </div>
        </div>
      </div>
    </section>
  </>
);

// ========================================
// ADMIN LOGIN
// ========================================
const AdminLogin = () => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/admin/admin-auth.php?action=check', { credentials: 'include' })
      .then(r => {
        const ct = r.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new Error('no-php');
        return r.json();
      })
      .then(d => { if (d.authenticated) navigate('/admin/panel'); })
      .catch(() => { })
      .finally(() => setChecking(false));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/admin/admin-auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(creds)
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        throw new Error('PHP is not available. Deploy to your cPanel server to use the admin panel.');
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      navigate('/admin/panel');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <div className="min-h-screen bg-emerald-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/images/mahalaxmi-group-logo.png" alt="Mahalaxmi Group" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Panel</h1>
          <p className="text-emerald-100/50 text-sm mt-1">Mahalaxmi Group Website</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest">Username</label>
            <input type="text" value={creds.username} onChange={e => setCreds(p => ({ ...p, username: e.target.value }))} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm" placeholder="Enter username" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest">Password</label>
            <input type="password" value={creds.password} onChange={e => setCreds(p => ({ ...p, password: e.target.value }))} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm" placeholder="Enter password" />
          </div>
          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold uppercase tracking-widest text-xs rounded-xl transition-colors disabled:opacity-50 shadow-lg">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-emerald-100/30 text-[10px] mt-8 uppercase tracking-widest">Restricted Access</p>
      </div>
    </div>
  );
};

// ========================================
// ADMIN PANEL
// ========================================
const AdminPanel = () => {
  const [mode, setMode] = useState('group_only');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth first
    fetch('/admin/admin-auth.php?action=check', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (!d.authenticated) navigate('/admin'); })
      .catch(() => navigate('/admin'));

    // Get current mode
    fetch('/admin/admin-api.php?action=get_mode')
      .then(r => r.json())
      .then(d => setMode(d.mode || 'group_only'))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [navigate]);

  const toggleMode = async () => {
    const newMode = mode === 'group_only' ? 'full_access' : 'group_only';
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/admin/admin-api.php?action=set_mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mode: newMode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      setMode(newMode);
      setMessage(`Mode switched to: ${newMode === 'full_access' ? 'Full Access' : 'Group Only'}`);
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/admin/admin-auth.php?action=logout', { credentials: 'include' });
    navigate('/admin');
  };

  if (loading) return <div className="min-h-screen bg-emerald-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-emerald-950 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/mahalaxmi-group-logo.png" alt="" className="w-8 h-8 object-contain" />
            <div>
              <div className="text-white font-bold text-sm tracking-tight">MAHALAXMI</div>
              <div className="text-amber-500 text-[8px] uppercase tracking-widest font-bold">Admin Panel</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-emerald-100/60 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors">Logout</button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <h1 className="text-2xl font-bold text-emerald-950 mb-2">Site Visibility Control</h1>
        <p className="text-gray-500 mb-10">Toggle which content is displayed on the public website.</p>

        {/* Mode Toggle Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Mode</div>
              <div className={`text-xl font-bold ${mode === 'full_access' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {mode === 'full_access' ? 'Full Access' : 'Group Only'}
              </div>
            </div>
            <button onClick={toggleMode} disabled={saving} className={`relative w-16 h-9 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${mode === 'full_access' ? 'bg-emerald-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ${mode === 'full_access' ? 'translate-x-7' : 'translate-x-0'}`}></span>
            </button>
          </div>

          {/* Mode Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-5 rounded-xl border-2 transition-colors ${mode === 'group_only' ? 'border-amber-500 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}>
              <div className="text-sm font-bold text-emerald-950 mb-2">Group Only</div>
              <ul className="text-xs text-gray-500 space-y-1.5">
                <li>• Hides Chemicals section on Home</li>
                <li>• Hides Gallery on Home</li>
                <li>• Hides Chemicals from menus</li>
                <li>• Blocks Chemicals page</li>
              </ul>
            </div>
            <div className={`p-5 rounded-xl border-2 transition-colors ${mode === 'full_access' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
              <div className="text-sm font-bold text-emerald-950 mb-2">Full Access</div>
              <ul className="text-xs text-gray-500 space-y-1.5">
                <li>• Shows all content</li>
                <li>• Chemicals section visible</li>
                <li>• Gallery visible on Home</li>
                <li>• All pages accessible</li>
              </ul>
            </div>
          </div>

          {message && (
            <div className={`mt-6 p-3 rounded-lg text-sm font-medium ${message.startsWith('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Info Text */}
        <p className="text-gray-400 text-xs mt-6 text-center">
          Changes take effect immediately for new visitors. Cached pages may take a few seconds to update.
        </p>
      </div>
    </div>
  );
};

// ========================================
// MAIN APP COMPONENT
// ========================================

// Navigation helper for view-based legacy code
const NavigationAdapter = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map old view names to new URL paths
  const viewToPath = {
    'home': '/', 'about': '/about', 'group': '/about/group',
    'divisions': '/divisions', 'chemicals': '/divisions/chemicals',
    'millennium': '/divisions/millennium', 'shiv': '/divisions/shiv-minerals',
    'transport': '/divisions/transport',
    'oem': '/divisions/oem', 'infra': '/divisions/infrastructure',
    'products': '/products', 'product-detail': '/products/detail',
    'projects': '/projects', 'project-detail': '/projects/detail',
    'applications': '/solutions', 'downloads': '/downloads', 'contact': '/contact',
    'privacy': '/privacy-policy', 'terms': '/terms-of-service'
  };

  const setView = (viewName) => {
    const path = viewToPath[viewName] || '/';
    navigate(path);
  };

  // Determine view name from current path for legacy components
  const pathToView = Object.fromEntries(Object.entries(viewToPath).map(([k, v]) => [v, k]));
  const view = pathToView[location.pathname] || 'home';

  return children({ view, setView });
};

export default function App() {
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { siteMode } = useSiteMode();

  // Admin routes — render without main layout
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
      </Routes>
    );
  }

  // Map old view names to new URL paths
  const viewToPath = {
    'home': '/', 'about': '/about', 'group': '/about/group',
    'divisions': '/divisions', 'chemicals': '/divisions/chemicals',
    'millennium': '/divisions/millennium', 'shiv': '/divisions/shiv-minerals',
    'transport': '/divisions/transport',
    'oem': '/divisions/oem', 'infra': '/divisions/infrastructure',
    'products': '/products', 'product-detail': '/products/detail',
    'projects': '/projects', 'project-detail': '/projects/detail',
    'applications': '/solutions', 'downloads': '/downloads', 'contact': '/contact',
    'privacy': '/privacy-policy', 'terms': '/terms-of-service'
  };

  const setView = (viewName) => {
    const path = viewToPath[viewName] || '/';
    navigate(path);
  };

  const pathToView = Object.fromEntries(Object.entries(viewToPath).map(([k, v]) => [v, k]));
  const view = pathToView[location.pathname] || 'home';

  const isContact = location.pathname === '/contact';

  return (
    <div className="min-h-screen bg-white font-body text-emerald-950 selection:bg-amber-100 selection:text-emerald-950 container-boxed relative overflow-x-hidden">
      <ScrollToTop />
      <Navbar view={view} setView={setView} siteMode={siteMode} />
      <div className="page-enter">
        <Routes>
          <Route path="/" element={<HomeView setView={setView} siteMode={siteMode} />} />
          <Route path="/about" element={<AboutView setView={setView} />} />
          <Route path="/about/group" element={<GroupView setView={setView} />} />
          <Route path="/divisions" element={<DivisionsView setView={setView} />} />
          {siteMode === 'full_access' && (
            <Route path="/divisions/chemicals" element={<ChemicalsView setView={setView} />} />
          )}
          <Route path="/divisions/millennium" element={<MillenniumView setView={setView} />} />
          <Route path="/divisions/shiv-minerals" element={<ShivMineralsView setView={setView} />} />
          <Route path="/divisions/oem" element={<OEMView setView={setView} />} />
          <Route path="/divisions/infrastructure" element={<InfraView setView={setView} />} />
          <Route path="/divisions/transport" element={<TransportView setView={setView} />} />
          {siteMode !== 'group_only' && (
            <>
              <Route path="/products" element={<ProductsView setActiveProduct={setActiveProduct} setView={setView} />} />
              <Route path="/products/detail" element={<ProductDetailView product={activeProduct} setView={setView} />} />
              <Route path="/projects" element={<ProjectsView setView={setView} setActiveProject={setActiveProject} />} />
              <Route path="/projects/detail" element={<ProjectDetailView project={activeProject} setView={setView} />} />
              <Route path="/downloads" element={<DownloadsView />} />
            </>
          )}
          <Route path="/solutions" element={<ApplicationsView setView={setView} />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyView />} />
          <Route path="/terms-of-service" element={<TermsOfServiceView />} />
          <Route path="*" element={<HomeView setView={setView} siteMode={siteMode} />} />
        </Routes>
      </div>

      {/* Global CTA before Footer (except on Contact page) */}
      {!isContact && (
        <section className="bg-amber-500 py-20 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 uppercase tracking-tight mb-8 font-display">Ready for the Next Scale?</h2>
            <p className="text-emerald-900/80 text-lg font-bold mb-10 max-w-2xl mx-auto">Join 500+ industrial partners trusting Mahalaxmi for their raw material and chemical needs.</p>
            <div className="flex justify-center gap-4">
              <Button variant="primary" onClick={() => setView('contact')} className="shadow-xl">Start Project <ArrowRight size={16} /></Button>
              {siteMode !== 'group_only' && (
                <Button variant="white" onClick={() => setView('products')} className="shadow-xl">View Catalogue</Button>
              )}
            </div>
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
        </section>
      )}

      <Footer setView={setView} siteMode={siteMode} />
      <ChatWidget />
    </div>
  );
}