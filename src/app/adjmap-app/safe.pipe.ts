import {DomSanitizer} from '@angular/platform-browser';
import {PipeTransform, Pipe} from "@angular/core";

@Pipe({ name: 'safe'})
export class SafePipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustResourceUrl(value);
  }
}
