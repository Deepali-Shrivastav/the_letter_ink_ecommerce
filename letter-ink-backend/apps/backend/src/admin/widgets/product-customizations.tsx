import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Input, Badge, Table } from "@medusajs/ui"
import { useState, useEffect } from "react"

const ProductCustomizationsWidget = ({ data }: any) => {
  const product = data
  const [options, setOptions] = useState<any[]>([])
  const [combinations, setCombinations] = useState<any[]>([])
  const [newOptionTitle, setNewOptionTitle] = useState("")
  const [newValueTitles, setNewValueTitles] = useState<Record<string, string>>({})

  // Combination form state
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({})
  const [priceAdjustment, setPriceAdjustment] = useState<string>("0")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchCustomizations = async () => {
    if (!product?.id) return;
    try {
      const [optRes, combRes] = await Promise.all([
        fetch(`/admin/customizations/options?product_id=${product.id}`).then(r => r.json()),
        fetch(`/admin/customizations/combinations?product_id=${product.id}`).then(r => r.json())
      ])
      setOptions(optRes.options || [])
      setCombinations(combRes.combinations || [])
    } catch (e) {
      console.error("Failed to fetch customizations", e)
    }
  }

  useEffect(() => {
    fetchCustomizations()
  }, [product?.id])

  const handleAddOption = async () => {
    if (!newOptionTitle.trim()) return
    await fetch("/admin/customizations/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id, title: newOptionTitle.trim() })
    })
    setNewOptionTitle("")
    fetchCustomizations()
  }

  const handleAddValue = async (optionId: string) => {
    const value = newValueTitles[optionId]?.trim()
    if (!value) return
    await fetch("/admin/customizations/values", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option_id: optionId, value })
    })
    setNewValueTitles({ ...newValueTitles, [optionId]: "" })
    fetchCustomizations()
  }

  const handleCreateCombination = async () => {
    const valueIds = Object.values(selectedValues).filter(Boolean)
    if (valueIds.length === 0) {
      alert("Please select at least one option value for the combination.")
      return
    }

    setIsSubmitting(true)
    try {
      await fetch("/admin/customizations/combinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          price_adjustment: Number(priceAdjustment) || 0,
          preview_image_url: imageUrl.trim() || null,
          values: valueIds,
          status: "active"
        })
      })
      // Reset form
      setSelectedValues({})
      setPriceAdjustment("0")
      setImageUrl("")
      fetchCustomizations()
    } catch (err) {
      console.error("Failed to create combination", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteOption = async (id: string) => {
    if (!confirm("Are you sure you want to delete this option, its values, and affected combinations?")) return
    try {
      const res = await fetch(`/admin/customizations/options?id=${id}`, {
        method: "DELETE"
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(`Failed to delete option: ${err.error || res.statusText}`)
      }
    } catch (e: any) {
      alert(`Error deleting option: ${e.message}`)
    }
    fetchCustomizations()
  }

  const handleDeleteValue = async (id: string) => {
    if (!confirm("Are you sure you want to delete this value?")) return
    try {
      const res = await fetch(`/admin/customizations/values?id=${id}`, {
        method: "DELETE"
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(`Failed to delete value: ${err.error || res.statusText}`)
      }
    } catch (e: any) {
      alert(`Error deleting value: ${e.message}`)
    }
    fetchCustomizations()
  }

  const handleDeleteCombination = async (id: string) => {
    if (!confirm("Are you sure you want to delete this combination?")) return
    try {
      const res = await fetch(`/admin/customizations/combinations?id=${id}`, {
        method: "DELETE"
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(`Failed to delete combination: ${err.error || res.statusText}`)
      }
    } catch (e: any) {
      alert(`Error deleting combination: ${e.message}`)
    }
    fetchCustomizations()
  }

  return (
    <Container className="p-6 mt-4 gap-6 flex flex-col">
      <div>
        <Heading level="h2">Dynamic Customizations</Heading>
        <Text className="text-ui-fg-subtle text-sm mt-1">
          Manage product options, values, and combinations with independent pricing and preview images.
        </Text>
      </div>
      
      {/* Options Section */}
      <div className="flex flex-col gap-4">
        <Heading level="h3">1. Customization Options & Values</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map(opt => (
            <div key={opt.id} className="p-4 border border-ui-border-base rounded-lg bg-ui-bg-subtle flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Text className="font-semibold text-ui-fg-base">{opt.title}</Text>
                  <Text className="text-xs text-ui-fg-muted">({opt.values?.length || 0} values)</Text>
                </div>
                <Button 
                  size="small" 
                  variant="transparent" 
                  className="text-rose-500 hover:text-rose-600 text-xs p-1 h-auto cursor-pointer" 
                  onClick={() => handleDeleteOption(opt.id)}
                >
                  Delete Option
                </Button>
              </div>

              {/* Value Badges */}
              <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
                {opt.values?.length > 0 ? (
                  opt.values.map((v: any) => (
                    <Badge key={v.id} color="grey" size="base" className="px-2.5 py-1 flex items-center gap-1.5">
                      <span>{v.value}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteValue(v.id)}
                        className="text-ui-fg-muted hover:text-rose-600 font-bold ml-1 cursor-pointer leading-none text-xs"
                        title="Delete value"
                      >
                        ✕
                      </button>
                    </Badge>
                  ))
                ) : (
                  <Text className="text-xs text-ui-fg-muted italic">No values added yet</Text>
                )}
              </div>

              {/* Add Value Input */}
              <div className="flex gap-2 mt-1">
                <Input 
                  size="small"
                  placeholder={`Add value to ${opt.title}...`} 
                  value={newValueTitles[opt.id] || ""} 
                  onChange={(e) => setNewValueTitles({...newValueTitles, [opt.id]: e.target.value})} 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddValue(opt.id)
                    }
                  }}
                />
                <Button size="small" variant="secondary" onClick={() => handleAddValue(opt.id)}>
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add New Option */}
        <div className="flex gap-2 max-w-md mt-2">
          <Input 
            placeholder="New Option Name (e.g. Frame Size, Paper Weight)" 
            value={newOptionTitle} 
            onChange={(e) => setNewOptionTitle(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddOption()
              }
            }}
          />
          <Button variant="secondary" onClick={handleAddOption}>Add Option</Button>
        </div>
      </div>

      {/* Combinations Section */}
      <div className="flex flex-col gap-4 pt-4 border-t border-ui-border-base">
        <Heading level="h3">2. Create Combination</Heading>
        <Text className="text-ui-fg-subtle text-sm">
          Select one value from each option to link a custom price and preview image for that combination.
        </Text>

        {options.length === 0 ? (
          <Text className="text-ui-fg-muted italic">Create options and values above first.</Text>
        ) : (
          <div className="p-4 border border-ui-border-base rounded-lg bg-ui-bg-subtle flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {options.map(opt => (
                <div key={opt.id} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ui-fg-subtle">{opt.title}</label>
                  <select 
                    className="h-8 w-full bg-ui-bg-field text-ui-fg-base border border-ui-border-base rounded-md px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ui-border-interactive"
                    value={selectedValues[opt.id] || ""}
                    onChange={(e) => setSelectedValues({ ...selectedValues, [opt.id]: e.target.value })}
                  >
                    <option value="">-- Choose {opt.title} --</option>
                    {opt.values?.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {v.value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ui-fg-subtle">Price Adjustment (+/- in cents or currency units)</label>
                <Input 
                  type="number"
                  placeholder="0 (e.g. 500 for +$5.00)"
                  value={priceAdjustment}
                  onChange={(e) => setPriceAdjustment(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ui-fg-subtle">Preview Image URL (optional)</label>
                <Input 
                  placeholder="https://... or image link"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button 
                variant="primary" 
                onClick={handleCreateCombination}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Save Combination"}
              </Button>
            </div>
          </div>
        )}

        <Heading level="h3" className="mt-2">Existing Combinations</Heading>
        {combinations.length === 0 ? (
          <Text className="text-ui-fg-muted italic">No combinations created yet.</Text>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Selected Values</Table.HeaderCell>
                <Table.HeaderCell>Price Adjustment</Table.HeaderCell>
                <Table.HeaderCell>Preview Image</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {combinations.map(comb => (
                <Table.Row key={comb.id}>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1">
                      {comb.values?.map((v: any) => (
                        <Badge key={v.id} color="blue" size="small">
                          {v.value}
                        </Badge>
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {comb.price_adjustment > 0 ? `+${comb.price_adjustment}` : comb.price_adjustment}
                  </Table.Cell>
                  <Table.Cell>
                    {comb.preview_image_url ? (
                      <a href={comb.preview_image_url} target="_blank" rel="noreferrer" className="text-blue-500 underline text-xs">
                        View Image
                      </a>
                    ) : (
                      <span className="text-xs text-ui-fg-muted">None</span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Button 
                      variant="danger" 
                      size="small" 
                      onClick={() => handleDeleteCombination(comb.id)}
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
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductCustomizationsWidget
