
import { users } from '@/lib/data';
import type { User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

// Página para gestionar los usuarios.
// Por ahora, muestra una tabla con datos de ejemplo.
export default function AdminUsersPage() {
    const allUsers: User[] = users;

    return (
    <>
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="font-headline text-2xl">Usuarios</h1>
                <p className="text-muted-foreground">Gestiona las cuentas de los usuarios registrados.</p>
            </div>
        </div>
        <div className="bg-card border rounded-lg">
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
                {allUsers.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
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
