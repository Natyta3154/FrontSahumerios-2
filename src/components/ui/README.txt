Este archivo describe los componentes de la interfaz de usuario (UI) que se encuentran en este directorio, basados en ShadCN UI. Estos componentes son bloques de construcción reutilizables para tu aplicación.

La mayoría de las modificaciones de estilo (colores, bordes, etc.) se deben hacer a través de las variables CSS en `src/app/globals.css` para mantener la consistencia en toda la aplicación.

---

### accordion.tsx
- **¿Qué hace?**: Muestra una lista de elementos que se pueden expandir y contraer para revelar contenido. Ideal para secciones de Preguntas Frecuentes (FAQ).
- **¿Qué puedes modificar?**: El contenido que se muestra en el disparador (lo que se ve siempre) y en el contenido (lo que se expande).

### alert-dialog.tsx
- **¿Qué hace?**: Muestra un diálogo modal para confirmar acciones importantes o destructivas (ej. "¿Estás seguro de que quieres eliminar esto?"). Requiere una acción explícita del usuario para cerrarse.
- **¿Qué puedes modificar?**: El título, la descripción y el texto de los botones de acción y cancelación.

### alert.tsx
- **¿Qué hace?**: Muestra un mensaje corto e importante de una manera que atrae la atención del usuario sin interrumpir su flujo (a diferencia de un diálogo). Tiene variantes, como "default" y "destructive".
- **¿Qué puedes modificar?**: El título, la descripción y la variante para cambiar su color y propósito.

### avatar.tsx
- **¿Qué hace?**: Muestra una imagen de perfil o un placeholder (iniciales) si la imagen no está disponible.
- **¿Qué puedes modificar?**: La URL de la imagen y las iniciales del `AvatarFallback`.

### badge.tsx
- **¿Qué hace?**: Muestra pequeñas etiquetas o contadores. Es útil para destacar estados (ej. "Nuevo", "Oferta") o categorías.
- **¿Qué puedes modificar?**: El texto dentro de la insignia y la `variant` ("default", "secondary", "destructive", "outline") para cambiar su apariencia.

### button.tsx
- **¿Qué hace?**: El componente de botón estándar.
- **¿Qué puedes modificar?**: El texto, los iconos, y las propiedades `variant` (cómo se ve: "default", "destructive", "outline", "ghost", etc.) y `size` ("default", "sm", "lg", "icon").

### calendar.tsx
- **¿Qué hace?**: Muestra un calendario para seleccionar fechas.
- **¿Qué puedes modificar?**: Se usa principalmente como está, pero su apariencia (colores de días seleccionados, etc.) se controla con las variables de `globals.css`.

### card.tsx
- **¿Qué hace?**: Contenedor de contenido con estilo de "tarjeta". Se usa para agrupar información relacionada, como en la vista de un producto. Está compuesto por `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` y `CardFooter`.
- **¿Qué puedes modificar?**: El contenido dentro de cada una de sus partes.

### carousel.tsx
- **¿Qué hace?**: Muestra una colección de elementos (como imágenes o tarjetas) en un carrusel deslizable.
- **¿Qué puedes modificar?**: Los elementos (`CarouselItem`) que se muestran dentro. Puedes añadir plugins como `Autoplay`.

### chart.tsx
- **¿Qué hace?**: Un contenedor para crear gráficos y visualizaciones de datos utilizando la librería Recharts.
- **¿Qué puedes modificar?**: La configuración (`config`) de los datos y los colores de las series del gráfico.

### checkbox.tsx
- **¿Qué hace?**: Una casilla de verificación que puede ser marcada o desmarcada.
- **¿Qué puedes modificar?**: Generalmente se usa como está, su color `checked` se toma de la variable `--primary`.

### collapsible.tsx
- **¿Qué hace?**: Un componente que permite ocultar y mostrar contenido. Similar a `Accordion`, pero para un solo elemento.
- **¿Qué puedes modificar?**: El contenido del disparador (`CollapsibleTrigger`) y del contenido que se oculta/muestra (`CollapsibleContent`).

### dialog.tsx
- **¿Qué hace?**: Muestra contenido en una ventana modal o "popup" sobre el resto de la página. Es útil para formularios como "Añadir Producto".
- **¿Qué puedes modificar?**: El contenido del `DialogContent`, incluyendo título, descripción y pie de página.

### dropdown-menu.tsx
- **¿Qué hace?**: Muestra un menú de opciones que aparece cuando un usuario hace clic en un disparador.
- **¿Qué puedes modificar?**: Los elementos (`DropdownMenuItem`, `DropdownMenuCheckboxItem`, etc.) dentro del menú.

