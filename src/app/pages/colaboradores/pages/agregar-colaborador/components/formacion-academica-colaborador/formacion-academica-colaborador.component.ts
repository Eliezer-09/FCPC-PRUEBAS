import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";

import {
  AdjuntosColaborador,
  ColaboradorPersona,
  FormacionAcademica,
} from "src/app/pages/colaboradores/models/colaboradores";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { DataService } from "src/app/services/data.service";
import { iconify } from "src/static-data/icons";
import { ModalFormacionAcademicaComponent } from "../../../../components/modals/modal-formacion-academica/modal-formacion-academica.component";

import { ColaboradorService } from "../../../../services/colaborador.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "vex-formacion-academica-colaborador",
  templateUrl: "./formacion-academica-colaborador.component.html",
  styleUrls: ["./formacion-academica-colaborador.component.scss"],
})
export class FormacionAcademicaColaboradorComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() idEntidad: any;
  @Input() tipoColaborador: any;
  @Input() visualizationMode: boolean = false;
  //forms
  form: FormGroup;
  datosGuardarFormacionAcademica: FormGroup;
  formacionAcademica: FormGroup;

  //iconos

  icroundAdd = iconify.icroundAdd;
  icroundEdit = iconify.icroundEditNote;
  icroundDelete = iconify.icroundDelete;

  //tabla

  tableColumns: TableColumn<any>[] = [
    {
      label: "Título",
      property: "titulo",
      type: "text",
      cssClasses: ["font-medium", "texto", "mat-column-width-30"],
    },
    {
      label: "Nivel de estudio",
      property: "nombreNivelEstudios",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Cursando",
      property: "cursandoActualmente",
      type: "text",
      cssClasses: ["font-medium", "colortext", "boolean"],
    },
    {
      label: "Tipo",
      property: "tipo",
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

  dataFormacionAcademica: FormacionAcademica[] = [];

  nivelesEstudio: any = [];

  loading: boolean = false;
  dataSelect: any=[];

  private subsReloadFormacion: Subscription = null;
  idNivelEstudios: number;
  titulo: string;

  constructor(
    private colaboradorService: ColaboradorService,
    private dataService: DataService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private ctrlContainer: FormGroupDirective,
    private tthhColaboradorService: TTHHColaboradorService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.idColaborador?.currentValue) {
      if (this.idColaborador && this.idColaborador != 0) {
        this.getFormacionAcademica();
      } else {
        this.dataFormacionAcademica = [];
      }
    }

 /*    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    } */
  }

  ngOnInit(): void {
    this.formacionAcademica = this._formBuilder.group({
      idFormacionAcademica: [""],
      idNivelEstudios: ["", Validators.required],
      institucionEducativa: [""],
      titulo: [""],

      cursandoActualmente: [""],
      fechaInicio: [""],
      fechaCulminacion: [""],
      nombreNivelEstudios: [""],

      anioCursando: [""],
      idCertificacion: [""],
      tiempoCurso: null,
    });

    this.datosGuardarFormacionAcademica = this._formBuilder.group({
      /*  idNivelEstudios: [""], */
      titulo: [""],
      adjuntos: this._formBuilder.array([]),
    });

    this.form = this.ctrlContainer.form;
    this.form.addControl(
      "datosGuardarFormacionAcademica",
      this.datosGuardarFormacionAcademica
    );

    this.cargarNivelEstudio();

    this.subsReloadFormacion =
      this.colaboradorService.currentMessage$.subscribe((message) => {
        if (message == "getFormacionAcademica") {
          this.getFormacionAcademica();
        } else if (message.startsWith("idNivelEstudios")) {
          let idNivelEstudios = parseInt(message.split(":")[1].trim());

          let titulo = message.split(",")[1].split(":")[1].trim();

          this.actualizarColaborador(idNivelEstudios, titulo);
        }
      });

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
  }

  asignarSelecNivelEstudio(){
    if(!this.datosGuardarFormacionAcademica.value["titulo"]){
      const area= this.dataSelect.filter((area) => area.formalCulminada)
      this.datosGuardarFormacionAcademica.controls["titulo"].setValue(area[0])
    }
   
  }

  actualizarColaborador(idNivelEstudios: number, titulo: string) {
    this.colaborador.persona.idNivelEstudios = idNivelEstudios;
    this.colaborador.persona.titulo = titulo;

    this.getFormacionAcademica();
  }

  cargarNivelEstudio() {
    this.dataService.getNivelEstudio().subscribe(
      (data) => {
        this.nivelesEstudio = data;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar los niveles de estudio"
        );
      }
    );
  }

  agregarNuevo() {
    this.dataSelect.unshift({
      idNivelEstudios: 10,
      titulo: "Sin especificar",
      institucionEducativa: "Sin especificar",
      nombreNivelEstudios: "No aplica",
      idFormacionAcademica: null,
    });
  }

  openDialog(
    element: any = null,
    tipo: string = "formacion",
    visualizationMode: boolean = false
  ) {
    if (element) {
      this.formacionAcademica.patchValue(element);
    }

    const dialogRef = this.dialog.open(ModalFormacionAcademicaComponent, {
      width: "800px",
      data: {
        idFormacionAcademica: this.formacionAcademica.get(
          "idFormacionAcademica"
        ).value,
        idNivelEstudios: this.formacionAcademica.get("idNivelEstudios").value,
        institucionEducativa: this.formacionAcademica.get(
          "institucionEducativa"
        ).value,
        titulo: this.formacionAcademica.get("titulo").value,

        cursandoActualmente: this.formacionAcademica.get("cursandoActualmente")
          .value,
        fechaInicio: this.formacionAcademica.get("fechaInicio").value,
        fechaCulminacion: this.formacionAcademica.get("fechaCulminacion").value,
        nombreNivelEstudios: this.formacionAcademica.get("nombreNivelEstudios")
          .value,
        anioCursando: this.formacionAcademica.get("anioCursando").value,
        idColaborador: this.idColaborador,
        tipoColaborador: this.tipoColaborador,

        tipo: tipo,
        idCertificacion: this.formacionAcademica.get("idCertificacion").value,
        tiempoCurso: this.formacionAcademica.get("tiempoCurso").value,
        visualizationMode: visualizationMode,
        dataSelect: this.dataSelect,
        idEntidad:this.idEntidad
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (visualizationMode) {
        return;
      }
      this.formacionAcademica.reset();

      if (result) {
        if (element) {
          this.getFormacionAcademica();
        }
      }
    });
  }

  deleteFormacion(element: FormacionAcademica) {
    if (element.idFormacionAcademica == 0) {
      return;
    }

    this.utilsService
      .confirmar("Eliminar formación académica", "¿Está seguro de eliminar?")
      .then((result) => {
        if (result.isConfirmed) {
          if (
            this.idNivelEstudios == element.idNivelEstudios &&
            this.titulo == element.titulo
          ) {
            let data = {
              idNivelEstudios: 10,
              titulo: "Sin especificar",
            };
            this.tthhColaboradorService
              .guardarDatosFormacionAcademica(this.idColaborador, element.idFormacionAcademica ,data)
              .subscribe(
                (res) => {},
                (err) => {}
              );
          }

          this.tthhColaboradorService
            .deleteFormacionAcademica(
              this.idColaborador,
              element.idFormacionAcademica
            )
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  element.isCurso
                    ? "Curso eliminado exitosamente"
                    : "Formación eliminada exitosamente"
                );

                this.getFormacionAcademica();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  element.isCurso
                    ? "Error al eliminar el curso"
                    : "Error al eliminar la formación"
                );
              }
            );
        }
      });
  }

  actionMenu(event) {
    if (event.action == "delete") {
      this.deleteFormacion(event.data);
    } else if (event.action == "edit") {
      if (event.data.isCurso) {
        this.openDialog(event.data, "certificado", this.visualizationMode);
      } else {
        this.openDialog(event.data, "formacion", this.visualizationMode);
      }
    } else if (event.action == "view") {
      if (event.data.isCurso) {
        this.openDialog(event.data, "certificado", true);
      } else {
        this.openDialog(event.data, "formacion", true);
      }
    }
  }

  public getFormacionAcademica() {
    this.loading = true;
    this.tthhColaboradorService.getFormacionAcademica(this.idColaborador).subscribe(
      (data) => {
        this.dataFormacionAcademica = data.result;

        this.idNivelEstudios = this.colaborador?.persona?.idNivelEstudios;

        this.titulo = this.colaborador?.persona?.titulo;
        let formacionAcademica = this.dataFormacionAcademica.find(
          (x) =>
            x.idNivelEstudios === this.idNivelEstudios &&
            x.titulo === this.titulo
        );

        this.datosGuardarFormacionAcademica.patchValue({
          titulo: formacionAcademica,
        });

        this.dataFormacionAcademica.forEach((element) => {
          if (element.isCurso) {
            element.tipo = element.nombreCertificacion;
          } else {
            element.tipo = "Educación Formal";
          }

          if (element.idNivelEstudios == 10) {
            this.dataFormacionAcademica = this.dataFormacionAcademica.filter(
              (x) =>
                (x.idNivelEstudios != 10 && x.titulo != "Sin especificar") ||
                x.isCurso
            );
          }
        });
        this.dataSelect = data.result;

        this.dataSelect = this.dataSelect.filter(
          (x) => (!x.isCurso || x.isCurso == null) && !x.cursandoActualmente
        );

        if (this.dataSelect.length == 0) {
          this.dataSelect.unshift({
            idNivelEstudios: 10,
            titulo: "Sin especificar",
            institucionEducativa: "Sin especificar",
            nombreNivelEstudios: "No aplica",
            idFormacionAcademica: null,
          });

          this.datosGuardarFormacionAcademica.patchValue({
            titulo: this.dataSelect[0],
          });
        } else {
          let formacionAcademica = this.dataSelect.find(
            (x) => x.idNivelEstudios === 10 && x.titulo === "Sin especificar"
          );

          if (
            formacionAcademica?.idNivelEstudios != this.idNivelEstudios &&
            formacionAcademica?.titulo != this.titulo
          ) {
            this.dataSelect = this.dataSelect.filter(
              (x) => x.idNivelEstudios != 10
            );
          }
        }
        this.asignarSelecNivelEstudio()

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.utilsService.alerta(
          "error",
          "Error al cargar la formación académica"
        );
      }
    );
  }

  get adjuntos() {
    return this.datosGuardarFormacionAcademica.controls[
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
            element.archivos ? element.archivos : null,
            element.esRequerido ? Validators.required : null,
          ],
        });

        this.adjuntos.push(adjunto);
      }
    });
  }

  ngOnDestroy() {
    this.colaboradorService.changeMessage("default message");
    this.subsReloadFormacion.unsubscribe();
  }
}
