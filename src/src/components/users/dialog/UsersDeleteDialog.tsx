import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { UserRow } from "@/types/users.types";

interface UsersDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserRow | null;
  onConfirm: (id: string) => Promise<void> | void;
}

export default function UsersDeleteDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: UsersDeleteDialogProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(user.id);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <Dialog open={open} onOpenChange={!loading ? onOpenChange : undefined}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold flex items-center gap-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            {t("users.deleteUser")}
          </DialogTitle>

          <DialogDescription className="text-sm font-inter text-muted-foreground pt-2 leading-relaxed">
            {t("users.deleteConfirmation").replace("{{name}}", fullName)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={handleConfirm}
            className="min-w-[90px]"
          >
            {loading ? t("common.deleting") : t("common.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}