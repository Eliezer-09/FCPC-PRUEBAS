import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ComponentesService } from "src/app/services/componentes.service";
import { TicketsService } from "../../../tickets.service";
import icPdf from "@iconify/icons-ic/insert-drive-file";
import { PrimeIcons } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "vex-comentarios",
  templateUrl: "./comentarios.component.html",
  styleUrls: ["./comentarios.component.scss"],
})
export class ComentariosComponent implements OnInit, OnChanges {
  @Input() comentarios?;
  documento: any;
  actividades: any[] = [];
  icPdf = icPdf;
  adjuntos = [];
  posicion: number = 0;
  adjuntosCopy: any = [];

  constructor(
    private ticketService: TicketsService,
    private spinner: NgxSpinnerService,
    private componentes: ComponentesService
  ) {}

  ngOnInit() {
    this.comentarios.forEach((comentario) => {
      this.cargarAdjuntosByIdComentario(comentario, comentario.idComentario);
    });
  }

  ngOnChanges(changes) {
    if (!changes.comentarios.firstChange) {
      this.comentarios = changes.comentarios.currentValue;
      this.ngOnInit();
    }
  }

  cargarAdjuntosByIdComentario(comentario, idComentario) {
    this.actividades = [];
    this.ticketService.getNewComentarioAdjuntos(idComentario).subscribe(
      (adjuntos: any) => {
        this.adjuntos.push(adjuntos.result);
        if (adjuntos.result.length > 0) this.adjuntosCopy.push(adjuntos.result);
        const data = {
          comentario: comentario,
          icon: PrimeIcons.COMMENT,
          color: "#9C27B0",
          adjuntos: adjuntos.result,
        };
        this.actividades.push(data);
      },
      (error: HttpErrorResponse) => {}
    );
  }

  verAdjuntoComentario({ idAdjunto }) {
    const adjuntoEncontrado = this.adjuntosCopy
      .flat()
      .find((adjunto) => adjunto.idAdjunto == idAdjunto);
    if (adjuntoEncontrado) {
      window.open(adjuntoEncontrado.url, "_blank");
    }
  }
}
