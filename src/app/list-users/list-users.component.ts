import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../services/user.service';
import { SharedService } from '../shared/shared.service';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit{
  displayedColumns: string[] = ['firstName', 'lastName', 'province', 'email', 'birthday','actions'];
  dataSource!: MatTableDataSource<UserModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private _userService: UserService, private _sharedService: SharedService){}

  ngOnInit(): void {
    this.getUsersList();
  } 

  // Abre la ventana para editar un nuevo usuario
  openAddEditUserDialog(data?: UserModel){
    let dialogRef;

    if(data)
      dialogRef = this._dialog.open(AddEditUserComponent, {data});  // Edita el usuario
    else
      dialogRef = this._dialog.open(AddEditUserComponent);    // Registra el usuario


    dialogRef.afterClosed().subscribe({   
      next: (val) => {                        // Si recibe true cuando se cierra, se actualiza la lista
        if (val)
          this.getUsersList();    
      }
    });
  }


  // Muestra el listado de usuarios que hay en el gimnasio
  getUsersList() {
    this._userService.getUsersList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log
    })
  }

  // Elimina un usuario
  deleteUser(id: number){
    this._userService.deleteUser(id).subscribe({
      next: (res) => {
        this._sharedService.openSnackBar("El usuario se ha eliminado correctamente.");
        this.getUsersList();    // Actualizamos el listado de usuarios
      },
      error: console.log
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


