const app = document.querySelector('#app');
const STORAGE_KEY = 'wanpo-bookings-v2';
const TIMES = ['10:00', '13:00', '15:00', '17:00'];

const facilities = [
  {
    id: 'naniwa',
    name: 'なにわ しっぽホーム',
    address: '大阪市浪速区湊町2丁目（架空）',
    station: 'JR難波駅から徒歩6分',
    hours: '9:00〜18:00',
    area: '大阪市内・浪速公園周辺',
    image: '/public/images/hero.jpg',
  },
  {
    id: 'hokusetsu',
    name: '北摂わんこハウス',
    address: '大阪府吹田市千里丘北3丁目（架空）',
    station: '千里丘駅から徒歩10分',
    hours: '10:00〜18:00',
    area: '北摂・万博公園周辺',
    image: '/public/images/dog-2.jpg',
  },
  {
    id: 'tennoji',
    name: '天王寺クローバーシェルター',
    address: '大阪市天王寺区茶臼山町4丁目（架空）',
    station: '天王寺駅から徒歩8分',
    hours: '9:00〜17:00',
    area: '天王寺公園周辺',
    image: '/public/images/dog-3.jpg',
  },
];

const dogs = [
  { id: 'komugi', facilityId: 'naniwa', name: 'こむぎ', image: '/public/images/hero.jpg', age: '5歳', sex: '女の子', personality: '穏やかで人が大好き', size: '中型', beginner: true, note: 'また一緒に歩けました' },
  { id: 'luka', facilityId: 'naniwa', name: 'ルカ', image: '/public/images/dog-2.jpg', age: '4歳', sex: '男の子', personality: '好奇心旺盛で元気', size: '小型', beginner: true, note: '外の空気が大好き' },
  { id: 'mugi', facilityId: 'hokusetsu', name: 'むぎ', image: '/public/images/dog-3.jpg', age: '6歳', sex: '男の子', personality: '落ち着いてマイペース', size: '中型', beginner: true, note: '好奇心いっぱい' },
  { id: 'milk', facilityId: 'hokusetsu', name: 'ミルク', image: '/public/images/hero.jpg', age: '3歳', sex: '女の子', personality: '明るく散歩が大好き', size: '中型', beginner: false, note: '歩くことが大好き' },
  { id: 'sora', facilityId: 'tennoji', name: 'そら', image: '/public/images/dog-2.jpg', age: '7歳', sex: '男の子', personality: '優しくのんびり', size: '小型', beginner: true, note: 'のんびり歩きます' },
  { id: 'hana', facilityId: 'tennoji', name: 'はな', image: '/public/images/dog-3.jpg', age: '2歳', sex: '女の子', personality: '活発で遊び好き', size: '中型', beginner: false, note: '元気いっぱい' },
];

const memories = [
  { dogId: 'komugi', date: '9月24日', tag: '2回目のおさんぽ' },
  { dogId: 'luka', date: '9月17日', tag: 'はじめまして' },
  { dogId: 'mugi', date: '9月10日', tag: 'はじめまして' },
  { dogId: 'komugi', date: '9月3日', tag: 'はじめまして' },
];

const faqs = [
  ['犬を飼った経験がなくても参加できますか？', '初回はスタッフが同行し犬との接し方やリードの扱い方を説明します。犬との相性や経験を確認してから出発します。'],
  ['毎回同じ犬と歩きますか？', '施設と犬を予約時に選べます。初めて会う犬も、以前一緒に歩いた犬も予約できます。'],
  ['一人でさんぽできますか？', '初回講習後、施設スタッフが安全に歩けると確認した利用者は単独でさんぽできます。デモでは講習受講済みです。'],
  ['料金はいくらですか？', '月額1,000円のサブスクリプションを想定しています。利用料金の一部は提携する保護犬団体へ還元します。'],
  ['予定が変わった場合は？', '予約一覧から予約を取り消し、別の日に新しく予約できます。'],
];

