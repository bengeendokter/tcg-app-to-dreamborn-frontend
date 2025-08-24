import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [ReactiveFormsModule],
})
export class App {
  private http: HttpClient = inject(HttpClient);
  protected url: FormControl<string | null> = new FormControl('');
  protected result: FormControl<string | null> = new FormControl('');

  protected async convert(): Promise<void> {
    const backupUrl: string | null = this.url.value;

    if (!backupUrl) {
      alert('Please enter a valid URL');
      return;
    }

    this.http.post('http://localhost:3000/api/deck', { backupUrl }).subscribe({
      next: response => {
        if (!('deck' in response) || typeof response.deck !== 'string') {
          alert('Invalid response from server');
          return;
        }

        const deckImportString = response.deck;
        this.result.setValue(deckImportString);
      },
      error: response => {
        alert('Server error: ' + response.error.error);
      }
    });
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
