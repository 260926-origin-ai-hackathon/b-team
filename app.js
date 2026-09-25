const app = document.querySelector('#app');

const dogs = [
  { name: 'こむぎ', image: '/public/images/hero.jpg', count: 2, note: 'また一緒に歩けました' },
  { name: 'ルカ', image: '/public/images/dog-2.jpg', count: 1, note: '外の空気が大好き' },
  { name: 'むぎ', image: '/public/images/dog-3.jpg', count: 1, note: '好奇心いっぱい' },
];

const memories = [
  { dog: 0, date: '9月24日(木)', tag: '2回目のおさんぽ' },
  { dog: 1, date: '9月17日(木)', tag: 'はじめまして' },
  { dog: 2, date: '9月10日(木)', tag: 'はじめまして' },
  { dog: 0, date: '9月3日(木)', tag: 'はじめまして' },
];

const faqs = [
  ['犬を飼った経験がなくても参加できますか？', '初回はスタッフが同行し犬との接し方やリードの扱い方を説明します。犬との相性や経験を確認してから出発します。'],
  ['毎回同じ犬と歩きますか？', '担当の犬は毎回スタッフが決定します。初めて会う犬も以前一緒に歩いた犬も担当することがあります。'],
  ['一人でさんぽできますか？', '初回はスタッフが同行します。2回目以降は経験や犬との相性を確認し団体が許可した場合に限り単独でさんぽできます。'],
  ['料金はいくらですか？', '月4回程度の月額プランを予定しています。料金と保護団体への還元率は検討中です。現在は画面の体験ができます。'],
  ['予定が変わった場合は？', '予約画面から別の日時に振替できます。雨天や犬の体調による変更はスタッフからご案内します。'],
];

const savedBooking = JSON.parse(localStorage.getItem('wanpo-booking') || 'null');

const state = {
  screen: location.hash.replace('#', '') || 'landing',
  memberTab: 'home',
  nickname: sessionStorage.getItem('wanpo-name') || '',
  date: '',
  time: '09:00',
  bookingStep: savedBooking ? 'existing' : 'select',
  booking: savedBooking,
  editingBooking: false,
  drawer: false,
  modalDog: null,
};

function pawLogo() {
  return `<span class="paw-logo"><span class="paw-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>わんぽ</span></span>`;
}

function navigate(screen) {
  state.screen = screen;
  location.hash = screen;
  window.scrollTo({ top: 0, behavior: 'instant' });
  render();
}

