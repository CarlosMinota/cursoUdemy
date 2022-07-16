import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: [
  ]
})
export class FormComponent implements OnInit {

  public cliente:Cliente = new Cliente();

  public titulo:string = 'Crear cliente';

  public errores: string[];

  constructor(private clienteService: ClienteService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void{
    this.activatedRoute.params.subscribe(params =>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente =>{
          this.cliente = cliente
        })
      }
    })
  }

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      response =>{
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo cliente',
        `Cliente ${response.nombre} ha sido creado con éxito!`,
        'success')
      },
      err =>{
        this.errores = err.error.errors as string[];
        console.error('Error desde el backend: '+ err.status);
        console.error(err.error.errors)
      }
    )
  }

  public update(): void{
    this.clienteService.update(this.cliente).subscribe(json =>{
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente actualizado',
      `¡Cliente ${json.cliente.nombre}. ${json.mensaje}`,
      'success')
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Error desde el backend: '+ err.status);
      console.error(err.error.errors)
    })
  }

}
