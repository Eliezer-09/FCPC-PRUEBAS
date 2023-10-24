import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import {
  AdjuntosColaborador,
  ColaboradorPersona,
  NombreSeccion,
} from "src/app/pages/colaboradores/models/colaboradores";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "vex-documentos-legales-colaborador",
  templateUrl: "./documentos-legales-colaborador.component.html",
  styleUrls: ["./documentos-legales-colaborador.component.scss"],
})
export class DocumentosLegalesColaboradorComponent
  implements OnInit, OnChanges
{
  @Input() visualizationMode: boolean = false;
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;

  @Input() tipoColaborador: any;

  //forms
  form: FormGroup;
  documentosLegales: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective,
    private dataService: DataService,
  ) {}
  adjuntosDocumentosLegales:any[]=[];
  ngOnChanges(changes: SimpleChanges) {
    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  ngOnInit(): void {
/*     this.documentosLegales = this._formBuilder.group({
      adjuntosDocumentosLegales: this._formBuilder.array([]),
    });
    this.form = this.ctrlContainer.form;
    this.form.addControl("documentosLegales", this.documentosLegales); */
  }

/*   get adjuntosDocumentosLegales() {
    return this.documentosLegales.controls[
      "adjuntosDocumentosLegales"
    ] as FormArray;
  } */

  obtenerAdjuntos() {
    /* this.adjuntosDocumentosIngreso.clear(); */

    const adjunto =  this.adjuntosColaborador.filter(
      (x) => x.nombreSeccion == NombreSeccion.DocumentosLegales
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
         
          this.adjuntosDocumentosLegales.push(dataAdjunto);
        }
       
      });
    });
  }
/* 
  obtenerAdjuntos() {
    this.adjuntosDocumentosLegales.clear();

    this.adjuntosColaborador.forEach((element: AdjuntosColaborador) => {
      if (element.nombreSeccion == this.controlView) {
        let adjunto = this._formBuilder.group({
          nombre: [element.nombreAdjunto],
          archivos: [
            element.archivos ? element.archivos : null,
            element.esRequerido ? Validators.required : null,
          ],
        });

        this.adjuntosDocumentosLegales.push(adjunto);
      }
    });
  } */
}
