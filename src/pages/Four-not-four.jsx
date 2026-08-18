 const FourNotFour = () => {
    return(
        <div className="bg-surface-container-lowest text-on-surface antialiased min-h-screen flex flex-col relative overflow-x-hidden">
            <div className="absolute inset-0 bg-gradient-mesh -z-10 pointer-events-none"></div>
                <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-margin-mobile md:px-margin-desktop relative">
                    <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-16">
                        <div class="flex-1 text-center md:text-left z-10">
                            <h1 class="font-display-xl text-display-xl text-gradient mb-6 tracking-tight">404</h1>
                            <h2 class="font-headline-lg text-headline-lg text-on-surface mb-4">Lost in the career cloud?</h2>
                            <p class="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md mx-auto md:mx-0">
                                Even our advanced AI couldn't track down this page. It might have been moved, deleted, or never existed in the first place.
                            </p>
                            <div class="flex flex-col sm:flex-row items-center gap-4 mb-8 justify-center md:justify-start">
                                <button class="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary-container text-white font-label-md text-label-md px-8 py-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-[20px]">dashboard</span>
                                    Back to Dashboard
                                </button>
                                <button class="w-full sm:w-auto bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-label-md text-label-md px-8 py-4 rounded-lg shadow-sm hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-[20px]">explore</span>
                                    Explore Templates
                                </button>
                            </div>
                            <div class="flex items-center justify-center md:justify-start gap-6 font-body-sm text-body-sm text-on-surface-variant">
                                <a class="hover:text-primary transition-colors flex items-center gap-1" href="#">
                                    <span class="material-symbols-outlined text-[16px]">help</span>
                                    Help Center
                                </a>
                                <a class="hover:text-primary transition-colors flex items-center gap-1" href="#">
                                    <span class="material-symbols-outlined text-[16px]">support_agent</span>
                                    Contact Support
                                </a>
                            </div>
                        </div>
                        <div class="flex-1 w-full max-w-md relative flex justify-center items-center perspective-1000">
                            <div class="animate-float relative w-full aspect-square max-w-[400px]">
                                <div class="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-150 -z-10"></div>
                                <img class="w-full h-full object-contain filter drop-shadow-2xl opacity-90" data-alt="A sophisticated, high-end 3D rendering of an abstract, floating paper plane folded from a futuristic resume document. The scene is illuminated by soft, bright, high-key studio lighting, emphasizing a clean light-mode aesthetic. The paper plane is pristine white, surrounded by subtle glowing particles and ethereal streaks of light in vibrant violet and soft pink, evoking a sense of artificial intelligence and digital precision. The background is a pure, minimalist off-white space, creating a professional, elite, tech-forward mood." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1q4cXuhCMrBtBtqjh9I4K6oOb7fAyUqVM8R_oT2DF5PkF8CUgME1pOon-z8EXt83XaKkVIaN42WEvz3kZTds8w8zuMuRYoRH5gCYS_RxVcMDcelGQx0mPTo_VNbSFjtNQq2I1Wfui6utV31JTqLQeRa4BvUGEfznH7Fc_aVPECP_qMUxQkM7iZhw9Ng7Tvo15ndnkKAyvnkaYoN6xia-Cdu8IOAHoxicfmnydzib-tCayYVGewI7ezA"/>
                            </div>
                        </div>
                    </div>
                </main>
        </div>
    )
 }
 export default FourNotFour;