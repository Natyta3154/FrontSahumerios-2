
'use client';
import { getOrders } from '@/lib/data';
import type { Order } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { useTransition, useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { deleteOrder } from '../../dashboard/actions';


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    async function fetchOrders() {
        const fetchedOrders = await getOrders(token);
        setOrders(fetchedOrders);
    }
    if (token) {
        fetchOrders();
    }
  }, [token]);

  const handleDelete = (orderId: string) => {
    startTransition(async () => {
      const result = await deleteOrder(orderId, token);
      if (result?.error) {
        toast({
          title: "Error al eliminar",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Éxito",
          description: "Pedido eliminado correctamente.",
        });
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    });
  };

  return (
    <>
       <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl">Pedidos</h1>
            <p className="text-muted-foreground">Revisa y gestiona los pedidos de los clientes.</p>
          </div>
          {/* Aquí podría ir un botón para crear un pedido manualmente */}
      </div>
      <div className="bg-card border rounded-lg">
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
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                    <Badge variant={order.status === 'Delivered' ? "default" : "secondary"}>
                    {order.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                      {/* TODO: Implementar formulario de edición de pedidos */}
                      <Button variant="outline" size="sm">Editar</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={isPending}>Eliminar</Button>
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
                              <AlertDialogAction
                                onClick={() => handleDelete(order.id)}
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
    </>
  );
}
