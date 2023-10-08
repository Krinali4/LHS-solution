import React from 'react';
import { connect } from 'react-redux';
import search from '../../assets/images/search.svg';
import avatar from '../../assets/images/admin.svg';
import { history } from '../../../store';
import { removeSession } from '../../../action';
import { Link } from 'react-router-dom';

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
};

const mapDispatchToProps = dispatch => ({
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      name: 'Olivia',
      title: 'Profile',
      avatar: '',
      badge: true,
      search: '',
      openAccount: false,
      page: ""
    }
  }
  componentWillMount() {
    this.initState(this.props);
  }
  componentWillReceiveProps = (newProps) => {
    let url = window.location.href;
    let splitUrl = url.split("/main/");
    console.log(splitUrl, url)
    if (splitUrl[1] === `admin`) {
      this.setState({
        page: "Dashboard"
      })
    }
    else if (splitUrl[1] === `admin/manageAdmin`) {
      this.setState({
        page: "Manage Administrator"
      })
    }
    else if (splitUrl[1] === `admin/manageStaff`) {
      this.setState({
        page: "Manage Staff"
      })
    }
    else if (splitUrl[1] === `admin/manageHospital`) {
      this.setState({
        page: "Manage Hospital"
      })
    }
    else if (splitUrl[1] === `admin/manageAttendance`) {
      this.setState({
        page: "Manage Attendance"
      })
    }
    else if (splitUrl[1] === `admin/managePayment`) {
      this.setState({
        page: "Manage Payment"
      })
    }
    this.initState(newProps);
  }
  initState = (props) => {
    this.setState({
      type: props.auth.type,
      name: props.auth.name,
      title: props.auth.title
    })
  }

  search = (e) => {
    this.setState({ search: e.target.value });
  }

  logOut = () => {
    removeSession();
    history.push('/login');
  }

  openAccount = () => {
    this.setState({ openAccount: !this.state.openAccount });
  }


  render() {
    console.log(this.state.page)
    // return (
    //     <div className="theme2_header">
    //         {this.state.title}
    //         <div className="theme2_header_item">
    //           <div className="theme2_header_avatar_container">
    //             <div className="theme2_header_avatar_img">
    //               <img width="100%" src={avatar} alt="avatar.png" style={{borderRadius: '50%'}} onClick={this.logOut}/>
    //             </div>
    //             <b className="theme2_header_avatar_name"> {this.state.name} </b>
    //           </div>
    //           {/* <div className="theme2_header_search_container">
    //             <img className="theme2_header_search_img" alt="search.svg" src={search}/>
    //             <input className="theme2_header_search" placeholder="Search" type="text" value={this.state.search} onChange={this.search}/>
    //           </div> */}
    //         </div>
    //     </div>
    // );
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


              {/* <img src={badge} alt="badge.png" className="theme2_header_badge" /> */}
              <div className={this.state.openAccount ? "rectangle" : "rectangle openAccount"}></div>
              <div className={this.state.openAccount ? "account admin_account" : "account openAccount"} >
                <Link style={{ textDecoration: 'none', marginBottom: '15px', display: 'flex' }} to={`/main/admin/change-password`} className='profile'
                // className={this.state.profileClick?"profile accountClick":"profile"} 
                // onClick={()=>this.profileClick("profile")}
                // onClick={()=>this.profileClick()}
                >Change Password</Link>
                <p className="logout" onClick={() => this.logOut()}>Logout</p>
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
