/**
 * LU5CTW RF Lab — Home page
 */

import { TOOLS } from './core/tools-registry.js';

function renderToolCards() {
  const grid = document.getElementById('tools-grid');
  if (!grid) return;

  grid.innerHTML = TOOLS.map((tool) => {
    if (tool.available) {
      return `
        <a href="${tool.path}" class="tool-card">
          <div class="tool-card__icon">${tool.icon}</div>
          <div class="tool-card__title">${tool.title}</div>
          <div class="tool-card__desc">${tool.description}</div>
          <span class="tool-card__badge">Disponible</span>
        </a>
      `;
    }
    return `
      <div class="tool-card tool-card--disabled">
        <div class="tool-card__icon">${tool.icon}</div>
        <div class="tool-card__title">${tool.title}</div>
        <div class="tool-card__desc">${tool.description}</div>
        <span class="tool-card__badge tool-card__badge--soon">Próximamente</span>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderToolCards();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
