import { useEffect, useState, useRef } from "react";
import Modal from "../../Modal";
import { useNavigate } from "react-router-dom";
import {
  googleloginApi,
  loginApi,
  registerApi,
  storeDataApi,
  verifyEmailApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "../../services/allApi";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const OTP_DURATION = 120; // seconds
const ALERT_DURATION = 5000;
const SUCCESS_REDIRECT_DELAY = 2000;

const ALERT_MESSAGES = {
  sent: { type: "success", title: "Verification code sent", desc: "Check your inbox and enter the code below." },
  resent: { type: "success", title: "New code sent", desc: "A fresh verification code has been sent to your email." },
  required: { type: "error", title: "OTP required", desc: "Please enter the verification code we sent you." },
  "invalid otp": { type: "error", title: "Invalid OTP", desc: "The code you entered is incorrect. Please try again." },
  expired: { type: "error", title: "Code expired", desc: "Your verification code has expired. Please resend a new one." },
  error: { type: "error", title: "Something went wrong", desc: "Please try again in a moment." },
};

const FORGOT_ALERT_MESSAGES = {
  sent: { type: "success", title: "Reset code sent", desc: "Check your inbox and enter the code below." },
  resent: { type: "success", title: "New code sent", desc: "A fresh reset code has been sent to your email." },
  required: { type: "error", title: "Code required", desc: "Please enter the reset code we sent you." },
  invalid: { type: "error", title: "Invalid code", desc: "The code you entered is incorrect. Please try again." },
  expired: { type: "error", title: "Code expired", desc: "Your reset code has expired. Please resend a new one." },
  mismatch: { type: "error", title: "Passwords don't match", desc: "Make sure both password fields match." },
  weak: { type: "error", title: "Password too short", desc: "Use at least 6 characters." },
  "no account": { type: "error", title: "No account found", desc: "We couldn't find an account with that email." },
  error: { type: "error", title: "Something went wrong", desc: "Please try again in a moment." },
};

const UserAuth = ({ isOpen, onClose, mode, storeData }) => {

  // ── Login / Sign up state ──────────────────────────────────────
  const [sentOtp, setSentOtp] = useState(false);
  const [checkMode, setCheckmode] = useState(mode);
  const [userOtp, setUserOtp] = useState("");
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [showOtpAlert, setShowOtpAlert] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Forgot password state ──────────────────────────────────────
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // "email" | "reset"
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotOtpTimer, setForgotOtpTimer] = useState(0);
  const [showForgotAlert, setShowForgotAlert] = useState("");
  const [forgotProcessing, setForgotProcessing] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [forgotErrors, setForgotErrors] = useState({});

  const navigate = useNavigate();

  const alertTimeoutRef = useRef(null);
  const countdownRef = useRef(null);
  const forgotAlertTimeoutRef = useRef(null);
  const forgotCountdownRef = useRef(null);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ── Signup OTP alert auto-dismiss ──────────────────────────────
  useEffect(() => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    if (!showOtpAlert) return;
    alertTimeoutRef.current = setTimeout(() => setShowOtpAlert(""), ALERT_DURATION);
    return () => clearTimeout(alertTimeoutRef.current);
  }, [showOtpAlert]);

  // ── Signup OTP countdown ────────────────────────────────────────
  useEffect(() => {
    if (!sentOtp || verifiedSuccess || otpTimer <= 0) return;
    countdownRef.current = setTimeout(() => setOtpTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(countdownRef.current);
  }, [sentOtp, otpTimer, verifiedSuccess]);

  useEffect(() => {
    if (sentOtp && otpTimer === 0 && !verifiedSuccess) {
      setShowOtpAlert("expired");
    }
  }, [otpTimer]);

  // ── Forgot password alert auto-dismiss ─────────────────────────
  useEffect(() => {
    if (forgotAlertTimeoutRef.current) clearTimeout(forgotAlertTimeoutRef.current);
    if (!showForgotAlert) return;
    forgotAlertTimeoutRef.current = setTimeout(() => setShowForgotAlert(""), ALERT_DURATION);
    return () => clearTimeout(forgotAlertTimeoutRef.current);
  }, [showForgotAlert]);

  // ── Forgot password OTP countdown ──────────────────────────────
  useEffect(() => {
    if (forgotStep !== "reset" || resetSuccess || forgotOtpTimer <= 0) return;
    forgotCountdownRef.current = setTimeout(() => setForgotOtpTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(forgotCountdownRef.current);
  }, [forgotStep, forgotOtpTimer, resetSuccess]);

  useEffect(() => {
    if (forgotStep === "reset" && forgotOtpTimer === 0 && !resetSuccess) {
      setShowForgotAlert("expired");
    }
  }, [forgotOtpTimer]);

  // ── Reset everything ────────────────────────────────────────────
  const resetAuthState = () => {
    setSentOtp(false);
    setUserOtp("");
    setShowOtpAlert("");
    setOtpTimer(0);
    setIsProcessing(false);
    setVerifiedSuccess(false);
    setResendOtp(false);
  };

  const resetForgotState = () => {
    setShowForgotPassword(false);
    setForgotStep("email");
    setForgotEmail("");
    setForgotOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotOtpTimer(0);
    setShowForgotAlert("");
    setForgotProcessing(false);
    setResetSuccess(false);
    setForgotErrors({});
  };

  const handleModalClose = () => {
    resetAuthState();
    resetForgotState();
    onClose();
  };

  // ── Login / Sign up validation ─────────────────────────────────
  const vaidate = () => {
    const { email, password } = userDetails;
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(email)) newErrors.email = "Enter a valid email";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
  };

  const handleSendOtp = async () => {
    const { email, password } = userDetails;
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(email)) newErrors.email = "Enter a valid email";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsProcessing(true);
    const result = await verifyEmailApi({ email });

    if (result.status == 200) {
      setSentOtp(true);
      setOtpTimer(OTP_DURATION);
      setShowOtpAlert("sent");
    } else if (result.status == 400) {
      setSentOtp(false);
      setShowOtpAlert(result.response.data.message || "error");
    } else {
      setSentOtp(false);
      setShowOtpAlert("error");
    }
    setIsProcessing(false);
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0 || isProcessing) return;
    setResendOtp(true);
    setIsProcessing(true);
    const result = await verifyEmailApi({ email: userDetails.email });

    if (result.status == 200) {
      setUserOtp("");
      setOtpTimer(OTP_DURATION);
      setShowOtpAlert("resent");
    } else if (result.status == 400) {
      setShowOtpAlert(result.response.data.message || "error");
    } else {
      setShowOtpAlert("error");
    }
    setIsProcessing(false);
  };

  const registration = async () => {
    if (!userOtp.trim()) { setShowOtpAlert("required"); return; }
    if (otpTimer <= 0) { setShowOtpAlert("expired"); return; }

    setIsProcessing(true);
    const result = await registerApi({
      email: userDetails.email,
      password: userDetails.password,
      otp: userOtp
    });

    if (result.status == 200) {
      sessionStorage.setItem("existingUser", JSON.stringify(result.data.user));
      sessionStorage.setItem("token", result.data.token);
      const reqHeader = { authorization: `Bearer ${result.data.token}` };

      if (Object.keys(storeData).length !== 0) {
        await storeDataApi(storeData, reqHeader);
      }

      setIsProcessing(false);
      setVerifiedSuccess(true);

      setTimeout(() => {
        navigate(`/user-profile/${result.data.user._id}`);
        handleModalClose();
      }, SUCCESS_REDIRECT_DELAY);
    } else if (result.status == 400) {
      setIsProcessing(false);
      setShowOtpAlert("invalid otp");
    } else {
      setIsProcessing(false);
      setShowOtpAlert("error");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const details = jwtDecode(credentialResponse.credential);
    const result = await googleloginApi({
      email: details.email,
      firstName: details.given_name,
      lastName: details.family_name,
      photo: details.picture
    });

    if (result.status == 200) {
      sessionStorage.setItem("existingUser", JSON.stringify(result.data.user));
      sessionStorage.setItem("token", result.data.token);
      const reqHeader = { authorization: `Bearer ${result.data.token}` };

      if (storeData && Object.keys(storeData).length !== 0) {
        await storeDataApi(storeData, reqHeader);
      }
      navigate(`/user-profile/${result.data.user._id}`);
    } else if (result.status === 400 || result.status === 401) {
      alert(result.response.data.message);
    } else {
      alert("something went wrong");
    }
    handleModalClose();
  };

  const login = async () => {
    if (!userDetails.email || !userDetails.password) {
      vaidate();
    } else {
      setIsProcessing(true);
      const result = await loginApi({
        email: userDetails.email,
        password: userDetails.password
      });

      if (result.status == 200) {
        sessionStorage.setItem("existingUser", JSON.stringify(result.data.user));
        sessionStorage.setItem("token", result.data.token);
        const reqHeader = { authorization: `Bearer ${result.data.token}` };

        if (storeData&&Object.keys(storeData).length !== 0) {
          await storeDataApi(storeData, reqHeader);
        }

        setIsProcessing(false);
        setVerifiedSuccess(true);

        setTimeout(() => {
          navigate(`/user-profile/${result.data.user._id}`);
          handleModalClose();
        }, SUCCESS_REDIRECT_DELAY);
      } else if (result.status == 400 || result.status == 401) {
        setIsProcessing(false);
        setShowOtpAlert(result.response.data.message || "error");
      } else {
        setIsProcessing(false);
        setShowOtpAlert("error");
      }
    }
  };

  // ── Forgot password handlers ────────────────────────────────────
  const handleForgotPasswordClick = () => {
    setForgotEmail(userDetails.email || "");
    setShowForgotPassword(true);
    setForgotStep("email");
    setShowForgotAlert("");
  };

  const handleBackToLogin = () => {
    resetForgotState();
    setCheckmode("login");
  };

  const handleSendResetOtp = async () => {
    const newErrors = {};
    if (!forgotEmail.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(forgotEmail)) newErrors.email = "Enter a valid email";
    setForgotErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setForgotProcessing(true);
    const result = await forgotPasswordApi({ email: forgotEmail });

    if (result.status == 200) {
      setForgotStep("reset");
      setForgotOtpTimer(OTP_DURATION);
      setShowForgotAlert("sent");
    } else if (result.status == 404) {
      setShowForgotAlert("no account");
    } else if (result.status == 400) {
      setShowForgotAlert(result.response.data.message || "error");
    } else {
      setShowForgotAlert("error");
    }
    setForgotProcessing(false);
  };

  const handleResendResetOtp = async () => {
    if (forgotOtpTimer > 0 || forgotProcessing) return;

    setForgotProcessing(true);
    const result = await forgotPasswordApi({ email: forgotEmail });

    if (result.status == 200) {
      setForgotOtp("");
      setForgotOtpTimer(OTP_DURATION);
      setShowForgotAlert("resent");
    } else if (result.status == 400) {
      setShowForgotAlert(result.response.data.message || "error");
    } else {
      setShowForgotAlert("error");
    }
    setForgotProcessing(false);
  };

  const handleResetPassword = async () => {
    if (!forgotOtp.trim()) { setShowForgotAlert("required"); return; }
    if (forgotOtpTimer <= 0) { setShowForgotAlert("expired"); return; }
    if (newPassword.length < 6) { setShowForgotAlert("weak"); return; }
    if (newPassword !== confirmPassword) { setShowForgotAlert("mismatch"); return; }

    setForgotProcessing(true);
    const result = await resetPasswordApi({
      email: forgotEmail,
      otp: forgotOtp,
      newPassword
    });

    if (result.status == 200) {
      setForgotProcessing(false);
      setResetSuccess(true);
      setUserDetails({ ...userDetails, email: forgotEmail, password: "" });

      setTimeout(() => {
        resetForgotState();
        setCheckmode("login");
      }, SUCCESS_REDIRECT_DELAY);
    } else if (result.status == 400) {
      setForgotProcessing(false);
      setShowForgotAlert("invalid");
    } else {
      setForgotProcessing(false);
      setShowForgotAlert("error");
    }
  };

  const alertConfig = showOtpAlert
      ? (ALERT_MESSAGES[showOtpAlert] || { type: "error", title: "Notice", desc: showOtpAlert })
      : null;

  const forgotAlertConfig = showForgotAlert
      ? (FORGOT_ALERT_MESSAGES[showForgotAlert] || { type: "error", title: "Notice", desc: showForgotAlert })
      : null;

  const AlertBanner = ({ config }) => {
    if (!config) return null;
    return (
        <div
            className={`w-full flex items-start gap-3 rounded-xl px-4 py-3 mb-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
                config.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
            }`}
        >
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
      <>
        <Modal isOpen={isOpen} onClose={handleModalClose}>
          <div>
            <div className="p-8 md:p-12">

              {/* ── Registration verified success takeover ─────────── */}
              {(verifiedSuccess && checkMode === 'register') ? (
                  <div className="flex flex-col items-center justify-center text-center py-10 min-h-[320px]">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                      <span className="material-symbols-outlined text-green-600 text-[44px]">check_circle</span>
                    </div>
                    <h2 className="font-headline-lg text-[28px] text-on-surface mb-2">Verified successfully</h2>
                    <p className="font-body-md text-on-surface-variant">Taking you to your profile...</p>
                  </div>

                  /* ── Password reset success takeover ─────────────────── */
              ) : resetSuccess ? (
                  <div className="flex flex-col items-center justify-center text-center py-10 min-h-[320px]">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                      <span className="material-symbols-outlined text-green-600 text-[44px]">check_circle</span>
                    </div>
                    <h2 className="font-headline-lg text-[28px] text-on-surface mb-2">Password reset successful</h2>
                    <p className="font-body-md text-on-surface-variant">You can now sign in with your new password.</p>
                  </div>

                  /* ── Forgot password flow ─────────────────────────────── */
              ) : showForgotPassword ? (
                  <div className="flex flex-col justify-center items-center">
                    <AlertBanner config={forgotAlertConfig} />

                    {forgotStep === "email" ? (
                        <>
                          <div className="text-center mb-8">
                            <h2 className="font-headline-lg text-[32px] text-on-surface mb-2">Reset Password</h2>
                            <p className="font-body-md text-on-surface-variant">
                              Enter your email and we'll send you a code to reset your password.
                            </p>
                          </div>

                          <div className="space-y-2 w-full">
                            <label className="font-label-bold text-on-surface-variant block" htmlFor="forgot-email">Email Address</label>
                            <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                            mail
                          </span>
                              <input
                                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60"
                                  value={forgotEmail}
                                  onChange={(e) => setForgotEmail(e.target.value)}
                                  id="forgot-email"
                                  placeholder="name@company.com"
                                  type="email"
                                  disabled={forgotProcessing}
                              />
                              {forgotErrors.email && <p className="text-red-500 text-sm mt-1">{forgotErrors.email}</p>}
                            </div>
                          </div>

                          <button
                              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-button text-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                              type="button"
                              onClick={handleSendResetOtp}
                              disabled={forgotProcessing}
                          >
                            {forgotProcessing ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                  Sending code...
                                </>
                            ) : (
                                "Send Reset Code"
                            )}
                          </button>

                          <button
                              type="button"
                              onClick={handleBackToLogin}
                              className="text-sm text-on-surface-variant hover:text-on-surface mt-4 transition-colors"
                          >
                            ← Back to Sign In
                          </button>
                        </>
                    ) : (
                        <>
                          <div className="text-center mb-8">
                            <h2 className="font-headline-lg text-[32px] text-on-surface mb-2">Set New Password</h2>
                            <p className="font-body-md text-on-surface-variant">
                              Enter the code sent to <span className="font-bold text-on-surface">{maskEmail(forgotEmail)}</span> and choose a new password.
                            </p>
                          </div>

                          <div className="space-y-2 w-full">
                            <label className="font-label-bold text-on-surface-variant block" htmlFor="reset-otp">Enter Code</label>
                            <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                            security
                          </span>
                              <input
                                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60 tracking-[0.3em]"
                                  value={forgotOtp}
                                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                  id="reset-otp"
                                  placeholder="123456"
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={6}
                                  disabled={forgotProcessing}
                              />
                            </div>
                          </div>

                          <div className="w-full flex items-center justify-between mt-4">
                            {forgotOtpTimer > 0 ? (
                                <p className="text-sm text-on-surface-variant">
                                  Resend code in <span className="font-bold text-on-surface">{formatTime(forgotOtpTimer)}</span>
                                </p>
                            ) : (
                                <p className="text-sm text-on-surface-variant">Didn't get the code?</p>
                            )}
                            <button
                                type="button"
                                onClick={handleResendResetOtp}
                                disabled={forgotOtpTimer > 0 || forgotProcessing}
                                className={`text-sm font-bold transition-colors ${
                                    forgotOtpTimer > 0 || forgotProcessing
                                        ? "text-outline cursor-not-allowed"
                                        : "text-primary hover:text-secondary cursor-pointer"
                                }`}
                            >
                              Resend Code
                            </button>
                          </div>

                          <div className="space-y-2 w-full mt-5">
                            <label className="font-label-bold text-on-surface-variant block" htmlFor="new-password">New Password</label>
                            <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                            lock
                          </span>
                              <input
                                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  id="new-password"
                                  placeholder="••••••••"
                                  type="password"
                                  disabled={forgotProcessing}
                              />
                            </div>
                          </div>

                          <div className="space-y-2 w-full mt-5">
                            <label className="font-label-bold text-on-surface-variant block" htmlFor="confirm-password">Confirm Password</label>
                            <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                            lock
                          </span>
                              <input
                                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  id="confirm-password"
                                  placeholder="••••••••"
                                  type="password"
                                  disabled={forgotProcessing}
                              />
                            </div>
                          </div>

                          <button
                              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-button text-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                              type="button"
                              onClick={handleResetPassword}
                              disabled={forgotProcessing || forgotOtp.length < 4 || !newPassword || !confirmPassword}
                          >
                            {forgotProcessing ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                  Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                          </button>

                          <button
                              type="button"
                              onClick={() => { setForgotStep("email"); setShowForgotAlert(""); setForgotOtp(""); }}
                              className="text-sm text-on-surface-variant hover:text-on-surface mt-4 transition-colors"
                          >
                            ← Use a different email
                          </button>
                        </>
                    )}
                  </div>

                  /* ── Signup OTP verification screen ───────────────────── */
              ) : sentOtp ? (
                  <div className="flex flex-col justify-center items-center">
                    <AlertBanner config={alertConfig} />

                    <div className="text-center mb-8">
                      <h2 className="font-headline-lg text-[32px] text-on-surface mb-2">Verify Your Email</h2>
                      <p className="font-body-md text-on-surface-variant">
                        Enter the 6-digit code sent to <span className="font-bold text-on-surface">{maskEmail(userDetails.email)}</span>
                      </p>
                    </div>

                    <div className="space-y-2 w-full">
                      <label className="font-label-bold text-on-surface-variant block" htmlFor="otp">Enter OTP</label>
                      <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                      security
                    </span>
                        <input
                            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60 tracking-[0.3em]"
                            value={userOtp}
                            onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            id="otp"
                            placeholder="123456"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            disabled={isProcessing}
                        />
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-between mt-4">
                      {otpTimer > 0 ? (
                          <p className="text-sm text-on-surface-variant">
                            Resend code in <span className="font-bold text-on-surface">{formatTime(otpTimer)}</span>
                          </p>
                      ) : (
                          <p className="text-sm text-on-surface-variant">Didn't get the code?</p>
                      )}
                      <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={otpTimer > 0 || isProcessing}
                          className={`text-sm font-bold transition-colors ${
                              otpTimer > 0 || isProcessing
                                  ? "text-outline cursor-not-allowed"
                                  : "text-primary hover:text-secondary cursor-pointer"
                          }`}
                      >
                        Resend Code
                      </button>
                    </div>

                    <button
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-button text-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        type="submit"
                        onClick={registration}
                        disabled={isProcessing || userOtp.length < 4}
                    >
                      {isProcessing ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                            {resendOtp ? 'Sending OTP' : 'Verifying...'}
                          </>
                      ) : (
                          "Verify Email"
                      )}
                    </button>

                    <button
                        type="button"
                        onClick={() => { setSentOtp(false); setShowOtpAlert(""); setUserOtp(""); }}
                        className="text-sm text-on-surface-variant hover:text-on-surface mt-4 transition-colors"
                    >
                      ← Use a different email
                    </button>
                  </div>

                  /* ── Login / Sign up screen ───────────────────────────── */
              ) : (
                  <div>
                    <div className="text-center mb-10">
                      {checkMode === "login" ? (
                          <h2 className="font-headline-lg text-[32px] text-on-surface mb-2">Sign In</h2>
                      ) : (
                          <h2 className="font-headline-lg text-[32px] text-on-surface mb-2">Sign Up</h2>
                      )}
                      <p className="font-body-md text-on-surface-variant">Welcome back! Please enter your details.</p>
                    </div>

                    <AlertBanner config={alertConfig} />

                    <form className="space-y-5">
                      <div className="space-y-2">
                        <label className="font-label-bold text-on-surface-variant block" htmlFor="email">Email Address</label>
                        <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                        mail
                      </span>
                          <input
                              className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60"
                              value={userDetails.email}
                              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                              id="email"
                              placeholder="name@company.com"
                              type="email"
                              disabled={isProcessing}
                          />
                          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          {checkMode === "login" ? (
                              <label className="font-label-bold text-on-surface-variant block" htmlFor="password">Password</label>
                          ) : (
                              <label className="font-label-bold text-on-surface-variant block" htmlFor="password">Set a Password</label>
                          )}
                          {checkMode === "login" && (
                              <button
                                  type="button"
                                  onClick={handleForgotPasswordClick}
                                  className="text-[13px] font-bold text-primary hover:text-secondary transition-colors"
                              >
                                Forgot Password?
                              </button>
                          )}
                        </div>
                        <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                        lock
                      </span>
                          <input
                              className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-0 transition-all font-body-md text-on-surface placeholder:text-outline/60"
                              value={userDetails.password}
                              onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                              id="password"
                              placeholder="••••••••"
                              type="password"
                              disabled={isProcessing}
                          />
                          <button
                              className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-on-surface-variant"
                              type="button"
                          >
                            visibility
                          </button>
                          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>
                      </div>

                      {checkMode === "login" ? (
                          <button
                              onClick={login}
                              type="button"
                              disabled={isProcessing}
                              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-button text-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                          >
                            {isProcessing ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                  Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                          </button>
                      ) : (
                          <button
                              disabled={isProcessing}
                              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-button text-button shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                              type="button"
                              onClick={handleSendOtp}
                          >
                            {isProcessing ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                  Sending code...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                          </button>
                      )}
                    </form>

                    <div className="relative my-10">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-outline-variant/30"></div>
                      </div>
                      <div className="relative flex justify-center">
                    <span className="bg-surface-container-lowest px-4 text-outline text-sm font-medium">
                      or continue with
                    </span>
                      </div>
                    </div>

                    <div className="w-full">
                      <GoogleLogin
                          width={382}
                          onSuccess={(credentialResponse) => { handleGoogleLogin(credentialResponse); }}
                          onError={() => { console.log('Login Failed'); }}
                      />
                    </div>

                    {checkMode === 'login' ? (
                        <p className="mt-10 text-center text-on-surface-variant text-sm">
                          Don't have an account?{" "}
                          <a className="font-bold text-primary hover:underline underline-offset-4" onClick={() => setCheckmode('register')}>
                            Sign Up
                          </a>
                        </p>
                    ) : (
                        <p className="mt-10 text-center text-on-surface-variant text-sm">
                          Already have an account?{" "}
                          <a className="font-bold text-primary hover:underline underline-offset-4" onClick={() => setCheckmode('login')}>
                            Sign In
                          </a>
                        </p>
                    )}
                  </div>
              )}
            </div>
            <div className="h-1.5 w-full bg-primary-gradient"></div>
          </div>
        </Modal>
      </>
  );
};

export default UserAuth;