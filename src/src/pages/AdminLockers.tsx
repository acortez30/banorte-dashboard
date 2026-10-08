import {
  useMemo,
  useState,
} from "react";

import {
  Boxes,
  CheckCircle2,
  DoorOpen,
  UsersRound,
} from "lucide-react";

import {
  toast,
} from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";

import LockerIslandSelect from "@/components/admin-lockers/LockerIslandSelect";
import LockerDesignGrid, {
  buildLockerDoorViews,
  type LockerDoorView,
} from "@/components/admin-lockers/LockerDesignGrid";
import CompartmentActionDialog from "@/components/admin-lockers/CompartmentActionDialog";

import {
  useData,
} from "@/contexts/DataContext";

import "@/styles/admin-lockers/AdminLockersPage.css";

export default function AdminLockers() {
  const {
    lockers,
    employees,
  } = useData();

  const activeLockers = useMemo(
    () => lockers.filter((locker) => locker.active),
    [lockers],
  );

  const [lockerId, setLockerId] = useState(activeLockers[0]?.id ?? "");
  const [selectedDoor, setSelectedDoor] = useState<LockerDoorView | null>(null);
  const [openDoors, setOpenDoors] = useState<Record<string, number[]>>({});

  const locker = activeLockers.find((item) => item.id === lockerId) ?? activeLockers[0] ?? null;

  const currentOpenDoors = useMemo(
    () => new Set(locker ? openDoors[locker.id] ?? [] : []),
    [locker, openDoors],
  );

  const doors = useMemo(
    () => locker
      ? buildLockerDoorViews({ locker, employees, openDoors: currentOpenDoors })
      : [],
    [locker, employees, currentOpenDoors],
  );

  const occupied = doors.filter((door) => door.status === "OCCUPIED").length;
  const open = doors.filter((door) => door.status === "OPEN").length;
  const available = doors.length - occupied - open;

  const handleOpenDoor = (door: LockerDoorView) => {
    if (!locker) return;

    setOpenDoors((current) => ({
      ...current,
      [locker.id]: Array.from(new Set([...(current[locker.id] ?? []), door.number])),
    }));

    setSelectedDoor(null);
    toast.success(`Compartimento ${door.number} abierto`);

    window.setTimeout(() => {
      setOpenDoors((current) => ({
        ...current,
        [locker.id]: (current[locker.id] ?? []).filter((number) => number !== door.number),
      }));
    }, 4000);
  };

  return (
    <DashboardLayout>
      <main className="admin-lockers-page">
        <PageHeader
          title="Lockers"
          description="Consulta los compartimentos de cada isla y realiza aperturas controladas."
        />

        <section className="admin-lockers__toolbar">
          <div>
            <span className="admin-lockers__toolbar-label">Isla</span>
            <LockerIslandSelect
              value={locker?.id ?? ""}
              lockers={activeLockers}
              onChange={(value) => {
                setLockerId(value);
                setSelectedDoor(null);
              }}
            />
          </div>

          <div className="admin-lockers__summary">
            <div>
              <Boxes size={16} />
              <span>Compartimentos</span>
              <strong>133</strong>
            </div>
            <div>
              <UsersRound size={16} />
              <span>Ocupados</span>
              <strong>{occupied}</strong>
            </div>
            <div>
              <CheckCircle2 size={16} />
              <span>Disponibles</span>
              <strong>{available}</strong>
            </div>
            <div>
              <DoorOpen size={16} />
              <span>Abiertos</span>
              <strong>{open}</strong>
            </div>
          </div>
        </section>

        <section className="admin-lockers__panel">
          <div className="admin-lockers__panel-header">
            <div>
              <h2>{locker?.alias ?? "Locker"}</h2>
              <p>Todos los compartimentos son tamaño Large.</p>
            </div>

            <div className="admin-lockers__legend">
              <span><i className="admin-lockers__legend-dot admin-lockers__legend-dot--available" />Disponible {available}</span>
              <span><i className="admin-lockers__legend-dot admin-lockers__legend-dot--occupied" />Ocupado {occupied}</span>
              <span><i className="admin-lockers__legend-dot admin-lockers__legend-dot--open" />Abierto {open}</span>
            </div>
          </div>

          {locker ? (
            <LockerDesignGrid
              doors={doors}
              selectedDoor={selectedDoor?.number}
              onSelectDoor={setSelectedDoor}
            />
          ) : (
            <div className="admin-lockers__empty">No hay islas activas disponibles.</div>
          )}
        </section>
      </main>

      <CompartmentActionDialog
        open={Boolean(selectedDoor && locker)}
        door={selectedDoor}
        locker={locker}
        onClose={() => setSelectedDoor(null)}
        onOpenDoor={handleOpenDoor}
      />
    </DashboardLayout>
  );
}
