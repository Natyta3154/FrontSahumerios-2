# Aromanza - Un Proyecto de Firebase Studio

Este es un proyecto de comercio electrónico creado con Next.js. La aplicación está diseñada para ser una tienda en línea de productos de aromaterapia, completamente funcional y lista para ser conectada a un backend.

## Cómo fue Creado
- La estructura del proyecto con Next.js y TypeScript.
- El diseño y los componentes de la interfaz de usuario, utilizando **ShadCN UI** y **Tailwind CSS**.
- La paleta de colores y el estilo visual, incluyendo fondos con gradientes.
- La lógica de la interfaz, como el carrito de compras, los filtros de productos y los diálogos modales.
- El contenido inicial y los datos de muestra para productos, artículos de blog, etc.

## Características Principales

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **UI:** ShadCN UI, Tailwind CSS
- **Iconos:** Lucide React
- **Datos:** Datos de muestra locales (en `src/lib/data.ts`) listos para ser reemplazados por llamadas a una API.

## Siguientes Pasos

Para conectar este frontend a tu propio backend, deberás enfocarte en los siguientes archivos:

- **`src/lib/data.ts`**: Reemplaza los arrays de datos estáticos con funciones que hagan `fetch` a los endpoints de tu API.
- **`src/app/admin/dashboard/actions.ts`**: Implementa la lógica de las Server Actions para que se comuniquen con tu backend y realicen operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en tu base de datos.
- **`src/app/products/page.tsx`**, **`src/app/blog/page.tsx`**, etc.: Modifica estas páginas para que obtengan los datos desde tu backend en lugar de `src/lib/data.ts`.

