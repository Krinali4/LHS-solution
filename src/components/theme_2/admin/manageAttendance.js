import React from 'react';
import { connect } from 'react-redux';
import Confirm from '../../modals/confirm';
import filter from '../../assets/images/filter.svg';
import downarrow from '../../assets/images/downarrow.svg';
import uparrow from '../../assets/images/uparrow.png';
import search from '../../assets/images/search.svg';
import Pagination from './pagination';
import edit from '../../assets/images/edit_note.svg';
import del from '../../assets/images/delete.svg';
import { SET_HP_PROFILE, SET_AUTH } from '../../../constants/actionTypes';
import { callApi, setSession } from '../../../action';
import { history } from '../../../store';
import { Link } from 'react-router-dom';
import Loader from '../../modals/Loader';
import { useDispatch, useSelector} from "react-redux"


const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => ({
    setAuth: (data) => dispatch({ type: SET_AUTH, data }),
    setHospitalProfile: (data) => dispatch({ type: SET_HP_PROFILE, data }),
});

class ManageAttendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hospitals: [],
            name: '',
            email: '',
            sortByName: 1,
            curPage: 1,
            total: 10,
            totalPage: 0,
            showConfirm: 'none',
            confirmTitle: '',
            selectedId: '',
            setType: '',
            adminDetails: {},
            search: "",
            skip: 0,
            showLoader: '',
            showMainLoader: false
        }
    }

    componentWillReceiveProps = (newProps) => {
        this.initState(newProps);
    }

    initState = (props) => {
    }

    componentDidMount = () => {
        // this.props.setCurPos('manageAttendance');
        this.getStaffByQuery();
        // this.props.setAuth({
        //     type: this.props.auth.type,
        //     name: this.props.auth.name,
        //     title: 'Manage Attendance'
        // });
        this.initState(this.props);
        let adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
        this.setState({
            adminDetails: adminDetails,
            showMainLoader : true
        })
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const type = localStorage.getItem('type')
        console.log(type);
        this.setState({ setType: type })
        window.localStorage.setItem('hospitalJobId', '')
    }

    setCurPage = async (num) => {
        const value = (num * 10) - 10;
        await this.setState({ curPage: num, skip: value });
        this.getStaffByQuery(this.state.skip);
    }

    setSortByName = () => {
        this.setState({ sortByName: (-1) * this.state.sortByName }, this.getStaffByQuery);
    }

    getStaffByQuery = async (skip = 0) => {
        var data = {
            name: this.state.name,
            email: this.state.email,
            sortByName: this.state.sortByName,
            curPage: this.state.curPage
        }
        var token = localStorage.getItem('token');
        token = "Bearer " + token;
        var res = await callApi('GET', `v1/LHS/admin/hospitalList?search=${this.state.search}&skip=${skip}`, token, data);
        if (res.data) {
            if (this.state.setType === 'superAdmin') {
                setSession(res.token, res.data._id, 'superAdmin');
                this.setState({ showMainLoader : false })
            }
            else {
                setSession(res.token, res.data._id, 'admin');
                this.setState({ showMainLoader : false })
            }
            var totalCount = res.data.count
            var page = Math.ceil(totalCount / 10);
            this.setState({ hospitals: [...res.data.data], totalPage: page, showLoader : '' });
        }
        else {
            console.log(true,"sss")
            this.setState({ hospitals: [], showMainLoader : false })
        }
    }

    editOneRow = async (_id) => {
        // var token = localStorage.getItem('token');
        // token = "Bearer " + token;
        // var res = await callApi("GET", "v1/LHS/hospital/getById/" + _id, token);
        // console.log(hospitalId, 'for hospitalllllll idddddd');
        // console.log(res.data);
        // this.props.setHospitalProfile(res.data);
         window.localStorage.setItem('hospitalJobId', _id)
        history.push("/main/admin/hospitalJob");
    }

  

    search = async (e) => {
        await this.setState({
            search: e.target.value,
            curPage: 1,
        })
        await this.getStaffByQuery();
    }

    render() {
        return (
            <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
                <div className="t2_sp_work" style={{ marginTop: 0 }}>
                    <div className="row">
                        <div style={{width : '100%'}} className="admin_mngAdmin_nameFilter">
                            {/* <span className="admin_mngAdmin_nameFilter_span1">
                                Name <img src={this.state.sortByName === 1 ? downarrow : uparrow} width="8px" style={{ float: 'right', marginRight: '20px', marginTop: '8px' }} alt="downArrow.svg" onClick={this.setSortByName} />
                            </span> */}
                            <span style={{ marginLeft: 20 }}>
                                <img style={{ width: 14, marginTop: -3 }} alt="search.svg" src={search} />
                                <input className="admin_mngAdmin_nameFilter_input" placeholder="Search by hospital name" type="text" value={this.state.search} onChange={this.search} />
                            </span>
                        </div>
                        {/* <button className="admin_mngAdmin_roleFilter">
                            <span style={{ float: 'left', marginLeft: 10 }}>Sorting</span>
                            <span style={{ float: 'right', width: '8px', marginTop: -2 }}><img src={downarrow} width="100%" /></span>
                        </button>
                        <button className="admin_mngAdmin_roleFilter admin_mngStaff_filter">
                            <span style={{ width: 13, float: 'left', marginTop: -2 }}><img src={filter} width="100%" /></span>
                            <span style={{ float: 'left', marginLeft: 10 }}>Filter</span>
                            <span style={{ float: 'right', width: '8px', marginTop: -2 }}><img src={downarrow} width="100%" /></span>
                        </button> */}
                    </div>
     {this.state.showMainLoader ? <Loader /> :                <div className="row hide_scrollbar" style={{ overflowX: 'auto', marginTop: '32px', display: this.state.hospitals.length ? "block" : "none" }}>
                        <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
                            <thead>
                                <tr className="nurseHead">
                                    <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}>Hospital Name </th>
                                    <th className="t2_sp_licence_th"> Location </th>
                                    {/* <th className="t2_sp_licence_th"> Open Positions </th> */}
                                    <th className="t2_sp_licence_th" style={{ width: '80px' }}> Action </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ height: 20 }} />
                                {
                                    this.state.hospitals.map((item) => {

                                        return <React.Fragment key={item._id}>
                                            <tr className="admin_mngStaff_row">
                                                <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> {item.healthCareInstitution && item.healthCareInstitution.name ? item.healthCareInstitution.name : ''} </td>
                                                <td className="admin_mngStaff_td"> {item.corporateAddress.length ? item.corporateAddress[0].city : '--'} </td>
                                                {/* <td className="admin_mngStaff_td"><span className="w3-tag w3-blue w3-round"> {item.openPositions} </span></td> */}
                                                <td className="admin_mngStaff_td">
                                                        <button className="w-75 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin">
                                                            <Link to={"/main/admin/hospitalJob"} onClick={() => this.editOneRow(item._id)}>View</Link>
                                                        </button>
                                                
                                                    {/* <span onClick={()=>this.confirmDelete(item._id, item.email)}><img width="16px" height="16px" alt="img"src={del} style={{cursor: 'pointer'}}/></span>  */}
                                                </td>
                                            </tr>
                                            <tr style={{ height: 24 }}></tr>
                                        </React.Fragment>
                                    })
                                }
                            </tbody>
                        </table>
                        <Confirm display={this.state.showConfirm} title={'Delete "' + this.state.confirmTitle + '"'}
                            content={'Are you sure you want to delete "' + this.state.confirmTitle + '"'} agreeFn={this.deleteOneRow}
                            disagreeFn={() => this.setState({ showConfirm: 'none' })} />
                    </div>}
                    
                    { (!this.state.hospitals.length && !this.state.showMainLoader) ? <p className="text-center my-5">No record found</p> : null}

                    {this.state.hospitals.length ? <Pagination curPage={this.state.curPage} totalPage={this.state.totalPage} setCurPage={this.setCurPage} /> : null}
                </div>
            </div>
        );
    }
}

export default ManageAttendance;
