import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

import icVerticalSplit from '@iconify/icons-ic/twotone-vertical-split';
import icVisiblity from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icDescription from '@iconify/icons-ic/twotone-description';
import icSearch from '@iconify/icons-ic/twotone-search';
import { stagger80ms } from '../../../../@vex/animations/stagger.animation';
import { FormBuilder, FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DataService } from '../../../services/data.service';
import { BehaviorSubject,  } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import 'sweetalert2/src/sweetalert2.scss'
import { ComponentesService } from '../../../services/componentes.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatStepper } from '@angular/material/stepper';
import { ContratosService } from '../contratos.service';
import { iconify } from 'src/static-data/icons';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
@UntilDestroy()
@Component({
  selector: "vex-participe-activo",
  templateUrl: "./participe-activo.component.html",
  styleUrls: ["./participe-activo.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    fadeInUp400ms
  ]
})
export class ParticipeActivoComponent implements OnInit, AfterViewChecked {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  layoutCtrl = new FormControl("boxed");
  selection = new SelectionModel<any>(true, []);
  searchCtrl = new FormControl();
  filesForDownload = [];
  icroundPlagiarism=iconify.icroundPlagiarism
  icroundSearch       = iconify.icroundSearch;
  icroundAssignmentInd=iconify.icroundAssignmentInd;
  icroundAssignment=iconify.icroundAssignment;
  icroundVideoCameraFront=iconify.icroundVideoCameraFront;
  icroundFileDownload=iconify.icroundFileDownload;
  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icSearch = icSearch;
  icroundCircle =iconify.icroundCircle
  public mySubject: Promise<any>

  documento;
  isLoading = false;
  buscar = "";
  participe;
  datos: any = {};
  prestamos: any = [];
  saldototal = "";
  cedulaFrontal;
  cedulaPosterior;
  contrato;
  firma: any = "";

