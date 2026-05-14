



<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ResumeAI - Build Your Future</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&amp;family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
                "primary-fixed-dim": "#d3bbff",
                "error-container": "#ffdad6",
                "primary-container": "#5b21b6",
                "on-tertiary-fixed-variant": "#4a4456",
                "inverse-on-surface": "#f0f1f2",
                "surface-container-low": "#f3f4f5",
                "on-primary-fixed-variant": "#581db3",
                "on-error": "#ffffff",
                "surface-container-lowest": "#ffffff",
                "tertiary-fixed": "#e9def5",
                "error": "#ba1a1a",
                "surface-container": "#edeeef",
                "on-primary": "#ffffff",
                "surface-container-high": "#e7e8e9",
                "inverse-primary": "#d3bbff",
                "surface-dim": "#d9dadb",
                "surface-container-highest": "#e1e3e4",
                "on-secondary-fixed": "#3e0022",
                "on-primary-container": "#c7aaff",
                "outline-variant": "#ccc3d6",
                "secondary-container": "#fd56a7",
                "on-tertiary-container": "#beb5ca",
                "on-tertiary": "#ffffff",
                "surface": "#f8f9fa",
                "secondary": "#b4136d",
                "outline": "#7b7485",
                "on-error-container": "#93000a",
                "on-secondary": "#ffffff",
                "tertiary": "#363041",
                "on-primary-fixed": "#250059",
                "on-secondary-container": "#600037",
                "on-surface": "#191c1d",
                "tertiary-container": "#4d4658",
                "secondary-fixed": "#ffd9e4",
                "primary": "#420093",
                "tertiary-fixed-dim": "#cdc2d9",
                "primary-fixed": "#ebddff",
                "background": "#f8f9fa",
                "on-secondary-fixed-variant": "#8c0053",
                "on-tertiary-fixed": "#1e1929",
                "surface-tint": "#713dcc",
                "inverse-surface": "#2e3132",
                "secondary-fixed-dim": "#ffb0cd",
                "surface-bright": "#f8f9fa",
                "on-surface-variant": "#4a4453",
                "surface-variant": "#e1e3e4",
                "on-background": "#191c1d"
        },
        "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
        },
        "spacing": {
                "unit": "8px",
                "margin-desktop": "40px",
                "glass-padding": "24px",
                "gutter": "24px",
                "margin-mobile": "16px",
                "container-max": "1280px",
                "bento-gap": "24px"
        },
        "fontFamily": {
                "body-sm": ["Sora"],
                "headline-lg-mobile": ["Sora"],
                "body-md": ["Sora"],
                "body-lg": ["Sora"],
                "display-lg": ["Sora"],
                "display-xl": ["Sora"],
                "headline-lg": ["Sora"],
                "headline-md": ["Sora"],
                "label-md": ["Sora"],
                "label-caps": ["Sora"]
        },
        "fontSize": {
                "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                "headline-lg-mobile": ["28px", {"lineHeight": "36px", "fontWeight": "600"}],
                "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                "display-xl": ["72px", {"lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "700"}],
                "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "600"}]
        }
      },
    },
  }
