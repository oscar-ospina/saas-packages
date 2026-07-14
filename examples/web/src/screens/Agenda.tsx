import { ArrowRightIcon, BadgeCheckIcon, MapPinIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Calendar,
  Card,
  Chip,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@saas/ui";
import { useState } from "react";

import {
  AVAILABLE_DATES,
  AVAILABLE_DAYS,
  BOOKING_MONTH,
  CITAS,
  COP,
  TIMES,
  type Booking,
  type Cita,
  type Step,
} from "../data";

export function Agenda({
  go,
  cita,
  setCita,
  booking,
  setBooking,
}: {
  go: (s: Step) => void;
  cita: Cita;
  setCita: (c: Cita) => void;
  booking: Booking;
  setBooking: (b: Booking) => void;
}) {
  const [modal, setModal] = useState<Booking["modal"]>(booking.modal || "presencial");
  const [date, setDate] = useState<Date | undefined>(booking.date ?? undefined);
  const [time, setTime] = useState<string | null>(booking.time);
  const ready = Boolean(date && time);
  const proceed = () => {
    setBooking({ modal, date: date ?? null, time });
    go("pago");
  };

  return (
    <div className="flex-1 fade-in">
      <div className="mx-auto max-w-[1200px] px-10 pb-12 pt-8">
        <h1 className="mb-1 font-display text-[30px] font-semibold tracking-[-0.25px]">
          Agenda tu sesión con Liliana Tobón
        </h1>
        <p className="mb-6 text-text-secondary">Elige modalidad, fecha y hora para tu consulta.</p>

        <div className="grid grid-cols-[300px_1fr_220px] items-start gap-5">
          {/* rail */}
          <Card className="gap-4 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarImage src="/brand/fotolili.webp" className="object-cover object-top" />
                <AvatarFallback className="bg-violet-100 font-semibold text-violet-700">
                  LT
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold">Liliana Tobón</div>
                <div className="flex items-center gap-1 text-[12.5px] text-text-secondary">
                  <MapPinIcon className="size-[13px]" />
                  Numeróloga · Colombia
                </div>
              </div>
            </div>
            <Badge className="w-fit bg-semantic-green-light text-semantic-green-base">
              <BadgeCheckIcon />
              +50 sesiones
            </Badge>
            <div className="rounded-xl border p-3.5">
              <div className="mb-2 text-xs font-bold uppercase tracking-[.05em] text-violet-700">
                Consulta
              </div>
              <Select
                value={String(cita.id)}
                onValueChange={(v) => {
                  const next = CITAS.find((c) => c.id === Number(v));
                  if (next) setCita(next);
                }}
              >
                <SelectTrigger className="w-full font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITAS.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-2.5 text-[12.5px] leading-normal text-text-secondary">{cita.desc}</p>
            </div>
            <div>
              <div className="mb-2 text-[13px] font-bold">Modalidad de la sesión</div>
              <RadioGroup
                value={modal}
                onValueChange={(v) => setModal(v as Booking["modal"])}
                aria-label="Modalidad de la sesión"
              >
                <div className="flex items-center gap-2.5">
                  <RadioGroupItem value="presencial" id="mod-presencial" />
                  <Label htmlFor="mod-presencial" className="text-base font-normal">
                    Presencial
                  </Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <RadioGroupItem value="virtual" id="mod-virtual" />
                  <Label htmlFor="mod-virtual" className="text-base font-normal">
                    Virtual
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </Card>

          {/* calendar */}
          <Card className="items-center gap-3.5 p-6 shadow-card">
            <div className="w-full text-sm font-bold">Selecciona la fecha</div>
            <Calendar
              mode="single"
              month={BOOKING_MONTH}
              selected={date}
              onSelect={setDate}
              disabled={(d) =>
                d.getMonth() !== 1 ||
                d.getFullYear() !== 2025 ||
                !AVAILABLE_DAYS.includes(d.getDate())
              }
              modifiers={{ available: AVAILABLE_DATES }}
              className="border-none p-0 shadow-none"
            />
          </Card>

          {/* times */}
          <Card className="gap-3.5 p-5 shadow-card">
            <div className="text-sm font-bold">Selecciona la hora</div>
            <div className="flex flex-col gap-2">
              {TIMES.map((t) => (
                <Chip
                  key={t}
                  className="w-full"
                  selected={time === t}
                  disabled={!date}
                  onClick={() => setTime(t)}
                >
                  {t}
                </Chip>
              ))}
            </div>
          </Card>
        </div>

        {/* footer bar */}
        <Card className="mt-5 flex-row items-center justify-between px-6 py-4 shadow-card">
          <div>
            <div className="text-xs font-bold uppercase tracking-[.05em] text-text-tertiary">
              Precio
            </div>
            <div className="font-display text-[26px] font-semibold">{COP(cita.price)}</div>
          </div>
          <Button
            disabled={!ready}
            onClick={proceed}
            title={ready ? undefined : "Elige fecha y hora"}
          >
            Siguiente
            <ArrowRightIcon />
          </Button>
        </Card>
      </div>
    </div>
  );
}