  show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  mostrarTextoVideo = false;
  video;
   cedulaForm = this.fb.group({ });
   contratoForm = this.fb.group({ });
   videoForm = this.fb.group({ });
 
  
  ShowInformation = false
  
  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private componentService: ComponentesService,
    private contratoService: ContratosService,
  ) { 

  }
  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }

  estadoContrato(estado: string){
    let configuracionEstado= {descripcion: estado, classStyle: ["neutroStatus"]}
    switch (estado) {
      case "NoDisponible":
        configuracionEstado= {descripcion: "NO ADHERIDO", classStyle: ["rechazadoStatus"]}
        break;

      case "Anulado":
        configuracionEstado.classStyle= ["rechazadoStatus"];
      break;

      case "Pendiente":
         configuracionEstado= {descripcion: "PENDIENTE DE APROBACIÓN", classStyle: ["pendienteStatus"]}
      break;

      case "Aprobado":
        configuracionEstado= {descripcion: "PARTÍCIPE ACTIVO", classStyle: ["aprobadoStatus"]}
      break;
    
      case "Rechazado":
        configuracionEstado= {descripcion: "SOLICITUD RECHAZADA", classStyle: ["rechazadoStatus"]}
      break;
    }
    return configuracionEstado;
  }

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }


  ngOnInit(){
  }

  clearData(){
    this.contrato=null;
    this.video = null;
    this.cedulaPosterior=null;
    this.innerHtmlCedulaPosterior=null;
    this.cedulaFrontal=null;
    this.innerHtmlCedulaFrontal=null;
    this.filesForDownload=[];
  }

  onFilterChange(value: string) {
    if (!this.datos) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    if (value.length == 10 || value.length == 4) {
    } else {
      this.show.next(false);
    }
  }

  goFirma(stepper: MatStepper){
    this.spinner.show()
    // FIRMA 
    this.contratoService.getParticipeAdjunto(this.participe.idParticipe, "Firma").subscribe(firma=>{
      this.firma = firma
      this.spinner.hide()
    }, (error)=> {
      this.spinner.hide()
      this.componentService.alerta("error", "El partícipe no tiene firma");
    })
  }

  goContrato(){
    this.spinner.show()
    this.contratoService.getContratoByIdParticipe(this.participe.idParticipe).subscribe(contrato=>{
      this.contrato = contrato
      this.setInnerHtmlContrato(contrato["changingThisBreaksApplicationSecurity"])
      this.spinner.hide()
    }, (error)=> {
      this.spinner.hide()
      this.componentService.alerta("error", "No se ha encontrado contrato de adhesión");
    })
  }

  goVideo(){
    this.spinner.show()
    this.contratoService.getParticipeAdjunto(this.participe.idParticipe, "Video").subscribe(video=>{
      this.video = video;
      this.spinner.hide()
    }, error => {
      this.spinner.hide();
      this.componentService.alerta("error", "No se ha encontrado el Video")
    })
  }

  getCedulaPosterior(){
    this.spinner.show()
    this.contratoService.getParticipeAdjuntos(this.participe.idParticipe, "CedulaPosterior").subscribe(cedulaPosterior=>{
      this.cedulaPosteriorDownload=cedulaPosterior["res"];
      if (cedulaPosterior["type"] == "application/pdf") {
        this.setInnerHtmlCedulaPosterior(cedulaPosterior["url"]["changingThisBreaksApplicationSecurity"])
      }else if(cedulaPosterior["type"].includes("image")){
        this.cedulaPosterior = cedulaPosterior["url"];

      } 
      this.spinner.hide()
    }, (error)=> {
      this.spinner.hide()
      this.componentService.alerta("error", "El partícipe no tiene cédula posterior");
    })
  }

  showCedulaFrontal:boolean=false;
  cedulaFrontalDownload;
  cedulaPosteriorDownload;
  
  getCedulaFrontal(){
    this.spinner.show()
    this.contratoService.getParticipeAdjuntos(this.participe.idParticipe, "CedulaFrontal").subscribe(cedulaFrontal=>{
      this.cedulaFrontalDownload=cedulaFrontal["res"];
      if (cedulaFrontal["type"] == "application/pdf") {
        this.setInnerHtmlCedulaFrontal(cedulaFrontal["url"]["changingThisBreaksApplicationSecurity"])
      }else if(cedulaFrontal["type"].includes("image")){
        this.cedulaFrontal = cedulaFrontal["url"];
        
      }else{
        this.componentService.alerta("info", "El partícipe, no tiene adjuntos")
      }
    this.spinner.hide()
  }, (error)=> {
    this.spinner.hide()
    this.showCedulaFrontal=true;
    this.componentService.alerta("error", "El partícipe no tiene cédula frontal");
  })
  }


  buscarParticipe(buscar?) {
    if (buscar.length == 10 || buscar.length == 4) {
      this.clearData()
      this.spinner.show()
      this.dataService.getParticipeByIdentificacion(buscar).subscribe(res => {
        this.participe = res["result"];  
        if (this.participe.estado == "Pendiente") {
          this.componentService.alerta("info", "No se puede consultar por partícipe pendiente")
        }else{
          this.getCedulaPosterior();
          this.getCedulaFrontal();
          this.ShowInformation=true;
        }
        this.spinner.hide()
      }, async (error) => { 
        this.spinner.hide()
        this.componentService.alerta("error", error.error.message)
      } );
    }
  }


  descargarCedula(name:string,file:any) {
    let link = document.createElement('a');
    let extension='.png'
    if(file['type']=='image/jpg')extension='.jpg'
    if(file['type']=='image/jpge')extension='.jpge'
    link.setAttribute('download',name+extension);
    link.style.display = 'none';
    document.body.appendChild(link);
    if (window.URL && window.URL.createObjectURL) {
      link.href = window.URL.createObjectURL(file);
    } else {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      link.href = event.target.result;
    };
    reader.readAsDataURL(file);
  }
    link.click();
  }


  downloadVideo(){
    var link = document.createElement('a');
  
    link.setAttribute('download', "Video.mp4");
    link.style.display = 'none';
  
    document.body.appendChild(link);

    link.setAttribute(
      "href",
      this.video["changingThisBreaksApplicationSecurity"]
    );
    link.click();

    document.body.removeChild(link);
  }

  onTabClick(event){
    if (event.tab.textLabel == "contrato" && !this.contrato) {
      this.goContrato()
    }
    if (event.tab.textLabel == "video" && !this.video) {
      this.goVideo()
    }
  }

  public innerHtmlContrato: SafeHtml;
  public setInnerHtmlContrato(pdfurl: string) {
    this.innerHtmlContrato = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  public innerHtmlCedulaFrontal: SafeHtml;
  public setInnerHtmlCedulaFrontal(pdfurl: string) {
    this.innerHtmlCedulaFrontal = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  public innerHtmlCedulaPosterior: SafeHtml;
  public setInnerHtmlCedulaPosterior(pdfurl: string) {
    this.innerHtmlCedulaPosterior = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

 

} 