</script>
<style>
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.05);
        }
        .glow-violet {
            box-shadow: 0 20px 40px -15px rgba(66, 0, 147, 0.1);
        }
        .gradient-button {
            background: linear-gradient(90deg, #713dcc 0%, #ffb0cd 100%);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
</head>
<body class="bg-background text-on-background selection:bg-primary/20 font-body-md overflow-x-hidden">
<!-- Top Navigation Bar -->
<nav class="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-black/5 bg-white/70 backdrop-blur-[24px] shadow-lg flex justify-between items-center px-8 py-4 z-50">
<div class="font-display-lg text-primary tracking-tighter text-2xl">ResumeAI</div>
<div class="hidden md:flex gap-8 items-center">
<a class="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md" href="#">Features</a>
<a class="text-on-surface-variant hover:text-on-surface transition-colors font-body-md text-body-md" href="#">Templates</a>
<a class="text-on-surface-variant hover:text-on-surface transition-colors font-body-md text-body-md" href="#">Pricing</a>
<a class="text-on-surface-variant hover:text-on-surface transition-colors font-body-md text-body-md" href="#">Dashboard</a>
</div>
<div class="flex gap-4 items-center">
<button class="text-on-surface-variant hover:text-on-surface transition-colors font-body-md text-body-md px-4 py-2">Sign In</button>
<button class="gradient-button text-on-primary font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">Create Resume</button>
</div>
</nav>
<main>
<!-- Hero Section -->
<section class="relative min-h-screen pt-40 pb-20 px-6 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#fcfbff] to-[#f4efff]">
<!-- Background Glows -->
<div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
<div class="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
<div class="flex flex-col gap-8">
<div class="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-1 rounded-full w-fit">
<span class="material-symbols-outlined text-primary text-sm">bolt</span>
<span class="text-primary font-label-caps text-[10px] uppercase tracking-wider font-bold">AI-Powered Resume Builder</span>
</div>
<h1 class="font-display-xl text-display-xl text-on-surface leading-tight">
                        Build a Resume That <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Gets You Hired</span>
</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                        Harness the power of high-performance AI to craft ATS-optimized resumes in minutes. Designed for professionals who demand excellence.
                    </p>
<div class="flex flex-wrap gap-4 pt-4">
<button class="gradient-button text-on-primary font-bold px-8 py-4 rounded-xl text-lg shadow-lg shadow-primary/10 hover:shadow-xl transition-all">Create Resume</button>
<button class="bg-white text-on-surface font-semibold px-8 py-4 rounded-xl text-lg border border-black/5 hover:bg-surface transition-all shadow-sm">View Templates</button>
</div>
<div class="flex items-center gap-4 mt-4">
<div class="flex -space-x-3">
<img alt="User" class="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUBOfd2HZn8he8IwxT8MzTg3TxBaGpD8AqjuT3kSKYAfG5eRVsz0_cobeIIiaxNtCvZSimwYe3u-GyVMGg8q29f5Djmq2RF6h7GXxiwLs_6sR0XQClJMPRxtm7CyFRgs2sy_9PvgvE022tmhx9l_2CqIF2ovqNcn5myiy_Q9NBj479mfoOlxtxXxCndTDj_42caQv92tDUVb3GTBzBsoG3nxa-Jv-FcaE9_GATlccQcvwDO93g5QbCtHocSSaWuRtP0USuZteng9LH"/>
<img alt="User" class="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbY63vtN1q2LdHjmYvDyGyJtb2rCUBz1Oq2VpcH9_so2qhIJe30Y1Pt-H71ybyHe7Ui4c6EMUX1OWzvbSMXfG5hKmhFLZqdFOAn8A08e5tgCObygxrpykJs9vAbV_U8Sx90bitda0OLZmQgmufoeT50ahf8agNH4tpav-R79nSbHxHVQWkmR6iAeuitAdBatRLrcsNixkR934p0RrdoQYZDKF4uUvgrWqAbyPxXh7a5aTDjqWHFnC04txrsRFJkQEs68MZXOxZjP3C"/>
<img alt="User" class="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHLwCuVygpul-k_le2qIO4YZYV14wwzxXbsYWQGuv2zqC1TPtWD9cnSq-QzFEQbGN_Vm30qfhHIiajqTPHid5Sj-eypjw0-M9myC9dCf6Dqc8tXxZ0DCSwgld23SnH3N5Ndj9HfwSZv6ccCDiEUiMVfT6GuwUTZfm47zsiUO_mFRfwJdyLzK4A6BRHG_Y5jl1_N-ho1jwVI39LBGrx4tDK4TGCnZA0vCiPWLkrT_ORbgKC2yqawoWx8mQeQtvlaSUWd0xFmBoMlUlV"/>
</div>
<p class="text-on-surface-variant text-sm">Join <span class="text-primary font-bold">100K+</span> successful job seekers</p>
</div>
</div>
<!-- Hero Visual -->
<div class="relative h-[600px] flex items-center justify-center">
<div class="relative w-full max-w-md aspect-[3/4] glass-card rounded-2xl p-8 glow-violet overflow-hidden">
<div class="flex flex-col gap-6">
<div class="w-24 h-4 bg-primary/10 rounded-full"></div>
<div class="w-full h-8 bg-black/5 rounded-lg"></div>
<div class="space-y-3">
<div class="w-3/4 h-3 bg-black/5 rounded-full"></div>
<div class="w-1/2 h-3 bg-black/5 rounded-full"></div>
</div>
<div class="pt-8 border-t border-black/5 space-y-4">
<div class="flex justify-between items-center">
<div class="w-20 h-4 bg-secondary/10 rounded-full"></div>
<div class="w-12 h-3 bg-black/5 rounded-full"></div>
</div>
<div class="w-full h-24 bg-surface-container rounded-xl border border-black/5"></div>
<div class="w-full h-24 bg-surface-container rounded-xl border border-black/5 opacity-50"></div>
</div>
</div>
<!-- Animated Floating Bits -->
<div class="absolute -top-10 -right-10 w-32 h-32 glass-card rounded-xl flex items-center justify-center rotate-12 shadow-xl border-black/5">
<span class="material-symbols-outlined text-secondary text-4xl" data-weight="fill">verified</span>
</div>
<div class="absolute bottom-20 -left-12 w-48 h-20 glass-card rounded-xl p-4 flex flex-col justify-center -rotate-6 shadow-xl border-black/5">
<div class="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">ATS Score</div>
<div class="text-2xl font-bold text-on-surface">98/100</div>
</div>
</div>
</div>
</div>
</section>
<!-- Trust Section -->
<section class="py-12 border-y border-black/5 bg-white">
<div class="max-w-7xl mx-auto px-6">
<p class="text-center text-on-surface-variant font-label-caps text-label-caps mb-10">Trusted by professionals at top companies</p>
<div class="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
<div class="text-2xl font-extrabold text-on-surface tracking-tighter">Google</div>
<div class="text-2xl font-extrabold text-on-surface tracking-tighter">Meta</div>
<div class="text-2xl font-extrabold text-on-surface tracking-tighter">OpenAI</div>
<div class="text-2xl font-extrabold text-on-surface tracking-tighter">Amazon</div>
<div class="text-2xl font-extrabold text-on-surface tracking-tighter">Netflix</div>
</div>
</div>
</section>
<!-- Features Bento Grid -->
<section class="py-24 px-6 max-w-7xl mx-auto">
<div class="text-center mb-16">
<h2 class="font-display-lg text-display-lg text-on-surface mb-4">Precision Engineered Features</h2>
<p class="text-on-surface-variant max-w-2xl mx-auto">Elevate your career prospects with our suite of intelligent career tools designed for the modern job market.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-bento-gap auto-rows-[280px]">
<!-- Large Feature -->
<div class="md:col-span-8 md:row-span-2 glass-card rounded-3xl p-10 flex flex-col justify-end group hover:bg-white transition-all">
<div class="mb-auto">
<div class="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 border border-primary/10">
<span class="material-symbols-outlined text-primary text-4xl">auto_fix_high</span>
</div>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-3">AI Resume Generation</h3>
<p class="text-on-surface-variant text-body-lg max-w-md">Our neural networks analyze thousands of successful resumes to draft yours with professional precision and impact.</p>
</div>
</div>
<!-- Stats Card -->
<div class="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between group hover:bg-white transition-all">
<div class="flex justify-between items-start">
<span class="material-symbols-outlined text-secondary text-3xl">analytics</span>
<div class="bg-secondary/5 text-secondary text-[10px] px-2 py-1 rounded font-bold border border-secondary/10">LIVE SCORE</div>
</div>
<div>
<div class="text-4xl font-bold text-on-surface mb-1">ATS Match</div>
<p class="text-on-surface-variant text-sm">Real-time compatibility checking.</p>
</div>
</div>
<!-- Small Feature -->
<div class="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between group hover:bg-white transition-all">
<span class="material-symbols-outlined text-primary text-3xl">download</span>
<div>
<h3 class="font-bold text-xl text-on-surface mb-1">1-Click Export</h3>
<p class="text-on-surface-variant text-sm">PDF, DocX, or JSON formats.</p>
</div>
</div>
<!-- CTA Feature -->
<div class="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-center items-center text-center group hover:bg-white transition-all border-primary/10">
<div class="text-primary font-bold text-3xl mb-2">99.9%</div>
<p class="text-on-surface-variant text-sm">ATS Bypass Success Rate</p>
</div>
<!-- Medium Feature -->
<div class="md:col-span-8 glass-card rounded-3xl p-8 flex items-center gap-8 group hover:bg-white transition-all">
<div class="hidden sm:block w-40 h-40 bg-surface-variant rounded-2xl border border-black/5 flex-shrink-0 overflow-hidden">
<div class="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-5xl">lightbulb</span>
</div>
</div>
<div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Smart Suggestions</h3>
<p class="text-on-surface-variant text-body-md">Context-aware advice to improve your bullet points and highlight key achievements automatically.</p>
</div>
</div>
</div>
</section>
<!-- AI Assistant Section -->
<section class="py-24 bg-surface-container-low/30 overflow-hidden border-y border-black/5">
<div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
<div class="order-2 lg:order-1">
<div class="glass-card rounded-3xl p-6 glow-violet relative max-w-lg mx-auto lg:mx-0 border-black/5 bg-white shadow-xl">
<!-- AI UI Interface -->
<div class="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
<div class="w-3 h-3 rounded-full bg-red-400"></div>
<div class="w-3 h-3 rounded-full bg-amber-400"></div>
<div class="w-3 h-3 rounded-full bg-emerald-400"></div>
<div class="ml-auto text-on-surface-variant text-xs font-label-caps">AI Assistant v4.2</div>
</div>
<div class="space-y-4">
<div class="flex gap-3">
<div class="w-8 h-8 rounded-lg gradient-button flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-white text-xs">smart_toy</span>
</div>
<div class="bg-surface-container rounded-2xl p-4 text-sm text-on-surface">
                                    I've analyzed your "Project Manager" experience. Would you like to quantify your achievements?
                                </div>
</div>
<div class="flex flex-col gap-2 ml-11">
<button class="w-full text-left bg-primary/5 hover:bg-primary/10 border border-primary/10 p-3 rounded-xl text-xs text-primary transition-all">
                                    "Managed budget of $50k" → "Optimized $50k budget, saving 15% annually"
                                </button>
<button class="w-full text-left bg-black/5 hover:bg-black/10 border border-black/5 p-3 rounded-xl text-xs text-on-surface-variant transition-all">
                                    Show more suggestions...
                                </button>
</div>
<div class="flex gap-3 justify-end">
<div class="bg-primary/10 rounded-2xl p-4 text-sm text-primary font-semibold">
                                    Yes, apply the first one!
                                </div>
<img alt="Avatar" class="w-8 h-8 rounded-lg flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU6JwnSJ7amL30reRrXsm3fYXdxDWaDkQRr9q1syHYh5bZM7VyBuJUkOnksFUCJMt7MjjO2H7zrdKHkucEMg0iLaCap1INBRv79joxqMlAso0BHlmRf2Loya5k7Xq3ZX7EXkGKUuntN_4N4qAtgcRpMX_aVM_j9tWqJvS9hegx1Fc8vQ688wdmUJ40f8E70J4Pdng3E2JWz5vyHNBV3ykCRXapXbohi-veO2jgYe-uvYbQS4bgJXFoiLTycfNOFNYJZpu1I9mb5DOE"/>
</div>
</div>
<!-- Score Indicator -->
<div class="absolute -right-8 -bottom-8 glass-card p-6 rounded-2xl shadow-2xl bg-white border-black/5">
<div class="flex items-center gap-4">
<div class="relative w-16 h-16">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-black/5" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-width="6"></circle>
<circle class="text-secondary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-dasharray="176" stroke-dashoffset="30" stroke-width="6"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-on-surface">85%</div>
</div>
<div>
<div class="text-[10px] text-on-surface-variant font-label-caps">MATCH SCORE</div>
<div class="text-on-surface font-bold">Sr. Product Designer</div>
</div>
</div>
</div>
</div>
</div>
<div class="order-1 lg:order-2 flex flex-col gap-6">
<h2 class="font-display-lg text-display-lg text-on-surface">Your Personal <span class="text-primary italic">Career Architect</span></h2>
<p class="text-on-surface-variant text-body-lg">Beyond simple templates, ResumeAI acts as a career consultant, identifying gaps in your experience and suggesting improvements based on real-world job requirements.</p>
<ul class="space-y-4 pt-4">
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary" data-weight="fill">check_circle</span>
<span class="text-on-surface font-semibold">Dynamic Keyword Optimization</span>
</li>
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary" data-weight="fill">check_circle</span>
<span class="text-on-surface font-semibold">Grammar &amp; Tone Analysis</span>
</li>
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary" data-weight="fill">check_circle</span>
<span class="text-on-surface font-semibold">Impact Factor Quantifier</span>
</li>
</ul>
</div>
</div>
</section>
<!-- Template Showcase -->
<section class="py-24 px-6 bg-white">
<div class="max-w-7xl mx-auto">
<div class="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
<div>
<h2 class="font-display-lg text-display-lg text-on-surface mb-4">Designer-Grade Templates</h2>
<p class="text-on-surface-variant max-w-xl">Every template is handcrafted by hiring experts to ensure clarity and professional appeal across all industries.</p>
</div>
<div class="flex gap-4">
<button class="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-surface transition-all shadow-sm">
<span class="material-symbols-outlined">arrow_back</span>
</button>
<button class="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-surface transition-all shadow-sm">
<span class="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
<div class="flex gap-bento-gap overflow-x-auto pb-8 snap-x no-scrollbar">
<!-- Template Card 1 -->
<div class="min-w-[300px] md:min-w-[400px] snap-start glass-card rounded-3xl p-4 group cursor-pointer hover:border-primary/30 transition-all">
<div class="aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-6">
<img alt="Resume Template" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6BB69zVZpxngiC7Ydorj6NfdXOzCJhdIKGqO9rgiI2cOrosBJREd4RPu8yXiWsvbhE2cSOz1gneJI5pzCvcdOSkCTzmIzLK6oEoZo4771P-DRsUc2BidYwecLwdrv67kOotSPhMMxxKxG-ZnEZXtzZCVLPyW2LhhM21CZEte3lwHN_06VIn0ti3DtGe6zagv5bddDqJDVgK8iOYiWS1hq9xNawzOyUoYMSRGCnQW_0iIN0p_6ZWI7CMEk4Hbyln7k5YRE5B4K_MUn"/>
</div>
<div class="px-2">
<h3 class="text-xl font-bold text-on-surface">The Executive</h3>
<p class="text-on-surface-variant text-sm">Perfect for management and C-suite roles.</p>
</div>
</div>
<!-- Template Card 2 -->
<div class="min-w-[300px] md:min-w-[400px] snap-start glass-card rounded-3xl p-4 group cursor-pointer hover:border-primary/30 transition-all">
<div class="aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-6">
<img alt="Resume Template" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC5WyaaS2DQMsZSEUhClqo4v0lH3PXPspFG9JC45E5LRWFHpNP8NHMB3Z5x01CyODQEcrzjq8O6feY9XR1kDl-k-50rQG8ImeYWsb7sUS95IRDxCp6egv8tO850uIGi_rQLU7A98w3jzdsJfbZ-mY016HUwgH3fAojmQO30MLvSvFWymszefFCXInCxGH4aOGurOjr8tCvw9Y_KTdVtpZZ6TxG6FUt64Q2cW8CtS0sWUIDfDNvMRrupfYs5cse_IvPm5rv53kRpNkD"/>
</div>
<div class="px-2">
<h3 class="text-xl font-bold text-on-surface">The Creative</h3>
<p class="text-on-surface-variant text-sm">Stand out in tech, design, and media.</p>
</div>
</div>
<!-- Template Card 3 -->
<div class="min-w-[300px] md:min-w-[400px] snap-start glass-card rounded-3xl p-4 group cursor-pointer hover:border-primary/30 transition-all">
<div class="aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-6">
<img alt="Resume Template" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOAv86M7KBfeAvz5H6LOoZebHPZkjhDwtTnrSt6aobHB5xLKxeb3uCTIH2I9NuC6Gi83CdNGqtlZFpqx1-9bV_yYsqbvjpfhSoZmcQ0tO3mVp5oYYnUa3RL2EuUYXJEZuCP11hGdHnJIJaz9BZGH7y2ls0zakomLRlbkz-Myidp6OMiWs5m3j_LTHcJtBn1B3TUlu5hWulwAT9CAaj5F_pY8jY96bFbebJQ0uGo5JA0ous8fZZg05QRxiauzUABGDWb1wnFm_P4VKF"/>
</div>
<div class="px-2">
<h3 class="text-xl font-bold text-on-surface">The Minimalist</h3>
<p class="text-on-surface-variant text-sm">Clean, efficient, and 100% ATS-ready.</p>
</div>
</div>
</div>
</div>
</section>
<!-- Pricing Section -->
<section class="py-24 px-6 max-w-7xl mx-auto">
<div class="text-center mb-16">
<h2 class="font-display-lg text-display-lg text-on-surface mb-4">Simple, Transparent Pricing</h2>
<p class="text-on-surface-variant max-w-xl mx-auto">Choose the plan that fits your career goals. No hidden fees.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
<!-- Free Plan -->
<div class="glass-card rounded-[32px] p-10 flex flex-col hover:translate-y-[-8px] transition-transform duration-500 bg-white shadow-lg">
<div class="mb-8">
<h3 class="text-2xl font-bold text-on-surface mb-2">Free</h3>
<p class="text-on-surface-variant text-sm">Perfect for getting started.</p>
<div class="mt-6 flex items-baseline gap-1">
<span class="text-5xl font-extrabold text-on-surface">$0</span>
<span class="text-on-surface-variant">/month</span>
</div>
</div>
<ul class="space-y-4 mb-10 flex-grow">
<li class="flex items-center gap-3 text-on-surface/80 text-sm">
<span class="material-symbols-outlined text-primary">check</span> 1 AI Resume Build
                        </li>
<li class="flex items-center gap-3 text-on-surface/80 text-sm">
<span class="material-symbols-outlined text-primary">check</span> Basic ATS Check
                        </li>
<li class="flex items-center gap-3 text-on-surface/80 text-sm opacity-40">
<span class="material-symbols-outlined">close</span> Premium Templates
                        </li>
</ul>
<button class="w-full py-4 rounded-2xl border border-black/5 hover:bg-surface font-bold transition-all shadow-sm">Get Started</button>
</div>
<!-- Pro Plan -->
<div class="glass-card rounded-[32px] p-10 flex flex-col bg-white border-primary/20 relative overflow-hidden hover:translate-y-[-8px] transition-transform duration-500 shadow-xl glow-violet">
<div class="absolute top-0 right-0 bg-primary text-on-primary px-6 py-2 rounded-bl-2xl font-bold text-[10px] uppercase tracking-widest">Most Popular</div>
<div class="mb-8">
<h3 class="text-2xl font-bold text-on-surface mb-2">Pro</h3>
<p class="text-on-surface-variant text-sm">For serious job seekers.</p>
<div class="mt-6 flex items-baseline gap-1">
<span class="text-5xl font-extrabold text-on-surface">$12</span>
<span class="text-on-surface-variant">/month</span>
</div>
</div>
<ul class="space-y-4 mb-10 flex-grow">
<li class="flex items-center gap-3 text-on-surface text-sm">
<span class="material-symbols-outlined text-primary">check</span> Unlimited AI Resumes
                        </li>
<li class="flex items-center gap-3 text-on-surface text-sm">
<span class="material-symbols-outlined text-primary">check</span> Advanced ATS Scoring
                        </li>
<li class="flex items-center gap-3 text-on-surface text-sm">
<span class="material-symbols-outlined text-primary">check</span> Premium Templates
                        </li>
<li class="flex items-center gap-3 text-on-surface text-sm">
<span class="material-symbols-outlined text-primary">check</span> Smart Suggestions
                        </li>
</ul>
<button class="w-full py-4 rounded-2xl gradient-button text-on-primary font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all">Upgrade Now</button>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-white py-20 px-6 border-t border-black/5">
<div class="max-w-7xl mx-auto">
<div class="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
<div class="max-w-xs">
<div class="font-display-lg text-primary tracking-tighter text-3xl mb-6">ResumeAI</div>
<p class="text-on-surface-variant text-sm mb-6">Next-generation resume building platform powered by state-of-the-art artificial intelligence.</p>
<div class="flex gap-4">
<a class="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 transition-all border-black/5 shadow-sm" href="#">
<svg class="w-5 h-5 fill-on-surface" viewbox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
</a>
<a class="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 transition-all border-black/5 shadow-sm" href="#">
<svg class="w-5 h-5 fill-on-surface" viewbox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
</a>
</div>
</div>
<div class="grid grid-cols-2 sm:grid-cols-3 gap-12">
<div class="flex flex-col gap-4">
<h4 class="font-bold text-on-surface">Product</h4>
<a class="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Features</a>
<a class="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Templates</a>
<a class="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Pricing</a>
</div>
<div class="flex flex-col gap-4">
<h4 class="font-bold text-on-surface">Resources</h4>
<a class="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Blog</a>
<a class="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">ATS Guide</a>
<a class="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Help Center</a>
</div>
<div class="flex flex-col gap-4">
<h4 class="font-bold text-on-surface">Legal</h4>
<a class="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Privacy Policy</a>
<a class="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Terms of Service</a>
<a class="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Cookie Policy</a>
</div>
</div>
<div class="glass-card p-8 rounded-3xl max-w-sm w-full bg-surface border-black/5 shadow-md">
<h4 class="font-bold text-on-surface mb-4">Stay Updated</h4>
<p class="text-on-surface-variant text-xs mb-6">Get career tips and product updates delivered to your inbox.</p>
<div class="flex gap-2">
<input class="bg-white border border-black/5 rounded-xl text-sm w-full focus:ring-primary focus:border-primary px-4 py-2" placeholder="Email address" type="email"/>
<button class="gradient-button p-2 rounded-xl flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary">send</span>
</button>
</div>
</div>
</div>
<div class="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 gap-4">
<p class="text-on-surface-variant text-xs">© 2024 ResumeAI Premium. All rights reserved.</p>
<div class="flex gap-6">
<span class="text-on-surface-variant text-xs cursor-pointer hover:text-primary transition-colors">Contact Support</span>
<span class="text-on-surface-variant text-xs cursor-pointer hover:text-primary transition-colors">Affiliates</span>
</div>
</div>
</div>
</footer>
</body></html>