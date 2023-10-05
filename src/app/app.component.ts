import {
  Component,
  Inject,
  LOCALE_ID,
  Renderer2,
  ChangeDetectorRef,
  OnInit,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
} from "@angular/core";
import { ConfigService } from "../@vex/services/config.service";
import { Settings } from "luxon";
import { DOCUMENT } from "@angular/common";
import { Platform } from "@angular/cdk/platform";
import { NavigationService } from "../@vex/services/navigation.service";
import { LayoutService } from "../@vex/services/layout.service";
import { ActivatedRoute } from "@angular/router";
import { filter, map } from "rxjs/operators";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { SplashScreenService } from "../@vex/services/splash-screen.service";
import { Style, StyleService } from "../@vex/services/style.service";
import { ConfigName } from "../@vex/interfaces/config-name.model";
import { environment } from "../environments/environment";

// ICONOS
import icArchive from "@iconify/icons-ic/archive";
import icCreditCard from "@iconify/icons-ic/credit-card";
import icPerson from "@iconify/icons-ic/person";
import icDashboard from "@iconify/icons-ic/dashboard";
import { DataService } from "./services/data.service";
import {
  NavigationDropdown,
  NavigationLink,
} from "src/@vex/interfaces/navigation-item.interface";
import { colorVariables } from "src/@vex/components/config-panel/color-variables";
import { NGXLogger } from "ngx-logger";

@Component({
  selector: "vex-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Fondo de Censatia";

  accesos = [];
  data: any;

  constructor(
    private configService: ConfigService,
    private changeDetectorRefs: ChangeDetectorRef,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private navigationService: NavigationService,
    private splashScreenService: SplashScreenService,
    private logger: NGXLogger
  ) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, "is-blink");
    }
    var color = colorVariables.deepBlue;
    var colorSheme = "deepBlue";
    if (
      location.href.indexOf("devapp") > 0 ||
      location.href.indexOf("localhost") > 0
    ) {
      color = colorVariables.amber;
      /*   color = colorVariables.deepBlue;   */
      colorSheme = "amber";
     /*  colorSheme = 'deepBlue'  */  
    }

    if (this.document) {
      this.document.documentElement.style.setProperty(
        "--color-primary",
        color.default.replace("rgb(", "").replace(")", "")
      );
      this.document.documentElement.style.setProperty(
        "--color-primary-contrast",
        color.contrast.replace("rgb(", "").replace(")", "")
      );
      this.document.documentElement.setAttribute("color-scheme", colorSheme);
    }

    /**
     * Customize the template to your needs with the ConfigService
     * Example:
     *  this.configService.updateConfig({
     *    sidenav: {
     *      title: 'Custom App',
     *      imageUrl: '//placehold.it/100x100',
     *      showCollapsePin: false
     *    },
     *    showConfigButton: false,
     *    footer: {
     *      visible: false
     *    }
     *  });
     */

    /**
     * Config Related Subscriptions
     * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
     * Example: example.com/?layout=apollo&style=default
     */
    this.route.queryParamMap
      .pipe(
        map(
          (queryParamMap) =>
            queryParamMap.has("rtl") &&
            coerceBooleanProperty(queryParamMap.get("rtl"))
        )
      )
      .subscribe((isRtl) => {
        this.document.body.dir = isRtl ? "rtl" : "ltr";
        this.configService.updateConfig({
          rtl: isRtl,
        });
      });

    this.route.queryParamMap
      .pipe(filter((queryParamMap) => queryParamMap.has("layout")))
      .subscribe((queryParamMap) =>
        this.configService.setConfig(queryParamMap.get("layout") as ConfigName)
      );

    this.route.queryParamMap
      .pipe(filter((queryParamMap) => queryParamMap.has("style")))
      .subscribe((queryParamMap) =>
        this.styleService.setStyle(queryParamMap.get("style") as Style)
      );
  }

  ngOnInit(): void {}

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }
}
