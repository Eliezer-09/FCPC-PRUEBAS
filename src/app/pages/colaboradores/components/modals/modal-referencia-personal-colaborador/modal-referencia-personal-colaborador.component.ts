import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import {
  AdjuntosColaborador,
  ReferenciaPersonal,
} from "../../../models/colaboradores";
import { ColaboradorService } from "../../../services/colaborador.service";
import { UtilsService } from "../../../utils/utils.service";
import { TTHHColaboradorService } from "../../../services/tthh-colaborador.service";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "vex-modal-referencia-personal-colaborador",
  templateUrl: "./modal-referencia-personal-colaborador.component.html",
  styleUrls: ["./modal-referencia-personal-colaborador.component.scss"],
})
export class ModalReferenciaPersonalColaboradorComponent implements OnInit {
  formReferenciaPersonal: FormGroup;
  loading: boolean;
  idEntidad:any
  constructor(
    public dialogRef: MatDialogRef<ModalReferenciaPersonalColaboradorComponent>,
    private _formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private colaboradorService: ColaboradorService,
    public utils: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: ReferenciaPersonal,
    private tthhColaboradorService: TTHHColaboradorService,
    private dataService: DataService,
  ) {}

  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @ViewChild("stepper", { static: false }) stepper: MatStepper;
  envioEnProgreso = false;
  idReferenciaPersonal: number;
  idColaborador: any;
  tipoColaborador: any;

  filteredOptions: Observable<any[]>;

  parentescos = [
    "AMIGO/A",
    "CONOCIDO/A",
    "EX COMPAÑERO/A DE TRABAJO",
    "EX JEFE",
    "EX COMPAÑERO/ A DE ESTUDIO",
    "OTRO",
  ];

  ngOnInit(): void {
    this.formReferenciaPersonal = this._formBuilder.group({
      idReferenciaPersonal: new FormControl(this.data.idReferenciaPersonal),
      idEntidad: new FormControl(this.data.idEntidad),
      nombres: new FormControl(
        this.utils.capitalize(this.data.nombres),
        Validators.required
      ),
      telefono: new FormControl(this.data.telefono, [
        Validators.required,
        Validators.pattern("^[0-9+]*$"),
        Validators.minLength(10),
      ]),
      correo: new FormControl(this.data.correo, [
        Validators.required,
        Validators.email,
      ]),
      observaciones: new FormControl(
        this.data.observaciones,
        Validators.required
      ),

      adjunto: new FormControl(""),
    });

    if (this.data.idReferenciaPersonal) {
      this.idReferenciaPersonal = this.data.idReferenciaPersonal;
    }

    this.idColaborador = this.data.idColaborador;
    this.tipoColaborador = this.data.tipoColaborador;
    this.idEntidad= this.data.idEntidadPersona;
    this.getAdjunto(this.idColaborador, this.tipoColaborador);

    this.filteredOptions =
      this.formReferenciaPersonal.controls.observaciones.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value || ""))
      );
  }

  private _filter(value: any): any[] {
    const filterValue = value?.toLowerCase();

    return this.parentescos.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAdjunto(idColaborador, idTipoColaborador) {
    this.loading = true;
    this.tthhColaboradorService
      .getAdjuntos(idColaborador, idTipoColaborador)
      .subscribe(
        (res) => {

          const adjunto = res.result.filter(
            (x) => x.nombreSeccion == "REFERENCIA PERSONAL"
          );
 
            const dataAdjunto=
           [{idEntidad:this.idEntidad,
              idTipoAdjunto:adjunto[0].idTipoAdjunto
            }]
          this.dataService.getInfoAdjunto(dataAdjunto).subscribe(res=>{
            const dataAdjunto=res["result"]
           
            const adjuntoidReferenciaPersonal = dataAdjunto.filter(
              (x) => x.idReferenciaPersonal == this.idReferenciaPersonal 
            );
            
            if(this.idReferenciaPersonal && adjuntoidReferenciaPersonal.length>0 ){
              adjunto[0]["nombreAdjunto"]=adjuntoidReferenciaPersonal[0].nombreAdjunto
              adjunto[0]["archivos"]=adjuntoidReferenciaPersonal
              this.adjuntosColaborador=adjunto
              this.loading = false;
            }else{
              adjunto[0]["nombreAdjunto"]=dataAdjunto[0].nombreAdjunto
              adjunto[0]["archivos"]=[]
              this.adjuntosColaborador=adjunto
              this.loading = false;
            }
           
            })
         /*    
          if (this.idReferenciaPersonal) {
            //recorrer adjuntosColaborar y traer solo los que tengan el idTipoAdjunto 65 y que tengan el idAdjunto dentro de archivos igual a idReferenciaPersonal
            this.adjuntosColaborador = res.result.filter(
              (x) => x.nombreAdjunto == "REFERENCIA PERSONAL"
            );

            this.adjuntosColaborador.forEach((element) => {
              element.archivos = element.archivos.filter(
                (x) => x.idReferenciaPersonal == this.idReferenciaPersonal
              );
            });
          } else {
            this.adjuntosColaborador = res.result.filter(
              (x) => x.nombreAdjunto == "REFERENCIA PERSONAL"
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

  actualizarReferenciaPersonal(form, idColaborador, idReferenciaPersonal) {
    if (!this.formReferenciaPersonal.dirty) {
      this.stepper.next();
      return;
    }
    this.utilsService
      .confirmar(
        "Actualizar Referencia Personal",
        "¿Está seguro que desea actualizar la referencia personal?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.tthhColaboradorService
            .updateReferenciaPersonal(form, idColaborador, idReferenciaPersonal)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Referencia Personal actualizada correctamente"
                );

                this.idReferenciaPersonal = res.result.idReferenciaPersonal;

                this.colaboradorService.changeMessage("getReferenciaPersonal");
                this.stepper.next();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al actualizar la formación académica"
                );
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
        return;
      }

      if (this.formReferenciaPersonal.get("idReferenciaPersonal").value) {
        this.actualizarReferenciaPersonal(
          this.formReferenciaPersonal.value,
          this.idColaborador,
          this.formReferenciaPersonal.get("idReferenciaPersonal").value
        );
      } else {
        this.tthhColaboradorService
          .postReferenciaPersonal(
            this.formReferenciaPersonal.value,
            this.idEntidad
          )
          .subscribe(
            (res) => {
              this.utilsService.alerta(
                "success",
                "Referencia Personal creada correctamente"
              );
              this.idReferenciaPersonal = res.result.idReferenciaPersonal;
              this.formReferenciaPersonal
                .get("idReferenciaPersonal")
                .setValue(this.idReferenciaPersonal);

              this.colaboradorService.changeMessage("getReferenciaPersonal");
              this.stepper.next();
            },
            (err) => {
              this.utilsService.alerta(
                "error",
                "Error al crear la referencia personal"
              );
            }
          )
          .add(() => {
            this.envioEnProgreso = false; // Habilita el formulario después de completar el envío
          });
      }
    }
  }
}
