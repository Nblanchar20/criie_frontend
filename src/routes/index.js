import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import SignIn from "../containers/SignIn";
import Layout from "../containers/Layout";
import Actions from "../containers/settings/Actions";
import Sessions from "../containers/settings/Sessions";
import Modules from "../containers/settings/modules/Modules";
import ModulesForm from "../containers/settings/modules/Form";
import UserGroups from "../containers/settings/userGroups/UserGroups";
import FormUserGroups from "../containers/settings/userGroups/Form";

// Vistas utilizadas 
import Users from "../containers/settings/users/Users";
import UsersForm from "../containers/settings/users/Form";
import Projects from "../containers/projects/Projects";
import ProjectsForm from "../containers/projects/Form";
import ProjectsInfomation from "../containers/projects/Information";
import ObjectivesForm from "../containers/projects/objectives/Form";
import BudgetsForm from "../containers/projects/budgets/Form";
import DeliverablesForm from "../containers/projects/deliverables/Form";
import IndicatorsForm from "../containers/projects/indicators/Form";
import ActivitiesForm from "../containers/projects/indicators/activities/Form";

import Parameters from "../containers/settings/parameters/Parameters";
import ParametersForm from "../containers/settings/parameters/Form";
import Permissions from "../containers/settings/permissions/Permissions";
import PermissionsForm from "../containers/settings/permissions/Form";
import EditProfile from "../containers/accounts/EditProfile";
import ChangePasswordProfile from "../containers/accounts/ChangePassProfile";
import ForgetPassword from "../containers/accounts/ForgetPass";
import ChangePassword from "../containers/accounts/ChangePass";
import ApproveList from "../containers/approve/ApproveList";
import SpotsManageList from "../containers/spots/manage/SpotsManageList";
import SpotsManageForm from "../containers/spots/manage/SpotsManageForm";
import SpotsAppointmentList from "../containers/spots/appointment/SpotsAppointmentList";
import SpotsAppointmentForm from "../containers/spots/appointment/SpotsAppointmentForm";
import AppointmentManageList from "../containers/spots/appointmentmanage/AppointmentManageList";
import AppointmentManageForm from "../containers/spots/appointmentmanage/AppointmentManageForm";
import LudicResourcesManageList from "../containers/ludicresources/manage/LudicResourcesManageList";
import LudicResourcesManageForm from "../containers/ludicresources/manage/LudicResourcesManageForm";
import LudicExistenceManageform from "../containers/ludicresources/manage/LudicExistenceManageform";
import LudicAppointmentList from "../containers/ludicresources/appointment/LudicAppointmentList";
import LudicAppointmentForm from "../containers/ludicresources/appointment/LudicAppointmentForm";
import LudicAppointmentManageList from "../containers/ludicresources/appointmentmanage/LudicAppointmentManageList";
import LudicAppointmentManageForm from "../containers/ludicresources/appointmentmanage/LudicAppointmentManageForm";
import Logs from "../containers/log/Logs";

const SwitchApp = () => {
  const location = useLocation();

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="sign-in" />
        </Route>
        <Switch location={location} key={location.pathname}>
          <Route path="/sign-in" component={SignIn} />
          <Route path="/account/forget" exact component={ForgetPassword} />
          <Route
            path="/account/forget/:userId"
            exact
            component={ChangePassword}
          />

          <Layout>
            <Route path="/profile/edit/:id" component={EditProfile} />
            <Route
              path="/profile/password/:id"
              component={ChangePasswordProfile}
            />

            <Route path="/actions" exact component={Actions} />
            <Route path="/sessions" exact component={Sessions} />

            <Route path="/modules" exact component={Modules} />
            <Route path="/modules/create" component={ModulesForm} />
            <Route path="/modules/edit/:id" component={ModulesForm} />

            <Route path="/userGroups" exact component={UserGroups} />
            <Route path="/userGroups/create" component={FormUserGroups} />
            <Route path="/userGroups/edit/:id" component={FormUserGroups} />

            {/* Rutas ulitizadas */}
            <Route path="/users" exact component={Users} />
            <Route path="/users/create" component={UsersForm} />
            <Route path="/users/edit/:id" component={UsersForm} />
            
            <Route path="/projects" exact component={Projects} />
            <Route path="/projects/create" component={ProjectsForm} />
            <Route path="/projects/edit/:id" component={ProjectsForm} />
            <Route path="/projects/information/:id" component={ProjectsInfomation} />
            
            <Route path="/objectives/create" component={ObjectivesForm} />
            <Route path="/objectives/edit/:id" component={ObjectivesForm} />

            <Route path="/deliverables/create" component={DeliverablesForm} />
            <Route path="/deliverables/edit/:id" component={DeliverablesForm} />

            <Route path="/budgets/create" component={BudgetsForm} />
            <Route path="/budgets/edit/:id" component={BudgetsForm} />
            
            <Route path="/indicators/create" component={IndicatorsForm} />
            <Route path="/indicators/edit/:id" component={IndicatorsForm} />

            <Route path="/activities/create" component={ActivitiesForm} />
            <Route path="/activities/edit/:id" component={ActivitiesForm} />





            <Route path="/parameters" exact component={Parameters} />
            <Route path="/parameters/create" component={ParametersForm} />
            <Route path="/parameters/edit/:id" component={ParametersForm} />

            <Route path="/permissions" exact component={Permissions} />
            <Route path="/permissions/create" component={PermissionsForm} />
            <Route path="/permissions/edit/:id" component={PermissionsForm} />

            <Route path="/approve" exact component={ApproveList} />
            <Route path="/spots" exact component={SpotsManageList} />
            <Route path="/spots/create" exact component={SpotsManageForm} />
            <Route path="/spots/edit/:id" component={SpotsManageForm} />
            <Route
              path="/reserve/spots"
              exact
              component={SpotsAppointmentList}
            />
            <Route path="/reserve/spot/:id" component={SpotsAppointmentForm} />

            <Route
              path="/reserves/spots"
              exact
              component={AppointmentManageList}
            />

            <Route
              path="/reserves/spots/:id"
              component={AppointmentManageForm}
            />

            <Route path="/ludic" exact component={LudicResourcesManageList} />
            <Route
              path="/ludic/create"
              exact
              component={LudicResourcesManageForm}
            />
            <Route
              path="/ludic/edit/:id"
              component={LudicResourcesManageForm}
            />
            <Route
              path="/ludic/existence/:id"
              component={LudicExistenceManageform}
            />
            <Route
              path="/reserve/ludic"
              exact
              component={LudicAppointmentList}
            />
            <Route path="/reserve/ludic/:id" component={LudicAppointmentForm} />
            <Route path="/reserves/ludic" exact component={LudicAppointmentManageList} />
            <Route path="/reserves/ludic/:id" component={LudicAppointmentManageForm} />

            <Route path="/logs" exact component={Logs} />
          </Layout>
        </Switch>
      </Switch>
    </BrowserRouter>
  );
};

export default SwitchApp;
