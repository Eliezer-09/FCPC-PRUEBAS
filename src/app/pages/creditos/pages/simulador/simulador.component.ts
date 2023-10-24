import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { DataService } from "src/app/services/data.service";
import moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { UntilDestroy } from "@ngneat/until-destroy";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Identificacion, PrestamosEstados, ProductosFinancieros } from "src/app/model/models";
import { SelectionModel } from "@angular/cdk/collections";
import { CalculadoraComponent } from "./calculadora/calculadora.component";
import { iconify } from "src/static-data/icons";
import { ComponentesService } from "src/app/services/componentes.service";
import { ReplaySubject } from "rxjs";
import { EstadoParticipe } from "src/@vex/interfaces/enums";

@UntilDestroy()
@Component({
  selector: "vex-simulador",
  templateUrl: "./simulador.component.html",
  styleUrls: ["./simulador.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger80ms],
})
export class SimuladorComponent implements OnInit {
  isSimulacion:boolean=true;
  isAdherido:boolean=true;
  @ViewChild(CalculadoraComponent) calculadoraComponent:CalculadoraComponent;
  layoutCtrl = new FormControl("boxed");
  tipoCreditos:any[]=[{label:"Normal",value:"Normal"},
                        {label:"Novación",value:"Novacion"},
                        {label:"Restructuración",value:"Restructuracion"},
                        {label:"Refinanciamiento",value:"Refinanciamiento"}]
  productosFinancieros:  ProductosFinancieros[] = [];
  simboloMoneda: string     ='$';


  simulacionFormGroup=this.fb.group({
    tipoPrestamo:["Normal",[Validators.required]],
    idProducto:[1,[Validators.required]],
    tipoAmortizacion:["Francesa",[Validators.required]],
    montoSolicitado:[0.00,[Validators.required]],
    plazo:[0,[Validators.required]],
    intereses:[0.00,[Validators.required]],
    descuento:[0,[Validators.required]],
    fechaInicio:[moment().format(),[Validators.required]],
    prestamos:[]
  });
  icroundPerson=iconify.icroundPerson
  icroundSearch = iconify.icroundSearch;
  dataSimulacion: any;
  tipoAmortizacion = "1";
  tipoPrestamo = "1";
  date = moment().format();
  motivoPrestamo = "";
  plazo = 0;
  montoSolicitado = 0;

  prestamosParticipe: PrestamosEstados[] = [];
  selection = new SelectionModel<PrestamosEstados>(true, []);
  idPrestamos: any[] = [];
  valorPrestamo = 0.0;
  searchCtrl: FormControl = new FormControl();
  buscar: string= "";
  participe: Identificacion = {};
  filteredTipoProducto:   ReplaySubject<any[]>          = new ReplaySubject<any[]>(1);
  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private componentService: ComponentesService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.dataService.getProductoFinanciero().subscribe((res:ProductosFinancieros[]) => {
      this.productosFinancieros = res;
      this.filteredTipoProducto.next( this.productosFinancieros.slice());
      this.detectarCambios();
    });

  }

  
  protected filterProducto(tipo,codigos:string[]) {
    tipo.next(
      this.productosFinancieros.filter(periodo => codigos.indexOf(periodo.codigoSbs ) > -1)
    );
  }


  selectedTipoPrestamo(event) {
    this.calculadoraComponent.hasPrestamos=false;
    this.calculadoraComponent.hasInteres=false;
    this.calculadoraComponent.hasFechaInicio=false; 
    this.calculadoraComponent.hasOnePrestamo=false;
    this.calculadoraComponent.hasSaldoNeto=false;
    this.filterProducto(this.filteredTipoProducto,['PQ','PP','PH','MU','PH']);
    if (event == "Normal") {
      this.calculadoraComponent.simulacionFormGroup.controls["tipoPrestamo"].setValue("Normal")
    } else if (event == "Novacion"){
      this.filterProducto(this.filteredTipoProducto,['PQ']);
      this.calculadoraComponent.hasPrestamos=true;
      this.calculadoraComponent.hasSaldoNeto=true;
      this.calculadoraComponent.simulacionFormGroup.controls["tipoPrestamo"].setValue("Novacion")
    } else if (event == "Restructuracion") {
      this.calculadoraComponent.simulacionFormGroup.controls["tipoPrestamo"].setValue("Restructuracion")
      this.calculadoraComponent.hasInteres=true;
      this.calculadoraComponent.hasPrestamos=true;
      this.calculadoraComponent.hasOnePrestamo=true;
    } else if (event == "Refinanciamiento") {
      this.calculadoraComponent.hasPrestamos=true;
      this.calculadoraComponent.simulacionFormGroup.controls["tipoPrestamo"].setValue("Refinanciamiento")
      this.calculadoraComponent.hasFechaInicio=true; 
      this.calculadoraComponent.hasOnePrestamo=true;
    }

    this.calculadoraComponent.cambiarPrestamo(event)
    this.calculadoraComponent.changeParticipe(this.participe)
    
  }
  selectedTipoProducto(event){
    this.calculadoraComponent.cambiarProducto(event)
  }

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  consultarParticipe(identificacion) {
    this.calculadoraComponent.clearSimulator()
    this.participe = {};
    if (identificacion) {
        this.spinner.show();
        this.dataService.getParticipeByIdentificacion(identificacion).subscribe(
          (res) => {
            this.esAdherido(res["result"]["estado"])
            this.participe = res["result"];
            this.calculadoraComponent.changeParticipe(this.participe)
            this.spinner.hide();
          },
          (error) => {
            this.participe={};
            this.spinner.hide();
            this.calculadoraComponent.changeParticipe(this.participe)
            this.componentService.alerta( "error",error.error.message);
          }
        );
      
    }else{
      this.participe={};
      this.calculadoraComponent.changeParticipe(this.participe)
      this.componentService.alerta( "warning","Coloca la identificación o el código del partícipe.");
       
    }
  }

  esAdherido(estado){
    if(estado!=EstadoParticipe.Aprobado){
      this.isAdherido=false;
      return;
    }
    this.isAdherido=true;
  }




}
