import { Component, signal } from '@angular/core';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-avatar-uploader',
  imports: [SvgIconComponent],
  templateUrl: './avatar-uploader.component.html',
  styleUrl: './avatar-uploader.component.scss'
})
export class AvatarUploaderComponent {
  preview = signal<string>('/assets/imgs/avatar-placeholder.png')
  

  fileBrowserHandler(event: Event) {
    // console.log(event.target?.result.)
    const file = (event.target as HTMLInputElement)?.files?.[0]

    if (!file || !file.type.match('image')) return

    const reader = new FileReader()

    reader.onload = event => {
      this.preview.set(event.target?.result?.toString() ?? '')
    }

    reader.readAsDataURL(file)
  }
}
