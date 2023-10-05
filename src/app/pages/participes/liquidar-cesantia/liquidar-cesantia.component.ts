import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject } from "rxjs";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { CesantesService } from "../cesantes.service";
import { Cesante } from "../models/cesante.interface";
import { Cesantia, SimulacionCesantia } from "../models/cesantia.interface";
import { Participe } from "../models/models-participes";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-liquidar-cesantia",
  templateUrl: "./liquidar-cesantia.component.html",
  styleUrls: ["./liquidar-cesantia.component.scss"],
  animations: [fadeInUp400ms, stagger80ms, scaleIn400ms, fadeInRight400ms],
})
export class LiquidarCesantiaComponent implements OnInit {
  searchCtrl = new FormControl();
  fotoPerfil;
  participe: Participe;
  cesante: Cesante;
  existeCesante = false;
  buscar = "";
  show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  simulacionCesantia: SimulacionCesantia;
  idCesantia: number;
  cesantia: Cesantia;

  constructor(
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private componentesService: ComponentesService,
    private cesanteService: CesantesService
  ) {}

  ngOnInit(): void {}

  limpiar() {
    this.existeCesante = false;
    this.fotoPerfil = "";
    this.participe = {};
  }

  buscarCesante() {
    this.limpiar();
    this.spinner.show();
    if (
      this.buscar.length == 10 ||
      this.buscar.length == 4 ||
      this.buscar.length == 5
    ) {
      //Datos del Cesante
      this.dataService.getParticipeByIdentificacion(this.buscar).subscribe(
        async (res) => {
          if (res["result"].estado == "Cesado") {
            this.participe = res["result"];
            //Foto perfil
            this.dataService
              .newGetAdjuntoById(this.participe.idParticipe, TiposAdjunto.Foto)
              .subscribe(
                (res) => {
                  this.fotoPerfil = res["result"][0]["url"];
                  this.spinner.hide();
                },
                (error) => {
                  this.spinner.hide();
                }
              );
            this.spinner.hide();
            await this.cargarCesanteById(this.participe.idParticipe);
          } else {
            this.spinner.hide();
            this.componentesService.alerta(
              "info",
              "Para liquidar la cuenta debes ser un Cesante"
            );
          }
        },
        async (error) => {
          this.spinner.hide();
          this.componentesService.alerta("error", error["error"]["message"]);
          this.show.next(true);
        }
      );
    } else {
      this.spinner.hide();
    }
  }

  async cargarCesanteById(idCesante) {
    await this.cesanteService.getCesanteById(idCesante).subscribe(
      async (res: any) => {
        this.cesante = await res;
        this.idCesantia = this.cesante.idCesantia;
        if (this.idCesantia != 0) {
          this.cargarCesantiaById(this.idCesantia, idCesante);
        } else {
          this.componentesService.alerta(
            "info",
            "Tu cuenta individual ya ha sido liquidada anteriormente"
          );
        }
      },
      (response) => {
        this.spinner.hide();
        this.componentesService.alerta("error", response.error.message);
      }
    );
  }

  async cargarCesantiaById(idCesantia, idCesante) {
    await this.cesanteService.getCesantiaById(idCesantia).subscribe(
      async (res: any) => {
        if (res.estado == "Liquidado") {
          this.componentesService.alerta(
            "info",
            "Tu cuenta individual ya ha sido liquidada anteriormente"
          );
        } else {
          this.existeCesante = true;
          await this.cargarSimulacionCesantia(idCesante);
        }
      },
      (response) => {
        this.spinner.hide();
        this.componentesService.alerta("error", response.error.message);
      }
    );
  }

  async cargarSimulacionCesantia(idCesante) {
    await this.cesanteService.getSimulacionCesante(idCesante).subscribe(
      async (res: any) => {
        this.simulacionCesantia = await res;
      },
      (response) => {
        this.spinner.hide();
        this.componentesService.alerta("error", response.error.message);
      }
    );
  }
}
