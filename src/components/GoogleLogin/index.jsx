import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import Cookies from "js-cookie"

const GoogleLoginButton = ({onSubmitFailure}) => {
  const navigate = useNavigate()
  return <GoogleLogin
    onSuccess={credentialResponse => {
      fetch(`${import.meta.env.VITE_BACKEND_URI}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      })
        .then(res => res.json())
        .then(data => {
          const{jwt_token}=data
          console.log("data", data)

          Cookies.set('jwt_token', jwt_token, {
            expires: 30,
          })
          navigate('/', { replace: true });
        })
    }}
    onError={
      
      () => onSubmitFailure('Login Failed')
    }
    useOneTap
  />
}

export default GoogleLoginButton