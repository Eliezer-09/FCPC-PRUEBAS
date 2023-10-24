import { Component, Inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "vex-dialog-copy-text",
  templateUrl: "./dialog-copy-text.component.html",
  styleUrls: ["./dialog-copy-text.component.scss"],
})
export class DialogCopyTextComponent implements OnInit {
 
  form: FormGroup;
  title:string="";
  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogCopyTextComponent>,
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      text: new FormControl(this.data.text)
    });
    this.title=this.data.title;
  }

  confirm(){
    this.dialogRef.close(this.form.value.text);
  }
  
}