function localDate(offset = 0) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function initialBookings() {
  return [
    { id: 'sample-past', facilityId: 'naniwa', dogId: 'luka', date: localDate(-4), time: '10:00', createdAt: Date.now() - 500000 },
    { id: 'sample-future', facilityId: 'hokusetsu', dogId: 'mugi', date: localDate(2), time: '15:00', createdAt: Date.now() - 400000 },
  ];
}

function loadBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(saved)) return saved;
  } catch (_) {}
  const seeded = initialBookings();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

const otherUserSlots = [
  { facilityId: 'naniwa', dogId: 'komugi', date: localDate(1), time: '13:00' },
  { facilityId: 'hokusetsu', dogId: 'mugi', date: localDate(3), time: '10:00' },
  { facilityId: 'tennoji', dogId: 'hana', date: localDate(5), time: '15:00' },
];

const state = {
  screen: ['landing', 'member', 'credits'].includes(location.hash.replace('#', '')) ? location.hash.replace('#', '') : 'landing',
  memberTab: 'home',
  bookingStep: 'list',
  bookings: loadBookings(),
  draft: { facilityId: '', dogId: '', date: '', time: '' },
  lastCreatedId: null,
  drawer: false,
  modalDog: null,
};

function getFacility(id) { return facilities.find(item => item.id === id); }
function getDog(id) { return dogs.find(item => item.id === id); }
function bookingDate(booking) { return new Date(`${booking.date}T${booking.time}:00`); }
function upcomingBookings() { return state.bookings.filter(item => bookingDate(item) > new Date()).sort((a, b) => bookingDate(a) - bookingDate(b)); }
function completedBookings() { return state.bookings.filter(item => bookingDate(item) <= new Date()).sort((a, b) => bookingDate(b) - bookingDate(a)); }
function formatDate(dateString) { return new Date(`${dateString}T12:00:00`).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' }); }
function endTime(time) { return `${String(Number(time.slice(0, 2)) + 1).padStart(2, '0')}:${time.slice(3)}`; }
function daysUntil(dateString) { const today = new Date(`${localDate()}T00:00:00`); const target = new Date(`${dateString}T00:00:00`); return Math.max(0, Math.round((target - today) / 86400000)); }
function saveBookings() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookings)); }

function pawLogo() {
  return `<span class="paw-logo"><span class="paw-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>わんぽ</span></span>`;
}

function demoBanner(compact = false) {
  return `<div class="demo-banner ${compact ? 'compact' : ''}"><strong>デモサイト</strong><span>表示されている保護犬・施設・予約情報は、ハッカソン用の架空データです。</span></div>`;
}

function navigate(screen) {
  state.screen = screen;
  location.hash = screen;
  window.scrollTo({ top: 0, behavior: 'instant' });
  render();
}

function startBooking() {
  state.screen = 'member';
  state.memberTab = 'booking';
  state.bookingStep = 'facility';
  state.draft = { facilityId: '', dogId: '', date: '', time: '' };
  location.hash = 'member';
  window.scrollTo(0, 0);
  render();
}

