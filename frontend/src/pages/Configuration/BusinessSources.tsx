import React, { useEffect, useMemo, useState } from 'react';
import { FileClock, MoreVertical, Search, Upload, UserPlus, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { BusinessSource } from '../../types';
import { downloadCsv } from '../../utils/ui';

const BusinessSources: React.FC = () => {
  const [sources, setSources] = useState<BusinessSource[]>([]);
  const [query, setQuery] = useState('');
  const [drawer, setDrawer] = useState<'add' | 'audit' | null>(null);
  const [draft, setDraft] = useState({ shortCode: '', name: '', color: '#666666' });

  const load = () => {
    pmsService.businessSources().then(setSources);
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return sources.filter((source) => source.name.toLowerCase().includes(lower) || source.shortCode.toLowerCase().includes(lower));
  }, [sources, query]);

  const createSource = async () => {
    if (!draft.shortCode.trim() || !draft.name.trim()) return;
    await pmsService.createBusinessSource({ ...draft, status: 'active' });
    setDraft({ shortCode: '', name: '', color: '#666666' });
    setDrawer(null);
    load();
  };

  const updateStatus = async (source: BusinessSource, status: BusinessSource['status']) => {
    const updated = await pmsService.updateBusinessSource(source.id, { status });
    setSources((current) => current.map((item) => item.id === updated.id ? updated : item));
  };

  return (
    <div className="pms-page business-source-page">
      <div className="pms-toolbar">
        <h2>Business Source</h2>
        <label className="inline-search">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Quick Search by Name, Short Code" />
          <Search size={17} />
        </label>
        <div className="toolbar-spacer" />
        <button className="outline-button" onClick={() => setDrawer('add')}><UserPlus size={17} /> Add Business Source</button>
        <button
          className="outline-button"
          onClick={() => downloadCsv('business-sources.csv', filtered.map((source) => ({
            shortCode: source.shortCode,
            name: source.name,
            color: source.color || '',
            status: source.status
          })))}
        >
          <Upload size={17} /> Export
        </button>
        <button className="outline-button" onClick={() => setDrawer('audit')}><FileClock size={17} /> Audit Trail</button>
      </div>
      <div className="panel-surface data-table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Short Code</th>
              <th>Business Source</th>
              <th>Color</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((source) => (
              <tr key={source.id}>
                <td><input type="checkbox" /></td>
                <td>{source.shortCode}</td>
                <td>{source.name}</td>
                <td>{source.color ? <span className="color-swatch" style={{ background: source.color }} /> : '-'}</td>
                <td>
                  <select value={source.status} onChange={(event) => updateStatus(source, event.target.value as BusinessSource['status'])}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="right"><MoreVertical size={18} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {drawer && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>{drawer === 'add' ? 'Add Business Source' : 'Business Source Audit'}</h2>
              <button className="icon-button" onClick={() => setDrawer(null)}><X size={22} /></button>
            </div>
            {drawer === 'add' ? (
              <div className="drawer-form">
                <label>Short Code<input value={draft.shortCode} onChange={(event) => setDraft((current) => ({ ...current, shortCode: event.target.value }))} /></label>
                <label>Business Source<input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></label>
                <label>Color<input type="color" value={draft.color} onChange={(event) => setDraft((current) => ({ ...current, color: event.target.value }))} /></label>
                <div className="drawer-actions">
                  <button className="outline-button" onClick={() => setDrawer(null)}>Cancel</button>
                  <button className="dark-button" onClick={createSource}>Save</button>
                </div>
              </div>
            ) : (
              <div className="drawer-list">
                {sources.map((source) => (
                  <div className="drawer-item" key={source.id}>
                    {source.name} is currently {source.status}
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default BusinessSources;
