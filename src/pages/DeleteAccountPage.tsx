export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Eliminar Cuenta — Shopping Helper</h1>
        <p className="text-sm text-slate-500 mb-8">Última actualización: 17 de abril de 2026</p>

        <p className="text-slate-700 leading-relaxed mb-8">
          Si deseas eliminar tu cuenta de <strong>Shopping Helper</strong> y los datos asociados a
          ella, sigue los pasos indicados a continuación.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Cómo solicitar la eliminación de tu cuenta
          </h2>
          <ol className="list-decimal pl-5 space-y-3 text-slate-700 leading-relaxed">
            <li>
              Envía un correo electrónico a{' '}
              <a
                href="mailto:jorgerodrigotorrez@gmail.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta%20-%20Shopping%20Helper"
                className="text-blue-600 hover:underline font-medium"
              >
                jorgerodrigotorrez@gmail.com
              </a>{' '}
              con el asunto: <strong>Solicitud de eliminación de cuenta - Shopping Helper</strong>.
            </li>
            <li>
              En el cuerpo del mensaje, incluye la dirección de correo electrónico asociada a tu
              cuenta de Shopping Helper.
            </li>
            <li>
              Procesaremos tu solicitud en un plazo máximo de <strong>30 días</strong> y te
              confirmaremos por correo cuando la eliminación haya sido completada.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Qué datos se eliminan
          </h2>
          <div className="space-y-3 text-slate-700">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold text-red-800 mb-2">Datos eliminados permanentemente:</p>
              <ul className="list-disc pl-5 space-y-1 text-red-700">
                <li>Tu cuenta de usuario (correo electrónico y contraseña)</li>
                <li>Imágenes de tickets o recibos que hayas subido</li>
                <li>Tu historial de actividad en la aplicación</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-semibold text-yellow-800 mb-2">Datos que pueden conservarse:</p>
              <ul className="list-disc pl-5 space-y-1 text-yellow-700">
                <li>
                  Los precios de productos que registraste pueden conservarse de forma anonimizada
                  en nuestra base de datos para mantener la utilidad del servicio para otros
                  usuarios.
                </li>
                <li>
                  Datos requeridos por ley o para la resolución de disputas pueden conservarse
                  hasta <strong>90 días adicionales</strong> tras la eliminación.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Contacto
          </h2>
          <p className="text-slate-700">
            Para cualquier duda relacionada con la eliminación de tu cuenta o tus datos, escríbenos
            a{' '}
            <a
              href="mailto:jorgerodrigotorrez@gmail.com"
              className="text-blue-600 hover:underline"
            >
              jorgerodrigotorrez@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
