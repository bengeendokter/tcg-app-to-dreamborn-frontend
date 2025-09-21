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
  protected inputPlaceholder: string =
    `Shared Deck – Lorcana TCG
Open the link in the Lorcana TCG app or download the app.
https://www.disneylorcana.com/sharing/deck?id=0d7d9390-de1d-4292-a53b-55eb6c99e6d3
-------------------------------------------
https://www.disneylorcana.com/sharing/deck?id=0d7d9390-de1d-4292-a53b-55eb6c99e6d3`;
  protected url: FormControl<string | null> = new FormControl('');
  protected result: FormControl<string | null> = new FormControl('');

  protected async convert(): Promise<void> {
    this.result.setValue("Loading...");
    const input: string | null = this.url.value;

    if (!input) {
      alert('Please enter a valid URL');
      this.result.setValue("Error");
      return;
    }

    const backupUrl: string | undefined = this.extractUrl(input);

    if (!backupUrl) {
      alert('Please enter a valid URL');
      this.result.setValue("Error");
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

  private extractUrl(input: string): string | undefined {
    const trimmedInput: string = input.trim();

    // Find substring that strarts with http or https and ends with a whitespace or end of string
    const urlPattern: RegExp = /(https?:\/\/[^\s]+)/g;
    const match: RegExpExecArray | null = urlPattern.exec(trimmedInput);

    if (!match) {
      return undefined;
    }

    const url: string = match[0];
    return url;
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
