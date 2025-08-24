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

  protected async convert(): Promise<void> {
    const backupUrl: string | null = this.url.value;

    if (!backupUrl) {
      alert('Please enter a valid URL');
      return;
    }

    try {
      const deckImportString = "Not implemented yet";
      this.result.setValue(deckImportString);
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      }
      else {
        alert('An unknown error occurred');
      }
    }
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
