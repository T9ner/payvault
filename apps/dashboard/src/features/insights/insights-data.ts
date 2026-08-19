export interface InsightArticle {
  slug: string
  tag: string
  date: string
  title: string
  summary: string
  author: string
  authorRole: string
  readTime: string
  content: string[]
  codeSnippet?: {
    lang: string
    code: string
  }
}

export const INSIGHTS_ARTICLES: InsightArticle[] = [
  {
    slug: 'sub-200ms-rail-failover',
    tag: 'Engineering',
    date: 'August 2026',
    title: 'Building Sub-200ms Autonomous Rail Failover in Go',
    summary: 'How deterministic state machines and predictive health probing eliminate checkout drop-offs across African payment switches.',
    author: 'Quirk Core Infrastructure Team',
    authorRole: 'Distributed Systems & Payment Routing',
    readTime: '4 min read',
    codeSnippet: {
      lang: 'go',
      code: `// Dynamic Rail Circuit Breaker in Go
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
    
    // Select lowest latency rail with error budget > 99.8%
    sort.Slice(healthy, func(i, j int) bool {
        return healthy[i].Score() > healthy[j].Score()
    })
    
    return healthy[0].ExecuteWithFallback(ctx, charge, e.fallbackChain)
}`,
    },
    content: [
      'In high-growth African markets, payment gateway downtime is not an anomaly—it is a daily operating condition. Traditional payment orchestrators rely on crude round-robin strategies or post-facto retries, resulting in dropped checkout modals, irritated customers, and abandoned carts.',
      'To solve this at Quirk, we engineered an autonomous state machine in Go that performs continuous out-of-band health probing against all upstream gateways (Paystack, Flutterwave, Monnify, Interswitch, and M-Pesa). Every 1,500ms, our edge nodes measure TCP handshake latency, TLS negotiation times, and HTTP 5xx error distribution.',
      'When a gateway begins exhibiting packet queuing or bank switch degradation (>350ms p95 latency), Quirk’s router instantly downweights the provider’s health score. Any in-flight charge is automatically routed to the next optimal standby rail in under 180ms without closing the customer’s active checkout session.',
      'This deterministic failover architecture delivers a verified 99.99% autonomous uptime across Nigeria, Kenya, Ghana, and South Africa, recovering over ₦140M in previously lost transactions each month for our merchants.',
    ],
  },
  {
    slug: 'multi-currency-ledger-architecture',
    tag: 'Treasury',
    date: 'July 2026',
    title: 'Unified Multi-Currency Ledger Architecture for Scale',
    summary: 'Consolidating NGN, KES, GHS, and USD settlement balances across fragmented banking rails without double-spend anomalies.',
    author: 'Treasury Infrastructure Group',
    authorRole: 'Financial Ledger & Clearing Systems',
    readTime: '6 min read',
    codeSnippet: {
      lang: 'typescript',
      code: `// Multi-Currency Double-Entry Ledger Posting
interface LedgerTransaction {
  id: string;
  sourceAccount: string; // e.g. "acct_ngn_vault"
  destinationAccount: string; // e.g. "acct_merchant_settlement"
  amount: bigint;
  currency: 'NGN' | 'KES' | 'USD' | 'GHS';
  idempotencyKey: string;
}

export async function recordSettlement(tx: LedgerTransaction): Promise<LedgerReceipt> {
  return await db.transaction(async (trx) => {
    // Lock currency accounts in deterministic order to prevent deadlocks
    await trx.raw('SELECT * FROM accounts WHERE id IN (?, ?) FOR UPDATE', [
      tx.sourceAccount,
      tx.destinationAccount,
    ]);
    
    return await executeBalancedPosting(trx, tx);
  });
}`,
    },
    content: [
      'Cross-border digital commerce in Africa requires merchants to accept multiple local currencies: Nigerian Naira (NGN), Kenyan Shillings (KES), Ghanaian Cedis (GHS), and US Dollars (USD). However, reconciling transactions across distinct banking switches and mobile money networks usually involves disjointed CSV exports, manual spreadsheet tallying, and delayed settlements.',
      'Quirk introduces a unified double-entry cryptographic ledger that tracks every inward payment, fee deduction, gateway clearing schedule, and payout batch in real-time.',
      'Every ledger entry is immutable, timestamped, and tied to an idempotent transaction hash. Whether funds settle via Monnify Direct Debits or M-Pesa Express, the merchant’s balance updates instantly within their unified multi-currency treasury pot.',
      'With automated liquidity sweep rules, merchants can programmatically convert local currency balances or batch payouts directly to supplier accounts with zero reconciliation overhead.',
    ],
  },
  {
    slug: 'hardware-enclave-vaulting',
    tag: 'Security',
    date: 'July 2026',
    title: 'Hardware Enclave Key Vaulting for Multi-Rail SDKs',
    summary: 'Eliminating single-point provider vulnerabilities with zero-knowledge AES-256-GCM credential routing.',
    author: 'Security & Cryptography Research',
    authorRole: 'Platform Security Architecture',
    readTime: '5 min read',
    codeSnippet: {
      lang: 'typescript',
      code: `// Hardware Enclave Secret Decryption at Edge
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
    },
    content: [
      'When managing payment infrastructure across multiple third-party gateways, storing API secrets and private merchant credentials in traditional environment files or centralized databases introduces significant vulnerability vectors.',
      'Quirk implements a zero-trust Hardware Security Module (HSM) enclave vaulting system. Merchant provider keys (Paystack secret keys, Flutterwave hash tokens, M-Pesa B2C passkeys) are encrypted using client-specific AES-256-GCM keys managed inside isolated hardware enclaves.',
      'During transaction routing, decryption occurs strictly in-memory within the ephemeral execution thread of our secure routing worker, instantly sanitizing the credential payload after dispatch.',
      'This guarantees zero vendor lock-in: merchants retain full cryptographic ownership of their direct banking contracts and can migrate or rotate credentials at any time without downtime.',
    ],
  },
]
