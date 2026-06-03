import { Component, inject, signal } from '@angular/core';
import { SiteSettingService } from '../../../services/admin/site-settings.service';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-about-us',
    imports: [CommonModule],
    templateUrl: './about-us.component.html',
    styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
    private siteSettingService = inject(SiteSettingService);
    private toastService = inject(ToastService);
    siteId = environment.siteId;
    siteInfo = signal<any>(null);

    ngOnInit() {
        this.siteSettingService.getSettingsById(this.siteId).subscribe({
            next: (data) => {
                this.siteInfo.set(data);
                // console.log(this.siteInfo());
            },
            error: (err) => {
                this.toastService.showMessage('error', 'Error', 'Failed to load about us information.');
                console.error('Failed to load about us information:', err);
            }
        });
    }

}
