import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentesService } from 'src/app/services/componentes.service';
import { ParticipesService } from '../../participes.service';
import { createMask } from '@ngneat/input-mask';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'vex-perfil-economico',
  templateUrl: './perfil-economico.component.html',
  styleUrls: ['./perfil-economico.component.scss']
})
export class PerfilEconomicoComponent implements OnInit {

  perfilEconomicoForm = this.fb.group({
    salarioFijo: [0],
    salarioVariable: [0],
    otrosIngresos: [0],
    totalIngresos: [0],
    gastosMensuales: [0],
    totalBienes: [0],
    totalVehiculos: [0],
    totalOtrosActivos: [0],
    totalActivos: [0],
    totalDeudas: [0],
    patrimonioNeto: [0],
    salarioNeto: [0],
  });

  @Input() idParticipe:any;
  datosPerfilEconomico:any;
  simboloMoneda: string     ='$';

  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: false,
    placeholder: '0',
  });


  constructor(
    private fb: FormBuilder,
    private dataComponente: ComponentesService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private participesService: ParticipesService,
    private formsService: FormsService) { }

  ngOnInit(): void {
    this.getPerfilEconomico(this.idParticipe)
  }

  clickActualizar(){
     if(this.perfilEconomicoForm.valid){
      this.spinner.show();
      this.participesService.postPerfilEconomicoParticipe( this.idParticipe, this.perfilEconomicoForm.value).subscribe(
          (res) => {
            this.spinner.hide();
            this.dataComponente.alerta(
              "success",
              "Perfil económico actualizado"
            );
          },
          (error) => {
            this.spinner.hide();
            this.dataComponente.errorHandler(error);
          }
        );

  }else {
      this.dataComponente.alerta(
        "info",
        "Debes completar los campos solicitados"
      );
    }

  }
  
  getPerfilEconomico(idParticipe){
    this.participesService.getPerfilEconomicoParticipe( idParticipe).subscribe(
      (perfilEconomico) => {
        this.spinner.hide();
        this.datosPerfilEconomico=perfilEconomico["result"]
        this.perfilEconomicoForm.patchValue(this.datosPerfilEconomico)
      },
      (error) => {
        this.spinner.hide();
        this.dataComponente.errorHandler(error);
      }
    );
  }

  setTwoNumberDecimal(form,parameter) {
    let value = form.value[parameter]
    if (value!=null && value!=undefined) {
      let parseValue =value
      if (typeof value!="number") {
        parseValue = value.replaceAll(',', '')
      }
      form.value[parameter] = parseFloat(parseFloat(parseValue + '').toFixed(2));
      return form.value[parameter]
    }
  }

  calcularTotalIngresos(){
    let salarioFijo=this.perfilEconomicoForm.value.salarioFijo
    salarioFijo=salarioFijo? this.setTwoNumberDecimal(this.perfilEconomicoForm,"salarioFijo"):0;
    let salarioVariable=this.perfilEconomicoForm.value.salarioVariable
    salarioVariable=salarioVariable? this.setTwoNumberDecimal(this.perfilEconomicoForm,"salarioVariable"):0;
    let otrosIngresos=this.perfilEconomicoForm.value.otrosIngresos
    otrosIngresos=otrosIngresos? this.setTwoNumberDecimal(this.perfilEconomicoForm,"otrosIngresos"):0;
    let totalIngresos = salarioFijo + salarioVariable + otrosIngresos
    totalIngresos=parseFloat(parseFloat(totalIngresos + '').toFixed(2));
    this.perfilEconomicoForm.controls["totalIngresos"].setValue(totalIngresos)
    this.perfilEconomicoForm.controls["salarioFijo"].setValue(salarioFijo)
    this.perfilEconomicoForm.controls["salarioVariable"].setValue(salarioVariable)
    this.perfilEconomicoForm.controls["otrosIngresos"].setValue(otrosIngresos)
    this.calcularSalarioNeto()
  }

  calcularSalarioNeto(){
    let totalIngresos=this.perfilEconomicoForm.value.totalIngresos
    totalIngresos=totalIngresos? this.setTwoNumberDecimal(this.perfilEconomicoForm,"totalIngresos"):0;
    let gastosMensuales=this.perfilEconomicoForm.value.gastosMensuales
    gastosMensuales=gastosMensuales? this.setTwoNumberDecimal(this.perfilEconomicoForm,"gastosMensuales"):0;
    let salarioNeto = totalIngresos - gastosMensuales
    salarioNeto=parseFloat(parseFloat(salarioNeto + '').toFixed(2));
    this.perfilEconomicoForm.controls["salarioNeto"].setValue(salarioNeto)
    this.perfilEconomicoForm.controls["gastosMensuales"].setValue(gastosMensuales)
 
  }


  calcularTotalActivos(){
    let totalBienes=this.perfilEconomicoForm.value.totalBienes
    totalBienes=totalBienes? this.setTwoNumberDecimal(this.perfilEconomicoForm,"totalBienes"):0;
    let totalVehiculos=this.perfilEconomicoForm.value.totalVehiculos
    totalVehiculos=totalVehiculos? this.setTwoNumberDecimal(this.perfilEconomicoForm,"totalVehiculos"):0;
    let totalOtrosActivos=this.perfilEconomicoForm.value.totalOtrosActivos
    totalOtrosActivos=totalOtrosActivos? this.setTwoNumberDecimal(this.perfilEconomicoForm,"totalOtrosActivos"):0;
    let totalActivos = totalBienes + totalVehiculos + totalOtrosActivos
    totalActivos=parseFloat(parseFloat(totalActivos + '').toFixed(2));
    this.perfilEconomicoForm.controls["totalActivos"].setValue(totalActivos)
    this.perfilEconomicoForm.controls["totalBienes"].setValue(totalBienes)
    this.perfilEconomicoForm.controls["totalVehiculos"].setValue(totalVehiculos)
    this.perfilEconomicoForm.controls["totalOtrosActivos"].setValue(totalOtrosActivos)
    this.calcularPatrimonioNeto()
  }

  calcularPatrimonioNeto(){
    let totalActivos=this.perfilEconomicoForm.value.totalActivos
    totalActivos=totalActivos?this.setTwoNumberDecimal(this.perfilEconomicoForm,"totalActivos"):0;
    let totalDeudas=this.perfilEconomicoForm.value.totalDeudas
    totalDeudas=totalDeudas? this.setTwoNumberDecimal(this.perfilEconomicoForm,"totalDeudas"):0;
    let patrimonioNeto = totalActivos - totalDeudas
    patrimonioNeto= parseFloat(parseFloat(patrimonioNeto + '').toFixed(2));
    this.perfilEconomicoForm.controls["patrimonioNeto"].setValue(patrimonioNeto)
    this.perfilEconomicoForm.controls["totalDeudas"].setValue(totalDeudas)
  }


  getErrorMessage(element, add_error_messaje?) {
    return this.formsService.getErrorMessage(element, add_error_messaje);
  }

}
