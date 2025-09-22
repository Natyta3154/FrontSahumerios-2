
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
import type { ProductAttribute } from "@/app/lib/types"
import React, { useTransition, useState } from "react"
import { saveAttribute } from "../dashboard/actions"

export function AdminAttributeForm({
  attribute,
  onAttributeSaved,
}: {
  attribute?: ProductAttribute,
  onAttributeSaved: () => void,
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  const formAction = async (formData: FormData) => {
    startTransition(async () => {
      // Se elimina el paso del token, la Server Action usa la cookie.
      const result = await saveAttribute(formData)
      
      if (result?.error) {
        toast({
          title: `Error al ${attribute ? "editar" : "añadir"} atributo`,
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Éxito",
          description: `Atributo ${attribute ? "editado" : "añadido"} correctamente.`,
        })
        onAttributeSaved();
        setDialogOpen(false)
      }
    })
  }

  const triggerButton = attribute ? (
    <Button variant="outline" size="sm">
      Editar
    </Button>
  ) : (
    <Button>Añadir Atributo</Button>
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
              {attribute ? "Editar Atributo" : "Añadir Nuevo Atributo"}
            </DialogTitle>
            <DialogDescription>
              {attribute
                ? "Haz cambios en el nombre del atributo."
                : "Completa el nombre del nuevo atributo."}
            </DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
              {attribute && (
                <Input type="hidden" name="id" defaultValue={attribute.id} />
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">Nombre</Label>
                <Input id="nombre" name="nombre" defaultValue={attribute?.nombre} className="col-span-3" required />
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
