import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdminLoginPage() {
    
  async function handleLogin(formData: FormData) {
    'use server';
    // Aquí normalmente manejarías la autenticación.
    // Por ahora, solo redirigimos al panel de control.
    redirect('/admin/dashboard');
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Card className="w-full max-w-sm">
        <form action={handleLogin}>
            <CardHeader>
            <CardTitle className="font-headline text-2xl">Acceso Admin</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al panel.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="admin@ejemplo.com" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" required />
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
