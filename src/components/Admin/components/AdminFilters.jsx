import React from 'react'
import { BsSearch, BsCalendar3, BsFilter } from 'react-icons/bs'
import './AdminFilters.css'

const AdminFilters = ({
  paymentStatus,
  deliveryStatus,
  searchInput,
  startDate,
  endDate,
  onPaymentStatusChange,
  onDeliveryStatusChange,
  onSearchInputChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters
}) => {
  const paymentStatusOptions = [
    { value: 'all', label: 'All Payment Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'partially_refunded', label: 'Partially Refunded' }
  ]

  const deliveryStatusOptions = [
    { value: 'all', label: 'All Delivery Status' },
    { value: 'not_dispatched', label: 'Not Dispatched' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'delivery_failed', label: 'Delivery Failed' },
    { value: 'returned', label: 'Returned' }
  ]

  const handleSearchInputChange = (event) => {
    onSearchInputChange(event.target.value)
  }

  const handleStartDateChange = (event) => {
    onStartDateChange(event.target.value)
  }

  const handleEndDateChange = (event) => {
    onEndDateChange(event.target.value)
  }

  return (
    <div className="admin-filters-container">
      <div className="admin-filters-header">
        <h3 className="admin-filters-title">
          <BsFilter className="filter-icon" />
          Filters & Search
        </h3>
        <button 
          type="button" 
          className="clear-filters-btn"
          onClick={onClearFilters}
        >
          Clear All
        </button>
      </div>

      <div className="admin-filters-content">
        {/* Search Input */}
        <div className="search-input-container">
          <BsSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by product name, user name, or order ID..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </div>

        {/* Date Range Filters */}
        <div className="date-filters-container">
          <div className="date-filter-group">
            <label className="date-label">
              <BsCalendar3 className="calendar-icon" />
              From Date:
            </label>
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="date-filter-group">
            <label className="date-label">
              <BsCalendar3 className="calendar-icon" />
              To Date:
            </label>
            <input
              type="date"
              className="date-input"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="status-filters-container">
          <div className="status-filter-group">
            <label className="status-label">Payment Status:</label>
            <select
              className="status-select"
              value={paymentStatus}
              onChange={(e) => onPaymentStatusChange(e.target.value)}
            >
              {paymentStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="status-filter-group">
            <label className="status-label">Delivery Status:</label>
            <select
              className="status-select"
              value={deliveryStatus}
              onChange={(e) => onDeliveryStatusChange(e.target.value)}
            >
              {deliveryStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminFilters 