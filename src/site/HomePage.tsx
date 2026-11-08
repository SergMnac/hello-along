import { useState } from 'react';
import { Link } from 'react-router-dom';

type ConceptImageProps = { src: string; alt: string; className?: string; position?: string };
export function ConceptImage({ src, alt, className = '', position }: ConceptImageProps) {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  return <div className={`concept-image ${className}`} data-image-state={state}>
    {state !== 'failed' && <img src={src} alt={alt} style={{ objectPosition: position }} onLoad={() => setState('ready')} onError={() => setState('failed')} />}
    {state === 'loading' && <span className="image-status">Изображение загружается</span>}
    {state === 'failed' && <span className="image-fallback">Изображение временно недоступно</span>}
  </div>;
}

export function ActionLink({ to, children, primary = false }: { to: string; children: React.ReactNode; primary?: boolean }) {
  return <Link className={primary ? 'home-action home-action-primary' : 'home-action'} to={to}>{children}</Link>;
}

const scenarios = [
  ['Прогулка', '«Немного свежего воздуха. Немного общения».'],
  ['Кофе', '«Разговор без спешки».'],
  ['Кино', '«Фильм, который захочется обсудить».'],
] as const;

export function SparkPreview({ joined = false }: { joined?: boolean }) {
  return <article className="spark-phone" aria-label={joined ? 'Статичный макет: участие подтверждено' : 'Статичный макет: детали Искры'}>
    <div className="phone-status"><strong>9:41</strong><span>● ᯤ ▰</span></div>
    <div className="phone-nav"><span>‹ Назад</span><span aria-hidden="true">↗</span></div>
    {joined && <div className="joined-note">✓ Вы присоединились</div>}
    <ConceptImage src="/concept/event-artwork.png" alt="Концептуальная иллюстрация вечерней прогулки" className="event-art" />
    <div className="spark-copy"><span className="spark-chip">ПРОГУЛКА</span><h3>Вечерний Петровский сад</h3><p>{joined ? 'Тихая прогулка по вечернему городу. Можно присоединиться без лишней спешки.' : 'Пройдёмся по вечернему городу, познакомимся и поговорим.'}</p></div>
    <div className="organizer"><ConceptImage src="/concept/organizer-portrait.png" alt="Концептуальный портрет организатора"/><span>Организатор</span></div>
    <div className="spark-details"><p>▣ 24 июля · 19:30</p><div><ConceptImage src="/concept/place-artwork.png" alt="Концептуальное изображение места"/><span>Петровский сквер<br/><small>Место встречи</small></span></div></div>
    <div className="phone-indicator" />
  </article>;
}

