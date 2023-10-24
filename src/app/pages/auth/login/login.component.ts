import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import icVisibility from "@iconify/icons-ic/twotone-visibility";
import icVisibilityOff from "@iconify/icons-ic/twotone-visibility-off";
import { fadeInUp400ms } from "../../../../@vex/animations/fade-in-up.animation";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../auth.service";
import { LocalService } from "src/app/services/local.service";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: "vex-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  inputType = "password";
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  email = "";
  clave = "";
  returnUrl = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private localServiceS: LocalService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", Validators.required],
      clave: ["", Validators.required],
    });

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  login() {
    let authorizationData = "Basic " + btoa(this.email + ":" + this.clave);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: authorizationData,
      }),
    };

    if (this.email != "" && this.clave != "") {
      this.spinner.show();

      const data = localStorage.setItem("basic", authorizationData);
      this.authService.login(httpOptions).subscribe(
        async (data) => {
          // json data
          if (data["success"] == true) {
            this.storageService.generateSecretKey();
            localStorage.removeItem("basic");
            this.localServiceS.setItem("nombre", data["result"]["nombre"]);
            this.localServiceS.setItem("token", data["result"]["token"]);
            this.localServiceS.setItem("id", data["result"]["id"]);

            this.snackbar.open("Ingreso exitoso!", null, {
              horizontalPosition: "center",
              duration: 5000,
            });

            this.spinner.hide();

            if (this.returnUrl != "/") {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.router.navigate(["/"]);
            }
          } else {
            this.snackbar.open("Error al ingresar!", null, {
              horizontalPosition: "center",
              duration: 5000,
            });
          }
        },
        (error) => {
          this.snackbar.open(
            error.error.message || "Ocurrió un error al iniciar sesión",
            null,
            {
              horizontalPosition: "center",
              duration: 5000,
            }
          );
          this.spinner.hide();
        }
      );
    } else {
      this.snackbar.open("Las credenciales ingresadas son inválidas!", null, {
        horizontalPosition: "center",
        duration: 5000,
      });
    }
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = "password";
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = "text";
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
