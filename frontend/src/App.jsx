import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8000/tasks";
const ITEMS_PER_PAGE = 10;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showDone, setShowDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const emptyForm = {
    title: "",
    assignee: "",
    status: "unassigned",
    comment: "",
    start_date: "",
    end_date: "",
    created_at: null
  };

  const [form, setForm] = useState(emptyForm);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setTasks([...data].reverse());
      });
  }, []);

  /* ================= FILTER ================= */
  const filteredTasks = showDone
    ? tasks
    : tasks.filter(t => t.status !== "done");

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    if (!window.confirm("Bu task silinsin mi?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        setTasks(prev => prev.filter(t => t.id !== id));
      });
  };

  /* ================= MODAL ================= */
  const openNewTask = () => {
    setEditingTask(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title || "",
      assignee: task.assignee || "",
      status: task.status || "unassigned",
      comment: task.comment || "",
      start_date: task.start_date || "",
      end_date: task.end_date || "",
      created_at: task.created_at || null
    });
    setShowModal(true);
  };

  /* ================= SAVE ================= */
  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Title zorunlu");
      return;
    }

    const payload = { ...form };
    delete payload.created_at; // backend otomatik atıyor

    const method = editingTask ? "PUT" : "POST";
    const url = editingTask
      ? `${API_URL}/${editingTask.id}`
      : API_URL;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(saved => {
        setShowModal(false);

        setTasks(prev => {
          if (editingTask) {
            return prev.map(t => (t.id === saved.id ? saved : t));
          }
          return [saved, ...prev];
        });
      });
  };

  /* ================= UI ================= */
  return (
    <div className="app">
      <h1>Task List</h1>

      <div className="toolbar">
        <button onClick={openNewTask}>+ New Task</button>

        <label className="switch">
          <input
            type="checkbox"
            checked={showDone}
            onChange={() => {
              setShowDone(!showDone);
              setCurrentPage(1);
            }}
          />
          <span>Done göster</span>
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Assignee</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedTasks.map(task => (
            <tr
              key={task.id}
              className={`row-${task.status}`}
              onClick={() => openEditTask(task)}
            >
              <td>{task.title}</td>
              <td>{task.assignee || "-"}</td>
              <td>{task.status}</td>
              <td>
                <button
                  className="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task.id);
                  }}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editingTask ? "Edit Task" : "New Task"}</h2>

            <input
              placeholder="Title *"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <input
              placeholder="Assignee"
              value={form.assignee}
              onChange={e => setForm({ ...form, assignee: e.target.value })}
            />

            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="unassigned">unassigned</option>
              <option value="assigned">assigned</option>
              <option value="done">done</option>
            </select>

            <textarea
              placeholder="Comment"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
            />

            {editingTask && form.created_at && (
              <div className="creation-date">
                Created at:{" "}
                {new Date(form.created_at).toLocaleString()}
              </div>
            )}

            <div className="modal-actions">
              <button onClick={handleSubmit}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
