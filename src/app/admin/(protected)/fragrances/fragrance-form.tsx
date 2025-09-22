
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
import { useToast } from "@/hooks/use-toast"
import type { Fragrance } from "@/app/lib/types"
import React, { useTransition, useState } from "react"
import { saveFragrance } from "../dashboard/actions"

export function AdminFragranceForm({
  fragrance,
  onFragranceSaved,
}: {
  fragrance?: Fragrance,
  onFragranceSaved: () => void,
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  const formAction = async (formData: FormData) => {
    startTransition(async () => {
      // Se elimina el paso del token, la Server Action usa la cookie.
      const result = await saveFragrance(formData)
      
      if (result?.error) {
        toast({
          title: `Error al ${fragrance ? "editar" : "añadir"} fragancia`,
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Éxito",
          description: `Fragancia ${fragrance ? "editada" : "añadida"} correctamente.`,
        })
        onFragranceSaved();
        setDialogOpen(false)
      }
    })
  }

  const triggerButton = fragrance ? (
    <Button variant="outline" size="sm">
      Editar
    </Button>
  ) : (
    <Button>Añadir Fragancia</Button>
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
              {fragrance ? "Editar Fragancia" : "Añadir Nueva Fragancia"}
            </DialogTitle>
            <DialogDescription>
              {fragrance
                ? "Haz cambios en el nombre de la fragancia."
                : "Completa el nombre de la nueva fragancia."}
            </DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
              {fragrance && (
                <Input type="hidden" name="id" defaultValue={fragrance.id} />
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">Nombre</Label>
                <Input id="nombre" name="nombre" defaultValue={fragrance?.nombre} className="col-span-3" required />
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
