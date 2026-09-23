import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Table, Input, Textarea, Label, FocusModal } from "@medusajs/ui"
import { DocumentText, Plus, PencilSquare, Trash } from "@medusajs/icons"
import { useState, useEffect } from "react"

const BlogsAdminPage = () => {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    description: "",
    content: "",
    author: "",
    category: "",
    read_time: "",
    publish_date: "",
    images: "",
    status: "published",
  })

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`/admin/blogs`)
      if (res.ok) {
        const data = await res.json()
        setBlogs(data.blogs || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEdit = (b: any) => {
    setEditingId(b.id)
    setFormData({
      title: b.title || "",
      handle: b.handle || "",
      description: b.description || "",
      content: b.content || "",
      author: b.author || "",
      category: b.category || "",
      read_time: b.read_time || "",
      publish_date: b.publish_date || "",
      images: b.images ? JSON.stringify(b.images) : "",
      status: b.status || "published",
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return
    try {
      const res = await fetch(`/admin/blogs/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchBlogs()
      } else {
        alert("Failed to delete blog.")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!formData.title || !formData.handle) return alert("Title and Handle are required.")

    setSubmitting(true)
    try {
      const payload: any = {
        title: formData.title,
        handle: formData.handle,
        description: formData.description,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        read_time: formData.read_time,
        publish_date: formData.publish_date,
        status: formData.status,
      }
      
      try {
        if (formData.images) {
            payload.images = JSON.parse(formData.images)
        }
      } catch (e) {
         // handle invalid JSON gracefully or just skip
      }

      let res;
      if (editingId) {
        res = await fetch(`/admin/blogs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch("/admin/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        setIsModalOpen(false)
        setEditingId(null)
        setFormData({ title: "", handle: "", description: "", content: "", author: "", category: "", read_time: "", publish_date: "", images: "", status: "published" })
        fetchBlogs()
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
            <DocumentText /> Blogs
          </Heading>
          <Text className="text-ui-fg-subtle">
            Manage your store's blog posts, tutorials, and journal entries.
          </Text>
        </div>
        <FocusModal open={isModalOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingId(null)
            setFormData({ title: "", handle: "", description: "", content: "", author: "", category: "", read_time: "", publish_date: "", images: "", status: "published" })
          }
          setIsModalOpen(open)
        }}>
          <FocusModal.Trigger asChild>
            <Button variant="primary" onClick={() => setEditingId(null)}><Plus /> Add Post</Button>
          </FocusModal.Trigger>
          <FocusModal.Content>
            <FocusModal.Header>
              <Button onClick={() => setIsModalOpen(false)} variant="transparent">Cancel</Button>
              <Button onClick={handleSubmit} isLoading={submitting}>Save Post</Button>
            </FocusModal.Header>
            <FocusModal.Body className="flex justify-center py-8">
              <div className="w-full max-w-3xl flex flex-col gap-y-6">
                <Heading level="h2">{editingId ? "Edit Blog Post" : "Add New Blog Post"}</Heading>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Title *</Label>
                    <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. The Art of Glass Engraving" required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Handle (Slug) *</Label>
                    <Input name="handle" value={formData.handle} onChange={handleChange} placeholder="e.g. the-art-of-glass-engraving" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Author</Label>
                    <Input name="author" value={formData.author} onChange={handleChange} placeholder="e.g. Deepali Shrivastav" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Calligraphy Insights" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Read Time</Label>
                    <Input name="read_time" value={formData.read_time} onChange={handleChange} placeholder="e.g. 5 min read" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Publish Date</Label>
                    <Input name="publish_date" value={formData.publish_date} onChange={handleChange} placeholder="e.g. October 12, 2026" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <select name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full items-center justify-between rounded-md border border-ui-border-base px-3 py-2 text-sm bg-ui-bg-field text-ui-fg-base">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Description (Summary)</Label>
                  <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Brief summary introducing the article..." rows={3} />
                </div>

                <div className="grid gap-2">
                  <Label>Content (HTML/Tiptap format)</Label>
                  <Textarea name="content" value={formData.content} onChange={handleChange} placeholder="<p>Article body content with HTML styling...</p>" rows={12} className="font-mono text-xs" />
                </div>
                
                <div className="grid gap-2">
                  <Label>Images (JSON Array format)</Label>
                  <Textarea name="images" value={formData.images} onChange={handleChange} placeholder='[ "https://example.com/editorial-banner.jpg" ]' rows={3} className="font-mono text-xs" />
                  <Text className="text-ui-fg-subtle text-xs">Enter a valid JSON array of image strings.</Text>
                </div>
                
              </div>
            </FocusModal.Body>
          </FocusModal.Content>
        </FocusModal>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Handle</Table.HeaderCell>
            <Table.HeaderCell>Author</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row><Table.Cell colSpan={5} className="text-center py-4">Loading...</Table.Cell></Table.Row>
          ) : blogs.length === 0 ? (
            <Table.Row><Table.Cell colSpan={5} className="text-center text-ui-fg-subtle py-8">No blogs found. Create one to get started.</Table.Cell></Table.Row>
          ) : (
            blogs.map(b => (
              <Table.Row key={b.id}>
                <Table.Cell className="font-medium">
                  {b.title}
                </Table.Cell>
                <Table.Cell className="text-ui-fg-subtle">{b.handle}</Table.Cell>
                <Table.Cell>{b.author || "-"}</Table.Cell>
                <Table.Cell>
                  <span className={`px-2 py-1 rounded-md text-xs ${b.status === 'published' ? 'bg-ui-bg-success text-ui-fg-success' : 'bg-ui-bg-base text-ui-fg-subtle border border-ui-border-base'}`}>
                    {b.status}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="transparent" size="small" onClick={() => handleEdit(b)}>
                       Edit
                    </Button>
                    <Button variant="transparent" size="small" className="text-ui-fg-error" onClick={() => handleDelete(b.id)}>
                       Delete
                    </Button>
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
  label: "Blogs",
  icon: DocumentText,
})

export default BlogsAdminPage
