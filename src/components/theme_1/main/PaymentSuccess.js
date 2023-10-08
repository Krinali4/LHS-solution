import React, {useEffect} from 'react'
import Alert from 'react-bootstrap/Alert';
import { removeSession } from '../../../action';

const PaymentSuccess = () => {

    useEffect( () => {
removeSession();
    }, [] )
  return (
   <div className='outer_container m-10'> <Alert variant="success">
      <Alert.Heading>Verified Successfully!</Alert.Heading>
      <p>
       Congrats your account has been verified Successfully. Login to check you details
      </p>
      <hr />
      <p className="mb-0">
      <Alert.Link href="/login">Click Here To Login</Alert.Link>.
      </p>
    </Alert>
    </div>
  )
}

export default PaymentSuccess

