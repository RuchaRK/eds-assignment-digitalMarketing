import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
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

  // digital-marketing
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

    // carousel nav
    const ul = block.querySelector('ul');
    const prevBtn = document.createElement('button');
    prevBtn.className = 'cards-carousel-nav cards-carousel-prev';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.innerHTML = '&#10094;';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'cards-carousel-nav cards-carousel-next';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.innerHTML = '&#10095;';
    block.append(prevBtn, nextBtn);

    // clone items for infinite scroll
    const items = [...ul.children];
    items.forEach((item) => ul.append(item.cloneNode(true)));
    items.forEach((item) => ul.prepend(item.cloneNode(true)));

    // scroll to original set on load
    requestAnimationFrame(() => {
      const cardWidth = 424 + 12;
      ul.scrollLeft = items.length * cardWidth;
    });

    // infinite loop reset
    ul.addEventListener('scroll', () => {
      const cardWidth = 424 + 12;
      const totalOriginal = items.length * cardWidth;
      if (ul.scrollLeft <= 0) {
        ul.style.scrollBehavior = 'auto';
        ul.scrollLeft += totalOriginal;
        ul.style.scrollBehavior = '';
      } else if (ul.scrollLeft >= totalOriginal * 2) {
        ul.style.scrollBehavior = 'auto';
        ul.scrollLeft -= totalOriginal;
        ul.style.scrollBehavior = '';
      }
    });

    prevBtn.addEventListener('click', () => {
      ul.scrollBy({ left: -(424 + 12), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      ul.scrollBy({ left: 424 + 12, behavior: 'smooth' });
    });
  }

  // pricing
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

  // team-members
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

  // company-cards – infinite auto-scrolling logo carousel
  if (block.closest('.company-cards')) {
    const logoUl = block.querySelector('ul');
    const logoItems = [...logoUl.children];
    const logoWidth = 220;
    const logoGap = 40;
    const logoStep = logoWidth + logoGap;

    // clone items for seamless loop
    logoItems.forEach((item) => logoUl.append(item.cloneNode(true)));
    logoItems.forEach((item) => logoUl.append(item.cloneNode(true)));
    logoItems.forEach((item) => logoUl.prepend(item.cloneNode(true)));

    // start in the middle set
    requestAnimationFrame(() => {
      logoUl.style.scrollBehavior = 'auto';
      logoUl.scrollLeft = logoItems.length * logoStep;
      logoUl.style.scrollBehavior = '';
    });

    // infinite loop reset
    logoUl.addEventListener('scroll', () => {
      const total = logoItems.length * logoStep;
      if (logoUl.scrollLeft <= 0) {
        logoUl.style.scrollBehavior = 'auto';
        logoUl.scrollLeft += total;
        logoUl.style.scrollBehavior = '';
      } else if (logoUl.scrollLeft >= total * 2) {
        logoUl.style.scrollBehavior = 'auto';
        logoUl.scrollLeft -= total;
        logoUl.style.scrollBehavior = '';
      }
    });

    // nav buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'company-carousel-nav company-carousel-prev';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.innerHTML = '&#10094;';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'company-carousel-nav company-carousel-next';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.innerHTML = '&#10095;';
    block.append(prevBtn, nextBtn);

    prevBtn.addEventListener('click', () => {
      logoUl.scrollBy({ left: -logoStep, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      logoUl.scrollBy({ left: logoStep, behavior: 'smooth' });
    });

    // auto-scroll
    let autoScroll = setInterval(() => {
      logoUl.scrollBy({ left: logoStep, behavior: 'smooth' });
    }, 2500);

    block.addEventListener('mouseenter', () => clearInterval(autoScroll));
    block.addEventListener('mouseleave', () => {
      autoScroll = setInterval(() => {
        logoUl.scrollBy({ left: logoStep, behavior: 'smooth' });
      }, 2500);
    });
  }

  // marketing-statergy
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