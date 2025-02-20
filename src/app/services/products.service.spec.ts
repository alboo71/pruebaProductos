import { ProductsService } from './products.service';
import { expect } from '@jest/globals';


describe('ProductsService', () => {
  let service: ProductsService;
  const baseUrl = 'http://localhost:3002/bp/products';

  beforeEach(() => {
    service = new ProductsService();
  });

  // ✅ Prueba: Creación del servicio
  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  // ✅ Prueba: Obtener productos correctamente
  it('debe obtener productos correctamente', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [{ id: '1', name: 'Producto 1' }] })
    } as Response);

    const productos = await service.getProductos();
    expect(productos.length).toBe(1);
    expect(productos[0].name).toBe('Producto 1');
  });

  // ✅ Prueba: Manejar error al obtener productos
  it('debe manejar errores al obtener productos', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Error al obtener productos'));

    await expect(service.getProductos()).rejects.toThrow('Error al obtener productos');
  });

  // ✅ Prueba: Agregar un producto correctamente
  it('debe agregar un producto correctamente', async () => {
    const mockProduct = { id: '1', name: 'Producto Nuevo' };

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    } as Response);

    const response = await service.addProduct(mockProduct);
    expect(response.success).toBe(true);
  });

  // ✅ Prueba: Manejar error al agregar un producto
  it('debe manejar errores al agregar un producto', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Error al agregar producto'));

    await expect(service.addProduct({})).rejects.toThrow('Error al agregar producto');
  });

  // ✅ Prueba: Validar si un ID existe
  it('debe validar si un ID existe', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(true)
    } as Response);

    const exists = await service.checkIfIdExists('1');
    expect(exists).toBe(true);
  });

  // ✅ Prueba: Manejar error al validar si un ID existe
  it('debe manejar errores al validar si un ID existe', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Error al validar ID'));

    await expect(service.checkIfIdExists('1')).rejects.toThrow('Error al validar ID');
  });

  // ✅ Prueba: Actualizar un producto correctamente
  it('debe actualizar un producto correctamente', async () => {
    const mockProduct = { name: 'Producto Actualizado' };

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    } as Response);

    const response = await service.updateProduct('1', mockProduct);
    expect(response.success).toBe(true);
  });

  // ✅ Prueba: Manejar error al actualizar un producto
  it('debe manejar errores al actualizar un producto', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Error al actualizar producto'));

    await expect(service.updateProduct('1', {})).rejects.toThrow('Error al actualizar producto');
  });
});
