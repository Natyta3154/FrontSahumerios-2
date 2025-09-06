
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (password !== confirmPassword) {
      toast({
        title: "Error de Registro",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('https://apisahumerios.onrender.com/usuarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          email: email,
          password: password,
          rol: 'user', // Registrar siempre como usuario común
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Ocurrió un error al registrarse.');
      }

      // Si el registro es exitoso, iniciar sesión automáticamente
      const newUser = {
        id: data.usuario.id,
        nombre: data.usuario.nombre,
        email: data.usuario.email,
        rol: data.usuario.rol,
      };
      
      login(newUser);

      toast({
        title: "¡Registro Exitoso!",
        description: data.mensaje,
      });

      router.push('/'); // Redirige al inicio después de registrarse

    } catch (error) {
       toast({
        title: "Error de Registro",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };


  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Fondo de aromaterapia"
        data-ai-hint="zen background"
        fill
        className="object-cover absolute inset-0 z-0"
      />
      <div className="absolute inset-0 bg-background/80 z-10" />
      <Card className="w-full max-w-sm z-20">
        <form onSubmit={handleSignup}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Regístrate</CardTitle>
            <CardDescription>Ingresa tu información para crear una cuenta.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input id="confirm-password" name="confirm-password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Crear Cuenta
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="underline ml-1">
                Inicia Sesión
              </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
