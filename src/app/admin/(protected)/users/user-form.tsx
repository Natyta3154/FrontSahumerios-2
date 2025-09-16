
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"
import React, { useTransition, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { saveUser } from "../dashboard/actions"
import { Eye, EyeOff } from "lucide-react"

// =================================================================================
// FORMULARIO DE USUARIO (AÑADIR/EDITAR)
//
// ¿QUÉ HACE?
// 1. Se presenta como un diálogo modal.
// 2. Sirve tanto para crear un nuevo usuario como para editar uno existente.
// 3. Si se le pasa un prop `user`, se pre-llena con sus datos para edición.
// 4. Al enviar, llama a la Server Action `saveUser` para persistir los cambios.
// =================================================================================

export function AdminUserForm({
  user, // Prop opcional: si existe, el formulario está en modo "edición".
  onUserSaved, // Callback para refrescar la lista de usuarios después de guardar.
}: {
  user?: User,
  onUserSaved: () => void,
}) {
  const [isPending, startTransition] = useTransition() // Hook para manejar el estado de carga de la Server Action.
  const { toast } = useToast()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)
  const { token } = useAuth(); // Obtiene el token del admin logueado para autorizar la petición.
  const [showPassword, setShowPassword] = useState(false)

  // --- MANEJADOR DEL FORMULARIO ---
  const formAction = async (formData: FormData) => {
    const password = formData.get('password') as string;

    // Validación del lado del cliente: la contraseña es obligatoria para nuevos usuarios.
    if (!user && !password) {
        toast({
            title: `Error al añadir usuario`,
            description: "La contraseña es obligatoria para nuevos usuarios.",
            variant: "destructive",
        });
        return; // Detiene la ejecución si no se cumple la validación.
    }

    // `startTransition` envuelve la llamada a la Server Action.
    // Esto evita que la UI se bloquee mientras la acción se ejecuta en el servidor.
    startTransition(async () => {
      // --- LLAMADA A LA SERVER ACTION ---
      const result = await saveUser(formData, token)
      
      if (result?.error) {
        // Muestra notificación de error si la Server Action devolvió un error.
        toast({
          title: `Error al ${user ? "editar" : "añadir"}`,
          description: result.error,
          variant: "destructive",
        })
      } else {
        // Muestra notificación de éxito y actualiza la UI.
        toast({
          title: "Éxito",
          description: `Usuario ${user ? "editado" : "añadido"} correctamente.`,
        })
        onUserSaved(); // Llama al callback para refrescar la tabla de usuarios.
        setDialogOpen(false) // Cierra el diálogo modal.
      }
    })
  }

  // El texto del botón de activación cambia si es para editar o añadir.
  const triggerButton = user ? (
    <Button variant="outline" size="sm">
      Editar
    </Button>
  ) : (
    <Button>Añadir Usuario</Button>
  )

  // --- RENDERIZADO DEL DIÁLOGO Y FORMULARIO ---
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form 
          ref={formRef}
          action={formAction}
          // Se usa `onSubmit` para interceptar el envío y poder usar `startTransition`.
          onSubmit={(e) => {
            e.preventDefault();
            formAction(new FormData(e.currentTarget));
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-headline">
              {user ? "Editar Usuario" : "Añadir Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription>
              {user
                ? "Haz cambios en los detalles del usuario."
                : "Completa los detalles del nuevo usuario."}
            </DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Si es edición, incluye el ID del usuario en un campo oculto. */}
              {user && (
                <Input type="hidden" name="id" defaultValue={user.id} />
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">Nombre</Label>
                <Input id="nombre" name="nombre" defaultValue={user?.nombre} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Contraseña</Label>
                <div className="col-span-3 relative">
                    {/* El campo no es requerido si se está editando un usuario. */}
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder={user ? "Dejar en blanco para no cambiar" : ""} required={!user} />
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-full -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rol" className="text-right">Rol</Label>
                <Select name="rol" defaultValue={user?.rol || 'USER'}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">Usuario</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Guardando..."
                : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
