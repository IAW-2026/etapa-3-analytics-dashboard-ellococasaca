export default function TopProductsTable({
  products,
}: {
  products: {
    id: string;
    title: string;
    unitsSold: number;
    revenue: number;
  }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="pb-3 text-left">
              Producto
            </th>

            <th className="pb-3 text-right">
              Ventas
            </th>

            <th className="pb-3 text-right">
              Ingresos
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-slate-100"
            >
              <td className="py-3">
                {product.title}
              </td>

              <td className="py-3 text-right">
                {product.unitsSold}
              </td>

              <td className="py-3 text-right">
                $
                {product.revenue.toLocaleString(
                  "es-AR"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}