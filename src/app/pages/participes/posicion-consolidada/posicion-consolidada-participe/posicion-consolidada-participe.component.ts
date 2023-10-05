import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { scaleInOutAnimation } from "../../../../../@vex/animations/scale-in-out.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import icDelete from "@iconify/icons-ic/twotone-delete";
import { ApexOptions } from "src/@vex/components/chart/chart.component";
import { defaultChartOptions } from "src/@vex/utils/default-chart-options";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { NGXLogger } from "ngx-logger";
import { ParticipesService } from "../../participes.service";

//Iconos
import faCaretUp from "@iconify/icons-fa-solid/caret-up";
import icGroup from "@iconify/icons-ic/group";
import icPerson from "@iconify/icons-ic/person";
import icDescription from "@iconify/icons-ic/description";
import icMoney from "@iconify/icons-ic/monetization-on";
import icRisk from "@iconify/icons-ic/money-off";
import icEqu from "@iconify/icons-ic/equalizer";
import faCaretDown from "@iconify/icons-fa-solid/caret-down";
import icHelp from "@iconify/icons-ic/help-outline";
import icShare from "@iconify/icons-ic/twotone-share";
import icSearch from "@iconify/icons-ic/search";
import icFolder from "@iconify/icons-ic/twotone-folder";
import { LogLevel } from "@microsoft/signalr";
import icAssignment from "@iconify/icons-ic/assignment";

