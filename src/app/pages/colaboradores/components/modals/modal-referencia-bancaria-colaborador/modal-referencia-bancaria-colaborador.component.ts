import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { DataService } from "src/app/services/data.service";
import {
  AdjuntosColaborador,
  ReferenciaBancaria,
} from "../../../models/colaboradores";
import { ColaboradorService } from "../../../services/colaborador.service";
import { UtilsService } from "../../../utils/utils.service";
import { TTHHColaboradorService } from "../../../services/tthh-colaborador.service";

@Component({
  selector: "vex-modal-referencia-bancaria-colaborador",
  templateUrl: "./modal-referencia-bancaria-colaborador.component.html",
  styleUrls: ["./modal-referencia-bancaria-colaborador.component.scss"],
})
export class ModalReferenciaBancariaColaboradorComponent implements OnInit {
  //selects
  nombresBanco: any = [];

  fomReferenciaBancaria: FormGroup;

  tipoCuentaBancaria: any = [];
  idReferenciaBancaria: number;
  tipoColaborador: any;
  loading: boolean;
  idColaborador: any;
  idEntidad:any
  constructor(
    private dataService: DataService,
    private _formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private colaboradorService: ColaboradorService,
    public dialogRef: MatDialogRef<ModalReferenciaBancariaColaboradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReferenciaBancaria,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}
  adjuntosColaborador: AdjuntosColaborador[];
  @ViewChild("stepper", { static: false }) stepper: MatStepper;

  ngOnInit(): void {
    this.cargarSelects();

    this.fomReferenciaBancaria = this._formBuilder.group({
      idReferenciaBancaria: [this.data.idReferenciaBancaria],
      idEntidadFinanciera: new FormControl(this.data.idEntidadFinanciera, [
        Validators.required,
      ]),
      numeroCuenta: new FormControl(this.data.numeroCuenta, [
        Validators.required,
      ]),

      idTipoCuenta: new FormControl(this.data.idTipoCuenta, [
        Validators.required,
      ]),

      idEntidad: [this.data.idEntidad],
      adjunto: new FormControl(""),
    });

    if (this.data.idReferenciaBancaria) {
      this.idReferenciaBancaria = this.data.idReferenciaBancaria;
    }
    this.idColaborador = this.data.idColaborador;

    this.tipoColaborador = this.data.tipoColaborador;
    this.idEntidad= this.data.idEntidadPersona; 
    this.getAdjunto(this.idColaborador, this.tipoColaborador);
  }

  cargarSelects() {
    this.dataService.getInstitucionesFinancieras().subscribe(
      (data) => {
        this.nombresBanco = data;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar las instituciones financieras"
        );
      }
    );

    // TRAER LOS TIPOS DE CUENTAS
    this.dataService.getTipsoCuentas().subscribe(
      (data) => {
        this.tipoCuentaBancaria = data;
        this.tipoCuentaBancaria.forEach((element) => {
          element.idTipoCuenta = Number(element.idTipoCuenta);
        });
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar los tipos de cuentas"
        );
      }
    );
  }

  getAdjunto(idColaborador, idTipoColaborador) {
    this.loading = true;
    this.colaboradorService
      .getAdjuntos(idColaborador, idTipoColaborador)
      .subscribe(
        (res) => {

          const adjunto = res.result.filter(
            (x) => x.nombreSeccion == "REFERENCIA BANCARIA"
          );
 
            const dataAdjunto=
           [{idEntidad:this.idEntidad,
              idTipoAdjunto:adjunto[0].idTipoAdjunto
            }]
          this.dataService.getInfoAdjunto(dataAdjunto).subscribe(res=>{
            const dataAdjunto=res["result"]
           
            const adjuntoidReferenciaBancaria = dataAdjunto.filter(
              (x) => x.idReferenciaBancaria == this.idReferenciaBancaria 
            );
            
            if(this.idReferenciaBancaria && adjuntoidReferenciaBancaria.length>0 ){
              adjunto[0]["nombreAdjunto"]=adjuntoidReferenciaBancaria[0].nombreAdjunto
              adjunto[0]["archivos"]=adjuntoidReferenciaBancaria
              this.adjuntosColaborador=adjunto
              this.loading = false;
            }else{
              adjunto[0]["nombreAdjunto"]=dataAdjunto[0].nombreAdjunto
              adjunto[0]["archivos"]=[]
              this.adjuntosColaborador=adjunto
              this.loading = false;
            }
           
            })

      /*     if (this.idReferenciaBancaria) {
            //recorrer adjuntosColaborar y traer solo los que tengan el idTipoAdjunto 65 y que tengan el idAdjunto dentro de archivos igual a idReferenciaBancaria
            this.adjuntosColaborador = res.result.filter(
              (x) => x.nombreAdjunto == "Referencia Bancaria"
            );

            this.adjuntosColaborador.forEach((element) => {
              element.archivos = element.archivos.filter(
                (x) => x.idReferenciaBancaria == this.idReferenciaBancaria
              );
            });
          } else {
            this.adjuntosColaborador = res.result.filter(
              (x) => x.nombreAdjunto == "Referencia Bancaria"
            );

            this.adjuntosColaborador.forEach((element) => {
              element.archivos = [];
            });
          }

          this.loading = false; */
        },
        (error) => {
          this.utilsService.alerta("error", "Error al cargar los adjuntos");
          this.loading = false;
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  actualizarReferenciaBancaria(form, idEntidad, idReferenciaBancaria) {
    if (!this.fomReferenciaBancaria.dirty) {
      this.stepper.next();
      return;
    }

    this.utilsService
      .confirmar(
        "Actualizar Referencia Bancaria",
        "¿Está seguro que desea actualizar la referencia bancaria?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.tthhColaboradorService
            .updateReferenciaBancaria(form, idEntidad, idReferenciaBancaria)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Referencia Bancaria actualizada correctamente"
                );

                this.idReferenciaBancaria = res.idReferenciaBancaria;

                this.colaboradorService.changeMessage("getReferenciaBancaria");

                this.stepper.next();
              },
              (err) => {
                this.utilsService.alerta("error", err.error.message);
              }
            );
        }
      });
  }

  guardarReferenciaBancaria() {
    if (this.data.visualizationMode) {
      this.stepper.next();
      return;
    }

    if (this.fomReferenciaBancaria.get("idReferenciaBancaria").value) {
      this.actualizarReferenciaBancaria(
        this.fomReferenciaBancaria.value,
        this.idEntidad,
        this.fomReferenciaBancaria.get("idReferenciaBancaria").value
      );
    } else {
      this.tthhColaboradorService
        .postReferenciaBancaria(
          this.fomReferenciaBancaria.value,
          this.idEntidad
        )
        .subscribe(
          (res) => {
            this.utilsService.alerta(
              "success",
              "Referencia Bancaria creada correctamente"
            );
            this.idReferenciaBancaria = res["result"]["idReferenciaBancaria"];
            this.fomReferenciaBancaria
              .get("idReferenciaBancaria")
              .setValue(this.idReferenciaBancaria);

            this.colaboradorService.changeMessage("getReferenciaBancaria");

            this.stepper.next();
          },
          (err) => {
            this.utilsService.alerta("error", err.error.message);
          }
        );
    }
  }
}
