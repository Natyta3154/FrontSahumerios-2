
"use client";

import { products, users, orders } from '@/lib/data';
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
  DialogTrigger,
  DialogClose,
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
import React from 'react';
import type { Product, User, Order } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function AdminDashboardPage() {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  // This is a placeholder. In a real app, this would be a server action.
  async function addProduct(formData: FormData) {
    'use server';
    console.log('Adding product...');
    console.log({
      name: formData.get('name'),
      price: formData.get('price'),
      category: formData.get('category'),
      fragrance: formData.get('fragrance'),
      image: formData.get('image'),
      description: formData.get('description'),
    });
    // Here you would typically revalidate the path to update the product list
  }
  
  async function editProduct(formData: FormData) {
    'use server';
    console.log('Editing product...');
     console.log({
      id: selectedProduct?.id,
      name: formData.get('name'),
      price: formData.get('price'),
      category: formData.get('category'),
      fragrance: formData.get('fragrance'),
      image: formData.get('image'),
      description: formData.get('description'),
    });
    // Here you would typically revalidate the path to update the product list
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>Manage your store's products, users, and orders.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            {/* Products Tab */}
            <TabsContent value="products" className="mt-6">
              <div className="flex justify-end mb-4">
                 <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Product</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <form action={addProduct}>
                        <DialogHeader>
                          <DialogTitle className="font-headline">Add New Product</DialogTitle>
                          <DialogDescription>Fill in the details for the new product.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name-add" className="text-right">Name</Label>
                            <Input id="name-add" name="name" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price-add" className="text-right">Price</Label>
                            <Input id="price-add" name="price" type="number" step="0.01" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category-add" className="text-right">Category</Label>
                            <Input id="category-add" name="category" placeholder="incense, diffusers, or oils" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fragrance-add" className="text-right">Fragrance</Label>
                            <Input id="fragrance-add" name="fragrance" placeholder="e.g. Sandalwood, Lavender" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image-add" className="text-right">Image URL</Label>
                            <Input id="image-add" name="image" placeholder="https://example.com/image.jpg" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description-add" className="text-right">Description</Label>
                            <Textarea id="description-add" name="description" className="col-span-3" required />
                          </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">Save Product</Button>
                            </DialogClose>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Fragrance</TableHead>
                    <TableHead className="hidden lg:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">Price</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
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
                      <TableCell className="hidden md:table-cell">{product.fragrance || 'N/A'}</TableCell>
                      <TableCell className="hidden lg:table-cell max-w-xs truncate">{product.description}</TableCell>
                      <TableCell className="hidden md:table-cell">${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                           <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>Edit</Button>
                              </DialogTrigger>
                           </Dialog>
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Button variant="destructive" size="sm">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                 <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                       This action cannot be undone. This will permanently delete the product.
                                    </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Delete</AlertDialogAction>
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

            {/* Users Tab */}
            <TabsContent value="users" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>Edit</Button>
                            </DialogTrigger>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the user account.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction>Delete</AlertDialogAction>
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

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-6">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
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
                                    <span className="sr-only">View Details</span>
                                </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Order Details</DialogTitle>
                                        <DialogDescription>Order ID: {order.id}</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <p><strong>Customer:</strong> {order.customerName}</p>
                                        <p><strong>Date:</strong> {order.date}</p>
                                        <p><strong>Status:</strong> {order.status}</p>
                                        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                                        <h4 className="font-semibold mt-4">Items:</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead>Quantity</TableHead>
                                                    <TableHead>Price</TableHead>
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
                                          <Button>Close</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                               <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>Edit</Button>
                               </DialogTrigger>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Button variant="destructive" size="sm">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the order.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Delete</AlertDialogAction>
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
      
      {/* Edit Product Dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}>
            <DialogContent className="sm:max-w-[425px]">
                <form action={editProduct}>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Edit Product</DialogTitle>
                        <DialogDescription>Make changes to the product details.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name-edit" className="text-right">Name</Label>
                        <Input id="name-edit" name="name" defaultValue={selectedProduct.name} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price-edit" className="text-right">Price</Label>
                        <Input id="price-edit" name="price" type="number" step="0.01" defaultValue={selectedProduct.price} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category-edit" className="text-right">Category</Label>
                        <Input id="category-edit" name="category" defaultValue={selectedProduct.category} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fragrance-edit" className="text-right">Fragrance</Label>
                        <Input id="fragrance-edit" name="fragrance" defaultValue={selectedProduct.fragrance} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image-edit" className="text-right">Image URL</Label>
                        <Input id="image-edit" name="image" defaultValue={selectedProduct.image} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description-edit" className="text-right">Description</Label>
                        <Textarea id="description-edit" name="description" defaultValue={selectedProduct.description} className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="secondary" onClick={() => setSelectedProduct(null)}>Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                           <Button type="submit">Save Changes</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      )}

      {/* Edit User Dialog */}
       {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}>
            <DialogContent className="sm:max-w-[425px]">
                 <DialogHeader>
                    <DialogTitle className="font-headline">Edit User</DialogTitle>
                    <DialogDescription>Make changes to the user's details.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="user-name-edit" className="text-right">Name</Label>
                        <Input id="user-name-edit" name="name" defaultValue={selectedUser.name} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="user-email-edit" className="text-right">Email</Label>
                        <Input id="user-email-edit" name="email" type="email" defaultValue={selectedUser.email} className="col-span-3" required />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={() => setSelectedUser(null)}>Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit">Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      {/* Edit Order Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
            <DialogContent className="sm:max-w-[425px]">
                 <DialogHeader>
                    <DialogTitle className="font-headline">Edit Order</DialogTitle>
                    <DialogDescription>Update the order status.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order-status-edit" className="text-right">Status</Label>
                         <Select defaultValue={selectedOrder.status}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={() => setSelectedOrder(null)}>Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit">Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

    