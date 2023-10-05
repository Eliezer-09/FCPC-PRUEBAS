import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CreditosService } from "../../creditos.service";
import icPrint from "@iconify/icons-fa-solid/print";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { Pagos } from "src/app/model/models";

@Component({
  selector: "vex-pagos",
  templateUrl: "./pagos.component.html",
  styleUrls: ["./pagos.component.scss"],
  animations: [stagger80ms],
})
export class PagosComponent implements OnInit {
  idPrestamo: any = this.route.snapshot.paramMap.get("idprestamo");
  @Input() pagos?: Pagos;

  displayedColumns = [
    "#",
    "fecha",
    "capitalPagado",
    "interesPagado",
    "morapagada",
    "desgravamen",
    "saldoOtros",
    "valor",
  ];
  icPrint = icPrint;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService
  ) {}

  ngOnInit(): void {
    console.log("pagos", this.pagos);
  }

  getTotalColumn(valor: any) {
    return this.pagos?.detalle?.reduce((acc, item) => acc + item[valor], 0);
  }

  getPagosCredito() {
    this.spinner.show();
    this.creditoService.getPagosIndividualesById(this.idPrestamo).subscribe(
      (res) => {
        this.spinner.hide();
        var link = document.createElement("a");
        link.setAttribute("download", "Pagos Individuales-" + this.idPrestamo);
        link.style.display = "none";
        document.body.appendChild(link);
        window.open(res["changingThisBreaksApplicationSecurity"]);
        document.body.removeChild(link);
      },
      (error) => {
        this.spinner.hide();
        console.log("ERROR AL DESCARGAR EL RESUMEN");
      }
    );
  }
}
