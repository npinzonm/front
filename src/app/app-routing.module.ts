import {Routes} from '@angular/router';
import {CotizadorComponent} from './cotizador/cotizador.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/cotizar', // Redirige a la ruta de cotizar
    pathMatch: 'full' // Asegúrate de que coincida exactamente
  },
  {
    path: 'cotizar',
    title: 'Cotizador',
    component: CotizadorComponent,
  },
  // Puedes agregar más rutas aquí
];