import React, {useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom';
import Loader from '../../modals/Loader';
import Confirm from '../../modals/confirm';
import filter from '../../assets/images/filter.svg';
import downarrow from '../../assets/images/downarrow.svg';
import uparrow from '../../assets/images/uparrow.png';
import searchImg from '../../assets/images/search.svg';
import Pagination from './pagination';
import edit from '../../assets/images/edit_note.svg';
import del from '../../assets/images/delete.svg';
import { SET_HP_PROFILE, SET_AUTH } from '../../../constants/actionTypes';
import { callApi, setSession } from '../../../action';
import ErrorState from '../../theme_1/staffSignUp/components/errorState';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Stack from '@mui/material/Stack';
import moment from 'moment'

const StaffAttendance = () => {
    const[staffId, setStaffId] = useState('')
    const[jobId, setJobId] = useState('')
    const[attdId, setAttdId] = useState('')
    const[hospitalId, setHospitalId] = useState('')
    const[attdlist, setAttdList] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const [showAttendanceModal, setShowAttendanceModal] = useState('none')
    const [clockIn, setClockIn] = useState(new Date())
    const [clockOut, setClockOut] = useState(new Date())
    const [showPending, setShowPending] = useState('none')
    const [pendingStatus, setPendingStatus] = useState(false)
    const [disputeData, setDisputeData] = useState("")
    const [disputeError, setDisputeError] = useState("none")
    const [clockInError, setclockInError] = useState("none")
    const [clockOutError, setclockOutError] = useState("none")
    const[showModalLoader, setShowModalLoader]= useState(false)

    useEffect(()=> {
        setShowLoader(true)
       const fetchStaffId = window.localStorage.getItem("adminStaffId")
       const fetchhospitalId = window.localStorage.getItem('hospitalJobId')
        const fetchJobId = window.localStorage.getItem('adminHospitalJobId')
       setStaffId(fetchStaffId ? fetchStaffId : '')
       setHospitalId(fetchhospitalId ? fetchhospitalId : '')
       setJobId(fetchJobId ? fetchJobId : '')
       const fetchAttendance = async() => {
        var token = localStorage.getItem("accessToken");
        const res = await callApi("GET", `v1/LHS/attendance/list/hospital/attendence?job=${jobId}&staff=${staffId}&hospital_id=${hospitalId}`, `Bearer ${token}`);
      if(res.data) {
        setAttdList(res.data)
        setShowLoader(false)
      }
      else{
        setAttdList([])
        setShowLoader(false)
      }
    console.log(res.data);
    }
    if(jobId && staffId && hospitalId) {
        fetchAttendance();
    }

    },[staffId, pendingStatus])

    const editOneRow = (id, login) => {
        console.log(login , 'login date in edit');
        setAttdId(id)
        setShowAttendanceModal('block')
        setClockIn(new Date(login))
        setClockOut(new Date(login))
    }
    const convertToHours = (time) => {
        var  hours = Math.floor((time) / 60)
       var minutes = ((time) % 60)  
       return `${hours}h ${minutes}m `; 
   }

   const RaiseDispute = (e) => {
    setDisputeData(e.target.value)
    if(e.target.value === ''){
        setDisputeError('block')
    }
    else if (e.target.value !== '') {
        setDisputeError('none')
    }
  }

  const saveAttendance = async() => {
       if(clockIn === null){
console.log('block clockin');
setclockInError('block')
    }
     if (clockOut === null) {
     console.log('block clockout');
     setclockOutError('block')

    }
    if(disputeData === ''){
     console.log('block comment');
     setDisputeError('block')
    }

    if(clockIn !== null && clockOut !== null && disputeData !== ''){
     setShowModalLoader(true)

     var data = {
         logIn : new Date(clockIn).toISOString(),
         logOut : new Date(clockOut).toISOString(),
         resolution : disputeData
     }
     var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
     var res = await callApi("PUT", `v1/LHS/attendance/dispute/resolve?AttId=${attdId}&hospital_id=${hospitalId}`, Authorization, data);
     if(res.status === 200) {
         setShowModalLoader(false)
         alert('Attendance Updated Successfully')
     setShowAttendanceModal('none')
     setPendingStatus(!pendingStatus)
     setClockIn('')
     setClockOut('')
     }
     else{
         setShowModalLoader(false)
     setShowAttendanceModal('none')
     setClockIn('')
     setClockOut('')
     }
 }
     console.log(data, 'dataaaaaaaaa');
 }
   const closeModal = () => {
    setShowAttendanceModal('none')
    setClockIn('')
    setClockOut('')
}
  return (
    <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
    <p> <Link to={"/main/admin/hospital-staffList"} style={{ textDecoration: 'none' }}> <span style={{ color: '#009CDE', fontSize: 16, cursor: 'pointer' }}>{'<'} Staff List </span> </Link></p>
    <div className="t2_sp_work" style={{ marginTop: 0 }}>
        
{showLoader ? <Loader /> :                
<div className="row hide_scrollbar" style={{ overflowX: 'auto', marginTop: '32px', display: attdlist.length ? "block" : "none" }}>
            <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
                <thead>
                    <tr className="nurseHead">
                        <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}>Date </th>
                        <th className="t2_sp_licence_th"> Clock-In </th>
                        <th className="t2_sp_licence_th"> Clock-Out </th>
                        <th className="t2_sp_licence_th"> Shift Cost </th>
                        <th className="t2_sp_licence_th"> Total Shift Time </th>
                        <th className="t2_sp_licence_th" style={{ width: '80px' }}> Action </th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ height: 20 }} />
                    {
                     attdlist &&   attdlist.map((item) => {

                            return <React.Fragment key={item._id}>
                                <tr className="admin_mngStaff_row">
                                    <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> {moment(item.createdAt).format('MM-DD-YYYY') } </td>
                                    <td className="admin_mngStaff_td"> {item.logIn ? new Date(item.logIn).toLocaleTimeString() : "--" } </td>
                                    <td className="admin_mngStaff_td"> {item.logOut ? new Date(item.logOut).toLocaleTimeString() : "--" } </td>
                                    <td className="admin_mngStaff_td"> {item.shiftCost ? item.shiftCost : "--"}</td>
                                    <td className="admin_mngStaff_td"> {item.totalShiftTime ? convertToHours(item.totalShiftTime) : "--" }</td>
                                    <td className="admin_mngStaff_td">
                                            {/* <button className="w-75 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" onClick={() => editOneRow(item._id)}></button> */}
                                <span style={{ marginRight : '20px' }} onClick={() => editOneRow(item._id, item.logIn)}><img width="16px" height="16px" alt="img" src={edit} style={{ cursor: 'pointer' }} /></span>
                                     </td>
                                </tr>
                                <tr style={{ height: 24 }}></tr>
                            </React.Fragment>
                        })
                    }
                </tbody>
            </table>
        </div>}
        
        { (!attdlist.length && !showLoader) ? <p className="text-center my-5">No record found</p> : null}

        <div className="w3-modal" style={{display: showAttendanceModal}} >
                <div className="w3-modal-content ssu2_modal1" style={{maxHeight: 600, overflowY: 'auto'}}>
                    <div className="w3-container">
                        <div className="ssu2_modal1_text1">Update Attendance</div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                        <div className="" >
                            {/* <div className="col-md-6" style={{padding: 0}}> */}
                                <div className="row m-0 rate_reviw_card_comment mt-3">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={2}>
                                <div className="ssu2_modal1_text2" style ={{textAlign : 'left' }}>Clock-In :- </div>

      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        // label="Clock-In"
        value={clockIn}
        onChange={(newValue) => {
          setClockIn(newValue);
          setclockInError('none')
        }}
      />
      <ErrorState show={clockInError} name='Clock-In Time is required'/>
    <div className="ssu2_modal1_text2" style ={{textAlign : 'left' }}>Clock-Out :- </div>

      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        // label="Clock-Out"
        value={clockOut}
        onChange={(newValue) => {
          setClockOut(newValue);
          setclockOutError('none')
        }}
      />
      <ErrorState show={clockOutError} name='Clock-Out Time is required'/>
    <div className="ssu2_modal1_text2" style ={{textAlign : 'left' }}>Comments:- </div>
<textarea placeholder='Write Your Comments'
                            onChange={RaiseDispute} value={disputeData}
                            />
      <ErrorState show={disputeError} name='Comment is required'/>
      </Stack >
    </LocalizationProvider>
                                   
                                </div>
                        </div>
                      
                        <hr style={{margin: '60px 0px 0px'}}/>
                        <div className="row ssu_bottom">
                            <button className="ssu2_modal1_button1" onClick={saveAttendance}> 
                            {showModalLoader ? <Loader/> : "SAVE"}
                             </button>
                            <button className="ssu2_modal1_button2" onClick={closeModal}> CANCEL </button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</div>
  )
}

export default StaffAttendance
