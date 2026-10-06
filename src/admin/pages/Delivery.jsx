import { useState } from "react";
import { deliveryZones as seed, capacitySettings } from "../data/adminData";
import { PageHeader, Table, Badge } from "../components/AdminUI";

export default function Delivery() {
  const [zones, setZones] = useState(seed);

  function toggleZone(id) { setZones((prev) => prev.map((z) => (z.id === id ? { ...z, active: !z.active } : z))); }

  return (
    <>
      <PageHeader title="Delivery Management" />
      <div className="admin-content">
        <div className="a-panel" style={{ marginBottom: 16 }}>
          <h3>Pincodes & Zones</h3>
          <Table
            columns={["Pincode", "Zone", "Delivery Charge", "Free Delivery Threshold", "Status", "Actions"]}
            rows={zones}
            renderRow={(z) => (
              <tr key={z.id}>
                <td>{z.pincode}</td><td>{z.zone}</td>
                <td>{z.charge === 0 ? "Free" : `₹${z.charge}`}</td>
                <td>₹{z.freeThreshold}</td>
                <td><Badge tone={z.active ? "good" : "bad"}>{z.active ? "active" : "inactive"}</Badge></td>
                <td><button className="a-btn a-btn-outline a-btn-sm" onClick={() => toggleZone(z.id)}>{z.active ? "Disable" : "Enable"}</button></td>
              </tr>
            )}
          />
        </div>

        <div className="a-panel">
          <h3>Delivery Slots</h3>
          <Table
            columns={["Slot", "Capacity", "Booked", "Cutoff", "Pre-orders Allowed"]}
            rows={capacitySettings.slotCapacity}
            renderRow={(s) => (
              <tr key={s.slot}><td>{s.slot}</td><td>{s.capacity}</td><td>{s.booked}</td><td>{capacitySettings.prepCutoff}</td><td>Yes</td></tr>
            )}
          />
          <p style={{ fontSize: 13, marginTop: 12 }}><strong>Closed dates:</strong> {capacitySettings.closedDates.join(", ")}</p>
        </div>
      </div>
    </>
  );
}
