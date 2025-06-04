
// import { useEffect } from "react"
// import { useRouter } from "next/router"
// import { useDispatch } from "react-redux"

import { redirect } from 'next/navigation';

export default function Page() {
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   // window.location.href = '/market/overview'
  //   if (token) {
  //     window.location.href = '/market/overview'
  //   }
  //   else {
  //     window.location.href = '/auth/login'
  //   }
  // }, [])
  redirect('trade/BNBUSDT'); // instantly redirects when visiting "/"
}
