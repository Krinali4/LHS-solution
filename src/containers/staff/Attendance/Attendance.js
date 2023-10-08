import React, {useState, useEffect} from 'react'
import Header from '../../../components/theme_2/components/header'
import NewNavigation from '../../../components/theme_2/components/newNavigation'
import place from "../../../components/assets/images/place.svg";
import edit from "../../../components/assets/images/edit_note.svg";
import starIcon from "../../../components/assets/images/star_icon.svg";
import Loader from '../../../components/modals/Loader';
import Confirm from '../../../components/modals/confirm';
import { Link, useHistory } from 'react-router-dom';
import { callApi, removeSession } from "./../../../action";
import AttendanceDetail from './AttendanceDetail';
import moment from 'moment'
import Pagination from '../../../components/theme_2/admin/pagination';

const Attendance = () => {

  const [jobList, setJobList] = useState()
  const [showLoader, setShowLoader] = useState(false)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [loggedin, setLoggedIn] = useState('')
  const [loggedOut, setLoggedOut] = useState('')
  const [curPage, setcurPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [skip, setSkip] = useState(0)

  const history = useHistory()
  useEffect( async() => {
    setShowLoader(true)
    var token = localStorage.getItem("accessToken");
   const data = await callApi("GET", `v1/LHS/staff/getJobsInProgress?skip=${skip}`, `Bearer ${token}`);
   if(data.data) {
    let Count = data.data.count
    let page = Math.ceil(Count / 10);
    setTotalPage(page)
    setJobList(data.data.data)
    setShowLoader(false)
   }
   else if ( data.status == 404) {
    setShowLoader(false)
    console.log('yessserrororor');
   }
  
  

  }, [skip] )

  var token = "Bearer " + localStorage.getItem('token');
 
  const login = async(appId, jobId, staff, hospital, index) => {
    console.log(index);
    setLoggedIn(appId)
    // var res = await callApi("POST", `v1/LHS/attendance/signin?jobId=62b00ebd278da789abf744f7&AppId=62b00f17278da789abf746b5`, token, data);
 }
 const logout = (appId) => {
    setLoggedOut(appId)
    console.log(latitude, longitude, 'for logout');
    console.log(loggedin, 'in logout loggedin');
    removeSession();
 }
 const changeRoute = (item) => {

    var jobProgress = JSON.stringify(item)
    window.localStorage.setItem("JobProgress", jobProgress)
history.push('/main/staff/attendance-detail')
 }

 const setCurPage = async(num) => {
    const value = (num * 10) - 10;
    await setcurPage(num)
    await setSkip(value)
 }
  return (
    <div className="theme2">
    <NewNavigation/>
    <div className="theme2_container">
        <Header page="Attendance" />
        <div className="theme2_main_container">            
     {showLoader ? <Loader /> :    <>

{ <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
{/* <p> <Link to={'/main/admin/manageStaff'} style={{ textDecoration: 'none' }}> <span onClick={logout} style={{ color: '#009CDE', fontSize: 16, cursor: 'pointer' }}>{'<'} Manage Staff </span> &nbsp; / &nbsp; {"name"} </Link></p> */}

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
    {jobList && jobList.length &&     <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
                <thead>
                    <tr className="nurseHead">
                        <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}> Job Title </th>
                        <th className="t2_sp_licence_th"> Hospital Name </th>
                        <th className="t2_sp_licence_th"> Location </th>
                        <th className="t2_sp_licence_th"> Contract Length </th>
                        <th className="t2_sp_licence_th"> Status </th>
                        {/* <th className="t2_sp_licence_th"> Clock-in/Clock-out </th> */}
                        {<th className="t2_sp_licence_th" style={{ width: '80px' }}> Action </th> }
                    </tr>
                </thead>



                <tbody>
                    <tr style={{ height: 20 }} />



                    {
                     jobList &&   jobList.map((item, index) => {
                            
                          return   <React.Fragment key={item._id}>
                                <tr className="admin_mngStaff_row">
                                    <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> <span style={{ display : 'flex' }}>{item.job.jobTitle}</span>  </td>
                                    <td className="admin_mngStaff_td">{(item.job &&item.job.hospital &&  item.job.hospital.healthCareInstitution) && item.job.hospital.healthCareInstitution.name} </td>
                                    <td className="admin_mngStaff_td"> <span style={{ marginRight: 8 }}>
                            <img
                                alt="place"
                                width="13px"
                                height="16px"
                                src={place}
                            />
                        </span>{" "} {item.job && item.job.healthCareLocation} </td>
                                    <td className="admin_mngStaff_td">
                                    {/* <span key={"i"} className="w3-tag w3-blue w3-round ms-2"> {"v"} </span> */}
                                        {`${item.totalDays} Days` } </td>

                                    <td className="admin_mngStaff_td">{item.status} </td>
                                    
                                    <td className="admin_mngStaff_td">

                                <button className="w-75 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" 
                                        style={{background : moment(item.startDate).utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 }) > moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 }) && 'grey' }} 
                                        onClick={ () => changeRoute(item)}
                                        disabled={ moment(item.startDate).utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 }) > moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 }) }
                                        // onClick={() => this.changeAdminStatus(item.isDeleted, item._id)}
                                        >
                                            {console.log(moment(item.startDate).utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 }) > moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 }) ? 'Upcoming' : 'View', 'button status')}
                                            {console.log(new Date(item.startDate).toLocaleString() , 'today date status')}
                                            {console.log(new Date(item.startDate).toLocaleString() > new Date().toLocaleString() , 'today date status')}
                                            
                                            {/* {item.isDeleted ? "Enable" : "Disable"} */}
                                        {/* {this.state.showLoader === item._id ? <Loader /> : item.isDeleted ? "Enable" : "Disable" } */}
                                {moment(item.startDate).utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 }) > moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0 }) ? 'Upcoming' : 'View'} </button>
                                            {/* <button className="w-75 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" 
                                        style={{background :"grey"}} >
                                            </button> */}
                                    </td> 
                                     {/* <td className="admin_mngStaff_td">
                                        <Link to={{
                                            pathname: '/main/staff/attendance-detail',
                                        }} style={{ marginRight: '20px' }}><img width="16px" height="16px" alt="img" src={edit} style={{ cursor: 'pointer' }} /></Link>
                                      </td>  */}
                                    

                                </tr>
                                <tr style={{ height: 24 }}></tr>
                            </React.Fragment>
                        })
                    }
                </tbody>
            </table>}
            {/* <Confirm display={this.state.showConfirm} title={'Delete "' + this.state.confirmTitle + '"'}
                content={'Are you sure you want to delete "' + this.state.confirmTitle + '"'} agreeFn={this.deleteOneRow}
                disagreeFn={() => this.setState({ showConfirm: 'none' })} /> */}
        </div>

        {/* {!this.state.adminsList.length ? <p className="text-center mt-5">No search found</p> : null} */}

        {/* {!this.state.adminsList.length ? null : <Pagination curPage={this.state.curPage} totalPage={this.state.totalPage} setCurPage={this.setCurPage} />} */}
{!jobList ? ( <p className="text-center mt-3">No record found</p>) : ("")}

{jobList && jobList.length ?  <Pagination curPage={curPage} totalPage={totalPage} setCurPage={setCurPage} /> : ""}

    </div>
</div> 
// : <ManageAdminAddEdit />
}

</> }
        </div>
    </div>
</div>
  )
}

export default Attendance