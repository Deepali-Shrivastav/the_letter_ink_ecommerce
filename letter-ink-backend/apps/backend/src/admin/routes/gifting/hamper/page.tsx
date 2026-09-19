import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Table, Input, Textarea, Label, FocusModal } from "@medusajs/ui"
import { Gift, Plus } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const HamperAdminPage = () => {
  const [hampers, setHampers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [collectionId, setCollectionId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    badge: "",
    imageUrl: "",
    status: "published",
  })

  // Helper to ensure 'Hampers' collection exists
  const ensureCollection = async () => {
    try {
      const res = await fetch("/admin/collections?handle=hampers")
      const data = await res.json()
      if (data.collections && data.collections.length > 0) {
        setCollectionId(data.collections[0].id)
        return data.collections[0].id
      } else {
        // Create it
        const createRes = await fetch("/admin/collections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Hampers", handle: "hampers" })
        })
        const createData = await createRes.json()
        setCollectionId(createData.collection.id)
        return createData.collection.id
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }

  const fetchHampers = async (colId: string) => {
    try {
      const res = await fetch(`/admin/products?collection_id[]=${colId}`)
      if (res.ok) {
        const data = await res.json()
        setHampers(data.products || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ensureCollection().then((id) => {
      if (id) fetchHampers(id)
    })
  }, [])

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEdit = (h: any) => {
    setEditingId(h.id)
    setFormData({
      title: h.title || "",
      description: h.description || "",
      price: h.variants?.[0]?.prices?.[0]?.amount?.toString() || "",
      badge: h.metadata?.badge || "",
      imageUrl: h.thumbnail || "",
      status: h.status || "published",
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hamper?")) return
    try {
      const res = await fetch(`/admin/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchHampers(collectionId!)
      } else {
        alert("Failed to delete hamper.")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!formData.title || (!editingId && !formData.price) || !collectionId) return alert("Title and Price are required.")

    setSubmitting(true)
    try {
      const scRes = await fetch("/admin/sales-channels")
      const scData = await scRes.json()
      const defaultSalesChannelId = scData.sales_channels?.[0]?.id

      let res;
      if (editingId) {
        const payload: any = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          sales_channels: defaultSalesChannelId ? [{ id: defaultSalesChannelId }] : undefined,
          metadata: {
            badge: formData.badge,
          },
          thumbnail: formData.imageUrl || undefined,
        }
        res = await fetch(`/admin/products/${editingId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      } else {
        const payload = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          collection_id: collectionId,
          sales_channels: defaultSalesChannelId ? [{ id: defaultSalesChannelId }] : undefined,
          metadata: {
            badge: formData.badge,
          },
          images: formData.imageUrl ? [{ url: formData.imageUrl }] : undefined,
          thumbnail: formData.imageUrl || undefined,
          options: [
            { title: "Size", values: ["Standard"] }
          ],
          variants: [
            {
              title: "Standard",
              options: { "Size": "Standard" },
              prices: [
                {
                  currency_code: "inr",
                  amount: parseFloat(formData.price)
                }
              ],
              manage_inventory: false,
            }
          ]
        }
        res = await fetch("/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        setIsModalOpen(false)
        setEditingId(null)
        setFormData({ title: "", description: "", price: "", badge: "", imageUrl: "", status: "published" })
        fetchHampers(collectionId)
      } else {
        const err = await res.json()
        alert(`Error: ${err.message || JSON.stringify(err)}`)
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Heading level="h1" className="mb-1 flex items-center gap-2">
            <Gift /> Bespoke Hampers
          </Heading>
          <Text className="text-ui-fg-subtle">
            Manage your artisanal curations & trunks.
          </Text>
        </div>
        <FocusModal open={isModalOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingId(null)
            setFormData({ title: "", description: "", price: "", badge: "", imageUrl: "", status: "published" })
          }
          setIsModalOpen(open)
        }}>
          <FocusModal.Trigger asChild>
            <Button variant="primary" onClick={() => setEditingId(null)}><Plus /> Add Hamper</Button>
          </FocusModal.Trigger>
          <FocusModal.Content>
            <FocusModal.Header>
              <Button onClick={() => setIsModalOpen(false)} variant="transparent">Cancel</Button>
              <Button onClick={handleSubmit} isLoading={submitting}>Save Hamper</Button>
            </FocusModal.Header>
            <FocusModal.Body className="flex justify-center py-8">
              <div className="w-full max-w-xl flex flex-col gap-y-4">
                <Heading level="h2">{editingId ? "Edit Hamper" : "Add New Hamper"}</Heading>
                <Text className="text-ui-fg-subtle mb-4">
                  This hamper will automatically appear in the Hampers section of the Gifting page.
                </Text>
                
                <div className="grid gap-2">
                  <Label>Hamper Name *</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. The Sovereign Atelier Keepsake Trunk" required />
                </div>
                
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the contents of the hamper..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Price (INR) {editingId ? "(Cannot be edited here)" : "*"}</Label>
                    <Input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="e.g. 3800" required={!editingId} disabled={!!editingId} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Highlight Badge</Label>
                    <Input name="badge" value={formData.badge} onChange={handleChange} placeholder="e.g. BESTSELLER" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Image URL</Label>
                  <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
                </div>
                
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <select name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full items-center justify-between rounded-md border border-ui-border-base px-3 py-2 text-sm bg-ui-bg-field text-ui-fg-base">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </FocusModal.Body>
          </FocusModal.Content>
        </FocusModal>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Hamper</Table.HeaderCell>
            <Table.HeaderCell>Badge</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row><Table.Cell colSpan={3}>Loading...</Table.Cell></Table.Row>
          ) : hampers.length === 0 ? (
            <Table.Row><Table.Cell colSpan={3} className="text-center text-ui-fg-subtle">No hampers found. Create one to get started.</Table.Cell></Table.Row>
          ) : (
            hampers.map(h => (
              <Table.Row key={h.id}>
                <Table.Cell className="font-medium flex items-center gap-3">
                  {h.thumbnail && <img src={h.thumbnail} alt="" className="w-8 h-8 rounded-md object-cover" />}
                  {h.title}
                </Table.Cell>
                <Table.Cell>{h.metadata?.badge || "-"}</Table.Cell>
                <Table.Cell>{h.status}</Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="transparent" size="small" onClick={() => handleEdit(h)}>Edit</Button>
                    <Button variant="transparent" size="small" className="text-ui-fg-error" onClick={() => handleDelete(h.id)}>Delete</Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Hampers",
})

export default HamperAdminPage
