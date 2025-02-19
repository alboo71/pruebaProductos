import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = 'http://localhost:3002/bp/products';

  constructor() {}

  async getProductos() {
    const data = await fetch(this.baseUrl);
    const json = await data.json();
    return json.data;
  }

  async addProduct(product: any) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const result = await response.json();
    console.log('Respuesta al agregar producto:', result);
    return result;
  }

  async checkIfIdExists(id: string): Promise<boolean> {
    const url = `http://localhost:3002/bp/products/verification/${id}`;
    const response = await fetch(url);
    const result = await response.json();
    // El backend devuelve true/false, retornamos tal cual para saber si el ID existe
    return result === true;
  }

  async updateProduct(id: string, updatedData: any) {
    const url = `${this.baseUrl}/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const result = await response.json();
    console.log('Respuesta al actualizar producto:', result);
    return result;
  }
}
