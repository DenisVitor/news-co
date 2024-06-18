import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FetchingService } from '../../services/fetching.service';
import { News } from '../../interfaces/news';
import { Journalist } from '../../interfaces/journalist';
import { newsType } from '../../assets/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-home',
  standalone: true,
  imports: [],
  templateUrl: './list-home.component.html',
  styleUrl: './list-home.component.scss',
})
export class ListHomeComponent implements OnInit, AfterViewInit {
  newsList: News[] = [];
  newsData: News | undefined;
  sportNews: News | undefined;
  cultureNews: News | undefined;
  healthNews: News | undefined;
  worldNews: News | undefined;
  journoList: Journalist[] = [];
  typeList: string[] = [];
  allNews: News[] = [];
  typeFilter: string = 'BUSINESS';
  constructor(private newsService: FetchingService, private route: Router) {}

  ngOnInit(): void {
    this.newsService.getNews().subscribe((news) => {
      this.newsList = [news[0], news[3], news[6], news[9]].map((newsItem) => ({
        ...newsItem,
        selected: false,
      }));
      this.newsList[0].selected = true;
      this.newsData = this.newsList[0];
    });
    this.newsService.getNews().subscribe((news) => {
      this.sportNews = news[13];
      this.cultureNews = news[4];
      this.healthNews = news[11];
      this.worldNews = news[14];
    });
    this.newsService.getJournalists().subscribe((journos) => {
      this.journoList = [journos[0], journos[1], journos[2], journos[3]];
    });
    this.typeList = newsType;
    this.newsService.getNews().subscribe((news) => {
      this.allNews = news;
    });
  }

  ngAfterViewInit(): void {
    if (this.newsList.length > 0) {
      this.newsList[0].selected = true;
      this.newsData = this.newsList[0];
    }
  }

  toggleSelection(index: number): void {
    if (!this.newsList[index].selected) {
      this.newsList.forEach((news, i) => {
        news.selected = i === index;
      });
      this.newsData = this.newsList[index];
    }
  }

  goToContacts(): void {
    this.route.navigateByUrl('contact');
  }

  goToAbout(): void {
    this.route.navigateByUrl('about');
  }

  goToJourno(id: string): void {
    this.route.navigateByUrl(`journalists/${id}`);
  }

  goToJournos(): void {
    this.route.navigateByUrl('journalists');
  }

  goToNews(id: string) {
    this.route.navigateByUrl(`news/${id}`);
  }
  getNewsClass(index: number): string {
    return this.newsList[index].selected ? 'big-news' : 'small-news';
  }
}
