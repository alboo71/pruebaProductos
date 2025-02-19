import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent implements OnInit {
  productForm!: FormGroup;
  productId: string = '';
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'warning' | '' = ''; 

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.buildForm();
    this.loadProduct(this.productId);
  }

  buildForm() {
    this.productForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });
  }

  async loadProduct(id: string) {
    try {
      const products = await this.productsService.getProductos();
      const product = products.find((p: any) => p.id === id);

      if (product) {
        this.productForm.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logoUrl || product.logo,
          date_release: product.date_release,
          date_revision: product.date_revision,
        });
      } else {
        this.showAlert('Producto no encontrado', 'warning');
      }
    } catch (error) {
      this.showAlert('Error al cargar producto', 'error');
    }
  }

  async onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.getRawValue();

      try {
        const response = await this.productsService.updateProduct(this.productId, {
          name: formValue.name,
          description: formValue.description,
          logo: formValue.logo,
          date_release: formValue.date_release,
          date_revision: formValue.date_revision
        });
        this.showAlert('Producto actualizado con éxito', 'success');
        this.router.navigate(['/']);
      } catch (error) {
        this.showAlert('Error al actualizar producto', 'error')
      }
    }
  }

  showAlert(message: string, type: 'success' | 'error' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
  
    setTimeout(() => {
      this.alertMessage = '';
      this.alertType = '';
    }, 3000);
  }
}