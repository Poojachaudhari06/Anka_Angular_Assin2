import { Component, Inject, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import{FormGroup,FormBuilder,Validators} from '@angular/forms';
import{ApiService} from '../services/api.service';
import { MatDialogRef ,MAT_DIALOG_DATA} from '@angular/material/dialog';

interface Role {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  
  employeeform!:FormGroup;
  actionBtn:string ="Add";
  constructor(private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData:any,
    private api:ApiService ,private dialogRef:MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.employeeform=this.formBuilder.group({
      firstName:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')])],
      lastName:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')])],
      gender:['',Validators.required],
      dob:['',Validators.compose([Validators.required,Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)])],
      select_role:['',Validators.required],
    })
 

 if(this.editData){
  this.actionBtn="Update"
  this.employeeform.controls['firstName'].setValue(this.editData.firstName);
  this.employeeform.controls['lastName'].setValue(this.editData.lastName);
  this.employeeform.controls['gender'].setValue(this.editData.gender);
  this.employeeform.controls['dob'].setValue(this.editData.dob);
  this.employeeform.controls['select_role'].setValue(this.editData.select_role);

 }
}

roles: Role[] = [
  {value: 'developer-0', viewValue: 'Developer'},
  {value: 'tester-1', viewValue: 'Tester'},
  {value: 'manager-2', viewValue: 'Manager'},
];


  addEmployee(){
    console.log(this.employeeform.value)
   if(!this.editData){
    if(this.employeeform.valid){
      this.api.postEmployee(this.employeeform.value)
      .subscribe({
        next:(res)=>{
          alert("Add Succesfully")
          this.employeeform.reset();
          this.dialogRef.close('save');
        },
        error:()=>{
          alert("something went wrong")
        }
      })
    }
   }else{
    this.updateEmployee();
   }
  }

  updateEmployee(){
    this.api.putEmployee(this.employeeform.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("employee detail updated");
        this.employeeform.reset();
        this.dialogRef.close('update')
      },
      error:()=>{
      alert("error");
      }
    })
  }

}
