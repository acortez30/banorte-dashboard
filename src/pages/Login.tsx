import {
  useState,
  type FormEvent,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "sonner";

import logo from "@/assets/logo_banorte_long.webp";

import Button from "@/components/common/Button";

import {
  useAuth,
} from "@/contexts/AuthContext";


export default function Login() {
  const {
    user,
    signIn,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);


  /* =======================================================
     AUTHENTICATED
     ======================================================= */

  if (user) {
    return (
      <Navigate
        to={
          user.role === "SUPER_ADMIN"
            ? "/lockers"
            : "/employees"
        }
        replace
      />
    );
  }


  /* =======================================================
     SUBMIT
     ======================================================= */

  const submit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (
      !email.trim() ||
      !password
    ) {
      return;
    }

    setLoading(true);

    const result =
      await signIn(
        email.trim(),
        password,
      );

    setLoading(false);

    if (
      "error" in result
    ) {
      toast.error(
        result.error,
      );

      return;
    }

    navigate(
      result.user.role ===
        "SUPER_ADMIN"
        ? "/lockers"
        : "/employees",
      {
        replace: true,
      },
    );
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#f6f6f7] lg:grid lg:grid-cols-2">
      {/* ===================================================
          BRAND
          =================================================== */}
      <section className="hidden min-h-screen bg-sidebar-gradient p-12 lg:flex lg:flex-col lg:justify-between">
        <img
          src={logo}
          alt="Banorte"
          className="h-10 w-auto self-start brightness-0 invert"
        />

        <div />

        <p className="text-xs text-white/55">
          Powered by Vivipost
        </p>
      </section>


      {/* ===================================================
          LOGIN
          =================================================== */}
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          {/* MOBILE LOGO */}
          <img
            src={logo}
            alt="Banorte"
            className="mx-auto mb-10 h-11 w-auto lg:hidden"
          />


          {/* HEADER */}
          <header>
            <h1 className="font-poppins text-3xl font-bold tracking-tight text-foreground">
              Bienvenido
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa a tu cuenta para continuar.
            </p>
          </header>


          {/* FORM */}
          <form
            onSubmit={submit}
            className="mt-8 space-y-5"
          >
            {/* EMAIL */}
            <label className="form-field">
              <span>
                Email
              </span>

              <input
                type="email"
                className="form-input h-11 rounded-[10px]"
                value={email}
                onChange={(
                  event,
                ) => {
                  setEmail(
                    event.target.value,
                  );
                }}
                placeholder="usuario@empresa.com"
                autoComplete="email"
                required
                autoFocus
              />
            </label>


            {/* PASSWORD */}
            <label className="form-field">
              <span>
                Contraseña
              </span>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="form-input h-11 rounded-[10px] pr-11"
                  value={password}
                  onChange={(
                    event,
                  ) => {
                    setPassword(
                      event.target.value,
                    );
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-muted-foreground
                    transition
                    hover:bg-muted
                    hover:text-foreground
                  "
                  onClick={() => {
                    setShowPassword(
                      (
                        current,
                      ) =>
                        !current,
                    );
                  }}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={17}
                      strokeWidth={2}
                    />
                  ) : (
                    <Eye
                      size={17}
                      strokeWidth={2}
                    />
                  )}
                </button>
              </div>
            </label>


            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary transition hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>


            {/* LOGIN */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Iniciar sesión
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}