import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchingService } from '../../services/fetching.service';
import { SelectedJournalist } from '../../interfaces/journalist';
import { Type } from '../../interfaces/type';

@Component({
  selector: 'app-open-journalist',
  standalone: true,
  imports: [],
  templateUrl: './open-journalist.component.html',
  styleUrl: './open-journalist.component.scss',
})
export class OpenJournalistComponent implements OnInit {
  idToSet: string = '';
  journo: SelectedJournalist = {
    news_related: [],
    id: '',
    name: '',
    role: Type.BUSINESS,
    email: '',
    avatar: '',
  };

  constructor(
    private route: ActivatedRoute,
    private journoService: FetchingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.idToSet = id!;
    });
    this.journoService.getJournalistById(this.idToSet).subscribe((journo) => {
      this.journo = journo;
    });
  }
  capitalize(word: string): string {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
  goToNews(id: string): void {
    this.router.navigateByUrl(`news/${id}`);
  }
}
