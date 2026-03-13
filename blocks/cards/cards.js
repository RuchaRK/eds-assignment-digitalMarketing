import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
 
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);

  
  if (block.closest('.digital-marketing')) {
    block.querySelectorAll('.cards-card-body p').forEach((p) => {
      const strong = p.querySelector('strong');
      if (!strong) return;
      const title = document.createElement('h3');
      title.textContent = strong.textContent;
      const subtitle = document.createElement('p');
      subtitle.textContent = p.textContent.replace(strong.textContent, '').trim();
      p.replaceWith(title, subtitle);
    });

    block.querySelectorAll('.cards-card-image').forEach((imgDiv) => {
      const overlay = document.createElement('div');
      overlay.className = 'cards-gallery-overlay';
      const btn = document.createElement('button');
      btn.className = 'cards-gallery-btn';
      btn.setAttribute('aria-label', 'View');
      btn.textContent = '+';
      overlay.append(btn);
      imgDiv.append(overlay);
    });

    const h2 = block.closest('.digital-marketing').querySelector('h2');
    if (h2) h2.innerHTML = h2.textContent.replace('Marketing', '<em>Marketing</em>');
  }

 
  if (block.closest('.pricing')) {
    const sectionH2 = block.closest('.pricing').querySelector('.default-content-wrapper h2');
    if (sectionH2) sectionH2.innerHTML = sectionH2.textContent.replace('Package', '<em>Package</em>');

    block.querySelectorAll('.cards-card-body').forEach((body) => {
      
      const priceEl = body.querySelector('p:first-child, h3:first-child');
      if (priceEl) {
        const numMatch = priceEl.textContent.match(/(\d+)/);
        if (numMatch) {
          const priceP = document.createElement('p');
          priceP.className = 'cards-price';
          priceP.innerHTML = `<span class="cards-price-num">${numMatch[1]}</span><span class="cards-price-unit"> $/Monthly</span>`;
          priceEl.replaceWith(priceP);
        }
      }

     
      const featureUl = body.querySelector('ul');
      if (featureUl) {
        const lastLi = featureUl.lastElementChild;
        const link = lastLi?.querySelector('a');
        if (link) {
          const { href } = link;
          const text = link.textContent.trim();
          lastLi.querySelectorAll('br').forEach((br) => br.remove());
         
          let wrapper = link;
          while (wrapper.parentElement !== lastLi) wrapper = wrapper.parentElement;
          wrapper.remove();
          
          const btnWrapper = document.createElement('p');
          btnWrapper.className = 'button-wrapper';
          const btn = document.createElement('a');
          btn.className = 'button';
          btn.href = href;
          btn.textContent = text;
          btnWrapper.append(btn);
          featureUl.after(btnWrapper);
        }
      }
    });
  }

 
  if (block.closest('.team-members')) {
    const sectionH2 = block.closest('.team-members').querySelector('.default-content-wrapper h2');
    if (sectionH2) sectionH2.innerHTML = sectionH2.textContent.replace('Professionals', '<em>Professionals</em>');

    block.querySelectorAll('.cards-card-body p').forEach((p) => {
      const strong = p.querySelector('strong');
      if (!strong) return;
      const name = document.createElement('h3');
      name.textContent = strong.textContent;
      const role = document.createElement('p');
      role.textContent = p.textContent.replace(strong.textContent, '').trim();
      const social = document.createElement('div');
      social.className = 'team-social';
      [['Facebook', 'f'], ['Twitter', '𝕏'], ['Tumblr', 't'], ['Vimeo', 'v']].forEach(([label, icon]) => {
        const a = document.createElement('a');
        a.href = '#';
        a.setAttribute('aria-label', label);
        a.textContent = icon;
        social.append(a);
      });
      p.replaceWith(name, role, social);
    });
  }

  
  if (block.closest('.marketing-statergy')) {
    block.querySelectorAll('.cards-card-body p').forEach((p) => {
      const strong = p.querySelector('strong');
      if (!strong) return;
      const title = document.createElement('h3');
      title.textContent = strong.textContent;
      const desc = document.createElement('p');
      desc.textContent = p.textContent.replace(strong.textContent, '').trim();
      const btnWrapper = document.createElement('p');
      btnWrapper.className = 'button-wrapper';
      const btn = document.createElement('a');
      btn.className = 'button primary';
      btn.href = '#';
      btn.setAttribute('aria-label', `Learn more about ${title.textContent}`);
      btn.textContent = '→';
      btnWrapper.append(btn);
      p.replaceWith(title, desc, btnWrapper);
    });
  }
}