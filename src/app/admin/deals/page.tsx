
"use client";

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

import { Button } from '@/components/ui/button';
import { getDeals } from "@/lib/data";
import { Deal } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState, useTransition } from "react";
import { useToast } from '@/hooks/use-toast';
import { deleteDeal } from '../dashboard/actions';
import { AdminDealForm } from './deal-form';
import { Badge } from '@/components/ui/badge';


export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const { token } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchDeals = async () => {
    if (token) {
        const fetchedDeals = await getDeals(token);
        setDeals(fetchedDeals);
    }
  }

  useEffect(() => {
    fetchDeals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = (dealId: number) => {
    startTransition(async () => {
      const result = await deleteDeal(dealId, token);
      if (result?.error) {
        toast({
          title: "Error al eliminar",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Éxito",
          description: "Oferta eliminada correctamente.",
        });
        await fetchDeals();
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Ofertas</h1>
          <p className="text-muted-foreground">Crea y gestiona descuentos y promociones.</p>
        </div>
        <AdminDealForm onDealSaved={fetchDeals} />
      </div>
      <div className="bg-card border rounded-lg">
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Producto ID</TableHead>
                    <TableHead>Valor Dto.</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead className="text-right">
                        <span className="sr-only">Acciones</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {deals.map((deal, index) => (
                    <TableRow key={deal.id || index}>
                        <TableCell className="font-mono text-xs">{deal.id}</TableCell>
                        <TableCell className="font-medium">{deal.nombre}</TableCell>
                        <TableCell>{deal.producto_id}</TableCell>
                        <TableCell>{deal.valor_descuento}</TableCell>
                         <TableCell>
                          <Badge variant={deal.activo ? "default" : "destructive"} className="capitalize">
                            {deal.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2 justify-end">
                                <AdminDealForm deal={deal} onDealSaved={fetchDeals} />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={isPending}>Eliminar</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente la oferta.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(deal.id)}
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
