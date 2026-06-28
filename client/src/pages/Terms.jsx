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

export default function Terms() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="text-ink2 mt-2 text-sm">Last updated: June 28, 2026</p>

        <div className="mt-8 space-y-8">
          <Section title="1. Agreement to these terms">
            <p>
              By creating an account or using CareerCraft (the "Service"), you
              agree to these Terms of Service. If you do not agree, please do
              not use the Service.
            </p>
          </Section>

          <Section title="2. Your account">
            <p>
              You are responsible for keeping your login credentials secure and
              for all activity that happens under your account. You must provide
              accurate information and be old enough to form a binding contract
              in your jurisdiction. Notify us promptly of any unauthorized use.
            </p>
          </Section>

          <Section title="3. Acceptable use">
            <p>
              You agree not to misuse the Service. This includes not attempting
              to disrupt or reverse-engineer the Service, not uploading unlawful
              or infringing content, not abusing the AI features to generate
              harmful or deceptive material, and not accessing the Service
              through automated means except as expressly permitted.
            </p>
          </Section>

          <Section title="4. Your content">
            <p>
              You retain ownership of the resume content, text, and other
              materials you create or upload ("Your Content"). You grant us a
              limited license to store and process Your Content solely to
              operate and provide the Service to you — for example, generating
              AI suggestions or exporting your resume.
            </p>
          </Section>

          <Section title="5. AI-generated suggestions">
            <p>
              The Service uses third-party AI models to generate suggestions
              such as summaries and bullet points. AI output may be inaccurate
              or incomplete. You are responsible for reviewing and editing any
              AI-generated content before relying on it. We do not guarantee any
              specific outcome, including employment or interview results.
            </p>
          </Section>

          <Section title="6. Plans, payments, and refunds">
            <p>
              Some features require a paid plan ("Pro"). Payments are processed
              by our payment provider; by purchasing, you authorize the
              applicable charges. Unless required by law or stated otherwise,
              payments are non-refundable. We may change pricing with reasonable
              notice for future billing periods.
            </p>
          </Section>

          <Section title="7. Intellectual property">
            <p>
              The Service, including its software, design, and branding, is
              owned by us and protected by applicable laws. These Terms do not
              grant you any right to our trademarks or to copy the Service.
            </p>
          </Section>

          <Section title="8. Disclaimers">
            <p>
              The Service is provided "as is" and "as available" without
              warranties of any kind, to the fullest extent permitted by law. We
              do not warrant that the Service will be uninterrupted, error-free,
              or secure.
            </p>
          </Section>

          <Section title="9. Limitation of liability">
            <p>
              To the maximum extent permitted by law, we will not be liable for
              any indirect, incidental, or consequential damages, or for any
              loss of data, profits, or opportunities arising from your use of
              the Service.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              You may stop using the Service at any time. We may suspend or
              terminate access if you violate these Terms or if necessary to
              protect the Service or other users.
            </p>
          </Section>

          <Section title="11. Changes to these terms">
            <p>
              We may update these Terms from time to time. If we make material
              changes, we will take reasonable steps to notify you. Continued
              use after changes take effect means you accept the updated Terms.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Questions about these Terms? Contact us at{" "}
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
