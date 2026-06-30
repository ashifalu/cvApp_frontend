import { useState, useEffect, useRef } from "react";

const COUNTRY_CODES = [
    { code: "+1",   flag: "🇺🇸", name: "United States" },
    { code: "+44",  flag: "🇬🇧", name: "United Kingdom" },
    { code: "+91",  flag: "🇮🇳", name: "India" },
    { code: "+971", flag: "🇦🇪", name: "UAE" },
    { code: "+92",  flag: "🇵🇰", name: "Pakistan" },
    { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
    { code: "+61",  flag: "🇦🇺", name: "Australia" },
    { code: "+49",  flag: "🇩🇪", name: "Germany" },
    { code: "+33",  flag: "🇫🇷", name: "France" },
    { code: "+39",  flag: "🇮🇹", name: "Italy" },
    { code: "+34",  flag: "🇪🇸", name: "Spain" },
    { code: "+55",  flag: "🇧🇷", name: "Brazil" },
    { code: "+86",  flag: "🇨🇳", name: "China" },
    { code: "+81",  flag: "🇯🇵", name: "Japan" },
    { code: "+82",  flag: "🇰🇷", name: "South Korea" },
    { code: "+7",   flag: "🇷🇺", name: "Russia" },
    { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
    { code: "+20",  flag: "🇪🇬", name: "Egypt" },
    { code: "+234", flag: "🇳🇬", name: "Nigeria" },
    { code: "+27",  flag: "🇿🇦", name: "South Africa" },
    { code: "+31",  flag: "🇳🇱", name: "Netherlands" },
    { code: "+46",  flag: "🇸🇪", name: "Sweden" },
    { code: "+47",  flag: "🇳🇴", name: "Norway" },
    { code: "+41",  flag: "🇨🇭", name: "Switzerland" },
    { code: "+64",  flag: "🇳🇿", name: "New Zealand" },
    { code: "+65",  flag: "🇸🇬", name: "Singapore" },
    { code: "+60",  flag: "🇲🇾", name: "Malaysia" },
    { code: "+63",  flag: "🇵🇭", name: "Philippines" },
    { code: "+62",  flag: "🇮🇩", name: "Indonesia" },
    { code: "+66",  flag: "🇹🇭", name: "Thailand" },
    { code: "+90",  flag: "🇹🇷", name: "Turkey" },
    { code: "+98",  flag: "🇮🇷", name: "Iran" },
    { code: "+48",  flag: "🇵🇱", name: "Poland" },
    { code: "+32",  flag: "🇧🇪", name: "Belgium" },
    { code: "+351", flag: "🇵🇹", name: "Portugal" },
    { code: "+30",  flag: "🇬🇷", name: "Greece" },
    { code: "+52",  flag: "🇲🇽", name: "Mexico" },
    { code: "+54",  flag: "🇦🇷", name: "Argentina" },
    { code: "+56",  flag: "🇨🇱", name: "Chile" },
    { code: "+57",  flag: "🇨🇴", name: "Colombia" },
    { code: "+94",  flag: "🇱🇰", name: "Sri Lanka" },
    { code: "+977", flag: "🇳🇵", name: "Nepal" },
    { code: "+964", flag: "🇮🇶", name: "Iraq" },
    { code: "+962", flag: "🇯🇴", name: "Jordan" },
    { code: "+961", flag: "🇱🇧", name: "Lebanon" },
    { code: "+974", flag: "🇶🇦", name: "Qatar" },
    { code: "+965", flag: "🇰🇼", name: "Kuwait" },
    { code: "+968", flag: "🇴🇲", name: "Oman" },
    { code: "+973", flag: "🇧🇭", name: "Bahrain" },
];

export { COUNTRY_CODES };

const PhoneInput = ({ phoneNumber, onPhoneChange, countryCode, onCountryCodeChange, hasError }) => {
    const [isOpen, setIsOpen]   = useState(false);
    const [search, setSearch]   = useState("");
    const dropdownRef           = useRef(null);
    const selected              = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];
    const filtered              = COUNTRY_CODES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
    );

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const baseInputClass = hasError
        ? "border-red-400 bg-red-50 focus-within:ring-2 focus-within:ring-red-400"
        : "border-outline-variant bg-surface-container-low focus-within:ring-2 focus-within:ring-primary focus-within:border-primary";

    return (
        <div className="relative" ref={dropdownRef}>
            <div className={`flex items-center w-full rounded-xl border transition-all outline-none overflow-visible ${baseInputClass}`}>
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    className="flex items-center gap-1.5 pl-3 pr-2.5 py-3 border-r border-outline-variant/40 hover:bg-black/5 transition-colors rounded-l-xl shrink-0"
                >
                    <span className="text-lg leading-none">{selected.flag}</span>
                    <span className="text-sm font-medium text-on-surface-variant tabular-nums">{selected.code}</span>
                    <svg className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <input
                    type="tel"
                    placeholder="e.g. 555 012 3456"
                    value={phoneNumber}
                    onChange={e => onPhoneChange(e.target.value)}
                    className="flex-1 px-3 py-3 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant/40 min-w-0"
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-outline-variant/50 rounded-2xl shadow-2xl shadow-black/10 z-50 overflow-hidden">
                    <div className="p-2.5 border-b border-outline-variant/20">
                        <div className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30">
                            <svg className="w-3.5 h-3.5 text-on-surface-variant shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                            </svg>
                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search country or code..."
                                className="flex-1 bg-transparent outline-none text-xs text-on-surface placeholder:text-on-surface-variant/50"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="text-on-surface-variant hover:text-on-surface transition-colors">
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto py-1">
                        {filtered.length > 0 ? filtered.map((c, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => { onCountryCodeChange(c.code); setIsOpen(false); setSearch(""); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-primary/5 ${c.code === countryCode ? "bg-primary/8" : ""}`}
                            >
                                <span className="text-base shrink-0">{c.flag}</span>
                                <span className="text-sm text-on-surface flex-1 truncate">{c.name}</span>
                                <span className="text-xs text-on-surface-variant font-mono tabular-nums shrink-0">{c.code}</span>
                                {c.code === countryCode && (
                                    <svg className="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        )) : (
                            <div className="py-6 text-center">
                                <p className="text-xs text-on-surface-variant">No countries found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhoneInput;