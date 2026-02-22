"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Package, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { fetchUserOrders } from "@/lib/api"
import { format } from "date-fns"

const StatusIcon = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    case "shipped":
    case "in transit":
      return <Truck className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "text-green-600"
    case "shipped":
    case "processing":
      return "text-amber-600"
    case "cancelled":
      return "text-red-600"
    default:
      return "text-neutral-600"
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)

  useEffect(() => {
    fetchUserOrders()
      .then((data) => {
        setOrders(data)
        if (data.length > 0) {
          setExpandedOrder(data[0].id)
        }
      })
      .catch((err) => {
        console.error("Failed to load orders:", err)
        setError("Unable to load your order history. Please try again later.")
      })
      .finally(() => setLoading(false))
  }, [])

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
            <p className="text-muted-foreground">View your order history</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <h2 className="font-serif text-2xl mb-8">Order History</h2>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse border border-border" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16 border border-border bg-red-50/50">
                  <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                  <p className="text-red-700 mb-6">{error}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 border border-border">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                  <Link
                    href="/shop"
                    className="text-sm tracking-[0.15em] uppercase underline underline-offset-4 hover:no-underline transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-border"
                    >
                      {/* Order header */}
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                          <span className="font-mono text-sm">#{order.id.toString().padStart(6, '0')}</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), "MMMM dd, yyyy")}
                          </span>
                          <span className={`flex items-center gap-1.5 text-sm uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            <StatusIcon status={order.status} />
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm hidden sm:block">₹{order.total.toLocaleString()}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ${expandedOrder === order.id ? "rotate-180" : ""
                              }`}
                          />
                        </div>
                      </button>

                      {/* Order details */}
                      <AnimatePresence>
                        {expandedOrder === order.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 border-t border-border">
                              <div className="space-y-4 pt-6">
                                {order.items.map((item: any) => (
                                  <Link key={item.id} href={`/product/${item.product_id}`} className="flex gap-4 group">
                                    <div className="w-16 h-20 bg-muted flex-shrink-0 relative overflow-hidden">
                                      <Image
                                        src={"/placeholder.svg"} // Backend doesn't always provide item images in the order list
                                        alt={item.product_name}
                                        fill
                                        sizes="64px"
                                        loading="lazy"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-serif text-sm group-hover:underline">{item.product_name}</h4>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Qty: {item.quantity} {item.color ? ` / ${item.color}` : ''}
                                      </p>
                                    </div>
                                    <div className="text-sm">₹{item.price.toLocaleString()}</div>
                                  </Link>
                                ))}
                              </div>

                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t border-border">
                                <div className="text-sm flex flex-col gap-1">
                                  <div className="text-muted-foreground">
                                    Subtotal: <span className="text-foreground">₹{order.subtotal.toLocaleString()}</span>
                                  </div>
                                  <div className="text-muted-foreground">
                                    Tax & Shipping: <span className="text-foreground">₹{(order.tax + order.shipping).toLocaleString()}</span>
                                  </div>
                                  <div className="mt-1">
                                    <span className="text-muted-foreground">Total: </span>
                                    <span className="font-medium">₹{order.total.toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <button className="text-sm underline underline-offset-4 hover:no-underline transition-all">
                                    View Invoice
                                  </button>
                                  {(order.status === "shipped" || order.status === "in transit") && (
                                    <button className="text-sm underline underline-offset-4 hover:no-underline transition-all">
                                      Track Order
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <PremiumFooter />
    </>
  )
}
