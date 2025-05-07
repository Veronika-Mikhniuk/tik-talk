import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  form: FormGroup<{username:FormControl, password: FormControl}> = new FormGroup({
    username: new FormControl(null),
    password: new FormControl(null)
  })

  onSubmit(): void {
    console.log(this.form.value)
  }

}
