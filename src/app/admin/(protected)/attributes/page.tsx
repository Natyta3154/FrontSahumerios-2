
import { getAttributes } from "@/lib/data";
import { AdminAttributesTable } from "./attributes-table";


export default async function AdminAttributesPage() {
  
  const attributes = await getAttributes();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Atributos</h1>
          <p className="text-muted-foreground">Gestiona los atributos de los productos, como marcas o materiales.</p>
        </div>
      </div>
      <AdminAttributesTable initialAttributes={attributes} />
    </>
  );
}
