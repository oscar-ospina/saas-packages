import {
  BadgeCheckIcon,
  CalendarIcon,
  MessageCircleIcon,
  PlayIcon,
  SparklesIcon,
} from "lucide-react";
import { Badge, Button, Card } from "@saas/ui";

import { CITAS, COP, type Cita, type Step } from "../data";

// The cosmic hero photo (brand/assets/hero-bg-home.jpg) is pending manual copy
// (see public/brand/README.md). The gradient underlay carries the dark-hero
// look until the file lands at /brand/hero-bg-home.jpg — then it just appears.
function Hero({ go }: { go: (s: Step) => void }) {
  return (
    <section className="relative overflow-hidden bg-[#22252f]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55 [background-image:radial-gradient(ellipse_at_70%_20%,rgba(127,90,248,.35),transparent_55%),radial-gradient(ellipse_at_85%_80%,rgba(240,96,31,.4),transparent_50%),url('/brand/hero-bg-home.jpg')]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[image:linear-gradient(90deg,#1b1d26_38%,rgba(27,29,38,.25)_100%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px] px-10 py-[92px]">
        <div className="max-w-[540px]">
          <h1 className="font-display text-[52px] font-bold leading-[1.05] tracking-[-0.25px] text-white">
            Conecta con tu esencia a través de los números
          </h1>
          <p className="mb-[30px] mt-5 text-lg leading-normal text-text-contrast-primary/80">
            Cada número tiene una vibración única que habla de ti. Aprende a escucharlos y
            desbloquea respuestas sobre tu vida, tu alma y tu propósito.
          </p>
          <Button size="lg" onClick={() => go("agenda")}>
            <CalendarIcon />
            Agenda tu cita
          </Button>
        </div>
      </div>
      <button
        type="button"
        title="WhatsApp"
        className="absolute bottom-6 right-7 flex size-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-pop"
      >
        <MessageCircleIcon className="size-[26px]" />
      </button>
    </section>
  );
}

function WhySection() {
  return (
    <section className="mx-auto max-w-[1200px] px-10 py-16">
      <Card className="grid grid-cols-[260px_1fr] items-center gap-9 rounded-3xl p-10 shadow-card">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[image:radial-gradient(ellipse_at_30%_20%,rgba(127,90,248,.5),transparent_60%),linear-gradient(160deg,#22252f,#431b97)] shadow-card">
          <span className="font-display text-[64px] font-bold text-white/90 [text-shadow:0_2px_16px_rgba(0,0,0,.5)]">
            7
          </span>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.06em] text-orange-600">
            <SparklesIcon className="size-[15px]" />
            No es casualidad. Es vibración.
          </span>
          <h2 className="mb-3.5 mt-3 font-display text-4xl font-semibold tracking-[-0.25px]">
            ¿Por qué Numerología?
          </h2>
          <p className="max-w-[560px] text-[17px] leading-relaxed text-text-secondary">
            Todo en este mundo vibra: tú, yo, los lugares, las palabras… y sí, los números también.
            Cuando aprendes a leer esa vibración, dejas de dudar de ti y empiezas a entender tu
            propósito.
          </p>
        </div>
      </Card>
    </section>
  );
}

const ABOUT_BLOCKS = [
  {
    icon: "🔍",
    t: "Los números",
    d: "Cada número en mi vida hablaba de mi fuerza y mi propósito. Me ayudó a dejar de dudar de mí, a entender que no estaba rota ni sola.",
  },
  {
    icon: "✨",
    t: "Todo tiene sentido",
    d: "A todos nos pasa lo mismo: repetimos patrones sin darnos cuenta. Pero cuando entiendes tu numerología, todo empieza a tener sentido.",
  },
];

function AboutSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-10 pb-14 pt-4 text-center">
      <h2 className="mb-2 font-display text-[32px] font-semibold tracking-[-0.25px]">
        ¿Quién es Liliana Tobón?
      </h2>
      <Badge className="bg-semantic-green-light text-semantic-green-base">
        <BadgeCheckIcon />
        +50 sesiones en Alta Vibración
      </Badge>
      <div className="mt-8 grid grid-cols-[360px_1fr] items-center gap-10 text-left">
        {/* lili-home-1.png pending (public/brand/README.md) — warm gradient placeholder */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-cover bg-center shadow-card [background-image:linear-gradient(150deg,rgba(248,173,121,.9),rgba(127,90,248,.55)),url('/brand/lili-home-1.png')]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-white/85 shadow-pop">
              <PlayIcon className="size-6 fill-selected text-selected" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[22px]">
          {ABOUT_BLOCKS.map((b) => (
            <div key={b.t}>
              <h3 className="mb-1.5 font-display text-[22px] font-semibold">
                <span className="mr-2">{b.icon}</span>
                {b.t}
              </h3>
              <p className="leading-relaxed text-text-secondary">{b.d}</p>
            </div>
          ))}
          <p className="text-[17px] italic text-link">✨ No es casualidad. Es vibración. ✨</p>
        </div>
      </div>
    </section>
  );
}

function Consultations({ go, pick }: { go: (s: Step) => void; pick: (c: Cita) => void }) {
  return (
    <section className="border-t border-neutral-100 bg-card">
      <div className="mx-auto max-w-[1200px] px-10 py-14">
        <h2 className="mb-1.5 font-display text-[30px] font-semibold tracking-[-0.25px]">
          Aplicaciones Prácticas de la Numerología Online
        </h2>
        <p className="mb-6 text-text-secondary">
          Elige la consulta que resuena contigo. Presencial o virtual.
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[18px]">
          {CITAS.map((c) => (
            <Card key={c.id} className="gap-2.5 p-5 shadow-card">
              <Badge className="w-fit bg-violet-100 text-violet-700">
                <SparklesIcon className="fill-current" />
                Presencial / Virtual
              </Badge>
              <div>
                <div className="font-display text-[19px] font-semibold leading-tight">{c.name}</div>
                <div className="mt-1 text-xs font-semibold text-violet-700">{c.tag}</div>
              </div>
              <p className="flex-1 text-[13.5px] leading-normal text-text-secondary">{c.desc}</p>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5">
                <span className="text-[17px] font-semibold">{COP(c.price)}</span>
                <Button
                  size="sm"
                  onClick={() => {
                    pick(c);
                    go("agenda");
                  }}
                >
                  <CalendarIcon />
                  Agendar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Home({ go, pick }: { go: (s: Step) => void; pick: (c: Cita) => void }) {
  return (
    <div className="flex-1 fade-in">
      <Hero go={go} />
      <WhySection />
      <AboutSection />
      <Consultations go={go} pick={pick} />
    </div>
  );
}
