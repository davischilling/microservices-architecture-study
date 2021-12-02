const OrderIndex = ({ orders }) => {
  if (orders.length > 0) {
    return <ul>
      {orders.map(order => {
        return <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      })}
    </ul>
  } else {
    return <div>
      <h4>You have no orders</h4>
    </div>
  }
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders')
  
  return { orders: data }
}

export default OrderIndex