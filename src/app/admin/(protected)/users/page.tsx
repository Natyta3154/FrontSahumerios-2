
'use client';
import { getUsers } from '@/lib/data';
import type { User } from '@/lib/types';
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
import { useToast } from '@/hooks/use-toast';
import { useTransition, useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { deleteUser } from '../../dashboard/actions';
import { AdminUserForm } from './user-form';
import { Badge } from '@/components/ui/badge';


export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const { token } = useAuth();

    useEffect(() => {
        async function fetchUsers() {
            const fetchedUsers = await getUsers(token);
            setUsers(fetchedUsers);
        }
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const handleDelete = (userId: number) => {
        startTransition(async () => {
            const result = await deleteUser(userId, token);
            if (result?.error) {
                toast({
                    title: "Error al eliminar",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Éxito",
                    description: "Usuario eliminado correctamente.",
                });
                setUsers(prev => prev.filter(u => u.id !== userId));
            }
        });
    };

    return (
    <>
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="font-headline text-2xl">Usuarios</h1>
                <p className="text-muted-foreground">Gestiona las cuentas de los usuarios registrados.</p>
            </div>
            <AdminUserForm onUserSaved={async () => setUsers(await getUsers(token))} />
        </div>
        <div className="bg-card border rounded-lg">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead className="text-right">
                        <span className="sr-only">Acciones</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.rol === 'ADMIN' ? "default" : "secondary"}>
                            {user.rol}
                        </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.fechaRegistro).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <div className="flex gap-2 justify-end">
                            <AdminUserForm user={user} onUserSaved={async () => setUsers(await getUsers(token))} />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={isPending}>Eliminar</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDelete(user.id)}
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
