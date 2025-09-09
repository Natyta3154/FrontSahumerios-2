
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <article className="prose dark:prose-invert max-w-4xl mx-auto prose-headings:font-headline">
        <h1>Política de Privacidad</h1>
        <p>
          <strong>Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </p>
        <p>
          Bienvenido a Aromanza. Tu privacidad es de suma importancia para nosotros. Esta Política de Privacidad describe cómo recopilamos, usamos, procesamos y divulgamos tu información, incluida la información personal, en conjunto con tu acceso y uso de nuestro sitio web.
        </p>
        
        <h2>1. Información que Recopilamos</h2>
        <p>
          Recopilamos tres categorías generales de información.
        </p>
        <h3>1.1 Información que Nos Proporcionas.</h3>
        <ul>
          <li><strong>Información de la Cuenta:</strong> Cuando te registras para una cuenta de Aromanza, requerimos cierta información como tu nombre, apellido, dirección de correo electrónico y fecha de nacimiento.</li>
          <li><strong>Información de Pago:</strong> Para procesar pedidos, podemos recopilar cierta información financiera (como los detalles de tu tarjeta de crédito o cuenta bancaria) a través de nuestros proveedores de servicios de pago.</li>
          <li><strong>Comunicaciones con Aromanza:</strong> Cuando te comunicas con Aromanza, recopilamos información sobre tu comunicación y cualquier información que elijas proporcionar.</li>
        </ul>
        <h3>1.2 Información que Recopilamos Automáticamente de Tu Uso del Sitio Web.</h3>
        <p>
          Cuando utilizas nuestro sitio web, recopilamos automáticamente información, incluida información personal, sobre los servicios que utilizas y cómo los utilizas.
        </p>
        
        <h2>2. Cómo Utilizamos la Información que Recopilamos</h2>
        <p>
          Utilizamos, almacenamos y procesamos información, incluida la información personal, sobre ti para proporcionar, comprender, mejorar y desarrollar el sitio web de Aromanza, crear y mantener un entorno de confianza y más seguro y cumplir con nuestras obligaciones legales.
        </p>

        <h2>3. Uso Compartido y Divulgación</h2>
        <p>
          No compartiremos tu información personal con terceros, excepto cuando sea necesario para proporcionar nuestros servicios (por ejemplo, procesadores de pago, empresas de envío) o si la ley nos obliga a hacerlo.
        </p>

        <h2>4. Tus Derechos</h2>
        <p>
          Tienes derecho a acceder, corregir, eliminar o limitar el uso de tu información personal. Puedes ejercer cualquiera de estos derechos contactándonos.
        </p>

        <h2>5. Seguridad</h2>
        <p>
          Estamos continuamente implementando y actualizando medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger tu información contra el acceso no autorizado, la pérdida, la destrucción o la alteración.
        </p>

        <h2>6. Cambios a esta Política de Privacidad</h2>
        <p>
          Aromanza se reserva el derecho de modificar esta Política de Privacidad en cualquier momento. Si realizamos cambios a esta Política de Privacidad, publicaremos la política revisada en el sitio web y actualizaremos la fecha de "Última actualización" en la parte superior.
        </p>

        <h2>7. Contacto</h2>
        <p>
          Si tienes alguna pregunta o queja sobre esta Política de Privacidad o las prácticas de información de Aromanza, puedes enviarnos un correo electrónico a <a href="mailto:privacy@aromanza.com">privacy@aromanza.com</a>.
        </p>
      </article>
    </div>
  );
}
