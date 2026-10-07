import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
@Component({selector:'app-profile',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./profile.component.html',styleUrl:'./profile.component.css'})
export class ProfileComponent implements OnInit {
  private auth=inject(AuthService); profile:any={}; message=''; error='';
  ngOnInit(){this.auth.getProfile().subscribe({next:p=>this.profile=p,error:e=>this.error=e?.error?.message||'No se pudo cargar el perfil.'});}
  save(){this.message='';this.error='';this.auth.updateProfile({fullName:this.profile.fullName,phone:this.profile.phone}).subscribe({next:r=>{this.profile=r.user;this.message=r.message;localStorage.setItem('user',JSON.stringify(this.profile));},error:e=>this.error=e?.error?.message||'No se pudo actualizar el perfil.'});}
}
