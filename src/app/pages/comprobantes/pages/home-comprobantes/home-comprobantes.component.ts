import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { MenuItem, TreeNode } from "primeng/api";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { iconify } from "src/static-data/icons";

@Component({
  selector: "vex-home-comprobantes",
  templateUrl: "./home-comprobantes.component.html",
  styleUrls: ["./home-comprobantes.component.scss"],
  animations: [fadeInUp400ms],
})
export class HomeComprobantesComponent {
  controlScreen: string = "";

  layoutCtrl = new FormControl("fullwidth");

  titulo: string;

  rutaHeader: string;
  icono = iconify.icGroup;

  tituloHeader = "";

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      //si la url incluye la palabra colaboradores

      if (this.router.url.includes("comprobantes")) {
        this.tituloHeader = "Comprobantes";

        this.titulo = "comprobantes";

        this.rutaHeader = "/comprobantes";
      }

      if (this.router.url.includes("editar")) {
        this.controlScreen = "Editar";
      } else if (this.router.url.includes("ver")) {
        this.controlScreen = "Ver";
      } else if (this.router.url.includes("agregar")) {
        this.controlScreen = "Agregar";
      } else {
        this.controlScreen = "";
      }
    });
  }
}
