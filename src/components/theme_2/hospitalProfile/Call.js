import React from 'react';
import Header from "../components/header";
import { connect } from 'react-redux';
import { CometChat } from "@cometchat-pro/chat";
import { CometChatUI } from "./CometChatWorkspace/src";

const mapStateToProps = state => {
    return {
      hospitalUser: state.hospitalProfile,
    }};
class Call extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div> 
                <Header page="Chats" />
                <div className="theme2_main_container">
                    <div style={{height:"90vh"}}>
                        <CometChatUI />
                    </div>
                </div>
            </div>
        )
    }
}

export default  connect(mapStateToProps)(Call);
