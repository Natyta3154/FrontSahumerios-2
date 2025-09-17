
"use client";

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { deleteProduct } from './actions';
import { AdminProductForm } from './product-form';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

interface DashboardTabsProps {
    products: Product[];
}

// Este componente ya no usa Tabs, ahora solo renderiza la tabla de productos.
export function DashboardTabs({ products }: DashboardTabsProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  // El token ya no se necesita, la cookie se maneja automáticamente.

  const handleDelete = (productId: number) => {
    startTransition(async () => {
      // La Server Action ya no requiere el token.
      const result = await deleteProduct(productId);
      if (result?.error) {
        toast({
          title: "Error al eliminar",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Éxito",
          description: "Producto eliminado correctamente.",
        });
      }
    });
  };

  return (
      <div className="bg-card border rounded-lg">
        <div className="flex justify-end p-4 border-b">
            <AdminProductForm />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[64px] sm:table-cell">Imagen</TableHead>
              <TableHead className="hidden sm:table-cell">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden lg:table-cell">Stock</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="hidden lg:table-cell">Mayorista</TableHead>
              <TableHead className="hidden md:table-cell">% Dto</TableHead>
              <TableHead className="hidden md:table-cell">Ingreso Total</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={product.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.image || 'https://placehold.co/64x64/EEE/31343C?text=?'}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-mono text-xs hidden sm:table-cell">{product.id}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{product.category}</TableCell>
                <TableCell>
                  <Badge variant={product.activo ? "default" : "destructive"} className="capitalize">
                    {product.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{product.stock}</TableCell>
                  <TableCell>
                  <div className="flex flex-col">
                    <span className={`font-semibold ${product.onSale ? 'text-destructive' : ''}`}>
                      ${product.price.toFixed(2)}
                    </span>
                    {product.onSale && product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">${product.precioMayorista?.toFixed(2) ?? 'N/A'}</TableCell>
                <TableCell className="hidden md:table-cell">{product.porcentajeDescuento ?? '—'}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.totalIngresado ?? 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                      <AdminProductForm product={product} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={isPending}>Eliminar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el producto.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                disabled={isPending}
                              >
                                {isPending ? "Eliminando..." : "Eliminar"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  )
}
