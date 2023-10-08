import React from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import { history } from '../../../../store';
import ManageStaffProfile from './manageStaffProfile';

const mapStateToProps = state => {
    return {
        staff: state.staffProfile
    }
};

const mapDispatchToProps = dispatch => ({
});

class ManageStaffEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staff: {},
            curPos: '',
            route: false,
        }
    }

    componentWillMount = () => {
        this.props.setCurPos('manageStaff');
        this.initState(this.props);
    }
    componentDidMount = () => {
        console.log(this.state.staff._id, 'inside staff edit to checkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
        this.setState({ route: true })
    }

    componentWillReceiveProps = (props) => {
        this.initState(props);
        this.componentDidMount();
    }

    initState = (props) => {
        this.setState({
            staff: props.staff,
            curPos: props.curPos
        })
    }

    toManageStaff = () => {
        history.push('/main/admin/manageStaff');
    }

    render() {
        return (
            <React.Fragment>
                <p> <Link to={'/main/admin/manageStaff'} style={{ textDecoration: 'none' }}> <span onClick={this.toManageStaff} style={{ color: '#009CDE', fontSize: 16, cursor: 'pointer' }}>{'<'} Manage Staff </span> &nbsp; / &nbsp; {this.state.staff.name} </Link></p>
                {this.state.route ? <div className="theme2_body">
                    <div className="t2_sp_work" style={{ marginTop: 0 }}>
                        <Switch>
                            <Route path="/main/admin/manageStaffEdit/" render={(props) => <ManageStaffProfile id={this.state.staff._id} {...props} />} />
                        </Switch>
                    </div>
                </div> : ''}
            </React.Fragment>
        );
    }
}

export default ManageStaffEdit;
