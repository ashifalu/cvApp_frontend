import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Home = () => {

    const stageRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.3 });

        tl.fromTo(
            "#piece-header",
            { y: -300, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 }
        )
            .fromTo(
                "#piece-exp",
                { x: 500, opacity: 0 },
                { x: 0, opacity: 1, duration: 1 },
                "-=0.7"
            )
            .fromTo(
                "#piece-skills",
                { y: 300, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                "-=0.7"
            )
            .to(
                "#cv-card",
                { opacity: 1, scale: 1, duration: 0.6 },
                "+=0.3"
            );
    }, []);

    return (
        <div>
            <Navbar />
            <div className="bg-background text-on-background selection:bg-primary/20 font-body-md overflow-x-hidden">

                <main>
                    {/* ── HERO ─────────────────────────────────────────────── */}
                    <section className="relative min-h-screen pt-8r sm:pt-40 pb-16 md:pb-20 px-4 sm:px-6 flex items-center justify-center overflow-hidden bg-white">
                        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] sm:w-[600px] sm:h-[600px]  rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
                            <div className="flex flex-col gap-4 sm:gap-8 text-center lg:text-left items-center lg:items-start">
                                <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-1 rounded-full w-fit">
                                    <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                                    <span className="text-primary font-label-caps text-[10px] uppercase tracking-wider font-bold">AI-Powered Resume Builder</span>
                                </div>
                                <h1 className="font-[Poppins] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] sm:leading-[0.95] tracking-tight text-[#111827]">
                                    Build a Resume That <span className="bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">Gets You Hired</span>
                                </h1>
                                <p className="font-body-lg text-sm sm:text-body-lg text-on-surface-variant max-w-xl">
                                    Harness the power of high-performance AI to craft ATS-optimized resumes in minutes. Designed for professionals who demand excellence.
                                </p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2 sm:pt-4 w-full sm:w-auto px-5 sm:px-0">
                                    <a href="/select-template" className="w-full sm:w-auto">
                                        <button className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-on-primary font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg shadow-primary/10 hover:shadow-xl transition-all">
                                            Create Resume
                                        </button>
                                    </a>
                                    <a href="/select-template" className="w-full sm:w-auto bg-white text-on-surface font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg border border-black/5 hover:bg-surface transition-all shadow-sm">
                                        View Templates
                                    </a>
                                </div>
                                <div className="flex items-center gap-4 mt-2 sm:mt-4">
                                    <div className="flex -space-x-3">
                                        <img alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUBOfd2HZn8he8IwxT8MzTg3TxBaGpD8AqjuT3kSKYAfG5eRVsz0_cobeIIiaxNtCvZSimwYe3u-GyVMGg8q29f5Djmq2RF6h7GXxiwLs_6sR0XQClJMPRxtm7CyFRgs2sy_9PvgvE022tmhx9l_2CqIF2ovqNcn5myiy_Q9NBj479mfoOlxtxXxCndTDj_42caQv92tDUVb3GTBzBsoG3nxa-Jv-FcaE9_GATlccQcvwDO93g5QbCtHocSSaWuRtP0USuZteng9LH"/>
                                        <img alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbY63vtN1q2LdHjmYvDyGyJtb2rCUBz1Oq2VpcH9_so2qhIJe30Y1Pt-H71ybyHe7Ui4c6EMUX1OWzvbSMXfG5hKmhFLZqdFOAn8A08e5tgCObygxrpykJs9vAbV_U8Sx90bitda0OLZmQgmufoeT50ahf8agNH4tpav-R79nSbHxHVQWkmR6iAeuitAdBatRLrcsNixkR934p0RrdoQYZDKF4uUvgrWqAbyPxXh7a5aTDjqWHFnC04txrsRFJkQEs68MZXOxZjP3C"/>
                                        <img alt="User" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHLwCuVygpul-k_le2qIO4YZYV14wwzxXbsYWQGuv2zqC1TPtWD9cnSq-QzFEQbGN_Vm30qfhHIiajqTPHid5Sj-eypjw0-M9myC9dCf6Dqc8tXxZ0DCSwgld23SnH3N5Ndj9HfwSZv6ccCDiEUiMVfT6GuwUTZfm47zsiUO_mFRfwJdyLzK4A6BRHG_Y5jl1_N-ho1jwVI39LBGrx4tDK4TGCnZA0vCiPWLkrT_ORbgKC2yqawoWx8mQeQtvlaSUWd0xFmBoMlUlV"/>
                                    </div>
                                    <p className="text-on-surface-variant text-xs sm:text-sm">Join <span className="text-primary font-bold">100K+</span> successful job seekers</p>
                                </div>
                            </div>

                            {/* Hero visual — hidden on mobile to avoid overflow/clutter, shown from sm up */}
                            <div className="relative items-center justify-center px-4">
                                <div className="vertical-slider hidden lg:flex">
                                    <div className="v-column v-up">
                                        <div className="v-track">
                                            <img src="/images/template2.png" alt=""/>
                                            <img src="/images/template10.png" alt=""/>
                                            <img src="/images/template13.png" alt=""/>
                                            <img src="/images/template14.png" alt=""/>

                                            <img src="/images/template2.png" alt=""/>
                                            <img src="/images/template10.png" alt=""/>
                                            <img src="/images/template13.png" alt=""/>
                                            <img src="/images/template14.png" alt=""/>
                                        </div>
                                    </div>

                                    <div className="v-column v-down">
                                        <div className="v-track">
                                            <img src="/images/template9.png" alt=""/>
                                            <img src="/images/template5.png" alt=""/>
                                            <img src="/images/template4.png" alt=""/>
                                            <img src="/images/template1.png" alt=""/>

                                            <img src="/images/template9.png" alt=""/>
                                            <img src="/images/template5.png" alt=""/>
                                            <img src="/images/template4.png" alt=""/>
                                            <img src="/images/template1.png" alt=""/>
                                        </div>
                                    </div>
                                </div>

                                <div className="horizontal-slider lg:hidden">
                                    <div className="h-row h-right">
                                        <img src="/images/template2.png" alt=""/>
                                        <img src="/images/template10.png" alt=""/>
                                        <img src="/images/template13.png" alt=""/>
                                        <img src="/images/template14.png" alt=""/>
                                        <img src="/images/template9.png" alt=""/>

                                        <img src="/images/template2.png" alt=""/>
                                        <img src="/images/template10.png" alt=""/>
                                        <img src="/images/template13.png" alt=""/>
                                        <img src="/images/template14.png" alt=""/>
                                        <img src="/images/template9.png" alt=""/>
                                    </div>

                                    <div className="h-row h-left">
                                        <img src="/images/template5.png" alt=""/>
                                        <img src="/images/template4.png" alt=""/>
                                        <img src="/images/template1.png" alt=""/>
                                        <img src="/images/template7.png" alt=""/>
                                        <img src="/images/template16.png" alt=""/>

                                        <img src="/images/template5.png" alt=""/>
                                        <img src="/images/template4.png" alt=""/>
                                        <img src="/images/template1.png" alt=""/>
                                        <img src="/images/template7.png" alt=""/>
                                        <img src="/images/template16.png" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── LOGOS ─────────────────────────────────────────────── */}
                    <section className="py-8 sm:py-12 border-y border-black/5 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <p className="text-center text-on-surface-variant font-label-caps text-label-caps mb-6 sm:mb-10">Trusted
                                by professionals at top companies</p>
                            <div
                                className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                                <div
                                    className="text-lg sm:text-2xl font-extrabold text-on-surface tracking-tighter">Google
                                </div>
                                <div
                                    className="text-lg sm:text-2xl font-extrabold text-on-surface tracking-tighter">Meta
                                </div>
                                <div
                                    className="text-lg sm:text-2xl font-extrabold text-on-surface tracking-tighter">OpenAI
                                </div>
                                <div
                                    className="text-lg sm:text-2xl font-extrabold text-on-surface tracking-tighter">Amazon
                                </div>
                                <div
                                    className="text-lg sm:text-2xl font-extrabold text-on-surface tracking-tighter">Netflix
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── FEATURES / BENTO ──────────────────────────────────── */}
                    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
                        <div className="text-center mb-10 sm:mb-16">
                            <h2 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-on-surface mb-4">Precision Engineered Features</h2>
                            <p className="text-on-surface-variant text-sm sm:text-base max-w-2xl mx-auto">Elevate your career prospects with our suite of intelligent career tools designed for the modern job market.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-bento-gap md:auto-rows-[280px]">
                            <div className="md:col-span-8 md:row-span-2 glass-card rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-end group hover:bg-white transition-all min-h-[260px]">
                                <div className="mb-auto">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-primary/10">
                                        <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl">auto_fix_high</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-headline-md text-lg sm:text-headline-md text-on-surface mb-2 sm:mb-3">AI Resume Generation</h3>
                                    <p className="text-on-surface-variant text-sm sm:text-body-lg max-w-md">Our neural networks analyze thousands of successful resumes to draft yours with professional precision and impact.</p>
                                </div>
                            </div>
                            <div className="md:col-span-4 glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group hover:bg-white transition-all min-h-[180px]">
                                <div className="flex justify-between items-start">
                                    <span className="material-symbols-outlined text-secondary text-2xl sm:text-3xl">analytics</span>
                                    <div className="bg-secondary/5 text-secondary text-[10px] px-2 py-1 rounded font-bold border border-secondary/10">LIVE SCORE</div>
                                </div>
                                <div>
                                    <div className="text-2xl sm:text-4xl font-bold text-on-surface mb-1">ATS Match</div>
                                    <p className="text-on-surface-variant text-xs sm:text-sm">Real-time compatibility checking.</p>
                                </div>
                            </div>
                            <div className="md:col-span-4 glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group hover:bg-white transition-all min-h-[160px]">
                                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">download</span>
                                <div>
                                    <h3 className="font-bold text-lg sm:text-xl text-on-surface mb-1">1-Click Export</h3>
                                    <p className="text-on-surface-variant text-xs sm:text-sm">PDF, DocX, or JSON formats.</p>
                                </div>
                            </div>
                            <div className="md:col-span-4 glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center group hover:bg-white transition-all border-primary/10 min-h-[160px]">
                                <div className="text-primary font-bold text-2xl sm:text-3xl mb-2">99.9%</div>
                                <p className="text-on-surface-variant text-xs sm:text-sm">ATS Bypass Success Rate</p>
                            </div>
                            <div className="md:col-span-8 glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group hover:bg-white transition-all min-h-[180px]">
                                <div className="hidden sm:block w-32 h-32 md:w-40 md:h-40 bg-surface-variant rounded-2xl border border-black/5 flex-shrink-0 overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-4xl md:text-5xl">lightbulb</span>
                                    </div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="font-headline-md text-lg sm:text-headline-md text-on-surface mb-2">Smart Suggestions</h3>
                                    <p className="text-on-surface-variant text-sm sm:text-body-md">Context-aware advice to improve your bullet points and highlight key achievements automatically.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── CAREER ARCHITECT ──────────────────────────────────── */}
                    <section className="py-16 sm:py-20 md:py-24 bg-surface-container-low/30 overflow-hidden border-y border-black/5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="glass-card rounded-3xl p-5 sm:p-6 glow-violet relative max-w-lg mx-auto lg:mx-0 border-black/5 bg-white shadow-xl mb-16 sm:mb-8">
                                    <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                        <div className="ml-auto text-on-surface-variant text-xs font-label-caps">AI Assistant v4.2</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-lg gradient-button flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-white text-xs">smart_toy</span>
                                            </div>
                                            <div className="bg-surface-container rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-on-surface">
                                                I've analyzed your "Project Manager" experience. Would you like to quantify your achievements?
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 ml-11">
                                            <button className="w-full text-left bg-primary/5 hover:bg-primary/10 border border-primary/10 p-3 rounded-xl text-[11px] sm:text-xs text-primary transition-all">
                                                "Managed budget of $50k" → "Optimized $50k budget, saving 15% annually"
                                            </button>
                                            <button className="w-full text-left bg-black/5 hover:bg-black/10 border border-black/5 p-3 rounded-xl text-[11px] sm:text-xs text-on-surface-variant transition-all">
                                                Show more suggestions...
                                            </button>
                                        </div>
                                        <div className="flex gap-3 justify-end">
                                            <div className="bg-primary/10 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-primary font-semibold">
                                                Yes, apply the first one!
                                            </div>
                                            <img alt="Avatar" className="w-8 h-8 rounded-lg flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU6JwnSJ7amL30reRrXsm3fYXdxDWaDkQRr9q1syHYh5bZM7VyBuJUkOnksFUCJMt7MjjO2H7zrdKHkucEMg0iLaCap1INBRv79joxqMlAso0BHlmRf2Loya5k7Xq3ZX7EXkGKUuntN_4N4qAtgcRpMX_aVM_j9tWqJvS9hegx1Fc8vQ688wdmUJ40f8E70J4Pdng3E2JWz5vyHNBV3ykCRXapXbohi-veO2jgYe-uvYbQS4bgJXFoiLTycfNOFNYJZpu1I9mb5DOE"/>
                                        </div>
                                    </div>
                                    <div className="absolute -right-2 -bottom-12 sm:-right-8 sm:-bottom-8 glass-card p-4 sm:p-6 rounded-2xl shadow-2xl bg-white border-black/5">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle className="text-black/5" cx="50%" cy="50%" fill="transparent" r="42%" stroke="currentColor" strokeWidth="6"></circle>
                                                    <circle className="text-secondary" cx="50%" cy="50%" fill="transparent" r="42%" stroke="currentColor" strokeDasharray="176" strokeDashoffset="30" strokeWidth="6"></circle>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-on-surface">85%</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] sm:text-[10px] text-on-surface-variant font-label-caps">MATCH SCORE</div>
                                                <div className="text-on-surface font-bold text-sm sm:text-base">Sr. Product Designer</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 flex flex-col gap-4 sm:gap-6 text-center lg:text-left items-center lg:items-start">
                                <h2 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-on-surface">Your Personal <span className="text-primary italic">Career Architect</span></h2>
                                <p className="text-on-surface-variant text-sm sm:text-body-lg">Beyond simple templates, ResumeAI acts as a career consultant, identifying gaps in your experience and suggesting improvements based on real-world job requirements.</p>
                                <ul className="space-y-3 sm:space-y-4 pt-2 sm:pt-4 text-left">
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary" data-weight="fill">check_circle</span>
                                        <span className="text-on-surface font-semibold text-sm sm:text-base">Dynamic Keyword Optimization</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary" data-weight="fill">check_circle</span>
                                        <span className="text-on-surface font-semibold text-sm sm:text-base">Grammar &amp; Tone Analysis</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary" data-weight="fill">check_circle</span>
                                        <span className="text-on-surface font-semibold text-sm sm:text-base">Impact Factor Quantifier</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* ── TEMPLATES CAROUSEL ────────────────────────────────── */}
                    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8 mb-10 sm:mb-16">
                                <div>
                                    <h2 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-on-surface mb-3 sm:mb-4">Designer-Grade Templates</h2>
                                    <p className="text-on-surface-variant text-sm sm:text-base max-w-xl">Every template is handcrafted by hiring experts to ensure clarity and professional appeal across all industries.</p>
                                </div>
                                <div className="flex gap-4 self-end md:self-auto">
                                    <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-surface transition-all shadow-sm">
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>
                                    <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-surface transition-all shadow-sm">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4 sm:gap-bento-gap overflow-x-auto pb-8 snap-x no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                                <div className="min-w-[240px] sm:min-w-[300px] md:min-w-[400px] snap-start glass-card rounded-3xl p-4 group cursor-pointer hover:border-primary/30 transition-all">
                                    <div className="aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-4 sm:mb-6">
                                        <img alt="Resume Template" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6BB69zVZpxngiC7Ydorj6NfdXOzCJhdIKGqO9rgiI2cOrosBJREd4RPu8yXiWsvbhE2cSOz1gneJI5pzCvcdOSkCTzmIzLK6oEoZo4771P-DRsUc2BidYwecLwdrv67kOotSPhMMxxKxG-ZnEZXtzZCVLPyW2LhhM21CZEte3lwHN_06VIn0ti3DtGe6zagv5bddDqJDVgK8iOYiWS1hq9xNawzOyUoYMSRGCnQW_0iIN0p_6ZWI7CMEk4Hbyln7k5YRE5B4K_MUn"/>
                                    </div>
                                    <div className="px-2">
                                        <h3 className="text-lg sm:text-xl font-bold text-on-surface">The Executive</h3>
                                        <p className="text-on-surface-variant text-xs sm:text-sm">Perfect for management and C-suite roles.</p>
                                    </div>
                                </div>
                                <div className="min-w-[240px] sm:min-w-[300px] md:min-w-[400px] snap-start glass-card rounded-3xl p-4 group cursor-pointer hover:border-primary/30 transition-all">
                                    <div className="aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-4 sm:mb-6">
                                        <img alt="Resume Template" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC5WyaaS2DQMsZSEUhClqo4v0lH3PXPspFG9JC45E5LRWFHpNP8NHMB3Z5x01CyODQEcrzjq8O6feY9XR1kDl-k-50rQG8ImeYWsb7sUS95IRDxCp6egv8tO850uIGi_rQLU7A98w3jzdsJfbZ-mY016HUwgH3fAojmQO30MLvSvFWymszefFCXInCxGH4aOGurOjr8tCvw9Y_KTdVtpZZ6TxG6FUt64Q2cW8CtS0sWUIDfDNvMRrupfYs5cse_IvPm5rv53kRpNkD"/>
                                    </div>
                                    <div className="px-2">
                                        <h3 className="text-lg sm:text-xl font-bold text-on-surface">The Creative</h3>
                                        <p className="text-on-surface-variant text-xs sm:text-sm">Stand out in tech, design, and media.</p>
                                    </div>
                                </div>
                                <div className="min-w-[240px] sm:min-w-[300px] md:min-w-[400px] snap-start glass-card rounded-3xl p-4 group cursor-pointer hover:border-primary/30 transition-all">
                                    <div className="aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-4 sm:mb-6">
                                        <img alt="Resume Template" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOAv86M7KBfeAvz5H6LOoZebHPZkjhDwtTnrSt6aobHB5xLKxeb3uCTIH2I9NuC6Gi83CdNGqtlZFpqx1-9bV_yYsqbvjpfhSoZmcQ0tO3mVp5oYYnUa3RL2EuUYXJEZuCP11hGdHnJIJaz9BZGH7y2ls0zakomLRlbkz-Myidp6OMiWs5m3j_LTHcJtBn1B3TUlu5hWulwAT9CAaj5F_pY8jY96bFbebJQ0uGo5JA0ous8fZZg05QRxiauzUABGDWb1wnFm_P4VKF"/>
                                    </div>
                                    <div className="px-2">
                                        <h3 className="text-lg sm:text-xl font-bold text-on-surface">The Minimalist</h3>
                                        <p className="text-on-surface-variant text-xs sm:text-sm">Clean, efficient, and 100% ATS-ready.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── PRICING ────────────────────────────────────────────── */}
                    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
                        <div className="text-center mb-10 sm:mb-16">
                            <h2 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-on-surface mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-on-surface-variant text-sm sm:text-base max-w-xl mx-auto">Choose the plan that fits your career goals. No hidden fees.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                            <div className="glass-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 flex flex-col hover:translate-y-[-8px] transition-transform duration-500 bg-white shadow-lg">
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">Free</h3>
                                    <p className="text-on-surface-variant text-sm">Perfect for getting started.</p>
                                    <div className="mt-4 sm:mt-6 flex items-baseline gap-1">
                                        <span className="text-4xl sm:text-5xl font-extrabold text-on-surface">$0</span>
                                        <span className="text-on-surface-variant">/month</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 flex-grow">
                                    <li className="flex items-center gap-3 text-on-surface/80 text-sm">
                                        <span className="material-symbols-outlined text-primary">check</span> 1 AI Resume Build
                                    </li>
                                    <li className="flex items-center gap-3 text-on-surface/80 text-sm">
                                        <span className="material-symbols-outlined text-primary">check</span> Basic ATS Check
                                    </li>
                                    <li className="flex items-center gap-3 text-on-surface/80 text-sm opacity-40">
                                        <span className="material-symbols-outlined">close</span> Premium Templates
                                    </li>
                                </ul>
                                <button className="w-full py-3.5 sm:py-4 rounded-2xl border border-black/5 hover:bg-surface font-bold transition-all shadow-sm">Get Started</button>
                            </div>
                            <div className="glass-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 flex flex-col bg-white border-primary/20 relative overflow-hidden hover:translate-y-[-8px] transition-transform duration-500 shadow-xl glow-violet">
                                <div className="absolute top-0 right-0 bg-primary text-on-primary px-4 sm:px-6 py-1.5 sm:py-2 rounded-bl-2xl font-bold text-[9px] sm:text-[10px] uppercase tracking-widest">Most Popular</div>
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">Pro</h3>
                                    <p className="text-on-surface-variant text-sm">For serious job seekers.</p>
                                    <div className="mt-4 sm:mt-6 flex items-baseline gap-1">
                                        <span className="text-4xl sm:text-5xl font-extrabold text-on-surface">$12</span>
                                        <span className="text-on-surface-variant">/month</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 flex-grow">
                                    <li className="flex items-center gap-3 text-on-surface text-sm">
                                        <span className="material-symbols-outlined text-primary">check</span> Unlimited AI Resumes
                                    </li>
                                    <li className="flex items-center gap-3 text-on-surface text-sm">
                                        <span className="material-symbols-outlined text-primary">check</span> Advanced ATS Scoring
                                    </li>
                                    <li className="flex items-center gap-3 text-on-surface text-sm">
                                        <span className="material-symbols-outlined text-primary">check</span> Premium Templates
                                    </li>
                                    <li className="flex items-center gap-3 text-on-surface text-sm">
                                        <span className="material-symbols-outlined text-primary">check</span> Smart Suggestions
                                    </li>
                                </ul>
                                <button className="w-full py-3.5 sm:py-4 rounded-2xl gradient-button text-on-primary font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all">Upgrade Now</button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* ── FOOTER ─────────────────────────────────────────────────── */}
                <footer className="bg-white py-14 sm:py-20 px-4 sm:px-6 border-t border-black/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 sm:gap-12 mb-12 sm:mb-16">
                            <div className="max-w-xs">
                                <div className="font-display-lg text-primary tracking-tighter text-2xl sm:text-3xl mb-4 sm:mb-6">ResumeAI</div>
                                <p className="text-on-surface-variant text-sm mb-6">Next-generation resume building platform powered by state-of-the-art artificial intelligence.</p>
                                <div className="flex gap-4">
                                    <a className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 transition-all border-black/5 shadow-sm" href="#">
                                        <svg className="w-5 h-5 fill-on-surface" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                                    </a>
                                    <a className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 transition-all border-black/5 shadow-sm" href="#">
                                        <svg className="w-5 h-5 fill-on-surface" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 w-full lg:w-auto">
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    <h4 className="font-bold text-on-surface text-sm sm:text-base">Product</h4>
                                    <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Features</a>
                                    <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Templates</a>
                                    <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Pricing</a>
                                </div>
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    <h4 className="font-bold text-on-surface text-sm sm:text-base">Resources</h4>
                                    <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Blog</a>
                                    <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">ATS Guide</a>
                                    <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Help Center</a>
                                </div>
                                <div className="flex flex-col gap-3 sm:gap-4 col-span-2 sm:col-span-1">
                                    <h4 className="font-bold text-on-surface text-sm sm:text-base">Legal</h4>
                                    <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Privacy Policy</a>
                                    <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Terms of Service</a>
                                    <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Cookie Policy</a>
                                </div>
                            </div>

                            <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-sm w-full bg-surface border-black/5 shadow-md">
                                <h4 className="font-bold text-on-surface mb-3 sm:mb-4">Stay Updated</h4>
                                <p className="text-on-surface-variant text-xs mb-4 sm:mb-6">Get career tips and product updates delivered to your inbox.</p>
                                <div className="flex gap-2">
                                    <input className="bg-white border border-black/5 rounded-xl text-sm w-full focus:ring-primary focus:border-primary px-4 py-2" placeholder="Email address" type="email"/>
                                    <button className="gradient-button p-2 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-on-primary">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-black/5 gap-4 text-center sm:text-left">
                            <p className="text-on-surface-variant text-xs">© 2024 ResumeAI Premium. All rights reserved.</p>
                            <div className="flex gap-6">
                                <span className="text-on-surface-variant text-xs cursor-pointer hover:text-primary transition-colors">Contact Support</span>
                                <span className="text-on-surface-variant text-xs cursor-pointer hover:text-primary transition-colors">Affiliates</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Home