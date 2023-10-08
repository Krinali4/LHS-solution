import React from 'react';
import { connect } from 'react-redux';
import { history } from '../../../../store';
import avatar from "../../../assets/images/avatar.png";
import place from "../../../assets/images/place.svg";
import FileBrowser from '../../hospitalProfile/components/filebrowser';
// import FileBrowser from '../../../theme_1/staffSignUp/components/fileBrowser';
import ErrorState from '../../../theme_1/staffSignUp/components/errorState';
import edit_badge from "../../../assets/images/edit_badge.svg";
import { callApi, setSession, removeSession } from '../../../../action';
import { SET_SP_PROFILE, SET_AUTH } from '../../../../constants/actionTypes';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import "./components.css";
import $ from 'jquery';

const mapStateToProps = state => {
  return {
      _id: state.staffProfile._id,
    //   name: state.staffProfile.name,
      avatar: state.staffProfile.avatar,
      badge: state.staffProfile.badge,
    //   currentLocation: state.staffProfile.currentLocation
  }};

const mapDispatchToProps = dispatch => ({
    setStaffProfile: (data) => dispatch({type: SET_SP_PROFILE, data}),
    setAuth: (data) => dispatch({type: SET_AUTH, data})
});

class Avatar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            avatar: '',
            location: '',
            badge: false,
            modal1show: 'none',
            file: false,
            fileAdded: false,
            imgUrl: '',
            fileErr: 'none',
            delFile: false,
            errorTitle: 'The PNG, JPEG, JPG file is required.',
            modal2show: 'none',
            crop: { aspect: 1 },
            image: false,
            croppedImg: false,
            croppedImgUrl: false
        }
    }

    componentWillMount = () => {        
        this.initState(this.props);
    }
    componentDidMount = async() => {
        var id = window.localStorage.getItem('_id')
        var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
        var res = await callApi("GET", `v1/LHS/staff/getById/${id}`, Authorization);
       if(res.data) {
        this.setState({
            name : res.data.name,
            avatar : res.data.avatar,
            location: res.data.currentLocation
})}
    }

    componentWillReceiveProps = (newProps) => {
        this.initState(newProps);
    }

    initState = (props) => { 
        // console.log(props);
        // var curLoc = props.currentLocation;
        // if(curLoc.name){
        //     curLoc = curLoc.name + ', ' +  curLoc.state;
        //     this.setState({
        //         name: props.name,
        //         location: curLoc,
        //         avatar: props.avatar!==''?props.avatar:avatar,
        //         badge: props.badge
        //     })
        // }        
    }
   
    logOut = () => {
        removeSession();
        history.push('/home');
    }

    /** MODAL 1 FUNCTIONS */
    openModal1 = () => {
        this.setState({
            modal1show: 'block',
            file: false
        });
        $('#_input').val(null);
        console.log(this.state.file);
    }
    // setFile = (file) => {
    //     this.setState({file: file});
    // }
    setFile = (file) => {
        // this.uploadFileFunc(file);
        // this.setState({
        //     fileAdded: file
        // })
        this.setState({file: file});
    }

    uploadFileFunc = async (file) => {
        // this.setState({
        //     showLoader: true
        // })
        const data = {
            file: file,
            name: "avatar"
        }
        var res1 = await callApi("POST", "v1/LHS/file/upload", null, data, true);
        alert(res1.Message);
        this.setState({ file: res1.upload.upload.link, 
            // showLoader: false
         });
    }

    showFileErr = (title) => {
        this.setState({
            fileErr: 'block',
            errorTitle: title?title:'The PNG, JPEG, JPG file is required.'
        });
    }
    hideFileErr = () => {
        this.setState({fileErr: 'none'});
    }

    setImgUrl = (url) => {
        this.setState({imgUrl: url, croppedImgUrl: url});
    }

    setDelFile = (del) => {
        this.setState({delFile: del});
        if(del && this.state.fileErr==='block')
            this.hideFileErr();
    }

    handleSave1 = () => {
        if(this.state.file && this.state.fileErr === 'none'){
            this.setState({
                modal2show: 'block'
            });
            console.log(this.state.file, 'in handlesave1');

            // var Authorization = 'Bearer '.concat(window.localStorage.getItem('token'));
            // var res = await callApi("POST", "v1/LHS/job/add", Authorization, data);
            this.modal1Close();
        }
    }

    modal1Close = () => {
        $('#' + this.state.prefix + 'input').val(null);
        this.setState({
            modal1show: 'none'
        });
    }

    /** MODAL 2 FUNCTIONS */

    getCroppedImg = (image, pixelCrop, fileName) => {
        
            const canvas = document.createElement('canvas');
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );
            
            // As Base64 string
            // const base64Image = canvas.toDataURL('image/jpeg');
            // this.setState({ croppedImg : base64Image })
            
            // As a blob
            return new Promise((resolve, reject) => {
                canvas.toBlob(file => {
                file.name = fileName;
                resolve(file);
                }, 'image/jpeg');
            });
            
        // catch (error) {
        //     console.log(error);
        // }
       
    }

    onImageLoaded = (image, pixelCrop) => { 
        console.log(image);
        console.log('onImageLoaded', { image, pixelCrop });
        var imgWidth = image.naturalWidth;
        var imgHeight = image.naturalHeight;
        if(imgWidth > imgHeight)
            this.setState({
                crop: {
                x: 0,
                y: 0,
                aspect: 1,
                height: 100,
                },
                disabled: false,
            });
        else 
            this.setState({
                crop: {
                x: 0,
                y: 1,
                aspect: 1,
                width: 100,
                },
                disabled: false,
            });
        this.setState({image});
        // console.log(this.state.file, 'in line 287');
      }

    onCropComplete = async (crop, pixelCrop) => {
        console.log('onCropComplete', { crop, pixelCrop });
        var croppedImg = await this.getCroppedImg(this.state.image, pixelCrop, "croppedImg");
        this.setState({croppedImg});
        console.log(croppedImg);
        let fileReader = new FileReader(); //creating new FileReader object
        fileReader.onload = ()=>{
          let croppedImgUrl = fileReader.result;
          this.setState({croppedImgUrl});
        }
        fileReader.readAsDataURL(croppedImg);  
    }

    onChange = (crop, pixelCrop) => {
        this.setState({crop: crop});        
    }

    handleSave2 = () => {
        this.imgUpload();
    }

    modal2Close = () => {
        this.setState({
            modal2show: 'none'
        })
    }

    imgUpload = async () => {
        let fileReader = new FileReader(); //creating new FileReader object
        console.log(fileReader.result);
        console.log(this.state.crop);

        fileReader.onload = ()=>{
            this.setState({avatar: fileReader.result});
        }
        fileReader.readAsDataURL(this.state.croppedImg);
        // var res1 = await callApi('POST', 'v1/LHS/file/upload', null, data, true);
        // console.log(res.upload.upload.link);
        // if(res1.upload.upload.link){
            // this.setState({ showPending: 'block', title: 'Updating Your Resume' });
        var res1 = await callApi('POST', 'v1/LHS/file/upload', null, {file: this.state.croppedImg}, true);
        this.setState({ avatar: res1.upload.upload.link }, () => this.updateDB())
            // var updateData = {
            //             avatar: this.state.croppedImg};
            //             console.log(updateData);
            //     var token =  "Bearer " + localStorage.getItem('token');
            //     var id = localStorage.getItem('_id');
            //     var res = await callApi("PUT", "v1/LHS/staff/update/" + id, token, updateData);
            //     if(res.data) {
            //         this.modal2Close();
            //         this.componentDidMount();
            //     }
            //  }
        // this.setState({ avatar: res.upload.upload.link}
        //     // , () => this.updateDB()
        //     );        
    }

    updateDB = async () => {        
        var data = {
            avatar: this.state.avatar
        };
        var token =  "Bearer " + localStorage.getItem('token');
        var id = window.localStorage.getItem('_id')
        var res = await callApi("PUT", `v1/LHS/staff/update/${id}`, token, data);
        console.log(res.data);
          //t (res.data);
        if(res.data){
            this.componentDidMount();
            this.modal2Close();
            // window.location.reload(true)
        }
        // setSession( res.token, res.data._id, 'staff');
        //   //t (res.data);
        // data = {            
        //     name: res.data.name, 
        //     type: 'staff', 
        //     avatar: res.data.avatar,
        //     badge: res.data.badge
        // }
        // this.props.setAuth(data);
    }

   render() {
       var propsData = this.props.staff
    return (
        <div className="row t2_sp_avatar_container">
            <div className="col-md-10">
                <div className="t2_sp_avatar_img">
                    <img alt="avatar.png" src={this.state.avatar && this.state.avatar!== '' ? this.state.avatar : avatar} width="80px" height="auto" style={{borderRadius: '50%'}} onClick={this.openModal1}/>
                    <img src={edit_badge} alt="badge.png" className="t2_sp_avatar_badge" style={{display: this.state.badge?"block":"false"}} onClick={this.openModal1}/>
                </div>
                <div className="row t2_sp_avtar_desc">
                    <p className="col-12 t2_sp_avatar_txt1"> {this.state.name} </p>
                    <p className="col-12 t2_sp_avatar_txt2">
                        <span style={{marginRight: 12}}><img alt="place" width="13px" height="16px" src={place}/></span>
                        {this.state.location &&  this.state.location.name + ', ' +  this.state.location.state}
                    </p>
                </div>
            </div>
            <div className="col-md-2">
                <div className="t2_sp_avatar_logout" onClick={this.logOut}> Log out </div>
            </div>
            <div className="w3-modal" style={{display: this.state.modal1show}} >
                <div className="w3-modal-content ssu2_modal1" style={{maxHeight: 600, overflowY: 'auto'}}>
                    <div className="w3-container">
                        <div className="ssu2_modal1_text1">Update Profile Picture</div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                        <FileBrowser setFile={this.setFile} showFileErr={this.showFileErr} title="PICTURE" 
                            hideFileErr={this.hideFileErr} setImgUrl={this.setImgUrl} file={this.state.fileAdded} setDelFile={this.setDelFile} accept="image/png, image/jpg, image/jpeg"/>
                        <ErrorState show={this.state.fileErr} name={this.state.errorTitle} />
                        <div className="ssu2_modal1_text2">
                            Please upload only png, jpg, or jpeg images
                        </div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                        <div className="row ssu_bottom">
                            <button className={this.state.file && this.state.fileErr === 'none'?"ssu2_modal1_button1": "ssu2_modal1_button1 button_disabled"} onClick={this.handleSave1}> SAVE </button>
                            <button className="ssu2_modal1_button2" onClick={this.modal1Close}> CANCEL </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w3-modal" style={{display: this.state.modal2show}} >
                <div className="w3-modal-content ssu2_modal1" style={{maxHeight: 600, overflowY: 'auto'}}>
                    <div className="w3-container">
                        <div className="ssu2_modal1_text1">Update Profile Picture</div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <img alt="img" width="50%" height="auto" src={this.state.croppedImgUrl} style={{marginLeft: '25%', marginTop: 48}}/>
                                <p style={{width: '72%', marginLeft: '14%', textAlign: 'center', marginTop: 20}}>Select the visible area of your picture using the selector tool. When finished selecting the area, click the save button</p>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <ReactCrop style={{marginTop: 48}} src={this.state.imgUrl} crop={this.state.crop} onChange={newCrop => this.onChange(newCrop)} onComplete={this.onCropComplete} onImageLoaded={this.onImageLoaded}/>
                            </div>
                        </div>
                        <hr style={{margin: '30px 0px 0px'}}/>
                        <div className="row ssu_bottom">
                            <button className="ssu2_modal1_button1" onClick={this.handleSave2}> SAVE </button>
                            <button className="ssu2_modal1_button2" onClick={this.modal2Close}> CANCEL </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Avatar;
