
import { getUsers } from '@/lib/data';
import { AdminUsersTable } from './users-table';


export default async function AdminUsersPage() {
    
    const users = await getUsers();

    return (
    <>
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="font-headline text-2xl">Usuarios</h1>
                <p className="text-muted-foreground">Gestiona las cuentas de los usuarios registrados.</p>
            </div>
        </div>
        <AdminUsersTable initialUsers={users} />
    </>
    );
}
