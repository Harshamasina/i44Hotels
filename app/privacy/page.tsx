import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/site/legal-page";
import { pageMetadata } from "@/lib/seo";

// TODO(owner): have counsel review before launch. Tailored to this site's actual
// data use: contact forms emailed via Resend, Google reviews via the Places API,
// Cloudflare Turnstile spam protection. No analytics, advertising, or tracking.
const LAST_UPDATED = "May 24, 2026";

export const metadata = pageMetadata({
    title: "Privacy Policy",
    description:
        "How I44 Hotels handles the information you send through our contact forms, plus the Google reviews shown on our hotel pages. We do not use analytics, advertising, or tracking cookies.",
    path: "/privacy",
});

const linkClass =
    "text-gold-700 hover:text-gold-600 underline underline-offset-2 font-medium";

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            subtitle="We keep data collection to a minimum. We do not use analytics, advertising, or tracking cookies. The main time we collect personal information is when you choose to contact us."
            lastUpdated={LAST_UPDATED}
        >
            <p>
                This Privacy Policy explains how I44 Hotels (&quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) handles information when you use
                i44hotels.com.
            </p>

            <LegalSection heading="Information we collect">
                <p>
                    <strong className="text-navy-800">
                        Information you send us.
                    </strong>{" "}
                    When you submit a contact, group, extended-stay, or military
                    travel form, we collect the details you choose to provide: your
                    name, email address, phone number (if you add one), the hotel or
                    dates you ask about, and your message. You control what you share.
                </p>
                <p>
                    <strong className="text-navy-800">
                        Spam protection and security data.
                    </strong>{" "}
                    To keep our forms free of automated abuse, we use Cloudflare
                    Turnstile and basic rate limiting. These process limited technical
                    information, such as your IP address and a verification token, at
                    the moment you submit a form. Our hosting provider may also keep
                    standard server logs (for example, IP address and browser type)
                    for security and reliable delivery.
                </p>
                <p>
                    We do <strong className="text-navy-800">not</strong> use website
                    analytics, advertising networks, or tracking cookies, and we do not
                    build marketing profiles about you.
                </p>
            </LegalSection>

            <LegalSection heading="How we use your information">
                <ul className="list-disc space-y-1.5 pl-5">
                    <li>To read and reply to your inquiry.</li>
                    <li>
                        To help you find a hotel, coordinate group or extended-stay
                        room blocks, and answer your questions.
                    </li>
                    <li>To protect our site and forms from spam and abuse.</li>
                </ul>
                <p>We do not sell or rent your personal information.</p>
            </LegalSection>

            <LegalSection heading="How your message reaches us">
                <p>
                    When you submit a form, your message is delivered to our team by
                    email through Resend, an email delivery service. It is sent to the
                    I44 Hotels inbox so a member of our team can respond to you. We do
                    not add you to any mailing list.
                </p>
            </LegalSection>

            <LegalSection heading="Third-party services">
                <p>
                    <strong className="text-navy-800">Google reviews.</strong> We show
                    Google ratings and reviews on our hotel pages using the Google
                    Places API. When this content loads, Google may process data in
                    line with the{" "}
                    <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                    >
                        Google Privacy Policy
                    </a>
                    . Reviews are written by Google users and shown with attribution;
                    they are not created by us.
                </p>
                <p>
                    <strong className="text-navy-800">Booking links.</strong> When you
                    select Book, we send you to the hotel&apos;s official brand website
                    (for example, Wyndham, Choice, or Hyatt) to complete your
                    reservation. Those sites are operated by the brands and governed by
                    their own privacy policies and terms. We do not process payments or
                    store reservation details.
                </p>
                <p>
                    <strong className="text-navy-800">Hosting and security.</strong>{" "}
                    Our site is hosted on Cloudflare, which also provides the Turnstile
                    spam protection described above.
                </p>
            </LegalSection>

            <LegalSection heading="Cookies and tracking">
                <p>
                    We do not use analytics or advertising cookies. The site uses only
                    what is needed to function and to keep our forms secure.
                </p>
            </LegalSection>

            <LegalSection heading="How long we keep your information">
                <p>
                    We keep inquiry messages only as long as needed to respond to you
                    and to provide the service you asked about, after which they may be
                    removed from our inbox in the normal course of business.
                </p>
            </LegalSection>

            <LegalSection heading="Your choices and rights">
                <p>
                    You can ask us to access, correct, or delete the personal
                    information you sent through a form by contacting us. Depending on
                    where you live, you may have additional rights under laws such as
                    the California privacy laws, and we will honor valid requests as
                    required by law.
                </p>
            </LegalSection>

            <LegalSection heading="Children's privacy">
                <p>
                    This site is intended for a general audience and is not directed to
                    children under 13. We do not knowingly collect personal information
                    from children.
                </p>
            </LegalSection>

            <LegalSection heading="Security">
                <p>
                    We take reasonable steps to protect the information you send us. No
                    method of transmission or storage is completely secure, so we
                    cannot guarantee absolute security.
                </p>
            </LegalSection>

            <LegalSection heading="Changes to this policy">
                <p>
                    We may update this Privacy Policy from time to time. The date at the
                    top of this page shows when it was last revised.
                </p>
            </LegalSection>

            <LegalSection heading="Contact us">
                <p>
                    If you have questions about this Privacy Policy or your information,
                    please reach us through our{" "}
                    <Link href="/contact" className={linkClass}>
                        Contact page
                    </Link>
                    .
                </p>
            </LegalSection>
        </LegalPage>
    );
}
