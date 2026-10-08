import {
  useEffect,
  useState,
} from "react";

import {
  Boxes,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import logoCompact from "@/assets/logo_banorte.webp";

import { useAuth } from "@/contexts/AuthContext";

export default function AppSidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const {
    user,
    logout,
  } = useAuth();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!user) {
    return null;
  }

  /*
   * SUPER_ADMIN:
   * - Lockers
   * - Usuarios
   *
   * ADMIN:
   * - Empleados
   * - Lockers
   * - Accesos
   * - Usuarios
   */
  const items =
    user.role === "SUPER_ADMIN"
      ? [
          {
            to: "/lockers",
            label: "Lockers",
            icon: Boxes,
          },
          {
            to: "/users",
            label: "Usuarios",
            icon: UsersRound,
          },
        ]
      : [
          {
            to: "/employees",
            label: "Empleados",
            icon: UserRoundCheck,
          },
          {
            to: "/locker-view",
            label: "Lockers",
            icon: Boxes,
          },
          {
            to: "/accesses",
            label: "Accesos",
            icon: ArrowRightLeft,
          },
          {
            to: "/users",
            label: "Usuarios",
            icon: UsersRound,
          },
        ];

  const userInitials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const roleLabel =
    user.role === "SUPER_ADMIN"
      ? "Super administrador"
      : "Administrador";

  const companyLabel =
    user.role === "SUPER_ADMIN"
      ? "VIVIPOST"
      : "BANORTE";

  return (
    <>
      {/* =====================================================
          MOBILE BUTTON
          ===================================================== */}
      <button
        type="button"
        className="
          fixed left-4 top-4 z-50
          flex h-11 w-11
          items-center justify-center
          rounded-lg
          bg-[#EB0029]
          text-white
          shadow-lg
          transition-colors
          hover:bg-[#C90024]
          lg:hidden
        "
        onClick={() => {
          setMobileOpen((open) => !open);
        }}
        aria-label={
          mobileOpen
            ? "Cerrar menú"
            : "Abrir menú"
        }
      >
        {mobileOpen ? (
          <X
            size={20}
            strokeWidth={2}
          />
        ) : (
          <Menu
            size={20}
            strokeWidth={2}
          />
        )}
      </button>

      {/* =====================================================
          MOBILE OVERLAY
          ===================================================== */}
      {mobileOpen ? (
        <button
          type="button"
          className="
            fixed inset-0 z-40
            bg-slate-950/45
            backdrop-blur-[1px]
            lg:hidden
          "
          onClick={() => {
            setMobileOpen(false);
          }}
          aria-label="Cerrar menú"
        />
      ) : null}

      {/* =====================================================
          SIDEBAR
          ===================================================== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          flex flex-col
          overflow-visible
          bg-[#EB0029]
          text-white
          shadow-[8px_0_28px_rgba(119,0,20,0.14)]
          transition-[width,transform] duration-300 ease-in-out

          ${collapsed ? "w-[76px]" : "w-[220px]"}

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
{/* ===================================================
    BRAND
    =================================================== */}
<div
  className={`
    flex h-[66px]
    shrink-0
    items-center
    border-b border-white/25
    transition-all duration-300

    ${
      collapsed
        ? "justify-center px-2"
        : "px-3"
    }
  `}
>
  {collapsed ? (
    /* =================================================
       COLLAPSED
       El logo funciona como botón para expandir
       ================================================= */
    <button
      type="button"
      onClick={onToggleCollapsed}
      className="
        flex h-[40px] w-[40px]
        items-center justify-center
        overflow-hidden
        rounded-[7px]
        bg-white
        shadow-[0_1px_4px_rgba(0,0,0,0.15)]
        transition-all duration-150

        hover:scale-[1.03]
        hover:bg-[#F8F8F8]

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-white/70
      "
      aria-label="Expandir menú"
      title="Expandir menú"
    >
      <img
        src={logoCompact}
        alt="Banorte"
        className="
          h-[31px]
          w-[31px]
          object-contain
        "
      />
    </button>
  ) : (
    /* =================================================
       EXPANDED
       ================================================= */
    <>
      {/* LOGO */}
      <div
        className="
          flex h-[38px] w-[38px]
          shrink-0
          items-center justify-center
          overflow-hidden
          rounded-[7px]
          bg-white
          shadow-[0_1px_3px_rgba(0,0,0,0.12)]
        "
      >
        <img
          src={logoCompact}
          alt="Banorte"
          className="
            h-[30px]
            w-[30px]
            object-contain
          "
        />
      </div>

      {/* BRAND TEXT */}
      <div className="ml-2.5 min-w-0">
        <p
          className="
            truncate
            text-[13px]
            font-bold
            leading-[1.1]
            text-white
          "
        >
          Banorte
        </p>

        <p
          className="
            mt-1
            truncate
            text-[10px]
            font-semibold
            leading-none
            text-white/85
          "
        >
          {user.role === "SUPER_ADMIN"
            ? "Super administrador"
            : "Administrador"}
        </p>
      </div>

      {/* COLLAPSE BUTTON */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="
          ml-auto
          hidden h-[28px] w-[28px]
          shrink-0
          items-center justify-center
          rounded-[5px]

          border border-white/45
          bg-[#C90024]
          text-white

          shadow-[0_1px_3px_rgba(0,0,0,0.12)]

          transition-all duration-150

          hover:border-white/70
          hover:bg-[#B00020]

          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-white/60

          lg:flex
        "
        aria-label="Contraer menú"
        title="Contraer menú"
      >
        <ChevronLeft
          size={16}
          strokeWidth={2.4}
        />
      </button>
    </>
  )}
</div>

        {/* ===================================================
            NAVIGATION
            =================================================== */}
        <nav
          className={`
            flex-1
            space-y-1
            overflow-y-auto
            py-3

            ${
              collapsed
                ? "px-2"
                : "px-2.5"
            }
          `}
        >
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={
                  collapsed
                    ? item.label
                    : undefined
                }
                className={({
                  isActive,
                }) => `
                  group
                  relative
                  flex h-[42px]
                  items-center
                  rounded-md
                  text-[13px]
                  font-semibold
                  transition-all duration-150

                  ${
                    collapsed
                      ? "justify-center px-2"
                      : "gap-3 px-3"
                  }

                  ${
                    isActive
                      ? `
                        bg-[#F3F4F6]
                        text-[#4B5563]
                        shadow-[0_1px_3px_rgba(0,0,0,0.10)]
                      `
                      : `
                        text-white
                        hover:bg-[#C90024]
                      `
                  }
                `}
              >
                {({
                  isActive,
                }) => (
                  <>
                    {/* ACTIVE BAR */}
                    {isActive && !collapsed ? (
                      <span
                        className="
                          absolute
                          left-0
                          top-[7px]
                          h-7
                          w-[3px]
                          rounded-r-full
                          bg-[#9B001B]
                        "
                      />
                    ) : null}

                    <Icon
                      size={18}
                      strokeWidth={2}
                      className={`
                        shrink-0
                        transition-colors

                        ${
                          isActive
                            ? "text-[#EB0029]"
                            : "text-white"
                        }
                      `}
                    />

                    {!collapsed ? (
                      <span className="truncate">
                        {item.label}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ===================================================
            USER AREA
            =================================================== */}
        <div className="shrink-0 border-t border-white/20">
          {!collapsed ? (
            <div className="px-2.5 py-3">
              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-lg
                  border border-white/15
                  bg-[#D90027]
                  px-3
                  py-2.5
                "
              >
                {/* AVATAR */}
                <div
                  className="
                    flex h-9 w-9
                    shrink-0
                    items-center justify-center
                    rounded-full
                    bg-white
                    text-[11px]
                    font-bold
                    uppercase
                    text-[#EB0029]
                    shadow-sm
                  "
                >
                  {userInitials || "U"}
                </div>

                {/* USER INFO */}
                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-[12px]
                      font-bold
                      leading-tight
                      text-white
                    "
                  >
                    {user.name}
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.06em]
                      text-white/70
                    "
                  >
                    {roleLabel}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      font-bold
                      tracking-[0.08em]
                      text-white/55
                    "
                  >
                    {companyLabel}
                  </p>
                </div>

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={logout}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                  className="
                    flex h-8 w-8
                    shrink-0
                    items-center justify-center
                    rounded-md
                    text-white/85
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <LogOut
                    size={16}
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-3">
              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-full
                  bg-white
                  text-[10px]
                  font-bold
                  uppercase
                  text-[#EB0029]
                "
                title={user.name}
              >
                {userInitials || "U"}
              </div>

              <button
                type="button"
                onClick={logout}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-md
                  text-white/80
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <LogOut
                  size={17}
                  strokeWidth={2}
                />
              </button>
            </div>
          )}

          {/* POWERED BY */}
          {!collapsed ? (
            <div
              className="
                border-t border-white/10
                px-4
                py-2
                text-center
              "
            >
              <p
                className="
                  text-[8px]
                  font-medium
                  tracking-[0.04em]
                  text-white/45
                "
              >
                Powered by VIVIPOST
              </p>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}