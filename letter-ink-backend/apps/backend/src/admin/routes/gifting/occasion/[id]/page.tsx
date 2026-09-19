import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Table, Input, Textarea, Label, FocusModal } from "@medusajs/ui"
import { Gift, Plus } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { useParams, useSearchParams, Link } from "react-router-dom"

const OccasionGiftsAdminPage = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const occasionName = searchParams.get("name") || "Occasion"

  const [gifts, setGifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    badge: "",
    imageUrl: "",
    tags: "",
    status: "published",
  })

  const fetchGifts = async () => {
    try {
      const res = await fetch(`/admin/products?category_id[]=${id}`)
      if (res.ok) {
        const data = await res.json()
        setGifts(data.products || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchGifts()
  }, [id])

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEdit = (g: any) => {
    setEditingId(g.id)
    setFormData({
      title: g.title || "",
      description: g.description || "",
      price: g.variants?.[0]?.prices?.[0]?.amount?.toString() || "",
      badge: g.metadata?.badge || "",
      imageUrl: g.thumbnail || "",
      tags: g.tags?.map((t: any) => t.value).join(", ") || "",
      status: g.status || "published",
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gift?")) return
    try {
      const res = await fetch(`/admin/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchGifts()
      } else {
        alert("Failed to delete gift.")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!formData.title || (!editingId && !formData.price) || !id) return alert("Title and Price are required.")

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
          tags: formData.tags.split(",").map(t => ({ value: t.trim() })).filter(t => t.value),
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
          categories: [{ id }],
          sales_channels: defaultSalesChannelId ? [{ id: defaultSalesChannelId }] : undefined,
          metadata: {
            badge: formData.badge,
          },
          tags: formData.tags.split(",").map(t => ({ value: t.trim() })).filter(t => t.value),
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
        setFormData({ title: "", description: "", price: "", badge: "", imageUrl: "", tags: "", status: "published" })
        fetchGifts()
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
      <div className="mb-4">
        <Link to="/gifting/occasion" className="text-ui-fg-subtle hover:text-ui-fg-base text-sm">
          ← Back to Occasions
        </Link>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Heading level="h1" className="mb-1 flex items-center gap-2">
            <Gift /> {occasionName} Gifts
          </Heading>
          <Text className="text-ui-fg-subtle">
            Manage gifts within this occasion category.
          </Text>
        </div>
        <FocusModal open={isModalOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingId(null)
            setFormData({ title: "", description: "", price: "", badge: "", imageUrl: "", tags: "", status: "published" })
          }
          setIsModalOpen(open)
        }}>
          <FocusModal.Trigger asChild>
            <Button variant="primary" onClick={() => setEditingId(null)}><Plus /> Add Gift</Button>
          </FocusModal.Trigger>
          <FocusModal.Content>
            <FocusModal.Header>
              <Button onClick={() => setIsModalOpen(false)} variant="transparent">Cancel</Button>
              <Button onClick={handleSubmit} isLoading={submitting}>Save Gift</Button>
            </FocusModal.Header>
            <FocusModal.Body className="flex justify-center py-8">
              <div className="w-full max-w-xl flex flex-col gap-y-4">
                <Heading level="h2">{editingId ? "Edit Gift" : `Add New Gift to ${occasionName}`}</Heading>
                
                <div className="grid gap-2">
                  <Label>Gift Name *</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. The Bridal Epistolary Hamper" required />
                </div>
                
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the gift..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Price (INR) {editingId ? "(Cannot be edited here)" : "*"}</Label>
                    <Input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="e.g. 4200" required={!editingId} disabled={!!editingId} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Highlight Badge</Label>
                    <Input name="badge" value={formData.badge} onChange={handleChange} placeholder="e.g. NEW" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Tags (comma separated)</Label>
                  <Input name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. SILK RIBBON, GOLD MICA INK" />
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
            <Table.HeaderCell>Gift</Table.HeaderCell>
            <Table.HeaderCell>Badge</Table.HeaderCell>
            <Table.HeaderCell>Tags</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row><Table.Cell colSpan={5}>Loading...</Table.Cell></Table.Row>
          ) : gifts.length === 0 ? (
            <Table.Row><Table.Cell colSpan={5} className="text-center text-ui-fg-subtle">No gifts found. Create one to get started.</Table.Cell></Table.Row>
          ) : (
            gifts.map(g => (
              <Table.Row key={g.id}>
                <Table.Cell className="font-medium flex items-center gap-3">
                  {g.thumbnail && <img src={g.thumbnail} alt="" className="w-8 h-8 rounded-md object-cover" />}
                  {g.title}
                </Table.Cell>
                <Table.Cell>{g.metadata?.badge || "-"}</Table.Cell>
                <Table.Cell>{g.tags?.map((t: any) => t.value).join(", ") || "-"}</Table.Cell>
                <Table.Cell>{g.status}</Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="transparent" size="small" onClick={() => handleEdit(g)}>Edit</Button>
                    <Button variant="transparent" size="small" className="text-ui-fg-error" onClick={() => handleDelete(g.id)}>Delete</Button>
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
  label: "Occasion Gifts",
})

export default OccasionGiftsAdminPage
