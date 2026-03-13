
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

   
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

   
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);

  
  if (block.closest('.marketing-tabs')) {
    block.querySelectorAll('.tabs-panel > div').forEach((inner) => {
      const panel = inner.closest('.tabs-panel');
      const tabId = panel.getAttribute('aria-labelledby');
      const tabName = block.querySelector(`#${tabId}`)?.textContent.trim() || '';

      
      const picture = inner.querySelector('picture');
      let imageCol = null;
      if (picture) {
        const picP = picture.closest('p');
        picture.remove();
        picP.querySelectorAll('br').forEach((br) => br.remove());
        if (!picP.textContent.trim() && !picP.querySelector('a')) picP.remove();
        imageCol = document.createElement('div');
        imageCol.className = 'tabs-panel-image';
        const imgLabel = document.createElement('div');
        imgLabel.className = 'tabs-image-label';
        imgLabel.textContent = tabName;
        imageCol.append(picture, imgLabel);
      }

      
      [...inner.querySelectorAll('p:not(.button-wrapper)')].forEach((p) => {
        const strongs = [...p.querySelectorAll('strong')];
        if (strongs.length < 2) return;
       
        const firstText = [...p.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
        if (firstText) {
          const descP = document.createElement('p');
          descP.textContent = firstText.textContent.trim();
          p.before(descP);
          firstText.remove();
          const leadBr = p.firstChild;
          if (leadBr?.tagName === 'BR') leadBr.remove();
        }
        
        for (let i = 0; i + 1 < strongs.length; i += 2) {
          const bar = document.createElement('div');
          bar.className = 'tabs-progress';
          bar.innerHTML = `<div class="tabs-progress-meta"><span>${strongs[i].textContent.trim()}</span><span class="tabs-progress-pct">${strongs[i + 1].textContent.trim()}</span></div><div class="tabs-progress-track"><div class="tabs-progress-fill" style="width:${strongs[i + 1].textContent.trim()}"></div></div>`;
          p.before(bar);
        }
        p.remove();
      });

      const contentCol = document.createElement('div');
      contentCol.className = 'tabs-panel-content';
      while (inner.firstChild) contentCol.append(inner.firstChild);
      inner.append(contentCol);
      if (imageCol) inner.append(imageCol);
    });
  }
}