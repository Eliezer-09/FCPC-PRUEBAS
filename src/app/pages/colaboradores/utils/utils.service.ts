import { Injectable, ViewChild } from "@angular/core";
import {
  ToastAlertComponent,
  Type_position,
} from "src/app/components/alerts/toast-alert/toast-alert.component";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  @ViewChild("toastAlertComponent") toastAlertComponent: ToastAlertComponent;

  fechaActual() {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();
    let fechaActual = anio + "-" + mes + "-" + dia;
    return fechaActual;
  }

  validacionSoloLetras(event) {
    return /[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/.test(event.key);
  }

  alerta(type: string, message = "", time = 1500) {
    if (type == "success") {
      new ToastAlertComponent(
        "success",
        message ? message : "Datos guardados correctamente",
        Type_position.TOP,
        true,
        time
      );
    }
    if (type == "error") {
      new ToastAlertComponent(
        "error",
        message ? message : "Error al guardar los datos",
        Type_position.TOP,
        true,
        time
      );
    }

    if (type == "warning") {
      new ToastAlertComponent(
        "warning",
        message ? message : "Por favor, complete los campos obligatorios",
        Type_position.TOP,
        true,
        time
      );
    }
  }

  capitalize(word) {
    if (word) {
      return word[0].toUpperCase() + word.slice(1);
    }
  }

  setNumberDecimal(valor: string, decimal: number = 2) {
    return parseFloat(valor).toFixed(decimal);
  }

  confirmar(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });
  }

  deleteTrashData(data: any) {
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === "") {
        delete data[key];
      }
    });

    return data;
  }
}
