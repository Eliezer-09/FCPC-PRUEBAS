import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormGroupDirective,
  FormArray,
  Validators,
} from "@angular/forms";
import {
  ColaboradorPersona,
  AdjuntosColaborador,
  NombreSeccion,
} from "src/app/pages/colaboradores/models/colaboradores";
import { ColaboradorService } from "src/app/pages/colaboradores/services/colaborador.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-documentos-ingreso",
  templateUrl: "./documentos-ingreso.component.html",
  styleUrls: ["./documentos-ingreso.component.scss"],
})
export class DocumentosIngresoComponent implements OnInit, OnChanges {
  @Input() visualizationMode: boolean = false;
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
/*   @Input() idEntidad: any; */
  @Input() tipoColaborador: any;
  adjuntosDocumentosIngreso:any[]=[];
  //forms
  form: FormGroup;
  documentosIngreso: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective,
    private dataService: DataService,
    private utilsService: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService,
    private colaboradorService: ColaboradorService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  ngOnInit(): void {
 /*    this.documentosIngreso = this._formBuilder.group({
      adjuntosdocumentosIngreso: this._formBuilder.array([]),
    });
    this.form = this.ctrlContainer.form;
    this.form.addControl("documentosIngreso", this.documentosIngreso); */
  }

/*   get adjuntosDocumentosIngreso() {
    return this.documentosIngreso.controls[
      "adjuntosdocumentosIngreso"
    ] as FormArray;
  } */



  obtenerAdjuntos() {
    /* this.adjuntosDocumentosIngreso.clear(); */
this.adjuntosDocumentosIngreso=[];
    const adjunto =  this.adjuntosColaborador.filter(
      (x) => x.nombreSeccion == NombreSeccion.documentoIngreso
    );
    let dataAdjunto =[]
    adjunto.forEach((element: AdjuntosColaborador) => {
      element.archivos=[];
      dataAdjunto.push({idEntidad:this.idColaborador,
        idTipoAdjunto:element.idTipoAdjunto
      })
    
    }); 

  
    this.adjuntosColaborador=adjunto
    this.dataService.getInfoAdjunto(dataAdjunto).subscribe(res=>{
      const dataAdjuntoList=res["result"]


      dataAdjuntoList.forEach(element => {
        const adjuntoPlan = adjunto.filter(
          (x) => x.idTipoAdjunto == element.tipoAdjunto
        );

        if(adjuntoPlan.length>0){
          let dataAdjunto=adjuntoPlan[0]
          dataAdjunto["nombreAdjunto"]=element.nombreAdjunto
          dataAdjunto["archivos"]= element.url? [element] : []
         
          this.adjuntosDocumentosIngreso.push(dataAdjunto);
        }
       
      });
    });
    
/*     this.adjuntosColaborador.forEach((element: AdjuntosColaborador) => {
      if (element.nombreSeccion == this.controlView) {
        let adjunto = this._formBuilder.group({
          nombre: [element.nombreAdjunto],
          archivos: [
            element.archivos? element.archivos : null,
            element.esRequerido ? Validators.required : null,
          ],
        });

        this.adjuntosDocumentosIngreso.push(adjunto);
      }
    }); */
  }
  
  getAdjunto(idTipoAdjunto,idColaborador, idTipoColaborador) {

/*     this.loading = true; */

          const adjunto = this.adjuntosColaborador.filter(
            (x) => x.idTipoAdjunto == idTipoAdjunto
          );
 
            const dataAdjunto=
           [{idEntidad:this.idColaborador,
              idTipoAdjunto:adjunto[0].idTipoAdjunto
            }]
          this.dataService.getInfoAdjunto(dataAdjunto).subscribe(res=>{
            const dataAdjunto=res["result"]
           
/*             const adjuntoidReferenciaBancaria = dataAdjunto.filter(
              (x) => x.idTipoAdjunto == idTipoAdjunto
            ); */
            
            if(dataAdjunto.length>0 && dataAdjunto.url){
              adjunto[0]["nombreAdjunto"]=dataAdjunto[0].nombreAdjunto
              adjunto[0]["archivos"]=dataAdjunto
              this.adjuntosColaborador=adjunto
          /*     this.loading = false; */
            }else{
              adjunto[0]["nombreAdjunto"]=dataAdjunto[0].nombreAdjunto
              adjunto[0]["archivos"]=[]
              this.adjuntosColaborador=adjunto
        /*       this.loading = false; */
            }
           
            })

  }
}
