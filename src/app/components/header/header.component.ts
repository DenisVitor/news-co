import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  hasNumber,
  hasUppercase,
  matchPassword,
} from '../../validators/uppercase';
import { FetchingService } from '../../services/fetching.service';
import { ViewerRegister } from '../../interfaces/viewer';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { News } from '../../interfaces/news';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  toggleModal: boolean = false;
  toggleForm: boolean = true;
  toggleResponse: boolean = false;
  submitted: boolean = false;
  submittedLogin: boolean = false;
  showSearch: boolean = false;
  valueSearch: string = '';
  listSearch: News[] = [];
  filteredList: News[] = [];
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  formLogin: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private formBuild: FormBuilder,
    private fetch: FetchingService,
    private toast: ToastrService,
    private cookies: CookieService,
    private router: Router
  ) {}

  redirectToPage(path: string): void {
    this.router.navigateByUrl(path);
  }

  onChangeSearch(event: any) {
    if (this.valueSearch !== event.target.value) {
      this.showSearch = true;
      this.filteredList = this.listSearch.filter((nw) =>
        nw.title
          .toLowerCase()
          .trim()
          .includes(String(event.target.value).trim().toLowerCase())
      );
    } else {
      this.showSearch = false;
    }
  }

  ngOnInit(): void {
    this.fetch.getNews().subscribe((nw) => {
      this.listSearch = nw;
      this.filteredList = this.listSearch;
    });

    this.formLogin = this.formBuild.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.form = this.formBuild.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.maxLength(30),
            Validators.minLength(10),
            hasUppercase(),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.maxLength(30),
            Validators.minLength(10),
            hasUppercase(),
            hasNumber(),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [matchPassword('password', 'confirmPassword')],
      }
    );
  }

  logout(): void {
    this.cookies.delete('@Token', '/');
    this.triggerModal();
    window.location.reload();
  }

  triggerClass(): string {
    return this.toggleModal ? 'show-modal' : 'hide-modal';
  }
  triggerModal(): void {
    this.toggleModal = !this.toggleModal;
  }
  triggerResponse(): void {
    this.toggleResponse = !this.toggleResponse;
  }
  formToLogin(): void {
    this.toggleForm = true;
  }
  formToRegister(): void {
    this.toggleForm = false;
  }
  triggerFormLogin(): string {
    return this.toggleForm ? 'selected-form' : 'unselected-form';
  }
  triggerFormRegister(): string {
    return this.toggleForm ? 'unselected-form' : 'selected-form';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  get l(): { [key: string]: AbstractControl } {
    return this.formLogin.controls;
  }

  logged(): boolean {
    return this.cookies.check('@Token');
  }

  onSubmitRegister(): void {
    this.submitted = true;
    const data: ViewerRegister = {
      username: this.form.value['username'],
      email: this.form.value['email'],
      password: this.form.value['password'],
    };
    if (this.form.invalid) {
      this.toast.error('Something went wrong', 'Error');
    } else if (this.form.valid) {
      this.fetch.registerViewer(data).subscribe((vw) => {
        if (!vw) {
          this.toast.error(
            'User with this name already exists',
            'Name already taken'
          );
        } else {
          setTimeout(() => this.formToLogin(), 1200);
          this.toast.success('Redirecting', 'New user created');
          this.submitted = false;
        }
      });
    }
  }
  onSubmitLogin(): void {
    this.submittedLogin = true;
    if (this.formLogin.invalid) {
      this.toast.error('Something went wrong', 'Error');
    } else if (this.formLogin.valid) {
      this.fetch.loginViewer(this.formLogin.value).subscribe((tk) => {
        if (tk && 'token' in tk) {
          this.cookies.set('@Token', String(tk.token));
          this.fetch.getIdByToken().subscribe((id) => {
            this.cookies.set('@UserId', id);
          });
          this.submittedLogin = false;
          this.toast.success('Welcome to the news.co', 'Welcome');
          this.triggerModal();
          setTimeout(() => {
            this.toast.info('Your token has been expired', 'Login');
            this.cookies.delete('@Token');
          }, 10800000);
        } else {
          this.toast.error(
            'Username/Password are incorrect',
            'Wrong credentials'
          );
        }
      });
    }
  }
}
