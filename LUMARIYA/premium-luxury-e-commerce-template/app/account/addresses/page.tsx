"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MapPin, Edit2, Trash2, AlertCircle, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { fetchUserAddresses, deleteAddress, createAddress, updateAddress } from "@/lib/api"
import Link from "next/link"

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    setLoading(true)
    try {
      const data = await fetchUserAddresses()
      setAddresses(data)
    } catch (err) {
      console.error("Failed to load addresses:", err)
      setError("Unable to load your addresses. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    try {
      await deleteAddress(id)
      setAddresses(addresses.filter(addr => addr.id !== id))
    } catch (err) {
      console.error("Failed to delete address:", err)
      alert("Failed to delete address. Please try again.")
    }
  }

  const handleOpenAdd = () => {
    setEditingAddress(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (address: any) => {
    setEditingAddress(address)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      full_name: formData.get("full_name"),
      address_line1: formData.get("address_line1"),
      address_line2: formData.get("address_line2"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip_code: formData.get("zip_code"),
      country: formData.get("country"),
      is_default: formData.get("is_default") === "on",
    }

    try {
      if (editingAddress) {
        const updated = await updateAddress(editingAddress.id, data)
        setAddresses(addresses.map(addr => addr.id === updated.id ? updated : addr))
      } else {
        const created = await createAddress(data)
        setAddresses([...addresses, created])
      }
      setIsModalOpen(false)
    } catch (err: any) {
      console.error("Failed to save address:", err)
      alert(err.message || "Failed to save address. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-serif text-3xl lg:text-4xl mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your shipping addresses</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl">Saved Addresses</h2>
                <Button onClick={handleOpenAdd} variant="outline" className="gap-2 text-sm tracking-[0.1em] uppercase bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 border border-border">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Loading addresses...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16 border border-border bg-red-50/50">
                  <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                  <p className="text-red-700 mb-6">{error}</p>
                  <Button onClick={loadAddresses} variant="outline" className="text-xs">Try Again</Button>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-16 border border-border">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-6">You haven't saved any addresses yet.</p>
                  <Button onClick={handleOpenAdd} variant="outline" className="gap-2 text-sm tracking-[0.1em] uppercase bg-transparent">
                    <Plus className="h-4 w-4" />
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {addresses.map((address, index) => (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`relative border p-6 transition-colors cursor-pointer ${selectedAddress === address.id || address.is_default
                        ? "border-foreground"
                        : "border-border hover:border-foreground/50"
                        }`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      {address.is_default && (
                        <span className="absolute top-4 right-4 text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                          Default
                        </span>
                      )}

                      <div className="flex items-start gap-3 mb-4">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span className="text-sm font-medium">{address.full_name}</span>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1 ml-7">
                        <p>{address.full_name}</p>
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>
                          {address.city}, {address.state} {address.zip_code}
                        </p>
                        <p>{address.country}</p>
                      </div>

                      <div className="flex gap-4 mt-6 ml-7">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(address);
                          }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(address.id);
                          }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-background border border-border p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="font-serif text-2xl mb-8">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="full_name" className="text-xs tracking-wide uppercase">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      defaultValue={editingAddress?.full_name}
                      required
                      placeholder="e.g. Alexandra Sinclair"
                      className="mt-1.5 border-border/50 focus:border-foreground rounded-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address_line1" className="text-xs tracking-wide uppercase">Address Line 1</Label>
                    <Input
                      id="address_line1"
                      name="address_line1"
                      defaultValue={editingAddress?.address_line1}
                      required
                      placeholder="Street address, P.O. box"
                      className="mt-1.5 border-border/50 focus:border-foreground rounded-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address_line2" className="text-xs tracking-wide uppercase">Address Line 2 (Optional)</Label>
                    <Input
                      id="address_line2"
                      name="address_line2"
                      defaultValue={editingAddress?.address_line2}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className="mt-1.5 border-border/50 focus:border-foreground rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-xs tracking-wide uppercase">City</Label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={editingAddress?.city}
                        required
                        className="mt-1.5 border-border/50 focus:border-foreground rounded-none"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-xs tracking-wide uppercase">State</Label>
                      <Input
                        id="state"
                        name="state"
                        defaultValue={editingAddress?.state}
                        required
                        className="mt-1.5 border-border/50 focus:border-foreground rounded-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zip_code" className="text-xs tracking-wide uppercase">ZIP / PIN Code</Label>
                      <Input
                        id="zip_code"
                        name="zip_code"
                        defaultValue={editingAddress?.zip_code}
                        required
                        className="mt-1.5 border-border/50 focus:border-foreground rounded-none"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-xs tracking-wide uppercase">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        defaultValue={editingAddress?.country || "Inida"}
                        required
                        className="mt-1.5 border-border/50 focus:border-foreground rounded-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="is_default"
                      name="is_default"
                      defaultChecked={editingAddress?.is_default}
                      className="h-4 w-4 border-border rounded-none focus:ring-0 focus:ring-offset-0 accent-foreground"
                    />
                    <Label htmlFor="is_default" className="text-sm text-muted-foreground cursor-pointer">
                      Set as default shipping address
                    </Label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 rounded-none py-6 text-sm tracking-[0.2em] uppercase"
                  >
                    {formLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingAddress ? (
                      "Update Address"
                    ) : (
                      "Save Address"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-none py-6 text-sm tracking-[0.2em] uppercase"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PremiumFooter />
    </>
  )
}
