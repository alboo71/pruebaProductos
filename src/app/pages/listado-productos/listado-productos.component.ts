import { Component, OnInit } from '@angular/core';  // Asegúrate de importar OnInit
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-productos',
  standalone: true,
  imports: [ NgFor, NgIf, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './listado-productos.component.html',
  styleUrl: './listado-productos.component.css'
})
export class ListadoProductosComponent implements OnInit{
  products: any[] = [];
  isLoading: boolean = true;
  filteredProducts: any[] = [];
  searchTerm: string = '';
  itemsPerPage: number = 5;
  isModalOpen: boolean = false;
  productForm: FormGroup;
  showDropdown: { [key: string]: boolean } = {};
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'warning' | '' = ''; 

  constructor(private productsService: ProductsService, private fb: FormBuilder, private router: Router) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadProductos();
    this.filteredProducts = this.products;
  }

  ngOnChanges() {
    this.filterProducts();
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.date_release.toLowerCase().includes(term) ||
      product.date_revision.toLowerCase().includes(term)
    );
  }

  editProduct(productId: string) {
    this.router.navigate([`/editar/${productId}`]);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async onSubmit() {
    if (this.productForm.valid) {
      try {
        const response = await this.productsService.addProduct(this.productForm.value);
        await this.loadProductos();
        this.closeModal();
      } catch (error) {
        this.showAlert('Error al agregar producto:', 'error');
      }
    }
  }
  
  async loadProductos() {
    this.isLoading = true;
    try {
      const response = await this.productsService.getProductos();
  
      if (Array.isArray(response) && response.length > 0) {
        this.products = response;
        this.filteredProducts = [...this.products];
      } else {
        this.products = [];
        this.filteredProducts = [];
        this.showAlert('No se encontraron productos en el array.', 'warning');
      }
    } catch (error) {
      this.showAlert('Error al obtener productos', 'error');
      this.products = [];
      this.filteredProducts = [];
    } finally {
      this.isLoading = false;
    }
  }
  

  validateReleaseDate() {
    const releaseDateControl = this.productForm.get('releaseDate');
    if (!releaseDateControl) return;
  
    const releaseDateValue = releaseDateControl.value;
    if (!releaseDateValue) return;
  
    const today = new Date();
    const selectedDate = new Date(releaseDateValue);
  
    const resetToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
    if (selectedDate < resetToday) {
      releaseDateControl.setErrors({ invalidDate: true });
    } else {
      releaseDateControl.setErrors(null);
    }
  }

  resetForm() {
    this.productForm.reset();
  }

  async validateId() {
    const idControl = this.productForm.get('id');
    if (!idControl) return;
  
    const value = idControl.value;
    const exists = await this.productsService.checkIfIdExists(value);
    if (exists) {
      idControl.setErrors({
        ...idControl.errors,
        idExists: true
      });
    } else {
      if (idControl.errors?.['idExists']) {
        const { idExists, ...others } = idControl.errors;
        idControl.setErrors(Object.keys(others).length ? others : null);
      }
    }
  }

  toggleDropdown(productId: string) {
    this.showDropdown[productId] = !this.showDropdown[productId];
  }

  showAlert(message: string, type: 'success' | 'error' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
  
    setTimeout(() => {
      this.alertMessage = '';
      this.alertType = '';
    }, 3000);
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../assets/icons/pichincha_logo_despues.jpg';
  }
}