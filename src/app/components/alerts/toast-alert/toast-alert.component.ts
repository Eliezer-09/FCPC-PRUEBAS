import { Component, Inject } from "@angular/core";
import Swal from "sweetalert2";

export enum Type_Alert {
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info",
  QUESTION = "question",
}

export enum Type_position {
  TOP = "top",
  CENTER = "center",
  BOTTOM = "bottom",
}

export enum Type_Message {
  ERROR = "Ha ocurrido un error.",
  SUCCESS = "La operación fue exitosa.",
}

@Component({
  selector: "vex-toast-alert",
  templateUrl: "./toast-alert.component.html",
  styleUrls: ["./toast-alert.component.scss"],
})
export class ToastAlertComponent {
  static typeAlert: string;
  static timerProgressBar: boolean;
  static title: string;
  static position: string;
  static timer: number;

  constructor(
    @Inject(String) private typeAlert: string = "success",
    @Inject(String) private title: string = "",
    @Inject(Boolean) private position = Type_position.TOP,
    @Inject(Boolean) private timerProgressBar = true,
    @Inject(Number) private timer: number = 4000
  ) {
    ToastAlertComponent.typeAlert = this.typeAlert;
    ToastAlertComponent.title = this.title;
    ToastAlertComponent.timerProgressBar = this.timerProgressBar;
    ToastAlertComponent.timer = this.timer;
    ToastAlertComponent.position = this.position;
    this.asigned_typeAlert();
    this.asigned_position();
    this.toast_alert(this.typeAlert);
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

  asigned_position() {
    switch (this.position) {
      case "top":
        this.position = Type_position.TOP;
        break;
      case "bottom":
        this.position = Type_position.BOTTOM;
        break;
      default:
        this.position = Type_position.CENTER;
        break;
    }
  }

  asigned_MessageAlert() {
    let title = "";
    switch (this.typeAlert) {
      case "success":
        title = Type_Message.SUCCESS;
        break;
      default:
        title = Type_Message.ERROR;
        break;
    }
    return title;
  }

  toast_alert(typeAlert) {
    return Swal.fire({
      toast: true,
      showConfirmButton: false,
      position: this.position,
      icon: typeAlert,
      timerProgressBar: this.timerProgressBar,
      timer: this.timer,
      title: this.title || this.asigned_MessageAlert(),
    });
  }
}