function landing() {
  return `<main class="screen landing">
    ${demoBanner()}
    <a class="skip" href="#main">本文へ移動</a>
    <header class="landing-header">
      ${pawLogo()}
      <nav class="landing-nav" aria-label="サービス紹介"><a href="#benefits">できること</a><a href="#how">ご利用の流れ</a><a href="#questions">よくある質問</a></nav>
      <div class="landing-actions"><button class="ghost-button" data-action="start-booking">予約する ↗</button></div>
    </header>
    <section class="hero" id="main">
      <h1><span>保護犬との約束を、</span><span>運動するきっかけに。</span></h1>
      <p class="hero-copy">わんぽは、保護犬との散歩を予約することで運動を習慣化するサービスです。<br />「犬との約束」が、外へ出て歩くきっかけになります。</p>
      <div class="hero-buttons"><button class="button primary" data-action="start-booking">予約する</button><a class="button light" href="#how">利用の流れを見る</a></div>
      <img class="hero-image" src="/public/images/hero.jpg" alt="芝生でくつろぐ犬" />
    </section>
    <section class="business-strip"><div><span>月額</span><strong>1,000円</strong><span>のサブスクリプション</span></div><p>利用料金の一部を、提携する保護犬団体へ還元する想定です。<br /><small>このデモサイトでは決済は行われません。</small></p></section>
    <section class="benefit-section" id="benefits"><span class="eyebrow">THREE GOOD THINGS</span><h2 class="section-heading">歩く時間が、みんなの力に</h2><div class="benefit-grid"><article><span>利用者</span><h3>楽しく運動を続ける</h3><p>犬との約束が外へ出るきっかけになり、無理なく運動習慣をつくれます。</p></article><article><span>保護犬</span><h3>人と歩く機会が増える</h3><p>散歩やふれあいを通して、新しい環境や人に慣れる経験につながります。</p></article><article><span>保護犬団体</span><h3>日々の負担を減らす</h3><p>散歩の負担を減らし、保護活動や譲渡活動により多くの時間を使えます。</p></article></div></section>
    <section class="how-section" id="how"><span class="eyebrow">かんたん5ステップ</span><h2 class="section-heading">予約して<br />会いに行こう</h2><p>デモでは初回講習を受講済みの利用者を想定しています。</p><div class="how-grid five"><article><b>01</b><h3>施設を選ぶ</h3><p>通いやすい大阪の施設を選択</p></article><article><b>02</b><h3>犬を選ぶ</h3><p>性格や相性からパートナーを選択</p></article><article><b>03</b><h3>日時を選ぶ</h3><p>7日間の空き枠から予約</p></article><article><b>04</b><h3>内容を確認</h3><p>犬・施設・時間を確認</p></article><article><b>05</b><h3>一緒に歩く</h3><p>60分のさんぽを楽しむ</p></article></div><button class="button primary" data-action="start-booking">予約する</button></section>
    <section class="landing-record"><div class="record-preview"><span>今月の記録</span><h3>3頭の犬と4回のさんぽ</h3><div class="preview-dogs">${dogs.slice(0, 3).map((dog, index) => `<div><img src="${dog.image}" alt="${dog.name}のイメージ写真" /><b>${dog.name}</b><small>${index === 0 ? 2 : 1}回のさんぽ</small></div>`).join('')}</div><strong>240分のさんぽ時間</strong><small>表示はサンプルです</small></div><div class="record-story"><span class="eyebrow">数字の先にある思い出</span><h2>歩いた分だけ<br />犬との思い出が増える</h2><p>一緒に歩いた犬や再会した回数を記録。<br />将来は散歩中の様子を保護団体や里親候補へつなぎます。</p></div></section>
    <section class="faq-section" id="questions"><span class="eyebrow">ご利用の前に</span><h2 class="section-heading">よくある質問</h2><div class="faq-list">${faqs.map(([question, answer]) => `<details><summary>${question}<span>＋</span></summary><p>${answer}</p></details>`).join('')}</div></section>
    <section class="landing-cta"><h2>次の予定に<br />犬とのさんぽを</h2><p>運動習慣も　保護犬支援も</p><button class="button primary" data-action="start-booking">予約する</button></section>
    <footer class="landing-footer"><div>${pawLogo()}<div>犬との約束で運動習慣をつくる</div></div><button class="plain-button credits-link" data-go="credits"><span class="dev-badge">開発版のみ</span> 写真クレジット</button></footer>
  </main>`;
}

function header() {
  const tabs = [['home', 'ホーム'], ['booking', '予約'], ['records', 'マイ記録']];
  return `${demoBanner(true)}<header class="app-header"><button class="plain-button app-brand" data-tab="home">${pawLogo()}<small>WALKING CLUB · OSAKA</small></button><nav class="desktop-tabs" aria-label="メインナビゲーション">${tabs.map(([id, label]) => `<button class="nav-button ${state.memberTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`).join('')}</nav><button class="menu-button" data-action="drawer" aria-label="メニューを開く">☰</button></header>`;
}

