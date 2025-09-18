
import { getDeals } from "@/lib/data";
import { AdminDealsTable } from "./deals-table";


export default async function AdminDealsPage() {
  
  const deals = await getDeals();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Ofertas</h1>
          <p className="text-muted-foreground">Crea y gestiona descuentos y promociones.</p>
        </div>
      </div>
      <AdminDealsTable initialDeals={deals} />
    </>
  );
}
