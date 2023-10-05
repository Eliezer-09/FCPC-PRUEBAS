import { SelectionModel } from "@angular/cdk/collections";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { map } from "rxjs/operators";
import { OperationResultTickets, Participe } from "src/app/model/models";
import { TicketsInternos } from "../../ticket.interface";
import { TicketsService } from "../../tickets.service";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icFolder from "@iconify/icons-ic/folder";
import icSearch from "@iconify/icons-ic/twotone-search";
import icEye from "@iconify/icons-ic/visibility";
import icArrowDown from "@iconify/icons-ic/arrow-drop-down";
import icCalendarToday from "@iconify/icons-ic/sharp-calendar-today";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { LazyLoadEvent, PrimeNGConfig, TreeNode } from "primeng/api";
import { DatePipe, formatDate } from "@angular/common";
import Swal from "sweetalert2";
import { ComponentesService } from "src/app/services/componentes.service";
import { LocalService } from "src/app/services/local.service";
@Component({
  selector: "vex-tickets-completados",
  templateUrl: "./tickets-completados.component.html",
  styleUrls: ["./tickets-completados.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [fadeInUp400ms, stagger80ms],
})
export class TicketsCompletadosComponent implements OnInit {
  layoutCtrl = new FormControl("boxed");
  searchCtrl = new FormControl();
  termino = new FormControl();
  displayedColumns = [
    "nombre",
    "asunto",
    "tipoTarea",
    "prioridad",
    "estado",
    "fecha",
    "acciones",
  ];
  dataFondoSource = new MatTableDataSource<OperationResultTickets>();
  ticketsInternos: TicketsInternos[];
  isLoading = true;
  tickets: OperationResultTickets = {};
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterValue: string = null;
  estados = [];
  //Iconos
  icDelete = icDelete;
  icFolder = icFolder;
  icSearch = icSearch;
  icEye = icEye;
  icArrowDown = icArrowDown;
  icCalendarToday = icCalendarToday;
  pageEvent: PageEvent;
  panelOpenState = false;
  step = 0;
  busquedaAvanzada: boolean = false;
  filtroTermino: string = "";
  files: TreeNode[];
  cols: any[];
  loading: boolean;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  prioridades = ["Urgente", "Alta", "Media", "Baja"];

  constructor(
    private _ticketsService: TicketsService,
    private changeDetector: ChangeDetectorRef,
    public datepipe: DatePipe,
    private primengConfig: PrimeNGConfig,
    private localServiceS: LocalService,
    private componentService: ComponentesService
  ) {}

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.files = [];
    this.cols = [
      { field: "nombre", header: "Nombre" },
      { field: "asunto", header: "Asunto" },
      { field: "tipoTarea", header: "Tipo tarea" },
      { field: "prioridad", header: "Prioridad" },
      { field: "estado", header: "Estado" },
      { field: "fecha", header: "Fecha" },
      { field: "acciones", header: "Acciones" },
    ];

    this.loading = true;
    this.cargarTickets(1, 10);
    this.cargarEstados();
  }

  cargarTickets(page, size) {
    //TODO: CARGAR TICKETS INTERNOS
    this.ticketsInternos = [];
    this.termino.reset();
    this.range.reset();

    this._ticketsService
      .getTicketsInterno(page, size, "Completado")
      .pipe(
        map((tickets: any) => {
          this.isLoading = false;
          this.files = [];
          this.currentRow =
            tickets.pageNumber * tickets.pageSize - tickets.pageSize + 1;
          this.currentPage = tickets.pageNumber;
          this.tickets = tickets;
          this.tickets.result.forEach((res) => {
            const fecha = this.datepipe.transform(res.fecha);
            var status = res.estado;
            if (status == "Atendido") {
              status = "Completado";
            }
            let node = {
              data: {
                nombre: res.nombre,
                asunto: res.asunto,
                descripcion: res.descripcion,
                tipoTarea: res.tipoTarea,
                prioridad: res.prioridad,
                estado: status,
                fecha: fecha,
                acciones: res.idTicket,
              },
              leaf: true,
              children: [],
            };
            res.tickets.forEach((ticket) => {
              const fecha = this.datepipe.transform(ticket.fecha);
              var status = ticket.estado;
              if (status == "Atendido") {
                status = "Completado";
              }
              const children = {
                data: {
                  nombre: ticket.nombre,
                  asunto: ticket.asunto,
                  descripcion: res.descripcion,
                  tipoTarea: ticket.tipoTarea,
                  prioridad: ticket.prioridad,
                  estado: status,
                  fecha: fecha,
                  acciones: ticket.idTicket,
                },
              };
              node.children.push(children);
            });
            this.files.push(node);
          });
          this.primengConfig.ripple = true;
          this.changeDetector.detectChanges();
          // this.dataFondoSource.data = tickets.result;
        })
      )
      .subscribe(() => {
        this.loading = false;
      });
  }

  cargarEstados() {
    this._ticketsService.getEstados().subscribe((res) => {
      this.estados = res;
    });
  }

  currentRow = 0;
  currentPage = 1;

  loadData(event?: LazyLoadEvent) {
    //call the service to load the next page data.
    // event.filters = {};
    if (this.termino.value == null) {
      this.loading = true;
      const page = (event.first / event.rows + 1).toFixed(0);
      this.cargarTickets(page, event.rows);
    }
  }


  cambiarAvanzado(event) {
    this.busquedaAvanzada = event;
    this.changeDetector.detectChanges();
  }


  filtro(tipo, desde?, hasta?) {
    if (this.range.value.start && this.range.value.end) {
      const fechaDesde = formatDate(
        this.range.value.start,
        "yyyy-MM-dd",
        "en-US"
      );
      const fechaHasta = formatDate(
        this.range.value.end,
        "yyyy-MM-dd",
        "en-US"
      );

      this.buscarTermino("a", tipo, fechaDesde, fechaHasta);
    } else {
      this.buscarTermino(this.termino.value, tipo);
    }
  }


  eliminarTicket(ticket) {
    Swal.fire({
      icon: "warning",
      title: "Desea anular este ticket?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: `Si, anular`,
    }).then((res) => {
      if (res.isConfirmed) {
        const id = this.localServiceS.getItem("id");
        const data = {
          estado: "Anulado",
          idEntidad: id,
        };
        this._ticketsService.putEstadoTicket(ticket.acciones, data).subscribe(
          (res) => {
            this.componentService.alerta(
              "success",
              "Ticket anulado correctamente"
            );
            this.cargarTickets(this.currentPage, 10);
          },
          (error) => {}
        );
      }
    });
  }


  buscarTermino(term: string, tipo?: string, desde?, hasta?) {
    if (term.length > 0) {
      this.loading = true;
      this._ticketsService
        .getTicketsInternosByTermino(term, tipo, desde, hasta)
        .pipe(
          map((userData: any) => {
            // this.dataFondoSource.data = userData["result"];
            this.tickets = userData;
            this.files = [];
            userData["result"].forEach((res) => {
              const fecha = this.datepipe.transform(res.fecha);
              var status = res.estado;
              if (status == "Atendido") {
                status = "Completado";
              }
              let node = {
                data: {
                  nombre: res.nombre,
                  asunto: res.asunto,
                  descripcion: res.descripcion,
                  tipoTarea: res.tipoTarea,
                  prioridad: res.prioridad,
                  estado: status,
                  fecha: fecha,
                  acciones: res.idTicket,
                },
                children: [],
              };
              res.tickets.forEach((ticket) => {
                const fecha = this.datepipe.transform(ticket.fecha);
                var status = ticket.estado;
                if (status == "Atendido") {
                  status = "Completado";
                }
                const children = {
                  data: {
                    nombre: ticket.nombre,
                    asunto: ticket.asunto,
                    descripcion: res.descripcion,
                    tipoTarea: ticket.tipoTarea,
                    prioridad: ticket.prioridad,
                    estado: status,
                    fecha: fecha,
                    acciones: ticket.idTicket,
                  },
                };
                node.children.push(children);
              });
              this.files.push(node);
            });
          })
        )
        .subscribe((res) => {
          this.loading = false;
          this.termino.reset();
        });
    } else {
      this.ticketsInternos = [];
      this._ticketsService
        .getTicketsInterno(1, 10)
        .pipe(
          map((rechazados: any) => {
            this.isLoading = false;
            this.tickets = rechazados;
            this.dataFondoSource.data = this.tickets.result;
          })
        )
        .subscribe();
    }
    this.changeDetector.detectChanges();
  }

}