function bottomNav() {
  return `<nav class="bottom-nav" aria-label="メインナビゲーション"><button class="${state.memberTab === 'home' ? 'active' : ''}" data-tab="home">⌂<br />ホーム</button><button class="${state.memberTab === 'booking' ? 'active' : ''}" data-tab="booking">▣<br />予約</button><button class="${state.memberTab === 'records' ? 'active' : ''}" data-tab="records">▥<br />マイ記録</button></nav>`;
}

function home() {
  const upcoming = upcomingBookings();
  const completed = completedBookings();
  const next = upcoming[0];
  const nextDog = next ? getDog(next.dogId) : null;
  const nextFacility = next ? getFacility(next.facilityId) : null;
  const nextCard = next ? `<section class="surface next-promise"><img src="${nextDog.image}" alt="${nextDog.name}のイメージ写真" /><div><span class="eyebrow">NEXT PROMISE</span><div class="days-badge">あと${daysUntil(next.date)}日</div><h2>${nextDog.name}とお散歩</h2><p><strong>${formatDate(next.date)} ${next.time}〜${endTime(next.time)}</strong><br />${nextFacility.name}<br />散歩時間 60分</p><button class="button primary" data-tab="booking">予約を確認</button></div></section>` : `<section class="surface empty-promise"><h2>次の約束をつくろう</h2><p>犬との予定が、外へ出て歩くきっかけになります。</p><button class="button primary" data-action="start-booking">予約する</button></section>`;
  const thisWeek = upcoming.filter(item => daysUntil(item.date) <= 7).length;
  return `<main class="member-main"><h1 class="page-title">次のさんぽが楽しみになる</h1>${nextCard}<section class="surface monthly-card activity-card"><div class="card-top"><h3>運動習慣の記録</h3><button class="plain-button" data-tab="records">記録を見る →</button></div><div class="stats"><div class="stat"><strong>${thisWeek}回</strong><span>今週の予定</span></div><div class="stat"><strong>${completed.length}回</strong><span>完了した散歩</span></div><div class="stat"><strong>${state.bookings.length}回</strong><span>これまでの約束</span></div></div></section><section class="surface support-inline"><div><span class="eyebrow">MONTHLY PLAN</span><h3>月額1,000円</h3></div><p>利用料金の一部を提携する保護犬団体へ還元する想定です。<br /><small>デモでは決済を行いません。</small></p></section></main>`;
}

function bookingSteps(active) {
  const steps = [['facility', '1 施設'], ['dog', '2 犬'], ['date', '3 日時'], ['confirm', '4 確認'], ['complete', '5 完了']];
  return `<div class="steps booking-steps">${steps.map(([id, label]) => `<div class="step ${id === active ? 'active' : ''}">${label}</div>`).join('')}</div>`;
}

function bookingList() {
  const upcoming = upcomingBookings();
  return `<main class="member-main"><div class="page-title-row"><div><span class="eyebrow">YOUR RESERVATIONS</span><h1 class="page-title">予約の確認</h1></div><button class="button primary" data-action="start-booking">新規予約</button></div>${upcoming.length ? `<div class="reservation-list">${upcoming.map(item => { const dog = getDog(item.dogId); const facility = getFacility(item.facilityId); return `<article class="surface reservation-card"><img src="${dog.image}" alt="${dog.name}のイメージ写真" /><div><span class="days-badge">あと${daysUntil(item.date)}日</span><h2>${dog.name}とお散歩</h2><p><strong>${formatDate(item.date)} ${item.time}〜${endTime(item.time)}</strong><br />${facility.name} · 60分</p></div><button class="plain-button danger-link" data-delete-booking="${item.id}">予約を取り消す</button></article>`; }).join('')}</div>` : `<section class="surface empty-promise"><h2>未来の予約はありません</h2><p>通いやすい施設と会いたい犬を選んで、次の約束をつくりましょう。</p><button class="button primary" data-action="start-booking">予約する</button></section>`}</main>`;
}

