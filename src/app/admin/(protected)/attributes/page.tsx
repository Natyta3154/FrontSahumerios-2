
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
import { getAttributes } from "@/lib/data";
import { ProductAttribute } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState, useTransition } from "react";
import { useToast } from '@/hooks/use-toast';
import { deleteAttribute } from '../../dashboard/actions';
import { AdminAttributeForm } from './attribute-form';

export default function AdminAttributesPage() {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const { token } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchAttributes = async () => {
    if (token) {
        const fetchedAttributes = await getAttributes(token);
        setAttributes(fetchedAttributes);
    }
  }

  useEffect(() => {
    fetchAttributes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = (attributeId: number) => {
    startTransition(async () => {
      const result = await deleteAttribute(attributeId, token);
      if (result?.error) {
        toast({
          title: "Error al eliminar",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Éxito",
          description: "Atributo eliminado correctamente.",
        });
        await fetchAttributes();
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Atributos</h1>
          <p className="text-muted-foreground">Gestiona los atributos de los productos, como marcas o materiales.</p>
        </div>
        <AdminAttributeForm onAttributeSaved={fetchAttributes} />
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
                {attributes.map((attribute) => (
                    <TableRow key={attribute.id}>
                        <TableCell className="font-mono text-xs">{attribute.id}</TableCell>
                        <TableCell className="font-medium">{attribute.nombre}</TableCell>
                        <TableCell>
                            <div className="flex gap-2 justify-end">
                                <AdminAttributeForm attribute={attribute} onAttributeSaved={fetchAttributes} />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={isPending}>Eliminar</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el atributo.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(attribute.id)}
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
