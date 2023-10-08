import React, {useState, useEffect} from 'react'
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

const InProgressPayment = () => {

  const [getStaffList, setgetStaffList] = useState([])
  const [type, setType] = useState('')
  const [showMainLoader, setshowMainLoader] = useState(false)
  const [showPayButton, setshowPayButton] = useState(false)
  const [total, setTotal] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [curPage, setCurPage] = useState(1)
  const [skip, setSkip] = useState(0)

  useEffect(() => {
    setshowMainLoader(true);
    const  getStaffByQuery = async (skip = 0) => {
     
      var token = localStorage.getItem('token');
      token = "Bearer " + token;
      var res = await callApi('GET', `v1/LHS/payment/getList?skip=${skip}&type=inprogress`, token);
      if (res.data) {
          if (type === 'superAdmin') {
              setSession(res.token, res.data._id, 'superAdmin');
              setshowMainLoader(false);
              setshowPayButton(true)
          }
          else {
              setSession(res.token, res.data._id, 'admin');
              setshowMainLoader(false);
          }
          var totalCount = res.data.count
          var page = Math.ceil(totalCount / 10);
          setgetStaffList(res.data.result)
          setTotalPage(page)
          // this.setState({ hospitals: [...res.data.result], totalPage: page, showLoader : '' });
      }
      else {
          console.log(true,"sss")
          // this.setState({ hospitals: [], showMainLoader : false })
          setgetStaffList([])
          setshowMainLoader(false)
      }
  }
 
  getStaffByQuery();

  },[skip] )

  const  search = async (e) => {
    await this.setState({
        search: e.target.value,
        curPage: 1,
    })
    // await this.getStaffByQuery();
}

const  setcurPage = async (num) => {
  const value = (num * 10) - 10;
  // await this.setState({ curPage: num, skip: value });
  await setCurPage(num)
  await setSkip(value)
  // this.getStaffByQuery(this.state.skip);
}
  return (
    <div className="theme2_body" style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
    <div className="t2_sp_work" style={{ marginTop: 0 }}>
        <div className="row">
        </div>
{showMainLoader ? <Loader /> :                <div className="row hide_scrollbar" style={{ overflowX: 'auto', marginTop: '32px', display: getStaffList.length ? "block" : "none" }}>
            <table className="admin_table" style={{ width: '99%', minWidth: '800px', marginBottom: '20px', textAlign: 'left' }}>
                <thead>
                    <tr className="nurseHead">
                        <th className="t2_sp_licence_th" style={{ paddingLeft: '30px' }}>Staff Name </th>
                        <th className="t2_sp_licence_th">Amount </th>
                        {/* <th className="t2_sp_licence_th" > View Payment </th> */}
                        {/* <th className="t2_sp_licence_th"> Open Positions </th> */}
                 { <th className="t2_sp_licence_th" style={{ width: '80px' }}> Pay </th>}
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ height: 20 }} />
                    {
                        getStaffList.map((item) => {

                            return <React.Fragment key={item._id}>
                                <tr className="admin_mngStaff_row">
                                    <td className="admin_mngStaff_td" style={{ paddingLeft: '30px' }}> {item.staff && item.staff.name} </td>
                                    <td className="admin_mngStaff_td"> {`$ ${item.shiftCost}`} </td>
                                    {/* <td className="admin_mngStaff_td"> 
                                    <button className="w-25 m-0  admin_mngAdmin_roleFilter admin_mngAdmin_addAdmin" style={{ backgroundColor : !item.paid && 'grey'}} disabled={!item.paid}>
                                                View
                                            </button>
                                     </td> */}
                              {        <td className="admin_mngStaff_td" style={{color : 'orange' }}>
                                            {'In-Progress'}
                                    </td> }
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
        </div>}
        
        { (!getStaffList.length && !showMainLoader) ? <p className="text-center my-5">No record found</p> : null}

        {getStaffList.length ? <Pagination curPage={curPage} totalPage={totalPage} setCurPage={setcurPage} /> : null}
    </div>
</div>
  )
}

export default InProgressPayment
