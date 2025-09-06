import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const {axios, token} = useAppContext()

  const fetchPlans = async () => {
    try {
      const {data} = await axios.get(`/api/credit/plan?t=${new Date().getTime()}`, {
        headers: {
          Authorization: token,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      })

      if(data.success){
        setPlans(data.plans)
      }
      else{
        toast.error(data.message || 'Failed to fetch plans.')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const purchasePlan = async (planId) => {
    try {
      const {data} = await axios.post('/api/credit/purchase', {planId}, {headers: {Authorization: token}})
      if(data.success){
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "JarvisGPT",
          description: "Credit Purchase",
          order_id: data.orderId,
          handler: async function (response) {
            try {
              const verificationResponse = await axios.post('/api/credit/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: planId
              }, { headers: { Authorization: token } });

              if (verificationResponse.data.success) {
                toast.success("Payment successful! Credits added.");
                // You might want to refetch user data here to update the credit count in the UI
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (error) {
              toast.error("An error occurred during payment verification.");
            }
          },
          prefill: {
            name: "Test User",
            email: "test.user@example.com",
            contact: "9999999999"
          },
          notes: {
            address: "Razorpay Corporate Office"
          },
          theme: {
            color: "#3399cc"
          }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=> {
    fetchPlans()
  }, [])

  if(loading) return <Loading />

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white'>Credit Plans</h2>

      <div className='flex flex-wrap justify-center gap-8'> 
        {plans.map((plan)=> (
          <div key={plan._id} className={`border border-gray-200 dark:border-blue-700 rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-[300px] flex flex-col dark:bg-transparent"}`}>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>{plan.name}</h3>
              <p className='text-2xl font-bold text-blue-600 dark:text-purple-300 mb-4'>₹{plan.price}
                <span className='text-base font-normal text-gray-600 dark:text-purple-200'>{' '}/ {plan.credits} credits</span>
              </p>

              <ul className='list-disc list-inside text-sm text-gray-700 dark:text-purple-200 space-y-1'>
                {plan.features.map((feature, index)=> (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button onClick={()=> toast.promise(purchasePlan(plan._id), {loading: 'Processing...'})} className='mt-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2 rounded transition-colors cursor-pointer'>Buy Now</button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Credits
