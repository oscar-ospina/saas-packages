import {
  Building2Icon,
  CalendarCheckIcon,
  CalendarIcon,
  ChevronLeftIcon,
  CreditCardIcon,
  DownloadIcon,
  HomeIcon,
  LockIcon,
  SmartphoneIcon,
  SparklesIcon,
} from "lucide-react";
import { Button, Card, Checkbox, Field, Input, Label, RadioGroup, RadioGroupItem } from "@saas/ui";
import { useState } from "react";

import { COP, type Booking, type Cita, type Step } from "../data";

function Money({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={
        bold
          ? "flex justify-between pt-2.5 text-[17px] font-bold"
          : "flex justify-between py-0.5 text-sm text-text-secondary"
      }
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Summary({ cita, booking }: { cita: Cita; booking: Booking }) {
  const iva = Math.round(cita.price * 0.19);
  return (
    <Card className="sticky top-[88px] gap-0 p-[22px] shadow-card">
      <div className="mb-3.5 font-display text-xl font-semibold">Detalles de la compra</div>
      <div className="flex gap-3 border-b border-neutral-100 pb-3.5">
        <div className="flex size-[46px] flex-none items-center justify-center rounded-[10px] bg-[image:linear-gradient(135deg,var(--color-orange-300),var(--color-violet-400))]">
          <SparklesIcon className="size-[22px] fill-white text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold">{cita.name}</div>
          <div className="mt-0.5 text-[12.5px] text-text-secondary">
            {booking.modal === "virtual" ? "Virtual" : "Presencial"} · 60 min
          </div>
          {booking.date && (
            <div className="mt-0.5 flex items-center gap-1 text-[12.5px] text-text-secondary">
              <CalendarIcon className="size-[13px]" />
              {booking.date.getDate()} Feb 2025 · {booking.time}
            </div>
          )}
        </div>
      </div>
      <div className="border-b border-neutral-100 py-3">
        <Money label="Subtotal" value={COP(cita.price - iva)} />
        <Money label="IVA (19%)" value={COP(iva)} />
      </div>
      <Money label="Total" value={COP(cita.price)} bold />
    </Card>
  );
}

const PAY_METHODS = [
  { id: "card", label: "Tarjeta de crédito o débito", Icon: CreditCardIcon },
  { id: "pse", label: "PSE · Débito bancario", Icon: Building2Icon },
  { id: "nequi", label: "Nequi", Icon: SmartphoneIcon },
];

export function Pago({
  go,
  cita,
  booking,
}: {
  go: (s: Step) => void;
  cita: Cita;
  booking: Booking;
}) {
  const [pay, setPay] = useState("card");
  const [accept, setAccept] = useState(false);

  return (
    <div className="flex-1 fade-in">
      <div className="mx-auto max-w-[1200px] px-10 pb-12 pt-8">
        <Button variant="ghost" size="sm" className="mb-3" onClick={() => go("agenda")}>
          <ChevronLeftIcon />
          Volver
        </Button>
        <h1 className="mb-[22px] font-display text-[28px] font-semibold tracking-[-0.25px]">
          Completa los datos de tu cita
        </h1>

        <div className="grid grid-cols-[1fr_360px] items-start gap-6">
          <div className="flex flex-col gap-5">
            {/* contacto */}
            <Card className="gap-3.5 p-[22px] shadow-card">
              <div className="font-display text-lg font-semibold">Contacto</div>
              <div className="grid grid-cols-2 gap-3.5">
                <Field id="nombre" label="Nombre">
                  <Input placeholder="Tu nombre" />
                </Field>
                <Field id="apellido" label="Apellido">
                  <Input placeholder="Tu apellido" />
                </Field>
                <div className="col-span-2">
                  <Field id="email" label="Correo electrónico">
                    <Input type="email" placeholder="tucorreo@ejemplo.com" />
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field id="tel" label="Teléfono">
                    <Input type="tel" placeholder="+57 300 000 0000" />
                  </Field>
                </div>
              </div>
            </Card>
            {/* facturación */}
            <Card className="gap-3.5 p-[22px] shadow-card">
              <div className="font-display text-lg font-semibold">Datos de facturación</div>
              <div className="grid grid-cols-2 gap-3.5">
                <Field id="doc" label="Documento">
                  <Input placeholder="C.C. / NIT" />
                </Field>
                <Field id="city" label="Ciudad">
                  <Input placeholder="Medellín" />
                </Field>
                <div className="col-span-2">
                  <Field id="addr" label="Dirección">
                    <Input placeholder="Calle 00 # 00-00" />
                  </Field>
                </div>
              </div>
            </Card>
            {/* pago */}
            <Card className="gap-0 p-[22px] shadow-card">
              <div className="font-display text-lg font-semibold">Pago</div>
              <p className="mb-4 mt-1.5 text-[13.5px] text-text-secondary">
                Todas las transacciones son seguras y están encriptadas.
              </p>
              <RadioGroup
                value={pay}
                onValueChange={setPay}
                aria-label="Método de pago"
                className="gap-0 overflow-hidden rounded-lg border"
              >
                {PAY_METHODS.map(({ id, label, Icon }, i) => (
                  <label
                    key={id}
                    htmlFor={`pay-${id}`}
                    className={
                      "flex cursor-pointer items-center gap-2.5 px-4 py-[13px]" +
                      (i ? " border-t border-neutral-100" : "") +
                      (pay === id ? " bg-highlight" : " bg-card")
                    }
                  >
                    <RadioGroupItem value={id} id={`pay-${id}`} />
                    <Icon className="size-[18px] text-text-secondary" />
                    <span className="text-[14.5px] font-semibold">{label}</span>
                  </label>
                ))}
              </RadioGroup>
            </Card>
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="accept"
                checked={accept}
                onCheckedChange={(v) => setAccept(v === true)}
                className="mt-0.5"
              />
              <Label
                htmlFor="accept"
                className="text-[13.5px] font-normal leading-normal text-text-secondary"
              >
                Al continuar, confirmas que has leído y aceptas las Condiciones de Uso y el Aviso de
                Privacidad de Alta Vibración.
              </Label>
            </div>
          </div>

          <div>
            <Summary cita={cita} booking={booking} />
            <Button
              className="mt-4 w-full"
              size="lg"
              disabled={!accept}
              onClick={() => go("confirm")}
            >
              <LockIcon />
              Pagar {COP(cita.price)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Confirm({
  go,
  cita,
  booking,
}: {
  go: (s: Step) => void;
  cita: Cita;
  booking: Booking;
}) {
  const rows: [string, string][] = [
    ["Consulta", cita.name],
    ["Modalidad", booking.modal === "virtual" ? "Virtual" : "Presencial"],
    [
      "Fecha",
      (booking.date ? booking.date.getDate() : "—") + " Feb 2025 · " + (booking.time ?? ""),
    ],
    ["Total", COP(cita.price)],
  ];
  return (
    <div className="flex-1 fade-in">
      <div className="mx-auto max-w-[620px] px-10 py-14">
        <Card className="gap-0 p-9 text-center shadow-card">
          <div className="mx-auto mb-[18px] flex size-[72px] items-center justify-center rounded-full bg-semantic-green-light">
            <CalendarCheckIcon className="size-[34px] text-semantic-green-base" />
          </div>
          <h1 className="mb-2 font-display text-[28px] font-semibold tracking-[-0.25px]">
            ¡Gracias por tu compra!
          </h1>
          <p className="mb-6 text-[15px] leading-relaxed text-text-secondary">
            Hemos enviado los detalles de tu cita a tu correo. Recibirás un recordatorio antes de tu
            sesión con Liliana.
          </p>
          <div className="mb-6 rounded-xl border p-4 text-left">
            <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[.05em] text-text-tertiary">
              Detalles de la cita
            </div>
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between py-[5px] text-sm">
                <span className="text-text-secondary">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline">
              <DownloadIcon />
              Descargar
            </Button>
            <Button onClick={() => go("home")}>
              <HomeIcon />
              Volver al inicio
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
