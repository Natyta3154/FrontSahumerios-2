
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
import type { Deal } from "@/lib/types"
import React, { useTransition, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { saveDeal } from "../dashboard/actions"

export function AdminDealForm({
  deal,
  onDealSaved,
}: {
  deal?: Deal,
  onDealSaved: () => void,
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)
  const { token } = useAuth();

  const formAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await saveDeal(formData, token)
      
      if (result?.error) {
        toast({
          title: `Error al ${deal ? "editar" : "añadir"}`,
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Éxito",
          description: `Oferta ${deal ? "editada" : "añadida"} correctamente.`,
        })
        onDealSaved();
        setDialogOpen(false)
      }
    })
  }

  const triggerButton = deal ? (
    <Button variant="outline" size="sm">
      Editar
    </Button>
  ) : (
    <Button>Añadir Oferta</Button>
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
              {deal ? "Editar Oferta" : "Añadir Nueva Oferta"}
            </DialogTitle>
            <DialogDescription>
              {deal
                ? "Haz cambios en los detalles de la oferta."
                : "Completa los detalles de la nueva oferta."}
            </DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
              {deal && (
                <Input type="hidden" name="id" defaultValue={deal.id} />
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productoId" className="text-right">ID de Producto</Label>
                <Input id="productoId" name="productoId" type="number" defaultValue={deal?.productoId} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="porcentajeDescuento" className="text-right">% Descuento</Label>
                <Input id="porcentajeDescuento" name="porcentajeDescuento" type="number" defaultValue={deal?.porcentajeDescuento} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fechaInicio" className="text-right">Fecha Inicio</Label>
                <Input id="fechaInicio" name="fechaInicio" type="date" defaultValue={deal?.fechaInicio?.split('T')[0] ?? ""} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fechaFin" className="text-right">Fecha Fin</Label>
                <Input id="fechaFin" name="fechaFin" type="date" defaultValue={deal?.fechaFin?.split('T')[0] ?? ""} className="col-span-3" required />
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
