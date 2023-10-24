import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import icVerticalSplit from '@iconify/icons-ic/twotone-vertical-split';
import icVisiblity from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icDescription from '@iconify/icons-ic/twotone-description';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { stagger80ms } from '../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import { Participe } from '../../../model/models';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { takeUntil, take, filter } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { SignaturePad } from 'angular2-signaturepad';
import { Capacitor, Plugins } from '@capacitor/core';
import * as WebVPPlugin from 'capacitor-video-player';
const { CapacitorVideoPlayer } = Plugins;
import Swal from 'sweetalert2';
import { NGXLogger } from 'ngx-logger';


@Component({
  selector: 'vex-participe-adherir',
  templateUrl: './participe-adherir.component.html',
  styleUrls: ['./participe-adherir.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class ParticipeAdherirComponent implements OnInit,AfterViewInit, OnDestroy  {

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('video') captureElement: ElementRef;


  mediaRecorder:  any
  videoPlayer: any;
  isRecording = false;
  videos = [];

  title = "Angularvideo"

  idx = "clip1"

  config: any;
  player: any;
  plugin: any;

  datosPersonales: FormGroup;
  datosContacto: FormGroup;
  datosdelParticipe: FormGroup;
  bancarios: FormGroup;
  cedula: FormGroup
  firma: FormGroup;
  video: FormGroup;


  displayedColumns = ["institucion", "tipocuenta", "numerocuenta"];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20];
  customers2: any[];
  subject2$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<any[]> = this.subject2$.asObservable();
  dataFondoSource: MatTableDataSource<any> | null;

  bankCtrl: FormControl = new FormControl();
  bankFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);



  verticalDatosPersonales: FormGroup;
  verticalDatosContacto: FormGroup;
  verticalDatosdelParticipe: FormGroup;
  verticalBancarios: FormGroup;
  verticalCedula: FormGroup;
  verticalFirma: FormGroup;
  verticalVideo: FormGroup;

  phonePrefixOptions = ['+1', '+27', '+44', '+49', '+61', '+91'];

  passwordInputType = 'password';

  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;

  referenciaBancaria = [];

  nombreBanco;
  tipoCuenta;
  isLoading = true;


  participe: Participe = {};
  protected _onDestroy = new Subject<void>();
  
  idProvincia;
  idCuidad;
  base64;

  //VARIABLES CATALOGO CON DATO
  identificaciones:any = [];
  generos:any = [];
  estadosCivil:any = []
  nacionalidades:any = [];
  nacionalidadesData:any = [];

  provincias: any = [];
  ciudades: any = [];


  nivelEstudio: any = [];
  nivelIngreso: any = [];
  nivelGrado: any = [];

  institucionesFinan: any = [];
  tiposCuentas: any = [];


  infoBancariosTabla:any = [];
  infoBancariosMapa:any = [];
  infoBancarios:any = {
    idEntidadFinanciera:"", 
    numeroCuenta:"",
    idTipoCuenta:"",
  }
  

  constructor( 
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private elementRef: ElementRef,
    private logger: NGXLogger
    ) { 
    this.player = false;
  }

  public capture() {
    var context = this.elementRef.nativeElement.getContext("2d").drawImage(this.elementRef.nativeElement, 0, 0, 640, 480);
    // this.videos.push(this.canvas.nativeElement.toDataURL("image/png"));
  }

    // latest snapshot
    public webcamImage = null;
    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    triggerSnapshot(): void {
    this.trigger.next();
    }
    handleImage(webcamImage): void {
    this.logger.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    }
  
    public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
    }

  public handleInitError(error): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      this.logger.warn("Camera access was not allowed by user!");
    }
  }

  async recordVideo() {

    // this.base64 = ""
    // this.captureElement.nativeElement.muted = "muted"

    // // Create a stream of video capturing
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   video: {
    //     facingMode: 'user'
    //   },
    //   audio: {
    //     echoCancellation: true,
    //     autoGainControl: true,
    //   }  
    // });

    // this.captureElement.nativeElement.srcObject = stream;

    // // Show the stream inside our video object
    // this.captureElement.nativeElement.srcObject = stream;
    // var options = {mimeType: 'video/webm'};
    // // this.mediaRecorder = new MediaRecorder(stream, options);
    // let chunks = [];

    // // Store chunks of recorded video
    // this.mediaRecorder.ondataavailable = (event) => {
    //   if (event.data && event.data.size > 0) {
    //     chunks.push(event.data)
    //   }
    // }

    // // Store the video on stop
    // this.mediaRecorder.onstop = async (event) => {
    //   const videoBuffer = new Blob(chunks, { type: 'video/webm' });
    //   //Store the video
    //   // reload the list
    // }

  }

  stopRecord() {
    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.captureElement.nativeElement.srcObject = null;
    this.isRecording = false;
  }

  async play(video) {

  }


  protected filterBanks() {
    if (!this.nacionalidades) {
      return;
    }
    
    // get the search keyword
    let search = this.bankFilterCtrl.value;

    if (search) {
      this.nacionalidades = this.nacionalidadesData
      search = search.toLowerCase();
      this.nacionalidades = this.nacionalidades.filter(pais => pais.nacionalidad.toLowerCase().indexOf(search) > -1)
    } else {

    }
  }

  ngOnInit() {

    this.bankFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks();
    });

    
    this.dataFondoSource = new MatTableDataSource();
    this.infoBancariosMapa = [];
    this.infoBancariosTabla = [];
    /**
     * Vertical Stepper
     * @type {FormGroup}
     */
    this.datosPersonales = this.fb.group({
      nombre:  ['', Validators.required],
      apellido:  ['', Validators.required],
      identificacion:  ['', Validators.required],
      fechanacimiento:  ['', Validators.required],
      expedicioncedula:  ['', Validators.required],
      genero: [''],
      estadoCivil: [''],
      nacionalidad: [''],
    });

    this.datosContacto = this.fb.group({
      direccion: ['', Validators.required],
      referencia: ['', Validators.required],
      correo1: ['', Validators.required],
      correo2: [null],
      telefono1: ['', Validators.required],
      telefono2: [null],
      celular: ['', Validators.required],
    });

    this.datosdelParticipe = this.fb.group({
      nivelEstudio: [],
      nivelIngreso: [],
      grado: [],
      aporteAdicional: ['', Validators.required],
      codigoUniformado: ['', Validators.required],
      fechaCuerpoVigilante: [],
    });

    this.bancarios = this.fb.group({
      nivelEstudio: [],
      nivelIngreso: [],
      numeroCuenta: ['', Validators.required],
    });

    this.cedula = this.fb.group({
      nivelEstudio: [],
      nivelIngreso: [],
      numeroCuenta: [],
    });

    this.firma = this.fb.group({
      nivelEstudio: [],
      nivelIngreso: [],
      numeroCuenta: [],
    });

    this.video = this.fb.group({
      nivelEstudio: [],
      nivelIngreso: [],
      numeroCuenta: [],
    });

    this.datosCatalogo();
  }

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 700,
    'canvasHeight': 300
  };

  ngAfterViewInit() {
    this.setInitialValue();
    this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    this.changeDetectorRefs.detectChanges();
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    this.base64 = this.signaturePad.toDataURL()
  }


  limpiar(){
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  irVideo(){
    const data = {
      tipoAdjunto: "firma",
      adjunto: this.base64
    }
    this.dataService.archivoParticipe(this.participe["idParticipe"], data).subscribe(result=>{
    })
    this.router.navigate(["/video", this.participe])
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  agregarCuenta() {

    const infoGuardar:any = {
      idEntidadFinanciera: this.infoBancarios.idEntidadFinanciera.idEntidadFinanciera, 
      idTipoCuenta: this.infoBancarios.idTipoCuenta.idTipoCuenta,
      numeroCuenta: this.infoBancarios.numeroCuenta,
    }

    const infoMostrar = {
      idEntidadFinanciera: this.infoBancarios.idEntidadFinanciera.descripcion, 
      idTipoCuenta: this.infoBancarios.idTipoCuenta.descripcion,
      numeroCuenta: this.infoBancarios.numeroCuenta,
    }

    this.infoBancariosTabla.push(infoMostrar)
    this.infoBancariosMapa.push(infoGuardar);

    this.participe.referenciasBancarias = this.infoBancariosMapa;

    this.subject2$.next(this.infoBancariosTabla);
    this.data2$.pipe(
      filter<any[]>(Boolean)
    ).subscribe(customers => {
      this.customers2 = customers;
      this.dataFondoSource.data = customers;
    });
  }

  // IDENTIFICACION INGRESA, TRAER DATOS DEL USUARIO
  change(event) {
    if(event) {
      if (event.length == 10 || event.length == 13) {
        this.dataService.getParticipeByIdentificacion(event).subscribe( res => {
          if (res["result"].estado == "Aprobado") {
            Swal.fire({
              icon: 'info',
              text: 'El participe ya es activo en el FONDO DE CENSATIA!',
            })
          } else  if (res["result"].estado == "Pendiente") {
            Swal.fire({
              icon: 'info',
              text: 'El participe se encuentra en proceso de adhesión!',
            })
          } else {
            this.participe = res["result"]
            this.ngAfterViewInit();
          }
        });
      }
    }
  }

  datosCatalogo() {
    // TRAER LOS TIPOS DE IDENTIFICACIONES
    this.dataService.getTiposIdentificaciones().subscribe( tipo => {
      this.identificaciones = tipo
    });

    // TRAER LOS TIPOS DE GENERO
    this.dataService.getTiposGenero().subscribe( gen => {
      this.generos = gen
    });

    // TRAER LOS TIPOS DE ESTADO CIVIL
    this.dataService.getEstadosCivil().subscribe( estado => {
      this.estadosCivil = estado
      this.filtro(this.estadosCivil);
    });

    // TRAER LOS TIPOS DE NACIONALIDADES
    this.dataService.getNacionalidades().subscribe( nacio => {
      this.nacionalidades = nacio
      this.nacionalidadesData = nacio
    });

    // NIVEL DE ESTUIDO
    this.dataService.getNivelEstudio().subscribe( nivel => {
      this.nivelEstudio = nivel;
    });

    // NIVEL DE INGRESO
    this.dataService.getNivelIngreso().subscribe( nivel => {
      this.nivelIngreso = nivel;
    });

    // SELECCIONE EL GRADO
    this.dataService.getGrado().subscribe( grado => {
      this.nivelGrado = grado;
    });

    // TRAER LAS INSTITUCIONES FINANCIERAS
    this.dataService.getInstitucionesFinancieras().subscribe( nacio => {
      this.institucionesFinan = nacio
    });
    
    // TRAER LOS TIPOS DE CUENTAS
    this.dataService.getTipsoCuentas().subscribe( nacio => {
      this.tiposCuentas = nacio;
    });

  }

  //TRAE LAS PROVINCIAS SEGUN SU PAIS
  seleccionarPais(event) {
    this.participe.idNacionalidad = event
    // PROVINCIAS
    this.dataService.getProvincias(event).subscribe( prov => {
      this.provincias = prov;
    });
  }

  //TRAE LAS ciudades SEGUN LA PROVINCIA
  seleccionarProvincia(event) {
    // ciudades
    this.dataService.getCiudades(event).subscribe( cuidad => {
      this.ciudades = cuidad;
    });
  }
  

  filtro (arr) {
    // this.bankCtrl.setValue(arr);
    // // load the initial bank list
    // this.filteredBanks.next(arr.slice());

    // // listen for search field value changes
    // this.bankFilterCtrl.valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   this.filterBanks(arr);
    // });
  }

  protected setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

}
