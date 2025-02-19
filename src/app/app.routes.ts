import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { ListadoProductosComponent } from './pages/listado-productos/listado-productos.component';
import { AgregarProductoComponent } from './pages/agregar-producto/agregar-producto.component';
import { EditarProductoComponent } from './pages/editar-producto/editar-producto.component';

export const routes: Routes = [
    { path: '', component: ListadoProductosComponent },
    { path: 'agregar', component: AgregarProductoComponent },
    { path: 'editar/:id', component: EditarProductoComponent },
];

export const appRouter = provideRouter(routes);