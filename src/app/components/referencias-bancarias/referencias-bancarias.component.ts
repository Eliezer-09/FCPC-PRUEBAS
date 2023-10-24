import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { NgxSpinnerService } from "ngx-spinner";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icEdit from "@iconify/icons-ic/twotone-edit";

import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import Swal from "sweetalert2";
import icPdf from "@iconify/icons-ic/picture-as-pdf";
import icDescription from "@iconify/icons-ic/twotone-description";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import { ModalEditDatosBancariosComponent } from "src/app/components/referencias-bancarias/modal-edit-datos-bancarios/modal-edit-datos-bancarios.component";

@Component({
  selector: "app-referencias-bancarias",
  templateUrl: "./referencias-bancarias.component.html",
  styleUrls: ["./referencias-bancarias.component.scss"],
})
export class ReferenciasBancariasComponent implements OnInit {
  @Input() idParticipe: number;
  @Output() newRefReady = new EventEmitter<boolean>();

  displayedColumns2 = [
    "fechaActualizacion",
    "institucion",
    "tipocuenta",
    "numerocuenta",
    "adjunto",
    "accion",
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10];
  bancarioForm: FormGroup = this.fb.group({
    idEntidadFinanciera: ["", Validators.required],
    idTipoCuenta: ["", Validators.required],
    numeroCuenta: ["", Validators.required],
  });

  institucionesFinancierasDataFilterCtrl: FormControl = new FormControl();
  filteredInstituciones: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  fechaActual;
  institucionesFinancierasData: any = [];
  newataCuentasBancarias;
  loading: boolean;
  tiposCuentas: any = [];

  //iconos
  icPdf = icPdf;
  icDescription = icDescription;
  icMoreVert = icMoreVert;
  icDelete = icDelete;

  icEdit = icEdit;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private componentService: ComponentesService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fechaActual = new Date().toISOString().split("T")[0];

