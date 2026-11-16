(() => {
  'use strict';

  const titleEl = document.getElementById('app-title');
  const eyebrowEl = document.getElementById('app-eyebrow');
  const dosEl = document.getElementById('dos');
  const customStageEl = document.getElementById('custom-stage');
  const tabs = document.querySelectorAll('.ver-tab');

  const meta = {
    'hanme': {
      title: '한메타자교사 3.0',
      eyebrow: 'ORIGINAL DOS PROGRAM · 1994',
    },
    '97': {
      title: '한컴타자연습 97',
      eyebrow: 'ORIGINAL DOS PROGRAM · 1997',
    },
  };

  function switchVersion(ver) {
    if (!meta[ver]) return;
    window.currentActiveVersion = ver;

    tabs.forEach(t => {
      t.classList.toggle('active', t.dataset.ver === ver);
    });

    if (titleEl) titleEl.textContent = meta[ver].title;
    if (eyebrowEl) eyebrowEl.textContent = meta[ver].eyebrow;

    if (customStageEl) {
      customStageEl.innerHTML = '';
      customStageEl.classList.remove('active');
    }
    if (dosEl) {
      dosEl.style.display = 'block';
    }

    if (typeof window.launchDosGame === 'function') {
      window.launchDosGame(ver);
    }

    const url = new URL(window.location);
    url.searchParams.set('v', ver);
    window.history.replaceState({}, '', url);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchVersion(tab.dataset.ver);
    });
  });

  const initVer = new URLSearchParams(window.location.search).get('v');
  if (initVer && meta[initVer] && initVer !== '97') {
    switchVersion(initVer);
  }
})();
