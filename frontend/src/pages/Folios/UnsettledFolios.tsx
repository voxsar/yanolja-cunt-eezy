import React, { useEffect, useState } from 'react';
import { Box, Search } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { Folio } from '../../types';
import { dateLabel, money } from '../../utils/pms';

const UnsettledFolios: React.FC = () => {
  const [folios, setFolios] = useState<Folio[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    pmsService.folios(query).then(setFolios);
  }, [query]);

  return (
    <div className="pms-page folio-page">
      <div className="pms-toolbar">
        <h2>Unsettled Folios</h2>
        <div className="toolbar-spacer" />
        <label className="inline-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Folio, Reservation, Guest" /><Search size={17} /></label>
      </div>
      <div className="panel-surface data-table-shell">
        <table className="data-table">
          <thead>
            <tr><th>Folio#</th><th>Reservation#</th><th>Guest Name</th><th>Arrival</th><th>Departure</th><th>Status</th><th>Balance</th></tr>
          </thead>
          <tbody>
            {folios.map((folio) => (
              <tr key={folio.id}>
                <td>{folio.folioNumber}</td>
                <td>{folio.reservationNumber}</td>
                <td>{folio.guestName}</td>
                <td>{dateLabel(folio.arrival)}</td>
                <td>{dateLabel(folio.departure)}</td>
                <td>{folio.status}</td>
                <td>$ {money(folio.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {folios.length === 0 && <div className="empty-state"><Box size={48} /><span>No Data</span></div>}
      </div>
    </div>
  );
};

export default UnsettledFolios;
