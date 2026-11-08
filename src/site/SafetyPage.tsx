import { ActionLink } from './HomePage';

const slots=[
  ['Рекомендации для встреч','Согласованные рекомендации для личных встреч — текст ожидается.'],
  ['Вопросы и обращения','Проверенные способы обращения и возможности продукта — текст ожидается.'],
  ['Возможности и ограничения','Согласованное описание мер безопасности и ограничений — текст ожидается.'],
] as const;

function ApprovalWarning(){return <aside className="approval-warning"><p className="section-label">МЕСТО ДЛЯ ТЕКСТА — НЕ СОГЛАСОВАНО ЮРИСТОМ</p><p>В этом макете предусмотрено место для согласованной информации. Эти блоки пока не содержат утверждённых правил, обязательств или правовых документов.</p></aside>}

export default function SafetyPage(){return <main id="main" className="legal-page">
  <section className="legal-hero" aria-labelledby="safety-title"><p className="section-label">БЕЗОПАСНОСТЬ / ALONG</p><h1 id="safety-title">Безопасность</h1><ApprovalWarning/></section>
  <section className="legal-content" aria-labelledby="safety-info-title"><h2 id="safety-info-title">Информация о безопасности</h2><p className="legal-lead">Перед публикацией содержание раздела должны согласовать продуктовая команда и юрист.</p><div className="legal-slot-list">
    {slots.map(([title,body])=><article className="unapproved-slot" key={title}><h3>{title}</h3><p>[{body}]</p><strong>НЕ СОГЛАСОВАНО / НЕАКТИВНЫЙ ТЕКСТОВЫЙ БЛОК</strong></article>)}
  </div><div className="legal-actions"><ActionLink to="/support">Перейти в поддержку →</ActionLink><ActionLink to="/legal">Правовая информация →</ActionLink></div></section>
  <section className="legal-return"><p className="section-label">ВЕРНУТЬСЯ В ALONG</p><ActionLink to="/">На главную</ActionLink></section>
</main>}
