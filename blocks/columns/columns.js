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
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }

      // convert markdown-style headings (## text) to real <h2> elements
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
}