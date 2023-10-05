import { Component, Input, OnInit } from "@angular/core";
import { iconify } from "src/static-data/icons";

@Component({
  selector: "app-entidad-header",
  templateUrl: "./entidad-header.component.html",
  styleUrls: ["./entidad-header.component.scss"],
})
export class EntidadHeaderComponent implements OnInit {
  /*   icono = icroundDiamond; */
  @Input() tituloHeader: string = "";
  @Input() icono: any = iconify.icroundDiamond;
  @Input() controlScreen: string = "";

  titulo: string = "";
  rutaHeader: string = "";
  icroundBookmark = iconify.icroundBookmark;

  icroundChevronRight = iconify.icroundChevronRight;

  constructor() {}

  ngOnInit(): void {
    /*  console.log("controlScreen", this.controlScreen);
    if (this.tituloHeader == "departamentos") {
      this.titulo = "Unidades Administrativas";
    } */
  }
}
