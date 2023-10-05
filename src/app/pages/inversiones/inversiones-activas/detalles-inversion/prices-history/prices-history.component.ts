import { ChangeDetectorRef, Component, Input, OnInit, ViewChild }         from "@angular/core";
import {ChartComponent,ApexAxisChartSeries,ApexChart,ApexXAxis,ApexDataLabels,ApexTitleSubtitle,
        ApexStroke, ApexGrid,ApexFill,ApexMarkers,ApexYAxis,ApexTooltip}  from "ng-apexcharts";
import { InversionesService }                                             from "../../../inversiones.service";
import { TableColumn }                                                    from "src/@vex/interfaces/table-column.interface";
import {  OperationResultVector, VectorCoordenadas, VectorInversion }     from "src/app/model/models";
import { MatTableDataSource }                                             from "@angular/material/table";
import { PageEvent }                                                      from "@angular/material/paginator";
import { map }                                                            from 'rxjs/operators';
import { FormsService }                                                   from "src/app/services/forms.service";
import { iconify } from "src/static-data/icons";
import { VectoresVariableConfigure, VectorFijoConfigure } from "src/static-data/configure-table/configure-table-vector";

const ELEMENT_DATA: any[] = [{ result: "" }];

 export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
}; 

@Component({
  selector: "vex-prices-history",
  templateUrl: "./prices-history.component.html",
  styleUrls: ["./prices-history.component.scss"],
})
export class PricesHistoryComponent implements OnInit {

  pageSize = 10;
  infoMessage = "No se ha encontrado Vectores relacionados";
  activeOptionButton = "all";
  pageEvent: PageEvent;

  dataFondoSource = new MatTableDataSource<OperationResultVector>(ELEMENT_DATA);
  currentDate=new Date();

  routers: any[] = [];
  data:any[]=[];

  icroundLineAxis     = iconify.icroundLineAxis;
  inversionVectores: OperationResultVector = {};

  @Input() idVector: string ;
  @Input() emisor: string ;
  @Input() loadGraphic: boolean=false;
  @Input() tipoRenta: string ;
  @Input() idBolsaValores: string ;
  isLoading: boolean = false;
  termVector: string;



  tableColumnsVectorFijo: TableColumn<VectorInversion>[] = VectorFijoConfigure;
  tableColumnsVectorVariable: TableColumn<VectorInversion>[] = VectoresVariableConfigure;
  tableColumns: TableColumn<VectorInversion>[] = this.tableColumnsVectorFijo;
  updateOptionsData = {
    "6m": {
      xaxis: this.calculatePreviusSexMonths()
    },
    "1y": {
      xaxis: this.calculateCurrentYear()
    },
    "1yd": {
      xaxis: this.calculatePreviusYear()
    },
    all: {
      xaxis: {
        min: undefined,
        max: undefined
      }
    }
  };

  @ViewChild("chart", { static: false }) chart: ChartComponent;
  chartOptions: Partial<ChartOptions>= {
    series: [
      {
        name: "Precio",
        data: this.data
      },
    ],

    dataLabels: {
      enabled: false,
    },
  
    chart: {
      height: 380,
      width: "100%",
      type: "line",
    },
    stroke: {
      width: 7,
      curve: "straight"
    },
     xaxis: {
       type: "datetime",
       tickAmount: 12,
       labels: {
      hideOverlappingLabels: true,
      datetimeFormatter: {
         day: 'MMM yyyy',
      },
      },
    },
    tooltip: {
      followCursor: false,
      theme: "dark",
      x: {
        show: false,
        format: "MMM yyyy"
      },
      marker: {
        show: false
      },

    },
    title: {
      text: "Vector de Bolsa de ",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
 
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#FDD835"],
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0,  100],
      },
    },
    markers: {
      size: 4,
      colors: ["#FFA41B"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
  };


  initChart(): void {
   
     this.data=[
      {x: "Jan 2019",y:4},
      {x:"Jul 2020",y:30},
      {x:"Aug 2020",y:20},
      {x:"Sep 2020",y:10},
      {x:"Oct 2020",y:20},
      {x:"Nov 2020",y:30},
      {x:"Dec 2020",y:40},
      {x:"Feb 2021",y:60},
      {x:"Mar 2021",y:70},
      {x:"Apr 2021",y:80},
      {x:"May 2021",y:90},
      {x:"Jun 2021",y:100},
      {x:"Jul 2021",y:110},
      {x:"Aug 2022",y:70},
      {x:"Sep 2022",y:120},
      {x:"Nov 2022",y:130},
      {x:"Dec 2022",y:130}
    ] 
 
  }


  constructor(private inversionService: InversionesService,
              private changeDetector: ChangeDetectorRef, 
              private formsService:   FormsService) {}

  ngOnInit(): void {
    if(this.tipoRenta=="F"){
      this.termVector=this.idVector;
    }else{
      this.tableColumns=this.tableColumnsVectorVariable;
      this.termVector=this.emisor;
    }
    this.serviceInversionesVectorCoordenada(this.tipoRenta,this.idBolsaValores,this.termVector)
    this.servicesInversionesVectorById(this.tipoRenta,this.idBolsaValores,this.termVector,1,this.pageSize);
  }


  updateOptions(option: any='all'): void {
    this.activeOptionButton = option;
    this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
  }

  calculateCurrentYear(){
    const year=this.currentDate.getFullYear();
    return {
      min: new Date("Jan "+year).getTime(),
      max: new Date("Dec "+year).getTime()
    }
  }

  calculatePreviusYear(){
    const year=this.currentDate.getFullYear()-1;
    return {
      min: new Date("Jan "+year).getTime(),
      max: new Date("Dec "+year).getTime()
    }
  }

  calculatePreviusSexMonths(){
    let sixMonthToday=-182.5;
    const dateAfterDay=this.formsService.AddDaysToDates(this.currentDate,sixMonthToday); 
    return {
      min: dateAfterDay.getTime(),
      max: this.currentDate.getTime(),
    }
  
  }

  servicesInversionesVectorById(tipoRenta,idBolsaValores,term,page,pageSize){
    this.inversionService.getVectorById(tipoRenta,idBolsaValores,term,page,pageSize).pipe(
      map((vector:OperationResultVector) => {
        this.isLoading = false
        this.inversionVectores = vector
        this.dataFondoSource.data = vector["result"];
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }

  onPaginateChange(event: PageEvent) {
    this.isLoading = true;
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.servicesInversionesVectorById(this.tipoRenta,this.idBolsaValores,this.termVector,page,size);
  }

  serviceInversionesVectorCoordenada(tipoRenta,idBolsaValores,term){
    this.inversionService.getCoordenadasVector(tipoRenta,idBolsaValores,term).pipe(
      map((coordenada:VectorCoordenadas) => {
        this.data = coordenada["result"];
        this.changeDetector.detectChanges()
        this.chartOptions.series[0].data=this.data
      })
    ).subscribe();
  }

}
