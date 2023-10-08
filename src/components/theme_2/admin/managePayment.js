import React, {useState, useEffect} from 'react'
import PendingPayment from './PendingPayment'
import InProgressPayment from './InProgressPayment'
import PaidPayment from './PaidPayment'

const managePayment = (props) => {

    const [activeClass, setActiveClass] = useState('pending')
    const [curPos, setcurPos] = useState('')
    
    useEffect( () => {
        props.setCurPos('managePayment');
    },[] )
   
    const handleMenu = (val) => {
        setActiveClass(val)
    }

    const setCurPos = (pos) => {
        setcurPos(pos)
    }

  return (
    <div className="theme2_main_container">
                    <div className="theme2">
                        <div className="staff_main">
                            {/* {!this.state.applicant? */}
                                <div>
                                    <div className="staff_menu">
                                    <div className={activeClass=="pending"?"col-md-4 col-sm-4 col-4 RSBtn activeMenu":"col-md-4 col-sm-4 col-4 RSBtn"} onClick={() => handleMenu('pending')}>PENDING</div>
                                        <div className={activeClass=="inprogress"?"col-md-4 col-sm-4 RSBtn col-4 activeMenu":"col-md-4 col-sm-4 col-4 RSBtn"} onClick={() => handleMenu('inprogress')}>IN-PROGRESS</div>
                                        <div className={activeClass=="paid"?"col-md-4 col-sm-4 col-4 RSBtn activeMenu":"col-md-4 col-sm-4 col-4 RSBtn"} onClick={() => handleMenu('paid')}>COMPLETED</div>

                                    </div>
                                    <div className="line"></div>
                                    {
                                        activeClass=="pending"?<PendingPayment {...props} setCurPos={setCurPos} />:
                                        activeClass=="inprogress"?<InProgressPayment /> :
                                        <PaidPayment />
                                    }
                                </div>
                            {/* :this.state.jobPost?
                                <JobPost goBack={this.goBackStaff} applicant={this.handleApplicant} />
                                :this.state.jobEdit?
                                    <JobEdit goBack={this.goBackStaff} />
                                    :
                                    <ApplicantJob redirectTo={this.redirectTo} titleChange={this.handleTitle} jobDetails={this.state.jobDetails} />
                            }                     */}
                        </div>
                    </div>
                </div>
  )
}

export default managePayment
