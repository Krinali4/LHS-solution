import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom'
import search from '../../assets/images/search.svg';
import avatar from '../../assets/images/avatar.png';
import badge from '../../assets/images/badge.png';
import { history } from '../../../store';
import { removeSession, callApi } from '../../../action';
import { SET_SP_PROFILE } from '../../../constants/actionTypes';

const mapStateToProps = state => {
  console.log(state.auth, "STSTSTTS");
  return {
    auth: state.auth,
    hospitalName: state.hospitalProfile.name,
    hospitalAvatar: state.hospitalProfile.avatar,
    staffName: state.staffProfile.name,
    staffAvatar: state.staffProfile.avatar
  }
};

const mapDispatchToProps = dispatch => ({
  setStaffProfile: (data) => dispatch({ type: SET_SP_PROFILE, data }),
  setAuth: (data) => dispatch({ type: SET_AUTH, data })
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    console.log(props, "PPPPPPPPPPPPPPPppp")
    this.state = {
      type: props.auth ? props.auth.type : "",
      name: props.hospitalName ? props.hospitalName : "",
      title: '',
      avatar: props.hospitalAvatar ? props.hospitalAvatar : "",
      badge: true,
      search: '',
      page: this.props.page,
      profileClick: false,
      openAccount: false,
      loginType: '',
      getType: props.auth ? props.auth.type : "",
      staffName: props.staffName ? props.staffName : "",
      staffAvatar: props.staffAvatar ? props.staffAvatar : "",
      sName: '',
      sAvatar: '',
      hospitalName: '',
      hospitalAvatar: '',
    }
  }
  componentDidMount = async () => {
    var type = localStorage.getItem('type');
    this.setState({ getType: type });

    if (type === "staff") {
      var token = localStorage.getItem('token');
      const _id = localStorage.getItem('_id');
      token = "Bearer " + token;
      var res = await callApi("GET", "v1/LHS/staff/getById/" + _id, token);
      console.log(res.data);
        //t (res.data);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        staffName: this.props.staffName,
        staffAvatar: this.props.staffAvatar,
        name: this.props.hospitalName,
        avatar: this.props.hospitalAvatar
      })
    }
  }

  search = (e) => {
    this.setState({ search: e.target.value });
  }
  profileClick = (val) => {
    var gettype = window.localStorage.getItem('type')
    if (val == "profile") {
      console.log('in if for profile');
      this.setState({ profileClick: true });
      // this.setState({loginType:gettype});
      // history.push(`main/${loginType}/profile`)
      history.push(`main/staff/profile`);
    }
    else {
      removeSession();
      history.push('/login');
    }
  }
  openAccount = () => {
    this.setState({ openAccount: !this.state.openAccount });
  }

  render() {
    console.log(this.state)
    return (
      <div className="theme2_header">
        {this.state.page}
        <div className="theme2_header_item">
          <div className="theme2_header_avatar_container mb-0" onClick={this.openAccount} >
            <div className="theme2_header_avatar_img">

              {this.state.getType === 'staff' ?

                <img width="100%" src={this.state.staffAvatar ? this.state.staffAvatar : avatar}
                  alt="avatar.png" style={{ borderRadius: '50%' }} /> :

                <img width="100%" src={this.state.avatar ? this.state.avatar : avatar}
                  alt="avatar.png" style={{ borderRadius: '50%' }} />

              }


              <img src={badge} alt="badge.png" className="theme2_header_badge" />
              <div className={this.state.openAccount ? "rectangle" : "rectangle openAccount"}></div>
              <div className={this.state.openAccount ? "account" : "account openAccount"} >
                <Link style={{ textDecoration: 'none', marginBottom: '15px', display: 'flex' }} to={`/main/${this.state.getType}/profile`} className='profile'
                // className={this.state.profileClick?"profile accountClick":"profile"} 
                // onClick={()=>this.profileClick("profile")}
                // onClick={()=>this.profileClick()}
                >Profile</Link>
                <p className="logout" onClick={() => this.profileClick("logout")}>Logout</p>
              </div>
            </div>
            <b className="theme2_header_avatar_name"> {
              this.state.getType === 'staff' ? this.state.staffName : this.state.name} </b>
          </div>
          {/* <div className="theme2_header_search_container searchBigImg">
                <img className="theme2_header_search_img" alt="search.svg" src={search}/>
                <input className="theme2_header_search" placeholder="Search" type="text" value={this.state.search} onChange={this.search}/>
              </div> */}
          <div className="searchImag">
            <img className="theme2_header_search_img" alt="search.svg" src={search} />
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
