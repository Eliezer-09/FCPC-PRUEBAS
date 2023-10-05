import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { iconify } from "src/static-data/icons";

@Component({
  selector: "vex-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  animations: [stagger80ms, fadeInUp400ms, fadeInRight400ms],
})
export class HeaderComponent implements OnChanges {
  /*   icono = icroundDiamond; */
  @Input() tituloHeader: string = "";
  @Input() icono: any = iconify.icroundDiamond;
  @Input() controlScreen: string = "";
  @Input() titulo = "";
  @Input() rutaHeader = "";

  icroundBookmark = iconify.icroundBookmark;

  icroundChevronRight = iconify.icroundChevronRight;

  constructor() {}

  ngOnChanges(): void {
    /*  {
      if (this.tituloHeader == "REDEP") {
        this.titulo = "REDEP";
        this.rutaHeader = "/redep";
      } else if (this.tituloHeader == "Honorarios") {
        this.titulo = "honorarios";
        this.rutaHeader = "/honorarios";
      } else if (this.tituloHeader == "Pasantes") {
        this.titulo = "pasantes";
        this.rutaHeader = "/pasantes";
      }
    } */
  }
}
