import { Routes } from '@angular/router';
import { ListHomeComponent } from './components/list-home/list-home.component';
import { ListNewsComponent } from './components/list-news/list-news.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { NewsOpenComponent } from './components/news-open/news-open.component';
import { ListJournalistComponent } from './components/list-journalist/list-journalist.component';
import { OpenJournalistComponent } from './components/open-journalist/open-journalist.component';

export const routes: Routes = [
  { path: '', component: ListHomeComponent },
  {
    path: 'news',
    component: ListNewsComponent,
    
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'news/:id',
    component: NewsOpenComponent,
  },
  {
    path: 'journalists',
    component: ListJournalistComponent,
  },
  {
    path: 'journalists/:id',
    component: OpenJournalistComponent,
  },
];