function facilityStep() {
  return `<main class="member-main"><h1 class="page-title">施設を選ぶ</h1>${bookingSteps('facility')}<p class="booking-guide">通いやすい大阪の保護犬施設を1つ選んでください。</p><div class="facility-grid">${facilities.map(facility => { const count = dogs.filter(dog => dog.facilityId === facility.id).length; return `<button class="surface facility-card ${state.draft.facilityId === facility.id ? 'selected' : ''}" data-facility="${facility.id}"><img src="${facility.image}" alt="${facility.name}のイメージ" /><div><span class="fiction-badge">架空施設</span><h2>${facility.name}</h2><p>${facility.address}</p><dl><div><dt>所属犬</dt><dd>${count}頭</dd></div><div><dt>営業時間</dt><dd>${facility.hours}</dd></div><div><dt>最寄駅</dt><dd>${facility.station}</dd></div><div><dt>散歩エリア</dt><dd>${facility.area}</dd></div></dl></div></button>`; }).join('')}</div><button class="plain-button cancel-flow" data-action="cancel-booking-flow">予約操作をやめる</button></main>`;
}

function dogStep() {
  const facility = getFacility(state.draft.facilityId);
  const choices = dogs.filter(dog => dog.facilityId === facility.id);
  return `<main class="member-main"><h1 class="page-title">一緒に歩く犬を選ぶ</h1>${bookingSteps('dog')}<p class="booking-guide">${facility.name}にいる犬から1頭選んでください。散歩時間は60分です。</p><div class="booking-dog-grid">${choices.map(dog => `<button class="surface booking-dog-card" data-booking-dog="${dog.id}"><img src="${dog.image}" alt="${dog.name}のイメージ写真" /><div><span class="${dog.beginner ? 'beginner-badge' : 'experience-badge'}">${dog.beginner ? '初心者向け' : '経験者向け'}</span><h2>${dog.name}</h2><p>${dog.age} · ${dog.sex} · ${dog.size}</p><p class="dog-personality">${dog.personality}</p><dl><div><dt>散歩時間</dt><dd>60分</dd></div><div><dt>所属施設</dt><dd>${facility.name}</dd></div></dl></div></button>`).join('')}</div><button class="plain-button back-flow" data-action="back-facility">← 施設を選び直す</button></main>`;
}

function dayOptions() {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return Array.from({ length: 7 }, (_, index) => {
    const iso = localDate(index);
    const date = new Date(`${iso}T12:00:00`);
    const selected = state.draft.date === iso;
    const userBooked = state.bookings.some(item => item.date === iso && bookingDate(item) > new Date());
    return `<button class="date-choice ${selected ? 'selected' : ''} ${userBooked ? 'has-own-booking' : ''}" data-booking-date="${iso}"><span>${weekdays[date.getDay()]}</span><strong>${date.getDate()}</strong><span>${userBooked ? '予約あり' : '選択'}</span></button>`;
  }).join('');
}

function slotReason(date, time) {
  if (!date) return '日付を選択';
  if (new Date(`${date}T${time}:00`) <= new Date()) return '受付終了';
  if (state.bookings.some(item => item.date === date)) return '自分の予約あり';
  if (otherUserSlots.some(item => item.date === date && item.time === time && item.facilityId === state.draft.facilityId)) return '予約済み';
  return '';
}

function dateStep() {
  const dog = getDog(state.draft.dogId);
  return `<main class="member-main"><h1 class="page-title">日時を選ぶ</h1>${bookingSteps('date')}<div class="selected-dog-mini"><img src="${dog.image}" alt="" /><div><span>${getFacility(dog.facilityId).name}</span><strong>${dog.name} · 60分</strong></div></div><section class="surface booking-card"><span class="eyebrow">TODAY + 7 DAYS</span><h2>おさんぽの日</h2><div class="date-grid">${dayOptions()}</div><div class="time-title">時間を選ぶ</div><div class="slot-grid">${TIMES.map(time => { const reason = slotReason(state.draft.date, time); return `<button class="time-choice ${state.draft.time === time ? 'selected' : ''}" data-booking-time="${time}" ${reason ? 'disabled' : ''}><strong>${time}</strong><span>${reason || '空き'}</span></button>`; }).join('')}</div><div class="booking-action"><button class="button primary" data-action="to-confirm" ${state.draft.date && state.draft.time ? '' : 'disabled'}>予約内容を確認する</button></div></section><button class="plain-button back-flow" data-action="back-dog">← 犬を選び直す</button><button class="plain-button cancel-flow" data-action="cancel-booking-flow">予約操作をやめる</button></main>`;
}

