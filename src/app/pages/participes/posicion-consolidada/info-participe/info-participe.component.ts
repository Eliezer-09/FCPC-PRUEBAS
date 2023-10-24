//Iconos
import icDescription from "@iconify/icons-ic/twotone-description";
import icSearch from "@iconify/icons-ic/twotone-search";
import icEmail from "@iconify/icons-ic/email";
import icAssignment from "@iconify/icons-ic/assignment-ind";
import icPhone from "@iconify/icons-ic/phone";
import icLocationCity from "@iconify/icons-ic/location-city";
import icPerson from "@iconify/icons-ic/person";
import icCreditCard from "@iconify/icons-ic/credit-card";
import icAdd from "@iconify/icons-ic/twotone-add";
import icFavorite from "@iconify/icons-ic/twotone-favorite";
import icComment from "@iconify/icons-ic/twotone-comment";
import icAttachFile from "@iconify/icons-ic/twotone-attach-file";
import icKeyboardArrowRight from "@iconify/icons-ic/twotone-keyboard-arrow-right";
import icCheck from "@iconify/icons-ic/sharp-check";

//Animaciones
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";

import { ChangeDetectorRef, Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, RouterLink, Router } from "@angular/router";
import { DataService } from "../../../../services/data.service";
import { Participe } from "../../../../model/models";
import { NgxSpinnerService } from "ngx-spinner";
import { ComponentesService } from "../../../../services/componentes.service";
import { NGXLogger } from "ngx-logger";
import { MatDialog } from "@angular/material/dialog";
import { ModalComentarComponent } from "./modal-comentar/modal-comentar.component";
import { ParticipesService } from "../../participes.service";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import Swal from "sweetalert2";
import { ComprobanteService } from "src/app/pages/comprobantes/comprobantes.service";
import { LocalService } from "src/app/services/local.service";
import { EstadoParticipe } from "src/@vex/interfaces/enums";

@Component({
  selector: "vex-info-posicion-participe",
  templateUrl: "./info-participe.component.html",
  styleUrls: ["./info-participe.component.scss"],
  animations: [fadeInUp400ms, stagger80ms, scaleIn400ms, fadeInRight400ms],
})
export class InfoParticipeComponent implements OnInit {
  //Iconos
  icSearch = icSearch;
  icDescription = icDescription;
  icEmail = icEmail;
  icPhone = icPhone;
  icAssignment = icAssignment;
  icLocationCity = icLocationCity;
  icPerson = icPerson;
  icCreditCard = icCreditCard;
  icAdd = icAdd;
  icFavorite = icFavorite;
  icComment = icComment;
  icAttachFile = icAttachFile;
  icKeyboardArrowRight = icKeyboardArrowRight;
  icCheck = icCheck;

  //Variables
  actividad2: any = [];
  actividad: any = [];
  historialDeCambios = [];
  idTransacciones = [];

  @Input() dataParticipe?: Participe;
  @Input() dataPrestamo?: any;
  @Input() dataAportes?: any;
  @Input() dataPrestamosGarantizados?: any;
  @Input() dataPrestamosGarantes?: any;
  @Input() dataParticipeGarantias?: any;
  @Input() dataComprobantes?: any;

  documento;
  observaciones;
  ocultarGarantizadosLoad = false;
  ocultarGarantesLoad = false;

  constructor(
    private router: Router,
    private data: DataService,
    private dataComp: ComponentesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private componentes: ComponentesService,
    private logger: NGXLogger,
    public dialog: MatDialog,
    private _comprobanteService: ComprobanteService,
    private dataParticipes: ParticipesService,
    private localServiceS: LocalService
  ) {}

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  ngOnInit() {
    // if (this.dataPrestamosGarantizados.length == 0) {
    //   this.ocultarGarantizadosLoad = true
    // }
    // if (this.dataPrestamosGarantes.length == 0) {
    //   this.ocultarGarantesLoad = true
    // }
    this.permiteRealizaSolicitudPrestamo()
    if (this.dataParticipe) {
      this.cargarComentarios();
      this.cargarActividad();
    }
    this.detectarCambios();

  }

  colorCalificacion() {
    var color = "grey";
    if (this.dataParticipe && this.dataParticipe?.calificacionCredito) {
      var categoria = this.dataParticipe?.calificacionCredito.substring(0, 1);
      if (categoria == "A") {
        color = "green";
      } else if (categoria == "B") {
        color = "blue";
      } else if (categoria == "C") {
        color = "orange";
      } else if (categoria == "D") {
        color = "pink";
      } else if (categoria == "E") {
        color = "red";
      }
    }
    return color;
  }

