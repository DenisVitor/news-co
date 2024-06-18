import { Component, OnInit } from '@angular/core';
import { News } from '../../interfaces/news';
import { FetchingService } from '../../services/fetching.service';

import { ActivatedRoute, Router } from '@angular/router';
import { newsType } from '../../assets/list';

@Component({
  selector: 'app-list-news',
  standalone: true,
  imports: [],
  templateUrl: './list-news.component.html',
  styleUrl: './list-news.component.scss',
})
export class ListNewsComponent implements OnInit {
  allNews: News[] = [];
  typeNews: string[] = [];
  typeFilter: string = '';
  filteredNews: News[] = [];

  constructor(
    private newsService: FetchingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newsService.getNews().subscribe((news) => {
      this.allNews = news;
      this.filteredNews = this.allNews;
    });
    this.typeNews = newsType;
    this.route.queryParamMap.subscribe((param: any) => {
      if (param['params'].type) {
        (this.typeFilter = param['params'].type.toString())(
          (this.filteredNews = this.allNews.filter(
            (nw) => nw.type.toString() === param['params'].type.toUpperCase()
          ))
        );
      }
      if (!this.typeFilter) {
        this.filteredNews = this.allNews;
      }
    });
  }

  toggleListFilter(type: string): void {
    this.typeFilter = type;
    this.filteredNews = this.allNews.filter((nw) => nw.type.toString() == type);
    this.router.navigate([], {
      queryParams: { type: type.toLowerCase() },
      queryParamsHandling: 'merge',
    });
  }

  toggleClearFilter() {
    this.typeFilter = '';
    this.filteredNews = this.allNews;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: null },
      queryParamsHandling: 'merge',
    });
  }

  showClearButton(): string {
    if (this.typeFilter && this.typeFilter !== '') {
      return 'show-button';
    }
    return 'hide-button';
  }

  redirectWithId(id: string) {
    this.router.navigateByUrl(`news/${id}`);
  }
}
