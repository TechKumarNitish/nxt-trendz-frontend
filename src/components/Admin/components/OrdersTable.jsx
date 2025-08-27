import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import OrderRow from './OrderRow'
import './OrdersTable.css'

const OrdersTable = ({ 
  orders, 
  loading, 
  onUpdateDeliveryStatus 
}) => {
  if (loading) {
    return (
      <div className="orders-loading-container">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#667eea"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
        <p className="loading-text">Loading orders...</p>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-empty-container">
        <div className="empty-icon">📦</div>
        <h3 className="empty-title">No Orders Found</h3>
        <p className="empty-description">
          There are no orders matching your current filters. Try adjusting your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="orders-table-container">
      <div className="orders-table-header">
        <h3 className="orders-count">
          Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
        </h3>
      </div>
      
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr className="table-header-row">
              <th className="table-header user-header">
                <div className="header-content">
                  <span>Customer</span>
                </div>
              </th>
              <th className="table-header product-header">
                <div className="header-content">
                  <span>Product</span>
                </div>
              </th>
              <th className="table-header quantity-header">
                <div className="header-content">
                  <span>Qty</span>
                </div>
              </th>
              <th className="table-header price-header">
                <div className="header-content">
                  <span>Total</span>
                </div>
              </th>
              <th className="table-header payment-header">
                <div className="header-content">
                  <span>Payment</span>
                </div>
              </th>
              <th className="table-header delivery-header">
                <div className="header-content">
                  <span>Delivery</span>
                </div>
              </th>
              <th className="table-header date-header">
                <div className="header-content">
                  <span>Date</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <OrderRow
                key={order._id}
                order={order}
                onUpdateDeliveryStatus={onUpdateDeliveryStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersTable 