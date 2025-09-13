
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

export function AdminUserForm({
  user,
  onUserSaved,
}: {
  user?: User,
  onUserSaved: () => void,
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)
  const { token } = useAuth();
  const [showPassword, setShowPassword] = useState(false)

  const formAction = async (formData: FormData) => {
    // Si no se edita, la contraseña es obligatoria
    if (!user && !formData.get('password')) {
        toast({
            title: `Error al añadir usuario`,
            description: "La contraseña es obligatoria para nuevos usuarios.",
            variant: "destructive",
        });
        return;
    }

    startTransition(async () => {
      const result = await saveUser(formData, token)
      
      if (result?.error) {
        toast({
          title: `Error al ${user ? "editar" : "añadir"}`,
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Éxito",
          description: `Usuario ${user ? "editado" : "añadido"} correctamente.`,
        })
        onUserSaved();
        setDialogOpen(false)
      }
    })
  }

  const triggerButton = user ? (
    <Button variant="outline" size="sm">
      Editar
    </Button>
  ) : (
    <Button>Añadir Usuario</Button>
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form 
          ref={formRef}
          action={formAction}
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
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder={user ? "Dejar en blanco para no cambiar" : ""} />
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
