export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestión de cuenta y datos — Shopping Helper</h1>
        <p className="text-sm text-slate-500 mb-8">Última actualización: 17 de abril de 2026</p>

        <p className="text-slate-700 leading-relaxed mb-8">
          En <strong>Shopping Helper</strong> puedes solicitar la eliminación de toda tu cuenta o
          de tipos específicos de datos sin necesidad de eliminar tu cuenta.
        </p>

        {/* ── Full account deletion ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            1. Eliminar cuenta completa
          </h2>
          <p className="text-slate-700 mb-4">
            Puedes eliminar tu cuenta directamente desde la app (sección <em>Inicio → Eliminar mi
            cuenta</em>), o enviarnos una solicitud por correo:
          </p>
          <ol className="list-decimal pl-5 space-y-3 text-slate-700 leading-relaxed">
            <li>
              Envía un correo a{' '}
              <a
                href="mailto:jorgerodrigotorrez@gmail.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta%20-%20Shopping%20Helper"
                className="text-blue-600 hover:underline font-medium"
              >
                jorgerodrigotorrez@gmail.com
              </a>{' '}
              con el asunto: <strong>Solicitud de eliminación de cuenta - Shopping Helper</strong>.
            </li>
            <li>Incluye el correo electrónico de tu cuenta en el cuerpo del mensaje.</li>
            <li>
              Procesaremos tu solicitud en un plazo máximo de <strong>30 días</strong> y te
              confirmaremos por correo.
            </li>
          </ol>

          <div className="mt-5 space-y-3 text-slate-700">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold text-red-800 mb-2">Se elimina permanentemente:</p>
              <ul className="list-disc pl-5 space-y-1 text-red-700">
                <li>Tu cuenta (correo y contraseña)</li>
                <li>Tu historial de escaneos</li>
                <li>Tus listas de compras e ítems</li>
                <li>Tu token de notificaciones push</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-semibold text-yellow-800 mb-2">Puede conservarse:</p>
              <ul className="list-disc pl-5 space-y-1 text-yellow-700">
                <li>
                  Precios de productos registrados, de forma anónima, para mantener la utilidad
                  del servicio para otros usuarios.
                </li>
                <li>
                  Datos requeridos por ley hasta <strong>90 días adicionales</strong>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Partial data deletion ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            2. Eliminar datos específicos (sin eliminar la cuenta)
          </h2>
          <p className="text-slate-700 mb-5">
            Puedes borrar tipos específicos de datos directamente desde la app o solicitarlo por
            correo indicando qué deseas eliminar.
          </p>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Tipo de dato</th>
                  <th className="px-4 py-3 text-left">Desde la app</th>
                  <th className="px-4 py-3 text-left">Por correo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 font-medium">Historial de escaneos</td>
                  <td className="px-4 py-3 text-green-700">✓ Disponible</td>
                  <td className="px-4 py-3 text-green-700">✓ Disponible</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-4 py-3 font-medium">Listas de compras</td>
                  <td className="px-4 py-3 text-green-700">✓ Disponible</td>
                  <td className="px-4 py-3 text-green-700">✓ Disponible</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Token de notificaciones push</td>
                  <td className="px-4 py-3 text-slate-500">— Al cerrar sesión</td>
                  <td className="px-4 py-3 text-green-700">✓ Disponible</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="px-4 py-3 font-medium">Precios de productos registrados</td>
                  <td className="px-4 py-3 text-slate-500">— Anónimos, no atribuibles</td>
                  <td className="px-4 py-3 text-slate-500">— No aplica</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-slate-700">
            Para solicitar eliminación parcial por correo, escríbenos a{' '}
            <a
              href="mailto:jorgerodrigotorrez@gmail.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20parcial%20de%20datos%20-%20Shopping%20Helper"
              className="text-blue-600 hover:underline font-medium"
            >
              jorgerodrigotorrez@gmail.com
            </a>{' '}
            con el asunto <strong>Solicitud de eliminación parcial de datos - Shopping Helper</strong>,
            indicando el correo de tu cuenta y qué datos deseas eliminar.
          </p>
        </section>

        {/* ── Contact ── */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
            Contacto
          </h2>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="font-medium text-slate-800">Shopping Helper</p>
            <p className="text-slate-600 mt-1">
              <a href="mailto:jorgerodrigotorrez@gmail.com" className="text-blue-600 hover:underline">
                jorgerodrigotorrez@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
