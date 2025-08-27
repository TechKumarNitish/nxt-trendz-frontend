import Cookies from 'js-cookie'

const loadRazorpay = () =>
    new Promise(resolve => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })

const checkout = async (items, total_amount) => {
    const loaded = await loadRazorpay()
    if (!loaded) return alert('Razorpay SDK failed')
    const backendUri = import.meta.env.VITE_BACKEND_URI;
    const jwtToken = Cookies.get('jwt_token')
    const res = await fetch(`${backendUri}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}` },
        body: JSON.stringify({ amount: total_amount}),
    })
    const data = await res.json()

    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: 'NxtTrendz',
        description: 'Purchase Product',
        order_id: data.orderId,
        handler: async function (response) {
            const verify = await fetch(`${backendUri}/payment/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}` },
                body: JSON.stringify({
                    ...response,
                    items
                }),
            })
            const result = await verify.json()
            if (result.success) {
                alert('Payment Successful and Order Placed')
            } else {
                alert('Verification failed')
            }
        },
        theme: { color: '#3399cc' },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
}

export default checkout
