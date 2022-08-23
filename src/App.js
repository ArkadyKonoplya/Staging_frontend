// Test Updated pipeline
import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import React, { useState, useEffect, useRef, useContext } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import TermsAndConditions from "./pages/Terms&Condi";
import ResetPassword from "./pages/ResetPassword";
// import Meeting from './pages/Meeting';

import PatientSignUp from "./pages/patients/PatientSignUp";
import PatientDash from "./pages/patients/PatientDash";
import PatientAppointments from "./pages/patients/PatientAppointments";
import PatientProfile from "./pages/patients/PatientProfile";
import DocumentsPa from "./pages/patients/DocumentsPa";
import PersonalJournal from "./pages/patients/PersonalJournal";
import ResourcesPa from "./pages/patients/PatientResources";
import EntryArchives from "./pages/patients/EntryArchives";
import Checkout from "./pages/patients/Checkout";

import ProviderSignUp from "./pages/providers/ProviderSignUp";
import ProviderAppointments from "./pages/providers/ProvAppointments";
import ProviderDash from "./pages/providers/ProviderDash";
import ProviderProfile from "./pages/providers/ProviderProfile";
import Notes from "./pages/providers/NotesPage";
import DocumentsProv from "./pages/providers/DocumentsPro";
import ResourcesProv from "./pages/providers/ProvResources";
import Patients from "./pages/providers/Patients";

import { localStorageHelper } from "./helpers/localStorage";
import { SubscriptionContext } from "./helpers/subscriptionContext";

function App() {
  const [userContext, setUserContext] = useState({});
  const [user] = useState(() => localStorageHelper.load("user"));

  useEffect(() => {
    setUserContext({
      is_approved: user?.is_approved || false,
      is_partner_account: user?.is_partner_account || false,
      is_subscribed: user?.is_subscribed || false,
      user_type: user?.type,
      is_identified: false
    });
  }, []);

  return (
    <Router>
      <Switch>
        {/* https://stackoverflow.com/questions/68042569/how-can-i-get-the-params-from-the-url-with-react */}
        {/* For email confirmation */}

        <SubscriptionContext.Provider value={{ userContext, setUserContext }}>
          <Route component={Login} exact path="/:email/:code" />

          {/* For regular login */}
          <Route component={Login} exact path="/" />
          <Route
            path="/reset-password/:email/:code"
            component={ResetPassword}
          ></Route>
          <Route path="/password-reset" component={ForgotPassword}></Route>
          <Route
            path="/termsAndConditions"
            component={TermsAndConditions}
          ></Route>
          <Route path="/provider-SignUp" component={ProviderSignUp}></Route>
          <Route path="/patient-SignUp" component={PatientSignUp}></Route>

          {/* <Route path='/launch-meeting' component={Meeting}></Route> */}

          <ProtectedRoute
            path="/patient-appointments"
            component={PatientAppointments}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/patient-documents"
            component={DocumentsPa}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/patient-resources"
            component={ResourcesPa}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/patient-profile"
            component={PatientProfile}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/patient-dashboard"
            component={PatientDash}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/patient-personalJournal"
            component={PersonalJournal}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/patient-entryArchives"
            component={EntryArchives}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/patient-checkout"
            component={Checkout}
          ></ProtectedRoute>

          <ProtectedRoute
            path="/provider-appointments"
            component={ProviderAppointments}
          ></ProtectedRoute>

          <ProtectedRoute
            path="/provider-dashboard"
            component={ProviderDash}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/provider-notes"
            component={Notes}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/provider-resources"
            component={ResourcesProv}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/provider-profile"
            component={ProviderProfile}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/provider-documents"
            component={DocumentsProv}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/provider-patients"
            component={Patients}
          ></ProtectedRoute>
        </SubscriptionContext.Provider>
      </Switch>
    </Router>
  );
}

export default App;
