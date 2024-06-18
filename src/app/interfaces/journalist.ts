import { News } from './news';
import { Type } from './type';

export interface Journalist {
  id: string;
  name: string;
  role: Type;
  email: string;
  avatar: string;
}

export interface SelectedJournalist extends Journalist {
  news_related: News[];
}
