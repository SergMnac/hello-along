import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ActionLink, ConceptImage, SparkPreview } from './HomePage';

const steps = [
  ['01', 'Начните с желания.', 'Прогуляться после долгого дня. Иногда достаточно просто захотеть выйти из дома.'],
  ['02', 'Кто-то создаёт Искру.', 'Человек предлагает план, время и место. За приглашением стоит человек.'],
  ['03', 'Решите присоединиться.', 'Прочитайте подробности и решите, подходит ли вам план. Выбор за вами.'],
  ['04', 'Найдите время для жизни.', 'Встретьтесь в условленном месте. Пусть город подарит вам что-то запоминающееся.'],
] as const;

function useAnchorFocus() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ block: 'start' });
      target?.focus({ preventScroll: true });
    });
  }, [hash]);
}

export default function HowItWorksPage() {
  useAnchorFocus();
  return <main id="main" className="how-page">
    <section className="how-intro" aria-labelledby="how-title">
      <p className="section-label">КАК ЭТО РАБОТАЕТ / ОТ ПЛАНА — К ВСТРЕЧЕ</p>
      <h1 id="how-title">Хорошая компания<br/> начинается с плана.</h1>
      <div className="how-intro-copy">
        <p>Along помогает проводить время вместе в городе. Люди создают Искры, а другие находят их и решают присоединиться — не ради ленты, а ради встречи.</p>
        <ActionLink to="/how-it-works#evening-walk" primary>Пример вечерней прогулки ↓</ActionLink>
      </div>
    </section>

    <section className="how-journey" id="evening-walk" tabIndex={-1} aria-labelledby="walk-title">
      <p className="section-label">ВЕЧЕРНЯЯ ПРОГУЛКА / #evening-walk</p>
      <h2 id="walk-title">«Хочется прогуляться.<br/> И, может быть, не одному».</h2>
      <div className="journey-steps">{steps.map(([number, title, description]) => <article className="journey-step" key={number}>
        <span>{number}</span><h3>{title}</h3><p>{description}</p>
      </article>)}</div>
    </section>

    <section className="how-walkthrough" aria-labelledby="walkthrough-title">
      <p className="section-label">ПРИЛОЖЕНИЕ / РАССМОТРИМ ПОДРОБНЕЕ</p>
      <h2 id="walkthrough-title">Личный выбор.<br/> Не очередная лента.</h2>
      <p className="how-context">Пример интерфейса приложения · демонстрационное событие, не актуальная активность города</p>
      <div className="walkthrough-grid">
        <div className="walkthrough-copy">
          <div><p className="section-label">ПРОЧИТАЙТЕ ПОДРОБНОСТИ / MS-040</p><h3>Узнайте подробности.<br/> Решение за вами.</h3><p>В Искре указаны план, организатор, время и место встречи. Один человек приглашает, другой решает присоединиться.</p></div>
          <div><p className="section-label">ВЫ ПРИСОЕДИНИЛИСЬ / MS-054</p><p>Приложение подтверждает ваш выбор. Следующий важный момент — уже за его пределами.</p></div>
          <p className="how-context">Исходные русские макеты приложения сохранены. Дата и место приведены для примера, а не как действующее приглашение или обещание запуска.</p>
        </div>
        <div className="walkthrough-preview"><SparkPreview/></div>
        <div className="walkthrough-preview joined-preview"><p className="section-label">ПРИСОЕДИНИТЕСЬ / MS-054</p><p>Приложение подтверждает выбор. Теперь главное — встретиться, а не продолжать смотреть в экран.</p><SparkPreview joined/></div>
      </div>
      <div className="walkthrough-footer">
        <p>Пример интерфейса · демонстрационное событие, не актуальная активность города. Утверждённые макеты Figma, а не доказательство работы приложения. Элементы внутри примера статичны.</p>
        <ActionLink to="/how-it-works#availability">Проверить доступность ↓</ActionLink>
      </div>
    </section>

    <section className="life-banner how-life">
      <ConceptImage src="/concept/real-life-time.png" alt="Концептуальная панорама вечернего города" className="life-photo" />
      <div className="life-scrim"/><div className="life-content"><p className="section-label">ГЛАВНОЕ — ЗА ПРЕДЕЛАМИ ЭКРАНА</p><h2>More Life.<br/> Less Screen.</h2><p>Главное — сама прогулка. Along лишь помогает ей начаться.</p></div>
    </section>

    <section className="how-availability" id="availability" tabIndex={-1} aria-labelledby="availability-title">
      <p className="section-label">ДОСТУПНОСТЬ / #availability</p>
      <h2 id="availability-title">Публичная установка<br/> пока недоступна</h2>
      <div className="availability-copy">
        <p>Подтверждённых ссылок на установку пока нет. Эти макеты объясняют работу приложения, но не означают, что оно доступно для публичной установки.</p>
        <p>Версия для разработки может существовать. Публичная доступность не подтверждена. Дата выпуска здесь не объявляется.</p>
        <ActionLink to="/support" primary>Написать в поддержку →</ActionLink>
        <p className="availability-question">Что хотите сделать?</p>
        <div className="availability-actions"><ActionLink to="/how-it-works#evening-walk">К разделу «Как это работает» ↑</ActionLink><ActionLink to="/">На главную</ActionLink></div>
      </div>
    </section>

    <section className="how-sources" aria-labelledby="sources-title">
      <p className="section-label" id="sources-title">ИСТОЧНИКИ МАКЕТОВ</p>
      <p>Вечерняя прогулка — пример плана, а не новая функция. Показаны утверждённые макеты Figma, не снимки работающего приложения. Фото города: КОНЦЕПТ / ПРАВА НЕ ПОДТВЕРЖДЕНЫ. Разрешения на публикацию изображений ещё нужны.</p>
    </section>
  </main>;
}
