import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdjuntosGenerales, AdjuntosList, DataSave } from 'src/app/components/adjuntos-general/ajuntos-general';
import { Identificacion } from 'src/app/model/models';
import { ComponentesService } from 'src/app/services/componentes.service';
import { DataService } from 'src/app/services/data.service';
import { iconify } from 'src/static-data/icons';
import { ActualizarDatosParticipeComponent } from './actualizar-datos-participe/actualizar-datos-participe.component';
import { ActivatedRoute } from '@angular/router';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { NovacionComponent } from './novacion/novacion.component';
import { RefinanciamientoComponent } from './refinanciamiento/refinanciamiento.component';
import { RestructuracionComponent } from './restructuracion/restructuracion.component';
import { EstadoParticipe } from 'src/@vex/interfaces/enums';
import { CreditosService } from '../../creditos.service';
import { NormalComponent } from './normal/normal.component';

@Component({
  selector: 'vex-solicitudes-creditos',
  templateUrl: './solicitudes-creditos.component.html',
  styleUrls: ['./solicitudes-creditos.component.scss'],
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class SolicitudesCreditosComponent implements OnInit, AfterViewInit {
  searchCtrl: FormControl = new FormControl();
  buscar: string= "";
  icroundSearch = iconify.icroundSearch;
  roundCreditCard=iconify.roundCreditCard;
  icroundPerson=iconify.icroundPerson
  icCheck = iconify.icroundCheckCircle;
  icCancel = iconify.icroundCancel;
  icPriority_high = iconify.icpriorityHigh;
  icroundBackHand =iconify.icroundBackHand;
  verificarDatos:boolean=false;
  participe: Identificacion = {};
  
  adjuntosGenerales: AdjuntosGenerales = {
    nombreSeccion: "",
    adjuntosList: [],
  };

  title:string='credito'
  infoMessage:string = "No se puede realizar la solicitud";
  isCredito:boolean=false;
  isNovacion:boolean=false;
  isRestructuracion: boolean=false;
  isRefinanciamiento: boolean=false;
  isSimular: boolean=false;
  noPermitido:boolean=false;

  params: any;
  productosFinancieros = [];

  
  @ViewChild(NormalComponent) normalComponent:NormalComponent;
  @ViewChild(NovacionComponent) novacionComponent:NovacionComponent;
  @ViewChild(RefinanciamientoComponent) refinanciamientoComponent:RefinanciamientoComponent;
  @ViewChild(RestructuracionComponent) restructuracionComponent:RestructuracionComponent;

  childCredito:any;
  constructor(
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private componentService: ComponentesService, 
    public dialog: MatDialog,
    private routerActive: ActivatedRoute
  ){
    
  }

  ngOnInit(): void {
    this.routerActive.data.subscribe(params => {
      this.params=params
      this.isSimular=params.simular;
      if(this.params.credito){
        this.isCredito=true;
        this.title="Crédito"     
      }
      else if(this.params.novacion){
        this.isNovacion=true;
        this.title="Novación"
      }
      else if(this.params.refinanciamiento){
        this.isRefinanciamiento=true;
        this.title="Refinanciamiento"
      }
      else if(this.params.restructuracion){
        this.isRestructuracion=true;
        this.title="Restructuración"
      }
    }) 
    if(this.isSimular) this.cargarProductosFinancieros()
  }

ngAfterViewInit(): void {
      if(this.params.credito){
        this.childCredito=this.normalComponent;
      }
      else if(this.params.novacion){
        this.childCredito=this.novacionComponent;
      }
      else if(this.params.refinanciamiento){
        this.childCredito=this.refinanciamientoComponent;
      }
      else if(this.params.restructuracion){
        this.childCredito=this.restructuracionComponent;
      }
      this.routerActive.params.subscribe((params) => {
        if(params.identificacion){
          this.buscar=params.identificacion;
          this.consultarParticipe(params.identificacion);
        }
      });
  
}

  changeVerificarDatos(){
    this.verificarDatos=true;
    this.childCredito.verificarDatos=true;
  }



  consultarParticipe(identificacion) {
    this.participe = {};
    this.verificarDatos=false;
    this.childCredito.verificarDatos=false;
    this.childCredito.participe={};
    if (identificacion) {
        this.spinner.show();
        this.dataService.getParticipeByIdentificacion(identificacion).subscribe(
          (res) => {
          
            if(this.permiteRealizaSolicitudPrestamo(res["result"]["estado"])){
              this.participe = res["result"];
              this.childCredito.generarData(this.participe);
              this.cargarAdjuntos();
            }

            this.spinner.hide();
          },
          (error) => {
            this.noPermitido=true;
            this.spinner.hide();
            this.componentService.alerta(
              "error",
               error.error.message
            );
          }
        );
      
    }
  }

  cargarAdjuntos() {
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


  actualizarOpen(){
    const dialogRef = this.dialog.open(ActualizarDatosParticipeComponent, {
      data: {participe: this.participe},
      width:"80%"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.verificarDatos=result
    });
  }

  permiteRealizaSolicitudPrestamo(estado){
    if(estado!=EstadoParticipe.Aprobado){
      this.noPermitido=true;
      this.componentService.alerta(
        "error", "No es posible realizar un prestamo, el partícipe no está adherido"
      );
      return false;
    }
    this.noPermitido=false;
    return true;
  }


  cargarProductosFinancieros() {
    // PRODUCTOS FINANCIEROS
    this.spinner.show();
    this.dataService.getProductosFinancieros().subscribe((res: any) => {
      this.productosFinancieros = res;
      this.spinner.hide();
    });
  }

}
