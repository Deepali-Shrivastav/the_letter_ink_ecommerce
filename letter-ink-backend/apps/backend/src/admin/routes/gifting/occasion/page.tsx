import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Table, Input, Label, FocusModal } from "@medusajs/ui"
import { Gift, Plus } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const OccasionAdminPage = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [rootCategoryId, setRootCategoryId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
  })

  // Ensure Root Occasion Category exists
  const ensureRootCategory = async () => {
    try {
      const res = await fetch("/admin/product-categories?handle=occasions&include_descendants_tree=true")
      const data = await res.json()
      if (data.product_categories && data.product_categories.length > 0) {
        setRootCategoryId(data.product_categories[0].id)
        return data.product_categories[0].id
      } else {
        // Create root category
        const createRes = await fetch("/admin/product-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Occasions", handle: "occasions", is_active: true })
        })
        const createData = await createRes.json()
        setRootCategoryId(createData.product_category.id)
        return createData.product_category.id
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }

  const fetchCategories = async (rootId: string) => {
    try {
      const res = await fetch(`/admin/product-categories?parent_category_id=${rootId}`)
      if (res.ok) {
        const data = await res.json()
        setCategories(data.product_categories || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ensureRootCategory().then((id) => {
      if (id) fetchCategories(id)
    })
  }, [])

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEdit = (c: any) => {
    setEditingId(c.id)
    setFormData({
      title: c.name || "",
      handle: c.handle || "",
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this occasion?")) return
    try {
      const res = await fetch(`/admin/product-categories/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchCategories(rootCategoryId!)
      } else {
        alert("Failed to delete occasion.")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!formData.title || (!editingId && !rootCategoryId)) return alert("Title is required.")

    setSubmitting(true)
    try {
      let res;
      if (editingId) {
        res = await fetch(`/admin/product-categories/${editingId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.title,
            handle: formData.handle || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            is_active: true,
          })
        })
      } else {
        res = await fetch("/admin/product-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.title,
            handle: formData.handle || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            parent_category_id: rootCategoryId,
            is_active: true,
          })
        })
      }

      if (res.ok) {
        setIsModalOpen(false)
        setEditingId(null)
        setFormData({ title: "", handle: "" })
        fetchCategories(rootCategoryId!)
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
            <Gift /> Occasion Management
          </Heading>
          <Text className="text-ui-fg-subtle">
            Create occasion categories like Birthday, Wedding, etc., and add gifts to them.
          </Text>
        </div>
        <FocusModal open={isModalOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingId(null)
            setFormData({ title: "", handle: "" })
          }
          setIsModalOpen(open)
        }}>
          <FocusModal.Trigger asChild>
            <Button variant="primary" onClick={() => setEditingId(null)}><Plus /> Add Occasion</Button>
          </FocusModal.Trigger>
          <FocusModal.Content>
            <FocusModal.Header>
              <Button onClick={() => setIsModalOpen(false)} variant="transparent">Cancel</Button>
              <Button onClick={handleSubmit} isLoading={submitting}>Save Occasion</Button>
            </FocusModal.Header>
            <FocusModal.Body className="flex justify-center py-8">
              <div className="w-full max-w-xl flex flex-col gap-y-4">
                <Heading level="h2">{editingId ? "Edit Occasion Category" : "Add New Occasion Category"}</Heading>
                
                <div className="grid gap-2">
                  <Label>Occasion Name *</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Birthday" required />
                </div>
                
                <div className="grid gap-2">
                  <Label>Handle (optional)</Label>
                  <Input name="handle" value={formData.handle} onChange={handleChange} placeholder="e.g. birthday" />
                </div>
              </div>
            </FocusModal.Body>
          </FocusModal.Content>
        </FocusModal>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Occasion</Table.HeaderCell>
            <Table.HeaderCell>Handle</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row><Table.Cell colSpan={3}>Loading...</Table.Cell></Table.Row>
          ) : categories.length === 0 ? (
            <Table.Row><Table.Cell colSpan={3} className="text-center text-ui-fg-subtle">No occasion categories found. Create one to get started.</Table.Cell></Table.Row>
          ) : (
            categories.map(c => (
              <Table.Row key={c.id}>
                <Table.Cell className="font-medium">{c.name}</Table.Cell>
                <Table.Cell className="text-ui-fg-subtle">{c.handle}</Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="transparent" size="small" onClick={() => handleEdit(c)}>Edit</Button>
                    <Link to={`/gifting/occasion/${c.id}?name=${encodeURIComponent(c.name)}`}>
                      <Button variant="secondary" size="small">Manage Gifts</Button>
                    </Link>
                    <Button variant="transparent" size="small" className="text-ui-fg-error" onClick={() => handleDelete(c.id)}>Delete</Button>
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
  label: "Occasions",
})

export default OccasionAdminPage
