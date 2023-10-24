import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormGroupDirective,
  Validators,
  FormArray,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";

import {
  ColaboradorPersona,
  AdjuntosColaborador,
  ReferenciaBancaria,
} from "src/app/pages/colaboradores/models/colaboradores";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";

import { iconify } from "src/static-data/icons";
import { ModalReferenciaBancariaColaboradorComponent } from "../../../../components/modals/modal-referencia-bancaria-colaborador/modal-referencia-bancaria-colaborador.component";

import { ColaboradorService } from "../../../../services/colaborador.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "vex-datos-referencia-bancaria-colaborador",
  templateUrl: "./datos-referencia-bancaria-colaborador.component.html",
  styleUrls: ["./datos-referencia-bancaria-colaborador.component.scss"],
})
export class DatosReferenciaBancariaColaboradorComponent
  implements OnInit, OnChanges
{
  //inputs
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() tipoColaborador: any;
  @Input() visualizationMode: boolean = false;
  @Input() idEntidad: any;
  loading: boolean = false;

  //forms
  form: FormGroup;
  referenciaBancaria: FormGroup;
  datosGuardarReferenciaBancaria: FormGroup;

  //iconos

  icroundAdd = iconify.icroundAdd;
  icroundEdit = iconify.icroundEditNote;
  icroundDelete = iconify.icroundDelete;

  //tabla

  tableColumns: TableColumn<any>[] = [
    {
      label: "Nombre del banco",
      property: "nombreEntidadFinanciera",
      type: "text",
      cssClasses: ["font-medium", "texto", "mat-column-width-30"],
    },
    {
      label: "Tipo de cuenta",
      property: "nombreTipoCuenta",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Número de cuenta",
      property: "numeroCuenta",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },

    {
      label: "acciones",
      property: "acciones",
      type: "button",
      cssClasses: ["text-secondary", "w-20"],
    },
  ];

  menuOption = [
    {
      name: "Ver",
      icon: "visibility",
      type: "function",
      accion: "view",
    },
    {
      name: "Editar",
      icon: "edit",
      type: "function",
      accion: "edit",
    },
    {
      name: "Eliminar",
      icon: "delete",
      type: "function",
      accion: "delete",
    },
  ];

  dataReferenciasBancarias: ReferenciaBancaria[] = [];

  //numeroCuentaPacifico que solo formularioReactivo

  private subsReloadDatos: Subscription = null;
  constructor(
    private colaboradorService: ColaboradorService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective,
    private utilsService: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}

  clear(){
    this.idColaborador=null;
    this.idEntidad=null;
    this.dataReferenciasBancarias = [];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.idColaborador?.currentValue) { 
    if (this.idColaborador && this.idColaborador != 0) {
          this.getReferenciasBancarias();
    } else {
      this.dataReferenciasBancarias = [];
    }
  }
    /* 
    if (changes.colaborador?.currentValue) {
      this.asignarValoresFormulario();
    } */

    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  ngOnInit(): void {
    this.referenciaBancaria = this._formBuilder.group({
      idReferenciaBancaria: [""],
      idEntidadFinanciera: [""],
      numeroCuenta: [""],
      idTipoCuenta: [""],
      idEntidad: [""],
      adjunto: [""],
      nombreEntidadFinanciera: [""],
      nombreTipoCuenta: [""],
    });

    this.datosGuardarReferenciaBancaria = this._formBuilder.group({
      idReferenciaBancaria: ["", Validators.required],
      adjuntos: this._formBuilder.array([]),
    });

    this.form = this.ctrlContainer.form;
    this.form.addControl(
      "datosGuardarReferenciaBancaria",
      this.datosGuardarReferenciaBancaria
    );

    if (this.visualizationMode) {
      this.menuOption = [
        {
          name: "Ver",
          icon: "visibility",
          type: "function",
          accion: "view",
        },
      ];
    }

    this.subsReloadDatos = this.colaboradorService.currentMessage$.subscribe(
      (message) =>
        message === "getReferenciaBancaria"
          ? this.getReferenciasBancarias()
          : null
    );
   /*  this.asignarReferenciaBancaria(this.colaborador.colaborador.idReferenciaBancaria) */
  }

  asignarReferenciaBancaria(idReferenciaBancaria){
    if(!this.datosGuardarReferenciaBancaria.value.idReferenciaBancaria){
      this.datosGuardarReferenciaBancaria.controls.idReferenciaBancaria.setValue(idReferenciaBancaria)
    }
 
  }

  openDialog(element: any = null, visualizationMode: boolean = false) {
    if (element) {
      this.referenciaBancaria.patchValue(element);
    }
    console.log(this.idColaborador)

    const dialogRef = this.dialog.open(
      ModalReferenciaBancariaColaboradorComponent,
      {
        width: "800px",
        data: {
          idReferenciaBancaria: this.referenciaBancaria.get(
            "idReferenciaBancaria"
          ).value,
          idEntidadFinanciera: this.referenciaBancaria.get(
            "idEntidadFinanciera"
          ).value,
          numeroCuenta: this.referenciaBancaria.get("numeroCuenta").value,
          idTipoCuenta: this.referenciaBancaria.get("idTipoCuenta").value,
          idEntidad: this.referenciaBancaria.get("idEntidad").value,
          idColaborador: this.idColaborador,
          tipoColaborador: this.tipoColaborador,
          visualizationMode: visualizationMode,
          idEntidadPersona: this.idEntidad,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (visualizationMode) {
        return;
      }
      this.referenciaBancaria.reset();

      if (result) {
        if (element) {
          this.getReferenciasBancarias();
        }
      }
    });
  }

  /* result.idEntidad = this.idColaborador;
          this.colaboradorService
            .updateReferenciaBancaria(
              result,
              this.idColaborador,
              result.idReferenciaBancaria
            )
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Referencia bancaria actualizada correctamente"
                );

                this.getReferenciasBancarias();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al actualizar la referencia bancaria"
                );
              }
            );
        } else {
          result.idEntidad = this.idColaborador;
          this.colaboradorService
            .postReferenciaBancaria(result, this.idColaborador)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Referencia bancaria creada correctamente"
                );

                this.getReferenciasBancarias();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al crear la referencia bancaria"
                );
              }
            );
        }
      }
    });
  }
 */
  deleteFormacion(element) {
    this.utilsService
      .confirmar(
        "Eliminar referencia bancaria",
        "¿Está seguro de eliminar la referencia bancaria?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.tthhColaboradorService
            .deleteReferenciaBancaria(
              this.idEntidad,
              element.idReferenciaBancaria
            )
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Referencia bancaria eliminada correctamente"
                );

                this.datosGuardarReferenciaBancaria.reset();

                this.getReferenciasBancarias();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al eliminar la referencia bancaria"
                );
              }
            );
        }
      });
  }

  getReferenciasBancarias() {
    this.loading = true;
    this.tthhColaboradorService.getReferenciaBancaria(this.idEntidad).subscribe(
      (res) => {
        this.dataReferenciasBancarias = res.result;

        this.asignarValoresFormulario();

        this.loading = false;
      },
      (err) => {
        this.loading = false;

        this.utilsService.alerta(
          "error",
          "Error al obtener las referencias bancarias"
        );
      }
    );
  }

  asignarValoresFormulario() {
    let idReferenciaBancaria =
      this.colaborador.colaborador?.idReferenciaBancaria;

    //si esta referencia coinncide con alguna de dataReferenciasBancarias

    let referenciaBancaria = this.dataReferenciasBancarias.find(
      (x) => x.idReferenciaBancaria == idReferenciaBancaria
    );

    if (referenciaBancaria) {
      this.datosGuardarReferenciaBancaria.patchValue({
        idReferenciaBancaria:
          this.colaborador.colaborador?.idReferenciaBancaria,
      });
    }
  }

  actionMenu(event) {
    if (event.action == "delete") {
      this.deleteFormacion(event.data);
    } else if (event.action == "edit") {
      this.openDialog(event.data);
    } else if (event.action == "view") {
      this.openDialog(event.data, true);
    }
  }

  get adjuntos() {
    return this.datosGuardarReferenciaBancaria.controls[
      "adjuntos"
    ] as FormArray;
  }

  obtenerAdjuntos() {
    this.adjuntos.clear();

    this.adjuntosColaborador.forEach((element: AdjuntosColaborador) => {
      if (element.nombreSeccion == this.controlView) {
        let adjunto = this._formBuilder.group({
          nombre: [element.nombreAdjunto],
          archivos: [
            element.archivos.length > 0 ? element.archivos : null,
            element.esRequerido ? Validators.required : null,
          ],
        });

        this.adjuntos.push(adjunto);
      }
    });
  }
}
