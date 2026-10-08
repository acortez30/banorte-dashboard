import { useEffect, useState, useMemo, useRef } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { usersService } from "@/services/users.service";
import { RefreshCw } from "lucide-react";

interface UsersEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onUpdate: (id: string, data: any) => void;
}

export default function UsersEditDialog({
  open,
  onOpenChange,
  user,
  onUpdate,
}: UsersEditDialogProps) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userTypes, setUserTypes] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // 🔥 GENERADOR DE PASSWORD
  const generateSecurePassword = (length = 12) => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    const all = upper + lower + numbers + symbols;

    let password = "";

    password += upper[Math.floor(Math.random() * upper.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    password += lower[Math.floor(Math.random() * lower.length)];

    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setFormData((prev) => ({ ...prev, password: newPassword }));
  };

  // 🔥 VALIDACIÓN GLOBAL PARA BOTÓN
  const isFormValid = useMemo(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    // const hasUpperCase = /[A-Z]/.test(formData.password);
    // const hasNumber = /[0-9]/.test(formData.password);
    // const hasSpecialCharacter = /[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(formData.password);
    // const hasMinLength = formData.password.length >= 8;

    // const isPasswordValid =
    //   hasUpperCase &&
    //   hasNumber &&
    //   hasSpecialCharacter &&
    //   hasMinLength;

    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.userType !== "" &&
      formData.email.trim() !== "" &&
      isEmailValid
      // isPasswordValid
    );
  }, [formData]);

  // 🔥 Estado con los datos originales para detectar cambios
const [originalData, setOriginalData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  userType: "",
  password: "",
});

// 🔥 Precargar usuario
useEffect(() => {
  if (user) {
    const initial = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      userType: String(user.idUserType || ""),
      password: "",
    };

    setFormData(initial);
    setOriginalData(initial); // guardamos snapshot original
    setErrors({});
  }
}, [user]);

// 🔥 Detecta si el usuario modificó algo
const hasChanges = useMemo(() => {
  return (
    formData.firstName.trim() !== originalData.firstName.trim() ||
    formData.lastName.trim() !== originalData.lastName.trim() ||
    formData.email.trim() !== originalData.email.trim() ||
    formData.userType !== originalData.userType ||
    formData.password.trim() !== "" // password vacío = no cambió
  );
}, [formData, originalData]);

  // 🔥 Cargar roles
  useEffect(() => {
    if (!open) return;

    const fetchUserTypes = async () => {
      try {
        setLoadingTypes(true);

        const lang = localStorage.getItem("lang") || "es";
        const res = await usersService.getUserTypes({ lang });

        if (res?.mensaje_return?.CODE === 200) {
          const roles = res.result_list_user || [];

          const filteredRoles = roles.filter(
            (r: any) => r.user_type === "HOUSE ACCOUNT"
          );

          setUserTypes(filteredRoles);
        } else {
          setUserTypes([]);
        }
      } catch (error) {
        console.error("Error loading user types:", error);
        setUserTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchUserTypes();
  }, [open]);

  // 🔥 Precargar usuario
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        userType: String(user.idUserType || ""),
        password: "",
      });

      setErrors({});
    }
  }, [user]);

  // 🔥 Auto seleccionar rol
  useEffect(() => {
    if (userTypes.length === 1) {
      setFormData((prev) => ({
        ...prev,
        userType: String(userTypes[0].id_user_type),
      }));
    }
  }, [userTypes]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = t("validation.required");

    if (!formData.lastName.trim())
      newErrors.lastName = t("validation.required");

    if (!formData.email.trim())
      newErrors.email = t("validation.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t("validation.invalidEmail");

    if (!formData.userType)
      newErrors.userType = t("validation.required");

    // if (!formData.password)
    //   newErrors.password = t("validation.required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const cleanValue = (value: string) =>
    value.replace(/\s+/g, " ").replace(/^\s/, "");

  const handleSubmit = () => {
    if (!validate() || !user) return;

    onUpdate(user.id, formData);
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-poppins font-semibold">
            {t("users.editUser")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* USER TYPE */}
          <div className="space-y-1.5">
            <Label className="text-xs font-inter">
              {t("users.userType")} *
            </Label>

            <Select
              value={formData.userType}
              onValueChange={(value) =>
                setFormData({ ...formData, userType: value })
              }
            >
              <SelectTrigger
                className={`text-sm font-inter ${
                  errors.userType ? "border-destructive" : ""
                }`}
              >
                <SelectValue
                  placeholder={
                    loadingTypes
                      ? t("common.loading")
                      : t("users.selectRole")
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {userTypes.map((type) => (
                  <SelectItem
                    key={type.id_user_type}
                    value={String(type.id_user_type)}
                  >
                    {type.user_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.userType && (
              <p className="text-xs text-destructive">
                {errors.userType}
              </p>
            )}
          </div>

          {/* First Name */}
          <div className="space-y-1.5">
            <Label>{t("users.name")} *</Label>
            <Input
              value={formData.firstName}
              maxLength={40}
              onChange={(e) => {
                const val = e.target.value.slice(0, 40);
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) return;
                setFormData({ ...formData, firstName: cleanValue(val) });
              }}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <Label>{t("users.lastName")} *</Label>
            <Input
              value={formData.lastName}
              maxLength={40}
              onChange={(e) => {
                const val = e.target.value.slice(0, 40);
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) return;
                setFormData({ ...formData, lastName: cleanValue(val) });
              }}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input
            disabled={true}
              type="email"
              value={formData.email}
              maxLength={80}
              onChange={(e) => {
                const val = e.target.value.slice(0, 80);
                setFormData({ ...formData, email: cleanValue(val) });
              }}
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <Label>{t("users.password")} *</Label>

            <div className="flex gap-2">
              <Input
                type="text"
                value={formData.password}
                maxLength={50}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 50);
                  setFormData({ ...formData, password: val });
                }}
                placeholder={t("users.passwordPlaceholder")}
                className={errors.password ? "border-destructive" : ""}
              />

              <Button
                type="button"
                variant="outline"
                onClick={handleGeneratePassword}
                className="p-2"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password}
              </p>
            )}
          </div>

        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>

<Button
  onClick={handleSubmit}
  disabled={loadingTypes || !isFormValid || !hasChanges}
>
  {t("common.saveChanges")}
</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}