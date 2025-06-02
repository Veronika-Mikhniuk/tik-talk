import { Component, signal } from '@angular/core';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { DndDirective } from '../../../common-ui/directives/dnd.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avatar-uploader',
  imports: [SvgIconComponent, DndDirective, FormsModule],
  templateUrl: './avatar-uploader.component.html',
  styleUrl: './avatar-uploader.component.scss'
})
export class AvatarUploaderComponent {
  preview = signal<string>('/assets/imgs/avatar-placeholder.png')

  avatar: File | null = null

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0]

    this.processFile(file)
  }

  onFileDropped(file: File) {
    this.processFile(file)
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return

    const reader = new FileReader()

    reader.onload = event => {
      this.preview.set(event.target?.result?.toString() ?? '')
    }

    reader.readAsDataURL(file)
    this.avatar = file
  }
}
