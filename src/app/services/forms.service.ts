import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateTime } from 'luxon';
import moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor() { }

  expNotZero="^(?!^(0|0.0|0.00)$).*$";
  expWeb="^(http(s)?:\/\/.)?(www.)?([a-z0-9]+(.[a-z]{2,})){2}((.[a-z]{2,}){1})?$"
  expNumberInt="^[0-9]*$"
  expAlfanumeric="^([a-zA-Z0-9])*$"
  expTelefono="^(\\+)?[0-9]*$"
  expEmail="^[a-zA-Z0-9.-_-]{1,}@[a-zA-Z-]{2,}[.]{1}[a-zA-Z]{2,}((.[a-z]{2,}){1})?$";
  expDecimales="^[+0-9,.]{1,16}$"

  getErrorMessage(element,add_error_messaje?) {
    let error_message="";
    if(element.errors){
      let keys=Object.keys(element.errors)
      switch(keys[0]) { 
        case 'required': { 
          error_message='Ingresa el campo solicitado';
          break; 
        } 
        case  'min': { 
          error_message=add_error_messaje || 'El campo no debe ser menor a '+element.errors?.min.min;
          break; 
        } 
        case  'max': { 
          error_message=add_error_messaje || 'El campo no debe ser mayor a '+element.errors?.max.max;
          break; 
        } 
        case 'minlength': { 
            error_message=add_error_messaje || 'El campo no debe tener menos de '+element.errors?.minlength.requiredLength+' carácteres';
            break; 
        } 
        case 'maxlength': { 
          error_message=add_error_messaje || 'El campo no debe tener más de '+element.errors?.maxlength.requiredLength+' carácteres';
          break; 
      } 
        case 'matDatepickerMax':
          error_message='La fecha no debe ser mayor '+add_error_messaje;
          break; 
        case 'matDatepickerMin':
          error_message='La fecha no debe se menor '+add_error_messaje;
          break; 
        case 'matDatepickerFilter':
          error_message='La fecha se encuentra fuera del rango permitido.';
          break; 

        case 'especificError':
            error_message=element.errors.especificError;
            break; 

        case 'duplicateEmail':
          error_message=element.errors.duplicateEmail.message;
          break; 
        default: { 
          error_message=add_error_messaje || "Campo inválido";
          break; 
        } 
    } 
  }
  return error_message;
  }


  getFormValidation(form) {
    Object.keys(form.controls).forEach(key => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
         console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  } 

  //retorna el valor con los decimales deseados, si es necesario hace redondeo
  setNumberDecimal(valor:string,decimal:number=2) {
    return parseFloat(valor).toFixed(decimal);
  }

  //retorna los dias entre ambas fechas
  calculateDays365(fechaStart,fechaEnd){
    
    //calcular los dias entre ambas fechas y retornar en numero de dias
    let fecha1 = moment(fechaStart);
    let fecha2 = moment(fechaEnd);
    let dias = fecha2.diff(fecha1, 'days');
    //convertir dias a string
    let diasString = dias.toString();
    return diasString;

  }

  //retorna los dias entre ambas fechas considerando 360 dias al año.
  calculateDays360(start: Date, end: Date){
    if(!start || !end) return;
    start=new Date(start);
    end=new Date(end)
    let days = (end.getFullYear() - start.getFullYear()) * 360
        + (end.getMonth() - start.getMonth()) * 30
        + (end.getDate() - start.getDate());
    days=parseInt(this.setNumberDecimal(days/30+'',0))*30;
    return days;
  }

  //retorna un string con el formato ajustado
  formatDate(date:Date,format:string){
    return formatDate(date,format, 'en-US');
  }


  //retorna la fecha que sera luego de aumentar los dias
  AddDaysToDates(date:Date,days:number){
    let previusDate=new Date(date);
    let sumDays= days * 86400 //dias en segundos
    let newDate = new Date(previusDate.setSeconds(sumDays))
    return newDate;
  }

  //set time for dates
  setLocalTime(fecha){
    fecha=new Date(fecha)
    fecha.setHours(new Date().getHours())
    fecha.setMinutes(new Date().getMinutes())
    fecha.setSeconds(new Date().getSeconds())
    return fecha
  }

}
