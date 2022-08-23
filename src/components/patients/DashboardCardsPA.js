import { useHistory } from 'react-router-dom'

function DashboardCardsPA({ userIdentity }) {
    const history = useHistory();

    const handleRoute = (path) => {
        !userIdentity ? null : history.push(path);
    };
    return (

        <div className="cards">
            <div onClick={() => handleRoute("/patient-resources")} className="card-single patientCard">
                <h2></h2>
                <span>Resources</span>
                <div>
                    <span className="las la-clipboard"></span>
                </div>
            </div>


            <div onClick={() => handleRoute("/patient-appointments")} className="card-single patientCard">
                <h2></h2>
                <span>Appointments</span>

                <div>
                    <span className="las la-calendar-check"></span>
                </div>
            </div>

            <div onClick={() => handleRoute("/patient-personalJournal")} className="card-single patientCard">
                <h2></h2>
                <span>Personal Journal</span>
                <div>
                    <span className="las la-book"></span>
                </div>
            </div>

            <div onClick={() => handleRoute("/patient-documents")} className="card-single patientCard">
                <h2></h2>
                <span>Documents</span>
                <div>
                    <span className="las la-file-alt"></span>
                </div>
            </div>
        </div >
    )
}

export default DashboardCardsPA;