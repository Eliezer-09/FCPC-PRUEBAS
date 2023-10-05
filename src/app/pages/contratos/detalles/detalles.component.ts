import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { stagger80ms } from "../../../../@vex/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../@vex/animations/fade-in-right.animation";
import { ComponentesService } from "../../../services/componentes.service";
import { Direccion } from "../../../model/models";
import { ContratosService } from "../contratos.service";
import { AuthService } from "../../auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataService } from "src/app/services/data.service";
import { NGXLogger } from "ngx-logger";
import { iconify } from "src/static-data/icons";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-detalles",
  templateUrl: "./detalles.component.html",
  styleUrls: ["./detalles.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class DetallesComponent implements OnInit {
  id: any = this.route.snapshot.paramMap.get("cedula");
  estado: any = this.route.snapshot.paramMap.get("estado");

  accountFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  confirmFormGroup: FormGroup;

  verticalAccountFormGroup: FormGroup;
  verticalPasswordFormGroup: FormGroup;
  verticalConfirmFormGroup: FormGroup;

  phonePrefixOptions = ["+1", "+27", "+44", "+49", "+61", "+91"];

  passwordInputType = "password";

  banderaFirma = false;
  isVideo = false;
  banderaCedulaFrontal = false;
  banderaCedulaPosterior = false;
  firma;
  video;
  cedulaFrontal;
  cedulaPosterior;

  firtTab = "Datos";
  secondTab = "Firma y Cedula";
  thirdTab = "Video";
  infoMessage = "El participe no tiene este contenido";
  labelName: string;

  icroundSmsFailed = iconify.icroundSmsFailed;
  icroundAttachFile = iconify.icroundAttachFile;

  participe: any = {
    direcciones: [{}],
  };

  var;
  nota = "";
  mostrarTextoVideo = false;

  referenciaBancaria: any;
  provincias: any = [];
  ciudades: any = [];
  direccion: Direccion = {};

  nombreBanco;
  tipoCuenta;

  show = true;
  sinInformacion = "N/A";
  showAgregarCuenta = false;

  filesForDownload = [];
  isLoading: any = false;
  url: any;
  isImage: any;
  isPdf: any;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private contratoService: ContratosService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService,
    private componentService: ComponentesService,
    private logger: NGXLogger,
    private authService: AuthService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.dataParticipe();
    this.formsWizard();
  }

  dataParticipe() {
    this.spinner.show();
    this.dataService.getParticipeById(this.id).subscribe(
      (res) => {
        this.participe = res["result"];
        this.nota = res["result"]["observaciones"];
        if (this.participe.direcciones[0]) {
          this.direccion = this.participe.direcciones[0];
          this.participe.direcciones[0] = this.direccion;
          this.dataProvinciaCiudad(
            this.direccion.idProvincia,
            this.direccion.idPais
          );
        }
        this.getNewReferenciasBancarias();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "info",
          "Ocurrió un error al cargar los datos del partícipe"
        );
      }
    );
  }

  formsWizard() {
    try {
      this.filesForDownload = [];
      /**
       * Horizontal Stepper
       * @type {FormGroup}
       */
      this.accountFormGroup = this.fb.group({
        nombre: [""],
        name: [""],
        email1: [""],
        email2: [""],
        phonePrefix: [this.phonePrefixOptions[3]],
        phone: [""],
        cedula: [""],
        direccion: [""],
        genero: [""],
        estadoCivil: [""],
        nacionalidad: [""],
        grado: [""],
        nivelingreso: [""],
        nivelEstudios: [""],
        fechanacimiento: [""],
        tabla: [""],
        expedicioncedula: [""],
        lugarnacimiento: [""],
        telefono1: [""],
        telefono2: [""],
        calleprincipal: [""],
        referencia: [""],
      });

      this.passwordFormGroup = this.fb.group({
        password: [null, Validators.compose([])],
        passwordConfirm: [null],
      });

      this.confirmFormGroup = this.fb.group({
        terms: [null],
        notes: [],
      });
    } catch (e) {}
  }

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  selectedTabValue(event) {
    this.labelName = event.tab.textLabel;
    if (this.labelName === this.secondTab) {
      if (!this.banderaFirma) this.goCedula();
    } else if (this.labelName === this.thirdTab) {
      {
        if (!this.isVideo) this.goVideo();
      }
    }
  }

  goCedula() {
    // FIRMA
    this.dataService.newGetAdjuntoById(this.id, TiposAdjunto.Firma).subscribe(
      (res: any) => {
        if (res["result"].length > 0) {
          this.firma = res["result"][0];
          this.filesForDownload.push(this.firma);
        } else {
          this.componentService.alerta("info", "El partícipe no tiene firma");
        }
        this.banderaFirma = true;

        this.detectarCambios();
      },
      (error) => {
        this.componentService.alerta("error", "El partícipe no tiene firma");
      }
    );
    // CEDULA POSTERIOR
    this.dataService
      .newGetAdjuntoById(this.id, TiposAdjunto.cedulaPosterior)
      .subscribe(
        (res: any) => {
          if (res["result"].length > 0) {
            const cedulas = res["result"];

            //onbtener cedulas que no tengan la propiedad idPrestamo

            const cedulasFiltradas = cedulas.filter(
              (cedula) => cedula.idPrestamo == null
            );

            this.cedulaPosterior = cedulasFiltradas[0];
            this.filesForDownload.push(this.cedulaPosterior);
          } else {
            this.componentService.alerta(
              "info",
              "El partícipe no  tiene cédula posterior"
            );
          }

          this.banderaCedulaPosterior = true;
          this.detectarCambios();
        },
        (error) => {
          this.componentService.alerta(
            "error",
            "El partícipe no tiene cédula posterior"
          );
        }
      );

    // CEDULA FRONTAL
    this.dataService
      .newGetAdjuntoById(this.id, TiposAdjunto.cedulaFrontal)
      .subscribe(
        (res: any) => {
          if (res["result"].length > 0) {
            const cedulas = res["result"];

            //filtrar cedulas que tengan idPrestamo == null
            const cedulasFiltradas = cedulas.filter(
              (cedula) => cedula.idPrestamo == null
            );

            this.cedulaFrontal = cedulasFiltradas[0];
            this.filesForDownload.push(this.cedulaFrontal);
          } else {
            this.componentService.alerta(
              "info",
              "El participe no tiene cédula frontal"
            );
          }

          this.banderaCedulaFrontal = true;
          this.detectarCambios();
        },

        (error) => {
          this.componentService.alerta(
            "error",
            "El partícipe no tiene cédula frontal"
          );
        }
      );
  }

  public innerHtml: SafeHtml;
  public setinnerHtml(pdfurl: string) {
    this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  goVideo() {
    // VIDEO
    this.dataService.newGetAdjuntoById(this.id, TiposAdjunto.Video).subscribe(
      (res: any) => {
        if (res["result"].length > 0) {
          this.video = res["result"][0].url;
          /* this.logger.log(this.video); */
          this.mostrarTextoVideo = true;
        } else {
          this.componentService.alerta("info", "El partícipe no tiene video");
        }
        this.isVideo = true;

        this.detectarCambios();
      },

      (error) => {
        this.mostrarTextoVideo = true;
        this.componentService.alerta(
          "error",
          "ha ocurrido un error al consultar el video"
        );
      }
    );
  }

  downloadVideo(video) {
    var link = document.createElement("a");

    link.setAttribute("download", "Video.mp4");
    link.style.display = "none";

    document.body.appendChild(link);

    link.setAttribute("href", this.video);
    link.click();

    document.body.removeChild(link);
    this.logger.log(video);
  }

  getNewReferenciasBancarias() {
    this.isLoading = true;
    this.dataService
      .getNewReferenciaBancaria(this.participe.idParticipe)
      .subscribe(
        (res) => {
          this.referenciaBancaria = res.result;
          this.isLoading = false;
          this.detectarCambios();
        },
        (error) => {
          this.isLoading = false;
          this.componentService.alerta(
            "error",
            "Error al cargar las referencias bancarias"
          );
          this.detectarCambios();
        }
      );
  }

  dataProvinciaCiudad(idProvincia, idPais) {
    // PROVINCIAS DEL ECUADOR
    this.dataService.getProvincias(idPais).subscribe((prov) => {
      this.provincias = prov;
    });

    // ciudades
    this.dataService.getCiudades(idProvincia).subscribe((cuidad) => {
      this.ciudades = cuidad;
      this.detectarCambios();
    });
  }

  agregarCuentaBancaria() {
    this.showAgregarCuenta = true;
  }

  showPassword() {
    this.passwordInputType = "text";
    this.cd.markForCheck();
  }

  hidePassword() {
    this.passwordInputType = "password";
    this.cd.markForCheck();
  }

  rechazar() {
    if (this.nota != "") {
      this.componentService
        .alertaButtons("¿Estás seguro que desea rechazar?")
        .then((result) => {
          if (result.isConfirmed) {
            this.spinner.show();
            this.contratoService
              .postRechazarParticipe(
                this.id,
                this.nota,
                this.authService.getFuncionario()
              )
              .subscribe(
                (res) => {
                  if (res["success"] == true) {
                    this.spinner.hide();
                    this.router.navigateByUrl("/contratos/pendientes");
                    this.componentService.alerta(
                      "success",
                      "Rechazado exitosamente!"
                    );
                  } else {
                    this.spinner.hide();
                    this.componentService.alerta("error", "Error al rechazar");
                  }
                },
                (error) => {
                  this.spinner.hide();
                  this.componentService.alerta(
                    "error",
                    "Error al rechazar su solicitud!"
                  );
                }
              );
          } else if (result.isDenied) {
          }
        });
    } else {
      this.componentService.alerta("info", "Debes ingresar un comentario");
    }
  }

  aprobar() {
    if (this.nota != "") {
      this.componentService
        .alertaButtons("¿Estás seguro que deseas aprobar?")
        .then((result) => {
          if (result.isConfirmed) {
            this.spinner.show();
            this.contratoService
              .postAprobarParticipe(
                this.id,
                this.nota,
                this.authService.getFuncionario()
              )
              .subscribe(
                (res) => {
                  if (res["success"] == true) {
                    this.spinner.hide();
                    this.router.navigateByUrl("/contratos/pendientes");
                    this.componentService.alerta(
                      "success",
                      "Aprobado exitosamente!"
                    );
                  } else {
                    this.spinner.hide();
                    this.componentService.alerta(
                      "error",
                      "Error al aprobar su solicitud!"
                    );
                  }
                },
                (error) => {
                  this.spinner.hide();
                  this.componentService.alerta(
                    "error",
                    "Error al aprobar su solicitud!"
                  );
                }
              );
          } else if (result.isDenied) {
          }
        });
    } else {
      this.componentService.alerta(
        "info",
        "Debes agregar un comentario para aprobar"
      );
    }
  }

  downloadImage(file) {
    if (file == null || file == undefined || file == "") {
      this.componentService.alerta("info", "No archivo para visualizar");

      this.url = null;
      return;
    }

    this.url = file.url;

    if (file.mimeType == "application/pdf") {
      this.isPdf = true;
      this.setinnerHtml(file.url);
      this.isImage = false;
    } else {
      this.isPdf = false;
      this.isImage = true;
    }

    this.detectarCambios();

    /* this.setinnerHtml(image); */

    /*     window.open(image); */
  }

  /*   downloadAll() {
    var link = document.createElement("a");

    link.setAttribute("download", "file.png");
    link.style.display = "none";

    document.body.appendChild(link);

    for (var i = 0; i < this.filesForDownload.length; i++) {
      link.setAttribute(
        "href",
        this.filesForDownload[i]["changingThisBreaksApplicationSecurity"]
      );
      link.click();
    }

    document.body.removeChild(link);
  } */

  goTicket(identificacion) {
    this.spinner.show();
    this.contratoService.getTicketByIdentificacion(identificacion).subscribe(
      (res) => {
        this.spinner.hide();
        window.open("/tickets/detalle-ticket/" + res["result"].idTicket);
      },
      (error) => {
        this.spinner.show();
        this.contratoService.postCrearTicket(identificacion).subscribe(
          (response) => {
            this.spinner.hide();
            window.open(
              "/tickets/detalle-ticket/" + response["result"].idTicket
            );
          },
          (error) => {
            this.componentService.errorHandler(error);
          }
        );
      }
    );
  }
}
