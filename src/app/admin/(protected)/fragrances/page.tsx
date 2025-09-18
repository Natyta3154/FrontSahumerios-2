
import { getFragrances } from "@/lib/data";
import { AdminFragrancesTable } from "./fragrances-table";


export default async function AdminFragrancesPage() {

  const fragrances = await getFragrances();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Fragancias</h1>
          <p className="text-muted-foreground">Administra la lista de fragancias disponibles para tus productos.</p>
        </div>
      </div>
       <AdminFragrancesTable initialFragrances={fragrances} />
    </>
  );
}
