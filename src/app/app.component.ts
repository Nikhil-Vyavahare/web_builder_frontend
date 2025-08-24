import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from './api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gemini Website Builder';
  promptText: string = '';
  generatedCode: string = '';
  displayedCode: string = '';
  typingIndex: number = 0;
  isGenerating: boolean = false;
  sanitizedCode: SafeHtml | null = null;

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  generateUI() {
    if (!this.promptText.trim()) return;
    this.isGenerating = true;  // disable buttons
    this.displayedCode = '';
    this.typingIndex = 0;

    this.api.generateUI(this.promptText).subscribe({
      next: (res) => {
        this.generatedCode = res.code || '';
        this.generatedCode = this.generatedCode.replace(/```html\s*|\s*```/g, '').trim();
        this.sanitizedCode = this.sanitizer.bypassSecurityTrustHtml(this.generatedCode);
        this.typeCode();
        this.isGenerating = false; // enable buttons
      },
      error: (err) => {
        this.generatedCode = '❌ Error generating UI: ' + (err.message || 'Unknown error');
        this.isGenerating = false; // enable buttons
      }
    });
  }

  enhancePrompt() {
    if (!this.promptText.trim()) return;
    this.isGenerating = true; // ✅ disable buttons

    this.api.enhancePrompt(this.promptText).subscribe({
      next: (res) => {
        this.promptText = res.enhancedPrompt;
        this.isGenerating = false; // ✅ re-enable before next call
        setTimeout(() => this.generateUI(), 0);
      },
      error: (err) => {
        console.error('Error enhancing prompt:', err);
        alert('Failed to enhance prompt. Please try again.');
        this.isGenerating = false; // ✅ re-enable
      }
    });
  }

  typeCode() {
    if (this.typingIndex < this.generatedCode.length) {
      this.displayedCode += this.generatedCode[this.typingIndex];
      this.typingIndex++;
      setTimeout(() => this.typeCode(), 10);
    } else {
      this.isGenerating = false;
    }
  }

  openLivePreview() {
    if (!this.generatedCode) return;
    const blob = new Blob([this.generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  clear() {
    // ✅ no manual event listener, just reset directly
    this.promptText = '';
    this.displayedCode = '';
  }

  get previewUrl() {
    return this.generatedCode
      ? 'data:text/html;charset=utf-8,' + encodeURIComponent(this.generatedCode || '')
      : '';
  }
}
