import { useState } from "react";

import { TopBar } from "./components/TopBar";
import { Footer } from "./components/Footer";
import { Home } from "./screens/Home";
import { Agenda } from "./screens/Agenda";
import { Confirm, Pago } from "./screens/Pago";
import { CITAS, type Booking, type Cita, type Step } from "./data";

export function App() {
  const [step, setStep] = useState<Step>("home");
  const [cita, setCita] = useState<Cita>(CITAS[0]!);
  const [booking, setBooking] = useState<Booking>({ modal: "presencial", date: null, time: null });

  const go = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar step={step} go={go} />
      {step === "home" && <Home go={go} pick={setCita} />}
      {step === "agenda" && (
        <Agenda go={go} cita={cita} setCita={setCita} booking={booking} setBooking={setBooking} />
      )}
      {step === "pago" && <Pago go={go} cita={cita} booking={booking} />}
      {step === "confirm" && <Confirm go={go} cita={cita} booking={booking} />}
      <Footer />
    </div>
  );
}
