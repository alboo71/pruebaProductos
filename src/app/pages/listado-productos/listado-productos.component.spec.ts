import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoProductosComponent } from './listado-productos.component';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ListadoProductosComponent', () => {
  let component: ListadoProductosComponent;
  let fixture: ComponentFixture<ListadoProductosComponent>;
  let productsService: ProductsService;
  let router: Router;

  const mockProducts = [
    { id: '1', name: 'Producto 1', description: 'Descripción 1', logo: 'logo1.png', date_release: '2025-01-01', date_revision: '2025-02-01' },
    { id: '2', name: 'Producto 2', description: 'Descripción 2', logo: 'logo2.png', date_release: '2025-01-02', date_revision: '2025-02-02' }
  ];

  const productsServiceMock = {
    getProductos: jest.fn().mockResolvedValue(mockProducts),
    addProduct: jest.fn().mockResolvedValue({ success: true }),
    checkIfIdExists: jest.fn().mockResolvedValue(false)
  };

  const routerMock = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoProductosComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoProductosComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar productos al iniciar', async () => {
    jest.spyOn(component, 'loadProductos');
    await component.ngOnInit();
    expect(component.loadProductos).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
  });

  it('debe filtrar productos correctamente', () => {
    component.products = mockProducts;
    component.searchTerm = 'Producto 1';
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Producto 1');
  });

  it('debe navegar a la pantalla de edición', () => {
    component.editProduct('1');
    expect(router.navigate).toHaveBeenCalledWith(['/editar/1']);
  });

  it('debe abrir y cerrar el modal correctamente', () => {
    component.openModal();
    expect(component.isModalOpen).toBe(true);
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
  });

  it('debe manejar el envío del formulario correctamente', async () => {
    component.productForm.setValue({
      id: '1',
      name: 'Producto Nuevo',
      description: 'Descripción Nueva',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2025-02-01'
    });

    await component.onSubmit();
    expect(productsService.addProduct).toHaveBeenCalledWith(component.productForm.value);
    expect(component.isModalOpen).toBe(false);
  });

  it('debe mostrar alerta si no se encuentran productos', async () => {
    jest.spyOn(productsService, 'getProductos').mockResolvedValue([]);
    await component.loadProductos();
    expect(component.alertMessage).toBe('No se encontraron productos en el array.');
    expect(component.alertType).toBe('warning');
  });

  it('debe mostrar alerta de error al obtener productos', async () => {
    jest.spyOn(productsService, 'getProductos').mockRejectedValue(new Error('Error de red'));
    await component.loadProductos();
    expect(component.alertMessage).toBe('Error al obtener productos');
    expect(component.alertType).toBe('error');
  });

  it('debe validar el ID correctamente', async () => {
    component.productForm.controls['id'].setValue('1');
    await component.validateId();
    expect(component.productForm.controls['id'].valid).toBe(true);
  });

  it('debe mostrar y ocultar alertas correctamente', () => {
    jest.useFakeTimers();
    component.showAlert('Mensaje de prueba', 'success');
    expect(component.alertMessage).toBe('Mensaje de prueba');
    expect(component.alertType).toBe('success');
    jest.advanceTimersByTime(3000);
    expect(component.alertMessage).toBe('');
    expect(component.alertType).toBe('');
  });

  it('debe manejar imágenes rotas correctamente', () => {
    const event = { target: { src: '' } } as unknown as Event;
    component.handleImageError(event);
    expect((event.target as HTMLImageElement).src).toContain('pichincha_logo_despues.jpg');
  });

  it('should show warning alert if no products found', async () => {
    jest.spyOn(productsService, 'getProductos').mockResolvedValue([]);
    await component.loadProductos();
    expect(component.alertMessage).toBe('No se encontraron productos en el array.');
    expect(component.alertType).toBe('warning');
});

it('should handle image error and set default image', () => {
    const event = { target: { src: '' } } as unknown as Event;
    component.handleImageError(event);
    expect((event.target as HTMLImageElement).src).toContain('pichincha_logo_despues.jpg');
});

it('should toggle dropdown state', () => {
    const productId = '1';
    component.toggleDropdown(productId);
    expect(component.showDropdown[productId]).toBe(true);
    component.toggleDropdown(productId);
    expect(component.showDropdown[productId]).toBe(false);
});

it('should show error alert if adding product fails', async () => {
    jest.spyOn(productsService, 'addProduct').mockRejectedValue(new Error('Error al agregar producto'));
    await component.onSubmit();
    expect(component.alertMessage).toBe('Error al agregar producto:');
    expect(component.alertType).toBe('error');
});
});
