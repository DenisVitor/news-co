import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ListHomeComponent } from './components/list-home/list-home.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { ListNewsComponent } from './components/list-news/list-news.component';
import { ListJournalistComponent } from './components/list-journalist/list-journalist.component';
import { OpenJournalistComponent } from './components/open-journalist/open-journalist.component';
import { CookieService } from 'ngx-cookie-service';
import { NewsOpenComponent } from './components/news-open/news-open.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    ListHomeComponent,
    HttpClientModule,
    FooterComponent,
    ListNewsComponent,
    AboutComponent,
    ContactComponent,
    ListJournalistComponent,
    OpenJournalistComponent,
    NewsOpenComponent,
  ],
  providers: [CookieService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'news_co';
}
