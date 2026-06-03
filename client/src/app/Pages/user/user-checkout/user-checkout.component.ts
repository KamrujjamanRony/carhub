import { Component, inject, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from "../../../components/Shared/breadcrumbs/breadcrumbs.component";
import { InputsComponent } from "../../../components/Shared/inputs/inputs.component";
import { DataService } from '../../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-checkout',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, InputsComponent, FormsModule],
  templateUrl: './user-checkout.component.html',
  styleUrls: ['./user-checkout.component.css']
})
export class UserCheckoutComponent implements OnInit {
  private dataService = inject(DataService);

  model: any = {
    fullName: '',
    phone: '',
    address: '',
    region: '',
    city: '',
    area: ''
  };

  regions: any[] = [];
  cities: any[] = [];
  areas: any[] = [];
  isLoading: boolean = false;

  ngOnInit() {
    this.loadRegions();
  }

  async loadRegions() {
    this.isLoading = true;
    try {
      const data = await this.dataService.getJsonData().toPromise();
      this.regions = data?.region || [];
    } catch (error) {
      console.error('Error loading regions:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onRegionChanged() {
    if (!this.model.region) return;

    this.isLoading = true;
    try {
      const data = await this.dataService.getCitiesByRegion(this.model.region).toPromise();
      this.cities = data || [];
      this.model.city = '';
      this.model.area = '';
      this.areas = [];
    } catch (error) {
      console.error('Error loading cities:', error);
      this.cities = [];
    } finally {
      this.isLoading = false;
    }
  }

  async onCityChanged() {
    if (!this.model.city) return;

    this.isLoading = true;
    try {
      const data = await this.dataService.getAreasByCity(this.model.city).toPromise();
      this.areas = data || [];
      this.model.area = '';
    } catch (error) {
      console.error('Error loading areas:', error);
      this.areas = [];
    } finally {
      this.isLoading = false;
    }
  }

  onFormSubmit() {
    if (this.validateForm()) {
      console.log('Form submitted:', this.model);
      // Add your form submission logic here
    }
  }

  private validateForm(): any {
    const requiredFields = ['fullName', 'phone', 'address', 'region', 'city'];
    const missingFields = requiredFields.filter(field => !this.model[field]);

    if (missingFields.length > 0) {
      alert(`Please fill all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!/^\d{10,15}$/.test(this.model.phone)) {
      alert('Please enter a valid phone number (10-15 digits)');
      return false;
    }

    return true;
  }
}