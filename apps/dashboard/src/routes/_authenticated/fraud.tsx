import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFraudProtection } from '@/hooks/useFraudProtection'
import { fraudRuleTypes } from '@/data/mockData'
import { formatDate } from '@/lib/formatters'
import { ShieldCheck, Target, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/fraud')({
  component: Fraud,
})

function Fraud() {
  const { events, ruleForm, setRuleForm, handleSaveRule, saving } = useFraudProtection()

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center gap-3'>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#101010] border border-[#222222] text-xs font-['JetBrains_Mono']">
            <span className="size-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-[#A9A9A9]">All Rails Operational</span>
          </div>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="bg-[#000000] text-[#FFFFFF]">
        <div className='mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight font-["Satoshi"] text-[#FFFFFF]'>Fraud Protection Matrix</h1>
          <p className='text-xs sm:text-sm text-[#A9A9A9] mt-1'>Configure risk-scoring triggers, velocity limits, and inspect automated mitigation logs.</p>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
            <div className='xl:col-span-1 space-y-6'>
                <Card className="bg-[#101010] border-[#222222] rounded-2xl shadow-sm">
                    <CardHeader className='pb-4 border-b border-[#222222] bg-[#141414]'>
                        <div className="flex items-center gap-3">
                            <Target className="size-4 text-[#FFFFFF]" />
                            <CardTitle className="text-sm font-['Satoshi'] font-bold text-[#FFFFFF]">Risk Detection Rules</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <form onSubmit={handleSaveRule} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-semibold text-[#A9A9A9] font-['JetBrains_Mono'] tracking-wider">Rule Type</label>
                                <div className="space-y-2">
                                    {fraudRuleTypes.map((t) => {
                                        const Icon = t.icon;
                                        const isSelected = ruleForm.rule_type === t.value;
                                        return (
                                            <button
                                                key={t.value}
                                                type="button"
                                                onClick={() => setRuleForm(prev => ({ ...prev, rule_type: t.value }))}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                                                    isSelected ? "border-[#FFFFFF] bg-[#161616] ring-1 ring-[#FFFFFF]/20" : "border-[#222222] hover:bg-[#141414]"
                                                )}
                                            >
                                                <div className={cn("p-2 rounded-lg", isSelected ? "bg-[#222222] text-[#FFFFFF]" : "bg-[#0A0A0A] text-[#A9A9A9]")}>
                                                    <Icon className="size-4" />
                                                </div>
                                                <div>
                                                    <p className={cn("text-xs font-semibold", isSelected ? "text-[#FFFFFF]" : "text-[#A9A9A9]")}>{t.label}</p>
                                                    <p className="text-[10px] text-[#A9A9A9]/70 font-['JetBrains_Mono']">{t.desc}</p>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-semibold text-[#A9A9A9] font-['JetBrains_Mono'] tracking-wider">Threshold Limit</label>
                                <Input 
                                    type="number" 
                                    min="1" 
                                    required 
                                    value={ruleForm.threshold} 
                                    onChange={(e) => setRuleForm(prev => ({ ...prev, threshold: Number(e.target.value) }))}
                                    className="rounded-xl bg-[#0A0A0A] border-[#222222] text-xs font-['JetBrains_Mono'] text-[#FFFFFF]"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-semibold text-[#A9A9A9] font-['JetBrains_Mono'] tracking-wider">Mitigation Action</label>
                                <div className="flex bg-[#0A0A0A] p-1 rounded-xl border border-[#222222]">
                                    {['flag', 'block'].map(action => (
                                        <button
                                            key={action}
                                            type="button"
                                            onClick={() => setRuleForm(prev => ({ ...prev, action: action as 'flag' | 'block' }))}
                                            className={cn(
                                                "flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase flex justify-center items-center font-['JetBrains_Mono'] transition-colors",
                                                ruleForm.action === action ? (action === 'block' ? 'bg-rose-950/40 border border-rose-900/40 text-rose-400' : 'bg-amber-950/40 border border-amber-900/40 text-amber-400') : 'text-[#A9A9A9] hover:text-[#FFFFFF]'
                                            )}
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button disabled={saving} className="w-full mt-4 rounded-full bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-xs transition-all active:scale-[0.97]">
                                Save Rule
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className='xl:col-span-2'>
                <Card className="h-full bg-[#101010] border-[#222222] rounded-2xl shadow-sm">
                    <CardHeader className='pb-4 border-b border-[#222222] bg-[#141414]'>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ShieldAlert className="size-4 text-[#FFFFFF]" />
                              <CardTitle className="text-sm font-['Satoshi'] font-bold text-[#FFFFFF]">Flagged Risk Events</CardTitle>
                            </div>
                            <span className="text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9] bg-[#161616] px-2.5 py-0.5 rounded-full border border-[#222222]">
                              Real-Time Protection
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0 px-0">
                         <table className="w-full text-xs font-['Inter'] mt-0">
                            <thead>
                                <tr className="border-b border-[#222222] bg-[#121212] text-[#A9A9A9] font-['JetBrains_Mono']">
                                    <th className="h-9 px-6 text-left align-middle font-medium uppercase text-[10px] tracking-wider">Identifier</th>
                                    <th className="h-9 px-6 text-left align-middle font-medium uppercase text-[10px] tracking-wider">Trigger Rule</th>
                                    <th className="h-9 px-6 text-left align-middle font-medium uppercase text-[10px] tracking-wider">Action</th>
                                    <th className="h-9 px-6 text-left align-middle font-medium uppercase text-[10px] tracking-wider">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#222222]">
                                {events.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center">
                                            <div className="mx-auto size-10 bg-[#161616] text-[#FFFFFF] rounded-full flex items-center justify-center mb-3 border border-[#222222]">
                                                <ShieldCheck className="size-5 text-[#22C55E]" />
                                            </div>
                                            <p className="font-semibold text-sm text-[#FFFFFF] font-['Satoshi']">No High Risk Anomalies Detected</p>
                                            <p className="text-xs text-[#A9A9A9] mt-1">All payment rail transactions conform to safety thresholds.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    events.map((ev) => (
                                        <tr key={ev.id} className="border-b border-[#222222] transition-colors hover:bg-[#161616]/50">
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <div className={`size-1.5 rounded-full ${ev.action_taken === 'block' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                                    <span className="font-['JetBrains_Mono'] text-xs text-[#FFFFFF]">{ev.transaction_id ? ev.transaction_id.slice(0,14) : 'SYSTEM_TRG'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                 <span className="bg-[#161616] border border-[#222222] px-2 py-0.5 rounded text-[10px] font-semibold uppercase font-['JetBrains_Mono'] text-[#FFFFFF]">{ev.rule_type}</span>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-['JetBrains_Mono'] ${ev.action_taken === 'block' ? 'bg-rose-950/40 border border-rose-900/40 text-rose-400' : 'bg-amber-950/40 border border-amber-900/40 text-amber-400'}`}>
                                                    {ev.action_taken}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-[#A9A9A9] text-xs font-['JetBrains_Mono']">
                                                {formatDate(ev.created_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </Main>
    </>
  )
}
