
import { orders } from '@/lib/data';
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
import { Eye } from 'lucide-react';

// Página para gestionar los pedidos.
// Por ahora, muestra una tabla con datos de ejemplo.
export default function AdminOrdersPage() {
  const allOrders: Order[] = orders;

  return (
    <>
       <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl">Pedidos</h1>
            <p className="text-muted-foreground">Revisa y gestiona los pedidos de los clientes.</p>
          </div>
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
            {allOrders.map((order) => (
                <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                    <Badge variant={order.status === 'Delivered' ? "default" : "secondary"}>
                    {order.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="destructive" size="sm">Eliminar</Button>
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
