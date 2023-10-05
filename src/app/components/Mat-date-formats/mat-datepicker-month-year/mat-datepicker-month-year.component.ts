import { Component, Output,EventEmitter, OnInit, Input }                  from '@angular/core';
import * as _moment                           from 'moment';
import {default as _rollupMoment, Moment}     from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE}     from '@angular/material/core';
import {MatDatepicker}                        from '@angular/material/datepicker';
import { FormControl }                        from '@angular/forms';
import { formatDate }                         from '@angular/common';
const moment = _rollupMoment || _moment;
export const MY_FORMATS_MONTH_YEAR = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM, YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'vex-mat-datepicker-month-year',
  templateUrl: './mat-datepicker-month-year.component.html',
  styleUrls: ['./mat-datepicker-month-year.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_MONTH_YEAR},
    
  ],
})
export class MatDatepickerMonthYearComponent implements OnInit   {
  date_month_year = new FormControl(moment());
  @Input() input_date=moment();
  @Input() maxDate = new Date()
  @Input() minDate:Date;

  @Output() date_month_year_value = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
    this.setMonthAndYear(this.input_date);
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker?: MatDatepicker<Moment>) {
    const ctrlValue = this.date_month_year.value!;
    ctrlValue?.month(normalizedMonthAndYear.month());
    ctrlValue?.year(normalizedMonthAndYear.year());
    this.date_month_year.setValue(ctrlValue);
    datepicker?.close();
    this.input_date= normalizedMonthAndYear;
    this.date_month_year_value.emit(normalizedMonthAndYear);
  }

  setvalue(date){
    if(this.date_month_year.invalid){ 
      this.setMonthAndYear(null);
    }else{
      this.setMonthAndYear(date);
    }
  }
}
