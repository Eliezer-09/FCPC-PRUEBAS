import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { OperationResult, Prestamo } from "src/app/model/models";
import { AuthService } from "src/app/pages/auth/auth.service";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { CreditosService } from "../../creditos.service";

@Component({
  selector: "vex-acreditacion-uniformado",
  templateUrl: "./acreditacion-uniformado.component.html",
  styleUrls: ["./acreditacion-uniformado.component.scss"],
})
export class AcreditacionUniformadoComponent implements OnInit {
  @Input() prestamo: Prestamo;
  @Input() estado: any;
  @Input() razonSocialProveedor: any
  
  postTransferir = {
    comentarios: "",
    funcionario: this.authService.getFuncionario(),
    fecha: this.dataService.date,
    idReferenciaBancaria: null,
    monto: 0,
    cheque: "",
    idCuentaBancaria: 0,
  };
  nota: string = "";
  cuentasBancarias: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private dataService: DataService,
    private creditoService: CreditosService,
    private componentService: ComponentesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.creditoService
      .getCuentasBancarias()
      .subscribe((res: OperationResult) => {
        this.cuentasBancarias = res.result;
      });
  }

  // TRANSFERIR
  transferir() {
    this.spinner.show();
    if (
      this.postTransferir.comentarios != "" &&
      this.postTransferir.cheque != "" &&
      this.postTransferir.idCuentaBancaria != 0
    ) {
      this.creditoService
        .postAcreditar(this.prestamo.idPrestamo, this.postTransferir)
        .subscribe(
          (res) => {
            if (res["success"] == true) {
              this.spinner.hide();
              this.componentService
                .alerta("success", "Se transfirió exitosamente")
                .then((res) => {
                  this.router.navigateByUrl("creditos/acreditacion");
                });
            } else {
              this.spinner.hide();
            }
          },
          (error) => {
            this.spinner.hide();
          }
        );
    } else {
      this.spinner.hide();
      this.componentService.alerta(
        "info",
        "No puedes transferir sin colocar un comentario y número de cheque"
      );
    }
  }

  anular() {
    if (this.nota != "") {
      this.componentService
        .alertaButtons("¿Estás seguro que deseas anular?")
        .then((result) => {
          if (result.isConfirmed) {
            this.spinner.show();
            this.creditoService
              .postAnularPrestamo(
                this.prestamo.idPrestamo,
                this.nota,
                this.authService.getFuncionario()
              )
              .subscribe(
                (res: any) => {
                  if (res.success == true) {
                    this.spinner.hide();
                    this.router.navigateByUrl("/creditos/pendientes");
                    this.componentService.alerta(
                      "success",
                      "Rechazado exitosamente"
                    );
                  } else {
                    this.spinner.hide();
                    this.componentService.alerta(
                      "error",
                      "Ocurrió un error al rechazar la solicitud"
                    );
                  }
                },
                (error) => {
                  this.spinner.hide();
                  this.componentService.alerta(
                    "error",
                    "Ocurrió un error al rechazar"
                  );
                }
              );
          } else if (result.isDenied) {
          }
        });
    } else {
      this.spinner.hide();
      this.componentService.alerta("info", "Debes ingresar un comentario");
    }
  }
}
