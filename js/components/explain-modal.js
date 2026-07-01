/**
 * LU5CTW RF Lab — Modal de explicaciones "¿Qué significa?"
 */

let overlay = null;

/**
 * Inicializa el sistema de modales de explicación.
 */
export function initExplainModal() {
  if (overlay) return;

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title" id="explain-title"></h2>
        <button class="modal__close" aria-label="Cerrar">&times;</button>
      </div>
      <div class="modal__body" id="explain-body"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('.modal__close').addEventListener('click', closeExplain);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeExplain();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('modal-overlay--open')) {
      closeExplain();
    }
  });
}

/**
 * Abre el modal con título y contenido HTML.
 * @param {string} title
 * @param {string} htmlContent
 */
export function openExplain(title, htmlContent) {
  if (!overlay) initExplainModal();
  overlay.querySelector('#explain-title').textContent = title;
  overlay.querySelector('#explain-body').innerHTML = htmlContent;
  overlay.classList.add('modal-overlay--open');
  document.body.style.overflow = 'hidden';
}

/** Cierra el modal de explicación. */
export function closeExplain() {
  if (!overlay) return;
  overlay.classList.remove('modal-overlay--open');
  document.body.style.overflow = '';
}

/**
 * Crea un botón "¿Qué significa?" vinculado a una explicación.
 * @param {string} title
 * @param {string} htmlContent
 * @returns {HTMLButtonElement}
 */
export function createExplainButton(title, htmlContent) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-explain';
  btn.textContent = '?';
  btn.title = '¿Qué significa?';
  btn.setAttribute('aria-label', `¿Qué significa ${title}?`);
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openExplain(title, htmlContent);
  });
  return btn;
}
