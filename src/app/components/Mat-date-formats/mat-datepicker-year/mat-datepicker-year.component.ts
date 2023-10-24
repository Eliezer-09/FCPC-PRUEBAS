import { Component, Output,EventEmitter,OnInit }                  from '@angular/core';
import * as _moment                           from 'moment';
import {default as _rollupMoment, Moment}     from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE}     from '@angular/material/core';
import {MatDatepicker}                        from '@angular/material/datepicker';
import { FormControl }                        from '@angular/forms';

const moment = _rollupMoment || _moment;
export const MY_FORMATS_MONTH_YEAR = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'vex-mat-datepicker-year',
  templateUrl: './mat-datepicker-year.component.html',
  styleUrls: ['./mat-datepicker-year.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_MONTH_YEAR},
    
  ],
})
export class MatDatepickerYearComponent implements OnInit {
  date_year = new FormControl(moment());
  input_date=moment();
  maxDate = new Date()
  @Output() date_year_value = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
    this.setYear(this.date_year.value);
  }
  
  setYear(normalizedYear: Moment, datepicker?: MatDatepicker<Moment>) {
    const ctrlValue = this.date_year.value!;
    ctrlValue?.year(normalizedYear.year());
    this.date_year.setValue(ctrlValue);
    datepicker?.close();
    this.input_date= normalizedYear;
    this.date_year_value.emit(normalizedYear);
  }

  setvalue(date){
    if(this.date_year.invalid){ 
      this.setYear(null);
    }else{
      this.setYear(date);
    }
  }
}
