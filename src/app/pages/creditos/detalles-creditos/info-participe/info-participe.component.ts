import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { NgxSpinnerService } from "ngx-spinner";
import { Participe, PostAdjunto } from "src/app/model/models";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { CreditosService } from "../../creditos.service";
import icPdf from "@iconify/icons-ic/picture-as-pdf";
import Swal from "sweetalert2";
import { FormControl, FormGroup } from "@angular/forms";
import moment from "moment";
import { MatDatepickerMonthYearComponent } from "src/app/components/Mat-date-formats/mat-datepicker-month-year/mat-datepicker-month-year.component";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-info-participe",
  templateUrl: "./info-participe.component.html",
  styleUrls: ["./info-participe.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoParticipeComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  @Input() idPrestamo: number;
  @Input() participe: Participe;
  @Input() rolPago: any;
  @Input() fechaRol: string;
  @Input() idParticipe: any;
  estadoParticipe: any;
  Aprobado = "PARTICIPE ACTIVO";
  Rechazado = "SOLICITUD RECHAZADA";
  Anulado = "ANULADO";
  Censado = "CENSADO";
  Completado = "COMPLETADO";
  Pendiente = "PENDIENTE DE APROBACION";
  NoDisponible = "NO ADHERIDO";
  fileToUploadControl: FormControl = new FormControl();
  fileToUpload: File = null;
  nombreRol: string;
  icPdf = icPdf;

  adjuntoRol = {
    tipoAdjunto: "RolPagos",
    adjunto: "",
  };
  fechaRolPagoAdjunto;
  rolPagoAdjunto;
  formRolPago: FormGroup;

  @ViewChild(MatDatepickerMonthYearComponent) matDatepickerMonthYearComponent;
  constructor(
    private componentService: ComponentesService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getRolPago();
  }

  ngAfterViewInit() {
    this.matDatepickerMonthYearComponent.setMonthAndYear(
      moment(new Date(this.fechaRol))
    );
  }

  getRolPago() {
    this.spinner.show();
    // ROL PAGO
    this.rolPago=null
    this.dataService
      .newGetAdjuntoById(
        this.idParticipe,
        TiposAdjunto.RolPagos,
        this.idPrestamo
      )
      .subscribe(
        (res: any) => {
          if (res["result"].length > 0) {
            this.spinner.hide();
            this.setInnerHtmlRol(res["result"][0].url);
            this.rolPago = res["result"][0];
          }
          this.spinner.hide();
        },
        (error) => {
          this.componentService.alerta(
            "error",
            "Ocurrio un error al obtener el rol de pagos"
          );
          this.spinner.hide();
        }
      );
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  public innerHtmlRol: SafeHtml;
  public setInnerHtmlRol(pdfurl: string) {
    this.innerHtmlRol = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  cargarRol(files: FileList) {
    this.fileToUpload = files?.item(0);
    this.nombreRol = this.fileToUpload.name;
    Swal.fire({
      title: `¿Desea actualizar el rol de pagos de este crédito?`,
      icon: "warning",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Si",
      confirmButtonColor: "#169116",
      cancelButtonText: "No",
      cancelButtonColor: "#911616",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.dataService.getBase64(this.fileToUpload).then(
          (res: any) => {
            this.adjuntoRol.adjunto = res;
            if (this.adjuntoRol.adjunto) {
              const data: PostAdjunto = {
                adjunto: res,
                name: files[0].name,
                mimeType: files[0].type,
                tipoAdjunto: TiposAdjunto.RolPagos,
                observaciones: this.fechaRolPagoAdjunto,
                idPrestamo: this.idPrestamo,
              };

              if (this.rolPago) {
                this.actualizarRolPago(data);
              } else {
                this.adjuntarRolPago(data);
              }
            }
          },
          (error) => {
            this.componentService.errorHandler(error);
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      this.fileToUpload = null;
      this.nombreRol = "";
      this.fileToUploadControl.reset();
    });
  }
  adjuntarRolPago(data) {
    this.dataService.newPostAdjunto(data, this.idParticipe).subscribe(
      (res: any) => {
        this.getRolPago();
      },
      (error) => {
        this.componentService.errorHandler(error);
      }
    );
  }

  actualizarRolPago(data) {
    this.dataService
      .newUpdateAdjunto(this.idParticipe, this.rolPago.idAdjunto, data)
      .subscribe(
        (res: any) => {
          this.getRolPago();
        },
        (error) => {
          this.componentService.errorHandler(error);
        }
      );
  }

  showfecha = true;
  setMonthAndYear(event) {
    if (event) {
      this.fechaRolPagoAdjunto = moment(event).format("YYYY-MM");
      this.showfecha = true;
    } else {
      this.showfecha = false;
    }
  }
}
