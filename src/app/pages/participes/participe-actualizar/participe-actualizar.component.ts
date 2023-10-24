import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";

import icDescription from "@iconify/icons-ic/twotone-description";

import { stagger80ms } from "../../../../@vex/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "../../../../@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "../../../../@vex/animations/fade-in-right.animation";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { ComponentesService } from "../../../services/componentes.service";
import { DataService } from "../../../services/data.service";
import { Ciudad, Direccion, Provincia } from "src/app/model/models";
import { NgxSpinnerService } from "ngx-spinner";
import { PutSolicitud, ReferenciaBancaria } from "../../../model/models";

import moment from "moment";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { Participe } from "../models/models-participes";
import { FormsService } from "src/app/services/forms.service";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { CreditosService } from "../../creditos/creditos.service";
import {
  AdjuntosGenerales,
  AdjuntosList,
  DataSave,
} from "src/app/components/adjuntos-general/ajuntos-general";
import { TiposAdjunto } from "src/@vex/interfaces/enums";
import { iconify } from "src/static-data/icons";
import { createMask } from "@ngneat/input-mask";

@Component({
  selector: "vex-participe-actualizar",
  templateUrl: "./participe-actualizar.component.html",
  styleUrls: ["./participe-actualizar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class ParticipeActualizarComponent implements OnInit {
  Tab1 = "Datos del participe";
  Tab2 = "Adjuntos del partícipe";
  Tab3 = "Perfil económico";
  Tab4 = "Datos Bancarios";
  Tab5 = "Aporte Adicional";
  Tab6 = "Rol de pago del partícipe";
  Tab7 = "Rol de pago del crédito";
  searchCtrl = new FormControl();
  buscar = "";
  icroundSearch = iconify.icroundSearch;
  perfilEconomico: any;

  provincia: Provincia = {};
  ciudad: Ciudad = {};
  participe: Participe = {};
  direccion: Direccion = {};


  // ARREGLOS CATALOGO
  provincias: any = [];
  ciudades: any = [];
  estadosCivil: any = [];
  generos: any = [];

  prestamos: any = [];

  date = moment().format("MMM Do YY");

  // VARIABLES

  referenciaBancaria: ReferenciaBancaria = {};
  keyword = "descripcion";


  // ICONOS
  icDescription = icDescription;

  // FORMGROUP
  adjuntosFormGroup: FormGroup;
  NumberNoZeroNoNegativeRule: any[]=[Validators.required, Validators.min(0),Validators.pattern(this.formsService.expNotZero),Validators.pattern(this.formsService.expDecimales)];
  valorAdicionalFormGroup:FormGroup=this.fb.group({
    valorAdicional:["",this.NumberNoZeroNoNegativeRule],
    nota: [""],
  });
  rolDePagoFormGroup: FormGroup;

  identificacionRouter: any =
    this.route.snapshot.paramMap.get("identificacion");
  identificacion;

  fechaActual: string;

  adjuntosGenerales: AdjuntosGenerales = {
    nombreSeccion: "",
    adjuntosList: [],
  };

  adjuntosRolParticipe: AdjuntosGenerales = {
    nombreSeccion: "",
    adjuntosList: [],
  };

  adjuntosRolCredito: AdjuntosGenerales = {
    nombreSeccion: "",
    adjuntosList: [],
  };

  adjuntosAporteAdicional: AdjuntosGenerales = {
    nombreSeccion: "",
    adjuntosList: [],
  };


  simboloMoneda: string     ='$';

  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: false,
    placeholder: '0',
  });

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataComponente: ComponentesService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private creditosService: CreditosService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private formsService: FormsService
  ) {}

  ngOnInit() {
    this.fechaActual = new Date().toISOString().split("T")[0];

    if (this.identificacionRouter) {
      this.identificacion = this.identificacionRouter;
    }
    this.formsGroups();
    this.route.params.subscribe((params) => {
      if(params.identificacion){
        this.buscar=params.identificacion;
        this.traerAlParticipe(params.identificacion);
      }
    });
  }

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  // INICIALIZACION DE LOS FORMS GROUPS CON SUS CAMPOS
  formsGroups() {


    this.rolDePagoFormGroup = this.fb.group({
      identificacion: [""],
      nombre: [""],
      adjunto: ["", Validators.required],
      idPrestamo: [""],
    });

    this.adjuntosFormGroup = this.fb.group({
      cedulaFrontal: [""],
      cedulaPosterior: [""],
      contrato: [""],
    });
  }

  getPrestamos(idParticipe) {
    this.prestamos = [];
    this.creditosService.getPrestamosbyId(idParticipe).subscribe(
      (result) => {
        if (result["result"]["prestamos"].length != 0) {
          result["result"]["prestamos"].forEach((element) => {
            if (
              element["estado"] == "Transferido" ||
              element["estado"] == "Legalizado" ||
              element["estado"] == "Aprobado" ||
              element["estado"] == "Pendiente" ||
              element["estado"] == "Revalidacion"
            ) {
              this.prestamos.push(element);
            }
          });
        }
      },
      (error) => {
        console.log("Error");
      }
    );
  }

  traerAlParticipe(identificacion) {
    this.identificacion = identificacion;
    this.participe = {};
    if (identificacion) {
        this.spinner.show();
        this.dataService.getParticipeByIdentificacion(identificacion).subscribe(
          async (res) => {
            this.participe = await res["result"];

            this.getPrestamos(this.participe.idParticipe);

            this.identificacion = identificacion;

            this.rolDePagoFormGroup.controls["idPrestamo"].setValue(null);

            this.cargarAdjuntosStep2();
            this.cargarAdjuntosRolPago();
            this.cargarAdjuntosAporteAdicional();
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            this.dataComponente.alerta(
              "error",
               error.error.message
            );
          }
        );
      
    }
  }

  cargarAdjuntosStep2() {
    const dataSaveList: DataSave[] = [
      {
        tipoAdjunto: 1,
        observaciones: "Cédula frontal",
      },
      {
        tipoAdjunto: 2,
        observaciones: "Cédula posterior",
      },
      {
        tipoAdjunto: 8,
        observaciones: "Contrato",
      },
    ];

    const adjuntosList: AdjuntosList[] = dataSaveList.map((dataSave) => ({
      dataSave,
      nombreAdjunto: dataSave.observaciones,
      esRequerido: false,
      multiple: false,
      visualizationMode: false,
      idTipoAdjunto: dataSave.tipoAdjunto,
    }));
    this.adjuntosGenerales = {
      nombreSeccion: null,
      adjuntosList,
    };
  }

  cargarAdjuntosRolPago() {
    const dataSaveList: DataSave[] = [
      {
        tipoAdjunto: TiposAdjunto.RolPagos,
        observaciones: "Rol de pago partícipe",
      },
    ];

    const adjuntosList: AdjuntosList[] = dataSaveList.map((dataSave) => ({
      dataSave,
      nombreAdjunto: dataSave.observaciones,
      esRequerido: false,
      multiple: false,
      visualizationMode: false,
      idTipoAdjunto: dataSave.tipoAdjunto,
    }));
    this.adjuntosRolParticipe = {
      nombreSeccion: null,
      adjuntosList,
    };
  }

  cargarAdjuntosRolPagoCredito(idCredito) {
    const dataSaveList: DataSave[] = [
      {
        tipoAdjunto: TiposAdjunto.RolPagos,
        observaciones: "Rol de pago crédito",
      },
    ];
    let idPrestamo = idCredito;

    const adjuntosList: AdjuntosList[] = dataSaveList.map((dataSave) => ({
      dataSave,
      nombreAdjunto: dataSave.observaciones,
      esRequerido: false,
      multiple: false,
      visualizationMode: false,
      idTipoAdjunto: dataSave.tipoAdjunto,
      idPrestamo: idPrestamo ? idPrestamo : null,
    }));
    this.adjuntosRolCredito = {
      nombreSeccion: null,
      adjuntosList,
    };
  }

  cargarAdjuntosAporteAdicional() {
    const dataSaveList: DataSave[] = [
      {
        tipoAdjunto: TiposAdjunto.AporteAdicional,
        observaciones: "Aporte adicional",
      },
    ];

    const adjuntosList: AdjuntosList[] = dataSaveList.map((dataSave) => ({
      dataSave,
      nombreAdjunto: dataSave.observaciones,
      esRequerido: false,
      multiple: false,
      visualizationMode: false,
      idTipoAdjunto: dataSave.tipoAdjunto,
    }));
    this.adjuntosAporteAdicional = {
      nombreSeccion: null,
      adjuntosList,
    };
  }

  public innerHtml: SafeHtml;
  public setInnerHtml(pdfurl: string) {
    this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
    this.detectarCambios();
  }

  getErrorMessage(element, add_error_messaje?) {
    return this.formsService.getErrorMessage(element, add_error_messaje);
  }

  verifyInputNumber(){
    this.valorAdicionalFormGroup.markAllAsTouched();
    let controlsNumber=["valorAdicional"]
    controlsNumber.forEach(control => {
      let value=this.valorAdicionalFormGroup.value[control]
      if((!value || value<=0 ) && this.valorAdicionalFormGroup.controls[control].status!="DISABLED"){
        this.valorAdicionalFormGroup.controls[control].setErrors({'especificError': "El valor no debe ser 0 o menor."});
      }
    });
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  descargarAporte() {
    if(this.valorAdicionalFormGroup.valid){
      this.spinner.show();
      this.dataService
        .getArchivoAporte(
          this.participe.idParticipe,
          this.valorAdicionalFormGroup.value["valorAdicional"]
        )
        .subscribe(
          (res) => {
            this.spinner.hide();
            window.open(res["changingThisBreaksApplicationSecurity"]);
          },
          (error) => {
            this.spinner.hide();
            this.dataComponente.alerta("error", error.error.message);
          }
        );
    }
    else{
      this.dataComponente.alerta("info", "Ingresa el valor adicional");
    }
  }

  setTwoNumberDecimal(form,parameter) {
    let value = form.value[parameter]
    if (value!=null && value!=undefined) {
      let parseValue =value
      if (typeof value!="number") {
        parseValue = value.replaceAll(',', '')
      }
      form.controls[parameter].setValue(parseFloat(parseFloat(parseValue + '').toFixed(2)));
      this.verifyInputNumber()
      return form.value[parameter]
    }
  }
   
}