function landing() {
  return `<main class="screen landing">
    <a class="skip" href="#main">本文へ移動</a>
    <header class="landing-header">
      ${pawLogo()}
      <nav class="landing-nav" aria-label="サービス紹介"><a href="#features">できること</a><a href="#how">ご利用の流れ</a><a href="#questions">よくある質問</a></nav>
      <div class="landing-actions"><button class="ghost-button" data-go="signup">ログイン ↗</button></div>
    </header>
    <section class="hero" id="main">
      <h1><span>一人じゃ続かない運動に</span><span>犬との約束を</span></h1>
      <p class="hero-copy">保護犬とさんぽの約束をして、運動するきっかけを作ります。</p>
      <div class="hero-buttons"><button class="button primary" data-go="signup">さんぽを体験する</button><a class="button light" href="#features">サービスを知る</a></div>
      <img class="hero-image" src="/public/images/hero.jpg" alt="芝生でくつろぐ犬" />
    </section>
    <section class="intro"><h2>さんぽを、義務から楽しみに</h2><p>運動のために頑張るのではなく、犬に会いに行く。<br />その小さな楽しみが、気づけば歩く習慣につながっていきます。</p></section>
    <div class="dog-strip" aria-label="犬たちのフォトギャラリー"><div class="dog-strip-track">
      ${[0,1,2,0,1,2].map(i => `<img src="${dogs[i].image}" alt="${dogs[i].name}のイメージ写真" />`).join('')}
    </div></div>
    <section class="feature-band" id="features"><h2 class="section-heading">月4回 30分<br />まずは歩く習慣から。</h2><div class="feature-grid">
      <article class="feature-card"><span>01</span><b>予定が外出のきっかけに</b><p>都合のよい日時を予約するだけ。週に一度のさんぽが日々の楽しみになります。</p></article>
      <article class="feature-card"><span>02</span><b>新しい出会いも再会も</b><p>担当の犬は当日の受付でご紹介。犬の性格やペースによって体験が変わります。</p></article>
      <article class="feature-card"><span>03</span><b>犬たちの暮らしを支える</b><p>利用料金の一部を保護団体の活動費へ。楽しむ時間が保護犬支援につながります。</p></article>
    </div></section>
    <section class="how-section" id="how"><span class="eyebrow">はじめてでも安心</span><h2 class="section-heading">予約して<br />会いに行こう</h2><p>初回は現地スタッフが同行します<br />犬との接し方から一緒に練習しましょう</p><div class="how-grid"><article><b>01</b><h3>日時を選ぶ</h3><p>月4回程度を目安に予約<br />予定が変わったときは振替できます</p></article><article><b>02</b><h3>当日のパートナーに会う</h3><p>犬の体調と利用者の経験に合わせて<br />スタッフが担当の犬を決めます</p></article><article><b>03</b><h3>さんぽを楽しんで記録する</h3><p>犬のペースに合わせて歩いたら<br />その日の様子や思い出を残しましょう</p></article></div></section>
    <section class="landing-record"><div class="record-preview"><span>今月の記録</span><h3>3頭の犬と4回のさんぽ</h3><div class="preview-dogs">${dogs.map(d => `<div><img src="${d.image}" alt="${d.name}のイメージ写真" /><b>${d.name}</b><small>${d.count}回のさんぽ</small></div>`).join('')}</div><strong>180分のさんぽ時間</strong><small>表示はサンプルです</small></div><div class="record-story"><span class="eyebrow">数字の先にある思い出</span><h2>歩いた分だけ<br />犬との思い出が増える</h2><p>一緒に歩いた犬や再会した回数を記録<br />歩数や時間も振り返ることができます</p></div></section>
    <section class="faq-section" id="questions"><span class="eyebrow">ご利用の前に</span><h2 class="section-heading">よくある質問</h2><div class="faq-list">${faqs.map(([q,a]) => `<details><summary>${q}<span>＋</span></summary><p>${a}</p></details>`).join('')}</div></section>
    <section class="landing-cta"><h2>次の予定に<br />犬とのさんぽを</h2><p>運動も　保護犬支援も</p><button class="button primary" data-go="signup">さんぽを体験する</button></section>
    <footer class="landing-footer"><div>${pawLogo()}<div>犬とのさんぽサブスク</div></div><button class="plain-button credits-link" data-go="credits"><span class="dev-badge">開発版のみ</span> 写真クレジット</button></footer>
  </main>`;
}

function signup() {
  return `<main class="screen auth-screen">
    <header class="simple-header"><button class="plain-button" data-go="landing">${pawLogo()}</button><button class="plain-button" data-go="landing">トップに戻る</button></header>
    <section class="auth-card" aria-labelledby="auth-title">
      <span class="eyebrow">walking member</span><h1 id="auth-title">新規会員登録</h1>
      <p>デモではニックネームだけですぐに始められます。</p>
      <form id="signup-form"><label class="field">ニックネーム<input name="nickname" maxlength="20" required placeholder="例：はる" value="${state.nickname}" autocomplete="off" /></label><button class="button primary" type="submit">会員登録してはじめる</button></form>
      <div class="demo-note">このデモでは個人情報を保存しません。入力した名前はこのタブを閉じるまでだけ使用します。</div>
    </section>
  </main>`;
}

function header() {
  const tabs = [['home','ホーム'],['booking','予約'],['records','マイ記録']];
  return `<header class="app-header"><button class="plain-button app-brand" data-tab="home">${pawLogo()}<small>WALKING CLUB · OSAKA</small></button><nav class="desktop-tabs" aria-label="メインナビゲーション">${tabs.map(([id,label]) => `<button class="nav-button ${state.memberTab===id?'active':''}" data-tab="${id}">${label}</button>`).join('')}</nav><button class="menu-button" data-action="drawer" aria-label="メニューを開く">☰</button></header>`;
}

function bottomNav() {
  return `<nav class="bottom-nav" aria-label="メインナビゲーション"><button class="${state.memberTab==='home'?'active':''}" data-tab="home">⌂<br />ホーム</button><button class="${state.memberTab==='booking'?'active':''}" data-tab="booking">▣<br />予約</button><button class="${state.memberTab==='records'?'active':''}" data-tab="records">▥<br />マイ記録</button></nav>`;
}

