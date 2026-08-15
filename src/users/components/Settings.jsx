import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sendSetupPasswordOtpApi, setupPasswordApi, deleteAccountApi } from "../../services/allApi";

const ALERT_DURATION = 5000;

const Settings = () => {
    const [user, setUser] = useState({});
    const [hasPassword, setHasPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem("existingUser");
        if (storedUser) setUser(JSON.parse(storedUser));
        setHasPassword(sessionStorage.getItem("hasPassword") === "true");
    }, []);

    // ── Setup password modal state ──────────────────────────────
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordStep, setPasswordStep] = useState("confirm"); // "confirm" | "otp"
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordProcessing, setPasswordProcessing] = useState(false);
    const [passwordAlert, setPasswordAlert] = useState(null); // { type, title, desc }
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const passwordAlertTimeout = useRef(null);

    // ── Delete account modal state ──────────────────────────────
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(null);
    const deleteAlertTimeout = useRef(null);

    const showTempAlert = (setter, ref, config) => {
        if (ref.current) clearTimeout(ref.current);
        setter(config);
        ref.current = setTimeout(() => setter(null), ALERT_DURATION);
    };

    const getAuthHeader = () => ({
        authorization: `Bearer ${sessionStorage.getItem("token")}`
    });

    // ── Setup password flow ──────────────────────────────────────
    const openPasswordModal = () => {
        setShowPasswordModal(true);
        setPasswordStep("confirm");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordAlert(null);
        setPasswordSuccess(false);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
    };

    const handleSendOtp = async () => {
        setPasswordProcessing(true);
        const result = await sendSetupPasswordOtpApi(getAuthHeader());

        if (result.status === 200) {
            setPasswordStep("otp");
            showTempAlert(setPasswordAlert, passwordAlertTimeout, {
                type: "success", title: "Code sent", desc: "Check your inbox for the verification code."
            });
        } else {
            showTempAlert(setPasswordAlert, passwordAlertTimeout, {
                type: "error", title: "Couldn't send code", desc: result?.response?.data?.message || "Please try again."
            });
        }
        setPasswordProcessing(false);
    };

    const handleSetupPassword = async () => {
        if (!otp.trim()) {
            showTempAlert(setPasswordAlert, passwordAlertTimeout, { type: "error", title: "Code required", desc: "Enter the code we sent you." });
            return;
        }
        if (newPassword.length < 6) {
            showTempAlert(setPasswordAlert, passwordAlertTimeout, { type: "error", title: "Password too short", desc: "Use at least 6 characters." });
            return;
        }
        if (newPassword !== confirmPassword) {
            showTempAlert(setPasswordAlert, passwordAlertTimeout, { type: "error", title: "Passwords don't match", desc: "Make sure both fields match." });
            return;
        }

        setPasswordProcessing(true);
        const result = await setupPasswordApi({ otp, newPassword }, getAuthHeader());

        if (result.status === 200) {
            setPasswordSuccess(true);
            setHasPassword(true);
            sessionStorage.setItem("hasPassword", "true");
            setTimeout(() => closePasswordModal(), 2000);
        } else {
            showTempAlert(setPasswordAlert, passwordAlertTimeout, {
                type: "error", title: "Couldn't set password", desc: result?.response?.data?.message || "Please try again."
            });
        }
        setPasswordProcessing(false);
    };

    // ── Delete account flow ──────────────────────────────────────
    const openDeleteModal = () => {
        setShowDeleteModal(true);
        setDeleteConfirmText("");
        setDeleteAlert(null);
    };

    const closeDeleteModal = () => setShowDeleteModal(false);

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "DELETE") {
            showTempAlert(setDeleteAlert, deleteAlertTimeout, { type: "error", title: "Confirmation required", desc: 'Type "DELETE" to confirm.' });
            return;
        }

        setDeleteProcessing(true);
        const result = await deleteAccountApi(getAuthHeader());

        if (result.status === 200) {
            sessionStorage.clear();
            navigate("/");
        } else {
            showTempAlert(setDeleteAlert, deleteAlertTimeout, {
                type: "error", title: "Couldn't delete account", desc: result?.response?.data?.message || "Please try again."
            });
            setDeleteProcessing(false);
        }
    };

    const AlertBanner = ({ config }) => {
        if (!config) return null;
        return (
            <div className={`w-full flex items-start gap-3 rounded-xl px-4 py-3 mb-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
                config.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
            }`}>
                <span className={`material-symbols-outlined text-[20px] mt-0.5 ${
                    config.type === "success" ? "text-green-600" : "text-red-600"
                }`}>
                    {config.type === "success" ? "check_circle" : "error"}
                </span>
                <div className="flex-1">
                    <p className="font-label-bold text-sm">{config.title}</p>
                    <p className="text-xs opacity-80">{config.desc}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="font-headline-md text-2xl sm:text-3xl md:text-[32px] text-on-surface mb-6 sm:mb-8">
                Account Settings
            </h1>

            <div className="space-y-6 sm:space-y-8">

                <div className="glass-card rounded-xl p-5 sm:p-6 md:p-8 hover:bg-surface-container/50 transition-colors duration-300 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <h2 className="font-headline-md text-lg sm:text-xl md:text-[24px] mb-5 sm:mb-6 border-b border-outline-variant/50 pb-4 text-on-surface">
                        Login
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-label-md text-label-md text-on-surface-variant mb-3 sm:mb-4 uppercase">
                                Google Account
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 justify-between p-3 sm:p-4 rounded-lg bg-surface-container-high border border-outline-variant/50">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-white flex items-center justify-center p-1 shadow-sm border border-outline-variant/20">
                                        <svg className="w-full h-full" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" fill="#EA4335"></path>
                                            <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4"></path>
                                            <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05"></path>
                                            <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853"></path>
                                        </svg>
                                    </div>
                                    <span className="text-on-surface font-body-md text-body-md text-sm sm:text-base truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-outline-variant/50">
                            <h3 className="font-label-md text-label-md text-on-surface-variant mb-2 uppercase">
                                Email &amp; Password
                            </h3>
                            {hasPassword ? (
                                <div className="flex flex-wrap items-center gap-3 justify-between p-3 sm:p-4 rounded-lg bg-surface-container-high border border-outline-variant/50">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-green-600">check_circle</span>
                                        <span className="text-on-surface text-sm sm:text-base">Password login is active</span>
                                    </div>
                                    <button
                                        onClick={openPasswordModal}
                                        className="text-sm font-bold text-primary hover:text-secondary transition-colors"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-on-surface-variant mb-4 text-sm">
                                        Add a password to enable login with email &amp; password.
                                    </p>
                                    <button
                                        onClick={openPasswordModal}
                                        className="w-full sm:w-auto px-6 py-2 rounded-full border border-outline hover:border-primary text-on-surface hover:text-primary transition-colors magnetic-btn bg-surface"
                                    >
                                        Set up a password
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-xl p-5 sm:p-6 md:p-8 hover:bg-error-container/20 transition-colors duration-300 relative group overflow-hidden border-error/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <h2 className="font-headline-md text-lg sm:text-xl md:text-[24px] mb-5 sm:mb-6 border-b border-error/20 pb-4 text-error">
                        Delete Account
                    </h2>
                    <p className="text-on-surface-variant mb-6 text-sm sm:text-base">
                        Permanently remove your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                        onClick={openDeleteModal}
                        className="w-full sm:w-auto justify-center px-6 py-3 rounded-full bg-error-container text-on-error-container font-semibold hover:bg-error hover:text-on-error transition-colors magnetic-btn flex items-center gap-2 border border-error/20"
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
                        Delete Account
                    </button>
                </div>

            </div>

            {/* ── Setup / Change Password Modal ──────────────────────── */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/30 p-8">

                        {passwordSuccess ? (
                            <div className="flex flex-col items-center text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5 animate-in zoom-in duration-300">
                                    <span className="material-symbols-outlined text-green-600 text-[36px]">check_circle</span>
                                </div>
                                <h2 className="font-headline-md text-xl text-on-surface mb-1">Password set successfully</h2>
                                <p className="text-sm text-on-surface-variant">You can now sign in with your email and password.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-headline-md text-xl text-on-surface">
                                        {passwordStep === "confirm" ? "Set up a password" : "Enter verification code"}
                                    </h2>
                                    <button onClick={closePasswordModal} className="material-symbols-outlined text-outline hover:text-on-surface">
                                        close
                                    </button>
                                </div>

                                <AlertBanner config={passwordAlert} />

                                {passwordStep === "confirm" ? (
                                    <>
                                        <p className="text-sm text-on-surface-variant mb-6">
                                            We'll send a verification code to <span className="font-bold text-on-surface">{user.email}</span> to confirm it's you.
                                        </p>
                                        <button
                                            onClick={handleSendOtp}
                                            disabled={passwordProcessing}
                                            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3.5 rounded-xl font-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                        >
                                            {passwordProcessing ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                                    Sending code...
                                                </>
                                            ) : "Send Verification Code"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2 mb-5">
                                            <label className="font-label-bold text-on-surface-variant block text-sm">Verification Code</label>
                                            <input
                                                className="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all text-on-surface tracking-[0.3em]"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                placeholder="123456"
                                                inputMode="numeric"
                                                maxLength={6}
                                                disabled={passwordProcessing}
                                            />
                                        </div>
                                        <div className="space-y-2 mb-5">
                                            <label className="font-label-bold text-on-surface-variant block text-sm">New Password</label>
                                            <input
                                                className="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all text-on-surface"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                disabled={passwordProcessing}
                                            />
                                        </div>
                                        <div className="space-y-2 mb-6">
                                            <label className="font-label-bold text-on-surface-variant block text-sm">Confirm Password</label>
                                            <input
                                                className="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all text-on-surface"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                disabled={passwordProcessing}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSetupPassword}
                                            disabled={passwordProcessing}
                                            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3.5 rounded-xl font-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                        >
                                            {passwordProcessing ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                                    Saving...
                                                </>
                                            ) : "Save Password"}
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Delete Account Modal ───────────────────────────────── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-error/20 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-headline-md text-xl text-error flex items-center gap-2">
                                <span className="material-symbols-outlined">warning</span>
                                Delete Account
                            </h2>
                            <button onClick={closeDeleteModal} className="material-symbols-outlined text-outline hover:text-on-surface">
                                close
                            </button>
                        </div>

                        <AlertBanner config={deleteAlert} />

                        <p className="text-sm text-on-surface-variant mb-2">
                            This will permanently delete your account, resumes, and all associated data. This action <span className="font-bold text-error">cannot be undone</span>.
                        </p>
                        <p className="text-sm text-on-surface-variant mb-5">
                            Type <span className="font-bold text-on-surface">DELETE</span> to confirm.
                        </p>

                        <input
                            className="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-error focus:ring-0 transition-all text-on-surface mb-6"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="DELETE"
                            disabled={deleteProcessing}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleteProcessing}
                                className="flex-1 px-6 py-3 rounded-full border border-outline text-on-surface hover:border-primary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteProcessing || deleteConfirmText !== "DELETE"}
                                className="flex-1 px-6 py-3 rounded-full bg-error text-on-error font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleteProcessing ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                        Deleting...
                                    </>
                                ) : "Delete Forever"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Settings