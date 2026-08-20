import { LegalLayout } from './legal-layout'

export function PrivacyPolicy() {
  return (
    <LegalLayout title='Privacy Policy' lastUpdated='April 9, 2026'>
      <div className='space-y-8'>
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>1. Information we collect</h2>
          <p>
            Quirk collects information required to operate payment routing and account services for merchants. We collect data in the following categories:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li><strong>Account information:</strong> When you connect via GitHub OAuth, we receive your GitHub username, display name, and email address to create and manage your merchant profile.</li>
            <li><strong>Financial and transaction data:</strong> We record business details, transaction amounts, provider routing references, and settlement timestamps to process and verify payments.</li>
            <li><strong>Technical logs:</strong> Our infrastructure logs IP addresses, browser agents, request timestamps, and API response codes to monitor service health and prevent abuse.</li>
          </ul>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>2. How we use information</h2>
          <p>
            We use collected information to route transactions, monitor rail availability, and maintain merchant accounts. This includes:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Executing charge requests and updating transaction ledger balances.</li>
            <li>Detecting abnormal request patterns and preventing unauthorized API access.</li>
            <li>Delivering operational alerts, service status updates, and security notices.</li>
          </ul>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>3. Information sharing</h2>
          <p>
            We share data with third parties only in the following operational situations:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li><strong>Payment processors:</strong> We forward transaction payloads to the upstream payment gateways and banks you configure (such as Paystack, Flutterwave, or M-Pesa) to authorize charges.</li>
            <li><strong>Compliance and legal obligations:</strong> We disclose data if required by applicable law, regulation, court order, or enforceable government request.</li>
          </ul>
        </section>

        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>4. Data security</h2>
          <p>
            We apply security controls to protect transaction records and merchant credentials:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>All network traffic uses TLS 1.3 encryption in transit.</li>
            <li>Provider credentials and secret keys are encrypted with AES-256-GCM in hardware security modules.</li>
            <li>Internal access to production data is restricted to authorized operations staff.</li>
          </ul>
        </section>

        <section className='space-y-4 border-t pt-8'>
          <p className='text-muted-foreground text-xs'>
            For questions about this policy, contact dbosshonour@gmail.com.
          </p>
        </section>
      </div>
    </LegalLayout>
  )
}
