import { ActionLink } from './HomePage';

const supportHref = `mailto:support@hello-along.com?subject=${encodeURIComponent('Поддержка Along')}`;

export default function SupportPage() {
  return <main id="main" className="editorial-page support-page">
    <section className="editorial-hero support-hero" aria-labelledby="support-title">
      <p className="section-label">ПОДДЕРЖКА / ALONG</p>
      <h1 id="support-title">Поддержка</h1>
      <p className="editorial-copy">Есть вопросы об Along или показанном здесь опыте? Напишите нам по адресу ниже.</p>
      <a className="home-action home-action-primary" href={supportHref}>Открыть почту ↗</a>
      <a className="visible-email" href="mailto:support@hello-along.com">support@hello-along.com</a>
      <p className="truth-note">Если почта не открылась, скопируйте адрес в свой почтовый сервис. Открытие приложения не отправляет письмо и не подтверждает доставку.</p>
    </section>

    <section className="editorial-band support-links" aria-labelledby="support-links-title">
      <p className="section-label">ЧТО МОЖНО УЗНАТЬ</p><h2 id="support-links-title">Ещё немного об Along.</h2>
      <div><p>Узнайте, как найти Искру, прочитать подробности и решить присоединиться.</p><ActionLink to="/how-it-works">Как это работает →</ActionLink></div>
      <div><p>Посмотрите информацию о публичной установке. Подтверждённых ссылок на магазины приложений здесь пока нет.</p><ActionLink to="/how-it-works#availability">Проверить доступность →</ActionLink></div>
      <div><p>Посмотрите макеты разделов о безопасности и правовой информации. Их содержание пока не согласовано.</p><ActionLink to="/safety">Безопасность →</ActionLink><ActionLink to="/legal">Правовая информация →</ActionLink></div>
    </section>

    <section className="editorial-section support-return"><p className="section-label">ВЕРНУТЬСЯ В ALONG</p><ActionLink to="/">На главную</ActionLink></section>
  </main>;
}
