
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAttributes } from "@/lib/data";
import { ProductAttribute } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";

// TODO: Crear formulario y acciones para gestionar atributos
export default function AdminAttributesPage() {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchAttributes() {
      const fetchedAttributes = await getAttributes(token);
      setAttributes(fetchedAttributes);
    }
    if (token) {
      fetchAttributes();
    }
  }, [token]);


  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl">Atributos</h1>
          <p className="text-muted-foreground">Gestiona los atributos de los productos, como marcas o materiales.</p>
        </div>
         {/* Aquí irá el botón para añadir nuevo atributo */}
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Gestión de Atributos</CardTitle>
          <CardDescription>
            Aquí podrás añadir, editar y eliminar atributos reutilizables para tus productos.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Aquí irá la tabla de atributos */}
          <p className="text-muted-foreground">Próximamente...</p>
        </CardContent>
      </Card>
    </>
  );
}
