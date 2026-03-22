export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }

      // convert markdown-style headings
      col.querySelectorAll('p').forEach((p) => {
        const text = p.textContent.trim();
        const match = text.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const heading = document.createElement(`h${level}`);
          heading.textContent = match[2];
          p.replaceWith(heading);
        }
      });
    });
  });

  // customer-feedback auto-rotate
  if (block.closest('.customer-feedback')) {
    const slides = [...block.children];
    if (slides.length > 1) {
      slides[0].classList.add('active');
      let current = 0;
      setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 5000);
    }
  }
}