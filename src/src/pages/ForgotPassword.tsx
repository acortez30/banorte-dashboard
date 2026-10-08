import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo_banorte_long.webp";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f6f7] px-5 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <img src={logo} alt="Banorte" className="h-10 w-auto" />
        {sent ? (
          <div className="mt-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><MailCheck size={21} /></div>
            <h1 className="mt-4 font-poppins text-2xl font-bold">Solicitud registrada</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">En este mockup no se envía correo real. El flujo queda listo para conectar con backend posteriormente.</p>
            <Link to="/login" className="btn-primary mt-6 inline-flex"><ArrowLeft size={16} /> Volver al login</Link>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
            <div><h1 className="font-poppins text-2xl font-bold">Recuperar contraseña</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Ingresa tu correo para simular la solicitud de recuperación.</p></div>
            <label className="form-field"><span>Email</span><input className="form-input h-11" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="usuario@empresa.com" required /></label>
            <button className="btn-primary h-11 w-full justify-center">Continuar</button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Regresar</Link>
          </form>
        )}
      </section>
    </main>
  );
}
