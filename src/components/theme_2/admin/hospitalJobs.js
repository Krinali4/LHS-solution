import React, {useState, useEffect, useLayoutEffect} from 'react'
import { connect } from 'react-redux';
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
import { Link, useHistory } from 'react-router-dom';
import Loader from '../../modals/Loader';

const HospitalJobs = (props) => {
    

    const [hospitals, setHospitals] = useState([])
    const [curPage, setcurPage] = useState(1)
    const [total, setTotal] = useState(10)
    const [totalPage, setTotalPage] = useState(0)
    const [type, setType] = useState('')
    const [selectedId, setSelectedId] = useState('')
    const [search, setSearch] = useState('')
    const [skip, setSkip] = useState(0)
    const [sortByName, setSortByName] = useState(1)
    const [showLoader, setShowLoader] = useState('')
    const [showMainLoader, setShowMainLoader] = useState(false)
    const [hospitalJobId, setHospitalJobId] = useState('')

    const history = useHistory()

    // useLayoutEffect( () => {
    //     var jobId = window.localStorage.getItem('hospitalJobId')
    //     setHospitalJobId(jobId ? jobId : '')
    // },[] )

    useEffect(() => {
        var jobId = window.localStorage.getItem('hospitalJobId')
        setHospitalJobId(jobId ? jobId : '')
        // props.setCurPos('manageAttendance');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const getType = localStorage.getItem('type')
        setType(getType)
        const  getStaffByQuery = async () => {
            setShowMainLoader(true)
            var token = localStorage.getItem('token');
            token = "Bearer " + token;
            var res = await callApi('GET', `v1/LHS/attendance/jobs/listall?_id=${hospitalJobId}&search=${search}&skip=${skip}`, token);
    console.log(res.status, 'jobisttttttttttt statussssss');
    console.log(res.count, 'jobisttttttttttt');
            if (res.status === 200) {
                if (type === 'superAdmin') {
                    setSession(res.token, res.data._id, 'superAdmin');
                    setShowMainLoader(false)
                }
                else {
                    setSession(res.token, res.data._id, 'admin');
                    setShowMainLoader(false)
                }
                var totalCount = res.data.count
                var page = Math.ceil(totalCount / 10);
                setTotalPage(page)
                setHospitals(res.data.result)
                setShowLoader('')
                setShowMainLoader(false)
            }
            else if (res.status === 404) {
                console.log(true,"sss")
                setHospitals([])
                setShowMainLoader(false)
            }
            else {
                setHospitals([])
                setShowMainLoader(false)
            }
        }
        if(hospitalJobId){
            getStaffByQuery();
        }

    }, [hospitalJobId, search, skip] )


 const  setCurPage = async (num) => {
        const value = (num * 10) - 10;
        // await this.setState({ curPage: num, skip: value });
        await setcurPage(num)
        await setSkip(value)
        // getStaffByQuery(skip);
    }

 const setSortName = () => {
        // this.setState({ sortByName: (-1) * this.state.sortByName }, this.getStaffByQuery);
        setSortByName((-1) * sortByName)
        // getStaffByQuery()
    }


 const editOneRow = async (id) => {
    window.localStorage.setItem('adminHospitalJobId', id)
        // var token = localStorage.getItem('token');
        // token = "Bearer " + token;
        // var res = await callApi("GET", "v1/LHS/hospital/getById/" + _id, token);
        // console.log(hospitalId, 'for hospitalllllll idddddd');
        // console.log(res.data);
        // this.props.setHospitalProfile(res.data);
        // let hospitalId =  localStorage.setItem('hospitalId', _id)
        // history.push('/main/admin/manageHospitalEdit');
    }




  const  searchList = async (e) => {
        // await this.setState({
        //     search: e.target.value,
        //     curPage: 1,
        // })
        await setSearch(e.target.value)
        await setCurPage(1)
        // await getStaffByQuery();
    }

  const  toManageStaff = () => {
        history.push("/main/admin/manageAttendance");
    }

    


  return (
    <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
                <p> <Link to={"/main/admin/manageAttendance"} style={{ textDecoration: 'none' }}> <span onClick={toManageStaff} style={{ color: '#009CDE', fontSize: 16, cursor: 'pointer' }}>{'<'} Hospital List </span> </Link></p>
                <div className="t2_sp_work" style={{ marginTop: 0 }}>
                    <div className="row">
                        <div style={{width : '100%'}} className="admin_mngAdmin_nameFilter">
                            
                            <span style={{ marginLeft: 20 }}>
                                <img style={{ width: 14, marginTop: -3 }} alt="search.svg" src={searchImg} />
                                <input className="admin_mngAdmin_nameFilter_input" placeholder="Search by hospital Job" type="text" value={search} onChange={searchList} />
                            </span>
                        </div>
                       
                    </div>
     {showMainLoader ? <Loader /> :                <div className="row hide_scrollbar" style={{ overflowX: 'auto', marginTop: '32px', display: hospitals.length ? "block" : "none" }}>
                        <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
                            <thead>
                                <tr className="nurseHead">
                                    <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}>Job Title </th>
                                    <th className="t2_sp_licence_th"> Location </th>
                                    <th className="t2_sp_licence_th"> Job Type </th>
                                    <th className="t2_sp_licence_th" style={{ width: '80px' }}> Action </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ height: 20 }} />
                                {
                                 hospitals &&   hospitals.map((item) => {

                                        return <React.Fragment key={item._id}>
                                            <tr className="admin_mngStaff_row">
                                                <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> {item.jobTitle} </td>
                                                <td className="admin_mngStaff_td"> {item.healthCareLocation} </td>
                                                <td className="admin_mngStaff_td"> {item.contractType}</td>

                                                

                                                <td className="admin_mngStaff_td">
                                                        <button className="w-75 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin">
                                                            <Link to={'/main/admin/hospital-staffList'} onClick={() => editOneRow(item._id)}>View</Link>
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
                    
                    { (!hospitals.length && !showMainLoader) ? <p className="text-center my-5">No record found</p> : null}

                    {hospitals.length ? <Pagination curPage={curPage} totalPage={totalPage} setCurPage={setCurPage} /> : null}
                </div>
            </div>
  )
}

export default HospitalJobs















