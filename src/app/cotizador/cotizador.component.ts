import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CotizadorService } from './cotizador.service';
import { CommonModule, NgFor } from '@angular/common';
import { PopupComponent } from '../popup/popup.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cotizador',
  standalone: true,
  imports: [NgFor, PopupComponent, CommonModule, FormsModule],
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css'],
})

export class CotizadorComponent implements OnInit {
  general: any[] = [];
  marcas: any[] = [];
  selectedMarca: string = '';
  modelos: string[] = [];
  showPopup: boolean = false;
  valorSeguro: number = 0;
  nombreCliente: string = '';
  formattedValorSeguro: string = '';
  selectedTipoVehiculo: string = '';
  filteredMarcas: any[] | undefined;
  referencias: any[] = [];
  anosDisponibles: any[] = [];
  selectedReferencia: string = '';
  selectedAno: string | undefined;
  tipoCobertura: string | undefined;
  tienePlaca: boolean = false; 


  constructor(private cotizadorService: CotizadorService) { }

  ngOnInit(): void {
    this.loadFacecolda(); // Llamar al método para cargar las marcas
  }

  loadFacecolda(): void {
    this.cotizadorService.getFacecolda().subscribe(
      (data) => {
        this.general = data; // Almacena toda la data recibida

        // Usar un Set para filtrar nombres únicos sin perder otros atributos
        const uniqueMarcasSet = new Set<string>(); // Usamos un Set para evitar duplicados
        this.general.forEach(item => {
          const marca = item.Marca; // Asegúrate de usar 'Marca' en lugar de 'marca'
          uniqueMarcasSet.add(marca); // Agregar la marca al Set
        });

        // Convertir el Set a un array
        this.marcas = Array.from(uniqueMarcasSet); 
      },
      (error) => {
        console.error('Error al obtener las marcas', error); // Manejo de errores
      }
    );

  }

  onTipoVehiculoChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedTipoVehiculo = target.value;

    switch (this.selectedTipoVehiculo) {
      case 'Automovil':
        this.selectedTipoVehiculo = 'car';
        break;

      case 'Moto':
        this.selectedTipoVehiculo = 'motorcycle';
        break;

      case 'Carro Híbrido':
        this.selectedTipoVehiculo = 'hybrid';
        break;

      default:
        this.selectedTipoVehiculo = '';
        break;
    }


    this.filterMarcasByTipo();
  }

  filterMarcasByTipo() {
    if (this.selectedTipoVehiculo) {
      // Filtrar elementos que coinciden con el tipo de vehículo seleccionado
      const filteredData = this.general.filter(item => item.Tipo_Vehiculo === this.selectedTipoVehiculo);

     
      // Usar un Set para evitar duplicados y obtener marcas únicas
      const uniqueMarcasSet = new Set<string>();
      filteredData.forEach(item => {
        uniqueMarcasSet.add(item.Marca); // Agregar marca única al Set
      });
  
      // Convertir el Set a un array
      this.filteredMarcas = Array.from(uniqueMarcasSet); 
    } else {
      this.filteredMarcas = this.marcas; // Si no hay tipo seleccionado, muestra todas las marcas
    }

  }
  

  getReferencias(): void {
    if (this.selectedMarca && this.selectedTipoVehiculo) {
        this.referencias = this.general.filter(item => 
            item.Marca === this.selectedMarca && item.Tipo_Vehiculo === this.selectedTipoVehiculo
        );
    } else {
        this.referencias = []; // Si no hay selección, vacía la lista de referencias
        this.anosDisponibles = []; // Limpia los años disponibles si no hay selección
    }

}

getAnosDisponibles(): void {
  if (this.selectedMarca && this.selectedReferencia) { 
    const anosKeysSet = new Set<string>();

    this.referencias.forEach(item => {
      // Verifica que la marca y la referencia seleccionada coincidan
      if (item.Marca === this.selectedMarca && item.Referencia1 === this.selectedReferencia) {
        var itemCoincidente = item;
        
        if (itemCoincidente.Años && typeof itemCoincidente.Años === 'object') {

          const anos = Object.keys(itemCoincidente.Años);
          anos.forEach(ano => {
            anosKeysSet.add(ano);

          });
        }

      }
    });
    this.anosDisponibles = Array.from(anosKeysSet); // Convertir el Set a un array
  } else {
    this.anosDisponibles = []; // Si no hay selección, vacía la lista de años
  }

}

getValorSeguro(): void {
  if (this.selectedMarca && this.selectedReferencia && this.selectedAno) {
    const matchingItem = this.general.find(item =>
      item.Marca === this.selectedMarca &&
      item.Referencia1 === this.selectedReferencia &&
      item.Años // Verifica que la propiedad Años existe
    );

    // Asegúrate de que matchingItem no sea undefined antes de acceder a sus propiedades
    if (matchingItem && this.selectedAno in matchingItem.Años) {
      const valor = matchingItem.Años[this.selectedAno]; // Obtener el valor basado en el año seleccionado

      // Aplica incrementos según el tipo de cobertura
      if (this.tipoCobertura === 'media') {
        this.valorSeguro = valor * 1.05; // Incrementa el 5%
      } else if (this.tipoCobertura === 'completa') {
        this.valorSeguro = valor * 1.10; // Incrementa el 10%
      } else {
        this.valorSeguro = valor; // Si no hay tipo de cobertura, asigna el valor normal
        this.valorSeguro -= 10000000;
      }
    } else {
      this.valorSeguro = 0; // Asignar un valor por defecto si no se encuentra
    }
  } else {
    this.valorSeguro = 0; // Asignar un valor por defecto si no se han seleccionado todos
  }
}


onReferenciaChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  this.selectedReferencia = target.value; 


  this.getAnosDisponibles(); // Llama al método para obtener años disponibles
}

onMarcaChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedMarca = target.value; 
  
    // Llama al método para obtener referencias
    this.getReferencias();
 }

onAnoChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  this.selectedAno = target.value; 
  this.getValorSeguro();
}

onTipoCoberturaChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  this.tipoCobertura = target.value; 
}
  
togglePlaca(): void {
  this.tienePlaca = !this.tienePlaca; // Cambia el valor de la variable
  console.log('Estado de tienePlaca:', this.tienePlaca);
}

  onCotizar(): void {
    this.showPopup = true;
  }



  closePopup(): void {
    this.showPopup = false; // Ocultar el popup
  }

  onBuy(): void {
    // Manejar la acción de compra
    console.log('Compra confirmada!');
  }


}