### form.tsx
- **¿Qué hace?**: Facilita la creación de formularios accesibles y manejables, integrándose con `react-hook-form`.
- **¿Qué puedes modificar?**: Los campos del formulario (`FormField`) y sus elementos (`FormLabel`, `FormControl`, `FormMessage`).

### input.tsx
- **¿Qué hace?**: Un campo de entrada de texto estándar.
- **¿Qué puedes modificar?**: El `placeholder`, el `type` (text, email, password, etc.) y otros atributos de input.

### label.tsx
- **¿Qué hace?**: Muestra una etiqueta de texto, generalmente asociada a un campo de formulario.
- **¿Qué puedes modificar?**: El texto de la etiqueta.

### menubar.tsx
- **¿Qué hace?**: Una barra de menú horizontal, similar a las que se encuentran en las aplicaciones de escritorio.
- **¿Qué puedes modificar?**: Las opciones y sub-menús dentro de la barra.

### popover.tsx
- **¿Qué hace?**: Muestra contenido flotante en relación con un elemento disparador. Es como un `Tooltip` que puede contener contenido complejo.
- **¿Qué puedes modificar?**: El contenido que se muestra dentro del `PopoverContent`.

### progress.tsx
- **¿Qué hace?**: Muestra una barra de progreso para indicar la finalización de una tarea.
- **¿Qué puedes modificar?**: El `value` (valor numérico del progreso).

### radio-group.tsx
- **¿Qué hace?**: Permite al usuario seleccionar una opción de un conjunto.
- **¿Qué puedes modificar?**: Las opciones (`RadioGroupItem`) y sus etiquetas asociadas.

### scroll-area.tsx
- **¿ qué hace? **: Agrega una barra de desplazamiento con estilo a un bloque de contenido cuando este se desborda.
- ** ¿Qué puedes modificar? **: El contenido que se coloca dentro del área de desplazamiento.

### select.tsx
- **¿Qué hace?**: Muestra un menú desplegable para que el usuario elija una opción de una lista.
- **¿Qué puedes modificar?**: Las opciones (`SelectItem`) disponibles en el menú.

### separator.tsx
- **¿Qué hace?**: Muestra una línea delgada para separar visualmente grupos de contenido.
- **¿Qué puedes modificar?**: La orientación (`horizontal` o `vertical`).

### sheet.tsx
- **¿Qué hace?**: Muestra contenido en un panel que se desliza desde un lado de la pantalla. Se usa para el carrito de compras y el menú móvil.
- **¿Qué puedes modificar?**: El contenido dentro del `SheetContent` y el lado (`side`) desde el que aparece.

### skeleton.tsx
- **¿Qué hace?**: Muestra un placeholder con una animación de pulso para indicar que el contenido se está cargando.
- **¿Qué puedes modificar?**: Su forma y tamaño usando clases de Tailwind CSS.

### slider.tsx
- **¿Qué hace?**: Un control deslizante para seleccionar un valor dentro de un rango.
- **¿Qué puedes modificar?**: El rango de valores (min/max) y el paso (`step`).

### switch.tsx
- **¿Qué hace?**: Un interruptor de dos estados (encendido/apagado).
- **¿Qué puedes modificar?**: Generalmente se usa como está. Sus colores se toman de las variables globales.

### table.tsx
- **¿Qué hace?**: Componentes para mostrar datos tabulares de forma estructurada.
- **¿Qué puedes modificar?**: El contenido de las cabeceras (`TableHead`), filas (`TableRow`) y celdas (`TableCell`).

### tabs.tsx
- **¿Qué hace?**: Permite organizar contenido en diferentes pestañas. Se usa en el panel de administración.
- **¿Qué puedes modificar?**: Las pestañas (`TabsTrigger`) y el contenido (`TabsContent`) asociado a cada una.

### textarea.tsx
- **¿Qué hace?**: Un campo de entrada de texto de varias líneas.
- **¿Qué puedes modificar?**: El `placeholder` y otros atributos.

### toast.tsx y toaster.tsx
- **¿Qué hace?**: `toast` es el componente visual de una notificación emergente, y `toaster` se encarga de renderizarlas en la pantalla. Se usan para mostrar mensajes como "Artículo añadido al carrito".
- **¿Qué puedes modificar?**: El título, la descripción y la variante (`default` o `destructive`) al llamar a la función `toast()`.
