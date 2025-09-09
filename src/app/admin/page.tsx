
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // MANEJADOR: Se ejecuta cuando se envía el formulario de login.
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password, true); // Llama a la función login del contexto
      toast({
        title: "Inicio de Sesión Exitoso",
        description: `Bienvenido. Redirigiendo al panel...`,
      });
      router.push('/admin/dashboard');
    } catch (error) {
       toast({
        title: "Error de Inicio de Sesión",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
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
                <Input id="email" name="email" type="email" placeholder="admin@ejemplo.com" required disabled={isLoading} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" required disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Accediendo...' : 'Acceder'}
            </Button>
            </CardContent>
        </form>
      </Card>
    </div>
  );
}
