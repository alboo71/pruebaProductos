import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarProductoComponent } from './editar-producto.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { expect } from '@jest/globals';


describe('EditarProductoComponent', () => {
  let component: EditarProductoComponent;
  let fixture: ComponentFixture<EditarProductoComponent>;
  let productsService: ProductsService;
  let router: Router;

  const mockProduct = {
    id: '1',
    name: 'Producto 1',
    description: 'Descripción del Producto 1',
    logo: 'https://logo.png',
    date_release: '2025-01-01',
    date_revision: '2025-02-01'
  };

  const productsServiceMock = {
    getProductos: jest.fn().mockResolvedValue([mockProduct]),
    updateProduct: jest.fn().mockResolvedValue({ success: true })
  };

  const routerMock = {
    navigate: jest.fn()
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProductoComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarProductoComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ✅ Prueba: Creación del componente
  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // ✅ Prueba: Construcción del formulario
  it('debe construir el formulario al inicializar', () => {
    component.buildForm();
    expect(component.productForm).toBeDefined();
    expect(component.productForm.controls['name']).toBeTruthy();
  });

  // ✅ Prueba: Carga de producto al iniciar
  it('debe cargar el producto al iniciar', async () => {
    jest.spyOn(component, 'loadProduct');
    await component.ngOnInit();
    expect(component.loadProduct).toHaveBeenCalledWith('1');
  });

  // ✅ Prueba: Asignar valores del producto al formulario
  it('debe asignar los valores del producto al formulario', async () => {
    await component.loadProduct('1');
    expect(component.productForm.get('name')?.value).toBe('Producto 1');
    expect(component.productForm.get('description')?.value).toBe('Descripción del Producto 1');
  });

  // ✅ Prueba: Mostrar alerta de "Producto no encontrado"
  it('debe mostrar alerta si el producto no es encontrado', async () => {
    jest.spyOn(productsService, 'getProductos').mockResolvedValue([]);
    await component.loadProduct('1');
    expect(component.alertMessage).toBe('Producto no encontrado');
    expect(component.alertType).toBe('warning');
  });

  // ✅ Prueba: Mostrar alerta de "Error al cargar producto"
  it('debe mostrar alerta si hay un error al cargar el producto', async () => {
    jest.spyOn(productsService, 'getProductos').mockRejectedValue(new Error('Error de red'));
    await component.loadProduct('1');
    expect(component.alertMessage).toBe('Error al cargar producto');
    expect(component.alertType).toBe('error');
  });

  // ✅ Prueba: Enviar el formulario correctamente
  it('debe actualizar el producto correctamente', async () => {
    component.productForm.setValue({
      id: '1',
      name: 'Producto Actualizado',
      description: 'Descripción Actualizada',
      logo: 'https://logo.png',
      date_release: '2025-01-01',
      date_revision: '2025-02-01'
    });

    await component.onSubmit();
    expect(productsService.updateProduct).toHaveBeenCalledWith('1', expect.any(Object));
    expect(component.alertMessage).toBe('Producto actualizado con éxito');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  // ✅ Prueba: Manejar error al actualizar el producto
  it('debe mostrar una alerta de error si falla la actualización', async () => {
    jest.spyOn(productsService, 'updateProduct').mockRejectedValue(new Error('Error de red'));
    await component.onSubmit();
    expect(component.alertMessage).toBe('Error al actualizar producto');
    expect(component.alertType).toBe('error');
  });

  // ✅ Prueba: Mostrar y auto-cerrar alertas correctamente
  it('debe mostrar y ocultar la alerta después de 3 segundos', () => {
    jest.useFakeTimers();
    component.showAlert('Prueba de alerta', 'success');
    expect(component.alertMessage).toBe('Prueba de alerta');
    expect(component.alertType).toBe('success');

    jest.advanceTimersByTime(3000);
    expect(component.alertMessage).toBe('');
    expect(component.alertType).toBe('');
  });
});
