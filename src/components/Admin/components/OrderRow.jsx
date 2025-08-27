import React, { useState } from 'react'
import { BsPencil, BsCheck, BsX } from 'react-icons/bs'
import './OrderRow.css'

const OrderRow = ({ order, onUpdateDeliveryStatus }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newDeliveryStatus, setNewDeliveryStatus] = useState(order.deliveryStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const deliveryStatusOptions = [
    { value: 'not_dispatched', label: 'Not Dispatched', color: '#f59e0b' },
    { value: 'dispatched', label: 'Dispatched', color: '#3b82f6' },
    { value: 'in_transit', label: 'In Transit', color: '#8b5cf6' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: '#06b6d4' },
    { value: 'delivered', label: 'Delivered', color: '#10b981' },
    { value: 'delivery_failed', label: 'Delivery Failed', color: '#ef4444' },
    { value: 'returned', label: 'Returned', color: '#6b7280' }
  ]

  const getStatusColor = (status) => {
    const statusOption = deliveryStatusOptions.find(option => option.value === status)
    return statusOption ? statusOption.color : '#6b7280'
  }

  const getStatusLabel = (status) => {
    const statusOption = deliveryStatusOptions.find(option => option.value === status)
    return statusOption ? statusOption.label : status
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setNewDeliveryStatus(order.deliveryStatus)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setNewDeliveryStatus(order.deliveryStatus)
  }

  const handleSaveStatus = async () => {
    if (newDeliveryStatus === order.deliveryStatus) {
      setIsEditing(false)
      return
    }

    setIsUpdating(true)
    try {
      await onUpdateDeliveryStatus(order._id, newDeliveryStatus)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update delivery status:', error)
      // Reset to original status on error
      setNewDeliveryStatus(order.deliveryStatus)
    }
    setIsUpdating(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  return (
    <tr className="order-row">
      {/* User Information */}
      <td className="order-cell user-cell">
        <div className="user-info">
          <div className="user-avatar">
            {order.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{order.user?.name || 'Unknown User'}</div>
            <div className="user-email">{order.user?.email || 'No email'}</div>
          </div>
        </div>
      </td>

      {/* Product Information */}
      <td className="order-cell product-cell">
        <div className="product-info">
          {order.product?.image && (
            <img 
              src={order.product.image} 
              alt={order.product.name} 
              className="product-image"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
          <div className="product-details">
            <div className="product-name">{order.product?.name || 'Unknown Product'}</div>
            <div className="product-id">ID: {order.product?._id || 'N/A'}</div>
          </div>
        </div>
      </td>

      {/* Quantity */}
      <td className="order-cell quantity-cell">
        <span className="quantity-badge">{order.quantity}</span>
      </td>

      {/* Total Price */}
      <td className="order-cell price-cell">
        <span className="price-amount">{formatPrice(order.totalPrice)}</span>
      </td>

      {/* Payment Status */}
      <td className="order-cell payment-cell">
        <span 
          className="status-badge payment-status"
          style={{ 
            backgroundColor: order.paymentStatus === 'completed' ? '#10b981' : 
                           order.paymentStatus === 'failed' ? '#ef4444' : '#f59e0b'
          }}
        >
          {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Unknown'}
        </span>
      </td>

      {/* Delivery Status */}
      <td className="order-cell delivery-cell">
        {isEditing ? (
          <div className="delivery-status-edit">
            <select
              className="delivery-status-select"
              value={newDeliveryStatus}
              onChange={(e) => setNewDeliveryStatus(e.target.value)}
              disabled={isUpdating}
            >
              {deliveryStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="edit-actions">
              <button
                type="button"
                className="save-btn"
                onClick={handleSaveStatus}
                disabled={isUpdating}
              >
                <BsCheck />
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                <BsX />
              </button>
            </div>
          </div>
        ) : (
          <div className="delivery-status-display">
            <span 
              className="status-badge delivery-status"
              style={{ backgroundColor: getStatusColor(order.deliveryStatus) }}
            >
              {getStatusLabel(order.deliveryStatus)}
            </span>
            <button
              type="button"
              className="edit-status-btn"
              onClick={handleEditClick}
              title="Update delivery status"
            >
              <BsPencil />
            </button>
          </div>
        )}
      </td>

      {/* Date */}
      <td className="order-cell date-cell">
        <div className="order-date">
          <div className="date-main">{formatDate(order.createdAt)}</div>
          <div className="date-relative">
            {(() => {
              const now = new Date()
              const orderDate = new Date(order.createdAt)
              const diffInMs = now - orderDate
              const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
              
              if (diffInDays === 0) return 'Today'
              if (diffInDays === 1) return 'Yesterday'
              if (diffInDays < 7) return `${diffInDays} days ago`
              if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
              if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
              return `${Math.floor(diffInDays / 365)} years ago`
            })()}
          </div>
        </div>
      </td>
    </tr>
  )
}

export default OrderRow 