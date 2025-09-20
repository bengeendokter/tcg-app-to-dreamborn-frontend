import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
    this.result.setValue("Loading...");
    const backupUrl: string | null = this.url.value;

    if (!backupUrl) {
      alert('Please enter a valid URL');
      return;
    }

    this.http.post('https://tcg-app-to-dreamborn-api.home.bengeendokter.be/api/deck', { backupUrl }).subscribe({
      next: response => {
        if (!('deck' in response) || typeof response.deck !== 'string') {
          alert('Invalid response from server');
          this.result.setValue("Error");
          return;
        }

        const deckImportString = response.deck;
        this.result.setValue(deckImportString);
      },
      error: response => {
        const errorMessage: string | undefined = response?.error?.error;
          this.result.setValue("Error");

        if (!errorMessage) {
          alert('Could not connect to server');
          return;
        }

        alert('Server error: ' + errorMessage);
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
