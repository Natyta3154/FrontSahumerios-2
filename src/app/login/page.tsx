
"use client";

// =================================================================================
// PÁGINA DE LOGIN UNIFICADA
//
// ¿QUÉ HACE?
// 1. Este es ahora el ÚNICO punto de entrada para todos los usuarios.
// 2. Al enviar el formulario, llama a la función `login` del `AuthContext`.
// 3. No necesita saber si el usuario es admin o no. El contexto y la API se encargan.
// 4. Si el login es exitoso y el usuario es 'ADMIN', el header mostrará el enlace
//    al panel de administración.
// =================================================================================

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

  
const API_BASE_URL_GOOGLE = process.env.URL_BASE_GOOGLE; // Cambia esto si tu API está en otra URL.


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth(); // Se importa 'user' para la redirección.
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Llama a la función de login simplificada, sin el flag de admin.
      await login(email, password);
      
      const next = searchParams.get('next');
      
      // COMENTARIO: Pequeña mejora: si el usuario es admin, lo redirigimos
      // directamente al dashboard después del login.
      if (user?.rol === 'ADMIN') {
        router.push('/admin/dashboard');
        return;
      }

      if (next) {
        router.push(next);
      } else {
        router.push('/');
      }
    } catch(error) {
      toast({
        title: "Error de Inicio de Sesión",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
            <CardHeader>
            <CardTitle className="font-headline text-2xl">Login</CardTitle>
            <CardDescription>Ingresa tu correo para acceder a tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" required disabled={isLoading} />
            </div>
            <div className="grid gap-2 relative">
                <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                    ¿Olvidaste tu contraseña?
                </Link>
                </div>
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required disabled={isLoading} />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-[28px] h-9 w-9 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando Sesión...' : 'Login'}
            </Button>
            </CardContent>
            <CardFooter className="text-center text-sm">
                ¿No tienes una cuenta?{' '}
                <Link href="/signup" className="underline ml-1">
                Regístrate
                </Link>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
