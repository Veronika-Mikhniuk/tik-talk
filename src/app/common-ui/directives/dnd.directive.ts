import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';


@Directive({
  selector: '[dnd]'
})
export class DndDirective {
  @Output() fileDropped = new EventEmitter<File>()

  @HostBinding('class.fileover')
  fileover = false

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()

    this.fileover = true
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()

    this.fileover = true

    this. fileDropped.emit(event.dataTransfer?.files[0])
  }
}