function confirmStep() {
  const dog = getDog(state.draft.dogId);
  const facility = getFacility(state.draft.facilityId);
  return `<main class="member-main"><h1 class="page-title">予約内容の確認</h1>${bookingSteps('confirm')}<section class="surface booking-confirm"><img src="${dog.image}" alt="${dog.name}のイメージ写真" /><div><span class="eyebrow">YOUR RESERVATION</span><h2>${dog.name}とのお散歩</h2><dl class="confirm-list"><div class="confirm-row"><dt>施設</dt><dd>${facility.name}</dd></div><div class="confirm-row"><dt>日時</dt><dd>${formatDate(state.draft.date)}<br />${state.draft.time}〜${endTime(state.draft.time)}</dd></div><div class="confirm-row"><dt>散歩時間</dt><dd>60分</dd></div><div class="confirm-row"><dt>散歩エリア</dt><dd>${facility.area}</dd></div></dl><button class="button primary" data-action="book">予約を確定する</button><button class="plain-button back-flow" data-action="back-date">← 日時を変更する</button></div></section></main>`;
}

function completeStep() {
  const item = state.bookings.find(booking => booking.id === state.lastCreatedId);
  if (!item) { state.bookingStep = 'list'; return bookingList(); }
  const dog = getDog(item.dogId);
  const facility = getFacility(item.facilityId);
  return `<main class="member-main"><h1 class="page-title">予約が完了しました</h1>${bookingSteps('complete')}<section class="surface booking-complete"><div class="success-icon">✓</div><img src="${dog.image}" alt="${dog.name}のイメージ写真" /><h2>${dog.name}との約束ができました</h2><p class="success-date">${formatDate(item.date)}<br />${item.time}〜${endTime(item.time)}</p><p><strong>${facility.name}</strong><br />${facility.address}<br />散歩時間 60分</p><button class="button primary" data-tab="home">トップへ戻る</button></section></main>`;
}

function booking() {
  if (state.bookingStep === 'facility') return facilityStep();
  if (state.bookingStep === 'dog') return dogStep();
  if (state.bookingStep === 'date') return dateStep();
  if (state.bookingStep === 'confirm') return confirmStep();
  if (state.bookingStep === 'complete') return completeStep();
  return bookingList();
}

function records() {
  const completed = completedBookings();
  return `<main class="member-main"><h1 class="page-title">さんぽの記録</h1><section class="surface record-hero"><span class="eyebrow">OUR TIME TOGETHER</span><h2>3頭のともだちと<br />4回のおさんぽ</h2><div class="record-stats"><div class="record-stat"><strong>3頭</strong><span>一緒に歩いた犬</span></div><div class="record-stat"><strong>4回</strong><span>さんぽした回数</span></div><div class="record-stat"><strong>240分</strong><span>一緒にいた時間</span></div></div></section><section class="surface record-section"><h2>今月一緒に歩いた犬</h2><p class="section-note">タップで思い出を見る</p><div class="dog-cards">${dogs.slice(0, 3).map((dog, index) => `<button class="dog-card" data-dog="${dog.id}"><img src="${dog.image}" alt="${dog.name}のイメージ写真" /><div class="dog-card-copy"><strong>${dog.name}</strong><p>${dog.note}</p><span>${index === 0 ? 2 : 1}回のおさんぽ</span></div></button>`).join('')}</div></section><section class="surface record-section"><div class="card-top"><h2>おさんぽの思い出</h2><span>${Math.max(4, completed.length)}件</span></div><div class="memory-list">${memories.map(memory => { const dog = getDog(memory.dogId); return `<div class="memory"><img src="${dog.image}" alt="" /><div><b>${dog.name}とおさんぽ</b><small>${memory.date} · 60分</small></div><span class="memory-tag">${memory.tag}</span></div>`; }).join('')}</div><p class="future-note">将来は散歩中の様子を蓄積し、保護団体や里親候補が犬の日常的な性格を知る材料につなげます。</p></section></main>`;
}

