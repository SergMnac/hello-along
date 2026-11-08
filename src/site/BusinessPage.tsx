import { ActionLink } from './HomePage';

const partnershipHref = `mailto:support@hello-along.com?subject=${encodeURIComponent('Партнёрство с Along')}`;

const examples = [
  ['КАФЕ', 'Место для разговора.', 'Кофе после работы — простой повод встретиться. Расскажите о своём пространстве и о встречах, которые вы представляете.'],
  ['ТЕАТРЫ', 'Будет что обсудить после.', 'Вечер в театре может начаться с общего плана и продолжиться разговором. Давайте обсудим, как ваша программа вписывается в такие встречи.'],
  ['ОРГАНИЗАТОРЫ', 'За каждым планом — человек.', 'Приглашения создают люди. Расскажите, что вы организуете, где это проходит и что хотите обсудить с Along.'],
] as const;

export default function BusinessPage() {
  return <main id="main" className="editorial-page business-page">
    <section className="editorial-hero" aria-labelledby="business-title">
      <p className="section-label">ДЛЯ БИЗНЕСА / ГОРОДСКИЕ МЕСТА И ЖИВЫЕ ВСТРЕЧИ</p>
      <h1 id="business-title">Часть повседневной жизни города.</h1>
      <div className="editorial-lead"><p>Лучшие моменты часто начинаются в кафе, театре или любимом городском пространстве. Along начинается с людей, которые хотят быть там вместе.</p><p>Если у вас своё пространство или вы организуете интересные события, расскажите нам о своей идее.</p></div>
      <a className="home-action home-action-primary" href={partnershipHref}>Обсудить партнёрство ↗</a>
    </section>

    <section className="editorial-band" aria-labelledby="business-examples-title">
      <p className="section-label">О ЧЁМ МОЖНО ПОГОВОРИТЬ / ПРИМЕРЫ</p>
      <h2 id="business-examples-title">Место. План. Повод встретиться.</h2>
      <div className="editorial-list">{examples.map(([label, title, copy]) => <article key={label}><p className="section-label">{label}</p><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className="editorial-section partnership" aria-labelledby="partnership-title">
      <p className="section-label">ПАРТНЁРСТВО / ЧЕРЕЗ ПОДДЕРЖКУ ALONG</p>
      <h2 id="partnership-title">Расскажите о своём месте в городе.</h2>
      <p className="editorial-copy">Напишите о партнёрстве на действующий адрес поддержки Along. Укажите своё пространство или организацию, город и идею, которую хотите обсудить.</p>
      <a className="home-action home-action-primary" href={partnershipHref}>Открыть почту ↗</a>
      <aside className="contact-fallback"><p className="section-label">ПОЧТА НЕ ОТКРЫЛАСЬ?</p><a href="mailto:support@hello-along.com">support@hello-along.com</a><p>Скопируйте адрес в свой почтовый сервис. Тема: «Партнёрство с Along». Открытие почты не отправляет письмо; эта страница не подтверждает доставку.</p></aside>
      <p className="truth-note">Это приглашение к разговору, а не платное размещение или обещание охватов, цен, привлечения клиентов либо принятого партнёрства. Здесь нет оплаты, подписки или кабинета бизнеса.</p>
      <ActionLink to="/how-it-works">Как работает Along →</ActionLink>
    </section>
  </main>;
}
