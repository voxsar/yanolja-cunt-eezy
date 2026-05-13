import React, { useEffect, useState } from 'react';
import { Gift, Monitor, MoreVertical, Phone, Plus, RefreshCcw, Search, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { Promotion } from '../../types';
import { dateLabel, money } from '../../utils/pms';

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    category: 'Basic Package',
    promotionType: 'Percent Discount',
    desktopDiscount: '0',
    mobileDiscount: '0',
    code: '',
    bookingStart: new Date().toISOString().slice(0, 10),
    bookingEnd: new Date().toISOString().slice(0, 10)
  });

  const load = () => {
    pmsService.promotions('all').then(setPromotions);
  };

  useEffect(load, []);

  const visiblePromotions = promotions.filter((promotion) => {
    const lower = query.toLowerCase();
    return promotion.status === status &&
      (promotion.title.toLowerCase().includes(lower) || promotion.category.toLowerCase().includes(lower));
  });

  const activeCount = promotions.filter((promotion) => promotion.status === 'active').length;
  const inactiveCount = promotions.filter((promotion) => promotion.status === 'inactive').length;

  const createPromotion = async () => {
    if (!draft.title.trim()) return;
    await pmsService.createPromotion({
      ...draft,
      desktopDiscount: Number(draft.desktopDiscount),
      mobileDiscount: Number(draft.mobileDiscount),
      status: 'active'
    });
    setDrawerOpen(false);
    setStatus('active');
    setDraft({
      title: '',
      category: 'Basic Package',
      promotionType: 'Percent Discount',
      desktopDiscount: '0',
      mobileDiscount: '0',
      code: '',
      bookingStart: new Date().toISOString().slice(0, 10),
      bookingEnd: new Date().toISOString().slice(0, 10)
    });
    load();
  };

  return (
    <div className="pms-page promotions-page">
      <div className="pms-toolbar tall-toolbar">
        <div>
          <h2>Packages & Promotions</h2>
          <div className="tab-strip">
            <button className={status === 'active' ? 'active' : ''} onClick={() => setStatus('active')}>Active <span>{activeCount}</span></button>
            <button className={status === 'inactive' ? 'active' : ''} onClick={() => setStatus('inactive')}>Inactive <span>{inactiveCount}</span></button>
          </div>
        </div>
        <div className="toolbar-spacer" />
        <label className="inline-search wide"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Packages & Promotions" /></label>
        <select className="compact-input"><option>All</option></select>
        <button className="outline-button" onClick={load}><RefreshCcw size={17} /> Sync</button>
        <button className="dark-button" onClick={() => setDrawerOpen(true)}><Plus size={17} /> Create</button>
      </div>
      <div className="promo-grid">
        {visiblePromotions.map((promotion) => (
          <article className="promo-card" key={promotion.id}>
            <div className="promo-card-head">
              <div>
                <h3>{promotion.title}</h3>
                <span><Gift size={15} /> {promotion.category}</span>
              </div>
              <MoreVertical size={18} />
            </div>
            <div className="discount-row">
              <div><Monitor size={22} /><span>Discount on Desktop</span><strong>{money(promotion.desktopDiscount)} %</strong></div>
              <div><Phone size={22} /><span>Discount on Mobile</span><strong>{money(promotion.mobileDiscount)} %</strong></div>
            </div>
            <dl className="promo-meta">
              <div><dt>Booking Date</dt><dd>{dateLabel(promotion.bookingStart)} to {dateLabel(promotion.bookingEnd)}</dd></div>
              <div><dt>Promotion Type</dt><dd><span>{promotion.promotionType}</span></dd></div>
              {promotion.code && <div><dt>Promotion Code</dt><dd><mark>{promotion.code}</mark></dd></div>}
            </dl>
          </article>
        ))}
      </div>
      {drawerOpen && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>Create Promotion</h2>
              <button className="icon-button" onClick={() => setDrawerOpen(false)}><X size={22} /></button>
            </div>
            <div className="drawer-form">
              <label>Title<input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} /></label>
              <label>Category<input value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} /></label>
              <label>Promotion Type<input value={draft.promotionType} onChange={(event) => setDraft((current) => ({ ...current, promotionType: event.target.value }))} /></label>
              <div className="drawer-grid">
                <label>Desktop Discount<input type="number" value={draft.desktopDiscount} onChange={(event) => setDraft((current) => ({ ...current, desktopDiscount: event.target.value }))} /></label>
                <label>Mobile Discount<input type="number" value={draft.mobileDiscount} onChange={(event) => setDraft((current) => ({ ...current, mobileDiscount: event.target.value }))} /></label>
              </div>
              <label>Promotion Code<input value={draft.code} onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))} /></label>
              <div className="drawer-grid">
                <label>Booking Start<input type="date" value={draft.bookingStart} onChange={(event) => setDraft((current) => ({ ...current, bookingStart: event.target.value }))} /></label>
                <label>Booking End<input type="date" value={draft.bookingEnd} onChange={(event) => setDraft((current) => ({ ...current, bookingEnd: event.target.value }))} /></label>
              </div>
              <div className="drawer-actions"><button className="outline-button" onClick={() => setDrawerOpen(false)}>Cancel</button><button className="dark-button" onClick={createPromotion}>Save</button></div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Promotions;
