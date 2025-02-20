import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ✅ Prueba: El componente debe crearse correctamente
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // ✅ Prueba: El título debe ser 'prueba'
  it(`should have the 'prueba' title`, () => {
    expect(component.title).toEqual('prueba');
  });

  // ✅ Prueba: Debe contener el RouterOutlet
  it('should contain a router-outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });

  // ✅ Prueba: Forzar detección de cambios y verificar el estado
  it('should initialize title correctly', () => {
    fixture.detectChanges();
    expect(component.title).toBe('prueba');
  });

  // ✅ Prueba: Comprobar si el componente se renderiza sin errores
  it('should not throw any errors on render', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
