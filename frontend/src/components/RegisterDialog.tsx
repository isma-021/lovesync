import { useState, KeyboardEvent } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Calendar, User, X } from "lucide-react";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    interestedIn: string;
    ageFrom: string;
    ageTo: string;
    location: string;
  };
}

type Step = "birthday" | "name" | "email" | "password" | "identity" | "terms";
type Gender = "hombre" | "mujer" | "otro" | null;
type InterestedIn = "hombre" | "mujer" | "todos" | null;

const RegisterDialog = ({ open, onOpenChange, initialData }: RegisterDialogProps) => {
  const [step, setStep] = useState<Step>("birthday");
  const [showPassword, setShowPassword] = useState(false);
  
  // Form data
  const [birthday, setBirthday] = useState({ day: "", month: "", year: "" });
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>(null);
  const [interestedIn, setInterestedIn] = useState<InterestedIn>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [bio, setBio] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [sensitiveDataConsent, setSensitiveDataConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const BIO_MAX_LENGTH = 280;

  const steps: Step[] = ["birthday", "name", "email", "password", "identity", "terms"];
  const currentStepIndex = steps.indexOf(step);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

const handleSubmit = async () => {
  const birthdate = `${birthday.year}-${birthday.month}-${birthday.day}`;

  const response = await fetch("http://localhost:3001/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: firstName,
      email,
      password,
      birthdate,
      genero: gender,
      genint: interestedIn,
      interests: JSON.stringify(interests), // Formatear como JSON
      bio,
    })
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.error);
    return;
  }

  // Redirigir a la raíz
  window.location.href = "/";
};


  const resetForm = () => {
    setStep("birthday");
    setBirthday({ day: "", month: "", year: "" });
    setFirstName("");
    setEmail("");
    setPassword("");
    setGender(null);
    setInterestedIn(null);
    setInterests([]);
    setInterestInput("");
    setBio("");
    setTermsAccepted(false);
    setSensitiveDataConsent(false);
    setMarketingConsent(false);
  };

  const handleInterestKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && interestInput.trim()) {
      e.preventDefault();
      const newInterest = interestInput.trim().replace(/,/g, "");
      if (newInterest && !interests.includes(newInterest)) {
        setInterests([...interests, newInterest]);
      }
      setInterestInput("");
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "hombre", label: "Hombre" },
    { value: "mujer", label: "Mujer" },
    { value: "otro", label: "Otro" },
  ];

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const isStepValid = () => {
    switch (step) {
      case "birthday":
        return birthday.day && birthday.month && birthday.year;
      case "name":
        return firstName.trim().length > 0;
      case "email":
        return email.includes("@");
      case "password":
        return password.length >= 6;
      case "identity":
        return gender !== null && interestedIn !== null && interests.length >= 3 && bio.trim().length > 0 && bio.length <= BIO_MAX_LENGTH;
      case "terms":
        return termsAccepted && sensitiveDataConsent;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background border-border p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-surface-200">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-8">
            {currentStepIndex > 0 && (
              <button
                onClick={goBack}
                className="p-2 -ml-2 text-text-secondary hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <span className="ml-auto text-sm text-text-tertiary">
              Paso {currentStepIndex + 1} de {steps.length}
            </span>
          </div>

          {/* Step Content */}
          <div className="min-h-[280px]">
            {step === "birthday" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Calendar className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-foreground">
                    ¿Cuándo naciste?
                  </h2>
                  <p className="text-text-secondary mt-2">
                    Debes tener al menos 18 años para usar LoveSync
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-sm text-text-secondary">Día</Label>
                    <Input
                      type="text"
                      placeholder="DD"
                      maxLength={2}
                      value={birthday.day}
                      onChange={(e) => setBirthday({ ...birthday, day: e.target.value.replace(/\D/g, "") })}
                      className="bg-surface-200 border-border text-foreground text-center text-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm text-text-secondary">Mes</Label>
                    <Input
                      type="text"
                      placeholder="MM"
                      maxLength={2}
                      value={birthday.month}
                      onChange={(e) => setBirthday({ ...birthday, month: e.target.value.replace(/\D/g, "") })}
                      className="bg-surface-200 border-border text-foreground text-center text-lg"
                    />
                  </div>
                  <div className="flex-[1.5]">
                    <Label className="text-sm text-text-secondary">Año</Label>
                    <Input
                      type="text"
                      placeholder="AAAA"
                      maxLength={4}
                      value={birthday.year}
                      onChange={(e) => setBirthday({ ...birthday, year: e.target.value.replace(/\D/g, "") })}
                      className="bg-surface-200 border-border text-foreground text-center text-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === "name" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground">
                    ¿Cómo te llamas?
                  </h2>
                  <p className="text-text-secondary mt-2">
                    Este es el nombre que verán otros usuarios
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-text-secondary">Nombre</Label>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-surface-200 border-border text-foreground text-lg"
                  />
                </div>
              </div>
            )}

            {step === "email" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground">
                    ¿Cuál es tu correo?
                  </h2>
                  <p className="text-text-secondary mt-2">
                    Lo usaremos para verificar tu cuenta
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-text-secondary">Correo electrónico</Label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-surface-200 border-border text-foreground text-lg"
                  />
                </div>
              </div>
            )}

            {step === "password" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Crea tu contraseña
                  </h2>
                  <p className="text-text-secondary mt-2">
                    Mínimo 6 caracteres
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-text-secondary">Contraseña</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-surface-200 border-border text-foreground text-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "identity" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <User className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-foreground">
                    Configura tu identidad
                  </h2>
                  <p className="text-text-secondary mt-2">
                    Cuéntanos más sobre ti
                  </p>
                </div>

                {/* Gender Sliding Toggle */}
                <div>
                  <Label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Identidad de Género
                  </Label>
                  <div className="mt-2 relative h-10 bg-surface-200 border border-border rounded-lg p-1">
                    {/* Sliding Puck */}
                    <div
                      className="absolute h-8 bg-background rounded-md shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                      style={{
                        width: "calc(33.333% - 4px)",
                        transform: `translateX(calc(${gender === "hombre" ? 0 : gender === "mujer" ? 100 : gender === "otro" ? 200 : 0}% + ${gender === "hombre" ? 0 : gender === "mujer" ? 4 : gender === "otro" ? 8 : 0}px))`,
                        opacity: gender ? 1 : 0,
                      }}
                    />
                    {/* Options */}
                    <div className="relative flex h-full">
                      {genderOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setGender(option.value)}
                          className={`flex-1 text-center text-sm font-medium transition-colors duration-200 z-10 ${
                            gender === option.value
                              ? "text-foreground"
                              : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interested In Sliding Toggle */}
                <div>
                  <Label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Interesado/a En
                  </Label>
                  <div className="mt-2 relative h-10 bg-surface-200 border border-border rounded-lg p-1">
                    {/* Sliding Puck */}
                    <div
                      className="absolute h-8 bg-background rounded-md shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                      style={{
                        width: "calc(33.333% - 4px)",
                        transform: `translateX(calc(${interestedIn === "hombre" ? 0 : interestedIn === "mujer" ? 100 : interestedIn === "todos" ? 200 : 0}% + ${interestedIn === "hombre" ? 0 : interestedIn === "mujer" ? 4 : interestedIn === "todos" ? 8 : 0}px))`,
                        opacity: interestedIn ? 1 : 0,
                      }}
                    />
                    {/* Options */}
                    <div className="relative flex h-full">
                      <button
                        type="button"
                        onClick={() => setInterestedIn("hombre")}
                        className={`flex-1 text-center text-sm font-medium transition-colors duration-200 z-10 ${
                          interestedIn === "hombre"
                            ? "text-foreground"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        Hombres
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterestedIn("mujer")}
                        className={`flex-1 text-center text-sm font-medium transition-colors duration-200 z-10 ${
                          interestedIn === "mujer"
                            ? "text-foreground"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        Mujeres
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterestedIn("todos")}
                        className={`flex-1 text-center text-sm font-medium transition-colors duration-200 z-10 ${
                          interestedIn === "todos"
                            ? "text-foreground"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        Todos
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interests Tag Tokenizer */}
                <div>
                  <Label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Intereses & Hobbies
                  </Label>
                  <div className="mt-2 min-h-[80px] p-3 bg-background border border-border rounded-lg focus-within:border-foreground transition-colors">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {interests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-200 border border-border rounded text-xs font-medium text-foreground group hover:bg-surface-300 transition-colors"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() => removeInterest(index)}
                            className="text-text-tertiary hover:text-foreground transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <Input
                      type="text"
                      placeholder="Escribe un hobby y presiona Enter..."
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={handleInterestKeyDown}
                      className="border-0 bg-transparent p-0 h-auto text-sm placeholder:text-text-tertiary placeholder:italic focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    Mínimo 3 intereses ({interests.length}/3)
                  </p>
                </div>

                {/* Bio Textarea */}
                <div>
                  <Label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Bio / Presentación
                  </Label>
                  <div className="mt-2 relative">
                    <Textarea
                      placeholder="Cuéntanos brevemente sobre ti..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`min-h-[100px] bg-background text-sm leading-relaxed resize-none ${
                        bio.length > BIO_MAX_LENGTH
                          ? "border-destructive focus-visible:ring-destructive"
                          : "border-border focus-visible:ring-foreground"
                      }`}
                    />
                    <span
                      className={`absolute bottom-2 right-3 text-xs font-mono ${
                        bio.length > BIO_MAX_LENGTH
                          ? "text-destructive"
                          : "text-text-tertiary"
                      }`}
                    >
                      {bio.length} / {BIO_MAX_LENGTH}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === "terms" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Completa tu registro
                  </h2>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-text-secondary leading-relaxed cursor-pointer">
                      Certifico que soy mayor de 18 años y acepto los{" "}
                      <a href="#" className="text-foreground underline">Términos y Condiciones</a>.
                      Conoce cómo procesamos tus datos en nuestra{" "}
                      <a href="#" className="text-foreground underline">Política de Privacidad</a>,{" "}
                      <a href="#" className="text-foreground underline">Política de Cookies</a> y nuestras{" "}
                      <a href="#" className="text-foreground underline">Reglas sobre Visibilidad de Perfiles</a>.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="sensitive"
                      checked={sensitiveDataConsent}
                      onCheckedChange={(checked) => setSensitiveDataConsent(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="sensitive" className="text-text-secondary leading-relaxed cursor-pointer">
                      Consiento el procesamiento de mis datos sensibles y el uso de Filtros de Mensajes Seguros 
                      por parte de LoveSync para proporcionarme el servicio.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="marketing"
                      checked={marketingConsent}
                      onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="marketing" className="text-text-secondary leading-relaxed cursor-pointer">
                      Me gustaría recibir por correo electrónico ofertas comerciales relacionadas 
                      con productos o servicios proporcionados por socios de LoveSync.{" "}
                      <a href="#" className="text-foreground underline">Ver nuestros socios</a>. 
                      Puedes darte de baja en cualquier momento desde tu configuración.
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Button */}
          <div className="mt-8">
            {step === "terms" ? (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="w-full"
                variant="default"
              >
                Crear mi cuenta gratis
              </Button>
            ) : (
              <Button
                onClick={goNext}
                disabled={!isStepValid()}
                className="w-full group"
                variant="default"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