@Component({
  selector: "vex-posicion-consolidada-participe",
  templateUrl: "./posicion-consolidada-participe.component.html",
  styleUrls: ["./posicion-consolidada-participe.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleInOutAnimation, fadeInUp400ms, stagger80ms],
})
export class PosicionConsolidadaParticipeComponent implements OnInit {
  @Input() dataAportes?: any;
  @Input() saldoTotal?: any;
  @Input() dataCreditos?: any[];
  @Input() dataPrestamosGarantizados?: any[];
  @Input() dataResumen?: any[];
  @Input() dataRiesgos?;
  @Input() dataAportesVencidos?: any;
  @Input() dataParticipe?: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //Iconos
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  icHelp = icHelp;
  icShare = icShare;
  icGroup = icGroup;
  icPerson = icPerson;
  icDescription = icDescription;
  icMoney = icMoney;
  icEqu = icEqu;
  icSearch = icSearch;
  icDelete = icDelete;
  icFolder = icFolder;
  icRisk = icRisk;
  icAssignment = icAssignment;

  //Datos de la grafica
  public lineChartLegend = true;
  public lineChartType: ChartType = "line";
  public lineChartData: ChartDataSets[];
  public lineChartOptions: ChartOptions & { annotation: any };

  //Variables
  seccion = "";
  totalCreditos = 0;
  totalCreditosGarantizados = 0;
  totalResumen = 0;
  totalEAD = 0;
  totalVar = 0;
  perdidaEsperada = 0;
  aportes: any[];
  riesgos: any;
  fechas: any[] = [];
  valorAporte: any[] = [];
  tipoAporte: any[] = [];
  prestamosVencidos = [];
  aportesVencidos = [];
  series: ApexAxisChartSeries;
  options: ApexOptions;
  disponible = 0;

  displayedColumns = [
    "tipoPrestamo",
    "fechaSolicitud",
    "montoSolicitado",
    "plazo",
    "tasaNominal",
    "tasaEfectiva",
    "saldoVencido",
    "saldoVencer",
    "saldoTotal",
    "estado",
    "acciones",
  ];
  detallesColumns = [
    "fechaTransaccion",
    "periodo",
    "tipoAporte",
    "total",
    "tipo",
  ];
  //Banderas
  mostrarValoresVencidos = false;
  mostrarAportesVencidos = false;

  constructor(
    private logger: NGXLogger,
    private apiParticipe: ParticipesService
  ) {}

  ngOnInit() {
    this.aportesVencidos = this.dataAportesVencidos;
    this.totalCreditosGarantizados = 0;
    this.riesgos = this.dataRiesgos;

    this.riesgos.pd = (this.riesgos.pd * 100).toFixed(2) + " %";
    this.perdidaEsperada = this.dataRiesgos["pe"];
    this.disponible = this.dataRiesgos["disponible"];
    this.dataCreditos.forEach((res) => {
      if (
        res.estado == "Activo" ||
        res.estado == "Transferido" ||
        (res.IdTipoPrestamo == 2 && res.estado == "Legalizado")
      ) {
        res["EAD"] = res.saldoCapital + res.interesVencido;
      }
    });

    this.dataCreditos = this.dataCreditos.filter(
      (x) => x.estado == "Transferido"
    );

    this.dataPrestamosGarantizados.forEach((res) => {
      this.totalCreditosGarantizados =
        this.totalCreditosGarantizados + res.montoGarantia;
    });

    this.aportes = [];
    this.grafica();
    if (
      this.dataAportes["total"] != null &&
      this.dataAportes["total"] != undefined &&
      this.saldoTotal != null &&
      this.saldoTotal != undefined
    ) {
      this.totalResumen =
        this.dataAportes["total"] - parseFloat(this.saldoTotal);
    } else {
      this.saldoTotal = 0.0;
      this.totalResumen = 0.0;
    }
  }

  getTotalsDetalles() {
    let valor = 0;
    this.dataAportes.detalles.forEach((detalles) => {
      valor += detalles["total"];
    });
    return valor;
  }

  getTipoDetalle(detalleCode: string) {
    let text = "";
    switch (detalleCode) {
      case "S":
        text = "Saldo";
        break;
      case "A":
        text = "Aporte";
        break;

      case "D":
        text = "Descuento";
        break;
    }
    return text;
  }

  grafica() {
    let detalles = this.dataAportes["detalles"];
    let resumen = this.dataAportes["resumen"];

    detalles.forEach((element) => {
      let fecha = element["fechaTransaccion"];
      !this.fechas.includes(fecha) &&
        fecha != "2020-12-31T00:00:00" &&
        this.fechas.push(fecha);
      this.aportes.push(element);
    });

    resumen.forEach((element) => {
      let id = element["idTipoAporte"];
      let name = element["tipoAporte"];
      let data = [];
      let valor = 0;

      this.fechas.forEach((fecha) => {
        detalles
          .filter(
            (x) => /*x["fechaTransaccion"] == fecha &&*/ x["idTipoAporte"] == id
          )
          .forEach((element) => {
            valor += element["valor"];
          });
        data.push(valor);
      });
      this.valorAporte.push({ name, data });
    });
    this.series = this.valorAporte;
    this.options = defaultChartOptions({
      grid: {
        show: true,
        strokeDashArray: 5,
        padding: {
          left: 16,
        },
      },
      chart: {
        type: "line",
        height: 500,
        sparkline: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        width: 4,
      },
      //ARREGLO DE FECHAS
      labels: this.fechas,
      xaxis: {
        type: "datetime",
        labels: {
          show: true,
        },
      },
      yaxis: {
        labels: {
          show: true,
          minWidth: 20,
          maxWidth: 50,
          offsetX: 10,
        },
      },
    });

    this.lineChartOptions = {
      responsive: true,
      annotation: {
        annotations: [
          {
            type: "line",
            mode: "vertical",
            scaleID: "x-axis-0",
            value: "March",
            borderColor: "orange",
            borderWidth: 2,
            label: {
              enabled: true,
              fontColor: "orange",
              content: "LineAnno",
            },
          },
        ],
      },
    };
  }

  cambiarSeccion(event) {
    this.seccion = event;
    if (event == "vencido") {
      this.apiParticipe
        .getPrestamosVencidosByParticcipe(this.dataParticipe["idParticipe"])
        .subscribe(
          (res: any) => {
            this.mostrarValoresVencidos = true;
            this.logger.log("Préstamos Vencidos", res["result"]);
            this.prestamosVencidos = res["result"];
          },
          (err) => {
            this.logger.log("Error Valores Vencidos", err);
            this.mostrarValoresVencidos = false;
          }
        );
    }
  }
}
