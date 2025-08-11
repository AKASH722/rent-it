"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus, Calendar, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { updateProduct } from "../actions/create-product"
import { uploadImageAction } from "../actions/upload-image"

export default function EditProductModal({ isOpen, onClose, product, categories, customerGroups = [] }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        units: 1,
        basePricePerHour: "",
        basePricePerDay: "",
        basePricePerWeek: "",
        LateFeePerHour: "",
        image: null,
        imagePath: "",
        categoryId: ""
    })
    const [pricingTypes, setPricingTypes] = useState({
        hour: false,
        day: false,
        week: false
    })
    const [attributes, setAttributes] = useState([{ key: "", value: "" }])
    const [priceList, setPriceList] = useState({
        id: null,
        name: "",
        startDate: "",
        endDate: "",
        multiplier: "",
        customerGroups: []
    })
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPriceList, setShowPriceList] = useState(false)
    const [dateErrors, setDateErrors] = useState({})
    const [hasExistingPriceList, setHasExistingPriceList] = useState(false)

    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayString = () => {
        return new Date().toISOString().split('T')[0]
    }

    // Helper function to format date for input (ensures local timezone)
    const formatDateForInput = (date) => {
        if (!date) return ""
        const d = new Date(date)
        if (isNaN(d.getTime())) return ""

        // Use local timezone to avoid timezone shift issues
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    // Helper function to validate date ranges
    const validateDateRange = (startDate, endDate) => {
        const errors = {}
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time for accurate comparison

        if (startDate) {
            const start = new Date(startDate)
            start.setHours(0, 0, 0, 0)

            // For existing price lists, don't validate past dates if they're already active
            if (!hasExistingPriceList && start < today) {
                errors.startDate = "Start date cannot be in the past"
            }
        }

        if (startDate && endDate) {
            const start = new Date(startDate)
            const end = new Date(endDate)

            // Check if dates are valid
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                errors.dateFormat = "Invalid date format"
            } else {
                start.setHours(0, 0, 0, 0)
                end.setHours(0, 0, 0, 0)

                // Check if end date is before start date
                if (end < start) {
                    errors.endDate = "End date cannot be before start date"
                }

                // Check for minimum duration (at least 1 day)
                if (end.getTime() === start.getTime()) {
                    errors.duration = "Price list must be active for at least 1 day"
                }

                // Optional: Check for maximum duration (e.g., 2 years)
                const maxDuration = 2 * 365 * 24 * 60 * 60 * 1000 // 2 years in milliseconds
                if (end.getTime() - start.getTime() > maxDuration) {
                    errors.duration = "Price list duration cannot exceed 2 years"
                }
            }
        }

        return errors
    }

    useEffect(() => {
        if (product && isOpen) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                units: product.units || product.quantity || 1,
                basePricePerHour: product.basePricePerHour || "",
                basePricePerDay: product.basePricePerDay || "",
                basePricePerWeek: product.basePricePerWeek || "",
                LateFeePerHour: product.LateFeePerHour || "",
                image: null,
                imagePath: product.imagePath || product.imageUrl || "",
                categoryId: product.categoryId || ""
            })

            setPricingTypes({
                hour: Boolean(product.basePricePerHour),
                day: Boolean(product.basePricePerDay),
                week: Boolean(product.basePricePerWeek)
            })

            // Set attributes or default empty attribute
            setAttributes(
                product.ProductAttribute && product.ProductAttribute.length > 0
                    ? product.ProductAttribute
                    : [{ key: "", value: "" }]
            )

            // Set image preview if exists
            if (product.imagePath || product.imageUrl) {
                setImagePreview(product.imagePath || product.imageUrl)
            }

            // Handle existing price list
            if (product.PriceList && product.PriceList.length > 0) {
                const existingPriceList = product.PriceList[0] // Assuming one active price list
                setHasExistingPriceList(true)
                setShowPriceList(true)
                setPriceList({
                    id: existingPriceList.id,
                    name: existingPriceList.name || "",
                    startDate: formatDateForInput(existingPriceList.startDate),
                    endDate: formatDateForInput(existingPriceList.endDate),
                    multiplier: existingPriceList.multiplier?.toString() || "",
                    customerGroups: existingPriceList.PriceListCustomerGroup?.map(pg => pg.customerGroupId) || []
                })
            } else {
                setHasExistingPriceList(false)
                setPriceList({
                    id: null,
                    name: "",
                    startDate: "",
                    endDate: "",
                    multiplier: "",
                    customerGroups: []
                })
            }

            // Clear any previous errors
            setDateErrors({})
        }
    }, [product, isOpen])

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

    // Enhanced PriceList functions with date validation
    const updatePriceList = (field, value) => {
        setPriceList(prev => {
            const updated = { ...prev, [field]: value }

            // Validate dates when either start or end date changes
            if (field === 'startDate' || field === 'endDate') {
                const errors = validateDateRange(
                    field === 'startDate' ? value : prev.startDate,
                    field === 'endDate' ? value : prev.endDate
                )
                setDateErrors(errors)
            }

            return updated
        })
    }

    const updatePriceListCustomerGroups = (customerGroupId, checked) => {
        setPriceList(prev => ({
            ...prev,
            customerGroups: checked
                ? [...prev.customerGroups, customerGroupId]
                : prev.customerGroups.filter(id => id !== customerGroupId)
        }))
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
            imagePath: "",
            categoryId: ""
        })
        setPricingTypes({
            hour: false,
            day: false,
            week: false
        })
        setAttributes([{ key: "", value: "" }])
        setPriceList({
            id: null,
            name: "",
            startDate: "",
            endDate: "",
            multiplier: "",
            customerGroups: []
        })
        setImagePreview(null)
        setIsSubmitting(false)
        setShowPriceList(false)
        setDateErrors({})
        setHasExistingPriceList(false)
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
            // Validate price list dates if provided
            if (showPriceList && (priceList.name || priceList.startDate || priceList.endDate || priceList.multiplier)) {
                const errors = validateDateRange(priceList.startDate, priceList.endDate)
                if (Object.keys(errors).length > 0) {
                    setDateErrors(errors)
                    setIsSubmitting(false)
                    toast.error("Please fix the date errors before submitting")
                    return
                }

                // Ensure all required price list fields are provided
                if (!priceList.name || !priceList.startDate || !priceList.endDate || !priceList.multiplier) {
                    toast.error("Please fill in all price list fields or remove the price list")
                    setIsSubmitting(false)
                    return
                }
            }

            // Upload image if a new one was provided
            let imageUrl = null
            if (formData.image) {
                imageUrl = await uploadImage(formData.image)
            }

            // Prepare updates object for updateProduct
            const updates = {
                name: formData.name,
                description: formData.description,
                units: parseInt(formData.units),
                LateFeePerHour: parseFloat(formData.LateFeePerHour),
                categoryId: formData.categoryId || null
            }

            // Add pricing data based on selected types
            if (pricingTypes.hour && formData.basePricePerHour) {
                updates.basePricePerHour = parseFloat(formData.basePricePerHour)
            } else {
                updates.basePricePerHour = null
            }

            if (pricingTypes.day && formData.basePricePerDay) {
                updates.basePricePerDay = parseFloat(formData.basePricePerDay)
            } else {
                updates.basePricePerDay = null
            }

            if (pricingTypes.week && formData.basePricePerWeek) {
                updates.basePricePerWeek = parseFloat(formData.basePricePerWeek)
            } else {
                updates.basePricePerWeek = null
            }

            // Handle image update
            if (imageUrl) {
                updates.imageUrl = imageUrl
            } else if (formData.imagePath) {
                // Keep existing image path if no new image was uploaded
                updates.imageUrl = formData.imagePath
            }

            // Handle attributes
            const validAttributes = attributes.filter(attr => attr.key && attr.value)
            updates.attributes = validAttributes

            // Handle price list with proper date handling
            if (showPriceList && priceList.name && priceList.startDate && priceList.endDate && priceList.multiplier) {
                // Create dates with proper timezone handling
                const startDate = new Date(priceList.startDate + 'T00:00:00.000Z')
                const endDate = new Date(priceList.endDate + 'T23:59:59.999Z')

                updates.priceList = {
                    id: priceList.id, // Include ID for updates
                    name: priceList.name,
                    startDate: startDate,
                    endDate: endDate,
                    multiplier: parseFloat(priceList.multiplier),
                    customerGroups: priceList.customerGroups
                }
            } else if (!showPriceList && hasExistingPriceList) {
                // If price list was removed, mark for deletion
                updates.priceList = null
            }

            console.log('Updating product with data:', { productId: product.id, updates })

            // Call the updateProduct method
            const result = await updateProduct(product.id, updates)

            console.log('Product updated successfully:', result)

            resetForm()
            onClose()
            toast.success('Product updated successfully!')
            window.location.reload()

        } catch (error) {
            console.error('Failed to update product:', error)
            toast.error('Failed to update product: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const isPricingSelected = pricingTypes.hour || pricingTypes.day || pricingTypes.week
    const hasDateErrors = Object.keys(dateErrors).length > 0

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Product Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Product Name *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter product name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-units">Units/Quantity *</Label>
                            <Input
                                id="edit-units"
                                type="number"
                                min="1"
                                value={formData.units}
                                onChange={(e) => handleInputChange("units", parseInt(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter product description"
                            rows={3}
                        />
                    </div>

                    {/* Category Selection */}
                    {categories && categories.length > 0 && (
                        <div className="space-y-2">
                            <Label htmlFor="edit-categoryId">Category</Label>
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
                    )}

                    {/* Late Fee */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-LateFeePerHour">Late Fee Per Hour *</Label>
                        <Input
                            id="edit-LateFeePerHour"
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
                                    id="edit-hourly"
                                    checked={pricingTypes.hour}
                                    onCheckedChange={(checked) => handlePricingTypeChange("hour", checked)}
                                />
                                <Label htmlFor="edit-hourly" className="flex-1">Hourly Rate</Label>
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
                                    id="edit-daily"
                                    checked={pricingTypes.day}
                                    onCheckedChange={(checked) => handlePricingTypeChange("day", checked)}
                                />
                                <Label htmlFor="edit-daily" className="flex-1">Daily Rate</Label>
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
                                    id="edit-weekly"
                                    checked={pricingTypes.week}
                                    onCheckedChange={(checked) => handlePricingTypeChange("week", checked)}
                                />
                                <Label htmlFor="edit-weekly" className="flex-1">Weekly Rate</Label>
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

                    {/* Dynamic Price List with Enhanced Date Validation */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Dynamic Price List {hasExistingPriceList && <span className="text-sm text-blue-600">(Currently Active)</span>}</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPriceList(!showPriceList)}
                                className="flex items-center gap-1"
                            >
                                <Calendar className="w-4 h-4" />
                                {showPriceList ? 'Hide' : hasExistingPriceList ? 'Edit' : 'Add'} Price List
                            </Button>
                        </div>

                        {showPriceList && (
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                    {hasExistingPriceList
                                        ? "Edit the existing price list or remove it entirely by hiding this section."
                                        : "Price list allows you to set different pricing during a specific date range using a multiplier. For example: 1.2 = 20% increase, 0.8 = 20% discount."
                                    }
                                </div>

                                {/* Date Error Display */}
                                {hasDateErrors && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <div className="flex items-center gap-2 text-red-800">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span className="font-medium">Date Validation Errors:</span>
                                        </div>
                                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                                            {Object.entries(dateErrors).map(([key, error]) => (
                                                <li key={key}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <Card className="p-4">
                                    <CardHeader className="p-0 pb-3">
                                        <CardTitle className="text-lg">
                                            {hasExistingPriceList ? 'Edit Price List Configuration' : 'Price List Configuration'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Price List Name</Label>
                                                <Input
                                                    placeholder="e.g., Summer Sale, Holiday Pricing"
                                                    value={priceList.name}
                                                    onChange={(e) => updatePriceList("name", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Multiplier</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="1.0 (no change)"
                                                    value={priceList.multiplier}
                                                    onChange={(e) => updatePriceList("multiplier", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Start Date</Label>
                                                <Input
                                                    type="date"
                                                    min={hasExistingPriceList ? undefined : getTodayString()}
                                                    value={priceList.startDate}
                                                    onChange={(e) => updatePriceList("startDate", e.target.value)}
                                                    className={dateErrors.startDate ? "border-red-500" : ""}
                                                />
                                                {dateErrors.startDate && (
                                                    <p className="text-sm text-red-500">{dateErrors.startDate}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>End Date</Label>
                                                <Input
                                                    type="date"
                                                    min={priceList.startDate || getTodayString()}
                                                    value={priceList.endDate}
                                                    onChange={(e) => updatePriceList("endDate", e.target.value)}
                                                    className={dateErrors.endDate ? "border-red-500" : ""}
                                                />
                                                {dateErrors.endDate && (
                                                    <p className="text-sm text-red-500">{dateErrors.endDate}</p>
                                                )}
                                            </div>
                                        </div>

                                        {customerGroups && customerGroups.length > 0 && (
                                            <div className="space-y-2">
                                                <Label>Customer Groups (Optional)</Label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    {customerGroups.map((group) => (
                                                        <div key={group.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`edit-priceList-group-${group.id}`}
                                                                checked={priceList.customerGroups.includes(group.id)}
                                                                onCheckedChange={(checked) =>
                                                                    updatePriceListCustomerGroups(group.id, checked)
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor={`edit-priceList-group-${group.id}`}
                                                                className="text-sm"
                                                            >
                                                                {group.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-image">Product Image</Label>
                        <Input
                            id="edit-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <div className="text-sm text-muted-foreground mb-2">
                                    {formData.image ? "New image:" : "Current image:"}
                                </div>
                                <img
                                    src={imagePreview}
                                    alt="Product preview"
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
                            disabled={isSubmitting || !isPricingSelected || hasDateErrors}
                        >
                            {isSubmitting ? "Updating..." : "Update Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}