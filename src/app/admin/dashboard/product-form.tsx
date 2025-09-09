
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import React, { useTransition, useState } from "react"
import { addProduct, editProduct } from "./actions"

export function AdminProductForm({
  product,
  products,
}: {
  product?: Product
  products: Product[]
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [isDialogOpen, setDialogOpen] = useState(false)

  const formAction = async (formData: FormData) => {
    // Cerramos el diálogo inmediatamente para una mejor UX
    setDialogOpen(false) 

    startTransition(async () => {
      const result = product
        ? await editProduct(formData)
        : await addProduct(formData)
      
      if (result?.error) {
        toast({
          title: `Error al ${product ? "editar" : "añadir"}`,
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Éxito",
          description: `Producto ${
            product ? "editado" : "añadido"
          } correctamente.`,
        })
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
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
          <div className="grid gap-4 py-4">
            {product && (
              <Input type="hidden" name="id" defaultValue={product.id} />
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                name="nombre"
                defaultValue={product?.nombre}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio" className="text-right">
                Precio Base
              </Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                defaultValue={product?.precio}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={product?.stock}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoriaNombre" className="text-right">
                Categoría
              </Label>
              <Input
                id="categoriaNombre"
                name="categoriaNombre"
                defaultValue={product?.categoriaNombre}
                placeholder="Ej: Aceite"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                Marca
              </Label>
              <Input
                id="brand"
                name="brand"
                defaultValue={product?.brand}
                placeholder="Ej: ZenScents"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fragancias" className="text-right">
                Fragancias
              </Label>
              <Input
                id="fragancias"
                name="fragancias"
                defaultValue={product?.fragancias?.join(", ")}
                placeholder="Ej: Sándalo, Lavanda"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imagenurl" className="text-right">
                URL de Imagen
              </Label>
              <Input
                id="imagenurl"
                name="imagenurl"
                defaultValue={product?.imagenurl}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                defaultValue={product?.descripcion}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
