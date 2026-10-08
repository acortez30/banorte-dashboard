import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface UsersHeaderProps {
  onCreate: () => void;
}

export default function UsersHeader({ onCreate }: UsersHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      
      {/* ── Title & Subtitle ── */}
      <div>
        <h1 className="text-xl font-bold font-poppins text-foreground sm:text-2xl">
          {t("users.title")}
        </h1>
        <p className="mt-0.5 text-sm font-inter text-muted-foreground">
          {t("users.subtitle")}
        </p>
      </div>

      {/* ── Action Button ── */}
      <Button
        onClick={onCreate}
        className="font-inter font-bold gap-2 w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        {t("users.createUser")}
      </Button>

    </div>
  );
}