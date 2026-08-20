import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSystemSettings } from '@/hooks/useSystemSettings'
import { Terminal, Lock, Server, ShieldCheck, Eye, EyeOff, Copy, Check, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
})

function Settings() {
  const {
    apiKey,
    generatingKey,
    keyCopied,
    setKeyCopied,
    showKey,
    setShowKey,
    provider,
    setProvider,
    secretKey,
    setSecretKey,
    showSecret,
    setShowSecret,
    savingProvider,
    handleGenerateKey,
    handleSaveProvider,
    apiKeys
  } = useSystemSettings()

  const copyVector = async () => {
    if (!apiKey?.key) return
    navigator.clipboard.writeText(apiKey.key)
    setKeyCopied(true)
    toast.success('API key copied to clipboard')
    setTimeout(() => setKeyCopied(false), 2000)
  }

  return (
    <div className='min-h-screen bg-[#F7F7F5] text-[#080808]'>
      <Header className='bg-[#FFFFFF]/95 border-b border-[#E5E5E5]'>
        <div className='flex items-center gap-3 font-["Satoshi"] font-semibold text-sm text-[#080808]'>
          <span>Settings</span>
        </div>

        <div className='flex items-center gap-3 ms-auto'>
          <div
            role='status'
            className='hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-mono text-[#080808]'
          >
            <span className='size-2 rounded-full bg-[#22C55E] animate-pulse' />
            <span className='text-[11px] font-medium'>All Rails Operational (99.98%)</span>
          </div>

          <ProfileDropdown />
        </div>
      </Header>

      <Main className='px-4 sm:px-8 py-8 max-w-7xl mx-auto space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]'>
          <div className='space-y-1'>
            <h1 className='font-["Satoshi"] text-2xl sm:text-3xl font-bold tracking-tight text-[#080808] [text-wrap:balance]'>
              Settings & Credentials
            </h1>
            <p className='text-xs sm:text-sm text-[#666666] [text-wrap:pretty]'>
              Manage your live API keys, provider webhook secrets, and AES-256 hardware enclave credentials.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          <div className='xl:col-span-2 space-y-6'>
            {/* API Keys Card */}
            <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
              <CardHeader className='p-5 border-b border-[#E5E5E5] bg-[#FAFAFA]'>
                <div className='flex items-center gap-2.5'>
                  <Terminal className='size-4 text-[#080808]' />
                  <CardTitle className='text-sm font-["Satoshi"] font-bold text-[#080808]'>API keys</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-5 pt-6 space-y-6'>
                <div className='p-3.5 rounded-xl bg-[#F7F7F5] border border-[#E5E5E5] text-xs text-[#666666] font-mono'>
                  API keys authorize your application to access the Quirk multi-rail infrastructure. 
                  Treat these as sensitive credentials: never commit them to public version control.
                </div>

                {apiKeys && apiKeys.length > 0 ? (
                  <div className='space-y-4'>
                    {apiKeys.slice(0, 1).map((k) => {
                      const isNewlyGenerated = apiKey?.id === k.id
                      return (
                        <div key={k.id} className='space-y-3 pt-2'>
                          <div className='flex justify-between items-center'>
                            <span className='text-[10px] font-semibold uppercase tracking-wider text-[#666666] font-mono'>
                              Active API key
                            </span>
                            {isNewlyGenerated && (
                              <div className='flex gap-3 text-xs font-mono font-medium'>
                                <button
                                  onClick={() => setShowKey(!showKey)}
                                  className='text-[#666666] hover:text-[#080808] flex items-center gap-1.5 transition-colors duration-150'
                                >
                                  {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                                  <span>{showKey ? 'Hide' : 'Reveal'}</span>
                                </button>
                                <button
                                  onClick={copyVector}
                                  className='text-[#666666] hover:text-[#080808] flex items-center gap-1.5 transition-colors duration-150'
                                >
                                  {keyCopied ? <Check size={13} className='text-[#22C55E]' /> : <Copy size={13} />}
                                  <span>{keyCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                          <div className='p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] font-mono text-xs tracking-wider break-all text-[#080808]'>
                            {isNewlyGenerated && showKey ? apiKey?.key : `${k.key_prefix}${'•'.repeat(36)}`}
                          </div>
                          <div className='text-[11px] text-[#666666] font-mono'>
                            Created: {new Date(k.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className='py-8 flex flex-col items-center justify-center border border-dashed border-[#E5E5E5] rounded-xl text-center p-6'>
                    <Lock className='size-8 text-[#999999] mb-3 opacity-60' />
                    <h4 className='text-sm font-semibold font-["Satoshi"] mb-1'>No active API keys</h4>
                    <p className='text-xs text-[#666666] max-w-sm'>Generate your primary server key to begin routing charges with the SDK.</p>
                  </div>
                )}

                <Button
                  onClick={handleGenerateKey}
                  disabled={generatingKey}
                  className='rounded-xl h-10 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-semibold text-xs transition-transform duration-150 active:scale-[0.98]'
                >
                  {apiKeys && apiKeys.length > 0 ? 'Rotate API key' : 'Generate API key'}
                </Button>
              </CardContent>
            </Card>

            {/* Provider Credentials Card */}
            <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
              <CardHeader className='p-5 border-b border-[#E5E5E5] bg-[#FAFAFA]'>
                <div className='flex items-center gap-2.5'>
                  <Server className='size-4 text-[#080808]' />
                  <CardTitle className='text-sm font-["Satoshi"] font-bold text-[#080808]'>Provider credentials</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-5 pt-6 space-y-6'>
                <form onSubmit={handleSaveProvider} className='space-y-6'>
                  <div className='space-y-3'>
                    <label className='text-[10px] uppercase font-semibold text-[#666666] font-mono tracking-wider'>Payment switch</label>
                    <div className='flex p-1 bg-[#EBEBEA] border border-[#E0E0DE] rounded-xl w-fit'>
                      {(['paystack', 'flutterwave'] as const).map((p) => (
                        <button
                          key={p}
                          type='button'
                          onClick={() => setProvider(p)}
                          className={cn(
                            'px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors duration-150',
                            provider === p ? 'bg-[#FFFFFF] text-[#080808] shadow-2xs' : 'text-[#666666] hover:text-[#080808]'
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className='space-y-2 max-w-md'>
                    <label htmlFor='sec-key' className='text-[10px] uppercase font-semibold text-[#666666] font-mono tracking-wider'>Secret key</label>
                    <div className='relative'>
                      <Input
                        id='sec-key'
                        type={showSecret ? 'text' : 'password'}
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder={provider === 'paystack' ? 'sk_live_...' : 'FLWSECK_TEST-...'}
                        className='font-mono text-xs pr-20 rounded-xl bg-[#FFFFFF] border-[#E5E5E5] text-[#080808] h-10'
                        required
                      />
                      <button
                        type='button'
                        onClick={() => setShowSecret(!showSecret)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono font-medium text-[#666666] hover:text-[#080808]'
                      >
                        {showSecret ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                  </div>

                  <Button
                    type='submit'
                    disabled={savingProvider || !secretKey}
                    className='rounded-xl h-10 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-semibold text-xs transition-transform duration-150 active:scale-[0.98]'
                  >
                    <ShieldCheck className='size-3.5 mr-2' />
                    <span>Save credentials</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Security Summary Card */}
          <div className='space-y-6'>
            <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
              <CardHeader className='p-5 border-b border-[#E5E5E5] bg-[#FAFAFA]'>
                <CardTitle className='text-sm font-["Satoshi"] font-bold text-[#080808]'>Security & encryption</CardTitle>
              </CardHeader>
              <CardContent className='p-5 text-xs text-[#666666] space-y-4'>
                <p className='leading-relaxed'>
                  All provider secrets and routing keys are hardware-isolated using <strong className='text-[#080808]'>AES-256-GCM</strong> with unique salt derivations per merchant entity.
                </p>
                <ul className='space-y-3 pt-3 border-t border-[#E5E5E5] text-[11px] font-mono'>
                  <li className='flex items-center gap-2'>
                    <span className='size-1.5 rounded-full bg-[#22C55E] shrink-0' />
                    <span>Revoking an API key instantly invalidates all downstream client calls.</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='size-1.5 rounded-full bg-[#22C55E] shrink-0' />
                    <span>Automated HMAC-SHA256 signature verification on all inbound webhooks.</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='size-1.5 rounded-full bg-[#22C55E] shrink-0' />
                    <span>Deterministic idempotency keys prevent duplicate rail execution.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </div>
  )
}
