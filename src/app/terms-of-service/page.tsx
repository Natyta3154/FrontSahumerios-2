
export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <article className="prose dark:prose-invert max-w-4xl mx-auto prose-headings:font-headline">
        <h1>Términos de Servicio</h1>
        <p>
          <strong>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </p>
        <p>
          Estos Términos de Servicio ("Términos") rigen tu acceso y uso del sitio web, productos y servicios de Aromanza ("nosotros" o "nuestro"). Por favor, lee estos Términos cuidadosamente.
        </p>
        
        <h2>1. Aceptación de los Términos</h2>
        <p>
          Al acceder o utilizar nuestros servicios, aceptas estar sujeto a estos Términos. Si no estás de acuerdo con estos Términos, no puedes acceder ni utilizar nuestros servicios.
        </p>
        
        <h2>2. Uso de Nuestros Servicios</h2>
        <p>
          Debes seguir todas las políticas puestas a tu disposición dentro de los servicios. No uses nuestros servicios de manera indebida. Por ejemplo, no interfieras con nuestros servicios ni intentes acceder a ellos utilizando un método que no sea la interfaz y las instrucciones que proporcionamos.
        </p>
        <h3>2.1 Tu Cuenta</h3>
        <p>
          Es posible que necesites una cuenta de Aromanza para utilizar algunos de nuestros servicios. Eres responsable de la actividad que ocurre en o a través de tu cuenta. Intenta no reutilizar la contraseña de tu cuenta en aplicaciones de terceros.
        </p>

        <h2>3. Compras</h2>
        <p>
          Si deseas comprar cualquier producto o servicio puesto a disposición través del servicio ("Compra"), es posible que se te pida que proporciones cierta información relevante para tu Compra, incluyendo, sin limitación, tu número de tarjeta de crédito, la fecha de vencimiento de tu tarjeta de crédito, tu dirección de facturación y tu información de envío.
        </p>

        <h2>4. Contenido</h2>
        <p>
          Nuestro servicio te permite publicar, enlazar, almacenar, compartir y de otra manera poner a disposición cierta información, texto, gráficos, videos u otro material ("Contenido"). Eres responsable del Contenido que publicas en el servicio, incluyendo su legalidad, fiabilidad y adecuación.
        </p>

        <h2>5. Terminación</h2>
        <p>
          Podemos terminar o suspender tu acceso a nuestro servicio de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluyendo, sin limitación, si incumples los Términos.
        </p>

        <h2>6. Limitación de Responsabilidad</h2>
        <p>
          En la máxima medida permitida por la ley aplicable, Aromanza no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, ni de ninguna pérdida de beneficios o ingresos, ya sea incurrida directa o indirectamente, ni de ninguna pérdida de datos, uso, fondo de comercio u otras pérdidas intangibles, resultantes de (i) tu acceso o uso o incapacidad para acceder o usar el servicio; (ii) cualquier conducta o contenido de cualquier tercero en el servicio.
        </p>
        
        <h2>7. Cambios</h2>
        <p>
          Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Si tienes alguna pregunta sobre estos Términos, por favor contáctanos en <a href="mailto:terms@aromanza.com">terms@aromanza.com</a>.
        </p>
      </article>
    </div>
  );
}
