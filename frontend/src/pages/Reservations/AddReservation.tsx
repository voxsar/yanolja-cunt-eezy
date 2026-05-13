import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, UserPlus, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { BusinessSource, Guest, Room } from '../../types';
import { addIsoDays, dateLabel, money, todayIso } from '../../utils/pms';

const AddReservation: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [businessSources, setBusinessSources] = useState<BusinessSource[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [drawer, setDrawer] = useState<'learn' | 'guest' | 'room' | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    checkIn: todayIso(),
    checkOut: addIsoDays(todayIso(), 1),
    checkInTime: '10:13',
    checkOutTime: '11:00',
    roomId: '',
    adults: '1',
    children: '0',
    reservationType: 'Confirm Booking',
    bookingSource: 'direct',
    businessSource: 'Direct',
    salesPerson: 'Sasi',
    rateType: 'FB',
    title: 'Mr.',
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    zipCode: '',
    country: 'Sri Lanka',
    city: '',
    rate: '0',
    paidAmount: '0',
    sendCheckoutEmail: true
  });

  useEffect(() => {
    pmsService.businessSources().then(setBusinessSources);
    pmsService.guests().then(setGuests);
  }, []);

  useEffect(() => {
    pmsService.availableRooms(form.checkIn, form.checkOut).then(setRooms);
  }, [form.checkIn, form.checkOut]);

  const selectedRoom = rooms.find((room) => String(room.id) === form.roomId);
  const rate = selectedRoom?.roomType ? Number(selectedRoom.roomType.basePrice) : Number(form.rate || 0);
  const tax = rate * 0.1;
  const due = rate + tax - Number(form.paidAmount || 0);

  const canSave = useMemo(() => Boolean(form.fullName.trim().length > 1 && form.roomId), [form.fullName, form.roomId]);

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async () => {
    if (!canSave || !selectedRoom) return;
    setSaving(true);
    const [firstName, ...rest] = form.fullName.trim().split(' ');
    const guest = await pmsService.createGuest({
      title: form.title,
      firstName,
      lastName: rest.join(' ') || '-',
      mobile: form.mobile || undefined,
      email: form.email || undefined,
      address: form.address || undefined,
      zipCode: form.zipCode || undefined,
      country: form.country || undefined,
      city: form.city || undefined,
      isVIP: false
    });

    await pmsService.createReservation({
      guestId: guest.id,
      roomId: selectedRoom.id,
      roomTypeId: selectedRoom.roomTypeId,
      checkIn: `${form.checkIn}T${form.checkInTime}:00`,
      checkOut: `${form.checkOut}T${form.checkOutTime}:00`,
      adults: Number(form.adults),
      children: Number(form.children),
      source: form.bookingSource,
      businessSource: form.businessSource,
      salesPerson: form.salesPerson,
      totalAmount: rate + tax,
      paidAmount: Number(form.paidAmount || 0),
      rateType: form.rateType
    });
    navigate('/reservations');
  };

  return (
    <div className="pms-page add-reservation-page">
      <div className="booking-layout">
        <section className="booking-form">
          <div className="form-titlebar">
            <button className="icon-button" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
            <h2>Add Reservation</h2>
            <button className="learn-button" onClick={() => setDrawer('learn')}>Learn How to Add Reservation</button>
          </div>

          <div className="form-grid reservation-top-grid">
            <Field label="Check-in">
              <div className="compound-field">
                <input type="date" value={form.checkIn} onChange={(event) => update('checkIn', event.target.value)} />
                <Calendar size={16} />
              </div>
            </Field>
            <Field label=" ">
              <div className="compound-field">
                <input type="time" value={form.checkInTime} onChange={(event) => update('checkInTime', event.target.value)} />
                <Clock size={16} />
              </div>
            </Field>
            <Field label="Check-out">
              <div className="compound-field">
                <input type="date" value={form.checkOut} onChange={(event) => update('checkOut', event.target.value)} />
                <Calendar size={16} />
              </div>
            </Field>
            <Field label=" ">
              <div className="compound-field">
                <input type="time" value={form.checkOutTime} onChange={(event) => update('checkOutTime', event.target.value)} />
                <Clock size={16} />
              </div>
            </Field>
            <Field label="Room(s)">
              <input type="number" value="1" readOnly />
            </Field>
            <Field label="Reservation Type">
              <select value={form.reservationType} onChange={(event) => update('reservationType', event.target.value)}>
                <option>Confirm Booking</option>
                <option>Tentative Booking</option>
              </select>
            </Field>
            <Field label="Booking Source">
              <select value={form.bookingSource} onChange={(event) => update('bookingSource', event.target.value)}>
                <option value="direct">Direct</option>
                <option value="booking_engine">Booking Engine</option>
                <option value="airbnb">Airbnb</option>
                <option value="booking_com">Booking.com</option>
              </select>
            </Field>
            <Field label="Business Source">
              <select value={form.businessSource} onChange={(event) => update('businessSource', event.target.value)}>
                <option value="">-Select-</option>
                {businessSources.map((source) => (
                  <option key={source.id} value={source.name}>{source.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Sales Person">
              <select value={form.salesPerson} onChange={(event) => update('salesPerson', event.target.value)}>
                <option>Sasi</option>
                <option>Front Desk</option>
              </select>
            </Field>
          </div>

          <div className="divider" />
          <div className="checkbox-row">
            <label><input type="checkbox" disabled /> Contract</label>
            <label><input type="checkbox" /> Book All Available Rooms</label>
            <label><input type="checkbox" /> Quick Group Booking</label>
            <label><input type="checkbox" /> Complimentary Room</label>
          </div>

          <div className="room-pick-grid">
            <Field label="Room Type">
              <select value={selectedRoom?.roomTypeId || ''} onChange={() => undefined}>
                <option>{selectedRoom?.roomType?.name || '-Select-'}</option>
              </select>
            </Field>
            <Field label="Rate Type">
              <select value={form.rateType} onChange={(event) => update('rateType', event.target.value)}>
                <option>FB</option>
                <option>BB</option>
              </select>
            </Field>
            <Field label="Room">
              <select value={form.roomId} onChange={(event) => update('roomId', event.target.value)}>
                <option value="">-Select-</option>
                {rooms.map((room) => <option key={room.id} value={room.id}>{room.roomNumber}</option>)}
              </select>
            </Field>
            <Field label="Adult">
              <input type="number" value={form.adults} min="1" onChange={(event) => update('adults', event.target.value)} />
            </Field>
            <Field label="Child">
              <input type="number" value={form.children} min="0" onChange={(event) => update('children', event.target.value)} />
            </Field>
            <Field label="Rate ($) (Tax Inc.)">
              <input value={money(rate)} onChange={(event) => update('rate', event.target.value)} />
            </Field>
          </div>
          <button className="outline-button room-add-button" onClick={() => setDrawer('room')}>Add Room</button>

          <FormSection title="Guest Information">
            <div className="guest-grid">
              <Field label="Guest Name">
                <div className="guest-name-field">
                  <select value={form.title} onChange={(event) => update('title', event.target.value)}>
                    <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                  </select>
                  <input placeholder="Full Name" value={form.fullName} onChange={(event) => update('fullName', event.target.value)} />
                  <button type="button" onClick={() => setDrawer('guest')}><UserPlus size={18} /></button>
                </div>
              </Field>
              <Field label="Mobile">
                <input placeholder="Mobile" value={form.mobile} onChange={(event) => update('mobile', event.target.value)} />
              </Field>
              <Field label="Email">
                <input placeholder="Email" value={form.email} onChange={(event) => update('email', event.target.value)} />
              </Field>
              <Field label="Address">
                <input placeholder="Address" value={form.address} onChange={(event) => update('address', event.target.value)} />
              </Field>
              <Field label="Zip">
                <input placeholder="Zip" value={form.zipCode} onChange={(event) => update('zipCode', event.target.value)} />
              </Field>
              <Field label="Country">
                <select value={form.country} onChange={(event) => update('country', event.target.value)}>
                  <option>Sri Lanka</option>
                  <option>India</option>
                  <option>United States</option>
                </select>
              </Field>
              <Field label="City">
                <input placeholder="City" value={form.city} onChange={(event) => update('city', event.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Other Information">
            <div className="checkbox-list">
              <label><input type="checkbox" /> Email Booking Vouchers</label>
              <label>
                <input
                  type="checkbox"
                  checked={form.sendCheckoutEmail}
                  onChange={(event) => update('sendCheckoutEmail', event.target.checked)}
                />
                Send email at Check-out
              </label>
            </div>
          </FormSection>
        </section>

        <aside className="billing-summary">
          <div className="summary-head">
            <h2>Billing Summary</h2>
            <button className="confirm-chip" disabled={!canSave || saving} onClick={submit}>
              {saving ? 'Saving...' : 'Confirm Booking'}
            </button>
          </div>
          <div className="summary-dates">
            <div><span>Check-in</span><strong>{dateLabel(form.checkIn)}</strong></div>
            <b>--</b>
            <div><span>Check-out</span><strong>{dateLabel(form.checkOut)}</strong></div>
          </div>
          <div className="summary-lines">
            <p><span>Room Charges</span><b>{money(rate)}</b></p>
            <p><span>Taxes</span><b>{money(tax)}</b></p>
            <p><span>Due Amount</span><strong>$ {money(due)}</strong></p>
          </div>
          <div className="bill-options">
            <Field label="Bill To"><select><option>-Select-</option><option>Guest</option></select></Field>
            <label><input type="checkbox" /> Tax Exempt</label>
            <label><input type="checkbox" /> Payment Mode</label>
          </div>
        </aside>
      </div>
      {drawer && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>{drawer === 'learn' ? 'Reservation Workflow' : drawer === 'guest' ? 'Select Guest' : 'Selected Room'}</h2>
              <button className="icon-button" onClick={() => setDrawer(null)}><X size={22} /></button>
            </div>
            {drawer === 'learn' && (
              <div className="drawer-list">
                <div className="drawer-item">Choose stay dates and the booking source.</div>
                <div className="drawer-item">Select an available room from live inventory.</div>
                <div className="drawer-item">Add or select guest details, then confirm booking.</div>
              </div>
            )}
            {drawer === 'guest' && (
              <div className="drawer-list">
                {guests.map((guest) => (
                  <button
                    key={guest.id}
                    onClick={() => {
                      setForm((current) => ({
                        ...current,
                        title: guest.title || current.title,
                        fullName: `${guest.firstName} ${guest.lastName}`,
                        mobile: guest.mobile || guest.phone || '',
                        email: guest.email || '',
                        address: guest.address || '',
                        zipCode: guest.zipCode || '',
                        country: guest.country || '',
                        city: guest.city || ''
                      }));
                      setDrawer(null);
                    }}
                  >
                    {guest.title} {guest.firstName} {guest.lastName} - {guest.mobile || guest.email || 'No contact'}
                  </button>
                ))}
              </div>
            )}
            {drawer === 'room' && (
              <div className="drawer-form">
                {selectedRoom ? (
                  <>
                    <div className="drawer-item">{selectedRoom.roomNumber}</div>
                    <div className="drawer-item">{selectedRoom.roomType?.name || 'Room type unavailable'}</div>
                    <div className="drawer-item">$ {money(rate)} base rate</div>
                    <div className="drawer-actions"><button className="dark-button" onClick={() => setDrawer(null)}>Use Selected Room</button></div>
                  </>
                ) : (
                  <div className="empty-state">Select a room before adding it to the reservation.</div>
                )}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="field">
    <span>{label}</span>
    {children}
  </label>
);

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="form-section">
    <h3>{title}</h3>
    {children}
  </section>
);

export default AddReservation;
