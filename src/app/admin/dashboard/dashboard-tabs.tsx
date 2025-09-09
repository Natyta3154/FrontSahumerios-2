
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
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

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye } from 'lucide-react';
import type { Product, User, Order } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { deleteProduct } from './actions';
import { AdminProductForm } from './product-form';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { useAuth } from '@/context/auth-context';


interface DashboardTabsProps {
    products: Product[];
    users: User[];
    orders: Order[];
}

// Este es un Componente de Cliente, por eso tiene la directiva "use client".
// Maneja toda la interactividad (pestañas, diálogos, etc.).
export function DashboardTabs({ products, users, orders }: DashboardTabsProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { token } = useAuth(); // Obtenemos el token desde el contexto

  const handleDelete = (productId: number) => {
    startTransition(async () => {
      // Pasamos el token a la Server Action
      const result = await deleteProduct(productId, token);
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
      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>
        
        {/* Pestaña de Productos */}
        <TabsContent value="products" className="mt-6">
          <div className="flex justify-end mb-4">
             {/* El componente del formulario se encarga de sí mismo, tanto para añadir como para editar */}
             <AdminProductForm />
          </div>
          {/* VISUALIZACIÓN: Tabla que muestra los productos obtenidos de la API. */}
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
                   <TableCell className="hidden md:table-cell">${product.totalIngresado?.toFixed(2) ?? '0.00'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                       {/* Pasamos el producto específico para que el formulario sepa que es una edición */}
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
                                {/* CONEXIÓN: Llama a la función que ejecuta la Server Action de eliminar. */}
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
        </TabsContent>

        {/* Pestaña de Usuarios */}
        {/* NOTA: Esta sección actualmente usa datos de muestra. Deberías conectarla a tu API. */}
        <TabsContent value="users" className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Usuario</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      {/* CONEXIÓN (POR HACER): Conectar este diálogo a una Server Action 'editUser'. */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Editar</Button>
                        </DialogTrigger>
                         <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Editar Usuario</DialogTitle>
                                <DialogDescription>Haz cambios en los detalles del usuario.</DialogDescription>
                            </DialogHeader>
                             <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="user-name-edit" className="text-right">Nombre</Label>
                                    <Input id="user-name-edit" name="name" defaultValue={user.name} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="user-email-edit" className="text-right">Email</Label>
                                    <Input id="user-email-edit" name="email" type="email" defaultValue={user.email} className="col-span-3" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancelar</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type="submit">Guardar Cambios</Button>
                                </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                      </Dialog>
                      {/* CONEXIÓN (POR HACER): Conectar este diálogo a una Server Action 'deleteUser'. */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Eliminar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta del usuario.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Pestaña de Pedidos */}
        {/* NOTA: Esta sección actualmente usa datos de muestra. Deberías conectarla a tu API. */}
        <TabsContent value="orders" className="mt-6">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                     <div className="flex gap-2 justify-end">
                        <Dialog>
                            <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver Detalles</span>
                            </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Detalles del Pedido</DialogTitle>
                                    <DialogDescription>ID de Pedido: {order.id}</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <p><strong>Cliente:</strong> {order.customerName}</p>
                                    <p><strong>Fecha:</strong> {order.date}</p>
                                    <p><strong>Estado:</strong> {order.status}</p>
                                    <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                                    <h4 className="font-semibold mt-4">Artículos:</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Producto</TableHead>
                                                <TableHead>Cantidad</TableHead>
                                                <TableHead>Precio</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map(item => (
                                                <TableRow key={item.productId}>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                      <Button>Cerrar</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        {/* CONEXIÓN (POR HACER): Conectar este diálogo a una Server Action 'updateOrderStatus'. */}
                        <Dialog>
                           <DialogTrigger asChild>
                              <Button variant="outline" size="sm">Editar</Button>
                           </DialogTrigger>
                           <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Editar Pedido</DialogTitle>
                                <DialogDescription>Actualizar el estado del pedido.</DialogDescription>
                            </DialogHeader>
                             <div className="grid gap-4 py-4">
                                <p><strong>ID de Pedido:</strong> {order.id}</p>
                                <p><strong>Cliente:</strong> {order.customerName}</p>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="order-status-edit" className="text-right">Estado</Label>
                                    <Select defaultValue={order.status}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pendiente</SelectItem>
                                            <SelectItem value="Shipped">Enviado</SelectItem>
                                            <SelectItem value="Delivered">Entregado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancelar</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type="submit">Guardar Cambios</Button>
                                </DialogClose>
                            </DialogFooter>
                           </DialogContent>
                        </Dialog>
                       {/* CONEXIÓN (POR HACER): Conectar este diálogo a una Server Action 'deleteOrder'. */}
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="sm">Eliminar</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el pedido.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction>Eliminar</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                       </AlertDialog>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
  )
}
