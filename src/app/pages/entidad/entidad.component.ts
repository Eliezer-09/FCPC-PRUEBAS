import { Component, OnInit } from "@angular/core";

import { FormControl } from "@angular/forms";

import { Router } from "@angular/router";

import { iconify } from "src/static-data/icons";

@Component({
  selector: "app-entidad",

  templateUrl: "./entidad.component.html",

  styleUrls: ["./entidad.component.scss"],
})
export class EntidadComponent {
  controlScreen: string = "";

  layoutCtrl = new FormControl("fullwidth");

  titulo: string;

  rutaHeader: string;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      //si la url incluye la palabra colaboradores

      if (this.router.url.includes("departamentos")) {
        this.tituloHeader = "Departamentos";

        this.titulo = "departamentos";

        this.rutaHeader = "/departamentos";
      } else if (this.router.url.includes("cargos")) {
        this.tituloHeader = "Cargos";

        this.titulo = "cargos";

        this.rutaHeader = "/cargos";
      }

      //si la ruta incluye ver

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

  icono = iconify.icGroup;

  tituloHeader = "";
}
