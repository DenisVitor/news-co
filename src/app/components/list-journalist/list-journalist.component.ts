import { Component, OnInit } from '@angular/core';
import { FetchingService } from '../../services/fetching.service';
import { Journalist } from '../../interfaces/journalist';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-journalist',
  standalone: true,
  imports: [],
  templateUrl: './list-journalist.component.html',
  styleUrl: './list-journalist.component.scss',
})
export class ListJournalistComponent implements OnInit {
  journoList: Journalist[] = [];
  constructor(
    private journalistService: FetchingService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.journalistService.getJournalists().subscribe((journo) => {
      this.journoList = journo;
    });
  }
  redirectWithId(id: string) {
    this.route.navigateByUrl(`journalists/${id}`);
  }
}
