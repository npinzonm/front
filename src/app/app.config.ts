import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: 'cotizar', component: CotizadorComponent }, // Ruta para el cotizador
  { path: '**', redirectTo: '' } // Ruta para manejar errores
];


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideHttpClient()],
};
