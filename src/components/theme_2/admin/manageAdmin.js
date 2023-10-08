import React from 'react';
import { connect } from 'react-redux';
import downarrow from '../../assets/images/downarrow.svg';
import Confirm from '../../modals/confirm';
import filter from '../../assets/images/filter.svg';
import uparrow from '../../assets/images/uparrow.png';
import search from '../../assets/images/search.svg';
import Pagination from './pagination';
import { SET_SP_PROFILE, SET_AUTH, SET_TEMP_FILE } from '../../../constants/actionTypes';
import { callApi, setSession } from '../../../action';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import edit from '../../assets/images/edit_note.svg';
import del from '../../assets/images/delete.svg';
import ManageAdminAddEdit from './manageAdminAddEdit';
import Loader from '../../modals/Loader';

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => ({
    setAuth: (data) => dispatch({ type: SET_AUTH, data }),
});

class ManageAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            today: '',
            date: '',
            filterDate: false,
            curPage: 1,
            totalPage: 1,
            adminsList: [],
            showAdminForm: false,
            isSuperAdmin: true,
            searchKey: "",
            skip: 0,
            showLoader: ''
        }
    }

    componentWillMount = async () => {
        // this.props.setCurPos('manageAdmin');
        // this.props.setAuth({
        //     type: this.props.auth.type,
        //     name: this.props.auth.name,
        //     title: 'Manage Administrator'
        // });
        // this.initState(this.props);
    }

    componentWillReceiveProps = (newProps) => {
        this.initState(newProps);
    }

    initState = (props) => {
    }

    componentDidMount = () => {
        let data = localStorage.getItem("type");
        if (data !== "superAdmin") {
            this.setState({
                isSuperAdmin: false
            })
        }
        this.getAllAdmins();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getAllAdmins = async (skip = 0) => {
        var token = localStorage.getItem("accessToken");
        token = "Bearer " + token;
        var res = await callApi("GET", `v1/LHS/admin/adminList?search=${this.state.searchKey}&skip=${skip}`, token);
        console.log(res.data, "res.datares.data")
        if (res.status === 200) {
            var totalCount = res.data.count
            var page = Math.ceil(totalCount / 10);
            this.setState({
                adminsList: res.data.data,
                totalPage: page,
                showLoader: ''
            })
        }
        else {
            this.setState({
                adminsList: []
            })
        }

    }

    selectDate = (date) => {
    }

    setCurPage = async (num) => {
        var skip = (num - 1) * 10;
        await this.setState({ curPage: num, skip: skip });
        this.getAllAdmins(this.state.skip);
    }

    deleteAdmins = async (id) => {
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("DELETE", `/admin/delete/${id}`, Authorization);
        if (res.status === 200) {
            this.getAllAdmins(this.state.skip);
            this.setState({
                curPage: 1,
                totalPage: 1
            })
        }
    }

    changeAdminStatus = async (status, id) => {
        this.setState({ showLoader : id })
        var token = localStorage.getItem("accessToken");
        token = "Bearer " + token;
        let userObj = {
            isDeleted: status ? false : true,
        }
        var res = await callApi("PUT", `v1/LHS/admin/update/${id}`, token, userObj);
        console.log(res);
        if (res.Message === "User Updated Successfully") {
            this.getAllAdmins(this.state.skip);
        }
    }

    getSearchReq = async (e) => {
        await this.setState({
            searchKey: e.target.value,
            curPage: 1
        })
        await this.getAllAdmins();
    }

    render() {
        return (
            <>

                {!this.state.showAdminForm ? <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
                    <div className="t2_sp_work" style={{ marginTop: 0 }}>
                        <div className="row m-0">
                            <div className="col-md-8 col-lg-8 col-12 p-0">

                                <div className="admin_mngAdmin_nameFilter w-100">
                                    {/* <span className="admin_mngAdmin_nameFilter_span1">
                                Name <img src={downarrow} width="8px" style={{float: 'right', marginRight: '20px', marginTop: '8px'}} alt="downArrow.svg"/>
                            </span> */}
                                    <span style={{ marginLeft: 20 }}>
                                        <img style={{ width: 14, marginTop: -3 }} alt="search.svg" src={search} />
                                        <input className="admin_mngAdmin_nameFilter_input" placeholder="Search by name" type="text" value={this.state.searchKey} onChange={(e) => this.getSearchReq(e)} />
                                    </span>
                                </div>
                            </div>
                            {/* <button className="admin_mngAdmin_roleFilter">
                            <span style={{width: 13, float: 'left', marginTop: -2}}><img src={filter} width="100%"/></span>
                            <span style={{float: 'left', marginLeft: 10}}>Filter by role</span>
                            <span style={{float: 'right', width: '8px', marginTop: -2}}><img src={downarrow} width="100%"/></span>
                        </button>                                */}
                            <div className="col-md-4 col-lg-4 col-12 p-0">
                                {this.state.isSuperAdmin ? <button className="w-100 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" onClick={() => this.props.history.push('/main/admin/admin/add')}>
                                    + Add New Administrators
                                </button> : null}

                            </div>
                        </div>
                        <div className="row hide_scrollbar" style={{ overflowX: 'auto', marginTop: '32px', display: this.state.adminsList.length ? "block" : "none" }}>
                            <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
                                <thead>
                                    <tr className="nurseHead">
                                        <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}> Name </th>
                                        <th className="t2_sp_licence_th"> Email Address </th>
                                        <th className="t2_sp_licence_th"> Permissions </th>
                                        <th className="t2_sp_licence_th"> Change Status </th>
                                        {this.state.isSuperAdmin ? <th className="t2_sp_licence_th" style={{ width: '80px' }}> Action </th> : null}
                                    </tr>
                                </thead>



                                <tbody>
                                    <tr style={{ height: 20 }} />



                                    {
                                        this.state.adminsList.map((item) => {
                                            return <React.Fragment key={item._id}>
                                                <tr className="admin_mngStaff_row">
                                                    <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> {item.firstName} {item.lastName} </td>
                                                    <td className="admin_mngStaff_td"> {item.email} </td>
                                                    <td className="admin_mngStaff_td">
                                                        {(item.permissions || []).map((v, i) => {
                                                            return <span key={i} className="w3-tag w3-blue w3-round ms-2"> {v} </span>
                                                        })}

                                                    </td>
                                                    {item.role !== "superAdmin" ? <td className="admin_mngStaff_td">

                                                        <button className="w-75 m-0 me-5 admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" style={{background : !item.isDeleted ? "#ff7675" : ""}} onClick={() => this.changeAdminStatus(item.isDeleted, item._id)}>
                                                            {/* {item.isDeleted ? "Enable" : "Disable"} */}
                                                        {this.state.showLoader === item._id ? <Loader /> : item.isDeleted ? "Enable" : "Disable" }
                                                            </button>

                                                    </td> : <td className="admin_mngStaff_td">



                                                    </td>}

                                                    {this.state.isSuperAdmin && item.role !== "superAdmin" ? <td className="admin_mngStaff_td">
                                                        <Link to={{
                                                            pathname: '/main/admin/admin/add',
                                                            state: item
                                                        }} style={{ marginRight: '20px' }}><img width="16px" height="16px" alt="img" src={edit} style={{ cursor: 'pointer' }} /></Link>
                                                        {/* <span onClick={() => this.deleteAdmins(item._id)}><img width="16px" height="16px" alt="img" src={del} style={{ cursor: 'pointer' }} /></span> */}
                                                    </td> : <td className="admin_mngStaff_td"></td>}

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
                        </div>

                        {!this.state.adminsList.length ? <p className="text-center mt-5">No search found</p> : null}

                        {!this.state.adminsList.length ? null : <Pagination curPage={this.state.curPage} totalPage={this.state.totalPage} setCurPage={this.setCurPage} />}


                    </div>
                </div> : <ManageAdminAddEdit />}

            </>
        );
    }
}

export default ManageAdmin;
