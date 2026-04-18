export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Política de Privacidad</h1>
        <p className="text-sm text-slate-500 mb-8">Última actualización: 17 de abril de 2026</p>

        <Section title="1. Información General">
          <p>
            Shopping Helper ("la Aplicación", "nosotros") es una aplicación móvil que permite a los
            usuarios registrar y comparar precios de productos en distintos supermercados. Esta
            Política de Privacidad describe cómo recopilamos, usamos, almacenamos y compartimos tu
            información personal cuando usas nuestra Aplicación.
          </p>
          <p className="mt-3">
            Al usar Shopping Helper, aceptas las prácticas descritas en esta política. Si no estás
            de acuerdo, por favor deja de usar la Aplicación.
          </p>
        </Section>

        <Section title="2. Información que Recopilamos">
          <Subsection title="2.1 Información de cuenta">
            <ul className="list-disc pl-5 space-y-1">
              <li>Dirección de correo electrónico</li>
              <li>Contraseña (almacenada de forma cifrada, nunca en texto plano)</li>
            </ul>
          </Subsection>
          <Subsection title="2.2 Contenido generado por el usuario">
            <ul className="list-disc pl-5 space-y-1">
              <li>Precios de productos registrados por el usuario</li>
              <li>Nombres de productos y supermercados</li>
              <li>Imágenes de tickets o recibos de compra (si el usuario las sube)</li>
            </ul>
          </Subsection>
          <Subsection title="2.3 Datos de uso">
            <ul className="list-disc pl-5 space-y-1">
              <li>Fecha y hora de las acciones realizadas en la app</li>
              <li>Funcionalidades utilizadas</li>
            </ul>
          </Subsection>
          <Subsection title="2.4 Información del dispositivo">
            <ul className="list-disc pl-5 space-y-1">
              <li>Tipo de dispositivo y sistema operativo</li>
              <li>Identificadores técnicos del dispositivo</li>
            </ul>
          </Subsection>
        </Section>

        <Section title="3. Cómo Usamos tu Información">
          <p>Usamos la información recopilada para:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Proveer y mejorar los servicios de la Aplicación</li>
            <li>Autenticar tu cuenta y mantener la seguridad</li>
            <li>Permitirte registrar y consultar precios de productos</li>
            <li>Generar estadísticas agregadas sobre precios en el mercado</li>
            <li>Enviarte notificaciones relacionadas con el servicio (si las activas)</li>
            <li>Cumplir con obligaciones legales aplicables</li>
          </ul>
        </Section>

        <Section title="4. Compartición y Venta de Datos">
          <p className="font-semibold text-slate-800">
            Podemos compartir o vender tu información personal a terceros en los siguientes casos:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong>Venta a terceros:</strong> Podemos vender datos agregados o individuales a
              empresas, investigadores, anunciantes u otras organizaciones interesadas en información
              sobre precios, hábitos de consumo u otros datos derivados del uso de la Aplicación.
            </li>
            <li>
              <strong>Socios comerciales:</strong> Podemos compartir datos con empresas asociadas
              para fines de análisis de mercado, publicidad o mejora de productos.
            </li>
            <li>
              <strong>Proveedores de servicios:</strong> Compartimos datos con proveedores técnicos
              (como servicios de base de datos o inteligencia artificial) que nos ayudan a operar la
              Aplicación.
            </li>
            <li>
              <strong>Requerimientos legales:</strong> Podemos divulgar tu información si así lo
              exige la ley o una autoridad competente.
            </li>
            <li>
              <strong>Transferencia de negocio:</strong> En caso de fusión, adquisición o venta de
              activos, tu información podría ser transferida a la entidad resultante.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            Al usar la Aplicación, consientes expresamente la posibilidad de que tus datos sean
            compartidos o vendidos según lo descrito en esta sección.
          </p>
        </Section>

        <Section title="5. Almacenamiento y Seguridad">
          <p>
            Tus datos se almacenan en servidores seguros provistos por Supabase. Tomamos medidas
            técnicas razonables para proteger tu información contra accesos no autorizados,
            alteración, divulgación o destrucción.
          </p>
          <p className="mt-3">
            Sin embargo, ningún sistema de transmisión o almacenamiento de datos es 100% seguro. No
            podemos garantizar la seguridad absoluta de tu información.
          </p>
        </Section>

        <Section title="6. Retención de Datos">
          <p>
            Conservamos tu información mientras tu cuenta esté activa o mientras sea necesario para
            proveer el servicio. Puedes solicitar la eliminación de tu cuenta y datos escribiéndonos
            al correo indicado en la sección de contacto.
          </p>
        </Section>

        <Section title="7. Tus Derechos">
          <p>Tienes derecho a:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Acceder a los datos personales que tenemos sobre ti</li>
            <li>Solicitar la corrección de datos incorrectos</li>
            <li>Solicitar la eliminación de tu cuenta y datos personales</li>
            <li>Oponerte al procesamiento de tus datos para ciertos fines</li>
          </ul>
          <p className="mt-3">
            Para ejercer estos derechos, contáctanos usando la información de la sección 9.
          </p>
        </Section>

        <Section title="8. Privacidad de Menores">
          <p>
            Shopping Helper no está dirigida a menores de 13 años. No recopilamos conscientemente
            información personal de niños. Si descubrimos que hemos recopilado datos de un menor sin
            el consentimiento apropiado, los eliminaremos de inmediato.
          </p>
        </Section>

        <Section title="9. Cambios a esta Política">
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre
            cambios significativos publicando la nueva política en esta página con una fecha de
            actualización revisada. Te recomendamos revisarla periódicamente.
          </p>
        </Section>

        <Section title="10. Contacto">
          <p>Si tienes preguntas, comentarios o solicitudes relacionadas con esta Política de Privacidad, puedes contactarnos en:</p>
          <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="font-medium text-slate-800">Shopping Helper</p>
            <p className="text-slate-600 mt-1">
              Correo electrónico:{' '}
              <a
                href="mailto:jorgerodrigotorrez@gmail.com"
                className="text-blue-600 hover:underline"
              >
                jorgerodrigotorrez@gmail.com
              </a>
            </p>
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
        {title}
      </h2>
      <div className="text-slate-700 leading-relaxed">{children}</div>
    </section>
  )
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <h3 className="font-medium text-slate-800 mb-1">{title}</h3>
      {children}
    </div>
  )
}
