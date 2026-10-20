/* ── 검색 ─────────────────────────────── */
const form = document.getElementById("searchForm");
const query = document.getElementById("query");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = query.value.trim();
  if (!q) return;
  location.href = "https://www.google.com/search?q=" + encodeURIComponent(q);
});

document.getElementById("luckyBtn").addEventListener("click", () => {
  const q = query.value.trim();
  if (!q) return query.focus();
  location.href =
    "https://www.google.com/search?btnI=I&q=" + encodeURIComponent(q);
});

document.querySelector(".mic").addEventListener("click", () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return alert("이 브라우저는 음성 검색을 지원하지 않습니다.");
  const rec = new SR();
  rec.lang = "ko-KR";
  rec.onresult = (ev) => {
    query.value = ev.results[0][0].transcript;
    form.requestSubmit();
  };
  rec.start();
});

/* ── 날씨 ─────────────────────────────── */
const CITIES = [
  { key: "seoul", name: "서울", lat: 37.5665, lon: 126.978 },
  { key: "jeju", name: "제주", lat: 33.4996, lon: 126.5312 },
];

const WEATHER = {
  0:  ["☀️", "맑음"],
  1:  ["🌤️", "대체로 맑음"],
  2:  ["⛅", "구름 조금"],
  3:  ["☁️", "흐림"],
  45: ["🌫️", "안개"],
  48: ["🌫️", "서리 안개"],
  51: ["🌦️", "약한 이슬비"],
  53: ["🌦️", "이슬비"],
  55: ["🌧️", "강한 이슬비"],
  56: ["🌧️", "어는 이슬비"],
  57: ["🌧️", "강한 어는 이슬비"],
  61: ["🌧️", "약한 비"],
  63: ["🌧️", "비"],
  65: ["🌧️", "강한 비"],
  66: ["🌧️", "어는 비"],
  67: ["🌧️", "강한 어는 비"],
  71: ["🌨️", "약한 눈"],
  73: ["🌨️", "눈"],
  75: ["❄️", "강한 눈"],
  77: ["🌨️", "싸락눈"],
  80: ["🌦️", "약한 소나기"],
  81: ["🌧️", "소나기"],
  82: ["⛈️", "강한 소나기"],
  85: ["🌨️", "눈 소나기"],
  86: ["❄️", "강한 눈 소나기"],
  95: ["⛈️", "뇌우"],
  96: ["⛈️", "뇌우·우박"],
  99: ["⛈️", "강한 뇌우·우박"],
};

async function loadCity(city) {
  const card = document.querySelector(`.card[data-city="${city.key}"]`);
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=" + city.lat +
    "&longitude=" + city.lon +
    "&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min" +
    "&timezone=Asia%2FSeoul&forecast_days=1";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const code = data.current.weather_code;
    const [icon, desc] = WEATHER[code] || ["🌡️", "알 수 없음"];
    const t = Math.round(data.current.temperature_2m);
    const max = Math.round(data.daily.temperature_2m_max[0]);
    const min = Math.round(data.daily.temperature_2m_min[0]);

    card.querySelector(".icon").textContent = icon;
    card.querySelector(".temp .value").textContent = t;
    card.querySelector(".desc").textContent = desc;
    card.querySelector(".range").innerHTML =
      `최고 <b>${max}°</b> · 최저 <b>${min}°</b>`;
  } catch (err) {
    card.querySelector(".icon").textContent = "⚠️";
    card.querySelector(".desc").innerHTML =
      '<span class="error">날씨를 불러오지 못했습니다</span>';
    card.querySelector(".range").textContent = "";
  }
}

loadCity(CITIES[0]);
loadCity(CITIES[1]);
document.getElementById("updated").textContent =
  "업데이트 " +
  new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

/* ── 명언 ─────────────────────────────── */
const QUOTES = [
  { text: "시작하는 방법은 말하는 것을 그치고 행동을 시작하는 것이다.", author: "월트 디즈니" },
  { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤저민 프랭클린" },
  { text: "길을 잃는 것도 여행의 일부다.", author: "J. R. R. 톨킨" },
  { text: "우리가 반복해서 하는 행동이 우리를 만든다. 그렇다면 탁월함은 행동이 아니라 습관이다.", author: "아리스토텔레스" },
  { text: "삶은 우리가 다른 계획을 세우는 동안 일어나는 일이다.", author: "존 레논" },
  { text: "가장 어두운 밤도 끝나고 해는 반드시 떠오른다.", author: "빅토르 위고" },
  { text: "완벽함이 아니라 진전을 목표로 하라.", author: "제임스 클리어" },
  { text: "할 수 있다고 믿든 할 수 없다고 믿든, 그 믿음대로 될 것이다.", author: "헨리 포드" },
  { text: "위대한 일을 하는 유일한 방법은 당신이 하는 일을 사랑하는 것이다.", author: "스티브 잡스" },
  { text: "천 리 길도 한 걸음부터.", author: "노자" },
  { text: "매일 조금씩, 결국엔 큰 변화가 된다.", author: "익명" },
  { text: "실패는 성공에 한 걸음 더 가까워진 것이다.", author: "토머스 에디슨" },
];

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

function showQuote() {
  let i = Math.floor(Math.random() * QUOTES.length);
  if (QUOTES.length > 1 && QUOTES[i].text === quoteText.textContent) {
    i = (i + 1) % QUOTES.length;
  }
  const q = QUOTES[i];
  quoteText.textContent = q.text;
  quoteAuthor.textContent = q.author;
}

showQuote();
document.getElementById("newQuote").addEventListener("click", showQuote);
