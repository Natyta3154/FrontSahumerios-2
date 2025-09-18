
import { getOrders } from '@/lib/data';
import { AdminOrdersTable } from './orders-table';


export default async function AdminOrdersPage() {

    const orders = await getOrders();

  return (
    <>
       <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl">Pedidos</h1>
            <p className="text-muted-foreground">Revisa y gestiona los pedidos de los clientes.</p>
          </div>
          {/* Aquí podría ir un botón para crear un pedido manualmente */}
      </div>
      <AdminOrdersTable initialOrders={orders} />
    </>
  );
}
