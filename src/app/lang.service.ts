import { Injectable } from '@angular/core';
import { Lang, Translations, translations } from './i18n';

@Injectable({ providedIn: 'root' })
export class LangService {
  lang: Lang = (localStorage.getItem('lang') as Lang) ?? 'ja';

  get t(): Translations {
    return translations[this.lang];
  }

  setLang(l: Lang): void {
    this.lang = l;
    localStorage.setItem('lang', l);
  }
}
