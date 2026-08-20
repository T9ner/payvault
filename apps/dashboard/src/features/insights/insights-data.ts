export interface InsightArticle {
  slug: string
  tag: string
  date: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  readTime: string
  content: string[]
  codeSnippet?: string
}

export const INSIGHTS_ARTICLES: InsightArticle[] = [
  {
    slug: 'sub-200ms-rail-failover',
    tag: 'Engineering',
    date: 'August 2026',
    title: 'Building sub-200ms rail failover in Go',
    excerpt: 'How health probing and state machines prevent checkout drop-offs across African payment switches.',
    author: 'Quirk Core Engineering',
    authorRole: 'Payment Systems Team',
    readTime: '4 min read',
    codeSnippet: `// Rail Circuit Breaker in Go
type RailEvaluator struct {
    p95Latency  time.Duration
    errorRate   float64
    activeRails []PaymentRail
}

func (e *RailEvaluator) RouteOptimal(ctx context.Context, charge ChargePayload) (*RailResult, error) {
    healthy := e.filterHealthyRails(e.activeRails)
    if len(healthy) == 0 {
        return nil, ErrNoHealthyRails
    }
    
    // Sort by health score and lowest latency
    sort.Slice(healthy, func(i, j int) bool {
        return healthy[i].Score() > healthy[j].Score()
    })
    
    return healthy[0].ExecuteWithFallback(ctx, charge, e.fallbackChain)
}`,
    content: [
      'Payment gateways across African markets experience frequent upstream degradation. Simple retry loops often fail because they trigger after the customer sees an error screen.',
      'To address this, our routing worker in Go runs continuous health checks against all connected gateways, including Paystack, Flutterwave, Monnify, and M-Pesa. Every 1,500ms, our nodes test TCP handshake latency, TLS negotiation times, and HTTP 5xx error rates.',
      'When a gateway begins queuing requests or response times exceed 350ms, Quirk downweights that provider. Subsequent charges shift to an alternate working rail in under 180ms without interrupting the active checkout session.',
      'This routing model maintains payment availability across regional provider outages without requiring custom error handling in your application code.',
    ],
  },
  {
    slug: 'multi-currency-ledger-architecture',
    tag: 'Treasury',
    date: 'July 2026',
    title: 'Multi-currency ledger architecture for scale',
    excerpt: 'Tracking NGN, KES, GHS, and USD settlement balances across separate banking rails without double-entry errors.',
    author: 'Quirk Infrastructure Group',
    authorRole: 'Ledger Systems',
    readTime: '5 min read',
    codeSnippet: `// Double-Entry Settlement Recording
interface LedgerTransaction {
  id: string;
  sourceAccount: string;
  destinationAccount: string;
  amount: bigint;
  currency: 'NGN' | 'KES' | 'USD' | 'GHS';
  idempotencyKey: string;
}

export async function recordSettlement(tx: LedgerTransaction): Promise<LedgerReceipt> {
  return await db.transaction(async (trx) => {
    // Lock accounts in order to prevent race conditions
    await trx.raw('SELECT * FROM accounts WHERE id IN (?, ?) FOR UPDATE', [
      tx.sourceAccount,
      tx.destinationAccount,
    ]);
    
    return await executeBalancedPosting(trx, tx);
  });
}`,
    content: [
      'Operating across African markets requires supporting multiple currencies: Nigerian Naira (NGN), Kenyan Shillings (KES), Ghanaian Cedis (GHS), and US Dollars (USD). Reconciling across different banking switches often creates reporting delays and manual accounting steps.',
      'Quirk uses a double-entry ledger that records every incoming payment, provider fee, clearing timestamp, and payout batch in real time.',
      'Every ledger entry is immutable and indexed by an idempotency hash. When funds clear through virtual accounts or mobile money, balances update in your unified multi-currency account.',
      'Automated rules let you schedule payouts and convert balances between currencies with consistent audit trails.',
    ],
  },
  {
    slug: 'hardware-enclave-vaulting',
    tag: 'Security',
    date: 'July 2026',
    title: 'Hardware enclave key vaulting for multi-rail SDKs',
    excerpt: 'Securing provider API credentials with isolated hardware encryption and zero-knowledge routing.',
    author: 'Security Engineering',
    authorRole: 'Platform Security',
    readTime: '4 min read',
    codeSnippet: `// Hardware Enclave Secret Decryption
import { KMSClient, DecryptCommand } from "@aws-sdk/client-kms";

export async function decryptProviderSecret(encryptedKey: string): Promise<string> {
  const kms = new KMSClient({ region: "af-south-1" });
  const result = await kms.send(
    new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedKey, "base64"),
      EncryptionContext: { service: "quirk-routing-engine" },
    })
  );
  return Buffer.from(result.Plaintext!).toString("utf8");
}`,
    content: [
      'Storing multiple gateway API keys in environment variables or application databases creates security risks as team size grows.',
      'Quirk stores merchant provider credentials inside hardware security modules (HSM). Provider keys for Paystack, Flutterwave, and M-Pesa are encrypted with client-specific AES-256-GCM keys managed inside isolated hardware enclaves.',
      'During transaction execution, credentials decrypt only in the memory of the routing worker and are cleared immediately after the request completes.',
      'This architecture ensures merchants retain direct ownership of their provider accounts and can rotate keys at any time without code redeployments.',
    ],
  },
]
