
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import React, { useTransition, useState } from "react"
import { addProduct, editProduct } from "./actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/auth-context"

export function AdminProductForm({
  product,
}: {
  product?: Product
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)
  const { token } = useAuth(); // Obtenemos el token del contexto

  const formAction = async (formData: FormData) => {
    startTransition(async () => {
      // Pasamos el token a la Server Action
      const result = product
        ? await editProduct(formData, token)
        : await addProduct(formData, token)
      
      if (result?.error) {
        toast({
          title: `Error al ${product ? "editar" : "añadir"}`,
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Éxito",
          description: `Producto ${product ? "editado" : "añadido"} correctamente.`,
        })
        setDialogOpen(false)
      }
    })
  }

  const triggerButton = product ? (
    <Button variant="outline" size="sm">
      Editar
    </Button>
  ) : (
    <Button>Añadir Producto</Button>
  )
  
  const atributosString = product?.atributos?.map(a => `${a.nombre}:${a.valor}`).join(", ") || "";
  const fraganciasString = product?.fragancias?.join(", ") || "";

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <form 
          ref={formRef}
          action={formAction}
        >
          <DialogHeader>
            <DialogTitle className="font-headline">
              {product ? "Editar Producto" : "Añadir Nuevo Producto"}
            </DialogTitle>
            <DialogDescription>
              {product
                ? "Haz cambios en los detalles del producto."
                : "Completa los detalles del nuevo producto."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="grid gap-4 py-4">
              {product && (
                <Input type="hidden" name="id" defaultValue={product.id} />
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">Nombre</Label>
                <Input id="nombre" name="nombre" defaultValue={product?.nombre} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descripcion" className="text-right">Descripción</Label>
                <Textarea id="descripcion" name="descripcion" defaultValue={product?.descripcion} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precio" className="text-right">Precio Base</Label>
                <Input id="precio" name="precio" type="number" step="0.01" defaultValue={product?.precio} className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precioMayorista" className="text-right">Precio Mayorista</Label>
                <Input id="precioMayorista" name="precioMayorista" type="number" step="0.01" defaultValue={product?.precioMayorista ?? ''} className="col-span-3" placeholder="Opcional" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input id="stock" name="stock" type="number" defaultValue={product?.stock} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoriaNombre" className="text-right">Categoría</Label>
                <Input id="categoriaNombre" name="categoriaNombre" defaultValue={product?.categoriaNombre} placeholder="Ej: Aceite" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fragancias" className="text-right">Fragancias</Label>
                <Input id="fragancias" name="fragancias" defaultValue={fraganciasString} placeholder="Ej: Sándalo, Lavanda" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="atributos" className="text-right">Atributos</Label>
                <Textarea id="atributos" name="atributos" defaultValue={atributosString} placeholder="Formato: Nombre:Valor, Otro:Valor" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imagenurl" className="text-right">URL de Imagen</Label>
                <Input id="imagenurl" name="imagenurl" defaultValue={product?.imagenurl} placeholder="https://ejemplo.com/imagen.jpg" className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="porcentajeDescuento" className="text-right">% Descuento</Label>
                <Input id="porcentajeDescuento" name="porcentajeDescuento" type="number" defaultValue={product?.porcentajeDescuento ?? ""} placeholder="Ej: 10 (opcional)" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fechaInicioDescuento" className="text-right">Inicio Descuento</Label>
                <Input id="fechaInicioDescuento" name="fechaInicioDescuento" type="date" defaultValue={product?.fechaInicioDescuento?.split('T')[0]} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fechaFinDescuento" className="text-right">Fin Descuento</Label>
                <Input id="fechaFinDescuento" name="fechaFinDescuento" type="date" defaultValue={product?.fechaFinDescuento?.split('T')[0]} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalIngresado" className="text-right">Ingreso Total</Label>
                <Input id="totalIngresado" name="totalIngresado" type="number" step="0.01" defaultValue={product?.totalIngresado ?? ''} className="col-span-3" placeholder="Opcional" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activo" className="text-right">Activo</Label>
                <Switch id="activo" name="activo" defaultChecked={product?.activo ?? true} />
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
