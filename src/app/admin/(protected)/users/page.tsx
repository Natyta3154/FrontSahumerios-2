import { getUsers } from '@/lib/data';
import { AdminUsersClient } from './AdminUsersClient';

export default async function AdminUsersPage() {
  const users = await getUsers(); // cookies() funciona aquí
  return <AdminUsersClient initialUsers={users} />;
}
