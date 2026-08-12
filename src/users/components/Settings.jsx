const Settings = () => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="font-headline-md text-2xl sm:text-3xl md:text-[32px] text-on-surface mb-6 sm:mb-8">
                Account Settings
            </h1>

            <div className="space-y-6 sm:space-y-8">

                <div
                    className="glass-card rounded-xl p-5 sm:p-6 md:p-8 hover:bg-surface-container/50 transition-colors duration-300 relative group overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <h2 className="font-headline-md text-lg sm:text-xl md:text-[24px] mb-5 sm:mb-6 border-b border-outline-variant/50 pb-4 text-on-surface">
                        Login
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-label-md text-label-md text-on-surface-variant mb-3 sm:mb-4 uppercase">
                                Google Account
                            </h3>
                            <div
                                className="flex flex-wrap items-center gap-3 justify-between p-3 sm:p-4 rounded-lg bg-surface-container-high border border-outline-variant/50">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                    <div
                                        className="w-8 h-8 shrink-0 rounded-full bg-white flex items-center justify-center p-1 shadow-sm border border-outline-variant/20">
                                        <svg className="w-full h-full" viewBox="0 0 48 48"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"
                                                fill="#EA4335"></path>
                                            <path
                                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                                fill="#4285F4"></path>
                                            <path
                                                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                                fill="#FBBC05"></path>
                                            <path
                                                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                                fill="#34A853"></path>
                                        </svg>
                                    </div>
                                    <span className="text-on-surface font-body-md text-body-md text-sm sm:text-base truncate">
                                        ashiashimap@gmail.com
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-outline-variant/50">
                            <h3 className="font-label-md text-label-md text-on-surface-variant mb-2 uppercase">
                                Email &amp; Password
                            </h3>
                            <p className="text-on-surface-variant mb-4 text-sm">
                                Add a password to enable login with email &amp; password.
                            </p>
                            <button
                                className="w-full sm:w-auto px-6 py-2 rounded-full border border-outline hover:border-primary text-on-surface hover:text-primary transition-colors magnetic-btn bg-surface">
                                Set up a password
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="glass-card rounded-xl p-5 sm:p-6 md:p-8 hover:bg-error-container/20 transition-colors duration-300 relative group overflow-hidden border-error/20">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <h2 className="font-headline-md text-lg sm:text-xl md:text-[24px] mb-5 sm:mb-6 border-b border-error/20 pb-4 text-error">
                        Delete Account
                    </h2>
                    <p className="text-on-surface-variant mb-6 text-sm sm:text-base">
                        Permanently remove your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                        className="w-full sm:w-auto justify-center px-6 py-3 rounded-full bg-error-container text-on-error-container font-semibold hover:bg-error hover:text-on-error transition-colors magnetic-btn flex items-center gap-2 border border-error/20">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
                        Delete Account
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Settings