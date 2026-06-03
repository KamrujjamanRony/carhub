import { Component, inject, signal } from '@angular/core';
import { SiteSettingService } from '../../../services/admin/site-settings.service';
import { ToastService } from '../../primeng/toast/toast.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
    private siteSettingService = inject(SiteSettingService);
    private toastService = inject(ToastService);
    siteId = environment.siteId;
    siteInfo = signal<any>(null);

    ngOnInit() {
        this.siteSettingService.getSettingsById(this.siteId).subscribe({
            next: (data) => {
                this.siteInfo.set(data);
            },
            error: (err) => {
                this.toastService.showMessage('error', 'Error', 'Failed to load about us information.');
                console.error('Failed to load about us information:', err);
            }
        });
    }

}
