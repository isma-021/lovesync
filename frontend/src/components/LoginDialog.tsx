import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Guardamos el token y el nombre
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.nombre);
      localStorage.setItem("mail", data.user.email);
      localStorage.setItem("cumpl", data.user.cum);
      localStorage.setItem("bio", data.user.bio);
      localStorage.setItem("interests", data.user.intereses);
      localStorage.setItem("genero", data.user.idenGenero);
      localStorage.setItem("genint", data.user.idenGenint);
      localStorage.setItem("userId", data.user.id);
      
      // 🔥 Guardamos los matches obtenidos del servidor Python
      if (data.matches) {
        localStorage.setItem("matches", JSON.stringify(data.matches));
        console.log("✅ Matches guardados en localStorage:", data.matches);
      }
      
      // Redirigir o actualizar estado
      onOpenChange(false);
      navigate("/dashboard");
    } else {
      setError(data.error);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-foreground">
            Iniciar sesión
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-200 border-border text-foreground placeholder:text-text-tertiary"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-surface-200 border-border text-foreground placeholder:text-text-tertiary pr-10"
                required
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

          {error && (
            <p className="text-black text-sm font-medium" style={{ color: "red" }}>
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" variant="default">
            Entrar
          </Button>
          
          <p className="text-center text-sm text-text-secondary">
            ¿Olvidaste tu contraseña?{" "}
            <button type="button" className="text-foreground underline hover:no-underline">
              Recupérala aquí
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
