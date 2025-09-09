
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // MANEJADOR: Se ejecuta cuando se envía el formulario de login.
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // CONEXIÓN: Esta es la llamada 'fetch' al endpoint de tu API para la autenticación de administradores.
      const response = await fetch('https://apisahumerios.onrender.com/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error de autenticación.');
      }

      // LÓGICA: Verifica si el rol del usuario es de administrador.
      if (data.usuario && data.usuario.rol === 'ROLE_ADMIN') {
        toast({
          title: "Inicio de Sesión Exitoso",
          description: `Bienvenido, ${data.usuario.nombre}.`,
        });
        // En una aplicación real, aquí guardarías el token (ej. en cookies)
        // y el estado del usuario en un contexto global.
        // Por ahora, solo redirigimos al panel.
        router.push('/admin/dashboard');
      } else {
        throw new Error('Acceso denegado. Se requiere rol de administrador.');
      }

    } catch (error) {
       toast({
        title: "Error de Inicio de Sesión",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }

  return (
    // VISUALIZACIÓN: Renderiza el formulario de login para el administrador.
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
            <CardHeader>
            <CardTitle className="font-headline text-2xl">Acceso Admin</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al panel.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="admin@ejemplo.com" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
                Acceder
            </Button>
            </CardContent>
        </form>
      </Card>
    </div>
  );
}
