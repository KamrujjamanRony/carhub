import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/Shared/navbar/navbar.component';
import { FooterComponent } from '../../components/Shared/footer/footer.component';
import { CopyrightComponent } from '../../components/Shared/copyright/copyright.component';

@Component({
    selector: 'app-main',
    imports: [RouterOutlet, NavbarComponent, FooterComponent, CopyrightComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent {

}
