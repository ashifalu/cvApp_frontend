import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {Link, useNavigate} from "react-router-dom";
gsap.registerPlugin(ScrollTrigger);

const Home = () => {

    const stageRef = useRef(null);
    const navigate = useNavigate();

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
                                    <Link to="/select-template" className="w-full sm:w-auto">
                                        <button className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-on-primary font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg shadow-primary/10 hover:shadow-xl transition-all">
                                            Create Resume
                                        </button>
                                    </Link>
                                    <Link to={"/select-template"} className="w-full sm:w-auto bg-white text-on-surface font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg border border-black/5 hover:bg-surface transition-all shadow-sm">
                                        View Templates
                                    </Link>
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
                                            <img src="/images/template11.png" alt=""/>

                                            <img src="/images/template2.png" alt=""/>
                                            <img src="/images/template10.png" alt=""/>
                                            <img src="/images/template13.png" alt=""/>
                                            <img src="/images/template11.png" alt=""/>
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
                                        <img src="/images/template6.png" alt=""/>
                                        <img src="/images/template9.png" alt=""/>

                                        <img src="/images/template2.png" alt=""/>
                                        <img src="/images/template10.png" alt=""/>
                                        <img src="/images/template13.png" alt=""/>
                                        <img src="/images/template6.png" alt=""/>
                                        <img src="/images/template9.png" alt=""/>
                                    </div>

                                    <div className="h-row h-left">
                                        <img src="/images/template5.png" alt=""/>
                                        <img src="/images/template4.png" alt=""/>
                                        <img src="/images/template1.png" alt=""/>
                                        <img src="/images/template7.png" alt=""/>
                                        <img src="/images/template6.png" alt=""/>

                                        <img src="/images/template5.png" alt=""/>
                                        <img src="/images/template4.png" alt=""/>
                                        <img src="/images/template1.png" alt=""/>
                                        <img src="/images/template7.png" alt=""/>
                                        <img src="/images/template6.png" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── FEATURE HIGHLIGHTS (was: trusted companies) ────────── */}
                    <section className="py-8 sm:py-12 border-y border-black/5 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <p className="text-center text-on-surface-variant font-label-caps text-label-caps mb-6 sm:mb-10">Everything
                                you need to build a standout resume</p>
                            <div
                                className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                                <div
                                    className="text-lg sm:text-2xl font-extrabold text-on-surface tracking-tighter">ATS-Ready
                                </div>
                                <div
                                    className="text-lg sm:text-2xl font-extrabold text-on-surface tracking-tighter">Free Templates
                                </div>
                                <div
                                    className="text-lg sm:text-2xl font-extrabold text-on-surface tracking-tighter">Instant PDF
                                </div>

                                <div
                                    className="text-lg sm:text-2xl font-extrabold text-on-surface tracking-tighter">Fully Editable
                                </div>
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
                                    <button onClick={()=>navigate('/select-template')} className=" text-xs rounded-full px-6 py-2 text-primary flex items-center justify-center hover:bg-surface transition-all shadow-sm">
                                        Explore More<span className="material-symbols-outlined text-xs">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4 sm:gap-bento-gap overflow-x-auto pb-8 snap-x no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                                <div className="min-w-[240px] sm:min-w-[300px] md:min-w-[400px] snap-start glass-card rounded-3xl p-4 group cursor-pointer hover:border-primary/30 transition-all">
                                    <div className="aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-4 sm:mb-6">
                                        <img alt="Resume Template" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/images/template5.png"/>
                                    </div>
                                    <div className="px-2">
                                        <h3 className="text-lg sm:text-xl font-bold text-on-surface">The Executive</h3>
                                        <p className="text-on-surface-variant text-xs sm:text-sm">Perfect for management and C-suite roles.</p>
                                    </div>
                                </div>
                                <div className="min-w-[240px] sm:min-w-[300px] md:min-w-[400px] snap-start glass-card rounded-3xl p-4 group cursor-pointer hover:border-primary/30 transition-all">
                                    <div className="aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-4 sm:mb-6">
                                        <img alt="Resume Template" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/images/template7.png"/>
                                    </div>
                                    <div className="px-2">
                                        <h3 className="text-lg sm:text-xl font-bold text-on-surface">The Creative</h3>
                                        <p className="text-on-surface-variant text-xs sm:text-sm">Stand out in tech, design, and media.</p>
                                    </div>
                                </div>
                                <div className="min-w-[240px] sm:min-w-[300px] md:min-w-[400px] snap-start glass-card rounded-3xl p-4 group cursor-pointer hover:border-primary/30 transition-all">
                                    <div className="aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden mb-4 sm:mb-6">
                                        <img alt="Resume Template" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/images/template10.png"/>
                                    </div>
                                    <div className="px-2">
                                        <h3 className="text-lg sm:text-xl font-bold text-on-surface">The Minimalist</h3>
                                        <p className="text-on-surface-variant text-xs sm:text-sm">Clean, efficient, and 100% ATS-ready.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* ── FOOTER (simplified — only real pages) ─────────────────── */}
                <footer className="bg-white py-14 sm:py-20 px-4 sm:px-6 border-t border-black/5">
                    <div className="max-w-7xl mx-auto ">
                        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-8 sm:gap-12 mb-10 sm:mb-14 text-center sm:text-left">
                            <div className="max-w-xs text-center flex flex-col items-center gap-8" >
                                <div className="font-display-lg text-primary tracking-tighter text-2xl sm:text-3xl mb-3 sm:mb-4">
                                    <div className="font-display-lg w-[140px]  text-primary tracking-tighter text-2xl">
                                        <img className="" src="/images/pro-cv-logo.svg"/>
                                    </div>
                                </div>
                                <p className="text-on-surface-variant text-center text-sm">Build a clean, ATS-ready resume in minutes — free, simple, and yours to keep.</p>
                                <Link to={'/privacy-policy'}><p className="text-xs text-center underline text-blue-600">Privacy Policy</p></Link>
                            </div>

                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-black/5 gap-4 text-center sm:text-left">
                            <p className="text-on-surface-variant text-xs">© 2026 Pro CV Builder. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Home