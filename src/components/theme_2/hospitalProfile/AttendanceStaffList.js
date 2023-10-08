import React,{useState, useEffect} from 'react'
import Loader from '../../modals/Loader'
import Header from '../components/header'
import { callApi } from '../../../action'
import { Link,useHistory } from 'react-router-dom'
import edit from '../../assets/images/edit.svg'
import verify from '../../assets/images/verify.png'
import checkMark from '../../assets/images/check-mark.png'
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Stack from '@mui/material/Stack';
import Pending from '../../modals/pending'
import ErrorState from '../../theme_1/staffSignUp/components/errorState'

const AttendanceStaffList = () => {
    const [jobId, setJobId] = useState('')
    const [staffId, setStaffId] = useState('')
    const [staffList, setStaffList] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const [showModalLoader, setShowModalLoader] = useState(false)
    const [showAttendanceModal, setShowAttendanceModal] = useState('none')
    const [clockIn, setClockIn] = useState(new Date())
    const [clockOut, setClockOut] = useState(new Date())
    const [showPending, setShowPending] = useState('none')
    const [pendingStatus, setPendingStatus] = useState(false)
    const [disputeData, setDisputeData] = useState("")
    const [disputeError, setDisputeError] = useState("none")
    const [clockInError, setclockInError] = useState("none")
    const [clockOutError, setclockOutError] = useState("none")
    const [updateId, setUpdateId] = useState("")


    const history = useHistory()

    useEffect( () => {
        setShowLoader(true)
        var getJobID = window.localStorage.getItem('jobID')
        var getStaffID = window.localStorage.getItem('staffID')
        setJobId(getJobID ? getJobID : '')
        setStaffId(getStaffID ? getStaffID : '')

        const fetchAttendance = async() => {
            var token = localStorage.getItem("accessToken");
            const res = await callApi("GET", `v1/LHS/attendance/list/hospital/attendence?job=${jobId}&staff=${staffId}`, `Bearer ${token}`);
          if(res.data) {
            setStaffList(res.data)
            setShowLoader(false)
          }
          else{
            setStaffList([])
            setShowLoader(false)
          }
        console.log(res.data);
        }
        if(jobId && staffId) {
            fetchAttendance();
        }
    }, [jobId, staffId, pendingStatus] )

    const goBack = () => {
        history.push('/main/hospital/attendance-staff')
    }
    const editAttendance = (id, login) => {
        setShowAttendanceModal('block')
        setClockIn(new Date(login))
        setUpdateId(id)
        setDisputeData('')
        setShowModalLoader(false)
        setClockOut(new Date(login).toLocaleDateString())
        setDisputeError('none')
        setclockInError('none')
        setclockOutError('none')
    }

    const closeModal = () => {
        setShowAttendanceModal('none')
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

   const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');

        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
    }
    const convertToHours = (time) => {
        var  hours = Math.floor((time) / 60)
       var minutes = ((time) % 60)  
       return `${hours}h ${minutes}m `; 
   }

    const saveAttendance = async() => {
       console.log(new Date(clockIn).toISOString() , 'clockinnnnn');
       console.log(new Date(clockOut).toISOString() , 'clockoutt');

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
console.log('proceddd');

        if(new Date (clockIn).toLocaleTimeString().slice(0,1) == 1 ) {
            let a = new Date (clockIn).toLocaleTimeString().slice(0,5);
            let b = new Date (clockIn).toLocaleTimeString().slice(9,11);
            var passClockIn = convertTime12to24(`${a} ${b}`)

        }else {
            let a = new Date (clockIn).toLocaleTimeString().slice(0,4);
            let b = new Date (clockIn).toLocaleTimeString().slice(8,11);
            var passClockIn = convertTime12to24(`${a} ${b}`)
        }
        if(new Date (clockOut).toLocaleTimeString().slice(0,1) == 1 ) {
            let a = new Date (clockOut).toLocaleTimeString().slice(0,5);
            let b = new Date (clockOut).toLocaleTimeString().slice(9,11);
            var passClockOut = convertTime12to24(`${a} ${b}`)

        }else {
            let a = new Date (clockOut).toLocaleTimeString().slice(0,4);
            let b = new Date (clockOut).toLocaleTimeString().slice(8,11);
            var passClockOut = convertTime12to24(`${a} ${b}`)
        }
         
        
        // let c = new Date (clockOut).toLocaleTimeString().slice(0,4);
        // let d = new Date (clockOut).toLocaleTimeString().slice(8,11);
        // let passClockOut = convertTime12to24(`${c} ${d}`)
        // console.log(passClockIn, passClockOut, 'dddddddddddddddddd');

        var data = {
            logIn : new Date(clockIn).toISOString(),
            logOut : new Date(clockOut).toISOString(),
            resolution : disputeData
        }
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("PUT", `v1/LHS/attendance/dispute/resolve?AttId=${updateId}`, Authorization, data);
        if(res.status === 200) {
            setShowModalLoader(false)
            alert('Attendance Updated Successfully')
        setShowAttendanceModal('none')
        setPendingStatus(!pendingStatus)
        }
        else{
            setShowModalLoader(false)
        setShowAttendanceModal('none')
        }
    }
        console.log(data, 'dataaaaaaaaa');

       
    }

    const verifyAttendance = async(id) => {
        setShowPending('block')
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var data = {
            verified : true
        }
        var res = await callApi("PUT", `v1/LHS/attendance/update?AttId=${id}`, Authorization, data);
        if(res.status === 200) {
            setShowPending('none')
            alert('Attendance Verified Successfully')
            setPendingStatus(!pendingStatus)
        }
        else{
            setShowPending('none')
        }
    }

  return (
    <div >
    <Header page="Attendance" />
    <div className="theme2_main_container">            
 {showLoader ? <Loader /> :   
  <>

{ <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
<p><span onClick={goBack} style={{ color: '#009CDE', fontSize: 16, cursor: 'pointer' }}>{'<'} Staff List </span></p>

<div className="t2_sp_work" style={{ marginTop: 0 }}>
    <div className="row m-0">
       
        {/* <button className="admin_mngAdmin_roleFilter">
        <span style={{width: 13, float: 'left', marginTop: -2}}><img src={filter} width="100%"/></span>
        <span style={{float: 'left', marginLeft: 10}}>Filter by role</span>
        <span style={{float: 'right', width: '8px', marginTop: -2}}><img src={downarrow} width="100%"/></span>
    </button>                                */}
        
    </div>
    <div className="row hide_scrollbar" style={{ overflowX: 'auto', marginTop: '32px', 
    // display: this.state.adminsList.length ? "block" : "none"
     }}>
 {staffList.length ?  <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
            <thead>
                <tr className="nurseHead">
                    <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}> Date </th>
                    <th className="t2_sp_licence_th"> Clock-In </th>
                    <th className="t2_sp_licence_th"> Clock-out </th>
                    <th className="t2_sp_licence_th"> Duration </th>
                    <th className="t2_sp_licence_th" > Edit </th> 
                    <th className="t2_sp_licence_th" style={{ width: '80px' }}> Verify </th> 
                </tr>
            </thead>



            <tbody>
                <tr style={{ height: 20 }} />



                {
                 staffList &&   staffList.map((item, index) => {
                        
                      return  <React.Fragment key={item._id}>
                            <tr className="admin_mngStaff_row">
                                <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> <span style={{ display : 'flex' }}>{new Date(item.createdAt).toLocaleDateString() }</span>  </td>
                                 <td className="admin_mngStaff_td"> {new Date(item.logIn).toLocaleTimeString() } </td> 
                                <td className="admin_mngStaff_td">
                                {/* <span key={"i"} className="w3-tag w3-blue w3-round ms-2"> {"v"} </span> */}
                                    {item.logOut ? new Date(item.logOut).toLocaleTimeString() : '--'} </td>
                                    <td className="admin_mngStaff_td"> {item.totalShiftTime ? convertToHours(item.totalShiftTime) : '--'} </td> 
                                <td className="admin_mngStaff_td">
                                <span style={{ marginRight : '20px' }} onClick={() => editAttendance(item._id, item.logIn)}><img width="16px" height="16px" alt="img" src={edit} style={{ cursor: 'pointer' }} /></span>
                                </td> 
                                <td className="admin_mngStaff_td">
                        {item.verified ? 
                     <span>
                     <img width="24px" height="24px" alt="img" src={checkMark} style={{ cursor: 'pointer' }} />
                     </span> :    
                            <span onClick={() => verifyAttendance(item._id)}>
                                    <img width="20px" height="20px" alt="img" src={verify} style={{ cursor: 'pointer' }} />
                                    </span>
                            }    </td> 
                                
                            </tr>
                            <tr style={{ height: 24 }}></tr>
                        </React.Fragment>
                    })
                }
            </tbody>
        </table> : null }
        <Pending display={showPending} title="Verifying Attendance"/>
        {/* <Confirm display={this.state.showConfirm} title={'Delete "' + this.state.confirmTitle + '"'}
            content={'Are you sure you want to delete "' + this.state.confirmTitle + '"'} agreeFn={this.deleteOneRow}
            disagreeFn={() => this.setState({ showConfirm: 'none' })} /> */}
    </div>

    {!staffList.length ? <p className="text-center mt-5">No Result found</p> : null}

    {/* {!this.state.adminsList.length ? null : <Pagination curPage={this.state.curPage} totalPage={this.state.totalPage} setCurPage={this.setCurPage} />} */}
{/* {!jobList ? ( <p className="text-center mt-3">No record found</p>) : ("")} */}

</div>
</div> 
// : <ManageAdminAddEdit />
}

</> 
}
    </div>
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
                                {/* <ErrorState show={this.state.error.fname} name="First Name is required." />                                 */}
                            {/* </div> */}
                            {/* <div className="col-md-6" style={{padding: 0}}> */}
                                {/* <div className="row m-0 rate_reviw_card_comment mt-3">
                        <div className="ssu2_modal1_text2 mb-2" style ={{textAlign : 'left' }}>Clock-Out :- </div>  
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
      
    </LocalizationProvider>
                                </div> */}
                                {/* <ErrorState show={this.state.error.lname} name="Last Name is required." /> */}
                            {/* </div> */}
                        </div>
                        {/* <div className="ssu2_modal1_input">
                            <div className="ssu2_modal1_input ssu2_modal3_selectBox">
                                
                                <textarea className="ssu2_modal3_select" placeholder="Comments"
                                />
                            </div>
                            <ErrorState show={this.state.error.email} name={this.state.emailErr} />
                        </div> */}

                        {/* <div className="row m-0 rate_reviw_card_comment mt-3" >
                          
                           </div> */}
                       
                       
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
    {/* <div id="modal4" className="w3-modal" style={{display: showAttendanceModal}}>
                <div className="w3-modal-content ssu2_modal1">
                    <div className="w3-container">
                        <div className="ssu2_modal1_text1">
                            Update Attendance
                        </div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                       
                        
                        <div className="row m-0 rate_reviw_card_comment mt-3">
                           <textarea placeholder='Write Your Comments' 
                        
                           />
                           </div>
                    
                       
                        
                        <div className="row ssu_bottom">
                            <button className="ssu2_modal1_button1" 
                            onClick={saveAttendance}
                            >
                                 
                            SAVE </button>
                            <button className="ssu2_modal1_button2" onClick={ closeModal}> CANCEL </button>
                        </div>
                    </div>
                </div>
            </div> */}
</div>
  )
}

export default AttendanceStaffList