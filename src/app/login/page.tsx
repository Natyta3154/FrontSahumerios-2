
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // En una aplicación real, aquí validarías las credenciales con tu backend.
    // Por ahora, simulamos un inicio de sesión exitoso.
    const user = {
      id: 1, // Simulado
      nombre: 'Usuario Logueado',
      email: 'usuario@example.com',
      rol: 'user'
    };
    login(user);
    
    // Redirigir al usuario.
    const next = searchParams.get('next');
    if (next) {
      router.push(next);
    } else {
      router.push('/');
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
                <Input id="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                    ¿Olvidaste tu contraseña?
                </Link>
                </div>
                <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
                Login
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
