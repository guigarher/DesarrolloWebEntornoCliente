import { Alert, Badge, Spinner, Table } from "react-bootstrap";
import { useProducts } from "../hooks/useProducts";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();

  return (
    <>
      <h1 className="h3 mb-3">Productos</h1>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Cargando...</span>
        </div>
      )}

      {!loading && error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>Nombre</th>
              <th style={{ width: 140 }}>Precio</th>
              <th style={{ width: 110 }}>Stock</th>
              <th style={{ width: 180 }}>Categoría</th>
              <th style={{ width: 100 }}>Activo</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>
                  {p.precio} € / {p.precioUnitario}
                </td>
                <td>
                  {p.stock} {p.unidadMedida}
                </td>
                <td>{p.categoria?.nombre ?? "-"}</td>
                <td>
                  {p.activo ? (
                    <Badge bg="success">Sí</Badge>
                  ) : (
                    <Badge bg="secondary">No</Badge>
                  )}
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-3">
                  No hay productos.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
}
