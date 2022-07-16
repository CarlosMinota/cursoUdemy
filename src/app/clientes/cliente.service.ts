import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe, formatDate, registerLocaleData } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:9091/api/clientes'

  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-type': 'application/json'})

  constructor(private httpClient:HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any>{
    return this.httpClient.get(this.urlEndPoint+'/page/'+ page).pipe(
      tap((response: any) =>{
        console.log('Este es el tap #1');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
          
        })
      }),
      map((response: any) =>{

        (response.content as Cliente[]).map(cliente =>{ 
          cliente.nombre = cliente.nombre.toUpperCase();
          //let datepipe = new DatePipe('es');
          //cliente.createdAt = datepipe.transform(cliente.createdAt, 'EEEE dd, MMMM yyyy');
          //cliente.createdAt = formatDate(cliente.createdAt, 'dd-MM-yyyy', 'en-US');
          return cliente
        });
        return response;
      }),
      tap(response =>{
        console.log('Este es el tap #2');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
          
        })
      })
    );
  }

  create(cliente:Cliente): Observable<Cliente>{
    return this.httpClient.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((cliente: any) => cliente.cliente as Cliente),
      catchError(e =>{

        if(e.status == 400){
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.errors, 'error');
        return  throwError(() => e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente>{
    return this.httpClient.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error en editar el cliente', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  update(cliente:Cliente): Observable<any>{
    return this.httpClient.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e =>{

        if(e.status == 400){
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.errors, 'error');
        return  throwError(() => e);
      })
    );
  }

  delete(id:number): Observable<Cliente>{
    return this.httpClient.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return  throwError(() => e);
      })
    );
  }
}