function drawer() {
  if (!state.drawer) return '';
  return `<div class="drawer-backdrop" data-action="close-drawer"><aside class="drawer" role="dialog" aria-modal="true"><div class="drawer-head">${pawLogo()}<button class="plain-button" data-action="close-drawer" aria-label="閉じる">✕</button></div><p><span class="fiction-badge">初回講習 受講済み</span></p><nav><button data-tab="home">ホーム</button><button data-tab="booking">予約の確認・新規予約</button><button data-tab="records">さんぽの記録</button><button data-go="credits">開発用：写真クレジット</button><button data-go="landing">サービス紹介へ戻る</button><button class="reset-link" data-action="reset-demo">デモデータを初期状態に戻す</button></nav></aside></div>`;
}

function dogModal() {
  if (!state.modalDog) return '';
  const dog = getDog(state.modalDog);
  return `<div class="modal-backdrop" data-action="close-modal"><button class="modal-close" data-action="close-modal" aria-label="閉じる">✕</button><article class="modal"><img src="${dog.image}" alt="${dog.name}のイメージ写真" /><div class="modal-copy"><span class="eyebrow">WALKING CLUB</span><h2>${dog.name}との思い出</h2><p>一緒に歩いた日の記録です。${dog.note}。落ち着いて60分歩けました。</p></div></article></div>`;
}

function member() {
  const content = state.memberTab === 'booking' ? booking() : state.memberTab === 'records' ? records() : home();
  return `<div class="screen member-screen">${header()}${content}${bottomNav()}${drawer()}${dogModal()}</div>`;
}

function credits() {
  return `<main class="screen auth-screen"><header class="simple-header"><button class="plain-button" data-go="landing">${pawLogo()}</button><button class="plain-button" data-go="landing">紹介ページへ戻る</button></header><section class="surface credits"><div class="dev-credit-notice">開発版・審査用デモにのみ表示されるページです</div><span class="eyebrow">DEVELOPMENT PHOTO CREDITS</span><h1>開発用クレジット</h1><p>公開素材の確認用として、デモ環境にだけ出典を掲載しています。写真の犬・施設・予約情報はすべてイメージまたは架空データです。</p><ul><li>メイン写真：<a href="https://unsplash.com/photos/a-golden-cocker-spaniel-sits-in-a-grassy-field-034JXn3s1XE" target="_blank" rel="noreferrer">Mariia Mariia / Unsplash ↗</a></li><li>ルカのイメージ：<a href="https://unsplash.com/photos/pug-mix-sitting-on-grass-field-JqnmXaZZKSg" target="_blank" rel="noreferrer">Tom Hills / Unsplash ↗</a></li><li>むぎのイメージ：<a href="https://unsplash.com/photos/black-dog-on-brown-grasses-IVX3YgXftjw" target="_blank" rel="noreferrer">Patrick Hendry / Unsplash ↗</a></li></ul><p><a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash Licenseを確認する ↗</a></p></section></main>`;
}

function render() {
  app.innerHTML = state.screen === 'member' ? member() : state.screen === 'credits' ? credits() : landing();
}

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 2300);
}

function draftConflict() {
  if (state.bookings.some(item => item.date === state.draft.date)) return '同じ日には複数の予約を登録できません。';
  if (state.bookings.some(item => item.date === state.draft.date && item.time === state.draft.time)) return '既存の予約と時間が重なっています。';
  if (state.bookings.some(item => item.dogId === state.draft.dogId && item.date === state.draft.date && item.time === state.draft.time)) return '同じ犬・日時の予約がすでにあります。';
  if (otherUserSlots.some(item => item.facilityId === state.draft.facilityId && item.date === state.draft.date && item.time === state.draft.time)) return 'この時間はすでに予約済みです。';
  return '';
}

