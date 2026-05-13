import React, { useEffect, useState } from 'react';
import { FileClock, Settings, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { PaymentGatewaySetting } from '../../types';

const PaymentGateway: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGatewaySetting[]>([]);
  const [saving, setSaving] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  useEffect(() => {
    pmsService.paymentGatewaySettings().then(setGateways);
  }, []);

  const gateway = gateways[0];

  const updateGateway = (payload: Partial<PaymentGatewaySetting>) => {
    if (!gateway) return;
    setGateways((current) => current.map((item) => item.id === gateway.id ? { ...item, ...payload } : item));
  };

  const updateLinkSetting = (
    channel: string,
    key: keyof PaymentGatewaySetting['linkSettings'][string],
    value: boolean | number | null
  ) => {
    if (!gateway) return;
    updateGateway({
      linkSettings: {
        ...gateway.linkSettings,
        [channel]: {
          ...gateway.linkSettings[channel],
          [key]: value
        }
      }
    });
  };

  const save = async () => {
    if (!gateway) return;
    setSaving(true);
    const updated = await pmsService.updatePaymentGatewaySetting(gateway.id, gateway);
    setGateways((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSaving(false);
  };

  return (
    <div className="pms-page payment-page">
      <div className="settings-tab">Payment Gateway Settings</div>
      {gateway && (
        <div className="panel-surface payment-panel">
          <h2>Payment Gateway</h2>
          <div className="gateway-grid">
            <label><input type="checkbox" checked={gateway.enabled} onChange={(event) => updateGateway({ enabled: event.target.checked })} /> Payment Type <strong>{gateway.paymentType}</strong></label>
            <label>Payment Caption<input value={gateway.paymentCaption} onChange={(event) => updateGateway({ paymentCaption: event.target.value })} /></label>
            <label>User-ID *<input value={gateway.userId} onChange={(event) => updateGateway({ userId: event.target.value })} /></label>
            <label>Password *<input value={gateway.password} onChange={(event) => updateGateway({ password: event.target.value })} /></label>
            <label>Merchant Id *<input value={gateway.merchantId} onChange={(event) => updateGateway({ merchantId: event.target.value })} /></label>
            <label>Gateway URL *<input value={gateway.gatewayUrl} onChange={(event) => updateGateway({ gatewayUrl: event.target.value })} /></label>
          </div>
          <h2>Settings for Payment Link</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Channel Name</th>
                <th>Manual Mode</th>
                <th>Auto Mode</th>
                <th>Deposit Amount</th>
                <th>More Settings</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(gateway.linkSettings).map(([channel, setting]) => (
                <tr key={channel}>
                  <td>{channel}</td>
                  <td><Toggle checked={setting.manualMode} onChange={(checked) => updateLinkSetting(channel, 'manualMode', checked)} /></td>
                  <td><Toggle checked={setting.autoMode} onChange={(checked) => updateLinkSetting(channel, 'autoMode', checked)} /></td>
                  <td>
                    <div className="percent-input">
                      <input
                        value={setting.depositAmount || ''}
                        onChange={(event) => updateLinkSetting(channel, 'depositAmount', event.target.value === '' ? null : Number(event.target.value))}
                      />
                      <span>%</span>
                    </div>
                  </td>
                  <td>{channel === 'Booking Engine + PMS' ? <Settings size={18} /> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="sticky-actions"><button className="outline-button" onClick={() => setAuditOpen(true)}><FileClock size={17} /> Audit Trail</button><button className="dark-button" disabled={saving} onClick={save}>{saving ? 'Saving...' : 'Save'}</button></div>
        </div>
      )}
      {auditOpen && gateway && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>Payment Gateway Audit</h2>
              <button className="icon-button" onClick={() => setAuditOpen(false)}><X size={22} /></button>
            </div>
            <div className="drawer-list">
              <div className="drawer-item">{gateway.paymentType} gateway is {gateway.enabled ? 'enabled' : 'disabled'}</div>
              {Object.entries(gateway.linkSettings).map(([channel, setting]) => (
                <div className="drawer-item" key={channel}>{channel}: manual {setting.manualMode ? 'on' : 'off'}, auto {setting.autoMode ? 'on' : 'off'}, deposit {setting.depositAmount ?? 'not set'}</div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <label className="switch"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span /></label>
);

export default PaymentGateway;
