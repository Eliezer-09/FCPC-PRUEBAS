import { Injectable, ChangeDetectorRef } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
// ICONOS
import icArchive from '@iconify/icons-ic/archive';
import icCreditCard from '@iconify/icons-ic/credit-card';
import icPerson from '@iconify/icons-ic/person';
import icDashboard from '@iconify/icons-ic/dashboard';
import { NavigationDropdown, NavigationLink } from 'src/@vex/interfaces/navigation-item.interface';
import { DataService } from './data.service';
import { NavigationService } from 'src/@vex/services/navigation.service';
@Injectable({
  providedIn: 'root'
})
export class ComponentesService {
  accesos = []
  constructor(private navigationService: NavigationService) { }

  alerta(icono, texto) {
    return Swal.fire({
      icon: icono,
      text: texto,
    });
  }

  alertaButtons(titulo: string, texto: string = "", icon: SweetAlertIcon = 'question') {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      denyButtonText: `No`,
      confirmButtonText: `Si`,
    })
  }

  errorHandler(error){
    if(error.statusText == "Unknown Error"){
      this.alerta("error", "Hubo un error al conectar con el servidor");  
    }else{
      this.alerta("error", error.error.message);
    }
  }

  trunc (x, posiciones = 0) {
    var s = x.toString()
    var l = s.length
    var decimalLength = s.indexOf('.') + 1
  
    if (l - decimalLength <= posiciones){
      return x
    }
    // Parte decimal del número
    var isNeg  = x < 0
    var decimal =  x % 1
    var entera  = isNeg ? Math.ceil(x) : Math.floor(x)
    // Parte decimal como número entero
    // Ejemplo: parte decimal = 0.77
    // decimalFormated = 0.77 * (10^posiciones)
    // si posiciones es 2 ==> 0.77 * 100
    // si posiciones es 3 ==> 0.77 * 1000
    var decimalFormated = Math.floor(
      Math.abs(decimal) * Math.pow(10, posiciones)
    )
    // Sustraemos del número original la parte decimal
    // y le sumamos la parte decimal que hemos formateado
    var finalNum = entera + 
      ((decimalFormated / Math.pow(10, posiciones))*(isNeg ? -1 : 1))
    return finalNum
  }

  

}
