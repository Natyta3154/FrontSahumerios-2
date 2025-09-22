'use client';

import { useState, useTransition } from 'react';
import type { User } from '@/lib/types';
import { deleteUser } from '../dashboard/actions';
import { useToast } from '@/hooks/use-toast';
import { AdminUserForm } from './user-form';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface Props {
    initialUsers: User[];
}

export function AdminUsersClient({ initialUsers }: Props) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDelete = (userId: number) => {
        startTransition(async () => {
            const result = await deleteUser(userId);
            if (result?.error) {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            } else {
                toast({ title: 'Éxito', description: 'Usuario eliminado correctamente.' });
                setUsers(users.filter(u => u.id !== userId));
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
                <AdminUserForm
  onUserSaved={(newUser) => {
    if (!newUser) return; // evita undefined
    setUsers([...users, newUser]);
  }}
/>

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
                            <TableHead className="text-right"><span className="sr-only">Acciones</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.nombre}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.rol === 'ADMIN' ? 'default' : 'secondary'}>{user.rol}</Badge>
                                </TableCell>
                                <TableCell>{user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-end">
                                        <AdminUserForm
                                            user={user}
                                            onUserSaved={(updatedUser) => {
                                                if (!updatedUser) return; // evita undefined
                                                setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
                                            }}
                                        />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm" disabled={isPending}>Eliminar</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(user.id)}
                                                        disabled={isPending}
                                                    >
                                                        {isPending ? 'Eliminando...' : 'Eliminar'}
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
