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
import { useFraudProtection } from '@/hooks/useFraudProtection'
import { fraudRuleTypes } from '@/data/mockData'
import { formatDate } from '@/lib/formatters'
import { ShieldCheck, Target, ShieldAlert, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/fraud')({
  component: Fraud,
})

function Fraud() {
  const { events, ruleForm, setRuleForm, handleSaveRule, saving } = useFraudProtection()

  return (
    <div className='min-h-screen bg-[#F7F7F5] text-[#080808]'>
      <Header className='bg-[#FFFFFF]/95 border-b border-[#E5E5E5]'>
        <div className='flex items-center gap-3 font-["Satoshi"] font-semibold text-sm text-[#080808]'>
          <span>Fraud matrix</span>
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
              Fraud Protection Matrix
            </h1>
            <p className='text-xs sm:text-sm text-[#666666] [text-wrap:pretty]'>
              Configure risk scoring rules, velocity limits, and inspect automated transaction mitigation telemetry.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          {/* Rule Configuration Panel */}
          <div className='xl:col-span-1 space-y-6'>
            <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
              <CardHeader className='p-5 border-b border-[#E5E5E5] bg-[#FAFAFA]'>
                <div className='flex items-center gap-2.5'>
                  <Target className='size-4 text-[#080808]' />
                  <CardTitle className='text-sm font-["Satoshi"] font-bold text-[#080808]'>Risk detection rules</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-5 pt-6 space-y-6'>
                <form onSubmit={handleSaveRule} className='space-y-6'>
                  <div className='space-y-3'>
                    <label className='text-[10px] uppercase font-semibold text-[#666666] font-mono tracking-wider'>Rule type</label>
                    <div className='space-y-2'>
                      {fraudRuleTypes.map((t) => {
                        const isSelected = ruleForm.rule_type === t.value
                        return (
                          <div
                            key={t.value}
                            onClick={() => setRuleForm(prev => ({ ...prev, rule_type: t.value }))}
                            className={cn(
                              'p-3.5 rounded-xl border transition-colors duration-150 cursor-pointer flex items-center justify-between',
                              isSelected
                                ? 'border-[#080808] bg-[#F7F7F5]'
                                : 'border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#FAFAFA]'
                            )}
                          >
                            <div>
                              <p className='text-xs font-semibold text-[#080808]'>{t.label}</p>
                              <p className='text-[11px] text-[#666666] mt-0.5'>{t.description}</p>
                            </div>
                            {isSelected && <Check className='size-4 text-[#080808]' />}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor='action' className='text-[10px] uppercase font-semibold text-[#666666] font-mono tracking-wider'>Enforcement action</label>
                    <select
                      id='action'
                      value={ruleForm.action}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, action: e.target.value as any }))}
                      className='w-full rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] text-xs text-[#080808] p-3 focus:outline-none focus:ring-1 focus:ring-[#080808]'
                    >
                      <option value='block'>Block immediately</option>
                      <option value='flag'>Flag for review</option>
                      <option value='challenge_3ds'>Force 3DS authorization challenge</option>
                    </select>
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor='threshold' className='text-[10px] uppercase font-semibold text-[#666666] font-mono tracking-wider'>Threshold parameter</label>
                    <Input
                      id='threshold'
                      type='number'
                      value={ruleForm.threshold}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, threshold: Number(e.target.value) }))}
                      className='rounded-xl bg-[#FFFFFF] border-[#E5E5E5] text-xs text-[#080808] font-mono font-bold'
                    />
                  </div>

                  <Button
                    type='submit'
                    disabled={saving}
                    className='w-full rounded-xl h-10 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-semibold text-xs transition-transform duration-150 active:scale-[0.98]'
                  >
                    {saving ? 'Updating matrix...' : 'Save detection rule'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Real-Time Fraud Telemetry Logs */}
          <div className='xl:col-span-2 space-y-6'>
            <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden'>
              <CardHeader className='p-5 border-b border-[#E5E5E5] bg-[#FAFAFA] flex flex-row items-center justify-between'>
                <div className='flex items-center gap-2.5'>
                  <ShieldAlert className='size-4 text-[#080808]' />
                  <div>
                    <CardTitle className='text-sm font-["Satoshi"] font-bold text-[#080808]'>Automated mitigation feed</CardTitle>
                    <CardDescription className='text-xs text-[#666666]'>Live telemetry on intercepted transactions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-0'>
                {events.length === 0 ? (
                  <div className='p-12 text-center text-[#666666]'>
                    <ShieldCheck className='mx-auto size-8 mb-2 text-[#22C55E]' />
                    <p className='text-sm font-semibold text-[#080808] font-["Satoshi"]'>Zero critical anomalies detected</p>
                    <p className='text-xs mt-1'>All transactions are currently within normal baseline velocity thresholds.</p>
                  </div>
                ) : (
                  <div className='divide-y divide-[#E5E5E5]'>
                    {events.map((evt) => (
                      <div key={evt.id} className='p-4 sm:p-5 flex items-start justify-between hover:bg-[#F7F7F5] transition-colors duration-100'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2'>
                            <span className='font-mono font-semibold text-xs text-[#080808]'>{evt.event_type}</span>
                            <span className='px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-200'>
                              {evt.action_taken}
                            </span>
                          </div>
                          <p className='text-xs text-[#666666] font-mono break-all'>{evt.reason}</p>
                          <p className='text-[10px] text-[#999999] font-mono pt-1'>Ref: {evt.transaction_id || evt.id}</p>
                        </div>
                        <span className='text-[11px] text-[#666666] font-mono whitespace-nowrap'>{formatDate(evt.created_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </div>
  )
}
