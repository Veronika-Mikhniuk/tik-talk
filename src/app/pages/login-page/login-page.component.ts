import { Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from '../../auth/auth.service'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
import { SIGNAL } from '@angular/core/primitives/signals'

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  authService = inject(AuthService)
  router = inject(Router)

  isPasswordVisible = signal<boolean>(false)

  form: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  })

  constructor() {
    from([1, 2, 3, 4, 5, 6, 7, 8, 9])
      .pipe(
        map((val: number) => val * 2)

      ).subscribe(value => {
        console.log(value)
      })
  }

  onSubmit(): void {
    console.log(this.form.value)

    if (this.form.valid) {
      this.authService.login(this.form.value)
        .subscribe(() => {
          this.router.navigate([''])
        })
    }
    else {
      console.log('Форма не валидна')
    }
  }
}
