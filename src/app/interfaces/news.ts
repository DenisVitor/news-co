import { Journalist } from './journalist';
import { Review } from './review';
import { Type } from './type';

export interface News {
  selected: boolean;
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: Type;
  content: string;
}

export interface SelectedNews extends News {
  journalist_related: Journalist;
  reviews_related: Review[];
}
