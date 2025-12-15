// include básico
const host = document.querySelector('[data-include]');
if (host) {
    fetch(host.getAttribute('data-include'))
    .then(r => r.text())
    .then(html => { host.outerHTML = html; })
    .then(() => {
        // marca activa según URL actual (quita /index.html si lo hay)
        const here = location.pathname.replace(/\/index\.html$/, '/');
        document.querySelectorAll('.tabbar a').forEach(a => {
        const href = (a.getAttribute('href')||'').replace(/\/index\.html$/, '/');
        if (href && here.startsWith(href)) a.setAttribute('aria-current','page');
        else a.removeAttribute('aria-current');
        });
    });
}