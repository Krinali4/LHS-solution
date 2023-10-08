import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../../components/modals/Loader'
import Header from '../../../components/theme_2/components/header'
import NewNavigation from '../../../components/theme_2/components/newNavigation'
import edit from "../../../components/assets/images/edit_note.svg";
import moment from 'moment'
import { Button, Modal } from 'react-bootstrap'
import ErrorState from '../../../components/theme_1/staffSignUp/components/errorState'
import { callApi, removeSession } from '../../../action'

const AttendanceDetail = ({id}) => {
  const [showLoader, setShowLoader] = useState(false)
  const [showModalLoader, setShowModalLoader] = useState(false)
  const [showView, setShowView] = useState("none")
  const [disputeData, setDisputeData] = useState('')
  const [disputeId, setDisputeId] = useState('')
  const [jobId, setJobId] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [attendanceList, setAttendanceList]= useState()
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [appId, setAppId] = useState('')
  const [staffId, setStaffId] = useState('')
  const [hospitalId, setHospitalId] = useState('')
  const [attendanceId, setAttendanceId] = useState()
  const [time, setTime] = useState(new Date())
  const[loggedIn, setLoggedIn] = useState()
  const [buttonLoader, setButtonLoader] = useState(false)
  const [loginStatus, setLoginStatus] = useState("")
  const [disputeError, setDisputeError] = useState('none')
  const [showDisable, setShowDisable] = useState(false)
  const [jobStatus, setJobStatus] = useState(false)

  useEffect( () => {
    setShowLoader(true)
    var fetchJob = JSON.parse(window.localStorage.getItem("JobProgress"))
    // let attID = JSON.parse(window.localStorage.getItem('attdId'))
    // if(attID) {
    //     setAttendanceId(attID)
    // }
    if(loginStatus === "true") {
        setLoggedIn(true)
        console.log('yesssssss loggggg');
    }
    setJobId(fetchJob.job ? fetchJob.job._id : '')
    setJobTitle(fetchJob.job ? fetchJob.job.jobTitle : '')
    setStaffId(fetchJob ? fetchJob.staff : '')
    setHospitalId(fetchJob ? fetchJob.hospital : '')
    setAppId(fetchJob ? fetchJob._id : '')
    var token = "Bearer " + localStorage.getItem('token');
    const listData = async() => {
        const res = await callApi("GET",`v1/LHS/attendance/list?jobId=${jobId}`,token);
        if(res.status === 200) {
            console.log(res.data, 'attendance data');
            setAttendanceList(res.data)
            setShowLoader(false)
            // let lastElement = res.data[res.data.length - 1]
            let lastElement = res.data[0]
            console.log(lastElement.application.status, 'today attendance dataaaaa');
            if(lastElement.application.status == 'Completed'){
                setJobStatus(true)
            }
            // new Date(lastElement.logIn).toLocaleDateString() === new Date().toLocaleDateString() && !lastElement.logOut
            if(!lastElement.isLoggedIn && new Date(lastElement.createdAt).toLocaleDateString() === new Date().toLocaleDateString()){
                setShowDisable(true)
                }
            if(lastElement.isLoggedIn){
                setAttendanceId(lastElement._id)
            }
            else{
                setAttendanceId('')
            }
          
        }
        else if (res.status === 404) {
            setAttendanceList([])
            setShowLoader(false)
            setAttendanceId('')
        }
        else {
            setAttendanceList([])
            setShowLoader(false)
            setAttendanceId('')  
        }
    }

    // const attendanceStatus = async() => {
    //     const res = await callApi("GET",`v1/LHS/attendance/get?AttId=${jobId}`,token);
    //     if(res.status === 200) {
    //         console.log(res.data, 'attendance data');
    //         setLoggedIn(true)
           
    //     }
    //     else if (res.status === 406) {
    //        console.log('406 errorrrrr')
    //        setLoggedIn(false)
    //     }
    //     else{
    //         console.log('person is not logged innnnn');
    //         setLoggedIn(false)
    //     }
    // }
    if(jobId){
        listData()
        // attendanceStatus()
    }
    const getCoordinates = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
          } else {
            alert("Geolocation is not supported by this browser.");
          }
      }
      getCoordinates()
  },[jobId, attendanceId] )

