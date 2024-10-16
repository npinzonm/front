import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent {
  @Input() nombreCliente: string = ''; 
  @Input() valorSeguro: number = 0;
  @Output() close = new EventEmitter<void>(); // Evento para cerrar
  @Output() buy = new EventEmitter<void>(); // Evento para compra

  onClose(): void {
    this.close.emit(); // Emitir evento de cierre
  }

  onBuy(): void {
    this.buy.emit(); // Emitir evento de compra
  }

  formatCurrency(value: number): string {
    // Formatear el número con puntos y agregar 'COP' al final
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' COP';
  }
}
