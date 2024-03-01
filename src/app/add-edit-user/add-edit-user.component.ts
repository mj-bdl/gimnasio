import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from '../models/user.model'; 
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  provinces_list: string[] = [
    'Almería',
    'Cádiz',
    'Córdoba',
    'Granada',
    'Huelva',
    'Jaén',
    'Málaga',
    'Sevilla'
  ];

  roles_list: string[] = [
    'usuario',
    'administrador'
  ];

  regForm: FormGroup;
  //dataSource!: MatTableDataSource<any>;  

  /*@ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;*/

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _sharedService: SharedService,
    private _dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserModel) 
    {
    this.regForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      province: [null, [Validators.required]],
      role: ["usuario", [Validators.required]],    // Por defecto el rol del usuario es "usuario"      
      birthday: [null]
    });
  }

  ngOnInit(): void {
    this.regForm.patchValue(this.data);
  }

  // Muestra el listado de usuarios que hay en el gimnasio
  /*getUsersList() {
    this._userService.getUsersList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log
    });
  }*/

  // Manda el formulario para editar o registrar el usuario
  submitRegForm()
  {
    if(this.regForm.valid)
    {
      // FORMATEO DE FECHA
      const formBirthday = this.regForm.value.birthday;     
      let formattedBirthday: Date | null = null;      // Inicializa formattedDate como null si no se seleccionó ninguna fecha
      
      // Si la fecha no es nula, opera con ella. Si no, la guarda nula
      if (formBirthday!=null) {
        // Suma un día a la fecha seleccionada, ya que si no, guarda un día antes al seleccionado por la zona horaria, al convertirlo luego con toISOString
        let nextDay = new Date(formBirthday);
        nextDay.setDate(formBirthday.getDate() + 1);
        // Se queda sólo la parte de fecha, sin la hora, y luego la convierte en fecha
        formattedBirthday = nextDay.toISOString().slice(0, 10) as unknown as Date;
      }

      // Creamos la instancia de UserModel
      let userData: UserModel = new UserModel(  
        this.regForm.value.id,
        this.regForm.value.firstName,
        this.regForm.value.lastName,
        this.regForm.value.province,
        this.regForm.value.email,
        this.regForm.value.role,
        formattedBirthday,
        "esteseraeltoken"   // Password
      );
      

      if(this.data && this.data.id !== undefined)         // ACTUALIZA
      {
        this._userService.editUser(this.data.id, userData).subscribe({
          next: (val: any) => {
            this._sharedService.openSnackBar("El usuario se ha modificado correctamente.");
            this._dialogRef.close(true);      // Cerramos la ventana de edición
          },
          error: console.log
        });
      } else {                                            // REGISTRA
        this._userService.addUser(userData).subscribe({
          next: (val: any) => {
            this._sharedService.openSnackBar("El usuario se ha añadido correctamente.");
            this._dialogRef.close(true);      // Cerramos la ventana de registro
          },
          error: console.log
        });
      } 
    }
  }  
}
