import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, TreeNode } from 'primeng/api';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { CuentaContablePTree } from 'src/app/model/models';
import { iconify } from 'src/static-data/icons';
import Swal from 'sweetalert2';
import { ContabilidadService } from '../../services/contabilidad.service';
import { ModalAgregarCuentaComponent } from './agregar-cuenta/agregar-cuenta.component';

@Component({
  selector: 'vex-cuenta-contable',
  templateUrl: './cuenta-contable.component.html',
  styleUrls: ['./cuenta-contable.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    stagger80ms,
  ],
})
export class CuentaContableComponent implements OnInit {
  cuentas: TreeNode[];
    selectedFile: TreeNode;
    isLoading:boolean=false;
    items: MenuItem[] = [
      {label: 'Agregar', icon: 'pi pi-plus', command: (event) => this.addCuenta(this.selectedFile)},
      {label: 'Editar', icon: 'pi pi-pencil', command: (event) => this.editCuenta(this.selectedFile)},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (event) => this.anularCuentaAlert(this.selectedFile)}
    ];
    icroundAccountBalance      = iconify.icroundAccountBalance ;
    layoutCtrl = new FormControl('boxed');
    constructor(  private contabilidadService: ContabilidadService,
      private spinner: NgxSpinnerService,
      private dialog : MatDialog) { }

    ngOnInit() {
      this.loadFirstContablesTree() 
    }


    reeplaceMenu(file) {
      if(file.countChildren>0){
        this.items = [
          {label: 'Agregar', icon: 'pi pi-plus', command: (event) => this.addCuenta(this.selectedFile)},
          {label: 'Editar', icon: 'pi pi-pencil', command: (event) => this.editCuenta(this.selectedFile)},
      ];
      }else{   this.items = [
        {label: 'Agregar', icon: 'pi pi-plus', command: (event) => this.addCuenta(this.selectedFile)},
        {label: 'Editar', icon: 'pi pi-pencil', command: (event) => this.editCuenta(this.selectedFile)},
        {label: 'Eliminar', icon: 'pi pi-trash', command: (event) => this.anularCuentaAlert(this.selectedFile)}
    ];

      }
    }
    
    addCuenta(cuenta) {
      let detalle={
        titulo:"Agregar Cuenta",
        data: cuenta,
        edit: false
      }
      this.openView(detalle)
    }

    editCuenta(cuenta){
       this.spinner.show();
      this.contabilidadService.getCuentasContableById(cuenta.idCuentaContable).subscribe(res=>{
        let cuenta=res["result"]
       
        let detalle={
          titulo:"Editar Cuenta",
          data: cuenta,
          edit: true
        }
        this.openView(detalle)
        
        this.spinner.hide();
      }, error => {
        try{new ToastAlertComponent("error", error.error.message)
      }finally{ this.spinner.hide(); }
      })  
    }


    deleteCuenta(idCuenta){
      this.spinner.show();
      this.contabilidadService.deleteCuentasContable(idCuenta).subscribe(res=>{
        try{new ToastAlertComponent("success", "Se ha eliminado la cuenta correctamente")
      }finally{ this.spinner.hide(); }
      this.loadContablesTree(true)
      }, error => {
        try{new ToastAlertComponent("error", error.error.message)
      }finally{ this.spinner.hide(); }
      }) 
    }
    anularCuentaAlert(cuenta){
      const title= `¿Estás seguro que deseas anular la cuenta contable?`;
      const html = `<p>Perderás los datos y cuentas relacionados</p>
                    <br/>
                    <div style="text-align: initial">
                    <p style="margin: 0rem 1rem 0.5rem 8%"><b>ID Cuenta:&emsp;&emsp;&nbsp;</b>${cuenta.data} </p>
                    <p style="margin: 0rem 1rem 0.5rem 8%"><b>Código:&emsp;&emsp;&nbsp;&nbsp;&emsp;</b>${cuenta.label}</p>
                    <p style="margin: 0rem 1rem 0.5rem 8%"><b>Descripción:&emsp;</b>${cuenta.codigo}</p>
                    </div>`;
      this.dialogAlert(title,html,cuenta.data);
    }
    
    dialogAlert(title:string,html:any,idCuentaContable:any){
      Swal.fire({
        icon: "warning",
        title: title,
        html: html,
        showCancelButton:true,
        cancelButtonText: "Cancelar",
        confirmButtonText: 'Confirmar',
        showLoaderOnConfirm: true,
        reverseButtons: true,
        preConfirm: (result) => {
          if(result){
            this.deleteCuenta(idCuentaContable);   
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
    }

    collapseAll(){
      this.isLoading=true;
      this.cuentas.forEach( node => {
          this.expandRecursive(node, false);
          
      } );
      this.isLoading=false;
  }

  async expandAll(){
    this.spinner.show();
    await this.expand(this.cuentas, async (num: any) => {
      await this.delay(50);
    });
  }



  async expand(cuentas, callback: any) {
    for (let index = 0; index < cuentas.length; index++) {
      const node = cuentas[index];
      await  callback(this.expandRecursive(node, true));
    } 
    this.spinner.hide();
  }

  async expandRecursive(node:TreeNode, isExpand:boolean){
    node.expanded = isExpand;
    if (node.children){
        node.children.forEach( async childNode => {
          await this.expandRecursive(childNode, isExpand);
        } ); 
    }
  }


delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



getData(cuentas) {
  let cuentasSelect=JSON.parse(sessionStorage.getItem('cuentasContablesCatalog'))
  if(cuentasSelect){
    cuentas=cuentasSelect
    return cuentas;
  }
 
  cuentas=cuentas.map(cuentas => new CuentaContablePTree(cuentas));
  sessionStorage.setItem("cuentasContablesCatalog",JSON.stringify(cuentas))
  return cuentas
} 

loadFirstContablesTree(update=false){
  let cuentas=sessionStorage.getItem('cuentasContables')
  if(cuentas){
   this.cuentas=this.getData(JSON.parse(sessionStorage.getItem('cuentasContables')))
   return;
  }  


  this.spinner.show();
  this.contabilidadService.getCuentasContablesTree(update).subscribe(res=>{
   
    this.cuentas=this.getData(res["result"])
    sessionStorage.setItem("cuentasContables",JSON.stringify(res["result"]))
    this.spinner.hide();
  }, error => {
    try{new ToastAlertComponent("error", error.error.message)
  }finally{ this.spinner.hide(); }
  }) 
}


loadContablesTree(update=false){
  this.spinner.show();
  this.contabilidadService.getCuentasContablesTree(update).subscribe(res=>{
    this.cuentas=this.getData(res["result"])
    sessionStorage.setItem("cuentasContables",JSON.stringify(res["result"]))
    this.spinner.hide();
  }, error => {
    try{new ToastAlertComponent("error", error.error.message)
  }finally{ this.spinner.hide(); }
  }) 
}

openView(detalle?) {

   const dialogRef = this.dialog.open(ModalAgregarCuentaComponent, {
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: 'full-screen-modal',
    data: detalle || null
  })
  
  dialogRef
      .afterClosed()
      .subscribe(result => {
      if(result){
        if(result.edit){
         this.updateCuentaContable(result.formData)
        }else{
          this.saveCuentaContable(result.formData)
        }
       
      }  
  }); 
}



updateCuentaContable(data){
  this.spinner.show();
  this.contabilidadService.putCuentasContable(data).subscribe(res=>{
    this.loadContablesTree(true)
  }, error => {
    try{new ToastAlertComponent("error", error.error.message)
  }finally{ this.spinner.hide(); }
  }) 
}

saveCuentaContable(data){
  this.spinner.show();
  this.contabilidadService.postCuentasContables(data).subscribe(res=>{
    this.loadContablesTree(true)
  }, error => {
    try{new ToastAlertComponent("error", error.error.message)
  }finally{ this.spinner.hide(); }
  }) 
}


}
