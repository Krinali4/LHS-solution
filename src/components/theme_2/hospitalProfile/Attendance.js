import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import Loader from '../../modals/Loader'
import Header from '../components/header'
import place from '../../assets/images/place.svg'
import { callApi } from '../../../action'
import AttendanceStaff from './AttendanceStaff'

const Attendance = () => {
    const [showLoader, setShowLoader] = useState(false)
    const [jobList, setJobList] = useState([])
    const history = useHistory()

    useEffect( () => {
        window.localStorage.setItem("hospitalJobId", '');
  const fetchList = async() => {
    setShowLoader(true)
    var token = localStorage.getItem("accessToken");
    const res = await callApi("GET", 'v1/LHS/attendance/hospitalJobs', `Bearer ${token}`);
    console.log(res.data);
    if(res.data) {
    setShowLoader(false)
    setJobList(res.data)
    }else{
        setShowLoader(false)
    setJobList([])
    }
  }
  fetchList();
    }, [] )

    const viewStaff = (id) => {
        // const res = await callApi("GET", `v1/LHS/attendance/jobs/list?job=${id}`, `Bearer ${token}`);
        // console.log(res.data,'staff dataaaaa');
        // if(res.data) {
            window.localStorage.setItem("hospitalJobId", id);
            <AttendanceStaff id={id} />
            history.push('/main/hospital/attendance-staff')
        // }
    }
  return (
    <div >
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
{ jobList.length ?  <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
            <thead>
                <tr className="nurseHead">
                    <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}> Job Title </th>
                    <th className="t2_sp_licence_th"> Location </th>
                    <th className="t2_sp_licence_th"> Contract Length </th>
                    {/* <th className="t2_sp_licence_th"> Clock-in/Clock-out </th> */}
                    {<th className="t2_sp_licence_th" style={{ width: '80px' }}> Action </th> }
                </tr>
            </thead>



            <tbody>
                <tr style={{ height: 20 }} />



                {
                 jobList &&   jobList.filter(job => job.contractType === "Temporary Position").map((item, index) => {
                        
                      return  <React.Fragment key={item._id}>
                            <tr className="admin_mngStaff_row">
                                <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> <span style={{ display : 'flex' }}>{item.jobTitle}</span>  </td>
                                <td className="admin_mngStaff_td"> <span style={{ marginRight: 8 }}>
                        <img
                            alt="place"
                            width="13px"
                            height="16px"
                            src={place}
                        />
                    </span>{" "} {item.healthCareLocation} </td>
                                <td className="admin_mngStaff_td">
                                {/* <span key={"i"} className="w3-tag w3-blue w3-round ms-2"> {"v"} </span> */}
                                    {item.contractLength.duration} </td>
                                
                                <td className="admin_mngStaff_td">

                            <button className="w-75 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" 
                                    
                                    onClick={() => viewStaff(item._id)}
                                    >
                                        {/* {item.isDeleted ? "Enable" : "Disable"} */}
                                    {/* {this.state.showLoader === item._id ? <Loader /> : item.isDeleted ? "Enable" : "Disable" } */}
                                    View</button>
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
        </table> : ''}
        {/* <Confirm display={this.state.showConfirm} title={'Delete "' + this.state.confirmTitle + '"'}
            content={'Are you sure you want to delete "' + this.state.confirmTitle + '"'} agreeFn={this.deleteOneRow}
            disagreeFn={() => this.setState({ showConfirm: 'none' })} /> */}
    </div>

    {/* {!this.state.adminsList.length ? <p className="text-center mt-5">No search found</p> : null} */}

    {/* {!this.state.adminsList.length ? null : <Pagination curPage={this.state.curPage} totalPage={this.state.totalPage} setCurPage={this.setCurPage} />} */}
{!jobList.length ? ( <p className="text-center mt-3">No record found</p>) : ("")}

</div>
</div> 
// : <ManageAdminAddEdit />
}

</> }
    </div>
</div>
  )
}

export default Attendance