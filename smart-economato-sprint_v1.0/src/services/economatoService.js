export const API_URL = 'http://localhost:3000';

export async function getProductos() {
  try {
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) 
      throw new Error('Error al obtener productos');
    let productos = await res.json();
    return  productos;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  return res.json();
} 

  

export async function addProducto(producto) {
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  return res.json();
}

export async function updateProducto(id, datos) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return res.json();
}

export async function deleteProducto(id) {
  await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
}
