import React from 'react';
import { X, ArrowLeft, ShieldCheck, ScrollText } from 'lucide-react';

interface LegalPageModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

// Format: DD Month YYYY (e.g. 04 August 2026). Update this whenever the
// Privacy Policy / Terms & Conditions content below actually changes.
const LAST_UPDATED = '04 August 2026';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-bold text-yellow-300 font-serif">{title}</h3>
    <div className="text-xs text-emerald-200/90 leading-relaxed space-y-2">{children}</div>
  </div>
);

const PrivacyContent: React.FC = () => (
  <>
    <p className="text-xs text-emerald-200/80 leading-relaxed">
      IS AI Hub ("we", "us", "our") publishes this Privacy Policy to explain what information
      is collected through this website (the "Site") and how it is used, based strictly on the
      features currently available on the Site.
    </p>

    <Section title="1. What This Site Does">
      <p>
        IS AI Hub is a directory that helps visitors discover free and freemium AI tools
        (video, image, and writing tools), a curated prompt library, and a library of Islamic
        resources — including downloadable books (PDF), Quran audio/video recitations, daily
        duas &amp; azkar, and articles. The Site also offers an AI Finder quiz to suggest tools
        based on your answers, and can be installed as a Progressive Web App (PWA) on supported
        devices.
      </p>
    </Section>

    <Section title="2. Information We Collect">
      <p><strong className="text-white">Account information.</strong> If you create an account
      or sign in, we collect the email address, password, and display name you provide.
      Authentication is handled by Supabase; your password is stored in hashed form and is not
      visible to us. One specific email address is designated as the Admin account for content
      management — every other account is automatically assigned the standard Member role.</p>

      <p><strong className="text-white">Contact form messages.</strong> If you use the "Send
      Message" option or email us directly through the address shown in the Site's footer, we
      receive the email address and message you choose to submit, solely to respond to your
      inquiry.</p>

      <p><strong className="text-white">Saved/bookmarked items.</strong> If you bookmark AI
      tools or prompts, that list is stored locally in your browser (local storage) on your own
      device. It is not transmitted to or stored on our servers, and clearing your browser data
      will remove it.</p>

      <p><strong className="text-white">Islamic book downloads.</strong> Books are stored and
      served via Supabase Storage. We keep an aggregate download counter per book; this does not
      identify who downloaded a given file.</p>

      <p><strong className="text-white">Standard technical data.</strong> Like most websites, our
      hosting and infrastructure providers may automatically log basic technical information
      (such as IP address and request timestamps) as part of normal, secure operation of the
      Site.</p>
    </Section>

    <Section title="3. How We Use Information">
      <p>
        We use the information above to: operate and secure the Site; authenticate accounts and
        enforce the distinction between the Admin role and the Member role; respond to messages
        sent through the contact form; and maintain the AI tool, prompt, and Islamic resource
        libraries.
      </p>
    </Section>

    <Section title="4. Third-Party Services &amp; Links">
      <p>
        The AI tools listed on this Site are operated by independent third parties. Clicking
        through to a tool takes you to that provider's own website, which has its own privacy
        practices we do not control. Quran video recitations may be embedded from YouTube, and
        our footer links to third-party platforms (YouTube, X/Twitter, Facebook, Telegram). We
        use Supabase for authentication, database, and file storage. We encourage you to review
        the privacy policies of any third-party site or service you visit.
      </p>
    </Section>

    <Section title="5. Data Security">
      <p>
        Access to Admin-only actions (adding, editing, or removing content) is enforced at the
        database level via row-level security tied to the Admin account's role, not merely by
        hiding buttons in the interface. No method of transmission or storage is completely
        secure, so while we take reasonable measures to protect information, we cannot guarantee
        absolute security.
      </p>
    </Section>

    <Section title="6. Your Choices">
      <p>
        You can use most of the Site — browsing AI tools, prompts, and Islamic resources — without
        creating an account. You may sign out at any time, and you can clear your browser's local
        storage to remove locally saved bookmarks. To request access to, correction of, or
        deletion of your account information, contact us using the details in the Site's footer.
      </p>
    </Section>

    <Section title="7. Children's Privacy">
      <p>
        This Site is not directed at children and is not knowingly used to collect information
        from young children. If you believe a child has provided us personal information, please
        contact us so we can remove it.
      </p>
    </Section>

    <Section title="8. Changes to This Policy">
      <p>
        We may update this Privacy Policy as the Site's features change. The "Last updated" date
        below reflects the most recent revision. Continued use of the Site after changes take
        effect constitutes acceptance of the updated policy.
      </p>
    </Section>

    <Section title="9. Contact Us">
      <p>
        Questions about this Privacy Policy can be sent using the "Send Message" option or the
        contact email address shown in the Site's footer.
      </p>
    </Section>
  </>
);

