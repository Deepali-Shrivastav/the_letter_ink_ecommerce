import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Table, Input, Textarea, Label, FocusModal } from "@medusajs/ui"
import { DocumentText, Plus, PencilSquare, Trash, ArrowUpTray, PlaySolid, Photo } from "@medusajs/icons"
import { useState, useEffect, useRef } from "react"

const BlogsAdminPage = () => {
  const [activeTab, setActiveTab] = useState<"articles" | "videos">("articles")
  
  // Articles state
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

  // Studio Videos state
  const [videos, setVideos] = useState<any[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [videoSubmitting, setVideoSubmitting] = useState(false)
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [isUploadingThumb, setIsUploadingThumb] = useState(false)
  const videoFileRef = useRef<HTMLInputElement>(null)
  const thumbFileRef = useRef<HTMLInputElement>(null)

  const [videoFormData, setVideoFormData] = useState({
    title: "",
    format: "portrait", // portrait | landscape | still
    video_url: "",
    thumbnail_url: "",
    category: "reels", // reels | shorts | stills
    badge: "Instagram Reel",
    duration: "0:30",
    views: "10k Views",
    caption: "",
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

  const fetchVideos = async () => {
    try {
      setVideosLoading(true)
      const res = await fetch(`/admin/blog-videos`)
      if (res.ok) {
        const data = await res.json()
        setVideos(data.videos || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setVideosLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
    fetchVideos()
  }, [])

  // Article handlers
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
         // handle invalid JSON gracefully
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

  // Video handlers
  const handleVideoChange = (e: any) => {
    const { name, value } = e.target
    setVideoFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === "format") {
        if (value === "landscape" && prev.badge === "Instagram Reel") {
          updated.badge = "Studio Cinema"
          updated.category = "shorts"
        } else if (value === "portrait" && prev.badge === "Studio Cinema") {
          updated.badge = "Process Reel"
          updated.category = "reels"
        } else if (value === "still") {
          updated.badge = "Macro Study"
          updated.category = "stills"
        }
      }
      return updated
    })
  }

  const handleEditVideo = (v: any) => {
    setEditingVideoId(v.id)
    setVideoFormData({
      title: v.title || "",
      format: v.format || "portrait",
      video_url: v.video_url || "",
      thumbnail_url: v.thumbnail_url || "",
      category: v.category || "reels",
      badge: v.badge || "Instagram Reel",
      duration: v.duration || "",
      views: v.views || "",
      caption: v.caption || "",
      status: v.status || "published",
    })
    setIsVideoModalOpen(true)
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this studio video?")) return
    try {
      const res = await fetch(`/admin/blog-videos/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchVideos()
      } else {
        alert("Failed to delete studio video.")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleFileUpload = async (file: File, type: "video" | "image") => {
    const isVideo = type === "video"
    if (isVideo) setIsUploadingVideo(true)
    else setIsUploadingThumb(true)

    try {
      const formData = new FormData()
      formData.append("files", file)

      const res = await fetch("/admin/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Upload failed")
      }

      const result = await res.json()
      const url = result.files?.[0]?.url
      if (!url) throw new Error("No URL returned from upload")

      if (isVideo) {
        setVideoFormData(prev => ({ ...prev, video_url: url }))
      } else {
        setVideoFormData(prev => ({ ...prev, thumbnail_url: url }))
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`)
    } finally {
      if (isVideo) setIsUploadingVideo(false)
      else setIsUploadingThumb(false)
    }
  }

  const handleSubmitVideo = async (e: any) => {
    e.preventDefault()
    if (!videoFormData.title) return alert("Title is required.")

    setVideoSubmitting(true)
    try {
      let res;
      if (editingVideoId) {
        res = await fetch(`/admin/blog-videos/${editingVideoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(videoFormData)
        })
      } else {
        res = await fetch("/admin/blog-videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(videoFormData)
        })
      }

      if (res.ok) {
        setIsVideoModalOpen(false)
        setEditingVideoId(null)
        setVideoFormData({
          title: "",
          format: "portrait",
          video_url: "",
          thumbnail_url: "",
          category: "reels",
          badge: "Instagram Reel",
          duration: "0:30",
          views: "10k Views",
          caption: "",
          status: "published",
        })
        fetchVideos()
      } else {
        const err = await res.json()
        alert(`Error: ${err.message || JSON.stringify(err)}`)
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setVideoSubmitting(false)
    }
  }

  return (
    <Container className="p-8">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Heading level="h1" className="mb-1 flex items-center gap-2">
            <DocumentText /> Blog & Visual Repositories
          </Heading>
          <Text className="text-ui-fg-subtle">
            Manage written editorial essays and dynamic studio motion videos/reels.
          </Text>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-ui-bg-subtle p-1 rounded-lg border border-ui-border-base gap-1">
          <Button
            size="small"
            variant={activeTab === "articles" ? "primary" : "transparent"}
            onClick={() => setActiveTab("articles")}
          >
            Written Chronicles ({blogs.length})
          </Button>
          <Button
            size="small"
            variant={activeTab === "videos" ? "primary" : "transparent"}
            onClick={() => setActiveTab("videos")}
          >
            Studio Motion & Videos ({videos.length})
          </Button>
        </div>
      </div>

      {/* TAB 1: WRITTEN CHRONICLES (BLOG POSTS) */}
      {activeTab === "articles" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <Heading level="h2">Articles & Essays</Heading>
              <Text className="text-ui-fg-muted text-xs">Long-form written journal entries displayed in Written Chronicles.</Text>
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
                        <Input name="author" value={formData.author} onChange={handleChange} placeholder="e.g. Master Scribe" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Archival Wisdom" />
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
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Author</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Row><Table.Cell colSpan={6} className="text-center py-4">Loading...</Table.Cell></Table.Row>
              ) : blogs.length === 0 ? (
                <Table.Row><Table.Cell colSpan={6} className="text-center text-ui-fg-subtle py-8">No articles found. Create one to get started.</Table.Cell></Table.Row>
              ) : (
                blogs.map(b => (
                  <Table.Row key={b.id}>
                    <Table.Cell className="font-medium">{b.title}</Table.Cell>
                    <Table.Cell className="text-ui-fg-subtle">{b.handle}</Table.Cell>
                    <Table.Cell>{b.category || "-"}</Table.Cell>
                    <Table.Cell>{b.author || "-"}</Table.Cell>
                    <Table.Cell>
                      <span className={`px-2 py-1 rounded-md text-xs ${b.status === 'published' ? 'bg-ui-bg-success text-ui-fg-success' : 'bg-ui-bg-base text-ui-fg-subtle border border-ui-border-base'}`}>
                        {b.status}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="transparent" size="small" onClick={() => handleEdit(b)}>Edit</Button>
                        <Button variant="transparent" size="small" className="text-ui-fg-error" onClick={() => handleDelete(b.id)}>Delete</Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* TAB 2: STUDIO MOTION & VIDEOS (VISUAL REPOSITORIES) */}
      {activeTab === "videos" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <Heading level="h2">Studio Motion & Visual Repositories</Heading>
              <Text className="text-ui-fg-muted text-xs">
                Upload and manage dynamic videos. Landscape videos automatically render in the wide cinema layout, and Portrait videos in the 9:16 vertical reel layout.
              </Text>
            </div>

            <FocusModal open={isVideoModalOpen} onOpenChange={(open) => {
              if (!open) {
                setEditingVideoId(null)
                setVideoFormData({
                  title: "",
                  format: "portrait",
                  video_url: "",
                  thumbnail_url: "",
                  category: "reels",
                  badge: "Instagram Reel",
                  duration: "0:30",
                  views: "10k Views",
                  caption: "",
                  status: "published",
                })
              }
              setIsVideoModalOpen(open)
            }}>
              <FocusModal.Trigger asChild>
                <Button variant="primary" onClick={() => setEditingVideoId(null)}>
                  <Plus /> Add Studio Video
                </Button>
              </FocusModal.Trigger>
              <FocusModal.Content>
                <FocusModal.Header>
                  <Button onClick={() => setIsVideoModalOpen(false)} variant="transparent">Cancel</Button>
                  <Button onClick={handleSubmitVideo} isLoading={videoSubmitting}>
                    {editingVideoId ? "Update Video" : "Publish Video"}
                  </Button>
                </FocusModal.Header>
                <FocusModal.Body className="flex justify-center py-8">
                  <div className="w-full max-w-3xl flex flex-col gap-y-6">
                    <Heading level="h2">{editingVideoId ? "Edit Studio Video" : "Add New Studio Video"}</Heading>

                    {/* Format Selection (Landscape vs Portrait vs Still) */}
                    <div className="p-4 bg-ui-bg-subtle border border-ui-border-base rounded-lg flex flex-col gap-2">
                      <Label className="font-semibold">Video Format / Aspect Ratio Layout *</Label>
                      <Text className="text-ui-fg-subtle text-xs mb-2">
                        Choose whether this video should render in the 16:9 Landscape Cinema card or 9:16 Portrait Reel card.
                      </Text>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${videoFormData.format === 'portrait' ? 'border-ui-border-interactive bg-ui-bg-base ring-1 ring-ui-border-interactive' : 'border-ui-border-base bg-ui-bg-field'}`}>
                          <input type="radio" name="format" value="portrait" checked={videoFormData.format === 'portrait'} onChange={handleVideoChange} className="accent-ui-fg-interactive" />
                          <div>
                            <span className="font-medium text-sm block">Portrait (9:16 Reel)</span>
                            <span className="text-xs text-ui-fg-muted">Vertical mobile reel card</span>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${videoFormData.format === 'landscape' ? 'border-ui-border-interactive bg-ui-bg-base ring-1 ring-ui-border-interactive' : 'border-ui-border-base bg-ui-bg-field'}`}>
                          <input type="radio" name="format" value="landscape" checked={videoFormData.format === 'landscape'} onChange={handleVideoChange} className="accent-ui-fg-interactive" />
                          <div>
                            <span className="font-medium text-sm block">Landscape (16:9 Cinema)</span>
                            <span className="text-xs text-ui-fg-muted">Wide studio cinema card</span>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${videoFormData.format === 'still' ? 'border-ui-border-interactive bg-ui-bg-base ring-1 ring-ui-border-interactive' : 'border-ui-border-base bg-ui-bg-field'}`}>
                          <input type="radio" name="format" value="still" checked={videoFormData.format === 'still'} onChange={handleVideoChange} className="accent-ui-fg-interactive" />
                          <div>
                            <span className="font-medium text-sm block">Macro Photo (Still)</span>
                            <span className="text-xs text-ui-fg-muted">Photography showcase</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="grid gap-2">
                      <Label>Title *</Label>
                      <Input name="title" value={videoFormData.title} onChange={handleVideoChange} placeholder="e.g. Dipping into 24k gold leaf gouache in slow motion" required />
                    </div>

                    {/* Video File Upload & URL */}
                    <div className="p-4 bg-ui-bg-base border border-ui-border-base rounded-md flex flex-col gap-3">
                      <Label className="flex items-center gap-2">
                        <PlaySolid className="w-4 h-4 text-ui-fg-interactive" /> Video File or Direct Stream URL
                      </Label>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          ref={videoFileRef}
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, "video")
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="small"
                          disabled={isUploadingVideo}
                          onClick={() => videoFileRef.current?.click()}
                          className="flex items-center gap-1.5"
                        >
                          <ArrowUpTray className="w-3.5 h-3.5" />
                          {isUploadingVideo ? "Uploading Video..." : "Upload Video File (MP4/WebM)"}
                        </Button>
                        <div className="flex-1 min-w-[240px]">
                          <Input
                            name="video_url"
                            placeholder="Or paste direct video URL (https://... or .mp4)"
                            value={videoFormData.video_url}
                            onChange={handleVideoChange}
                          />
                        </div>
                      </div>
                      {videoFormData.video_url && (
                        <Text className="text-xs text-ui-fg-success truncate">
                          Video source linked: {videoFormData.video_url}
                        </Text>
                      )}
                    </div>

                    {/* Thumbnail / Poster Image Upload & URL */}
                    <div className="p-4 bg-ui-bg-base border border-ui-border-base rounded-md flex flex-col gap-3">
                      <Label className="flex items-center gap-2">
                        <Photo className="w-4 h-4 text-ui-fg-interactive" /> Thumbnail / Poster Image
                      </Label>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          ref={thumbFileRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, "image")
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="small"
                          disabled={isUploadingThumb}
                          onClick={() => thumbFileRef.current?.click()}
                          className="flex items-center gap-1.5"
                        >
                          <ArrowUpTray className="w-3.5 h-3.5" />
                          {isUploadingThumb ? "Uploading Poster..." : "Upload Poster Image"}
                        </Button>
                        <div className="flex-1 min-w-[240px]">
                          <Input
                            name="thumbnail_url"
                            placeholder="Or paste image URL (https://...)"
                            value={videoFormData.thumbnail_url}
                            onChange={handleVideoChange}
                          />
                        </div>
                      </div>
                      {videoFormData.thumbnail_url && (
                        <div className="flex items-center gap-3 mt-1">
                          <img src={videoFormData.thumbnail_url} alt="Preview" className="w-16 h-16 object-cover rounded border border-ui-border-base" />
                          <Text className="text-xs text-ui-fg-subtle truncate flex-1">{videoFormData.thumbnail_url}</Text>
                        </div>
                      )}
                    </div>

                    {/* Category & Badge */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Category Filter Tab</Label>
                        <select name="category" value={videoFormData.category} onChange={handleVideoChange} className="flex h-10 w-full items-center justify-between rounded-md border border-ui-border-base px-3 py-2 text-sm bg-ui-bg-field text-ui-fg-base">
                          <option value="reels">Process Reels (9:16)</option>
                          <option value="shorts">Studio Shorts & Videos</option>
                          <option value="stills">Macro Photos</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Badge Label (Card Header)</Label>
                        <Input name="badge" value={videoFormData.badge} onChange={handleVideoChange} placeholder="e.g. Instagram Reel, Studio Cinema, Process Reel" />
                      </div>
                    </div>

                    {/* Duration, Views, Status */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label>Duration / Runtime</Label>
                        <Input name="duration" value={videoFormData.duration} onChange={handleVideoChange} placeholder="e.g. 0:34 or 2:15 Mastercut" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Views / Subtext</Label>
                        <Input name="views" value={videoFormData.views} onChange={handleVideoChange} placeholder="e.g. 48.2k Views" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <select name="status" value={videoFormData.status} onChange={handleVideoChange} className="flex h-10 w-full items-center justify-between rounded-md border border-ui-border-base px-3 py-2 text-sm bg-ui-bg-field text-ui-fg-base">
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    {/* Caption / Hashtags */}
                    <div className="grid gap-2">
                      <Label>Caption / Hashtags / Note</Label>
                      <Textarea name="caption" value={videoFormData.caption} onChange={handleVideoChange} placeholder="e.g. #calligraphymotion #gildedink #maharashtrastudio" rows={2} />
                    </div>

                  </div>
                </FocusModal.Body>
              </FocusModal.Content>
            </FocusModal>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Media Preview</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Format Layout</Table.HeaderCell>
                <Table.HeaderCell>Category / Badge</Table.HeaderCell>
                <Table.HeaderCell>Duration & Views</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {videosLoading ? (
                <Table.Row><Table.Cell colSpan={7} className="text-center py-4">Loading videos...</Table.Cell></Table.Row>
              ) : videos.length === 0 ? (
                <Table.Row><Table.Cell colSpan={7} className="text-center text-ui-fg-subtle py-8">No studio videos found. Click "Add Studio Video" to upload or create one.</Table.Cell></Table.Row>
              ) : (
                videos.map(v => (
                  <Table.Row key={v.id}>
                    <Table.Cell>
                      <div className="relative w-14 h-14 bg-ui-bg-subtle rounded overflow-hidden flex items-center justify-center border border-ui-border-base">
                        {v.thumbnail_url ? (
                          <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                        ) : (
                          <PlaySolid className="w-5 h-5 text-ui-fg-muted" />
                        )}
                        {v.video_url && (
                          <span className="absolute bottom-0.5 right-0.5 bg-ui-bg-base/80 p-0.5 rounded text-[10px]">▶</span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="font-medium max-w-[240px]">
                      <div className="truncate font-semibold">{v.title}</div>
                      {v.caption && <div className="text-xs text-ui-fg-muted truncate">{v.caption}</div>}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        v.format === 'landscape' ? 'bg-ui-bg-interactive text-ui-fg-interactive' :
                        v.format === 'portrait' ? 'bg-ui-bg-highlight text-ui-fg-interactive' :
                        'bg-ui-bg-base text-ui-fg-subtle border border-ui-border-base'
                      }`}>
                        {v.format === 'landscape' ? '16:9 Landscape' : v.format === 'portrait' ? '9:16 Portrait' : 'Photo Still'}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-xs font-semibold">{v.badge}</div>
                      <div className="text-xs text-ui-fg-muted uppercase">{v.category}</div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-xs">{v.duration || "-"}</div>
                      <div className="text-xs text-ui-fg-muted">{v.views || "-"}</div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`px-2 py-0.5 rounded text-xs ${v.status === 'published' ? 'bg-ui-bg-success text-ui-fg-success' : 'bg-ui-bg-base text-ui-fg-subtle border border-ui-border-base'}`}>
                        {v.status}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="transparent" size="small" onClick={() => handleEditVideo(v)}>Edit</Button>
                        <Button variant="transparent" size="small" className="text-ui-fg-error" onClick={() => handleDeleteVideo(v.id)}>Delete</Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blogs",
  icon: DocumentText,
})

export default BlogsAdminPage