export default function HomePage() {
  return <main id="main" className="home-page">
    <section className="home-hero" aria-labelledby="home-title">
      <ConceptImage src="/concept/city-at-dusk.png" alt="Концептуальная панорама вечернего города" className="hero-photo" position="center" />
      <div className="hero-scrim" />
      <div className="hero-message">
        <p className="section-label">МЕНЬШЕ ЛЕНТЫ. БОЛЬШЕ ОБЩИХ МОМЕНТОВ.</p>
        <h1 id="home-title">Больше места<br/> для жизни.</h1>
        <p className="hero-description">Люди создают Искры — простые планы для встреч в городе. Найдите то, что вам близко, присоединяйтесь и проводите время вместе.</p>
        <ActionLink to="/how-it-works" primary>Как это работает →</ActionLink>
      </div>
      <aside className="city-note"><i/>City Is The<br/>Main Character.</aside>
      <div className="hero-closing"><span>ONE CLICK. ONE EMOTION.</span><span>Прогулка. Кофе. Повод выйти из дома.</span></div>
    </section>

    <section className="home-section intro-section">
      <p className="section-label">ГОРОД / ПРИГЛАШЕНИЕ ДЛЯ КАЖДОГО</p>
      <h2>City Is The Main Character.</h2>
      <div className="section-copy"><p>Знакомая улица. Новый разговор. Порой достаточно выйти из дома, чтобы вечер сложился иначе.</p><p>В Along простой план становится приглашением. Найдите Искру, прочитайте подробности и решите, хотите ли вы присоединиться.</p></div>
    </section>

    <section className="home-section scenario-section" id="evening-walk">
      <p className="section-label">ПОВСЕДНЕВНЫЕ ПЛАНЫ / ПРИМЕРЫ, НЕ АКТУАЛЬНЫЕ СОБЫТИЯ</p>
      <h2>Чем займёмся?</h2>
      <div className="scenario-list">{scenarios.map(([title, description]) => <div className="scenario" key={title}><h3>{title}</h3><p>{description}</p></div>)}</div>
      <p className="context-note">Это знакомые поводы выйти из дома, а не живая лента, действующие приглашения или новые функции приложения.</p>
      <ActionLink to="/how-it-works#evening-walk">Пример вечерней прогулки →</ActionLink>
    </section>

    <section className="home-section app-intro">
      <p className="section-label">ПРИЛОЖЕНИЕ / СТАТИЧНЫЙ ПРИМЕР ИНТЕРФЕЙСА</p>
      <h2>От простого плана — к встрече.</h2>
      <p className="section-copy wide">Человек создаёт Искру. Вы читаете подробности и сами решаете присоединиться.</p>
      <p className="context-note">Утверждённые макеты MS-040 / MS-054, не снимки работающего приложения. Русские тексты и дата примера сохранены. Кнопки внутри изображения не являются действиями сайта.</p>
      <ActionLink to="/how-it-works#evening-walk">Посмотреть пример прогулки →</ActionLink>
    </section>
    <section className="app-sequence" aria-label="Статичные примеры приложения">
      <div className="phone-row"><SparkPreview/><SparkPreview joined/></div>
      <aside className="preview-note"><p className="section-label">СПОКОЙНЫЙ ВЫБОР / БЕЗ ДАВЛЕНИЯ</p><p>Прочитать подробности — ещё не значит согласиться.</p><p>Along не показывает счётчики популярности и не торопит с решением.</p></aside>
    </section>
    <p className="preview-context">Статичный дизайн-пример для локального рассмотрения. Это не демонстрация живых данных.</p>

    <section className="life-banner">
      <ConceptImage src="/concept/real-life-time.png" alt="Концептуальная панорама города" className="life-photo" />
      <div className="life-scrim"/><div className="life-content"><p className="section-label">ГЛАВНОЕ — ЗА ПРЕДЕЛАМИ ЭКРАНА</p><h2>More Life.<br/>Less Screen.</h2><p>Главное — сама прогулка. Along лишь помогает ей начаться.</p></div>
    </section>
    <section className="home-section business-section"><p className="section-label">ДЛЯ БИЗНЕСА / ЧАСТЬ ГОРОДСКОЙ ЖИЗНИ</p><h2>Хорошие места объединяют людей.</h2><p className="section-copy wide">Для кафе, театров и организаторов, которым важны встречи в их пространстве. Давайте обсудим Along и ваше место в жизни города.</p><ActionLink to="/business">Для бизнеса →</ActionLink></section>
    <section className="home-section story-section"><p className="section-label">ОБ ALONG / НАЧАЛО ИСТОРИИ</p><h2>У каждого начала своя история.</h2><p className="section-copy wide">В архиве 21 Days to Life сохранены семь заметок о жизни за пределами экрана. Прочитайте их в оригинале — с пояснением исторического контекста.</p><div className="story-actions"><ActionLink to="/about">Об Along →</ActionLink><ActionLink to="/story/21-days-to-life">Читать архив 21 Days to Life →</ActionLink></div></section>
    <p className="asset-provenance">Фото города и встроенные изображения: КОНЦЕПТ / ПРАВА НЕ ПОДТВЕРЖДЕНЫ. Только для локального рассмотрения дизайна; исключить из публичного выпуска до подтверждения прав.</p>
  </main>;
}
