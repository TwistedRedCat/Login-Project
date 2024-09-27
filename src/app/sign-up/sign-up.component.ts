import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, fromEvent, of, Subscription } from 'rxjs';
import { AccountService } from '../auth-service';
// import { HTTPService } from '../http-service';

type objA = {
  message: string;
  canUseEmail: boolean;
};

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  private clickedElement = new Subscription();

  currentPage?: string;

  signUpForm!: FormGroup;

  email?: string;
  password?: string;
  canUseEmail: boolean = false;
  obj?: objA;
  emailTouched?: boolean;
  passwordTouched?: boolean;
  cpasswordTouched?: boolean;
  // buttonEnabled?: boolean;
  checkEmailMsg: string = '';
  validateEmail?: boolean;
  validatePassword?: boolean;
  validateConfirmPassword?: boolean;

  @ViewChild('usr', { static: false }) el0?: ElementRef;
  @ViewChild('pwd', { static: false }) el1?: ElementRef;
  @ViewChild('cpwd', { static: false }) el2?: ElementRef;

  constructor() {
    this.signUpForm = new FormGroup({
      'email': new FormControl(null, [Validators.email, Validators.required]),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z]+$')
      ]),
      confirmpassword: new FormControl(null, [Validators.required])
    });
  }

  private date?: string;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.date = params['activePage'];
      // console.log(this.date); // Print the parameter to the console.
    });
  }

  ngOnChanges(): void {}

  ngAfterViewInit(): void {
    this.clickedElement.add(
      fromEvent(this.el0!.nativeElement, 'focusout').subscribe(() => {
        this.onCheckEmail(this.el0?.nativeElement.value);
      })
    );

    this.clickedElement.add(
      fromEvent(this.el1!.nativeElement, 'focusout').subscribe(() => {
        this.passwordTouched = true;
        this.validatePassword =
          this.signUpForm!.get('password')?.valid &&
          this.signUpForm!.get('email')?.touched;
      })
    );

    this.clickedElement.add(
      fromEvent(this.el2!.nativeElement, 'focusout').subscribe(() => {
        const password = this.signUpForm!.get('confirmpassword')?.value;
        const cpassword = this.signUpForm!.get('password')?.value;
        this.cpasswordTouched = true;
        if (
          password === cpassword &&
          this.signUpForm!.get('confirmpassword')?.touched
        ) {
          this.validateConfirmPassword = true;
        } else {
          this.validateConfirmPassword = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.clickedElement.unsubscribe();
  }

  onCheckEmail(email: string) {
    this.email = email;
    this.http
      .post('http://localhost:8080/signUp/checkEmail', {
        email: this.email
      })
      .pipe(catchError((err) => of([])))
      .subscribe((data: any) => {
        this.emailTouched = true;
        this.canUseEmail = data.canUseEmail;
        if (!this.canUseEmail) {
          this.checkEmailMsg = data.message;
        } else if (!this.validateEmail) {
          this.checkEmailMsg = 'Please enter a valid e-mail';
        } else if (this.canUseEmail && this.validateEmail) {
          this.checkEmailMsg = 'E-mail is available';
        } else {
          this.checkEmailMsg = '';
        }
      });
    this.validateEmail =
      this.signUpForm!.get('email')?.valid &&
      this.signUpForm!.get('email')?.touched;
  }

  onSubmit() {
    this.email = this.signUpForm?.value.email;
    this.password = this.signUpForm?.value.password;
    if (
      !this.validateEmail ||
      !this.validatePassword ||
      !this.validateConfirmPassword
    ) {
      return;
    }
    this.http
      .post('http://localhost:8080/signUp/submit', {
        email: this.email,
        password: this.password
      })
      .subscribe((data: any) => {
        if (data.message !== `User ${this.email} created`) {
          // console.log(data.verify);
        }
        this.accountService.Registring = true;
        this.router.navigate(['/authenticate'], {
          queryParams: { email: this.email }
        });
      });
    this.el0!.nativeElement.value = '';
    this.el1!.nativeElement.value = '';
    this.el2!.nativeElement.value = '';
  }
}
