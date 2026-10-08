import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 font-poppins text-3xl font-bold">
          Página no encontrada
        </h1>
        <Link className="btn-primary mt-6 inline-flex" to="/">
          Volver al dashboard
        </Link>
      </div>
    </main>
  );
}
