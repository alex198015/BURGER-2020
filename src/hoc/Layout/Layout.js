import React, { Component } from "react"
import Auxilliary from '../Auxilliary/Auxilliary'
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

class Layout extends Component {

    state = {
        showSideDrawer: true
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
                <Toolbar drawerToggleClicked={this.sideDrawewrToggleHandler}/>
                <SideDrawer closed={this.SideDrawerCloseHandler} open={this.state.showSideDrawer}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxilliary>
        )
    }

}

export default Layout;