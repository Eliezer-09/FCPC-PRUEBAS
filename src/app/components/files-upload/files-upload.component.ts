import { Component, Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { ToastAlertComponent } from '../alerts/toast-alert/toast-alert.component';
@Component({
  selector: 'vex-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss']
})
export class FilesUploadComponent {
  @Input() animation: boolean = true;
  @Input() multiple: boolean  = false;
  @Input() disabled: boolean  = false;
  @Input() classStyleFilesForm= ["contentBox"]
  @Input() classStyleFilesComponent= ["content"]
  @Input() limitFiles=10;
  //entrada de extensiones validas ["pdf","xml","xdocx","xls","png","jpge","jpg"]
  @Input() extensions: Array<String>=[]
  uploadedFilesList: Array<File> = [];
  filesControls = new FormControl(null, FileUploadValidators.filesLimit(this.limitFiles));

  public formFiles = new FormGroup({
      files: this.filesControls
  });

  constructor() {}


  toggleMultiple() {
      this.multiple = !this.multiple;
  }

  clear(): void {
      this.filesControls.setValue([]);
  }
  checkExtension(){
    if(this.filesControls.value.length>0 && this.extensions.length>0){
      let file=this.uploadedFilesList[0]
      let name=file.name;
      let extension=name.split(".")
      if(extension.length>1){
        let ext=extension[extension.length-1].toLowerCase()
        if(!this.extensions.includes(ext)){
          this.uploadedFilesList=[];
          this.filesControls.setValue([]);
          try{ new ToastAlertComponent("info", "Extensión no permitida");}finally{ /*  */ }
        }
      }
     
    }
  }

}
