import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Table, Badge, Button, Input, Textarea, Label, FocusModal } from "@medusajs/ui"
import { useEffect, useState } from "react"

const WorkshopsAdminPage = () => {
  const [workshops, setWorkshops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    level: "",
    price: "4500",
    spots_text: "Limited seats available",
    kit_info: "Full calligraphy kit & materials included",
    imageUrl: "",
  })

  const fetchWorkshops = async () => {
    try {
      const res = await fetch("/admin/workshops")
      if (res.ok) {
        const data = await res.json()
        setWorkshops(data.workshops || [])
      }
    } catch (e) {
      console.error("Failed to fetch workshops:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkshops()
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!formData.title) return alert("Title is required")

    setSubmitting(true)
    try {
      const res = await fetch("/admin/workshops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: formData.imageUrl ? [formData.imageUrl] : [],
        }),
      })

      if (res.ok) {
        setOpenModal(false)
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          venue: "",
          level: "",
          price: "4500",
          spots_text: "Limited seats available",
          kit_info: "Full calligraphy kit & materials included",
          imageUrl: "",
        })
        await fetchWorkshops()
      } else {
        const err = await res.json()
        alert(`Error: ${err.message || "Failed to create workshop"}`)
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workshop?")) return
    try {
      const res = await fetch(`/admin/workshops?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        await fetchWorkshops()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Workshops Module</Heading>
          <p className="text-ui-fg-subtle text-sm">
            Manage upcoming calligraphy workshops and masterclasses directly in the dedicated backend module.
          </p>
        </div>
        <Button variant="primary" size="small" onClick={() => setOpenModal(true)}>
          + Create Workshop
        </Button>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-ui-fg-subtle">Loading workshops from Workshop Module...</p>
        ) : workshops.length === 0 ? (
          <p className="text-ui-fg-subtle">No workshops found. Click "+ Create Workshop" to add one.</p>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Date & Time</Table.HeaderCell>
                <Table.HeaderCell>Venue</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {workshops.map((w: any) => (
                <Table.Row key={w.id}>
                  <Table.Cell className="font-medium text-ui-fg-base">{w.title}</Table.Cell>
                  <Table.Cell>{w.date} {w.time ? `• ${w.time}` : ""}</Table.Cell>
                  <Table.Cell>{w.venue}</Table.Cell>
                  <Table.Cell>₹{Number(w.price).toLocaleString("en-IN")}</Table.Cell>
                  <Table.Cell>
                    <Badge color="green">{w.status || "published"}</Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Button
                      variant="transparent"
                      size="small"
                      className="text-ui-fg-error hover:bg-ui-bg-base-hover"
                      onClick={() => handleDelete(w.id)}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* Modal / Dialog Form for Creating Workshop */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-ui-bg-subtle border border-ui-border-base rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-ui-border-base mb-4">
              <Heading level="h2">Add New Workshop</Heading>
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="text-ui-fg-subtle hover:text-ui-fg-base text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-1 block">Workshop Title *</Label>
                <Input
                  name="title"
                  placeholder="e.g. Copperplate Calligraphy Masterclass"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-1 block">Date</Label>
                  <Input
                    name="date"
                    placeholder="e.g. Saturday, Oct 24, 2026"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-1 block">Time</Label>
                  <Input
                    name="time"
                    placeholder="e.g. 10:00 AM - 1:00 PM"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-1 block">Venue</Label>
                  <Input
                    name="venue"
                    placeholder="e.g. The Letter Ink Studio, Bangalore"
                    value={formData.venue}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-1 block">Level</Label>
                  <Input
                    name="level"
                    placeholder="e.g. Beginner to Intermediate"
                    value={formData.level}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-1 block">Price (₹)</Label>
                  <Input
                    name="price"
                    type="number"
                    placeholder="4500"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-1 block">Spots Info</Label>
                  <Input
                    name="spots_text"
                    placeholder="e.g. Limited to 12 seats"
                    value={formData.spots_text}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-1 block">Calligraphy Kit Info</Label>
                <Input
                  name="kit_info"
                  placeholder="e.g. Professional nib, holder & workbook included"
                  value={formData.kit_info}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold mb-1 block">Image URL</Label>
                <Input
                  name="imageUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold mb-1 block">Description</Label>
                <Textarea
                  name="description"
                  rows={3}
                  placeholder="Detailed description of what participants will learn..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ui-border-base">
                <Button type="button" variant="secondary" onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={submitting}>
                  Create Workshop
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Workshops",
})

export default WorkshopsAdminPage
