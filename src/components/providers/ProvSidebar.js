import nameWlogo from '../../Images/TelePsycRXnameWicon500by300.jpg'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'


function Sidebar() {
    return (
        <Fragment>
            <input type="checkbox" id="nav-toggle"></input>
            <div className="sidebar">
                <div className="sidebar-brand">
                    <span className="lab la-telePsycRX"><img className="sidebarlogo"
                        src={nameWlogo} alt="logoName"></img></span>
                </div>
                <div className="sidebar-menu">
                    <ul>
                        <li>
                            <NavLink to="/provider-dashboard" activeClassName="active" className="Prov"><span className="las la-home"></span>
                                <span>Dashboard</span></NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="Prov" to="/provider-patients"><span className="las la-users"></span>
                                <span>Patients</span></NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="Prov" to="/provider-appointments"><span className="las la-calendar-check"></span>
                                <span>Appointments</span></NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="Prov" to="/provider-notes"><span className="las la-notes-medical"></span>
                                <span>Notes</span></NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="Prov" to="/provider-resources"><span className="las la-clipboard-list"></span>
                                <span>Resources</span></NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="Prov" to="/provider-documents"><span className="las la-file-alt"></span>
                                <span>Documents</span></NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" className="Prov" to="/provider-profile"><span className="las la-id-card"></span>
                                <span>Profile</span></NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </Fragment>
    )
}

export default Sidebar;