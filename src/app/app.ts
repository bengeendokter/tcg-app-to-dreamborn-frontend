import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [ReactiveFormsModule],
})
export class App {
  protected url: FormControl<string | null> = new FormControl('');
  protected result: FormControl<string | null> = new FormControl('');

  protected convert(): void {
    this.result.setValue(this.url.value);
  }

  protected async copyToClipboard(): Promise<void> {
    const clipboard: Clipboard | undefined = navigator.clipboard;

    if (!clipboard) {
      alert('Clipboard API not supported');
      return;
    }

    await navigator.clipboard.writeText(this.result.value ?? '');
    alert('Copied to clipboard!');
  }
}
