import { Component, OnInit } from '@angular/core';
import { newsType } from '../../assets/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  typeList: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.typeList = newsType;
  }

  redirectToPage(path: string): void {
    this.router.navigateByUrl(path);
  }

  redirectWithParams(param: string) {
    this.router.navigate(['/news'], { queryParams: { type: param } });
  }
}
