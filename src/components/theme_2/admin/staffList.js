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


const StaffList = (props) => {
    const[hospitalId, setHospitalId] = useState('')
    const[jobId, setJobId] = useState('')
    const[staffList, setStaffList] = useState([])
    const[showLoader, setShowLoader] = useState(false)

    const history = useHistory()

    useEffect(() => {
        setShowLoader(true)
        const fetchhospitalId = window.localStorage.getItem('hospitalJobId')
        const fetchJobId = window.localStorage.getItem('adminHospitalJobId')
        setHospitalId(fetchhospitalId ? fetchhospitalId : '')
        setJobId(fetchJobId ? fetchJobId : '')
        console.log(hospitalId, jobId);
        // props.setCurPos('manageAttendance');
        const fetchStaff = async() => {
            var token = localStorage.getItem("accessToken");
            const res = await callApi("GET", `v1/LHS/attendance/jobs/list?job=${jobId}&hospital_id=${hospitalId}`, `Bearer ${token}`);
           if(res.data){
        setShowLoader(false)
        setStaffList(res.data)
           }else{
            setShowLoader(false)
            setStaffList([])
           }
        }
        if(jobId && hospitalId) {
        fetchStaff();  
        }
    },[hospitalId, jobId])

    const toHospitalJobs = () => {
    history.push("/main/admin/hospitalJob")
    }

    const editOneRow = (id) => {
window.localStorage.setItem('adminStaffId', id)
    }
  return (
    <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
    <p> <Link to={"/main/admin/hospitalJob"} style={{ textDecoration: 'none' }}> <span onClick={toHospitalJobs} style={{ color: '#009CDE', fontSize: 16, cursor: 'pointer' }}>{'<'} Hospital Job </span> </Link></p>
    <div className="t2_sp_work" style={{ marginTop: 0 }}>
        
{showLoader ? <Loader /> :                <div className="row hide_scrollbar" style={{ overflowX: 'auto', marginTop: '32px', display: staffList.length ? "block" : "none" }}>
            <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
                <thead>
                    <tr className="nurseHead">
                        <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}>Staff Name </th>
                        <th className="t2_sp_licence_th"> Status </th>
                        <th className="t2_sp_licence_th"> Days Worked </th>
                        <th className="t2_sp_licence_th" style={{ width: '80px' }}> Action </th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ height: 20 }} />
                    {
                     staffList &&   staffList.map((item) => {

                            return <React.Fragment key={item._id}>
                                <tr className="admin_mngStaff_row">
                                    <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> {item.staffName} </td>
                                    <td className="admin_mngStaff_td"> {item.status} </td>
                                    <td className="admin_mngStaff_td"> {item.job.contractType == 'Permanent Position' ? 'NA' :  item.daysWorked}</td>
                                    <td className="admin_mngStaff_td">
                                            <button className="w-75 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin">
                                                <Link to={'/main/admin/hospital-staffAttendance'} onClick={() => editOneRow(item.staff._id)}>View</Link>
                                            </button>
                                    
                                    </td>
                                </tr>
                                <tr style={{ height: 24 }}></tr>
                            </React.Fragment>
                        })
                    }
                </tbody>
            </table>
        </div>}
        
        { (!staffList.length && !showLoader) ? <p className="text-center my-5">No record found</p> : null}

        {/* {hospitals.length ? <Pagination curPage={curPage} totalPage={totalPage} setCurPage={setCurPage} /> : null} */}
    </div>
</div>
  )
}

export default StaffList
