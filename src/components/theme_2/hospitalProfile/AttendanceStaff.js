import React, {useState, useEffect} from 'react'
import Loader from '../../modals/Loader'
import Header from '../components/header'
import place from '../../assets/images/place.svg'
import { callApi } from '../../../action'
import { Link,useHistory } from 'react-router-dom'

const AttendanceStaff = (props) => {
    const [showLoader, setShowLoader] = useState(false)
    const [staffList, setStaffList] = useState([])
    const [jobId, setJobId] = useState('')
    const history = useHistory()

    useEffect( ()=> {
        setShowLoader(true)
        var getId = window.localStorage.getItem('hospitalJobId')
        setJobId(getId ? getId : '')
        const fetchStaff = async() => {
            var token = localStorage.getItem("accessToken");
            const res = await callApi("GET", `v1/LHS/attendance/jobs/list?job=${jobId}`, `Bearer ${token}`);
           if(res.data){
        setShowLoader(false)
        setStaffList(res.data)
           }else{
            setShowLoader(false)
            setStaffList([])
           }
        }
        if(jobId) {
        fetchStaff();  
        }
    }, [jobId] )

    const goBack = () => {
        history.push('/main/hospital/attendance')
    }

    const viewStaff = (jobId, staffId) => {
console.log(jobId, 'job  idddsss for attendance');
console.log(staffId, 'staff idddsss for attendance');
window.localStorage.setItem("jobID", jobId)
window.localStorage.setItem("staffID", staffId)
history.push('/main/hospital/attendance-staff-list')
    }
  return (
    <div >
    <Header page="Attendance" />
    <div className="theme2_main_container">            
 {showLoader ? <Loader /> :   
  <>

{ <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
<p><span onClick={goBack} style={{ color: '#009CDE', fontSize: 16, cursor: 'pointer' }}>{'<'} Job List </span></p>

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
 <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
            <thead>
                <tr className="nurseHead">
                    <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}> Staff Name </th>
                    {/* <th className="t2_sp_licence_th"> Shift Duration </th> */}
                    <th className="t2_sp_licence_th"> Status </th>
                    <th className="t2_sp_licence_th"> Days Worked </th>
                    {/* <th className="t2_sp_licence_th"> Clock-in/Clock-out </th> */}
                    {<th className="t2_sp_licence_th" style={{ width: '80px' }}> Attendance Data </th> }
                </tr>
            </thead>



            <tbody>
                <tr style={{ height: 20 }} />



                {
                 staffList &&   staffList.map((item, index) => {
                        
                      return  <React.Fragment key={item._id}>
                            <tr className="admin_mngStaff_row">
                                <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> <span style={{ display : 'flex' }}>{item.staffName}</span>  </td>
                                 {/* <td className="admin_mngStaff_td"> {item.job && `${item.job.shiftStartTime} - ${item.job.shiftEndTime}`} </td>  */}
                                 <td className="admin_mngStaff_td"> {item.status} </td> 
                                <td className="admin_mngStaff_td">
                                {/* <span key={"i"} className="w3-tag w3-blue w3-round ms-2"> {"v"} </span> */}
                                    {item.daysWorked} </td>
                                
                                <td className="admin_mngStaff_td">

                            <button className="w-75 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" 
                                    onClick={() => viewStaff(item.job._id, item.staff._id)}>{'View'}</button>
                                </td> 
                                
                            </tr>
                            <tr style={{ height: 24 }}></tr>
                        </React.Fragment>
                    })
                }
            </tbody>
        </table>
        {/* <Confirm display={this.state.showConfirm} title={'Delete "' + this.state.confirmTitle + '"'}
            content={'Are you sure you want to delete "' + this.state.confirmTitle + '"'} agreeFn={this.deleteOneRow}
            disagreeFn={() => this.setState({ showConfirm: 'none' })} /> */}
    </div>

    {/* {!this.state.adminsList.length ? <p className="text-center mt-5">No search found</p> : null} */}

    {/* {!this.state.adminsList.length ? null : <Pagination curPage={this.state.curPage} totalPage={this.state.totalPage} setCurPage={this.setCurPage} />} */}
{/* {!jobList ? ( <p className="text-center mt-3">No record found</p>) : ("")} */}

</div>
</div> 
// : <ManageAdminAddEdit />
}

</> 
}
    </div>
</div>
  )
}

export default AttendanceStaff