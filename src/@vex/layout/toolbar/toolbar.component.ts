import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Inject,
} from "@angular/core";
import { LayoutService } from "../../services/layout.service";
import icBookmarks from "@iconify/icons-ic/twotone-bookmarks";
import emojioneUS from "@iconify/icons-emojione/flag-for-flag-united-states";
import emojioneDE from "@iconify/icons-emojione/flag-for-flag-germany";
import icMenu from "@iconify/icons-ic/twotone-menu";
import icVpnKey from "@iconify/icons-ic/vpn-key";
import icPerson from "@iconify/icons-ic/person";
import icDelete from "@iconify/icons-ic/twotone-delete";
import { ConfigService } from "../../services/config.service";
import { map } from "rxjs/operators";
import icNotificationsActive from "@iconify/icons-ic/notifications";
import icNotification from "@iconify/icons-ic/round-notification-important";
import icNotificacionInProgress from "@iconify/icons-ic/notifications-active";
import icPersonAdd from "@iconify/icons-ic/twotone-person-add";
import icAssignmentTurnedIn from "@iconify/icons-ic/twotone-assignment-turned-in";
import icBallot from "@iconify/icons-ic/twotone-ballot";
import icDescription from "@iconify/icons-ic/twotone-description";
import icAssignment from "@iconify/icons-ic/twotone-assignment";
import icReceipt from "@iconify/icons-ic/twotone-receipt";
import icDoneAll from "@iconify/icons-ic/twotone-done-all";
import iclogout from "@iconify/icons-ic/twotone-log-out";
import icTickets from "@iconify/icons-ic/local-play";
import icSms from "@iconify/icons-ic/sms";

import { NavigationService } from "../../services/navigation.service";
import icArrowDropDown from "@iconify/icons-ic/twotone-arrow-drop-down";
import { PopoverService } from "../../components/popover/popover.service";
import { MegaMenuComponent } from "../../components/mega-menu/mega-menu.component";
import icSearch from "@iconify/icons-ic/twotone-search";
import { DataService } from "src/app/services/data.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { NGXLogger } from "ngx-logger";
import { AuthService } from "src/app/pages/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material/dialog";
import { ToolbarCrearTicketComponent } from "../toolbar/toolbar-crear-ticket/toolbar-crear-ticket.component";
import { TicketsService } from "src/app/pages/tickets/tickets.service";
import { ToolbarInfoTicketComponent } from "./toolbar-info-ticket/toolbar-info-ticket.component";
import { Router } from "@angular/router";

//Animaciones
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CrearTicketComponent } from "src/app/pages/tickets/crear-ticket/crear-ticket.component";
import { DOCUMENT } from "@angular/common";
import { Style, StyleService } from "../../services/style.service";
import { LocalService } from "src/app/services/local.service";

@Component({
  selector: "vex-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger80ms, scaleIn400ms, fadeInRight400ms],
})
export class ToolbarComponent implements OnInit, AfterViewChecked {
  @Input() mobileQuery: boolean;

  @Input()
  @HostBinding("class.shadow-b")
  hasShadow: boolean;

  navigationItems = this.navigationService.items;

  isHorizontalLayout$ = this.configService.config$.pipe(
    map((config) => config.layout === "horizontal")
  );
  isVerticalLayout$ = this.configService.config$.pipe(
    map((config) => config.layout === "vertical")
  );
  isNavbarInToolbar$ = this.configService.config$.pipe(
    map((config) => config.navbar.position === "in-toolbar")
  );
  isNavbarBelowToolbar$ = this.configService.config$.pipe(
    map((config) => config.navbar.position === "below-toolbar")
  );

  icSearch = icSearch;
  icBookmarks = icBookmarks;
  emojioneUS = emojioneUS;
  emojioneDE = emojioneDE;
  icMenu = icMenu;
  iclogout = iclogout;
  icPersonAdd = icPersonAdd;
  icAssignmentTurnedIn = icAssignmentTurnedIn;
  icBallot = icBallot;
  icDescription = icDescription;
  icAssignment = icAssignment;
  icReceipt = icReceipt;
  icDoneAll = icDoneAll;
  icArrowDropDown = icArrowDropDown;
  icVpnKey = icVpnKey;
  icTickets = icTickets;
  icPerson = icPerson;
  icNotificationsActive = icNotificationsActive;
  icNotification = icNotification;
  icNotificationInProgress = icNotificacionInProgress;
  icDelete = icDelete;
  icSms = icSms;

