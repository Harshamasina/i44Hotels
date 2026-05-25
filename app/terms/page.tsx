import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/site/legal-page";

// TODO(owner): have counsel review before launch. Reflects how the site actually
// works: informational marketing site; reservations complete on the brands' own
// booking engines; Google reviews via the Places API; governed by Missouri law.
const LAST_UPDATED = "May 24, 2026";

export const metadata: Metadata = {
    title: "Terms of Use",
    description:
        "The terms for using i44hotels.com, including how reservations are completed on each hotel's official brand website (Wyndham, Choice, or Hyatt).",
    alternates: { canonical: "/terms" },
};

const linkClass =
    "text-gold-700 hover:text-gold-600 underline underline-offset-2 font-medium";

export default function TermsPage() {
    return (
        <LegalPage
            title="Terms of Use"
            subtitle="These terms cover how you may use this website and explain that reservations are completed on each hotel's official brand booking site."
            lastUpdated={LAST_UPDATED}
        >
            <p>
                These Terms of Use govern your use of i44hotels.com, the website of I44
                Hotels. By using this site, you agree to these terms. If you do not
                agree, please do not use the site.
            </p>

            <LegalSection heading="About this site">
                <p>
                    I44 Hotels is a family-owned group that owns and manages hotels
                    along Interstate 44, including near Fort Leonard Wood in Missouri.
                    This site is provided for general information and to help you learn
                    about and book stays at our hotels.
                </p>
            </LegalSection>

            <LegalSection heading="Reservations, rates, and availability">
                <p>
                    Rates, availability, room types, amenities, and photos shown here
                    are for general information and may change at any time without
                    notice. Nothing on this site is an offer or a guarantee of a
                    specific rate or room.
                </p>
                <p>
                    Reservations and payments are completed on each hotel&apos;s
                    official brand website (for example, Wyndham, Choice, or Hyatt).
                    Those websites are operated by the respective brands and are
                    governed by their own terms and privacy policies. We are not
                    responsible for the content, availability, rates, or transactions
                    on those third-party sites.
                </p>
            </LegalSection>

            <LegalSection heading="Accuracy of information">
                <p>
                    We work to keep property details accurate, but we do not warrant
                    that all information is current or error-free. Please confirm
                    important details, such as pet policies, parking, accessibility,
                    and distance to Fort Leonard Wood, directly with the hotel before
                    you travel or book.
                </p>
            </LegalSection>

            <LegalSection heading="Reviews and brand content">
                <p>
                    Guest ratings and reviews are provided through Google and reflect
                    the views of the people who wrote them, not I44 Hotels. Franchise
                    brand names and logos are the property of their respective owners
                    and are used to identify the hotels we operate.
                </p>
            </LegalSection>

            <LegalSection heading="Acceptable use">
                <p>
                    Please use this site lawfully and in good faith. Do not attempt to
                    disrupt or gain unauthorized access to the site, scrape or harvest
                    data, or submit forms for spam, fraudulent, or abusive purposes.
                    Contact forms are for genuine inquiries only.
                </p>
            </LegalSection>

            <LegalSection heading="Intellectual property">
                <p>
                    The design, text, and original content of this site are owned by
                    I44 Hotels or its licensors. You may view and share pages for
                    personal, non-commercial use, but you may not copy or reuse our
                    content for other purposes without our permission.
                </p>
            </LegalSection>

            <LegalSection heading="Disclaimer of warranties">
                <p>
                    This site is provided on an &quot;as is&quot; and &quot;as
                    available&quot; basis, without warranties of any kind, whether
                    express or implied, to the fullest extent permitted by law.
                </p>
            </LegalSection>

            <LegalSection heading="Limitation of liability">
                <p>
                    To the fullest extent permitted by law, I44 Hotels will not be
                    liable for any indirect, incidental, or consequential damages
                    arising from your use of, or inability to use, this site or any
                    third-party site we link to.
                </p>
            </LegalSection>

            <LegalSection heading="Links to other sites">
                <p>
                    This site links to third-party websites, including the brands&apos;
                    booking engines and map services. We do not control those sites and
                    are not responsible for their content or practices.
                </p>
            </LegalSection>

            <LegalSection heading="Governing law">
                <p>
                    These terms are governed by the laws of the State of Missouri,
                    United States, without regard to its conflict-of-laws rules.
                </p>
            </LegalSection>

            <LegalSection heading="Changes to these terms">
                <p>
                    We may update these Terms of Use from time to time. The date at the
                    top of this page shows when they were last revised, and your
                    continued use of the site means you accept the current version.
                </p>
            </LegalSection>

            <LegalSection heading="Contact us">
                <p>
                    If you have questions about these terms, please reach us through our{" "}
                    <Link href="/contact" className={linkClass}>
                        Contact page
                    </Link>
                    .
                </p>
            </LegalSection>
        </LegalPage>
    );
}
