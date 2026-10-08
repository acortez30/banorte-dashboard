import {
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";
import ToggleSwitch from "@/components/common/ToggleSwitch";

import {
  MOCK_PASSWORD,
} from "@/data/mockData";

import type {
  DashboardUser,
  UserRole,
} from "@/types/dashboard";

import "@/styles/users/UserFormDialog.css";


/* =========================================================
   TYPES
   ========================================================= */

interface UserFormValue {
  name: string;

  email: string;

  role: UserRole;

  active: boolean;

  password: string;

  organization:
    | "Vivipost"
    | "Banorte";
}

interface UserFormDialogProps {
  open: boolean;

  onClose: () => void;

  user?:
    | DashboardUser
    | null;

  allowRoleSelection: boolean;

  onSubmit: (
    value: UserFormValue,
  ) => {
    ok: boolean;
    error?: string;
  };
}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function UserFormDialog({
  open,
  onClose,

  user,

  allowRoleSelection,

  onSubmit,
}: UserFormDialogProps) {
  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    role,
    setRole,
  ] =
    useState<UserRole>(
      "ADMIN",
    );

  const [
    active,
    setActive,
  ] = useState(true);

  const [
    password,
    setPassword,
  ] =
    useState(
      MOCK_PASSWORD,
    );

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const isEditing =
    Boolean(user);


  /* =======================================================
     RESET
     ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(
      user?.name ?? "",
    );

    setEmail(
      user?.email ?? "",
    );

    setRole(
      user?.role ??
        "ADMIN",
    );

    setActive(
      user?.active ??
        true,
    );

    setPassword(
      user?.password ??
        MOCK_PASSWORD,
    );

    setShowPassword(
      false,
    );

    setError("");
  }, [
    open,
    user,
  ]);


  /* =======================================================
     VALIDATION
     ======================================================= */

  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  const nameValid =
    name
      .trim()
      .length >= 3;

  const emailValid =
    /^\S+@\S+\.\S+$/.test(
      normalizedEmail,
    );

  const passwordValid =
    password.length >= 8;

  const valid =
    nameValid &&
    emailValid &&
    passwordValid;


  /* =======================================================
     ROLE
     ======================================================= */

  const effectiveRole:
    UserRole =
    allowRoleSelection
      ? role
      : "ADMIN";

  const organization =
    effectiveRole ===
    "SUPER_ADMIN"
      ? "Vivipost"
      : "Banorte";


  /* =======================================================
     SUBMIT
     ======================================================= */

  const submit = () => {
    if (!valid) {
      return;
    }

    setError("");

    const result =
      onSubmit({
        name:
          name.trim(),

        email:
          normalizedEmail,

        role:
          effectiveRole,

        active,

        password,

        organization,
      });

    if (result.ok) {
      onClose();

      return;
    }

    setError(
      result.error ??
        "No se pudo guardar el usuario.",
    );
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <Dialog
      open={
        open
      }
      onClose={
        onClose
      }
      title={
        isEditing
          ? "Editar usuario"
          : "Nuevo usuario"
      }
      description={
        isEditing
          ? "Actualiza la información y permisos de acceso del usuario."
          : allowRoleSelection
            ? "Crea un administrador Banorte o un super administrador Vivipost."
            : "Crea un nuevo administrador con acceso al dashboard de Banorte."
      }
      width="max-w-2xl"
      panelClassName="user-form-dialog"
      footer={
        <div className="user-form__footer">
          <Button
            variant="secondary"
            onClick={
              onClose
            }
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            disabled={
              !valid
            }
            onClick={
              submit
            }
          >
            {isEditing
              ? "Guardar cambios"
              : "Crear usuario"}
          </Button>
        </div>
      }
    >
      <div className="user-form">
        {/* =================================================
            USER INFORMATION
            ================================================= */}
        <section className="user-form__section">
          <div className="user-form__section-header">
            <div className="user-form__section-icon">
              <UserRound
                size={16}
                strokeWidth={2}
              />
            </div>

            <div>
              <h3>
                Información del usuario
              </h3>

              <p>
                Datos utilizados para identificar y permitir el acceso al dashboard.
              </p>
            </div>
          </div>

          <div className="user-form__grid">
            {/* NAME */}
            <label className="user-form__field user-form__field--full">
              <span className="user-form__label">
                Nombre
              </span>

              <div className="user-form__input-wrapper">
                <UserRound
                  size={16}
                  strokeWidth={2}
                  className="user-form__input-icon"
                />

                <input
                  type="text"
                  value={
                    name
                  }
                  onChange={(
                    event,
                  ) => {
                    setName(
                      event.target.value,
                    );
                  }}
                  className="user-form__input"
                  placeholder="Nombre completo"
                  autoFocus
                />
              </div>

              {name.length >
                0 &&
              !nameValid ? (
                <span className="user-form__field-error">
                  Ingresa un nombre de al menos 3 caracteres.
                </span>
              ) : null}
            </label>


            {/* EMAIL */}
            <label className="user-form__field user-form__field--full">
              <span className="user-form__label">
                Email
              </span>

              <div className="user-form__input-wrapper">
                <Mail
                  size={16}
                  strokeWidth={2}
                  className="user-form__input-icon"
                />

                <input
                  type="email"
                  value={
                    email
                  }
                  onChange={(
                    event,
                  ) => {
                    setEmail(
                      event.target.value,
                    );
                  }}
                  className="user-form__input"
                  placeholder="usuario@empresa.com"
                />
              </div>

              {email.length >
                0 &&
              !emailValid ? (
                <span className="user-form__field-error">
                  Ingresa un correo electrónico válido.
                </span>
              ) : null}
            </label>
          </div>
        </section>


        {/* =================================================
            ROLE
            ================================================= */}
        {allowRoleSelection ? (
          <section className="user-form__section">
            <div className="user-form__section-header">
              <div className="user-form__section-icon user-form__section-icon--neutral">
                <ShieldCheck
                  size={16}
                  strokeWidth={2}
                />
              </div>

              <div>
                <h3>
                  Rol y organización
                </h3>

                <p>
                  Define el nivel de acceso que tendrá el usuario.
                </p>
              </div>
            </div>

            <div className="user-form__roles">
              {/* ADMIN */}
              <button
                type="button"
                className={`
                  user-form__role

                  ${
                    role ===
                    "ADMIN"
                      ? "user-form__role--selected"
                      : ""
                  }
                `}
                onClick={() => {
                  setRole(
                    "ADMIN",
                  );
                }}
                aria-pressed={
                  role ===
                  "ADMIN"
                }
              >
                <div className="user-form__role-icon">
                  <UsersRound
                    size={18}
                    strokeWidth={2}
                  />
                </div>

                <div className="user-form__role-content">
                  <strong>
                    Administrador
                  </strong>

                  <span>
                    Banorte
                  </span>

                  <p>
                    Administra empleados y usuarios Banorte.
                  </p>
                </div>

                <div className="user-form__role-radio">
                  <span />
                </div>
              </button>


              {/* SUPER ADMIN */}
              <button
                type="button"
                className={`
                  user-form__role
                  user-form__role--super

                  ${
                    role ===
                    "SUPER_ADMIN"
                      ? "user-form__role--selected"
                      : ""
                  }
                `}
                onClick={() => {
                  setRole(
                    "SUPER_ADMIN",
                  );
                }}
                aria-pressed={
                  role ===
                  "SUPER_ADMIN"
                }
              >
                <div className="user-form__role-icon">
                  <ShieldCheck
                    size={18}
                    strokeWidth={2}
                  />
                </div>

                <div className="user-form__role-content">
                  <strong>
                    Super administrador
                  </strong>

                  <span>
                    Vivipost
                  </span>

                  <p>
                    Administra lockers y todos los usuarios del sistema.
                  </p>
                </div>

                <div className="user-form__role-radio">
                  <span />
                </div>
              </button>
            </div>
          </section>
        ) : null}


        {/* =================================================
            ORGANIZATION INFO — ADMIN
            ================================================= */}
        {!allowRoleSelection ? (
          <div className="user-form__organization">
            <div className="user-form__organization-icon">
              <Building2
                size={16}
                strokeWidth={2}
              />
            </div>

            <div>
              <span>
                Organización
              </span>

              <strong>
                Banorte
              </strong>
            </div>
          </div>
        ) : null}


        {/* =================================================
            PASSWORD
            ================================================= */}
        <section className="user-form__section">
          <div className="user-form__section-header">
            <div className="user-form__section-icon user-form__section-icon--neutral">
              <KeyRound
                size={16}
                strokeWidth={2}
              />
            </div>

            <div>
              <h3>
                Acceso
              </h3>

              <p>
                Configura la contraseña temporal y el estado del usuario.
              </p>
            </div>
          </div>

          <label className="user-form__field">
            <span className="user-form__label">
              Contraseña temporal
            </span>

            <div className="user-form__input-wrapper">
              <KeyRound
                size={16}
                strokeWidth={2}
                className="user-form__input-icon"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  password
                }
                onChange={(
                  event,
                ) => {
                  setPassword(
                    event.target.value,
                  );
                }}
                className="user-form__input user-form__input--password"
                placeholder="Mínimo 8 caracteres"
              />

              <button
                type="button"
                className="user-form__password-toggle"
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
                title={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff
                    size={16}
                    strokeWidth={2}
                  />
                ) : (
                  <Eye
                    size={16}
                    strokeWidth={2}
                  />
                )}
              </button>
            </div>

            {password.length >
              0 &&
            !passwordValid ? (
              <span className="user-form__field-error">
                La contraseña debe tener al menos 8 caracteres.
              </span>
            ) : (
              <span className="user-form__field-helper">
                El usuario utilizará esta contraseña para su primer acceso.
              </span>
            )}
          </label>


          {/* ===============================================
              ACCESS STATUS
              =============================================== */}
          <div className="user-form__access">
            <div className="user-form__access-content">
              <strong>
                Acceso al dashboard
              </strong>

              <p>
                {active
                  ? "El usuario puede iniciar sesión actualmente."
                  : "El usuario no podrá iniciar sesión en el dashboard."}
              </p>
            </div>

            <div className="user-form__access-control">
              <span
                className={`
                  user-form__access-status

                  ${
                    active
                      ? "user-form__access-status--active"
                      : ""
                  }
                `}
              >
                {active
                  ? "Activo"
                  : "Inactivo"}
              </span>

              <ToggleSwitch
                checked={
                  active
                }
                onChange={
                  setActive
                }
                label="Cambiar acceso al dashboard"
              />
            </div>
          </div>
        </section>


        {/* =================================================
            ERROR
            ================================================= */}
        {error ? (
          <div className="user-form__error">
            <AlertCircle
              size={17}
              strokeWidth={2}
            />

            <span>
              {error}
            </span>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}