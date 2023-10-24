import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { DataService } from "../../../services/data.service";
import { forkJoin, of } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { catchError } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import "sweetalert2/src/sweetalert2.scss";
import { ComponentesService } from "../../../services/componentes.service";
import { Identificacion } from "../../../model/models";
import { NGXLogger } from "ngx-logger";
import { CreditosService } from "../../creditos/creditos.service";
import { ActivatedRoute } from "@angular/router";
import { ParticipesService } from "../participes.service";

//Iconos
import icVerticalSplit from "@iconify/icons-ic/twotone-vertical-split";
import icVisiblity from "@iconify/icons-ic/twotone-visibility";
import icVisibilityOff from "@iconify/icons-ic/twotone-visibility-off";
import icDoneAll from "@iconify/icons-ic/twotone-done-all";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icDescription from "@iconify/icons-ic/twotone-description";
import icSearch from "@iconify/icons-ic/twotone-search";

//Animaciones
import { stagger80ms } from "../../../../@vex/animations/stagger.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../@vex/animations/fade-in-right.animation";
import { LocalService } from "src/app/services/local.service";
import { TiposAdjunto } from "src/@vex/interfaces/enums";

export interface Link {
  label: string;
  route: string | string[];
  routerLinkActiveOptions?: { exact: boolean };
  disabled?: boolean;
}

