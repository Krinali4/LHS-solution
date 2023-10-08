import { useState, useEffect } from "react";
import { callApi } from "./../../../action";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ErrorState from './../../theme_1/staffSignUp/components/errorState';

const ManageAdminAddEdit = (props) => {

  const [userObj, setUserObj] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    permissions: [],
    confirmPassword: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [showErrTrue, setShowErrTrue] = useState(false);

  const [duplicateEmailErr, showDuplicateEmailErr] = useState(false);

  const [showErrPwdNotMatchTrue, setshowErrPwdNotMatchTrue] = useState(false);

  const [pwdIcon, setPwdIcon] = useState(true);
  const [confirmPwdIcon, setConfirmPwdIcon] = useState(true);

  function ValidatePassword(pwd) {
    var mailformat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/g;
    if (pwd.match(mailformat)) {
      return true;
    }
    else {
      return false;
    }
  }

  useEffect(() => {
    if (props.location.state) {
      props.location.state.password = "";
      setEditMode(true);
      setUserObj(props.location.state)
    }
  }, [props.location.state])

  const addAdmin = async () => {

    if (userObj.firstName === "" || userObj.lastName === "" || userObj.email === ""
      || userObj.password === "" || userObj.confirmPassword === "" || userObj.phone === "" || !userObj.permissions.length || userObj.password !== userObj.confirmPassword) {
      setShowErrTrue(true);
    }
    else {
      if (!showErrPwdNotMatchTrue) {
        var token = localStorage.getItem("accessToken");
        token = "Bearer " + token;
        var res = await callApi("POST", "v1/LHS/admin/add", token, userObj);
        if (res.status === 200) {
          props.history.push("/main/admin/manageAdmin");
        }
        if(res.status === 403) {
          showDuplicateEmailErr(true);
        }
        else if (res.status === 409 && res.statusText === "Conflict") {
          showDuplicateEmailErr(true);
        }
      }
    }
  };

  const editAdmin = async () => {
    var token = localStorage.getItem("accessToken");
    token = "Bearer " + token;
    delete userObj.confirmPassword;
    delete userObj.tokens;
    delete userObj.isDeleted;
    delete userObj.__v;
    delete userObj.role;
    if (userObj.password === "") {
      delete userObj.password
    }

    if (!showErrPwdNotMatchTrue) {
      var res = await callApi("PUT", `v1/LHS/admin/update/${userObj._id}`, token, userObj);
      console.log(res);
      if (res.Message === "User Updated Successfully") {
        props.history.push("/main/admin/manageAdmin");
      }
      else if (res.status === 409 && res.statusText === "Conflict") {
        showDuplicateEmailErr(true);
      }
    }


  }

  const handleChange = (e) => {
    let obj = { ...userObj };
    if (e.target.name === "Manage Staff" || e.target.name === "Manage Hospital") {
      if (e.target.checked) {
        let copyPermissons = [...obj.permissions];
        copyPermissons.push(e.target.name);
        obj["permissions"] = copyPermissons;
        setUserObj(obj);
      }
      else {
        let newPermissions = obj.permissions.filter(v => v !== e.target.name);
        obj["permissions"] = newPermissions;
        setUserObj(obj);
      }
    }
    else {
      if (e.target.name === "password") {
        if (e.target.value.length > 1 && !ValidatePassword(e.target.value)) {
          setshowErrPwdNotMatchTrue(true);
        }
        else {
          setshowErrPwdNotMatchTrue(false);
        }
      }
      obj[e.target.name] = e.target.value;
      setUserObj(obj);
    }
  };

  const preventNumberInput = (e) => {
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if (((keyCode > 47 && keyCode) < 58 || (keyCode > 95 && keyCode < 107)) && keyCode !== 8 && keyCode !== 9 && keyCode !== 32) {
      e.preventDefault();
    }
  }

  const formatInput = (e) => {
    console.log(e.target.value.length, "e.target.value.length")
    if (e.target.value.length >= 10 && e.keyCode !== 8) {
      e.preventDefault();
    }
    else {
      // Prevent characters that are not numbers ("e", ".", "+" & "-") âœ¨
      let checkIfNum;
      if (e.key !== undefined) {
        // Check if it's a "e", ".", "+" or "-"
        checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
      }
      else if (e.keyCode !== undefined) {
        // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
        checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
      }
      return checkIfNum && e.preventDefault();
    }
  }

  console.log(userObj, "userObjuserObjuserObj")

  return (
    <>
      <div
        className="theme2_body add_admin_inputs"
        style={{ backgroundColor: "rgba(0,0,0,0)" }}
      >
        <div className="t2_sp_work" style={{ marginTop: 0 }}>
          <div className="row m-0">
            <div className="col-12 p-0 text-center pt-3 pb-2 add_admin_heading">
              {editMode ? "Edit Administrator" : "Add New Administrator"}
            </div>
          </div>

          <hr />

          <div className="row m-0">
            <div className="col-12 p-0 pt-3 pb-2">Name*</div>
          </div>
          <div className="row m-0">
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={userObj.firstName}
                onChange={handleChange}
                onKeyDown={preventNumberInput}
              />
              <ErrorState show={showErrTrue && !userObj.firstName.length ? 'block' : 'none'} name="First Name is required." />
            </div>
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2">
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={userObj.lastName}
                onChange={handleChange}
                onKeyDown={preventNumberInput}
              />
              <ErrorState show={showErrTrue && !userObj.lastName.length ? 'block' : 'none'} name="Last Name is required." />
            </div>
          </div>

          <div className="row m-0 mt-4">
            <div className="col-12 p-0 pt-3 pb-2">Contact*</div>
          </div>
          <div className="row m-0">
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2">
              <input
                type="text"
                placeholder="Email Address"
                name="email"
                value={userObj.email}
                onChange={handleChange}
              // disabled={editMode}
              />
              <ErrorState show={showErrTrue && !userObj.email.length ? 'block' : 'none'} name="Email is required." />

              <ErrorState show={duplicateEmailErr ? 'block' : 'none'} name="Email is already in use." />
            </div>
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2">
              <input
                type="number"
                placeholder="Phone Number"
                name="phone"
                value={userObj.phone}
                onKeyDown={formatInput}
                min="1"
                max="9999999999"
                onChange={handleChange}
              />
              <ErrorState show={showErrTrue && !userObj.phone.length ? 'block' : 'none'} name="Phone Number is required." />
            </div>
          </div>

          <div className="row m-0 mt-4">
            <div className="col-12 p-0 pt-3 pb-2">Password*</div>
          </div>
          <div className="row m-0">
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2 position-relative">
              <input
                type={pwdIcon ? "password" : "text"}
                placeholder="New Password"
                name="password"
                value={userObj.password}
                onChange={handleChange}
              // disabled={editMode}
              />
              <div style={{position: 'absolute', top: '28px', right: '70px', cursor: "pointer"}}>
               {pwdIcon ? <VisibilityOffIcon onClick={() => setPwdIcon(false)} /> : <VisibilityIcon onClick={() => setPwdIcon(true)} />} 
              </div>
              <ErrorState show={showErrTrue && !userObj.password.length ? 'block' : 'none'} name="Password is required." />
              <ErrorState show={showErrPwdNotMatchTrue && userObj.password && userObj.password.length ? 'block' : 'none'} name="Password should have minimum 6 characters, 1 upper case,  1 lower case, 1 special character and 1 number." />
            </div>
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2 position-relative">
              <input
                 type={confirmPwdIcon ? "password" : "text"}
                placeholder="Confirm Password "
                name="confirmPassword"
                value={userObj.confirmPassword}
                onChange={handleChange}
              // disabled={editMode}
              />
              <div style={{position: 'absolute', top: '28px', right: '70px', cursor: "pointer"}}>
               {confirmPwdIcon ? <VisibilityOffIcon onClick={() => setConfirmPwdIcon(false)} /> : <VisibilityIcon onClick={() => setConfirmPwdIcon(true)} />} 
              </div>
              <ErrorState show={showErrTrue && !userObj.confirmPassword.length ? 'block' : 'none'} name="Confirm Password is required." />

              <ErrorState show={userObj.password && userObj.password !== userObj.confirmPassword ? 'block' : 'none'} name="Password & confirm password should be same." />
            </div>
          </div>

          <div className="row m-0 mt-4">
            <div className="col-12 p-0 pt-3 pb-2">Permission*</div>
          </div>
          <div className="row m-0">
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2 position-relative">
              <div className="d-flex align-items-center checkbox_input_parent">
                <input type="checkbox" className="checkbox_input" name="Manage Staff" id="" onChange={handleChange} checked={userObj.permissions.includes("Manage Staff")} />
                <p className="mb-0 checkbox_input_text">Manage Staff</p>
              </div>
              <input
                type="text"
                placeholder=""
                name="text"
                disabled
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2 position-relative">
              <div className="d-flex align-items-center checkbox_input_parent">
                <input type="checkbox" className="checkbox_input" name="Manage Hospital" id="" onChange={handleChange} checked={userObj.permissions.includes("Manage Hospital")} />
                <p className="mb-0 checkbox_input_text">Manage Hospital</p>
              </div>
              <input
                type="text"
                placeholder=""
                name="text"
                disabled
              />
            </div>
            <ErrorState show={showErrTrue && !userObj.permissions.length ? 'block' : 'none'} name="One permissions is required." />
          </div>

          <div className="row m-0 mt-4">
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2">
              <button className="add_admin_btn" onClick={() => {
                if (editMode) {
                  editAdmin()
                }
                else {
                  addAdmin()
                }
              }}>
                {editMode ? "EDIT" : "ADD"}
              </button>
            </div>
            <div className="col-lg-6 col-md-6 col-12 p-0 pt-3 pb-2">
              <button
                className="add_admin_btn cancel_admin_btn"
                onClick={() => props.history.push("/main/admin/manageAdmin")}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAdminAddEdit;
