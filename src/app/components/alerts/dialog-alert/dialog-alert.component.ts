import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';


export enum Type_Alert {
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info",
  QUESTION = "question",
}


@Component({
  selector: 'vex-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.scss']
})
export class DialogAlertComponent {
  static typeAlert: string;
  static title: string;
  static html: HTMLElement;
  result;
  constructor(@Inject(String) private typeAlert: string= "warning",
              @Inject(String) private title: string= "",
              @Inject(HTMLElement) private html: any= `<div></div>`,
              @Inject(String) private showLoaderOnConfirm: boolean= true,) {
                DialogAlertComponent.typeAlert=this.typeAlert;
                DialogAlertComponent.title=this.title;
                DialogAlertComponent.html=this.html;
                this.dialogAlert(this.typeAlert);
               }


  asigned_typeAlert() {
    switch (this.typeAlert) {
      case "error":
        this.typeAlert = Type_Alert.ERROR;
        break;
      case "warning":
        this.typeAlert = Type_Alert.WARNING;
        break;
      case "info":
        this.typeAlert = Type_Alert.INFO;
        break;
      case "question":
        this.typeAlert = Type_Alert.QUESTION;
        break;
      case "success":
      default:
        this.typeAlert = Type_Alert.SUCCESS;
        break;
    }
  }


  dialogAlert(typeAlert){
   Swal.fire({
      icon: typeAlert,
      title: this.title,
      html: this.html,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: this.showLoaderOnConfirm,
      reverseButtons: true,
      allowOutsideClick: () => !Swal.isLoading()
    })
  }
  
}