const TermsContent: React.FC = () => (
  <>
    <p className="text-xs text-emerald-200/80 leading-relaxed">
      These Terms &amp; Conditions ("Terms") govern your use of IS AI Hub (the "Site"). By using
      the Site, you agree to these Terms.
    </p>

    <Section title="1. The Service">
      <p>
        IS AI Hub is a discovery directory for free and freemium AI tools (video, image, and
        writing), a curated prompt library, an AI Finder quiz that suggests tools based on your
        answers, and a library of Islamic resources including downloadable books (PDF), Quran
        audio/video recitations, daily duas &amp; azkar, and articles. The Site can be installed
        as a Progressive Web App on supported devices.
      </p>
    </Section>

    <Section title="2. Third-Party AI Tools">
      <p>
        We do not own, operate, host, or control the AI tools listed on the Site. Each tool is
        provided by an independent third party, subject to that provider's own terms, pricing,
        and availability, which may change without notice. Following a link to a listed tool is
        entirely at your own discretion and risk, and your use of that tool is governed by its
        provider's terms — not these Terms.
      </p>
    </Section>

    <Section title="3. Islamic Resources">
      <p>
        Islamic books, Quran recitations, duas &amp; azkar, and articles are provided for general
        educational and informational purposes. We aim for accuracy, but content on the Site
        should not be treated as a substitute for guidance from a qualified scholar. Downloadable
        books are made available for personal, non-commercial, educational use.
      </p>
    </Section>

    <Section title="4. Accounts &amp; Roles">
      <p>
        Creating an account requires an email address and password. You are responsible for
        keeping your login credentials confidential and for all activity under your account.
        Exactly one designated email address holds the Admin role, which allows managing the
        Site's content (AI tools, books, prompts, Quran videos, articles, and duas). Every other
        account is automatically assigned the standard Member role and does not have access to
        Admin content-management features. Role assignment is enforced by the database, not by
        the app's interface.
      </p>
    </Section>

    <Section title="5. Acceptable Use">
      <p>You agree not to:</p>
      <ul className="list-disc list-inside space-y-1 pl-1">
        <li>Attempt to gain unauthorized access to the Admin role or any account other than your own</li>
        <li>Submit unlawful, abusive, or harmful content through the contact form or any other feature</li>
        <li>Interfere with, disrupt, or attempt to bypass the Site's security or access controls</li>
        <li>Use automated means to scrape or misuse the Site's content beyond normal browsing</li>
        <li>Redistribute downloaded books commercially without appropriate rights</li>
      </ul>
    </Section>

    <Section title="6. Saved Items">
      <p>
        Bookmarking AI tools or prompts saves them locally in your browser. We are not
        responsible for the loss of this list if you clear your browser data, switch devices, or
        use a different browser.
      </p>
    </Section>

    <Section title="7. Intellectual Property">
      <p>
        The Site's design, branding, and original written content (including the AI Finder quiz
        and prompt library entries) belong to IS AI Hub or its licensors. Listed AI tools, Quran
        recitations, Islamic books, and articles remain the property of their respective owners
        and are referenced or made available under the terms those owners provide.
      </p>
    </Section>

    <Section title="8. Availability of Content">
      <p>
        Tools, books, prompts, duas, articles, and videos featured on the Site may be added,
        updated, or removed at any time, at the Admin's discretion, without prior notice.
      </p>
    </Section>

    <Section title="9. Disclaimer &amp; Limitation of Liability">
      <p>
        The Site is provided "as is" and "as available," without warranties of any kind. We do
        not guarantee the accuracy, availability, or quality of third-party AI tools or of
        Islamic content sourced or curated for the Site. To the fullest extent permitted by law,
        IS AI Hub is not liable for any damages arising from your use of the Site or of any
        third-party tool or resource linked from it.
      </p>
    </Section>

    <Section title="10. Termination">
      <p>
        We may suspend or remove access for accounts that violate these Terms.
      </p>
    </Section>

    <Section title="11. Changes to These Terms">
      <p>
        We may revise these Terms as the Site's features change. The "Last updated" date below
        reflects the most recent revision. Continued use of the Site after changes take effect
        constitutes acceptance of the updated Terms.
      </p>
    </Section>

    <Section title="12. Contact Us">
      <p>
        Questions about these Terms can be sent using the "Send Message" option or the contact
        email address shown in the Site's footer.
      </p>
    </Section>
  </>
);

export const LegalPageModal: React.FC<LegalPageModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-[#0B6E4F] text-emerald-200 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-emerald-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            {isPrivacy ? <ShieldCheck className="w-5 h-5" /> : <ScrollText className="w-5 h-5" />}
          </div>
          <h2 className="text-xl font-bold text-white font-serif">
            {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
          </h2>
        </div>
        <p className="text-[11px] text-emerald-400/70 mb-6">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-5">
          {isPrivacy ? <PrivacyContent /> : <TermsContent />}
        </div>

      </div>
    </div>
  );
};
