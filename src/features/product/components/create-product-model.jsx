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
import { X, Plus, Calendar, AlertTriangle, Trash2 } from "lucide-react"
import { createProduct, getCustomerGroups } from "../actions/create-product"
import { uploadImageAction } from "../actions/upload-image"
import { toast } from "sonner"

export default function CreateProductModal({ isOpen, onClose, categories }) {
    const [customerGroups, setCustomerGroups] = useState([])
    const [isLoadingCustomerGroups, setIsLoadingCustomerGroups] = useState(false)
    useEffect(() => {
        const fetchCustomerGroups = async () => {
            if (isOpen) {
                setIsLoadingCustomerGroups(true)
                try {
                    const groups = await getCustomerGroups()
                    console.log(groups)
                    setCustomerGroups(groups || [])
                } catch (error) {
                    console.error("Failed to fetch customer groups:", error)
                    toast.error("Failed to load customer groups")
                    setCustomerGroups([])
                } finally {
                    setIsLoadingCustomerGroups(false)
                }
            }
        }

        fetchCustomerGroups()
    }, [isOpen])
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

    // Changed from single priceList to array of priceLists
    const [priceLists, setPriceLists] = useState([])

    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPriceLists, setShowPriceLists] = useState(false)
    const [dateErrors, setDateErrors] = useState({})

    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayString = () => {
        return new Date().toISOString().split('T')[0]
    }

    // Helper function to validate date ranges for a specific price list
    const validatePriceListDateRange = (priceList, allPriceLists = [], currentIndex = -1) => {
        const errors = {}
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (priceList.startDate) {
            const start = new Date(priceList.startDate)
            start.setHours(0, 0, 0, 0)

            // Check if start date is in the past
            if (start < today) {
                errors.startDate = "Start date cannot be in the past"
            }
        }

        if (priceList.startDate && priceList.endDate) {
            const start = new Date(priceList.startDate)
            const end = new Date(priceList.endDate)

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                errors.dateFormat = "Invalid date format"
            } else {
                start.setHours(0, 0, 0, 0)
                end.setHours(0, 0, 0, 0)

                if (end < start) {
                    errors.endDate = "End date cannot be before start date"
                }

                if (end.getTime() === start.getTime()) {
                    errors.duration = "Price list must be active for at least 1 day"
                }

                const maxDuration = 2 * 365 * 24 * 60 * 60 * 1000
                if (end.getTime() - start.getTime() > maxDuration) {
                    errors.duration = "Price list duration cannot exceed 2 years"
                }

                // Check for date overlaps with other price lists (excluding current one)
                const otherPriceLists = allPriceLists.filter((_, index) => index !== currentIndex)
                for (let i = 0; i < otherPriceLists.length; i++) {
                    const other = otherPriceLists[i]
                    if (other.startDate && other.endDate) {
                        const otherStart = new Date(other.startDate)
                        const otherEnd = new Date(other.endDate)
                        otherStart.setHours(0, 0, 0, 0)
                        otherEnd.setHours(0, 0, 0, 0)

                        // Check if dates overlap
                        if (start <= otherEnd && end >= otherStart) {
                            errors.overlap = `Date range overlaps with "${other.name || `Price List ${i + 1}`}"`
                            break
                        }
                    }
                }
            }
        }

        return errors
    }

    // Validate all price lists for errors
    const validateAllPriceLists = () => {
        const allErrors = {}
        priceLists.forEach((priceList, index) => {
            const errors = validatePriceListDateRange(priceList, priceLists, index)
            if (Object.keys(errors).length > 0) {
                allErrors[index] = errors
            }
        })
        setDateErrors(allErrors)
        return Object.keys(allErrors).length === 0
    }

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

        if (!checked) {
            const priceField = `basePricePer${type.charAt(0).toUpperCase() + type.slice(1)}`
            handleInputChange(priceField, "")
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({ ...prev, image: file }))

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

    // Price List Management Functions
    const addPriceList = () => {
        const newPriceList = {
            name: "",
            startDate: "",
            endDate: "",
            multiplier: "",
            customerGroups: []
        }
        setPriceLists([...priceLists, newPriceList])
        setShowPriceLists(true)
    }

    const removePriceList = (index) => {
        const updated = priceLists.filter((_, i) => i !== index)
        setPriceLists(updated)

        // Clean up errors for removed price list
        const updatedErrors = { ...dateErrors }
        delete updatedErrors[index]

        // Reindex remaining errors
        const reindexedErrors = {}
        Object.keys(updatedErrors).forEach(key => {
            const numKey = parseInt(key)
            if (numKey > index) {
                reindexedErrors[numKey - 1] = updatedErrors[key]
            } else {
                reindexedErrors[key] = updatedErrors[key]
            }
        })
        setDateErrors(reindexedErrors)

        if (updated.length === 0) {
            setShowPriceLists(false)
        }
    }

    const updatePriceList = (index, field, value) => {
        const updated = priceLists.map((priceList, i) =>
            i === index ? { ...priceList, [field]: value } : priceList
        )
        setPriceLists(updated)

        // Validate on date changes
        if (field === 'startDate' || field === 'endDate') {
            setTimeout(() => validateAllPriceLists(), 100)
        }
    }

    const updatePriceListCustomerGroups = (index, customerGroupId, checked) => {
        const updated = priceLists.map((priceList, i) =>
            i === index
                ? {
                    ...priceList,
                    customerGroups: checked
                        ? [...priceList.customerGroups, customerGroupId]
                        : priceList.customerGroups.filter(id => id !== customerGroupId)
                }
                : priceList
        )
        setPriceLists(updated)
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
        setPriceLists([])
        setImagePreview(null)
        setIsSubmitting(false)
        setShowPriceLists(false)
        setDateErrors({})
    }

    const uploadImage = async (imageFile) => {
        if (!imageFile) return null;

        const formData = new FormData();
        formData.append("image", imageFile);

        const imageUrl = await uploadImageAction(formData);
        return imageUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // ✅ Validate form fields
            if (!formData.name.trim()) {
                toast.error("Product name is required");
                setIsSubmitting(false);
                return;
            }

            if (!formData.LateFeePerHour || parseFloat(formData.LateFeePerHour) < 0) {
                toast.error("Late fee per hour is required and must be 0 or greater");
                setIsSubmitting(false);
                return;
            }

            // ✅ Check if at least one pricing option is selected
            if (!isPricingSelected) {
                toast.error("Please select at least one pricing option");
                setIsSubmitting(false);
                return;
            }

            // ✅ Validate price lists if any exist
            if (priceLists.length > 0) {
                const isValid = validateAllPriceLists();
                if (!isValid) {
                    setIsSubmitting(false);
                    toast.error("Please fix the date errors before submitting");
                    return;
                }

                // Ensure all price lists have required fields
                for (let i = 0; i < priceLists.length; i++) {
                    const pl = priceLists[i];
                    if (!pl.name || !pl.startDate || !pl.endDate || !pl.multiplier) {
                        toast.error(`Please fill in all fields for Price List ${i + 1} or remove it`);
                        setIsSubmitting(false);
                        return;
                    }

                    // Validate multiplier is a positive number
                    const multiplier = parseFloat(pl.multiplier);
                    if (isNaN(multiplier) || multiplier <= 0) {
                        toast.error(`Multiplier for Price List ${i + 1} must be a positive number`);
                        setIsSubmitting(false);
                        return;
                    }
                }
            }

            // ✅ Upload image if provided
            let imageUrl = null;
            if (formData.image) {
                imageUrl = await uploadImage(formData.image);
            }

            // ✅ Prepare payload for backend - matching backend parameter names exactly
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim() || null,
                units: parseInt(formData.units) || 1,
                LateFeePerHour: parseFloat(formData.LateFeePerHour),
                imageUrl,
                categoryId: formData.categoryId || null,
                slug: formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                // ✅ Filter out empty attributes and match backend expectations
                attributes: attributes.filter(attr => attr.key.trim() && attr.value.trim()),
                // ✅ Format price lists to match backend expectations
                priceList: priceLists.map(pl => ({
                    name: pl.name.trim(),
                    startDate: new Date(pl.startDate + "T00:00:00.000Z"),
                    endDate: new Date(pl.endDate + "T23:59:59.999Z"),
                    multiplier: parseFloat(pl.multiplier),
                    customerGroups: pl.customerGroups || []
                }))
            };

            // ✅ Add pricing data only for selected options with valid values
            if (pricingTypes.hour && formData.basePricePerHour) {
                const hourlyPrice = parseFloat(formData.basePricePerHour);
                if (!isNaN(hourlyPrice) && hourlyPrice >= 0) {
                    payload.basePricePerHour = hourlyPrice;
                }
            }
            if (pricingTypes.day && formData.basePricePerDay) {
                const dailyPrice = parseFloat(formData.basePricePerDay);
                if (!isNaN(dailyPrice) && dailyPrice >= 0) {
                    payload.basePricePerDay = dailyPrice;
                }
            }
            if (pricingTypes.week && formData.basePricePerWeek) {
                const weeklyPrice = parseFloat(formData.basePricePerWeek);
                if (!isNaN(weeklyPrice) && weeklyPrice >= 0) {
                    payload.basePricePerWeek = weeklyPrice;
                }
            }

            // ✅ Set default values for unselected pricing types
            if (!payload.basePricePerHour) payload.basePricePerHour = 0;
            if (!payload.basePricePerDay) payload.basePricePerDay = 0;
            if (!payload.basePricePerWeek) payload.basePricePerWeek = 0;

            console.log("Payload to backend:", payload);

            // ✅ Call server action (should now call createProductRecord internally)
            const result = await createProduct(payload);

            console.log("Product created:", result);
            resetForm();
            onClose();
            toast.success("Product created successfully!");

            // Optional: Instead of full reload, you could emit an event or call a refresh function
            if (typeof window !== 'undefined') {
                window.location.reload();
            }

        } catch (error) {
            console.error("Failed to create product:", error);
            const errorMessage = error.message || "Unknown error occurred";
            toast.error("Failed to create product: " + errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                onChange={(e) => handleInputChange("units", parseInt(e.target.value) || 1)}
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
                        <Label>Base Pricing Options *</Label>
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

                    {/* Multiple Dynamic Price Lists */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Dynamic Price Lists (Optional)</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addPriceList}
                                    className="flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Price List
                                </Button>
                                {priceLists.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowPriceLists(!showPriceLists)}
                                        className="flex items-center gap-1"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        {showPriceLists ? 'Hide' : 'Show'} Price Lists ({priceLists.length})
                                    </Button>
                                )}
                            </div>
                        </div>

                        {showPriceLists && priceLists.length > 0 && (
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                    Price lists allow you to set different pricing during specific date ranges using multipliers.
                                    Each price list will be applied during its date range. Make sure date ranges don't overlap.
                                </div>

                                {/* Global Date Error Display */}
                                {hasDateErrors && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <div className="flex items-center gap-2 text-red-800">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span className="font-medium">Price List Validation Errors:</span>
                                        </div>
                                        <div className="mt-2 text-sm text-red-700 space-y-1">
                                            {Object.entries(dateErrors).map(([index, errors]) => (
                                                <div key={index}>
                                                    <strong>Price List {parseInt(index) + 1}:</strong>
                                                    <ul className="list-disc list-inside ml-4">
                                                        {Object.entries(errors).map(([key, error]) => (
                                                            <li key={key}>{error}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {priceLists.map((priceList, index) => (
                                    <Card key={index} className="p-4">
                                        <CardHeader className="p-0 pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Price List {index + 1}</CardTitle>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removePriceList(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Price List Name *</Label>
                                                    <Input
                                                        placeholder="e.g., Summer Sale, Holiday Pricing"
                                                        value={priceList.name}
                                                        onChange={(e) => updatePriceList(index, "name", e.target.value)}
                                                        required={priceLists.length > 0}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Multiplier *</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        placeholder="1.0 (no change), 1.5 (+50%), 0.8 (-20%)"
                                                        value={priceList.multiplier}
                                                        onChange={(e) => updatePriceList(index, "multiplier", e.target.value)}
                                                        required={priceLists.length > 0}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Start Date *</Label>
                                                    <Input
                                                        type="date"
                                                        min={getTodayString()}
                                                        value={priceList.startDate}
                                                        onChange={(e) => updatePriceList(index, "startDate", e.target.value)}
                                                        className={dateErrors[index]?.startDate ? "border-red-500" : ""}
                                                        required={priceLists.length > 0}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date *</Label>
                                                    <Input
                                                        type="date"
                                                        min={priceList.startDate || getTodayString()}
                                                        value={priceList.endDate}
                                                        onChange={(e) => updatePriceList(index, "endDate", e.target.value)}
                                                        className={dateErrors[index]?.endDate ? "border-red-500" : ""}
                                                        required={priceLists.length > 0}
                                                    />
                                                </div>
                                            </div>

                                            {customerGroups.length > 0 && (
                                                <div className="space-y-2">
                                                    <Label>Customer Groups (Optional)</Label>
                                                    <div className="text-xs text-gray-500 mb-2">
                                                        If no groups are selected, this price list will apply to all customers
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                        {customerGroups.map((group) => (
                                                            <div key={group.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`priceList-${index}-group-${group.id}`}
                                                                    checked={priceList.customerGroups.includes(group.id)}
                                                                    onCheckedChange={(checked) =>
                                                                        updatePriceListCustomerGroups(index, group.id, checked)
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={`priceList-${index}-group-${group.id}`}
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
                                ))}
                            </div>
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
                            disabled={isSubmitting || !isPricingSelected || hasDateErrors}
                        >
                            {isSubmitting ? "Creating..." : "Create Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}