@UntilDestroy()
@Component({
  selector: "vex-posicion-consolidada",
  templateUrl: "./posicion-consolidada.component.html",
  styleUrls: ["./posicion-consolidada.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger80ms, scaleIn400ms, fadeInRight400ms],
})
export class PosicionConsolidadaComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  links: Link[] = [
    {
      label: "ACERCA",
      route: "./info",
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: "CRÉDITOS",
      route: "./creditos",
    },
    {
      label: "POSICIÓN CONSOLIDADA",
      route: "./posicion-consolidada",
    },
  ];

  searchCtrl = new FormControl();
  // customers2: any[];
  // dataFondoSource: MatTableDataSource<any> | null;

  dataFondoSourceGaran: MatTableDataSource<any> | null;

  //Iconos
  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icSearch = icSearch;
  existeParticipe = false;

  //Variables
  documento;
  buscar = "";
  participe: Identificacion = {};
  aportes: any = {};
  aportesPendientes;
  riesgos: any = {};
  prestamos: any = [];
  saldototal = "";
  total: number;
  prestamosGarantizados = [];
  prestamosGarantes = [];
  participeGarantias = [];
  segmento;
  fotoPerfil;
  dataComprobantes = [];

  // BANDERAS
  idParticipe: any = this.route.snapshot.paramMap.get("idParticipe");
  activeLink = this.links[0];
  identificacion: any;
  datosCargados: boolean;

  constructor(
    private data: DataService,
    private spinner: NgxSpinnerService,
    private dataComponent: ComponentesService,
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private creditoService: CreditosService,
    private localServiceS: LocalService,
    private dataParticpe: ParticipesService
  ) {}

  ngOnDestroy(): void {
    this.localServiceS.removeItem("identificacion");
  }

  ngOnInit() {
    this.dataFondoSourceGaran = new MatTableDataSource();
    this.identificacion = this.localServiceS.getItem("identificacion");
    if (this.identificacion != null) {
      this.buscar = this.identificacion;
      this.buscarParticipe();
    }
    if (this.idParticipe != null) {
      this.buscar = this.idParticipe;
      this.logger.log(this.buscar);
      this.buscarParticipe();
    }
    this.prestamos = [];
    this.searchCtrl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => this.onFilterChange(value));
  }

  cambiarSegmento(segmento) {
    if (this.existeParticipe) {
      this.segmento = segmento;
      const index = this.links.findIndex((data) => data.label == segmento);
      this.activeLink = this.links[index];
    } else {
      this.dataComponent.alerta(
        "info",
        "Ingrese una cédula o código uniformado"
      );
    }
  }

  onFilterChange(value: string) {
    if (!this.aportes) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    if (
      this.buscar.length == 10 ||
      this.buscar.length == 4 ||
      this.buscar.length == 5
    ) {
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.existeParticipe = false;
    this.aportes = [];
    this.fotoPerfil = "";
    this.prestamos = [];
    this.participe = {};
    this.prestamosGarantizados = [];
    this.prestamosGarantes = [];
    this.dataFondoSourceGaran.data = [];
    this.saldototal = "";
    // this.dataFondoSource.data = []
  }

  buscarParticipe() {
    this.limpiar();
    this.spinner.show();
    if (
      this.buscar.length == 10 ||
      this.buscar.length == 4 ||
      this.buscar.length == 5
    ) {
      //Datos del Parcitipe
      this.data.getParticipeByIdentificacion(this.buscar).subscribe(
        (res) => {
          this.logger.log("Datos del Partícipe", res);
          this.participe = res["result"];

          this.segmento = "ACERCA";
          this.existeParticipe = true;
          const id = this.participe.idParticipe;
          this.cargarDatos(id);
        },
        async (error) => {
          this.logger.log("Datos del Partícipe", error);
          this.spinner.hide();

          this.dataComponent.alerta("error", error["error"]["message"]);
        }
      );
    } else {
      this.spinner.hide();
    }
  }
  cargarDatos(id: number) {
    forkJoin([
      this.dataParticpe
        .getComprobantesByParticipe(this.participe.idParticipe)
        .pipe(
          catchError((error) => {
            this.logger.log("Comprobantes", error);
            this.dataComponent.alerta(
              "error",
              "Ocurrió un error al traer los comprobantes"
            );
            return of([]);
          })
        ),
      this.data
        .newGetAdjuntoById(this.participe.idParticipe, TiposAdjunto.Foto)
        .pipe(
          catchError((error) => {
            this.logger.log("Foto del perfil", error);

            return of([]);
          })
        ),
      this.data.getAportesbyId(id).pipe(
        catchError((error) => {
          this.logger.log("Aportes", error);
          this.dataComponent.alerta(
            "error",
            "Ocurrió un error al traer los aportes"
          );
          return of([]);
        })
      ),
      this.dataParticpe.getParticipeAportesPendientes(id).pipe(
        catchError((error) => {
          this.logger.log("Aportes Pendientes", error);
          this.dataComponent.alerta(
            "error",
            "Ocurrió un error al traer los aportes pendientes"
          );
          return of([]);
        })
      ),
      this.data.getRiesgosParticipebyId(id).pipe(
        catchError((error) => {
          this.logger.log("Riesgos", error);
          this.dataComponent.alerta(
            "error",
            "Ocurrió un error al traer los riesgos"
          );

          return of([]);
        })
      ),

      this.creditoService.getPrestamosbyId(id).pipe(
        catchError((error) => {
          this.logger.log("Prestamos", error);
          this.dataComponent.alerta(
            "error",
            "Ocurrió un error al traer los préstamos"
          );
          return of([]);
        })
      ),

      this.creditoService.getPrestamosGarantizadosByIdParticipe(id).pipe(
        catchError((error) => {
          this.logger.log("Prestamos Garantizados", error);
          this.dataComponent.alerta(
            "error",
            "Ocurrió un error al traer los préstamos garantizados"
          );
          return of([]);
        })
      ),
      this.creditoService.getPrestamosGarantesByIdParticipe(id).pipe(
        catchError((error) => {
          this.logger.log("Préstamos Garantes", error);
          this.dataComponent.alerta(
            "error",
            "Ocurrió un error al traer los préstamos garantes"
          );
          return of([]);
        })
      ),
      this.dataParticpe.getParticipeGarantias(id).pipe(
        catchError((error) => {
          this.logger.log("Prestamos Garantias", error);
          this.dataComponent.alerta(
            "error",
            "Ocurrió un error al traer los préstamos garantías"
          );
          return of([]);
        })
      ),
    ]).subscribe({
      next: (res) => {
        this.logger.log("Datos del Partícipe", res);
        this.dataComprobantes = res[0]?.result || this.dataComprobantes;
        if (res[1]["result"] && res[1]["result"].length > 0) {
          this.fotoPerfil = res[1]["result"][0]["url"];
        }

        this.aportes = res[2]?.result || this.aportes;
        this.aportesPendientes = res[3]?.result || this.aportesPendientes;
        this.riesgos = res[4]?.result || this.riesgos;
        if (this.riesgos["pd"] > 0) {
          this.riesgos["pd"] = this.riesgos["pd"] * 100;
        } else {
          this.riesgos["pd"] = 0;
        }
        this.saldototal = res[5]?.result?.saldoTotal || "0";
        this.total = res[5]["result"]["saldoTotal"];
        this.prestamos = res[5]?.result?.prestamos;
        this.prestamosGarantizados = res[6]?.result?.garantizados;
        this.prestamosGarantes = res[7]?.result?.garantes;
        this.participeGarantias = res[8]?.result?.garantias;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.spinner.hide();
        this.datosCargados = true;
      },
    });
  }
}
