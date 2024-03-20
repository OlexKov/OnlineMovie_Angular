import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from './components/footer/footer.component';
import { ErrorComponent } from "./components/error/error.component";
import { MovieTableComponent } from "./components/movie-table/movie-table.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        HttpClientModule,
        HeaderComponent,
        FooterComponent,
        ErrorComponent,
        MovieTableComponent
    ]
})
export class AppComponent {
  title = 'OnlineMovie_Angular';
  constructor(private http: HttpClient){}
}
