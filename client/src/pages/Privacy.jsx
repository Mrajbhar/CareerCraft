function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-ink mb-2">
        {title}
      </h2>
      <div className="text-ink2 text-[15px] leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

export default function Privacy() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-ink2 mt-2 text-sm">Last updated: June 28, 2026</p>

        <div className="mt-8 space-y-8">
          <Section title="1. Overview">
            <p>
              This policy explains what information CareerCraft (the "Service")
              collects, how we use it, and the choices you have. By using the
              Service, you agree to the practices described here.
            </p>
          </Section>

          <Section title="2. Information we collect">
            <p>
              We collect the information you provide directly, such as your
              name, email address, and password (stored only in hashed form). If
              you sign in with Google, we receive basic profile details from
              Google. We also store the resume content and other materials you
              create, your progress data (such as solved problems and activity),
              and limited technical/usage information needed to operate the
              Service.
            </p>
          </Section>

          <Section title="3. How we use your information">
            <p>
              We use your information to provide and improve the Service,
              authenticate your account, save your resumes and progress, process
              payments for paid plans, generate AI suggestions you request, and
              communicate with you about your account.
            </p>
          </Section>

          <Section title="4. AI processing">
            <p>
              When you use AI features, the relevant text you submit is sent to
              a third-party AI provider to generate a response. We send only
              what is needed for the feature you requested. Please avoid
              including sensitive personal data you do not want processed in
              this way.
            </p>
          </Section>

          <Section title="5. Third-party services">
            <p>
              We rely on trusted third parties to operate the Service, which may
              include an authentication provider (Google sign-in), a payment
              processor, an AI provider, and our database/hosting
              infrastructure. These providers process data on our behalf under
              their own terms and privacy policies.
            </p>
          </Section>

          <Section title="6. Cookies and local storage">
            <p>
              We use cookies and/or browser local storage to keep you signed in
              and remember preferences. You can control cookies through your
              browser settings, though some features may not work without them.
            </p>
          </Section>

          <Section title="7. Data retention">
            <p>
              We keep your information for as long as your account is active or
              as needed to provide the Service. You may request deletion of your
              account and associated data, subject to legal or legitimate
              business requirements.
            </p>
          </Section>

          <Section title="8. Your rights">
            <p>
              Depending on your location, you may have rights to access,
              correct, export, or delete your personal data. To exercise these
              rights, contact us using the details below.
            </p>
          </Section>

          <Section title="9. Security">
            <p>
              We take reasonable technical and organizational measures to
              protect your information. However, no method of transmission or
              storage is completely secure, and we cannot guarantee absolute
              security.
            </p>
          </Section>

          <Section title="10. Children's privacy">
            <p>
              The Service is not directed to children under the age required by
              your local law to consent to data processing, and we do not
              knowingly collect their personal information.
            </p>
          </Section>

          <Section title="11. Changes to this policy">
            <p>
              We may update this policy from time to time. Material changes will
              be communicated through the Service or by other reasonable means.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Questions about your privacy? Contact us at{" "}
              <a
                href="mailto:hello@careercraft.app"
                className="text-brand hover:underline"
              >
                hello@careercraft.app
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