function home() {
  const bookingText = state.booking ? `${state.booking.date} ${state.booking.time}〜` : '今月あと 2 回';
  return `<main class="member-main"><h1 class="page-title">${state.nickname || 'ゲスト'}さん、次のさんぽが楽しみになる</h1>
    <section class="surface welcome-card"><div class="welcome-copy"><span class="eyebrow">犬とさんぽの約束</span><h2>${state.booking ? '次の約束があります' : '犬に会いに行こう'}</h2><p>${bookingText}</p><button class="button primary" data-action="${state.booking?'view-booking':'new-booking'}">${state.booking?'予約を確認':'新規予約'}</button></div><div class="welcome-image" role="img" aria-label="芝生にいる犬"></div></section>
    <div class="home-grid"><section class="surface monthly-card"><div class="card-top"><h3>今月のさんぽ</h3><button class="plain-button" data-tab="records">記録を見る →</button></div><div class="stats"><div class="stat"><strong>3頭</strong><span>出会った犬</span></div><div class="stat"><strong>4回</strong><span>おさんぽ</span></div><div class="stat"><strong>120分</strong><span>累計時間</span></div></div></section><section class="surface support-card"><span class="eyebrow">A LITTLE GOOD, TOGETHER</span><strong>500円</strong><p>利用料金の一部が犬たちの食事や日々のケアを支えます。</p></section></div>
  </main>`;
}

function dateChoices() {
  const base = new Date(); base.setDate(base.getDate() + 1);
  const weekdays = ['日','月','火','水','木','金','土'];
  return Array.from({length:7}, (_,i) => { const d = new Date(base); d.setDate(base.getDate()+i); const iso = `${d.getMonth()+1}月${d.getDate()}日(${weekdays[d.getDay()]})`; return `<button class="date-choice ${state.date===iso?'selected':''}" data-date="${iso}"><span>${weekdays[d.getDay()]}</span><strong>${d.getDate()}</strong><span>可</span></button>`; }).join('');
}

function booking() {
  if (state.bookingStep === 'existing' && state.booking) return `<main class="member-main"><h1 class="page-title">次回の予約</h1><section class="surface booking-card existing-booking"><span class="eyebrow">YOUR RESERVATION</span><h2>犬との約束</h2><dl class="confirm-list"><div class="confirm-row"><dt>日時</dt><dd>${state.booking.date}<br />${state.booking.time}〜</dd></div><div class="confirm-row"><dt>さんぽ時間</dt><dd>30分</dd></div><div class="confirm-row"><dt>集合場所</dt><dd>わんぽ 現地受付</dd></div><div class="confirm-row"><dt>担当の犬</dt><dd>当日の受付でご紹介</dd></div></dl><div class="booking-actions-split"><button class="button primary" data-action="edit-booking">予約を変更する</button><button class="button danger" data-action="discard-booking">予約を破棄する</button></div></section></main>`;
  if (state.bookingStep === 'complete' && state.booking) return `<main class="member-main"><h1 class="page-title">予約が完了しました</h1><div class="steps"><div class="step">1 日時を選ぶ</div><div class="step">2 内容を確認</div><div class="step active">3 予約完了</div></div><section class="surface success"><div class="success-icon">✓</div><h2>犬との約束ができました</h2><p class="success-date">${state.booking.date}<br />${state.booking.time}〜</p><p>さんぽは30分<br />当日はわんぽの現地受付へお越しください</p><button class="button primary" data-tab="home">ホームへ戻る</button></section></main>`;
  if (state.bookingStep === 'confirm') return `<main class="member-main"><h1 class="page-title">予約内容の確認</h1><div class="steps"><div class="step">1 日時を選ぶ</div><div class="step active">2 内容を確認</div><div class="step">3 予約完了</div></div><section class="surface booking-card"><span class="eyebrow">YOUR RESERVATION</span><h2>${state.editingBooking?'この日時に変更します':'この内容で予約します'}</h2><dl class="confirm-list"><div class="confirm-row"><dt>日時</dt><dd>${state.date}<br />${state.time}〜</dd></div><div class="confirm-row"><dt>さんぽ時間</dt><dd>30分</dd></div><div class="confirm-row"><dt>集合場所</dt><dd>わんぽ 現地受付</dd></div><div class="confirm-row"><dt>担当の犬</dt><dd>当日の受付でご紹介</dd></div></dl><div class="booking-action"><button class="button primary" data-action="book">${state.editingBooking?'予約変更を確定する':'予約を確定する'}</button></div><button class="plain-button" data-action="change-date">← 日時を変更する</button></section></main>`;
  return `<main class="member-main"><h1 class="page-title">${state.editingBooking?'予約日時を変更する':'新規予約'}</h1><div class="steps"><div class="step active">1 日時を選ぶ</div><div class="step">2 内容を確認</div><div class="step">3 予約完了</div></div><section class="surface booking-card"><span class="eyebrow">CHOOSE YOUR DAY</span><h2>おさんぽの日時</h2><div class="date-grid">${dateChoices()}</div><div class="time-title">時間を選ぶ</div><div class="time-row">${['09:00','10:30','14:00'].map(t => `<button class="time-choice ${state.time===t?'selected':''}" data-time="${t}">${t}</button>`).join('')}</div><div class="booking-action"><button class="button primary" data-action="confirm" ${state.date?'':'disabled'}>予約内容を確認する</button></div><button class="plain-button cancel-flow" data-action="cancel-booking-flow">予約操作をやめる</button></section></main>`;
}

