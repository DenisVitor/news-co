import { Component, HostListener, OnInit } from '@angular/core';
import { FetchingService } from '../../services/fetching.service';
import { ActivatedRoute, Router } from '@angular/router';
import { News, SelectedNews } from '../../interfaces/news';
import { Type } from '../../interfaces/type';
import { CookieService } from 'ngx-cookie-service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Review } from '../../interfaces/review';

@Component({
  selector: 'app-news-open',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  providers: [CookieService],
  templateUrl: './news-open.component.html',
  styleUrl: './news-open.component.scss',
})
export class NewsOpenComponent implements OnInit {
  idToSet: string = '';
  toggleModal: boolean = false;
  toggleClass: string = 'hidden-modal';
  patchReview: boolean = false;
  deleteReview: boolean = false;
  submitted: boolean = false;
  reviewList: Review[] = [];
  postedReview: boolean = false;
  endReview: boolean = false;
  reviewId: string = '';
  previousNews: News | undefined;
  nextNews: News | undefined;
  formReview: FormGroup = new FormGroup({
    review: new FormControl(''),
    news_related: new FormControl(''),
  });
  selectedNews: SelectedNews = {
    journalist_related: {
      id: '',
      name: '',
      role: Type.BUSINESS,
      email: '',
      avatar: '',
    },
    reviews_related: [],
    selected: false,
    id: '',
    title: '',
    subtitle: '',
    image: '',
    type: Type.BUSINESS,
    content: '',
  };
  constructor(
    private newsService: FetchingService,
    private route: ActivatedRoute,
    private router: Router,
    private cookies: CookieService,
    private formBuild: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.idToSet = id!;
    });
    this.newsService.getNewsById(this.idToSet).subscribe((news) => {
      this.selectedNews = news;
      this.reviewList = news.reviews_related;
      this.selectedNews.reviews_related.forEach((rw) => (rw.owned = false));
    });
    this.formReview = this.formBuild.group({
      review: ['', Validators.required],
      news_related: [this.idToSet, Validators.required],
    });
    this.newsService.getNews().subscribe((news) => {
      const foundIndex: number = news.findIndex(
        (nw) => nw.id === this.selectedNews.id
      );
      if (foundIndex <= 0) {
        this.previousNews = news[news.length - 1];
        this.nextNews = news[1];
      } else if (foundIndex > 0 && foundIndex !== news.length - 1) {
        this.previousNews = news[foundIndex - 1];
        this.nextNews = news[foundIndex + 1];
      } else if (foundIndex === news.length - 1) {
        this.previousNews = news[foundIndex - 2];
        this.nextNews = news[0];
      }
    });
    if (this.logged()) {
      this.newsService.getIdByToken().subscribe((id) => {
        if (this.cookies.check('@UserID') === false) {
          this.cookies.set('@UserId', id);
        }
      });
      this.verifyReview();
    }
  }
  logged(): boolean {
    return this.cookies.check('@Token');
  }

  get err(): { [key: string]: AbstractControl } {
    return this.formReview.controls;
  }

  goToNews(id: string): void {
    this.router.navigateByUrl(`news/${id}`);
    this.newsService.getNewsById(id).subscribe((nw) => {
      this.selectedNews = nw;
    });
    this.newsService.getNews().subscribe((news) => {
      const foundIndex: number = news.findIndex(
        (nw) => nw.id === this.selectedNews.id
      );
      if (foundIndex <= 0) {
        this.previousNews = news[news.length - 1];
        this.nextNews = news[1];
      } else if (foundIndex > 0 && foundIndex !== news.length - 1) {
        this.previousNews = news[foundIndex - 1];
        this.nextNews = news[foundIndex + 1];
      } else if (foundIndex === news.length - 1) {
        this.previousNews = news[foundIndex - 2];
        this.nextNews = news[0];
      }
    });
  }

  goToJourno(id: string) {
    this.router.navigateByUrl(`journalists/${id}`);
  }

  verifyReview(): void {
    this.newsService
      .getReview({
        viewer_posted: this.cookies.get('@UserId'),
        news_related: this.idToSet,
      })
      .subscribe((rw) => {
        if (!rw) {
          this.selectedNews.reviews_related.forEach((rw) => (rw.owned = false));
          this.postedReview = false;
        }
        this.reviewId = rw;
        this.reviewList.forEach((ew) =>
          rw === ew.id ? (ew.owned = true) : (ew.owned = false)
        );
        this.postedReview = true;
      });
  }

  triggerModal(): void {
    this.toggleModal = !this.toggleModal;
  }
  triggerClass(): string {
    return this.toggleModal ? 'show-modal' : 'hidden-modal';
  }

  togglePost(): void {
    this.endReview = false;
    this.toggleModal = true;
  }

  triggerPatch(): void {
    this.toggleModal = true;
    this.deleteReview = false;
    this.patchReview = true;
  }

  triggerDelete(): void {
    this.toggleModal = true;
    this.patchReview = false;
    this.deleteReview = true;
  }

  patchReviewFunc(): void {
    this.submitted = true;
    if (this.formReview.valid) {
      this.newsService
        .patchReview(this.reviewId, this.formReview.value)
        .subscribe((rw) => {
          const foundReview = this.reviewList.find(
            (ew) => ew.id === this.reviewId
          );
          if (foundReview) {
            foundReview.review = rw.review;
            const filteredList = this.reviewList.filter(
              (ew) => ew.id !== this.reviewId
            );
            this.reviewList = [...filteredList, foundReview];
            this.submitted = false;
          }
        });

      this.toggleModal = false;
    }
  }

  deleteReviewFunc(): void {
    this.endReview = true;
    this.newsService.deleteReview(this.reviewId);
    const filteredList = this.reviewList.filter(
      (rw) => rw.id !== this.reviewId
    );
    this.reviewList = filteredList;
    this.postedReview = false;
    this.deleteReview = false;
    this.reviewId = '';
  }

  postReview(): void {
    this.submitted = true;
    if (this.formReview.valid) {
      this.newsService.postReview(this.formReview.value).subscribe((rw) => {
        rw.owned = true;
        this.selectedNews.reviews_related.push(rw);
        this.submitted = false;
        this.postedReview = true;
        this.toggleModal = false;
      });
    }
  }
  @HostListener('document:keydown', ['$event'])
  handleEscape(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.toggleModal = false;
    }
  }
}
