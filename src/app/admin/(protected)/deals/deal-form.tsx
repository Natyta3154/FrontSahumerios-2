
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
import { saveDeal } from "../dashboard/actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"

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

  const formAction = async (formData: FormData) => {
    startTransition(async () => {
      // Se elimina el paso del token, la Server Action usa la cookie.
      const result = await saveDeal(formData)
      
      if (result?.success) {
        toast({
          title: `Error al ${deal ? "editar" : "añadir"} oferta`,
          description: result.success,
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
      <DialogContent className="sm:max-w-xl">
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
                : "Completa los detalles requeridos para la nueva oferta."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="grid gap-4 py-4">
              {deal && (
                <Input type="hidden" name="idOferta" defaultValue={deal.idOferta} />
              )}
              {/* Para la creación, solo necesitamos los campos que espera la API */}
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="producto_id" className="text-right">ID de Producto</Label>
                <Input id="producto_id" name="producto_id" type="number" defaultValue={deal?.productoId} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valor_descuento" className="text-right">Valor Descuento</Label>
                <Input id="valor_descuento" name="valor_descuento" type="number" step="0.01" defaultValue={deal?.valorDescuento} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipo_descuento" className="text-right">Tipo Descuento</Label>
                <Input id="tipo_descuento" name="tipo_descuento" defaultValue={deal?.tipoDescuento} className="col-span-3" placeholder="Ej: PORCENTAJE, FIJO" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha_inicio" className="text-right">Fecha Inicio</Label>
                <Input id="fecha_inicio" name="fecha_inicio" type="date" defaultValue={deal?.fechaInicio?.split('T')[0] ?? ""} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha_fin" className="text-right">Fecha Fin</Label>
                <Input id="fecha_fin" name="fecha_fin" type="date" defaultValue={deal?.fechaFin?.split('T')[0] ?? ""} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activo" className="text-right">Activo (Estado)</Label>
                <Switch id="activo" name="activo" defaultChecked={deal?.estado ?? true} />
              </div>
            </div>
          </ScrollArea>
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
