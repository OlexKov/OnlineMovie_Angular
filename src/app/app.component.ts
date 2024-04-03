import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MovieTableComponent } from './components/movie-table/movie-table.component';
import { TokenService } from './services/token.service';
import { AccountService } from './services/account.service';
import { IResponseModel } from './models/IResponsModel';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MovieTableComponent,
  ],
})
export class AppComponent {
  title = 'OnlineMovie_Angular';
  constructor(tokenService: TokenService) {
    let tokenData = tokenService.getDataFromToken();
    if (tokenData && tokenData.name) {
      if (new Date(tokenData.exp) > new Date(Date.now())) tokenService.updateTokenData();
      else {
        tokenService.refreshTokens();
      }
    }
  }
}