document.addEventListener('click', event => {
  const target = event.target.closest('[data-go],[data-tab],[data-action],[data-facility],[data-booking-dog],[data-booking-date],[data-booking-time],[data-delete-booking],[data-dog]');
  if (!target) return;
  if (target.dataset.go) { state.drawer = false; navigate(target.dataset.go); return; }
  if (target.dataset.tab) { state.screen = 'member'; state.memberTab = target.dataset.tab; state.drawer = false; if (state.memberTab === 'booking') state.bookingStep = 'list'; location.hash = 'member'; render(); window.scrollTo(0, 0); return; }
  if (target.dataset.facility) { state.draft.facilityId = target.dataset.facility; state.draft.dogId = ''; state.bookingStep = 'dog'; render(); window.scrollTo(0, 0); return; }
  if (target.dataset.bookingDog) { state.draft.dogId = target.dataset.bookingDog; state.draft.date = ''; state.draft.time = ''; state.bookingStep = 'date'; render(); window.scrollTo(0, 0); return; }
  if (target.dataset.bookingDate) { state.draft.date = target.dataset.bookingDate; state.draft.time = ''; render(); return; }
  if (target.dataset.bookingTime && !target.disabled) { state.draft.time = target.dataset.bookingTime; render(); return; }
  if (target.dataset.dog) { state.modalDog = target.dataset.dog; render(); return; }
  if (target.dataset.deleteBooking) {
    if (window.confirm('この予約を取り消しますか？')) {
      state.bookings = state.bookings.filter(item => item.id !== target.dataset.deleteBooking);
      saveBookings();
      render();
      showToast('予約を取り消しました');
    }
    return;
  }
  const action = target.dataset.action;
  if (action === 'start-booking') { startBooking(); return; }
  if (action === 'drawer') { state.drawer = true; render(); return; }
  if (action === 'close-drawer' && (event.target === target || target.tagName === 'BUTTON')) { state.drawer = false; render(); return; }
  if (action === 'close-modal' && (event.target === target || target.tagName === 'BUTTON')) { state.modalDog = null; render(); return; }
  if (action === 'back-facility') { state.bookingStep = 'facility'; render(); window.scrollTo(0, 0); return; }
  if (action === 'back-dog') { state.bookingStep = 'dog'; render(); window.scrollTo(0, 0); return; }
  if (action === 'back-date') { state.bookingStep = 'date'; render(); window.scrollTo(0, 0); return; }
  if (action === 'cancel-booking-flow') { state.bookingStep = 'list'; state.memberTab = upcomingBookings().length ? 'booking' : 'home'; render(); window.scrollTo(0, 0); return; }
  if (action === 'to-confirm') {
    const conflict = draftConflict();
    if (conflict) { showToast(conflict); return; }
    state.bookingStep = 'confirm'; render(); window.scrollTo(0, 0); return;
  }
  if (action === 'book') {
    const conflict = draftConflict();
    if (conflict) { state.bookingStep = 'date'; render(); showToast(conflict); return; }
    const booking = { id: crypto.randomUUID(), ...state.draft, createdAt: Date.now() };
    state.bookings.push(booking);
    state.lastCreatedId = booking.id;
    saveBookings();
    state.bookingStep = 'complete';
    render();
    window.scrollTo(0, 0);
    showToast('予約を保存しました');
    return;
  }
  if (action === 'reset-demo' && window.confirm('予約データを初期状態に戻しますか？')) {
    localStorage.removeItem(STORAGE_KEY);
    state.bookings = loadBookings();
    state.bookingStep = 'list';
    state.memberTab = 'home';
    state.drawer = false;
    render();
    showToast('デモデータを初期状態に戻しました');
  }
});

window.addEventListener('hashchange', () => {
  const next = location.hash.replace('#', '');
  if (['landing', 'member', 'credits'].includes(next)) { state.screen = next; render(); }
});

render();
