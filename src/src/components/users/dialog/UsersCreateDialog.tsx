import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { usersService } from "@/services/users.service";

// 🔥 Wrapper SELECT
import {
  AppSelect,
  AppSelectTrigger,
  AppSelectContent,
  AppSelectItem,
  AppSelectValue,
} from "@/components/ui/app-select";

// --- Types ---
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

interface UserType {
  id_user_type: number;
  user_type: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: FormData) => Promise<void>;
}

export default function UsersCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: Props) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    userType: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        userType: "",
      });
      setErrors({});
      setUserTypes([]);
    }
  }, [open]);

  // Fetch roles
  useEffect(() => {
    if (!open) return;

    const fetchUserTypes = async () => {
      try {
        setLoadingTypes(true);

        const lang = localStorage.getItem("lang") || "es";
        const res = await usersService.getUserTypes({ lang });

        if (res?.mensaje_return?.CODE === 200) {
          const roles = res.result_list_user || [];
          
          // Filtramos solo HOUSE ACCOUNT si es necesario
          const filtered = roles.filter(
            (r: UserType) => r.user_type === "HOUSE ACCOUNT"
          );

          setUserTypes(filtered);
        } else {
          setUserTypes([]);
        }
      } catch (error) {
        console.error(error);
        toast.error(t("common.error"));
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchUserTypes();
  }, [open, t]);

  // Change handler
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validation
  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("validation.required");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("validation.required");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validation.invalidEmail");
    }

    if (!formData.userType) {
      newErrors.userType = t("validation.required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error(t("validation.fixErrors"));
      return;
    }

    try {
      setSaving(true);
      await onCreate(formData);
      toast.success(t("users.created"));
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(t("users.createError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md overflow-visible"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("users.addUser")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* USER TYPE */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1">
              {t("users.userType")} 
              <span className="text-destructive">*</span>
            </Label>

            <AppSelect
              value={formData.userType}
              onValueChange={(v) => handleChange("userType", v)}
              disabled={loadingTypes}
            >
              <AppSelectTrigger
                className={`w-full ${errors.userType ? "border-destructive" : ""}`}
                aria-label={t("users.selectRole")}
              >
                <AppSelectValue 
                  placeholder={
                    loadingTypes 
                      ? t("common.loading") 
                      : t("users.selectRole")
                  } 
                />
              </AppSelectTrigger>

              <AppSelectContent>
                {userTypes.length > 0 ? (
                  userTypes.map((type) => (
                    <AppSelectItem
                      key={type.id_user_type}
                      value={String(type.id_user_type)}
                    >
                      {type.user_type}
                    </AppSelectItem>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    {t("common.noResults")}
                  </div>
                )}
              </AppSelectContent>
            </AppSelect>

            {errors.userType && (
              <p className="text-xs text-destructive mt-1">
                {errors.userType}
              </p>
            )}
          </div>

          {/* FIRST NAME */}
<Field
  label={t("users.name")}
  value={formData.firstName}
  error={errors.firstName}
  maxLength={40}
  pattern={/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/}
  onChange={(v) => handleChange("firstName", v)}
/>

          {/* LAST NAME */}
<Field
  label={t("users.lastName")}
  value={formData.lastName}
  error={errors.lastName}
  maxLength={40}
  pattern={/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/}
  onChange={(v) => handleChange("lastName", v)}
/>

          {/* EMAIL */}
<Field
  label="Email"
  value={formData.email}
  error={errors.email}
  maxLength={80}
  onChange={(v) => handleChange("email", v)}
  type="email"
/>
        </div>

        {/* INFO MESSAGE */}
        <div className="rounded-xl border bg-muted/30 p-4 flex gap-3 mt-4">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            {t("users.passwordWillBeSent")}
          </p>
        </div>

        {/* FOOTER */}
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Input reusable
 */
interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  maxLength?: number;
  pattern?: RegExp;
}


function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  maxLength = 50,
  pattern,
}: FieldProps) {
  const handleChange = (val: string) => {
    let newValue = val;

    // 🔥 Limitar longitud
    if (maxLength) {
      newValue = newValue.slice(0, maxLength);
    }

    // 🔥 Validar patrón (si existe)
    if (pattern && !pattern.test(newValue)) {
      return;
    }

    onChange(newValue);
  };

  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1">
        {label}
        <span className="text-destructive">*</span>
      </Label>

      <Input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => handleChange(e.target.value)}
        onPaste={(e) => {
          const paste = e.clipboardData.getData("text");
          if (pattern && !pattern.test(paste)) {
            e.preventDefault();
          }
        }}
        className={error ? "border-destructive" : ""}
      />

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}