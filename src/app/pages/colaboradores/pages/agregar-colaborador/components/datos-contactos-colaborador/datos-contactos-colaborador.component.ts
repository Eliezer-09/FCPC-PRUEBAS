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
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import {
  AdjuntosColaborador,
  ColaboradorPersona,
  Contacto,
} from "src/app/pages/colaboradores/models/colaboradores";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { ModalContactoColaboradorComponent } from "../../../../components/modals/modal-contacto-colaborador/modal-contacto-colaborador.component";
import { ColaboradorService } from "../../../../services/colaborador.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "vex-datos-contactos-colaborador",
  templateUrl: "./datos-contactos-colaborador.component.html",
  styleUrls: ["./datos-contactos-colaborador.component.scss"],
})
export class DatosContactosColaboradorComponent implements OnInit, OnChanges {
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() tipoColaborador: any;
  @Input() visualizationMode: boolean = false;

  loading = false;
  //forms
  form: FormGroup;
  contacto: FormGroup;
  datosGuardarContacto: FormGroup;

  //iconos

  icroundAdd = iconify.icroundAdd;
  icroundEdit = iconify.icroundEditNote;
  icroundDelete = iconify.icroundDelete;

  //tabla

  tableColumns: TableColumn<any>[] = [
    {
      label: "Nombre",
      property: "nombre",
      type: "text",
      cssClasses: ["font-medium", "texto", "mat-column-width-30"],
    },
    {
      label: "Celular",
      property: "celular",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Parentezco",
      property: "nombreParentezco",
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

  dataContactos: Contacto[] = [];

  constructor(
    private colaboradorService: ColaboradorService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective,
    private utilsService: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.idColaborador?.currentValue) { 
    if (this.idColaborador && this.idColaborador != 0) {
      this.getContactos();
    } else {
      this.dataContactos = [];
    }
  }

    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  clear(){
    this.idColaborador=null;
    this.dataContactos = [];
  }

  ngOnInit(): void {
    this.contacto = this._formBuilder.group({
      idContacto: [""],
      idEntidad: [""],
      nombre: [""],
      telefono: [""],
      correo: [""],
      nombreParentezco: [""],
      celular: [""],
      emergencia: [false],
      idParentesco: [""],

      adjuntos: this._formBuilder.array([]),
    });

    this.datosGuardarContacto = this._formBuilder.group({
      idContacto: ["", Validators.required],
      idEntidad: [""],
      nombre: [""],
      telefono: [""],
      correo: [""],
      nombreParentezco: [""],
      celular: [""],
      emergencia: [false],
      idParentesco: [""],
    });

    this.form = this.ctrlContainer.form;
    this.form.addControl("datosGuardarContacto", this.datosGuardarContacto);

    if (this.visualizationMode) {
      this.tableColumns.pop();

      this.tableColumns.push({
        label: "Teléfono",
        property: "telefono",
        type: "text",
        cssClasses: ["font-medium", "colortext", "texto"],
      });
      this.tableColumns.push({
        label: "Correo",
        property: "correo",
        type: "text",

        cssClasses: ["font-medium", "colortext", "texto"],
      });
    }
  }

  openDialog(element: any = null, visualizationMode: boolean = false) {
    if (element) {
      this.contacto.patchValue(element);
    }

    const dialogRef = this.dialog.open(ModalContactoColaboradorComponent, {
      width: "600px",
      data: {
        idContacto: this.contacto.get("idContacto").value,
        idEntidad: this.contacto.get("idEntidad").value,
        nombre: this.contacto.get("nombre").value,
        telefono: this.contacto.get("telefono").value,
        correo: this.contacto.get("correo").value,
        nombreParentezco: this.contacto.get("nombreParentezco").value,
        celular: this.contacto.get("celular").value,
        emergencia: this.contacto.get("emergencia").value,
        idParentesco: this.contacto.get("idParentesco").value,
        visualizationMode: visualizationMode,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (visualizationMode) {
        return;
      }
      this.contacto.patchValue({
        idContacto: "",
        idEntidad: "",
        nombre: "",
        telefono: "",
        correo: "",
        nombreParentezco: "",
        celular: "",
        emergencia: false,
        idParentesco: "",
      });

      if (result) {
        if (element) {
          result.idEntidad = this.idColaborador;

          this.tthhColaboradorService
            .updateContacto(result, this.idColaborador, result.idContacto)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Contacto actualizado correctamente"
                );

                this.getContactos();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al actualizar el contacto"
                );
              }
            );
        } else {
          result.idEntidad = this.idColaborador;
          this.tthhColaboradorService
            .postContacto(result, this.idColaborador)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Contacto agregado correctamente"
                );

                this.getContactos();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al agregar el contacto"
                );
              }
            );
        }
      }
    });
  }

  deleteFormacion(element: Contacto) {
    //si la idContacto es la misma que la de formDatosContacto, se elimina el formDatosContacto
    this.utilsService
      .confirmar("Eliminar contacto", "¿Está seguro de eliminar el contacto?")
      .then((result) => {
        if (result.isConfirmed) {
          if (
            this.datosGuardarContacto.get("idContacto").value ==
            element.idContacto
          ) {
            this.datosGuardarContacto.reset();
          }

          this.tthhColaboradorService
            .deleteContacto(this.idColaborador, element.idContacto)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Contacto eliminado correctamente"
                );

                this.getContactos();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al eliminar el contacto"
                );
              }
            );
        }
      });
  }

  editarRow(element: any) {
    this.openDialog(element);
  }

  getContactos() {
    this.loading = true;
    this.tthhColaboradorService.getContactos(this.idColaborador).subscribe(
      (res) => {
        this.dataContactos = res.result;
        //si en dataContactos existe uno con eemergenciaSelectmergencia = true entonces se lo asigna al form
        this.dataContactos.forEach((element) => {
          if (element.emergencia) {
            this.datosGuardarContacto.setValue(element);
          }
        });

        this.loading = false;
      },
      (err) => {
        this.loading = false;

        this.utilsService.alerta("error", "Error al obtener los contactos");
      }
    );
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
    return this.contacto.controls["adjuntos"] as FormArray;
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

  changeContactoEmergencia(id: any) {
    this.dataContactos.forEach((element) => {
      if (element.idContacto == id) {
        element.emergencia = true;
      } else {
        element.emergencia = false;
      }
    });

    this.datosGuardarContacto.setValue(
      this.dataContactos.find((element) => element.idContacto == id)
    );
  }
}
