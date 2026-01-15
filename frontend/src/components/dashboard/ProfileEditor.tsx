import { useState, KeyboardEvent } from "react";
import { Lock, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import React from "react";



interface ProfileEditorProps {
  onCancel: () => void;
  onSave: () => void;
}

const ProfileEditor = ({ onCancel, onSave }: ProfileEditorProps) => {
  const [displayName, setDisplayName] = useState(localStorage.getItem("userName") || "");
  const [email, setEmail] = useState(localStorage.getItem("mail") || "");
  
  // Formatear ISO 8601 a formato de date input: "2012-12-11T23:00:00.000Z" -> "2012-12-11"
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // Tomar solo la parte de la fecha (YYYY-MM-DD)
  };
  
  const [dateOfBirth, setDateOfBirth] = useState(formatDate(localStorage.getItem("cumpl")));
  const [gender, setGender] = useState(localStorage.getItem("genero") || "mujer");
  const [interestedIn, setInterestedIn] = useState(localStorage.getItem("genint") || "hombre");
  const [bio, setBio] = useState(localStorage.getItem("bio") || "");
  
  // Parsear intereses desde JSON
  const parseInterests = (interestsString: string | null): string[] => {
    if (!interestsString) return [];
    try {
      return JSON.parse(interestsString);
    } catch (e) {
      return [];
    }
  };
  
  const [interests, setInterests] = useState<string[]>(parseInterests(localStorage.getItem("interests")));
  const [interestInput, setInterestInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const BIO_MAX_LENGTH = 280;

  const handleAddInterest = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && interestInput.trim()) {
      e.preventDefault();
      if (!interests.includes(interestInput.trim())) {
        setInterests([...interests, interestInput.trim()]);
      }
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Preparar datos para enviar
    const updateData = {
      nombre: displayName,
      cumpl: dateOfBirth,
      genero: gender,
      genint: interestedIn,
      interests: JSON.stringify(interests),
      bio,
    };

    try {
      const response = await fetch("http://localhost:3001/api/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "No se pudo actualizar el perfil",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      // Actualizar localStorage con los nuevos datos
      localStorage.setItem("userName", displayName || "");
      localStorage.setItem("cumpl", dateOfBirth);
      localStorage.setItem("genero", gender);
      localStorage.setItem("genint", interestedIn);
      localStorage.setItem("interests", JSON.stringify(interests));
      localStorage.setItem("bio", bio);

      setIsSaving(false);
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados correctamente.",
      });
      onSave();
    } catch (error) {
      setIsSaving(false);
      toast({
        title: "Error",
        description: "Hubo un error al guardar los cambios",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[520px] mx-auto px-6 py-10 animate-fade-in">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-text-primary">
              Configuración del Perfil
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Administra tu identidad pública y configuración de seguridad.
            </p>
          </div>

          {/* Separator */}
          <div className="h-px bg-border-subtle mb-8" />

          {/* Form Group A: Account Credentials (Locked) */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Credenciales de Cuenta
            </h2>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text-secondary">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Input
                  value={email}
                  disabled
                  className="bg-surface-200 border-dashed border-[#D1D5DB] text-text-secondary cursor-not-allowed pr-10"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text-secondary">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  value="••••••••••••"
                  disabled
                  className="bg-surface-200 border-dashed border-[#D1D5DB] text-text-secondary cursor-not-allowed pr-10"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
              </div>
            </div>
          </div>

          {/* Form Group B: Public Identity (Editable) */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Identidad Pública
            </h2>

            {/* Display Name */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text-secondary">
                Nombre Visible
              </Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Daniela"
                className="bg-surface-100 border-[#E5E7EB] focus:border-text-primary"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text-secondary">
                Fecha de Nacimiento
              </Label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="bg-surface-100 border-[#E5E7EB] focus:border-text-primary font-mono"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text-secondary">
                Identidad de Género
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="bg-surface-100 border-[#E5E7EB] focus:border-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface-100 border-border-subtle">
                  <SelectItem value="mujer">Mujer</SelectItem>
                  <SelectItem value="hombre">Hombre</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Interested In */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text-secondary">
                Interesado/a En
              </Label>
              <Select value={interestedIn} onValueChange={setInterestedIn}>
                <SelectTrigger className="bg-surface-100 border-[#E5E7EB] focus:border-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface-100 border-border-subtle">
                  <SelectItem value="hombre">Hombres</SelectItem>
                  <SelectItem value="mujer">Mujeres</SelectItem>
                  <SelectItem value="todos">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-text-secondary">
                Bio / Presentación
              </Label>
              <div className="relative">
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos brevemente sobre ti..."
                  className={`min-h-[100px] bg-surface-100 resize-none ${
                    bio.length > BIO_MAX_LENGTH
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-[#E5E7EB] focus:border-text-primary"
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

          {/* Form Group C: Interests & Hobbies (Tag Tokenizer) */}
          <div className="space-y-4 mb-24">
            <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Matriz de Afinidad
            </h2>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-text-secondary">
                Intereses y Pasatiempos
              </Label>
              <div className="min-h-[100px] p-3 bg-surface-100 border border-[#E5E7EB] rounded-md focus-within:border-text-primary transition-colors">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-200 hover:bg-surface-300 rounded-full text-xs font-medium text-text-primary transition-colors group"
                    >
                      {interest}
                      <button
                        onClick={() => handleRemoveInterest(interest)}
                        className="opacity-60 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {/* Input */}
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleAddInterest}
                  placeholder="Escribe un interés y presiona Enter (ej: Senderismo, Sushi, Diseño UX)..."
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="sticky bottom-0 left-0 right-0 px-6 py-4 bg-surface-100/80 backdrop-blur-md border-t border-border-subtle">
        <div className="max-w-[520px] mx-auto flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-text-secondary hover:text-text-primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#1F2937] text-white hover:bg-[#374151]"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
