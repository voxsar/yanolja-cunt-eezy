import React, { useEffect, useState } from 'react';
import { Box, MessageSquareText, Search, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { ChannelLog, ChannelMessageSetting } from '../../types';
import { dateLabel } from '../../utils/pms';

const ChannelLogs: React.FC = () => {
  const [logs, setLogs] = useState<ChannelLog[]>([]);
  const [settings, setSettings] = useState<ChannelMessageSetting[]>([]);
  const [drawer, setDrawer] = useState<'search' | 'messages' | null>(null);
  const [filters, setFilters] = useState({ forDate: '', source: '', operation: '', roomType: '', ratePlan: '' });

  const loadLogs = (nextFilters = filters) => {
    const params = Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value));
    pmsService.channelLogs(params).then(setLogs);
  };

  useEffect(() => {
    loadLogs();
    pmsService.channelMessageSettings().then(setSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSetting = async (setting: ChannelMessageSetting, autoMode: boolean) => {
    const updated = await pmsService.updateChannelMessageSetting(setting.id, { autoMode });
    setSettings((current) => current.map((item) => item.id === updated.id ? updated : item));
  };

  const saveMessage = async (setting: ChannelMessageSetting) => {
    const updated = await pmsService.updateChannelMessageSetting(setting.id, { customMessage: setting.customMessage });
    setSettings((current) => current.map((item) => item.id === updated.id ? updated : item));
  };

  const sources = Array.from(new Set(logs.map((log) => log.source).filter(Boolean)));
  const operations = Array.from(new Set(logs.map((log) => log.operation).filter(Boolean)));
  const roomTypes = Array.from(new Set(logs.map((log) => log.roomType).filter(Boolean)));
  const ratePlans = Array.from(new Set(logs.map((log) => log.ratePlan).filter(Boolean)));

  return (
    <div className="pms-page channel-page">
      <div className="pms-toolbar">
        <h2>Channel Logs</h2>
        <div className="toolbar-spacer" />
        <button className="outline-button" onClick={() => setDrawer('search')}><Search size={17} /> Search</button>
        <button className="outline-button" onClick={() => setDrawer('messages')}><MessageSquareText size={17} /> Message Settings</button>
      </div>
      <div className="panel-surface data-table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>For Date</th>
              <th>Request Date & Time (IST)</th>
              <th>Process Date & Time (IST)</th>
              <th>Updated Value</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.source}</td>
                <td>{dateLabel(log.forDate)}</td>
                <td>{dateLabel(log.requestAt, 'dd/MM/yyyy hh:mm a')}</td>
                <td>{log.processedAt ? dateLabel(log.processedAt, 'dd/MM/yyyy hh:mm a') : '-'}</td>
                <td>{log.updatedValue || '-'}</td>
                <td>{log.user || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="empty-state"><Box size={48} /><span>No data</span></div>}
      </div>

      {drawer && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>{drawer === 'search' ? 'Search' : 'Channel Message Settings'}</h2>
              <button className="icon-button" onClick={() => setDrawer(null)}><X size={22} /></button>
            </div>
            {drawer === 'search' ? (
              <div className="drawer-form">
                <label>For Date<input type="date" value={filters.forDate} onChange={(event) => setFilters((current) => ({ ...current, forDate: event.target.value }))} /></label>
                <label>Source<select value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value }))}>
                  <option value="">-Select-</option>
                  {sources.map((source) => <option key={source} value={source}>{source}</option>)}
                </select></label>
                <label>Operation<select value={filters.operation} onChange={(event) => setFilters((current) => ({ ...current, operation: event.target.value }))}>
                  <option value="">-Select-</option>
                  {operations.map((operation) => <option key={operation} value={operation}>{operation}</option>)}
                </select></label>
                <div className="drawer-grid">
                  <label>Room Type<select value={filters.roomType} onChange={(event) => setFilters((current) => ({ ...current, roomType: event.target.value }))}>
                    <option value="">-Select-</option>
                    {roomTypes.map((roomType) => <option key={roomType} value={roomType}>{roomType}</option>)}
                  </select></label>
                  <label>Rate Plan<select value={filters.ratePlan} onChange={(event) => setFilters((current) => ({ ...current, ratePlan: event.target.value }))}>
                    <option value="">-Select-</option>
                    {ratePlans.map((ratePlan) => <option key={ratePlan} value={ratePlan}>{ratePlan}</option>)}
                  </select></label>
                </div>
                <div className="drawer-actions">
                  <button
                    className="outline-button"
                    onClick={() => {
                      const emptyFilters = { forDate: '', source: '', operation: '', roomType: '', ratePlan: '' };
                      setFilters(emptyFilters);
                      loadLogs(emptyFilters);
                    }}
                  >
                    Reset
                  </button>
                  <button className="dark-button" onClick={() => { loadLogs(); setDrawer(null); }}>Search</button>
                </div>
              </div>
            ) : (
              <div className="message-settings-table">
                <div className="settings-header"><b>Channel Name</b><b>Auto Mode</b><b>Custom Message</b></div>
                {settings.map((setting) => (
                  <div className="settings-row" key={setting.id}>
                    <span>{setting.channelName}</span>
                    <label className="switch">
                      <input type="checkbox" checked={setting.autoMode} onChange={(event) => saveSetting(setting, event.target.checked)} />
                      <span />
                    </label>
                    <input
                      value={setting.customMessage}
                      onChange={(event) => setSettings((current) => current.map((item) => (
                        item.id === setting.id ? { ...item, customMessage: event.target.value } : item
                      )))}
                      onBlur={() => saveMessage(setting)}
                    />
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

export default ChannelLogs;
