export interface Category {
  id: number;
  nombre: string;
}

export interface Product {
  id: string;
  nombre: string;
  precio: number;
  precioUnitario: string;
  stock: number;
  unidadMedida: string;
  activo: boolean;
  categoria?: Category;
}
