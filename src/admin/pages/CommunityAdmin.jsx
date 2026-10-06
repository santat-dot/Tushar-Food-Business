import { useState } from "react";
import { productIdeas as seedIdeas, dishRequests as seedRequests, askKitchenQuestions as seedQ, customerMoments as seedMoments, kitchenNotesOfDay as seedNotes } from "../data/adminData";
import { PageHeader, Table, Badge, statusTone } from "../components/AdminUI";

const STAGES = ["Requested", "Draft", "Testing", "Coming Soon", "Available"];

export default function CommunityAdmin() {
  const [tab, setTab] = useState("ideas");
  const [ideas, setIdeas] = useState(seedIdeas);
  const [requests, setRequests] = useState(seedRequests);
  const [questions, setQuestions] = useState(seedQ);
  const [moments, setMoments] = useState(seedMoments);
  const [notes, setNotes] = useState(seedNotes);
  const [newNote, setNewNote] = useState({ type: "Announcement", text: "" });

  function advanceRequest(id) {
    setRequests((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const next = STAGES[Math.min(STAGES.indexOf(r.stage) + 1, STAGES.length - 1)];
      return { ...r, stage: next };
    }));
  }
  function moderateMoment(id, status) { setMoments((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m))); }
  function answerQuestion(id, answer) { setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer, status: "answered" } : q))); }
  function addNote(e) {
    e.preventDefault();
    if (!newNote.text.trim()) return;
    setNotes((prev) => [{ id: "kn" + Date.now(), ...newNote, date: new Date().toISOString().slice(0, 10) }, ...prev]);
    setNewNote({ type: "Announcement", text: "" });
  }

  return (
    <>
      <PageHeader title="Community" />
      <div className="admin-content">
        <div className="a-tabs">
          <button className={tab === "ideas" ? "active" : ""} onClick={() => setTab("ideas")}>What Should We Make Next?</button>
          <button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>Dish Requests</button>
          <button className={tab === "ask" ? "active" : ""} onClick={() => setTab("ask")}>Ask the Kitchen</button>
          <button className={tab === "moments" ? "active" : ""} onClick={() => setTab("moments")}>Customer Moments</button>
          <button className={tab === "notes" ? "active" : ""} onClick={() => setTab("notes")}>Kitchen Note of the Day</button>
        </div>

        {tab === "ideas" && (
          <div className="a-panel">
            <Table columns={["Idea", "Votes", "Deadline", "Status"]} rows={ideas} renderRow={(i) => (
              <tr key={i.id}><td>{i.name}</td><td>{i.votes}</td><td>{i.deadline}</td><td><Badge tone={statusTone(i.status)}>{i.status}</Badge></td></tr>
            )} />
          </div>
        )}

        {tab === "requests" && (
          <div className="a-panel">
            <Table columns={["Customer", "Dish", "Stage", "Actions"]} rows={requests} renderRow={(r) => (
              <tr key={r.id}>
                <td>{r.customer}</td><td>{r.dish}</td><td><Badge tone={statusTone(r.stage.toLowerCase().replace(" ", "-"))}>{r.stage}</Badge></td>
                <td>{r.stage !== "Available" && <button className="a-btn a-btn-sm" onClick={() => advanceRequest(r.id)}>Advance Stage</button>}</td>
              </tr>
            )} />
          </div>
        )}

        {tab === "ask" && (
          <div className="a-panel">
            <Table columns={["Product", "Customer", "Question", "Answer", "Status", "Actions"]} rows={questions} renderRow={(q) => (
              <tr key={q.id}>
                <td>{q.product}</td><td>{q.customer}</td><td style={{ maxWidth: 200 }}>{q.question}</td>
                <td style={{ maxWidth: 200 }}>{q.answer || "—"}</td>
                <td><Badge tone={statusTone(q.status)}>{q.status}</Badge></td>
                <td>{q.status === "pending" && <button className="a-btn a-btn-sm" onClick={() => answerQuestion(q.id, "Thanks for asking — our kitchen team will confirm shortly.")}>Approve Answer</button>}</td>
              </tr>
            )} />
          </div>
        )}

        {tab === "moments" && (
          <div className="a-panel">
            <Table columns={["Customer", "Product", "Story", "Reaction", "Status", "Actions"]} rows={moments} renderRow={(m) => (
              <tr key={m.id}>
                <td>{m.customer}</td><td>{m.product}</td><td style={{ maxWidth: 220 }}>{m.text}</td>
                <td><Badge tone="info">{m.reaction}</Badge></td>
                <td><Badge tone={statusTone(m.status)}>{m.status}</Badge></td>
                <td style={{ display: "flex", gap: 6 }}>
                  {m.status !== "approved" && <button className="a-btn a-btn-sm" onClick={() => moderateMoment(m.id, "approved")}>Approve</button>}
                  {m.status !== "rejected" && <button className="a-btn a-btn-outline a-btn-sm" onClick={() => moderateMoment(m.id, "rejected")}>Reject</button>}
                </td>
              </tr>
            )} />
          </div>
        )}

        {tab === "notes" && (
          <div className="a-panel">
            <form onSubmit={addNote} className="a-toolbar">
              <select className="a-select" value={newNote.type} onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}>
                {["Today's Special", "Ingredient Arrival", "Weekend Preparation", "Festival Preparation", "Announcement"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className="a-input" style={{ flex: 1, minWidth: 200 }} placeholder="Note text…" value={newNote.text} onChange={(e) => setNewNote({ ...newNote, text: e.target.value })} />
              <button className="a-btn" type="submit">Post Note</button>
            </form>
            <Table columns={["Type", "Note", "Date"]} rows={notes} renderRow={(n) => (
              <tr key={n.id}><td><Badge tone="info">{n.type}</Badge></td><td>{n.text}</td><td>{n.date}</td></tr>
            )} />
          </div>
        )}
      </div>
    </>
  );
}
