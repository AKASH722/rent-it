"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"
import { createProduct } from "../actions/create-product"
import { uploadImageAction } from "../actions/upload-image";
import { toast } from "sonner"


export default function CreateProductModal({ isOpen, onClose, categories }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        units: 1,
        basePricePerHour: "",
        basePricePerDay: "",
        basePricePerWeek: "",
        LateFeePerHour: "",
        image: null,
        categoryId: ""
    })
    const [pricingTypes, setPricingTypes] = useState({
        hour: false,
        day: false,
        week: false
    })
    const [attributes, setAttributes] = useState([{ key: "", value: "" }])
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePricingTypeChange = (type, checked) => {
        setPricingTypes(prev => ({
            ...prev,
            [type]: checked
        }))

        // Clear the price if unchecked
        if (!checked) {
            const priceField = `basePricePer${type.charAt(0).toUpperCase() + type.slice(1)}`
            handleInputChange(priceField, "")
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({ ...prev, image: file }))

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    const addAttribute = () => {
        setAttributes([...attributes, { key: "", value: "" }])
    }

    const removeAttribute = (index) => {
        setAttributes(attributes.filter((_, i) => i !== index))
    }

    const updateAttribute = (index, field, value) => {
        const updated = attributes.map((attr, i) =>
            i === index ? { ...attr, [field]: value } : attr
        )
        setAttributes(updated)
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            units: 1,
            basePricePerHour: "",
            basePricePerDay: "",
            basePricePerWeek: "",
            LateFeePerHour: "",
            image: null,
            categoryId: ""
        })
        setPricingTypes({
            hour: false,
            day: false,
            week: false
        })
        setAttributes([{ key: "", value: "" }])
        setImagePreview(null)
        setIsSubmitting(false)
    }

    const uploadImage = async (imageFile) => {
        if (!imageFile) return null;

        const formData = new FormData();
        formData.append("image", imageFile);

        const imageUrl = await uploadImageAction(formData);
        return imageUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Upload image if provided
            let imageUrl = null
            if (formData.image) {
                imageUrl = await uploadImage(formData.image)
            }

            // Prepare data for createProduct
            const productData = {
                name: formData.name,
                description: formData.description,
                units: parseInt(formData.units),
                LateFeePerHour: parseFloat(formData.LateFeePerHour),
                imageUrl,
                categoryId: formData.categoryId || null
            }

            // Add pricing data based on selected types
            if (pricingTypes.hour && formData.basePricePerHour) {
                productData.basePricePerHour = parseFloat(formData.basePricePerHour)
            }
            if (pricingTypes.day && formData.basePricePerDay) {
                productData.basePricePerDay = parseFloat(formData.basePricePerDay)
            }
            if (pricingTypes.week && formData.basePricePerWeek) {
                productData.basePricePerWeek = parseFloat(formData.basePricePerWeek)
            }

            // Call your createProduct method
            const result = await createProduct(productData)

            console.log('Product created successfully:', result)

            // Handle attributes separately if needed (you may need another API call)
            const validAttributes = attributes.filter(attr => attr.key && attr.value)
            if (validAttributes.length > 0) {
                console.log('Product attributes to save:', validAttributes)
          
            }
      
           resetForm()
            onClose()
         
            toast('Product created successfully!')
            window.location.reload() 

        } catch (error) {
            console.error('Failed to create product:', error)
            toast('Failed to create product: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const isPricingSelected = pricingTypes.hour || pricingTypes.day || pricingTypes.week

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Product Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter product name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="units">Units/Quantity *</Label>
                            <Input
                                id="units"
                                type="number"
                                min="1"
                                value={formData.units}
                                onChange={(e) => handleInputChange("units", parseInt(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter product description"
                            rows={3}
                        />
                    </div>

                    
                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(value) => handleInputChange("categoryId", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    {/* Late Fee */}
                    <div className="space-y-2">
                        <Label htmlFor="LateFeePerHour">Late Fee Per Hour *</Label>
                        <Input
                            id="LateFeePerHour"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.LateFeePerHour}
                            onChange={(e) => handleInputChange("LateFeePerHour", e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    {/* Pricing Options */}
                    <div className="space-y-4">
                        <Label>Pricing Options *</Label>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="hourly"
                                    checked={pricingTypes.hour}
                                    onCheckedChange={(checked) => handlePricingTypeChange("hour", checked)}
                                />
                                <Label htmlFor="hourly" className="flex-1">Hourly Rate</Label>
                                {pricingTypes.hour && (
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.basePricePerHour}
                                        onChange={(e) => handleInputChange("basePricePerHour", e.target.value)}
                                        placeholder="0.00"
                                        className="w-32"
                                        required
                                    />
                                )}
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="daily"
                                    checked={pricingTypes.day}
                                    onCheckedChange={(checked) => handlePricingTypeChange("day", checked)}
                                />
                                <Label htmlFor="daily" className="flex-1">Daily Rate</Label>
                                {pricingTypes.day && (
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.basePricePerDay}
                                        onChange={(e) => handleInputChange("basePricePerDay", e.target.value)}
                                        placeholder="0.00"
                                        className="w-32"
                                        required
                                    />
                                )}
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="weekly"
                                    checked={pricingTypes.week}
                                    onCheckedChange={(checked) => handlePricingTypeChange("week", checked)}
                                />
                                <Label htmlFor="weekly" className="flex-1">Weekly Rate</Label>
                                {pricingTypes.week && (
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.basePricePerWeek}
                                        onChange={(e) => handleInputChange("basePricePerWeek", e.target.value)}
                                        placeholder="0.00"
                                        className="w-32"
                                        required
                                    />
                                )}
                            </div>
                        </div>
                        {!isPricingSelected && (
                            <p className="text-sm text-red-500">Please select at least one pricing option</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="image">Product Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-md border"
                                />
                            </div>
                        )}
                    </div>

                    {/* Product Attributes */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Product Attributes</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addAttribute}
                                className="flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add Attribute
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {attributes.map((attr, index) => (
                                <Card key={index} className="p-3">
                                    <CardContent className="p-0">
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                placeholder="Attribute key (e.g., Brand, Color)"
                                                value={attr.key}
                                                onChange={(e) => updateAttribute(index, "key", e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="Attribute value (e.g., Canon, Black)"
                                                value={attr.value}
                                                onChange={(e) => updateAttribute(index, "value", e.target.value)}
                                                className="flex-1"
                                            />
                                            {attributes.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeAttribute(index)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isPricingSelected}
                        >
                            {isSubmitting ? "Creating..." : "Create Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}