    this.dataService.getInstitucionesFinancieras().subscribe((nacio) => {
      this.institucionesFinancierasData = nacio;
      this.filteredInstituciones.next(
        this.institucionesFinancierasData.slice()
      );
      this.institucionesFinancierasDataFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterInstituciones();
        });
    });

    // TRAER LOS TIPOS DE CUENTAS
    this.dataService.getTipsoCuentas().subscribe((nacio) => {
      this.tiposCuentas = nacio;
    });
    this.getNewReferenciasBancarias();
  }

  agregarCuentaBancaria() {
    this.spinner.show();
    this.dataService
      .postNewReferenciaBancaria(this.bancarioForm.value, this.idParticipe)
      .subscribe(
        (res: any) => {
          this.componentService.alerta("success", "Cuenta bancaria agregada");

          this.bancarioForm.reset();

          this.getNewReferenciasBancarias();
          this.spinner.hide();
        },
        (error) => {
          this.componentService.alerta("error", error.error.message);
          this.spinner.hide();
        }
      );
  }

  protected filterInstituciones() {
    if (!this.institucionesFinancierasData) {
      return;
    }
    let search = this.institucionesFinancierasDataFilterCtrl.value;
    if (!search) {
      this.filteredInstituciones.next(
        this.institucionesFinancierasData.slice()
      );
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredInstituciones.next(
      this.institucionesFinancierasData.filter(
        (instituciones) =>
          instituciones.descripcion.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getNewReferenciasBancarias() {
    this.loading = true;
    this.dataService.getNewReferenciaBancaria(this.idParticipe).subscribe(
      (res) => {
        this.newataCuentasBancarias = res.result;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        this.componentService.alerta(
          "error",
          "Error al cargar las referencias bancarias"
        );
        this.loading = false;
      }
    );
  }

  // ELIMINAR CUENTA BANCARIA
  eliminarCuenta(data) {
    Swal.fire({
      title: `¿Deseas eliminar la cuenta bancaria seleccionada?`,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#169116",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#911616",
      showLoaderOnConfirm: true,
      preConfirm: (texto) => {
        try {
          this.dataService
            .deleteReferenciaBancaria(
              this.idParticipe,
              data.idReferenciaBancaria
            )
            .subscribe(
              (res) => {
                this.getNewReferenciasBancarias();
                Swal.fire({
                  title: "Cuenta bancaria eliminada",
                  icon: "success",
                });
              },
              (err) => {
                Swal.fire({
                  title: "Error al eliminar la cuenta bancaria",
                  icon: "error",
                });
              }
            );
        } catch {
          this.getNewReferenciasBancarias();
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  // ADJUNTOS
  handleFileInput(event, item) {
    const file = event.target.files[0];

    this.spinner.show();

    this.dataService.getBase64(file).then(
      (res: any) => {
        const dataSave = {
          name: file.name,
          mimeType: file.type,
          adjunto: res,
          observaciones: "adjunto",
          tipoAdjunto: 10,
          idReferenciaBancaria: item.idReferenciaBancaria,
        };

/*         this.spinner.show(); */

        const postOrUpdatedAdjunto$ = item.idAdjuntos
          ? this.dataService.updateAdjunto(
              this.idParticipe,
              item.idAdjuntos,
              dataSave
            )
          : this.dataService.newPostAdjunto(dataSave, this.idParticipe);

        postOrUpdatedAdjunto$.subscribe(
          () => {
            this.newRefReady.next(true);
            this.spinner.hide();
            this.getNewReferenciasBancarias();
            this.changeDetectorRef.detectChanges();
          },
          (error) => {
            this.spinner.hide();
            this.newRefReady.next(false);

            this.componentService.errorHandler(error);
          }
        );

        const fechaActualizacion = new Date(item.fechaActualizacion)
          .toISOString()
          .split("T")[0];
        if (fechaActualizacion !== this.fechaActual) {
          this.dataService
            .updateReferenciaBancaria(
              item,
              this.idParticipe,
              item.idReferenciaBancaria
            )
            .subscribe(
              () => {
                this.getNewReferenciasBancarias();
                this.spinner.hide();
              },
              (error) => {
                this.componentService.errorHandler(error);
              }
            );
        }
      },
      (error) => {
        this.spinner.hide();
        this.newRefReady.next(false);
      }
    );
  }

  descargarCertificado(item) {
    if (item.url) {
      window.open(item.url);
    } else {
      this.spinner.show();
      this.dataService
        .getReferenciaBancaria(item.idReferenciaBancaria)
        .subscribe(
          (res) => {
            window.open(res["changingThisBreaksApplicationSecurity"]);
            this.spinner.hide();
          },
          (error) => {
            //si el error es 404
            if (error.status == 404) {
              //se muestra el mensaje de Se ha producido un error, por favor ingrese un adjunto nuevo
              this.componentService.alerta(
                "error",
                "Se ha producido un error, por favor ingrese un adjunto nuevo"
              );
            } else {
              //si no es 404 se muestra el mensaje de Se ha producido un error, por favor intente nuevamente
              this.componentService.alerta(
                "error",
                "Se ha producido un error, por favor intente nuevamente"
              );
            }
            this.spinner.hide();
          }
        );
    }
  }

  openDialog(element: any = null) {

    const dialogRef = this.dialog.open(ModalEditDatosBancariosComponent, {
      width: "600px",
      data: {
        idReferenciaBancaria: element ? element.idReferenciaBancaria : null,
        idEntidadFinanciera: element ? element.idEntidadFinanciera : null,
        idTipoCuenta: element ? element.idTipoCuenta : null,
        numeroCuenta: element ? element.numeroCuenta : null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (element) {
          this.dataService
            .updateReferenciaBancaria(
              result,
              this.idParticipe,
              result.idReferenciaBancaria
            )
            .subscribe(
              (res) => {
                this.componentService.alerta(
                  "success",
                  "Se actualizó correctamente los datos bancarios"
                );

                this.getNewReferenciasBancarias();
              },
              (err) => {
                this.componentService.alerta(
                  "error",
                  "Error al actualizar los datos bancarios"
                );
              }
            );
        }
      }
    });
  }
}
