// Centralized Google tag (gtag.js) injector for Fireus
(function(){
  // Google tag (gtag.js)
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-CD1R4L9KXD';
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);} 
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  gtag('config', 'G-CD1R4L9KXD');
})();
