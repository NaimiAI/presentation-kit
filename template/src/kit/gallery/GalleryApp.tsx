// Dev-only component gallery: preview every kit component in every theme
// before composing slides. Open with `npm run dev` → http://localhost:5173/#gallery
// Excluded from the production bundle (see App.tsx).
import { useState } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle, Calculator, Clock3, Rocket, ShieldCheck, TrendingUp } from 'lucide-react'
import { Badge, BulletItem, Card, GradientText, Kicker, Orbs, RangeField, StatCard } from '../components'

const THEMES = [
  { id: 'naimi-light', label: 'Naimi light', hint: "the product's native style" },
  { id: 'naimi-dark', label: 'Naimi dark', hint: 'dark studio theme' },
  { id: 'editorial', label: 'Editorial', hint: 'warm "paper" look, serif' },
] as const

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-ink mb-1">{title}</h2>
      {note && <p className="text-sm text-ink-faint mb-4">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function GalleryApp() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme ?? 'naimi-light')
  const [sliderValue, setSliderValue] = useState(12000)

  const applyTheme = (id: string) => {
    document.documentElement.dataset.theme = id
    setTheme(id)
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 border-b border-edge bg-surface/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold text-ink">Naimi presentation kit — gallery</p>
            <p className="text-xs text-ink-faint">
              Components and themes. The presentation theme is set via the data-theme attribute in index.html.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {THEMES.map((item) => (
              <button
                key={item.id}
                onClick={() => applyTheme(item.id)}
                title={item.hint}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  theme === item.id
                    ? 'bg-accent-soft border-accent-edge text-accent-ink'
                    : 'bg-card border-edge text-ink-soft hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="#"
              className="ml-2 px-3 py-1.5 rounded-full text-sm font-medium border border-edge bg-card text-ink-soft hover:text-ink"
            >
              ← back to presentation
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <Section title="Typography" note="font-display for headings (serif in editorial), .gradient-text for emphasis">
          <div className="relative rounded-2xl border border-edge bg-card p-8 overflow-hidden">
            <Orbs />
            <div className="relative z-10">
              <h1 className="font-display text-5xl font-bold text-ink leading-tight">
                A solution for <GradientText>Acme Retail</GradientText>
              </h1>
              <p className="mt-3 text-xl text-ink-soft">Subheading: text-ink-soft, regular text.</p>
              <p className="mt-1 text-sm text-ink-faint">Tertiary text: text-ink-faint — captions and footnotes.</p>
            </div>
          </div>
        </Section>

        <Section title="Badge and Kicker" note="slide badges and section labels">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge icon={Calculator}>Interactive calculation</Badge>
            <Badge icon={TrendingUp} tone="positive">60–88% automation</Badge>
            <Badge icon={ShieldCheck} tone="neutral" size="sm">No loss in quality</Badge>
          </div>
          <div className="space-y-2">
            <Kicker>The solution</Kicker>
            <Kicker tone="positive">What the numbers say</Kicker>
            <Kicker tone="critical">The problem</Kicker>
          </div>
        </Section>

        <Section title="Card" note="content cards: default / accent / positive / critical">
          <div className="grid gap-4 md:grid-cols-2">
            <Card icon={Clock3} title="Slow responses">
              <p>Customers write 24/7, but the team replies during business hours.</p>
              <ul>
                <li>• Inquiries peak in the evening</li>
                <li>• Hot leads go cold</li>
              </ul>
            </Card>
            <Card icon={Rocket} title="Accent card" tone="accent">
              <p>For key points and highlighted blocks.</p>
            </Card>
            <Card icon={TrendingUp} title="Positive" tone="positive">
              <p>Results, benefits, forecasts.</p>
            </Card>
            <Card icon={AlertTriangle} title="Critical" tone="critical">
              <p>Risks and problems.</p>
            </Card>
          </div>
        </Section>

        <Section title="StatCard" note="big numbers for metrics and money">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Extra revenue per month" value="+$14,400" sub="$172,800 per year" accent />
            <StatCard label="Current revenue / mo" value="$57,600" />
            <StatCard label="Forecast / mo" value="$72,000" />
          </div>
        </Section>

        <Section title="RangeField" note="slider + number; in slides, bind it to useDemoField — values are saved into the presentation">
          <div className="rounded-2xl border border-edge bg-card p-6 max-w-xl space-y-6">
            <RangeField
              label="Monthly visitors"
              value={sliderValue}
              min={0}
              max={100000}
              step={500}
              displayValue={new Intl.NumberFormat('en-US').format(sliderValue)}
              onChange={setSliderValue}
            />
            <RangeField
              label="Conversion uplift, %"
              value={25}
              min={0}
              max={100}
              step={1}
              suffix="%"
              displayValue="+25 %"
              onChange={() => {}}
              highlight
            />
          </div>
        </Section>

        <Section title="BulletItem" note="check items, optionally with a value on the right">
          <div className="rounded-2xl border border-edge bg-card p-6 max-w-xl grid gap-3">
            <BulletItem>Integration in 2 weeks</BulletItem>
            <BulletItem value="24,000">Monthly visitors</BulletItem>
            <BulletItem value="+25%">Conversion uplift</BulletItem>
          </div>
        </Section>
      </main>
    </div>
  )
}
