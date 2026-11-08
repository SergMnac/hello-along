import { ActionLink } from './HomePage';
import { currentMarket } from './config';
import { legalApprovalState,legalMarketSlots,legalUnavailableText } from './legalContent';

function ApprovalWarning(){return <aside className="approval-warning"><p className="section-label">МЕСТО ДЛЯ ТЕКСТА — НЕ СОГЛАСОВАНО ЮРИСТОМ</p><p>В этом макете предусмотрено место для согласованной информации. Эти блоки пока не содержат утверждённых правил, обязательств или правовых документов.</p></aside>}

export default function LegalPage(){const slots=[...legalMarketSlots.com,...legalMarketSlots.ru];return <main id="main" className="legal-page" data-build-market={currentMarket}>
  <section className="legal-hero" aria-labelledby="legal-title"><p className="section-label">ПРАВОВАЯ ИНФОРМАЦИЯ / ALONG</p><h1 id="legal-title">Правовая информация</h1><ApprovalWarning/></section>
  <section className="legal-content" aria-labelledby="market-documents-title"><h2 id="market-documents-title">Документы для разных рынков</h2><p className="legal-lead">Версии .com и .ru используют общий дизайн. Сведения об операторе, условия использования и политика конфиденциальности требуют отдельного подтверждения и согласования для каждого рынка.</p><div className="legal-slot-list">
    {slots.map(slot=><article className="unapproved-slot" data-market={slot.market} data-document-kind={slot.kind} key={`${slot.market}-${slot.kind}`}><h3>{slot.title}</h3><p>[{legalUnavailableText}]</p><strong>{legalApprovalState.toUpperCase()}</strong></article>)}
  </div><p className="legal-truth">Это неактивные текстовые блоки, а не кнопки недоступных документов. Название оператора, юрисдикция и адреса документов не выдуманы.</p><ActionLink to="/support">Перейти в поддержку →</ActionLink></section>
  <section className="legal-return"><p className="section-label">ВЕРНУТЬСЯ В ALONG</p><ActionLink to="/">На главную</ActionLink></section>
</main>}
