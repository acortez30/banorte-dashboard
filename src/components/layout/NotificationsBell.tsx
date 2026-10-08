import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const notificationsData = [
  { id: 1, text: "El paquete 419845 ha sido recogido en", location: "Locker Nuevo sur...", read: false, time: "Hace 2 min" },
  { id: 2, text: "El paquete 419845 ha sido recogido en", location: "Locker Nuevo sur...", read: false, time: "Hace 5 min" },
  { id: 3, text: "El paquete 419845 ha sido recogido en", location: "Locker Nuevo sur...", read: false, time: "Hace 10 min" },
  { id: 4, text: "El paquete 491996 ha sido ingresado en", location: "Locker Nuevo sur...", read: false, time: "Hace 15 min" },
  { id: 5, text: "El paquete 868645 ha sido ingresado en", location: "Locker Nuevo sur...", read: true, time: "Hace 30 min" },
  { id: 6, text: "El paquete 419845 ha sido ingresado en", location: "Locker Nuevo sur...", read: true, time: "Hace 1h" },
  { id: 7, text: "El paquete 835477 ha sido recogido en", location: "Locker Nuevo sur...", read: true, time: "Hace 2h" },
  { id: 8, text: "El paquete 835477 ha sido recogido en", location: "Locker Nuevo sur...", read: true, time: "Hace 3h" },
];

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive text-[10px] font-bold font-inter text-destructive-foreground px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 z-50 w-[380px] rounded-xl border border-border bg-card"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold font-poppins text-foreground">Notificaciones</h3>
            <button
              onClick={markAllRead}
              className="text-[11px] font-inter font-medium text-primary hover:underline"
            >
              Marcar todo como leído
            </button>
          </div>

          {/* Tab */}
          <div className="px-4 pt-3 pb-1">
            <Badge className="bg-muted text-foreground border-border font-inter text-xs gap-1">
              Órdenes
              <span className="bg-primary/10 text-primary text-[10px] font-bold rounded-full px-1.5 py-0.5 ml-0.5">
                {unreadCount}
              </span>
            </Badge>
          </div>

          {/* Notification list */}
          <ScrollArea className="h-[320px]">
            <div className="px-2 py-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notif.read ? "bg-primary/5" : ""
                  }`}
                >
                  {!notif.read && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                  {notif.read && <span className="mt-1.5 h-2 w-2 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-inter text-foreground leading-relaxed">
                      {notif.text}{" "}
                      <span className="font-semibold text-primary">{notif.location}</span>
                    </p>
                    <p className="text-[10px] font-inter text-muted-foreground mt-0.5">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="font-inter text-xs h-8"
              onClick={() => { setOpen(false); }}
            >
              Cerrar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="font-inter text-xs h-8 ml-auto gap-1.5"
              onClick={() => { setOpen(false); navigate("/notifications"); }}
            >
              Actividad de notificaciones
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