function records() {
  return `<main class="member-main"><h1 class="page-title">さんぽの記録</h1><section class="surface record-hero"><span class="eyebrow">OUR TIME TOGETHER</span><h2>3頭のともだちと<br />4回のおさんぽ</h2><div class="record-stats"><div class="record-stat"><strong>3頭</strong><span>一緒に歩いた犬</span></div><div class="record-stat"><strong>4回</strong><span>さんぽした回数</span></div><div class="record-stat"><strong>120分</strong><span>一緒にいた時間</span></div></div></section>
    <section class="surface record-section"><h2>今月一緒に歩いた犬</h2><p class="section-note">タップで思い出を見る</p><div class="dog-cards">${dogs.map((d,i) => `<button class="dog-card" data-dog="${i}"><img src="${d.image}" alt="${d.name}のイメージ写真" /><div class="dog-card-copy"><strong>${d.name}</strong><p>${d.note}</p><span>${d.count}回のおさんぽ</span></div></button>`).join('')}</div></section>
    <section class="surface record-section"><div class="card-top"><h2>おさんぽの思い出</h2><span>4件</span></div><div class="memory-list">${memories.map(m => `<div class="memory"><img src="${dogs[m.dog].image}" alt="" /><div><b>${dogs[m.dog].name}とおさんぽ</b><small>${m.date} · 30分</small></div><span class="memory-tag">${m.tag}</span></div>`).join('')}</div></section></main>`;
}

function drawer() {
  if (!state.drawer) return '';
  return `<div class="drawer-backdrop" data-action="close-drawer"><aside class="drawer" role="dialog" aria-modal="true"><div class="drawer-head">${pawLogo()}<button class="plain-button" data-action="close-drawer" aria-label="閉じる">✕</button></div><p>${state.nickname || 'ゲスト'}さん</p><nav><button data-tab="home">ホーム</button><button data-tab="booking">${state.booking?'予約を確認':'新規予約'}</button><button data-tab="records">さんぽの記録</button><button data-go="credits">開発用：写真クレジット</button><button data-action="logout">ログアウトして紹介ページへ</button><button class="reset-link" data-action="reset-demo">デモデータをすべて削除</button></nav></aside></div>`;
}

function dogModal() {
  if (state.modalDog === null) return '';
  const d = dogs[state.modalDog];
  return `<div class="modal-backdrop" data-action="close-modal"><button class="modal-close" data-action="close-modal" aria-label="閉じる">✕</button><article class="modal"><img src="${d.image}" alt="${d.name}のイメージ写真" /><div class="modal-copy"><span class="eyebrow">WALKING CLUB</span><h2>${d.name}との思い出</h2><p>${d.count}回いっしょにおさんぽしました。${d.note}。落ち着いて歩けました。</p></div></article></div>`;
}

function member() {
  const content = state.memberTab === 'booking' ? booking() : state.memberTab === 'records' ? records() : home();
  return `<div class="screen member-screen">${header()}${content}${bottomNav()}${drawer()}${dogModal()}</div>`;
}

function credits() {
  return `<main class="screen auth-screen"><header class="simple-header"><button class="plain-button" data-go="landing">${pawLogo()}</button><button class="plain-button" data-go="landing">紹介ページへ戻る</button></header><section class="surface credits"><div class="dev-credit-notice">開発版・審査用デモにのみ表示されるページです</div><span class="eyebrow">DEVELOPMENT PHOTO CREDITS</span><h1>開発用クレジット</h1><p>公開素材の確認用として、デモ環境にだけ出典を掲載しています。写真の犬はイメージです。</p><ul><li>メイン写真：<a href="https://unsplash.com/photos/a-golden-cocker-spaniel-sits-in-a-grassy-field-034JXn3s1XE" target="_blank" rel="noreferrer">Mariia Mariia / Unsplash ↗</a></li><li>ルカのイメージ：<a href="https://unsplash.com/photos/pug-mix-sitting-on-grass-field-JqnmXaZZKSg" target="_blank" rel="noreferrer">Tom Hills / Unsplash ↗</a></li><li>むぎのイメージ：<a href="https://unsplash.com/photos/black-dog-on-brown-grasses-IVX3YgXftjw" target="_blank" rel="noreferrer">Patrick Hendry / Unsplash ↗</a></li></ul><p><a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash Licenseを確認する ↗</a></p></section></main>`;
}

