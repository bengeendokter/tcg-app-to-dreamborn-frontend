import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {backupDeck} from 'lorcana-tcg-to-dreamborn/dist/backup-deck';
import { DreambornDeck } from 'lorcana-tcg-to-dreamborn/dist/model/dreamborn';

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
      const deck: DreambornDeck = await backupDeck(backupUrl);
      const deckImportString: string = deck.cards.map(card => [card.count, card.fullName].join(' ')).join('\n');
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
