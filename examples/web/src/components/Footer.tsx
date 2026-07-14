import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-100 bg-card px-10 py-7">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
        <img className="h-[30px]" src="/brand/logo-horizontal.svg" alt="Alta Vibración" />
        <div className="flex gap-6 text-[13px] text-text-secondary">
          <a href="#contacto">Contacto</a>
          <a href="#terminos">Términos de Uso</a>
          <a href="#privacidad">Política de Privacidad</a>
        </div>
        <div className="flex gap-3 text-text-secondary">
          <MessageCircleIcon className="size-5" />
          <MailIcon className="size-5" />
          <PhoneIcon className="size-5" />
        </div>
      </div>
    </footer>
  );
}