// const currentTime = () => {
//     setTime(new Date())
// }
// setInterval( () => currentTime(), 1000 )

  var token = "Bearer " + localStorage.getItem('token');

  const showPosition = (position) => {
    console.log(position.coords.latitude);
    var data = {
        latitude : position.coords.latitude,
        longitude : position.coords.longitude
    }
    console.log(data, 'without state');
    setLatitude(position.coords.latitude)
    setLongitude(position.coords.longitude)
    console.log(longitude, latitude, 'after state set');
 }
 function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
     alert("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
     alert("Location information is unavailable.")
        break;
      case error.TIMEOUT:
     alert("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
     alert("An unknown error occurred.")
        break;
    }
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

  const handleLogin = async() => {
    setButtonLoader(true)
   let data = {
    staff : staffId,
    hospital : hospitalId,
    longitude: longitude ? longitude : 85.0872753,
    latitude : latitude ? latitude : 25.5777732
   }
   var res = await callApi("POST", `v1/LHS/attendance/signin?jobId=${jobId}&AppId=${appId}`, token, data);
   if(res.status === 200) {
    console.log(res.data._id,'atdnid');
    console.log(res);
    var loginStatus = window.localStorage.setItem("setLogin", "true")
    setLoginStatus(loginStatus)
    setLoggedIn(true)
    setAttendanceId(res.data._id)
    var attdID = JSON.stringify(res.data._id)
    window.localStorage.setItem("attdId", attdID)
    console.log(attendanceId);
    setButtonLoader(false)
   }
   else if (res.status === 403){
    console.log('no iddddd');
    console.log(res,'atdnid');
    alert('Already Logged In')
    setLoggedIn(true)
    setButtonLoader(false)
    // setAttendanceId(res.data._id)
    var loginStatus = window.localStorage.setItem("setLogin", "true")
    var attdID = JSON.stringify(res.data._id)
    window.localStorage.setItem("attdId", attdID)
    setLoginStatus(loginStatus)
    console.log(attendanceId);
   }
   else {
    console.log('idddd');
    setButtonLoader(false)
   }
 }

  const handleLogOut = async() => {
    setButtonLoader(true)
   var res = await callApi("POST", `v1/LHS/attendance/signout?AttId=${attendanceId}`, token);
   console.log(res.Message);
   if(res.status === 200) {
    console.log(res.data);
    setAttendanceId('')
    setButtonLoader(false)
    removeSession();
   }
  else if(res.status === 400){
    setAttendanceId('')
    setButtonLoader(false)
    alert('Already Logged out')
   }
console.log(attendanceId, 'in logoutttttttttt');

  }

const saveCert = async() => {
    if( disputeData === '') {
        setDisputeError('block')
    }
    
    else if(disputeData !== '') {
    setShowModalLoader(true)
    setDisputeError('none')
        var data = {
            comments: disputeData
        }
    var res = await callApi("PUT", `v1/LHS/attendance/dispute?AttId=${disputeId}`, token, data);
    if(res.status === 200){
        console.log(res.data);
        setShowModalLoader(false)
    setShowView('none')
    alert('Dispute raised successfully');
    }
    else if (res.status === 403){
        setShowModalLoader(false)
    setShowView('none')
    alert("Dispute already raised");
    }
    else {
        setShowModalLoader(false)
        setShowView('none')
    }
}
}
const closeModal = () => {
    setShowView('none')
    setDisputeError('none')
}

const convertToHours = (time) => {
     var  hours = Math.floor((time) / 60)
    var minutes = ((time) % 60)  
       return `${hours}h ${minutes}m `; 
}
  return (
    <div className="theme2">
    <NewNavigation />
    <div className="theme2_container">
        <Header page="Attendance-Detail" />
        <div className="theme2_main_container">            
     {showLoader ? <Loader /> :    <>

{ <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
<p> <Link to={'/main/staff/attendance'} style={{ textDecoration: 'none' }}> <span style={{ color: '#009CDE', fontSize: 16, cursor: 'pointer' }}>{'<'} Attendance  &nbsp; / &nbsp; {jobTitle} </span></Link></p>
 <div className="row t2_sp_avatar_container " style={{background : 'white' }}>
            
            <div className="col-md-10">
           
               
                <div className="row t2_sp_avtar_desc">
                <p className="col-12 t2_sp_avatar_txt1"> {'DATE TODAY -'} </p>
                <p className="col-12 t2_sp_avatar_txt1"> {moment().format("MM/DD/YYYY")} </p>
                </div>
                <div className=" row t2_sp_avtar_desc">
            <p className="col-12 t2_sp_avatar_txt1"> {'CURRENT TIME -'} </p>
            <p className="col-12 t2_sp_avatar_txt1"> {time.toLocaleTimeString()} </p>
                </div>
            </div>
       {jobStatus ? <div className="col-md-2" > <span  style={{fontSize : '24px', fontWeight : 'bold' }}> {"Contract Completed"}</span></div> :      <div className="col-md-2">
        {attendanceId === '' &&        <button disabled={showDisable} style={{backgroundColor : showDisable && 'grey'}} className="mb-2 w-100 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" onClick={handleLogin} > {buttonLoader ? <Loader /> : "Clock-In"}  </button>}
        {attendanceId !== '' &&        <button className="mb-2 w-100 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" style={{ background : "#ff7675"}} onClick={handleLogOut} > {buttonLoader ? <Loader /> : "Clock-Out"} </button>}
                {/* <p className="col-12 t2_sp_avatar_txt2"> {'since last login'} </p> */}
            </div> }
            </div>
            
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
    {attendanceList && attendanceList.length ?  <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
                <thead>
                    <tr className="nurseHead">
                        <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}> Date </th>
                        <th className="t2_sp_licence_th"> Clock-In </th>
                        <th className="t2_sp_licence_th"> Clock-Out </th>
                        <th className="t2_sp_licence_th"> Duration </th>
                        <th className="t2_sp_licence_th"> Payment Status </th>
                        {/* <th className="t2_sp_licence_th"> Clock-In/Clock-Out </th> */}
                        {<th className="t2_sp_licence_th" style={{ width: '80px' }}> Action </th> }
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ height: 20 }} />
                    {
                     attendanceList &&   attendanceList.map((item, index) => {
                            
                          return   <React.Fragment key={item._id}>
                          
                            
                                <tr className="admin_mngStaff_row">
                                    <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> <span style={{ display : 'flex' }}>{moment(item.createdAt).format('MM/DD/YYYY')}</span>  </td>
                                    <td className="admin_mngStaff_td">{new Date(item.logIn).toLocaleTimeString()} </td>
                                    <td className="admin_mngStaff_td">{item.logOut ? new Date(item.logOut).toLocaleTimeString() : '--'} </td>
                                    <td className="admin_mngStaff_td"> {item.totalShiftTime ? convertToHours(item.totalShiftTime) : '--'}    </td> 
                                    <td className="admin_mngStaff_td" style={{ color:item.paid ? 'green' : 'red' }}> {item.paid ? 'Done' : 'Pending'}    </td> 
                                    {/* <td className="admin_mngStaff_td"> 
                                    <button className="w-50 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" 
                                        // style={{background :"cornflowerblue" }}
                                         > Clock-In </button>
                                       </td>  */}
                                     <td className="admin_mngStaff_td">
                                     <span onClick = { () =>{ setShowView("block"); setDisputeData("") ; setDisputeId(item._id); setDisputeError('none')} }><img width="16px" height="16px" alt="img" src={edit} style={{ cursor: 'pointer' }} /></span>   
                                        {/* <span onClick={() => this.deleteAdmins(item._id)}><img width="16px" height="16px" alt="img" src={del} style={{ cursor: 'pointer' }} /></span> */}
                                    </td> 
                                    </tr>
                                <tr style={{ height: 24 }}></tr>
                            </React.Fragment>
                        })
                    }
                </tbody>
            </table> : null}
            {/* <Confirm display={this.state.showConfirm} title={'Delete "' + this.state.confirmTitle + '"'}
                content={'Are you sure you want to delete "' + this.state.confirmTitle + '"'} agreeFn={this.deleteOneRow}
                disagreeFn={() => this.setState({ showConfirm: 'none' })} /> */}
        </div>

        {/* {!this.state.adminsList.length ? <p className="text-center mt-5">No search found</p> : null} */}

        {/* {!this.state.adminsList.length ? null : <Pagination curPage={this.state.curPage} totalPage={this.state.totalPage} setCurPage={this.setCurPage} />} */}
{attendanceList && !attendanceList.length ? ( <p className="text-center mt-3">No record found</p>) : ("")}

    </div>
</div> 
// : <ManageAdminAddEdit />
}

</> }
        </div>
    </div>
    <div id="modal4" className="w3-modal" style={{display: showView}}>
                <div className="w3-modal-content ssu2_modal1">
                    <div className="w3-container">
                        <div className="ssu2_modal1_text1">
                            Raise A Dispute
                        </div>
                        {/* <hr style={{margin: '30px 0px 0px'}}/> */}
                        
                        <div className="row m-0 rate_reviw_card_comment mt-3" style={{marginTop: '30px'}}>
                           <textarea placeholder='Write Your Comments' onChange={RaiseDispute} value={disputeData}/>
                           </div>
                        <ErrorState show={disputeError} name="Comments are required." />
                       
                        {/* <hr style={{margin: '10px 0px 0px'}}/> */}
                        <div className="row ssu_bottom">
                            <button className="ssu2_modal1_button1" 
                            onClick={saveCert}
                            > {showModalLoader ? <Loader /> : "SAVE"} </button>
                            <button className="ssu2_modal1_button2" onClick={ closeModal}> CANCEL </button>
                        </div>
                    </div>
                </div>
            </div>
</div>
  )
}

export default AttendanceDetail