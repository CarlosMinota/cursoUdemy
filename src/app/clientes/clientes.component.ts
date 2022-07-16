import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).pipe(
        tap(response => {
          console.log('Clientes component tap #3');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          })
        })
      ).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    })

  }

  public delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estás seguro?',
      text: `¿Estás seguro que desea eliminar el cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(cli => {
          this.clientes = this.clientes.filter(cli => cli !== cliente)
          swalWithBootstrapButtons.fire(
            'Cliente eliminado',
            `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con éxito!`,
            'success'
          )
        })
      }
    })
  }

}