  funcionario: string;
  fotoPerfil: any;
  countNotificaciones = 0;
  notificaciones;
  idEntidad;
  encargados = [];
  tickets = [];
  mostrarAsignacion = false;
  isdark = false;
  constructor(
    private layoutService: LayoutService,
    private configService: ConfigService,
    private navigationService: NavigationService,
    private popoverService: PopoverService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private componentService: ComponentesService,
    private logger: NGXLogger,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private router: Router,
    private ticketService: TicketsService,
    private dataServices: DataService,
    private matIconRegistry: MatIconRegistry,
    private locaServiceS: LocalService,
    private domSanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
    private styleService: StyleService
  ) {
    this.matIconRegistry.addSvgIcon(
      "ticket",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/img/ticket.svg")
    );
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.funcionario = this.authService.getFuncionario();
    this.foto();
    this.getIdFuncionario();
    this.cargarTickets();
    this.dataServices.getEncargados().subscribe((res: any) => {
      this.encargados = res["result"];
      const funcionario = this.encargados.filter(
        (encargado) => encargado.idEntidad == this.idEntidad
      );
      if (funcionario.length > 0) {
        this.mostrarAsignacion = true;
      } else {
        this.mostrarAsignacion = false;
      }
    });
    /* setInterval(() => {
      this.cargarTickets();
    }, 60000); */
  }

  foto() {
    this.authService.getFotoFuncionario().subscribe((res) => {
      this.fotoPerfil = res;
    });
  }

  openQuickpanel() {
    this.layoutService.openQuickpanel();
  }

  openSidenav() {
    this.layoutService.openSidenav();
  }

  logOut() {
    this.componentService
      .alertaButtons("¿Está usted seguro de cerrar sesión?")
      .then((result) => {
        if (result.isConfirmed) {
          this.authService.logout();
        }
      });
  }

  openMegaMenu(origin: ElementRef | HTMLElement) {
    this.popoverService.open({
      content: MegaMenuComponent,
      origin,
      position: [
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top",
        },
        {
          originX: "end",
          originY: "bottom",
          overlayX: "end",
          overlayY: "top",
        },
      ],
    });
  }

  openSearch() {
    this.layoutService.openSearch();
  }

  toggleSidenav() {}

  cargarTickets() {
    this.notificaciones = [];
    this.countNotificaciones = 0;
    this.ticketService
      .getNotificacionesTickets(this.idEntidad)
      .subscribe((response) => {
        response["result"].forEach((ticket) => {
          if (!ticket["leido"]) {
            this.mostrarAsignacion = true;
            this.notificaciones.push(ticket);
            this.countNotificaciones = this.notificaciones.length;
            if (this.notificaciones.length != 0) {
              this.reproducir();
            }
          }
        });
      });
  }

  crearTikects() {
    const dialogRef = this.dialog.open(CrearTicketComponent, {
      width: "80%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.cargarTickets();
    });
  }

  getIdFuncionario() {
    this.idEntidad = this.locaServiceS.getItem("id");
  }

  showTicketInfo(objTicket) {
    const data = {
      estado: "Leido",
      idEntidad: this.idEntidad,
    };
    this.ticketService
      .postCambiarEstadoTicket(objTicket.idTicket, data)
      .subscribe((response) => {
        this.cargarTickets();
      });
    this.router.navigate(["tickets/detalle-ticket", objTicket.idTicket]);
  }

  reproducir() {
    const audio = new Audio("assets/song/mario-coin.mp3");
    audio.play();
  }

  enableDarkMode() {
    this.styleService.setStyle(Style.dark);
    this.document.documentElement.setAttribute("data-theme", "dark");
    this.isdark = true;
  }

  enableLightMode() {
    this.styleService.setStyle(Style.default);
    this.document.documentElement.setAttribute("data-theme", "default");
    this.isdark = false;
  }
}
