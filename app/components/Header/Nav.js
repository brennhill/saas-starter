import React from 'react';
import {Link, History} from 'react-router';
import reactMixin from 'react-mixin';
import styles from './nav.css';

export default class Nav extends React.Component {

  render() {
    const user = this.props.user;
    let rightSide;
    let style = {
      marginLeft: '7.4em'
    }

    if (user) {

      rightSide = (
        <ul className={styles.navbarListRight}>
          <li className={styles.item}>
            <Link to="/search" className={styles.link}><i className="fa fa-search"></i></Link>
          </li>
          <li className={styles.item}>
            <a href="#" onClick={this.props.handleDropDownClick} className={styles.link} ><i className="fa fa-ellipsis-v"></i></a>
          </li>
          { this.props.showDropDown ? <DropDown user={user} handleDropDownClick={this.props.handleDropDownClick} /> : null }
          <li className={styles.item}><a href="#" onClick={this.props.handleDropDownClick} ><img src={user.profile.avatar} className={styles.avatar} /></a></li>

        </ul>
      );

    } else {
      rightSide = (
        <ul className={styles.navbarListRight}>
          <li className={styles.divider}></li>
          <li className={styles.item}>
            <Link to="/search" className={styles.link} activeClassName="active"><i className="fa fa-search"></i></Link>
          </li>
          <li className={styles.item}><Link to="/signin" className={styles.link}  activeClassName="active">Sign in</Link></li>
          <li className={styles.item}><Link to="/join" className={styles.link}  activeClassName="active">Join</Link></li>
        </ul>
      );
    }

    return (
      <div className={styles.navbar}>
        <ul className={styles.navbarList}>
          <li className={styles.item}>
            <a href="#" onClick={this.props.handleMenuClick}
                        className={styles.link}>
              <i className="fa fa-bars"></i>
              <span className={styles.menu}> Menu</span>
            </a>
          </li>
          <li className={styles.divider}></li>
          {this.props.back ?
            <li className={styles.item} style={(this.props.showSidebar) ? style : {}}>
              <Link to={this.props.back} className={styles.link}>
                <i className="fa fa-angle-left fa-2x"></i>
              </Link>
            </li>
            :
            null
          }
          <li className={styles.item} style={(this.props.showSidebar && !this.props.back) ? style : {}} ref="pageTitle">
            {this.props.name}
          </li>
        </ul>
        { rightSide }
      </div>

    );
  }
}

@reactMixin.decorate(History)
class DropDown extends React.Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout() {
    Meteor.logout();
    this.history.pushState(null, `/`);
  }

  render() {
    return (
      <ul className={styles.children} onClick={this.props.handleDropDownClick}>
        <li className={styles.item}><Link to={`/user/${this.props.user._id}`} className={styles.link}><i className="fa fa-user"></i> Profile</Link></li>
        <li className={styles.item}><a href="#" onClick={this.logout} className={styles.link}><i className="fa fa-sign-out"></i> Logout</a></li>
      </ul>
    );
  }
}
