/**
 * LU5CTW RF Lab — Home page
 */

import { TOOLS } from './core/tools-registry.js';

function renderToolCards() {
  const grid = document.getElementById('tools-grid');
  if (!grid) return;

  grid.innerHTML = TOOLS.map((tool) => `
    <a href="${tool.path}" class="tool-card">
      <div class="tool-card__icon">${tool.icon}</div>
      <div class="tool-card__title">${tool.title}</div>
      <div class="tool-card__desc">${tool.description}</div>
      <span class="tool-card__badge">Disponible</span>
    </a>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderToolCards();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
