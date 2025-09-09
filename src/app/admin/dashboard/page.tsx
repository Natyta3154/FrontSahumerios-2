
"use client";

import { getProducts, users, orders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye } from 'lucide-react';
import React, { useEffect, useState, useTransition } from 'react';
import type { Product, User, Order } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// NOTA: Se importan las funciones (Server Actions) desde 'actions.ts' para conectar los formularios a la API.
import { addProduct, editProduct, deleteProduct } from './actions';
import { useToast } from '@/hooks/use-toast';


export default function AdminDashboardPage() {
  // ESTADO: Almacena la lista de productos, usuarios y pedidos.
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const loadProducts = async () => {
      // VISUALIZACIÓN: Llama a getProducts (de data.ts) para obtener los datos.
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
  };

  // EFECTO: Carga los productos desde la API cuando el componente se monta.
  useEffect(() => {
    loadProducts();
  }, []);

  // MANEJADOR: Llama a la Server Action para eliminar un producto y refresca la lista.
  const handleDeleteProduct = async (productId: number) => {
    startTransition(async () => {
        const result = await deleteProduct(productId);
        if (result?.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Éxito', description: 'Producto eliminado correctamente.' });
            await loadProducts();
        }
    });
  };

  const handleAddProduct = async (formData: FormData) => {
    startTransition(async () => {
        const result = await addProduct(formData);
        if (result?.error) {
            toast({ title: 'Error al añadir', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Éxito', description: 'Producto añadido correctamente.' });
            await loadProducts();
            setAddDialogOpen(false); // Cierra el diálogo en caso de éxito
        }
    });
  }

  const handleEditProduct = async (formData: FormData) => {
     startTransition(async () => {
        const result = await editProduct(formData);
        if (result?.error) {
            toast({ title: 'Error al editar', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Éxito', description: 'Producto editado correctamente.' });
            await loadProducts();
            setSelectedProduct(null); // Cierra el diálogo de edición
        }
    });
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Panel de Administración</CardTitle>
            <CardDescription>Gestiona los productos, usuarios y pedidos de tu tienda.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* VISUALIZACIÓN: Pestañas para organizar el contenido del panel. */}
          <Tabs defaultValue="products">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
            </TabsList>
            
            {/* Pestaña de Productos */}
            <TabsContent value="products" className="mt-6">
              <div className="flex justify-end mb-4">
                 <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Añadir Producto</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      {/* CONEXIÓN: El 'action' ahora llama a nuestra función manejadora. */}
                      <form action={handleAddProduct}>
                        <DialogHeader>
                          <DialogTitle className="font-headline">Añadir Nuevo Producto</DialogTitle>
                          <DialogDescription>Completa los detalles del nuevo producto.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {/* Campos del formulario */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre-add" className="text-right">Nombre</Label>
                            <Input id="nombre-add" name="nombre" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="precio-add" className="text-right">Precio</Label>
                            <Input id="precio-add" name="precio" type="number" step="0.01" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock-add" className="text-right">Stock</Label>
                            <Input id="stock-add" name="stock" type="number" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="categoriaNombre-add" className="text-right">Categoría</Label>
                            <Input id="categoriaNombre-add" name="categoriaNombre" placeholder="Ej: Aceite" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="brand-add" className="text-right">Marca</Label>
                            <Input id="brand-add" name="brand" placeholder="Ej: ZenScents" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fragancias-add" className="text-right">Fragancias</Label>
                            <Input id="fragancias-add" name="fragancias" placeholder="Ej: Sándalo, Lavanda" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imagenurl-add" className="text-right">URL de Imagen</Label>
                            <Input id="imagenurl-add" name="imagenurl" placeholder="https://ejemplo.com/imagen.jpg" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="descripcion-add" className="text-right">Descripción</Label>
                            <Textarea id="descripcion-add" name="descripcion" className="col-span-3" required />
                          </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Guardando...' : 'Guardar Producto'}
                            </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
              </div>
              {/* VISUALIZACIÓN: Tabla que muestra los productos obtenidos de la API. */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="hidden md:table-cell">Marca</TableHead>
                    <TableHead className="hidden md:table-cell">Precio Final</TableHead>
                    <TableHead>
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
                          src={product.image}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{product.brand || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                           <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>Editar</Button>
                              </DialogTrigger>
                              {/* El contenido del diálogo de edición se renderiza más abajo */}
                           </Dialog>
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Button variant="destructive" size="sm">Eliminar</Button>
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
                                    <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Eliminar</AlertDialogAction>
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
                              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>Editar</Button>
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
                                  <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>Editar</Button>
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
        </CardContent>
      </Card>
      
      {/* VISUALIZACIÓN: Diálogo para editar un producto. Se muestra cuando 'selectedProduct' no es nulo. */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}>
            <DialogContent className="sm:max-w-[425px]">
                {/* CONEXIÓN: Este formulario llama a la Server Action 'editProduct'. */}
                <form action={handleEditProduct}>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Editar Producto</DialogTitle>
                        <DialogDescription>Haz cambios en los detalles del producto.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input type="hidden" name="id" defaultValue={selectedProduct.id} />
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nombre-edit" className="text-right">Nombre</Label>
                          <Input id="nombre-edit" name="nombre" defaultValue={selectedProduct.nombre} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="precio-edit" className="text-right">Precio</Label>
                          <Input id="precio-edit" name="precio" type="number" step="0.01" defaultValue={selectedProduct.precio} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock-edit" className="text-right">Stock</Label>
                            <Input id="stock-edit" name="stock" type="number" defaultValue={selectedProduct.stock} className="col-span-3" required />
                          </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="categoriaNombre-edit" className="text-right">Categoría</Label>
                          <Input id="categoriaNombre-edit" name="categoriaNombre" defaultValue={selectedProduct.categoriaNombre} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="brand-edit" className="text-right">Marca</Label>
                          <Input id="brand-edit" name="brand" defaultValue={selectedProduct.brand} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fragancias-edit" className="text-right">Fragancias</Label>
                          <Input id="fragancias-edit" name="fragancias" defaultValue={selectedProduct.fragancias?.join(', ')} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="imagenurl-edit" className="text-right">URL de Imagen</Label>
                          <Input id="imagenurl-edit" name="imagenurl" defaultValue={selectedProduct.imagenurl} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="descripcion-edit" className="text-right">Descripción</Label>                          <Textarea id="descripcion-edit" name="descripcion" defaultValue={selectedProduct.descripcion} className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="secondary" onClick={() => setSelectedProduct(null)}>Cancelar</Button>
                        </DialogClose>
                           <Button type="submit" disabled={isPending}>
                             {isPending ? 'Guardando...' : 'Guardar Cambios'}
                           </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
