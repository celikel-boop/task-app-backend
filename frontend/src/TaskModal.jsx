import { useState, useEffect } from "react"

export default function TaskModal({ isOpen, onClose, onSave, task }) {
  const [form, setForm] = useState({
    title: "",
    assignee: "",
    status: "unassigned",
    startDate: "",
    endDate: "",
    comment: ""
  })

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        assignee: task.assignee || "",
        status: task.status || "unassigned",
        startDate: task.start_date || "",
        endDate: task.end_date || "",
        comment: task.comment || ""
      })
    }
  }, [task])

  if (!isOpen) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Title zorunludur")
      return
    }
    onSave(form)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{task ? "Edit Task" : "New Task"}</h2>

        <label>Title *</label>
        <input name="title" value={form.title} onChange={handleChange} />

        <label>Assignee</label>
        <input name="assignee" value={form.assignee} onChange={handleChange} />

        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="unassigned">Unassigned</option>
          <option value="assigned">Assigned</option>
          <option value="done">Done</option>
        </select>

        <label>Start Date</label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />

        <label>End Date</label>
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />

        <label>Comment</label>
        <textarea name="comment" value={form.comment} onChange={handleChange} />

        {task?.created_at && (
          <p className="created-date">
            Created: {new Date(task.created_at).toLocaleString()}
          </p>
        )}

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  )
}

{editingTask && (
  <div className="creation-date">
    Created at: {editingTask.creationDate || "-"}
  </div>
)}
