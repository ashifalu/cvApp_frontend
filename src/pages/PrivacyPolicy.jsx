import React from "react";

export default function PrivacyPolicy() {
    const lastUpdated = "August 2026";

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">

                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                        Privacy Policy
                    </h1>
                    <p className="mt-3 text-slate-500">
                        Last Updated: {lastUpdated}
                    </p>
                </div>

                <div className="space-y-8 text-slate-700 leading-8">

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            Introduction
                        </h2>
                        <p>
                            Welcome to <strong>Pro CV Builder</strong>. Your privacy is
                            important to us. This Privacy Policy explains how we collect,
                            use, store, and protect your personal information when you use
                            our website and services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            Information We Collect
                        </h2>
                        <p>
                            When using Pro CV Builder, we may collect the following
                            information:
                        </p>

                        <ul className="list-disc pl-6 mt-3 space-y-2">
                            <li>Name and contact information.</li>
                            <li>Email address and account credentials.</li>
                            <li>Resume and CV content you create or upload.</li>
                            <li>Employment history, education, skills, and certifications.</li>
                            <li>Profile photos you choose to upload.</li>
                            <li>Usage data such as device, browser, and analytics information.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            How We Use Your Information
                        </h2>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>To create, store, and manage your resumes.</li>
                            <li>To provide account access and authentication.</li>
                            <li>To improve website performance and user experience.</li>
                            <li>To respond to support requests and inquiries.</li>
                            <li>To send important service-related notifications.</li>
                            <li>To maintain security and prevent unauthorized access.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            Data Storage & Security
                        </h2>

                        <p>
                            We implement industry-standard security measures to protect your
                            information. While we strive to secure your personal data, no
                            online platform can guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            Resume Content Ownership
                        </h2>

                        <p>
                            You retain ownership of all resume and profile information you
                            create or upload through Pro CV Builder. We do not claim ownership
                            of your content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            Third-Party Services
                        </h2>

                        <p>
                            We may use trusted third-party services for hosting, analytics,
                            authentication, file storage, and payment processing. These
                            providers may process data only as necessary to provide their
                            services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            Cookies
                        </h2>

                        <p>
                            We may use cookies and similar technologies to improve website
                            functionality, remember user preferences, and analyze website
                            performance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            Your Rights
                        </h2>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access your personal information.</li>
                            <li>Update or correct your data.</li>
                            <li>Delete your account and associated resumes.</li>
                            <li>Request information regarding your stored data.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            Changes to This Policy
                        </h2>

                        <p>
                            We may update this Privacy Policy from time to time. Any updates
                            will be posted on this page with a revised "Last Updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                            Contact Us
                        </h2>

                        <p>
                            If you have questions regarding this Privacy Policy, please
                            contact us through the support channels available on Pro CV
                            Builder.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}