  cargarComentarios() {
    this.data.getParticipeComentario(this.dataParticipe.idParticipe).subscribe(
      (res) => {
        this.actividad = res["result"];
        this.actividad.reverse();
        this.detectarCambios();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  cargarActividad() {
    this.dataParticipes
      .getParticipeActvidad(this.dataParticipe.idParticipe)
      .subscribe(
        (res) => {
          this.actividad2 = res["result"];
          this.detectarCambios();
        },
        (error) => {
          this.logger.log(error);
        }
      );
  }

  enviarComentario() {
    // this.spinner.show()
    // const data = {
    //   "fecha": this.data.date,
    //   "comentario": this.observaciones
    // }
    // if (this.observaciones != "") {
    //   this.data.postComentarioParticipe(this.dataParticipe.idParticipe, data).subscribe(res=>{
    //     this.spinner.hide()
    //     this.dataComp.alerta("success", "Se ha agregado exitosamente el comentario").then(res=>{
    //       this.cargarComentarios()
    //       this.detectarCambios()
    //     })
    //   }, error=>{
    //     this.spinner.hide()
    //     this.dataComp.alerta("error", "Hubo un error al agregar comentario")
    //   })
    // } else {
    //   this.spinner.hide()
    //   this.dataComp.alerta("info", "Debes agregar un comentario")
    // }
  }

  abrirSolicitudCredito() {
    // Converts the route into a string that can be used
    // with the window.open() function
    if(this.noPermitido){   this.componentes.alerta(
      "error", "No es posible realizar un prestamo, el partícipe no está adherido"
    );
    return ;
    }
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/creditos/quirografario/${this.dataParticipe.identificacion}`,
      ])
    );
    window.open(url, "_blank");
  }

  abrirActualizarDatos() {
    // Converts the route into a string that can be used
    // with the window.open() function
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/participes/actualizar/${this.dataParticipe.identificacion}`,
      ])
    );
    window.open(url, "_blank");
  }

  detallePrestamo(idPrestamo, estado, idPersona) {
    // Converts the route into a string that can be used
    // with the window.open() function
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/creditos/detalle/${
          idPersona || this.dataParticipe.idParticipe
        }/${idPrestamo}/${estado}`,
      ])
    );
    window.open(url, "_blank");
  }

  irParticipe(idParticipe) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/participes/consolidada/${idParticipe}`])
    );
    window.open(url, "_blank");
  }

  detalleParticipe(identificacion) {
    // Converts the route into a string that can be used
    // with the window.open() function
    this.localServiceS.setItem("identificacion", identificacion);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/participes/consolidada`])
    );
    window.open(url, "_blank");
  }

  descargarPDF() {
    this.spinner.show();
    this.data.getCuentaIndividual(this.dataParticipe.idParticipe).subscribe(
      (result) => {
        this.documento = URL.createObjectURL(result);
        this.spinner.hide();
        window.open(this.documento, "_blank");
      },
      (error) => {
        this.componentes.alerta(
          "error",
          "Ocurrió un error al descargar la cuenta individual"
        );
        this.spinner.hide();
      }
    );
  }

  historialCambios() {
    this.dataParticipes
      .getHistorialCambios(this.dataParticipe.idParticipe)
      .subscribe((res) => {
        this.historialDeCambios = res["result"];
        this.comentar("historial", this.historialCambios);
      });
  }

  comentar(accion, item?) {
    if (accion == "nuevo") {
      //Crear nueva actividad
      // this.spinner.show();
      this.dataParticipes.getTiposTareas().subscribe(
        async (res) => {
          const tareas = res["result"];
          this.spinner.hide();
          const dialogRef = this.dialog.open(ModalComentarComponent, {
            width: "600px",
            data: {
              data: "nuevo",
              tareas: tareas,
              dataParticipe: this.dataParticipe,
            },
          });

          dialogRef.afterClosed().subscribe((result) => {
            this.spinner.hide();
          });
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
        }
      );
    } else if (accion == "responder") {
      //Comentar una actividad
      if (item["origen"] == "CONTRATO") {
        this.spinner.show();
        this.dataParticipes
          .getComentariosByActividad(item["idEntidad"], item["origen"])
          .subscribe((res: any) => {
            this.spinner.hide();
            var comentarios = res["result"];
            const dialogRef = this.dialog.open(ModalComentarComponent, {
              width: "600px",
              data: {
                data: "responder",
                item: comentarios,
                itemTransaccion: item,
              },
            });
            dialogRef.afterClosed().subscribe((result) => {});
          });
      } else {
        this.spinner.show();
        this.dataParticipes
          .getComentariosByActividad(item["idTransaccion"], item["origen"])
          .subscribe((res: any) => {
            this.spinner.hide();
            var comentarios = res["result"];
            const dialogRef = this.dialog.open(ModalComentarComponent, {
              width: "600px",
              data: {
                data: "responder",
                item: comentarios,
                itemTransaccion: item,
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.spinner.hide();
            });
          });
      }
    } else if (accion == "historial") {
      //Historial de actividades
      const dialogRef = this.dialog.open(ModalComentarComponent, {
        width: "600px",
        data: {
          data: "historial",
          item: this.historialDeCambios,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.spinner.hide();
      });
    }
  }

  enviarComprobante(correo, id) {
    this._comprobanteService.enviarComprobante(correo, id);
  }

  descargarArchivo(url) {
    window.location.href = url;
  }

  noPermitido:boolean=false;
  permiteRealizaSolicitudPrestamo(){
    if(this.dataParticipe.estado!=EstadoParticipe.Aprobado){
      this.noPermitido=true;
      return false;
    }
    this.noPermitido=false;
    return true;
  }

}
