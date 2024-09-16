import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, fromEvent, of, Subscription } from 'rxjs';

type objA = {
  message: string;
  canUseEmail: boolean;
};

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  private http = inject(HttpClient);
  private clickedEmail: Subscription = new Subscription();
  private clickedPassword: Subscription = new Subscription();
  private clickedConfirmPassword: Subscription = new Subscription();
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

  private route = inject(ActivatedRoute);

  constructor(private router: Router) {
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
    // this.route.paramMap.subscribe((params) => {
    //   this.currentPage = params.get('activePage')!;
    //   console.log(this.currentPage);
    // });

    this.route.queryParams.subscribe((params) => {
      this.date = params['activePage'];
      console.log(this.date); // Print the parameter to the console.
    });
  }

  ngOnChanges(): void {}

  ngAfterViewInit(): void {
    this.clickedEmail = fromEvent(
      this.el0!.nativeElement,
      'focusout'
    ).subscribe(() => {
      this.onCheckEmail(this.el0?.nativeElement.value)
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
    });

    this.clickedPassword = fromEvent(
      this.el1!.nativeElement,
      'focusout'
    ).subscribe(() => {
      this.passwordTouched = true;
      this.validatePassword =
        this.signUpForm!.get('password')?.valid &&
        this.signUpForm!.get('email')?.touched;
    });

    this.clickedConfirmPassword = fromEvent(
      this.el2!.nativeElement,
      'focusout'
    ).subscribe(() => {
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
    });
  }

  ngOnDestroy(): void {
    this.clickedEmail.unsubscribe();
    this.clickedPassword.unsubscribe();
    this.clickedConfirmPassword.unsubscribe();
  }

  onCheckEmail(email: string) {
    this.email = email;
    return this.http.post('http://localhost:8080/signUp/checkEmail', {
      email: this.email
    });
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
        if (data.message !== 'User created') {
          console.log('there is an error');
        }
        const url = Date.now();
        this.router.navigate(['/authenticate', data.token]);
      });
    this.el0!.nativeElement.value = '';
    this.el1!.nativeElement.value = '';
    this.el2!.nativeElement.value = '';
  }

  // private passwordMatch(
  //   password: string,
  //   confirmPassword: string
  // ): ValidatorFn {
  //   return (formGroup: AbstractControl): { [key: string]: any } | null => {
  //     const passwordControl = formGroup.get(password);
  //     const confirmPasswordControl = formGroup.get(confirmPassword);

  //     if (!passwordControl || !confirmPasswordControl) {
  //       return null;
  //     }

  //     if (
  //       confirmPasswordControl.errors &&
  //       !confirmPasswordControl.errors['passwordMismatch']
  //     ) {
  //       return null;
  //     }

  //     if (passwordControl.value !== confirmPasswordControl.value) {
  //       confirmPasswordControl.setErrors({ passwordMismatch: true });
  //       return { passwordMismatch: true };
  //     } else {
  //       confirmPasswordControl.setErrors(null);
  //       return null;
  //     }
  //   };
  // }
}
