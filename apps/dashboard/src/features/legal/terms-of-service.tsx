import { LegalLayout } from './legal-layout'

export function TermsOfService() {
  return (
    <LegalLayout title='Terms of Service' lastUpdated='April 9, 2026'>
      <div className='space-y-8'>
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>1. Agreement to terms</h2>
          <p>
            By using Quirk, you agree to these Terms of Service. If you disagree with any part of the terms, you may not use the service. Quirk provides payment routing, ledger management, and multi-rail integration tools for software applications.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>2. Account security</h2>
          <p>
            Quirk uses GitHub OAuth for authentication. You are responsible for safeguarding your GitHub credentials. Any API requests made with your vaulted secret keys are your responsibility.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>3. Payment routing services</h2>
          <p>
            Quirk routes transaction requests between your application and configured payment providers. You authorize Quirk to forward charge instructions on your behalf according to your routing rules. You agree to comply with all rules of the payment networks and partner banks you connect.
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>You must provide accurate business and registration information.</li>
            <li>Customer disputes and chargebacks remain the direct responsibility of the merchant.</li>
            <li>We may pause routing if we detect fraudulent activity or network abuse.</li>
          </ul>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>4. Prohibited activities</h2>
          <p>
            You may not use Quirk for illegal activities, including money laundering, financing terrorism, or processing payments for prohibited goods and services under applicable laws and card scheme rules.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>5. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, Quirk and its affiliates are not liable for indirect, incidental, or consequential damages, or loss of revenue resulting from third-party payment gateway downtime or bank network failures.
          </p>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>6. Termination</h2>
          <p>
            We may suspend or terminate your API access if you violate these terms or if required by financial regulatory authorities.
          </p>
        </section>

        <section className='space-y-4 border-t pt-8'>
          <p className='text-muted-foreground text-xs'>
            For questions about these terms, contact engineering@quirk.dev.
          </p>
        </section>
      </div>
    </LegalLayout>
  )
}
