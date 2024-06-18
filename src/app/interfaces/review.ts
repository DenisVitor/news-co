import { SelectedNews } from './news';
import { Viewer } from './viewer';

export interface Review {
  id: string;
  review: string;
  viewer_posted: Viewer;
  news_related: string;
  owned: boolean;
}

export interface ReviewPost {
  review: string;
  news_related: string;
}


export interface ReviewGetting {
  news_related: string;
  viewer_posted: string;
}
