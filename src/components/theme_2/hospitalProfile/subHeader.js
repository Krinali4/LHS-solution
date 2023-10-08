import React from 'react';
import './t2_hp.css';
import { useHistory, useLocation } from "react-router-dom";

const subHeader = () => {
  const history = useHistory();
  const location = useLocation();

 const handleprofile = () => {
        history.push('/main/hospital/profile')
      }
   const handlepassword = () => {
        history.push('/main/hospital/profile/changePassword')
      }
  return (
    <div>
      <div className="t2_hospHeader">
           <button onClick={handleprofile} className={'/main/hospital/profile' === location.pathname ?"t2_subHeader_item t2_subHeader_item_clicked":"t2_subHeader_item"}> My Profile </button>
           <button onClick={handlepassword} className={'/main/hospital/profile/changePassword' === location.pathname ?"t2_subHeader_item t2_subHeader_item_clicked":"t2_subHeader_item"}> Change Password </button>
        </div>

    </div>
  )
}

export default subHeader