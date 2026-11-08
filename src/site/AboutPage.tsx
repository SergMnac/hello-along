import { ActionLink } from './HomePage';

const principles = [
  ['City Is The Main Character.', 'Город — не просто фон. Знакомые улицы, любимые места и повседневные возможности дают людям повод встретиться.'],
  ['За приглашением стоит человек.', 'Люди создают Искры и сами решают, что им подходит. Первая версия Along — об общем плане и личном выборе, а не об автоматическом подборе.'],
  ['More Life. Less Screen.', 'Прогулка — чтобы гулять. Разговор — чтобы быть рядом. Экран помогает составить план, но не заменяет саму встречу.'],
] as const;

export default function AboutPage() {
  return <main id="main" className="editorial-page about-page">
    <section className="editorial-hero" aria-labelledby="about-title">
      <p className="section-label">ОБ ALONG / ЖИЗНЬ ЗА ПРЕДЕЛАМИ ЭКРАНА</p>
      <h1 id="about-title">Больше места для жизни вокруг.</h1>
      <div className="editorial-lead"><p>Along — о том, чтобы проводить время вместе в городе. Не ещё один повод листать ленту, а начало простого плана.</p><p>Один человек создаёт Искру. Другой находит её, читает подробности и решает присоединиться. Самое важное происходит за пределами экрана.</p></div>
    </section>

    <section className="editorial-band" aria-labelledby="principles-title">
      <p className="section-label" id="principles-title">ЧТО НАС ОБЪЕДИНЯЕТ</p>
      <div className="editorial-list principle-list">{principles.map(([title, copy]) => <article key={title}><h2>{title}</h2><p>{copy}</p></article>)}</div>
    </section>

    <section className="editorial-section origin-story" aria-labelledby="origin-title">
      <p className="section-label">НАШЕ НАЧАЛО / 21 Days to Life</p>
      <h2 id="origin-title">Семь заметок. Одна простая идея.</h2>
      <div className="editorial-copy"><p>21 Days to Life — начало истории Along в семи оригинальных заметках. Их объединяет идея: меньше поводов оставаться в телефоне и больше интересного за его пределами.</p><p>Оригинальные тексты сохранены на русском, английском и испанском. Это архив, а не список текущих функций и не новый отсчёт до запуска.</p></div>
      <ActionLink to="/story/21-days-to-life">Читать архив 21 Days to Life →</ActionLink>
      <p className="truth-note">Исторические формулировки кампании, включая слоганы об ИИ и сроки, относятся к тому времени, а не к текущим функциям или публичной доступности.</p>
    </section>

    <section className="editorial-band about-next" aria-labelledby="about-next-title">
      <p className="section-label">ОТ ИДЕИ — К ВСТРЕЧЕ</p><h2 id="about-next-title">Начните с простого плана.</h2><p>Посмотрите пример вечерней прогулки с исходными макетами приложения и пояснением доступности.</p><ActionLink to="/how-it-works#evening-walk">Как это работает →</ActionLink>
    </section>
  </main>;
}
