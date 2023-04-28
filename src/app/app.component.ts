import { Component, OnInit,ViewChild} from '@angular/core';
import{DialogComponent} from './dialog/dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { error } from '@angular/compiler/src/util';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'crud';
  displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'dob','select_role','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


   constructor(private dialog:MatDialog,private api:ApiService){}
  ngOnInit(): void {
    this.getAllemployee();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
     width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val ==='save'){
        this.getAllemployee();
      }
    })
  }

  getAllemployee(){
    this.api.getEmployee()
    .subscribe({
      next:(res)=>{
       this.dataSource=new MatTableDataSource(res);
       this.dataSource.paginator=this.paginator;
       this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        alert("error while fetching data")
      }
    })
  }

  editemployee(row:any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val ==='update'){
        this.getAllemployee();
      }
    })
  }

  deleteEmployees(id:number){
    this.api.deleteEmployee(id)
    .subscribe({
      next:(res)=>{
        alert("deleted the detail of Employee");
        this.getAllemployee();
      },
      error:()=>{
        alert("error while deleting !!")
      }
    })
  }

   

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}

