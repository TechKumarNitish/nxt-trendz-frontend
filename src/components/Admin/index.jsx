import React, { useEffect, useState } from 'react'
import { BsBox, BsGraphUp, BsCurrencyDollar } from 'react-icons/bs'
import AdminFilters from './components/AdminFilters'
import OrdersTable from './components/OrdersTable'
import Cookies from 'js-cookie'
import './index.css'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter states
  const [paymentStatus, setPaymentStatus] = useState('all')
  const [deliveryStatus, setDeliveryStatus] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Stats states
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingDeliveries: 0
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [orders, paymentStatus, deliveryStatus, searchInput, startDate, endDate])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = Cookies.get('jwt_token')
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/orders`,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await res.json()
      setOrders(data)
      calculateStats(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to load orders. Please try again.')
      setOrders([])
    }
    setLoading(false)
  }

  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.length
    const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    const pendingDeliveries = ordersData.filter(order => 
      order.deliveryStatus !== 'delivered' && order.deliveryStatus !== 'returned'
    ).length

    setStats({
      totalOrders,
      totalRevenue,
      pendingDeliveries
    })
  }

  const applyFilters = () => {
    let filtered = [...orders]

    // Search filter
    if (searchInput.trim()) {
      const searchTerm = searchInput.toLowerCase().trim()
      filtered = filtered.filter(order => 
        order.product?.name?.toLowerCase().includes(searchTerm) ||
        order.user?.name?.toLowerCase().includes(searchTerm) ||
        order._id?.toLowerCase().includes(searchTerm) ||
        order.user?.email?.toLowerCase().includes(searchTerm)
      )
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt)
        const start = new Date(startDate)
        return orderDate >= start
      })
    }

    if (endDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999) // Include the entire end date
        return orderDate <= end
      })
    }

    // Payment status filter
    if (paymentStatus !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatus)
    }

    // Delivery status filter
    if (deliveryStatus !== 'all') {
      filtered = filtered.filter(order => order.deliveryStatus === deliveryStatus)
    }

    setFilteredOrders(filtered)
  }

  const handleUpdateDeliveryStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliveryStatus: newStatus })
      })

      if (!res.ok) {
        throw new Error('Failed to update delivery status')
      }

      // Update the order in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, deliveryStatus: newStatus }
            : order
        )
      )

      // Show success message (you can add a toast notification here)
      console.log('Delivery status updated successfully')
    } catch (error) {
      console.error('Error updating delivery status:', error)
      throw error // Re-throw to let the OrderRow component handle it
    }
  }

  const handleClearFilters = () => {
    setPaymentStatus('all')
    setDeliveryStatus('all')
    setSearchInput('')
    setStartDate('')
    setEndDate('')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (error) {
    return (
      <div className="admin-orders-container">
        <div className="error-container">
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={fetchOrders}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-orders-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title-section">
          <h1 className="admin-title">Orders Management</h1>
          <p className="admin-subtitle">Manage and track all customer orders</p>
        </div>
        <button 
          className="refresh-btn"
          onClick={fetchOrders}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <BsBox />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalOrders}</h3>
            <p className="stat-label">Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue-icon">
            <BsCurrencyDollar />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{formatCurrency(stats.totalRevenue)}</h3>
            <p className="stat-label">Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <BsGraphUp />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.pendingDeliveries}</h3>
            <p className="stat-label">Pending Deliveries</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AdminFilters
        paymentStatus={paymentStatus}
        deliveryStatus={deliveryStatus}
        searchInput={searchInput}
        startDate={startDate}
        endDate={endDate}
        onPaymentStatusChange={setPaymentStatus}
        onDeliveryStatusChange={setDeliveryStatus}
        onSearchInputChange={setSearchInput}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClearFilters={handleClearFilters}
      />

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
      />
    </div>
  )
}

export default AdminOrders