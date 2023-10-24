import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import {
  AdjuntosColaborador,
  TipoVehiculo,
  Transporte,
} from "../../../models/colaboradores";

import { ColaboradorService } from "../../../services/colaborador.service";
import { UtilsService } from "../../../utils/utils.service";
import { TTHHColaboradorService } from "../../../services/tthh-colaborador.service";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "vex-modal-transporte-colaborador",
  templateUrl: "./modal-transporte-colaborador.component.html",
  styleUrls: ["./modal-transporte-colaborador.component.scss"],
})
export class ModalTransporteColaboradorComponent implements OnInit {
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @ViewChild("stepper", { static: false }) stepper: MatStepper;
  envioEnProgreso = false;
  idVehiculo: number;
  idEntidad: any;
  tipoColaborador;
  formTransporte: FormGroup;
  //selects
  tiposMovilidad = [
    { value: "1", viewValue: "Propia" },
    { value: "2", viewValue: "Empresa" },
  ];
  idColaborador: any;

  tipos: TipoVehiculo[] = [];
  loading: boolean;
  constructor(
    private colaboradorService: ColaboradorService,
    private _formBuilder: FormBuilder,
    public utilsService: UtilsService,
    public dialogRef: MatDialogRef<ModalTransporteColaboradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transporte,
    private tthhColaboradorService: TTHHColaboradorService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.formTransporte = this._formBuilder.group({
      idTipoVehiculo: new FormControl(
        this.data.idTipoVehiculo,
        Validators.required
      ),

      placa: new FormControl(this.data.placa, Validators.required),
      marca: new FormControl(this.data.marca, Validators.required),
      modelo: new FormControl(this.data.modelo, Validators.required),
      //clase: new FormControl(this.data.clase, Validators.required),
      idVehiculo: new FormControl(this.data.idVehiculo),
      color: new FormControl(this.data.color, Validators.required),
      propietario: new FormControl(this.data.propietario, Validators.required),
      anio: new FormControl(this.data.anio, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(4),
      ]),
    });
    this.cargarSelects();

    if (this.data.idVehiculo) {
      this.idVehiculo = this.data.idVehiculo;
    }

    this.idColaborador = this.data.idColaborador;
    this.tipoColaborador = this.data.tipoColaborador;
    this.idEntidad= this.data.idEntidad;
    this.getAdjunto(this.idColaborador, this.tipoColaborador);
  }

  getAdjunto(idColaborador, idTipoColaborador) {
    this.loading = true;
    this.tthhColaboradorService.getAdjuntos(idColaborador, idTipoColaborador)
      .subscribe(
        (res) => {
     
            //recorrer adjuntosColaborar y traer solo los que tengan el idTipoAdjunto 66 y que tengan el idAdjunto dentro de archivos igual a idVehiculo
           const adjunto = res.result.filter(
              (x) => x.nombreSeccion == "TRANSPORTE"
            );
 
              const dataAdjunto=
             [{idEntidad:this.idEntidad,
                idTipoAdjunto:adjunto[0].idTipoAdjunto
              }]
            this.dataService.getInfoAdjunto(dataAdjunto).subscribe(res=>{
              const dataAdjunto=res["result"]
             
              const adjuntoIdVehiculo = dataAdjunto.filter(
                (x) => x.idVehiculo == this.idVehiculo 
              );

              if(this.idVehiculo  && adjuntoIdVehiculo.length>0 ){
                adjunto[0]["nombreAdjunto"]=adjuntoIdVehiculo[0].nombreAdjunto
                adjunto[0]["archivos"]=adjuntoIdVehiculo
                this.adjuntosColaborador=adjunto
                this.loading = false;
              }else{
                adjunto[0]["nombreAdjunto"]=dataAdjunto[0].nombreAdjunto
                adjunto[0]["archivos"]=[]
                this.adjuntosColaborador=adjunto
                this.loading = false;
              }
             
              })
             
        },
        (error) => {
          this.utilsService.alerta("error", "Error al cargar los adjuntos");
          this.loading = false;
        }
      );
  }

  actualizarTransporte(form, idColaborador, idVehiculo) {
    if (!this.formTransporte.dirty) {
      this.stepper.next();
      return;
    }

    this.utilsService
      .confirmar(
        "Actualizar vehículo",
        "¿Está seguro que desea actualizar el vehículo?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.tthhColaboradorService
            .updateTransporte(form, idColaborador, idVehiculo)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Vehículo actualizado correctamente"
                );

                this.idVehiculo = res.idVehiculo;

                this.colaboradorService.changeMessage("getTransportes");

                this.stepper.next();
              },
              (err) => {
                this.utilsService.alerta("error", "Error al actualizar");
              }
            );
        }
      });
  }

  guardarReferenciaPersonal() {
    if (!this.envioEnProgreso) {
      this.envioEnProgreso = true;
      if (this.data.visualizationMode) {
        this.stepper.next();
      } else {
        if (this.formTransporte.get("idVehiculo").value) {
          this.actualizarTransporte(
            this.formTransporte.value,
            this.idColaborador,
            this.formTransporte.get("idVehiculo").value
          );
        } else {
          this.tthhColaboradorService
            .postTransporte(this.formTransporte.value, this.idColaborador)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Vehículo creado correctamente"
                );
                this.idVehiculo = res.result.idVehiculo;
                this.formTransporte.get("idVehiculo").setValue(this.idVehiculo);
  
                this.colaboradorService.changeMessage("getTransportes");
                this.stepper.next();
              },
              (err) => {
                this.utilsService.alerta("error", "Error al crear el transporte");
              }
            )
            .add(() => {
              this.envioEnProgreso = false; // Habilita el formulario después de completar el envío
            });
        }
      }
    }
  }
  

  cargarSelects() {
    this.tthhColaboradorService.getTiposVehiculos().subscribe(
      (data) => {
        this.tipos = data.result;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar los tipos de vehículos"
        );
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
