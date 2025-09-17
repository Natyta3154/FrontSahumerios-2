
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
import { getFragrances } from "@/lib/data";
import { Fragrance } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState, useTransition } from "react";
import { useToast } from '@/hooks/use-toast';
import { deleteFragrance } from '../dashboard/actions';
import { AdminFragranceForm } from './fragrance-form';

export default function AdminFragrancesPage() {
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const { token } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchFragrances = async () => {
    if (token) {
        const fetchedFragrances = await getFragrances(token);
        setFragrances(fetchedFragrances);
    }
  }

  useEffect(() => {
    fetchFragrances();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = (fragranceId: number) => {
    startTransition(async () => {
      const result = await deleteFragrance(fragranceId);
      if (result?.error) {
        toast({
          title: "Error al eliminar",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Éxito",
          description: "Fragancia eliminada correctamente.",
        });
        await fetchFragrances();
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Fragancias</h1>
          <p className="text-muted-foreground">Administra la lista de fragancias disponibles para tus productos.</p>
        </div>
        <AdminFragranceForm onFragranceSaved={fetchFragrances} />
      </div>
       <div className="bg-card border rounded-lg">
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">
                        <span className="sr-only">Acciones</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {fragrances.map((fragrance) => (
                    <TableRow key={fragrance.id}>
                        <TableCell className="font-mono text-xs">{fragrance.id}</TableCell>
                        <TableCell className="font-medium">{fragrance.nombre}</TableCell>
                        <TableCell>
                            <div className="flex gap-2 justify-end">
                                <AdminFragranceForm fragrance={fragrance} onFragranceSaved={fetchFragrances} />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={isPending}>Eliminar</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente la fragancia.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(fragrance.id)}
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
