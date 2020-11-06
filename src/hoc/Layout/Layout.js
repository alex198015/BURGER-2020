import React, { Component } from "react"
import Auxilliary from '../Auxilliary/Auxilliary'
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'
import {connect} from 'react-redux'

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    SideDrawerCloseHandler = () => [
        this.setState({
            showSideDrawer: false
        })
    ]

    sideDrawewrToggleHandler = () => {
        this.setState((prevState) => {
           return { showSideDrawer: !prevState.showSideDrawer }
        })
    }

    render() {
        return (
            <Auxilliary>
                <Toolbar 
                    isAuth={this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawewrToggleHandler}/>
                <SideDrawer 
                    isAuth={this.props.isAuthenticated}
                    closed={this.SideDrawerCloseHandler}
                    open={this.state.showSideDrawer}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxilliary>
        )
    }

}

const mapStateToProps = state => {
    return {
        isAuthenticated : state.auth.token
    }
}

export default connect(mapStateToProps)(Layout);