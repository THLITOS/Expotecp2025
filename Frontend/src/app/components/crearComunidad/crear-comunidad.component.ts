import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ComunidadService } from '../../services/comunidad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-comunidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-comunidad.component.html',
  styleUrls: ['./crear-comunidad.component.css'],
})
export class CrearComunidadComponent {
  comunidadForm: FormGroup;
  mensaje: string = '';
  showMensaje = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private comunidadService: ComunidadService) {
    this.comunidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.comunidadForm.invalid || !this.selectedFile) {
      this.mostrarMensaje('❌ Completa todos los campos y selecciona una imagen', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.comunidadForm.value.nombre);
    formData.append('descripcion', this.comunidadForm.value.descripcion);
    formData.append('imagen', this.selectedFile);

    this.comunidadService.crearComunidad(formData).subscribe({
      next: () => {
        this.mostrarMensaje('✅ Comunidad creada correctamente!', 'success');
        this.resetForm();
      },
      error: (err) => {
        this.mostrarMensaje(`❌ Error: ${err.error?.error || 'No se pudo crear la comunidad'}`, 'error');
      },
    });
  }

  mostrarMensaje(texto: string, tipo: 'success' | 'error') {
    this.mensaje = texto;
    this.showMensaje = true;
    setTimeout(() => (this.showMensaje = false), 5000);
  }

  resetForm() {
    this.comunidadForm.reset();
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
