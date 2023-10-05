import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { iconify } from "src/static-data/icons";

@Component({
  selector: "vex-home-colaboradores",
  templateUrl: "./home-colaboradores.component.html",
  styleUrls: ["./home-colaboradores.component.scss"],
  animations: [fadeInUp400ms],
})
export class HomeColaboradoresComponent {
  controlScreen: string = "";

  layoutCtrl = new FormControl("fullwidth");
  t: any;
  titulo: string;
  rutaHeader: string;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      //si la url incluye la palabra colaboradores
      if (this.router.url.includes("honorarios")) {
        this.tituloHeader = "Honorarios";
        this.titulo = "honorarios";
        this.rutaHeader = "/honorarios";
      } else if (this.router.url.includes("redep")) {
        this.tituloHeader = "REDEP";
        this.titulo = "REDEP";
        this.rutaHeader = "/redep";
      } else if (this.router.url.includes("pasantes")) {
        this.tituloHeader = "Pasantes";
        this.titulo = "pasantes";
        this.rutaHeader = "/pasantes";
      }

      //si la ruta incluye ver

      if (this.router.url.includes("editar")) {
        if (this.titulo !== "REDEP") {
          //añadr controlScrren + this.titulo quitando la s
          this.controlScreen = "Editar " + this.titulo.slice(0, -1);
        } else {
          this.controlScreen = "Editar " + this.titulo;
        }
      }else if (this.router.url.includes("detalle")) {
          this.controlScreen = "Ver Detalle";
      }
       else if (this.router.url.includes("ver")) {
        if (this.titulo !== "REDEP") {
          //añadr controlScrren + this.titulo quitando la s
          this.controlScreen = "Ver " + this.titulo.slice(0, -1);
        } else {
          this.controlScreen = "Ver " + this.titulo;
        }
      } else if (this.router.url.includes("agregar")) {
        if (this.titulo !== "REDEP") {
          //añadr controlScrren + this.titulo quitando la s
          this.controlScreen = "Agregar " + this.titulo.slice(0, -1);
        } else {
          this.controlScreen = "Agregar " + this.titulo;
        }
      } else {
        this.controlScreen = "";
      }
    });
  }

  icono = iconify.icGroup;
  tituloHeader = "";
}