function render() {
  app.innerHTML = state.screen === 'signup' ? signup() : state.screen === 'member' ? member() : state.screen === 'credits' ? credits() : landing();
}

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message; document.body.append(toast); setTimeout(() => toast.remove(), 2300);
}

document.addEventListener('click', e => {
  const target = e.target.closest('[data-go],[data-tab],[data-action],[data-date],[data-time],[data-dog]');
  if (!target) return;
  if (target.dataset.go) { state.drawer = false; navigate(target.dataset.go); }
  if (target.dataset.tab) { state.memberTab = target.dataset.tab; state.drawer = false; if (state.memberTab === 'booking') { state.bookingStep = state.booking ? 'existing' : 'select'; state.editingBooking = false; } render(); window.scrollTo(0,0); }
  if (target.dataset.date) { state.date = target.dataset.date; render(); }
  if (target.dataset.time) { state.time = target.dataset.time; render(); }
  if (target.dataset.dog) { state.modalDog = Number(target.dataset.dog); render(); }
  if (target.dataset.action === 'drawer') { state.drawer = true; render(); }
  if (target.dataset.action === 'close-drawer' && e.target === target || target.dataset.action === 'close-drawer' && target.tagName === 'BUTTON') { state.drawer = false; render(); }
  if (target.dataset.action === 'close-modal' && (e.target === target || target.tagName === 'BUTTON')) { state.modalDog = null; render(); }
  if (target.dataset.action === 'confirm' && state.date) { state.bookingStep = 'confirm'; render(); window.scrollTo(0,0); }
  if (target.dataset.action === 'change-date') { state.bookingStep = 'select'; render(); }
  if (target.dataset.action === 'view-booking') { state.memberTab = 'booking'; state.bookingStep = 'existing'; render(); window.scrollTo(0,0); }
  if (target.dataset.action === 'new-booking') { state.memberTab = 'booking'; state.bookingStep = 'select'; state.editingBooking = false; state.date = ''; state.time = '09:00'; render(); window.scrollTo(0,0); }
  if (target.dataset.action === 'edit-booking') { state.editingBooking = true; state.date = state.booking.date; state.time = state.booking.time; state.bookingStep = 'select'; render(); window.scrollTo(0,0); }
  if (target.dataset.action === 'cancel-booking-flow') { state.bookingStep = state.booking ? 'existing' : 'select'; state.memberTab = state.booking ? 'booking' : 'home'; state.editingBooking = false; render(); window.scrollTo(0,0); }
  if (target.dataset.action === 'discard-booking' && window.confirm('この予約を破棄しますか？')) { state.booking = null; state.date = ''; state.bookingStep = 'select'; state.editingBooking = false; localStorage.removeItem('wanpo-booking'); render(); showToast('予約を破棄しました'); }
  if (target.dataset.action === 'book') { state.booking = { date: state.date, time: state.time }; localStorage.setItem('wanpo-booking', JSON.stringify(state.booking)); state.bookingStep = 'complete'; state.editingBooking = false; render(); window.scrollTo(0,0); showToast('予約を保存しました'); }
  if (target.dataset.action === 'logout') { sessionStorage.removeItem('wanpo-name'); state.nickname = ''; state.drawer = false; navigate('landing'); }
  if (target.dataset.action === 'reset-demo' && window.confirm('ニックネームと予約を削除して、最初の画面に戻りますか？')) { localStorage.removeItem('wanpo-booking'); sessionStorage.removeItem('wanpo-name'); state.booking = null; state.nickname = ''; state.date = ''; state.time = '09:00'; state.bookingStep = 'select'; state.memberTab = 'home'; state.drawer = false; navigate('landing'); }
});

document.addEventListener('submit', e => {
  if (e.target.id !== 'signup-form') return;
  e.preventDefault();
  const data = new FormData(e.target); state.nickname = String(data.get('nickname')).trim();
  if (!state.nickname) return;
  sessionStorage.setItem('wanpo-name', state.nickname); state.screen = 'member'; state.memberTab = 'home'; location.hash = 'member'; render(); window.scrollTo(0,0); showToast(`${state.nickname}さん、ようこそ`);
});

window.addEventListener('hashchange', () => { const next = location.hash.replace('#',''); if (['landing','signup','member','credits'].includes(next)) { state.screen = next; render(); } });

render();
