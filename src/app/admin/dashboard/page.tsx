
import { getProducts, users, orders } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardTabs } from './dashboard-tabs';

// 1. Esta página ahora es un Componente de Servidor.
// Se ejecuta en el servidor, obteniendo los datos antes de enviar la página al navegador.
export default async function AdminDashboardPage() {
  
  // 2. Obtenemos los datos de productos directamente en el servidor.
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Panel de Administración</CardTitle>
            <CardDescription>Gestiona los productos, usuarios y pedidos de tu tienda.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* 3. Pasamos los datos pre-cargados al componente cliente que manejará la interactividad. */}
          <DashboardTabs products={products} users={users} orders={orders} />
        </CardContent>
      </Card>
      
    </div>
  );
}
