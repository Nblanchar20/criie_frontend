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
import Users from "../containers/users/Users";
import UsersForm from "../containers/users/Form";
import Projects from "../containers/projects/Projects";
import ProjectsForm from "../containers/projects/Form";
import ProjectsInfomation from "../containers/projects/Information";
import Roles from "../containers/roles/Roles";
import RolesForm from "../containers/roles/Form";
import UsersRolesForm from "../containers/projects/userRole/Form";
import ObjectivesForm from "../containers/projects/objectives/Form";
import DeliverablesForm from "../containers/projects/deliverables/Form";
import IndicatorsForm from "../containers/projects/indicators/Form";
import ActivitiesForm from "../containers/projects/indicators/activities/Form";
import ExpensesForm from "../containers/projects/indicators/activities/expenses/Form";
import Parameters from "../containers/settings/parameters/Parameters";
import ParametersForm from "../containers/settings/parameters/Form";
import Permissions from "../containers/settings/permissions/Permissions";
import PermissionsForm from "../containers/settings/permissions/Form";
import EditProfile from "../containers/accounts/EditProfile";
import ChangePasswordProfile from "../containers/accounts/ChangePassProfile";
import ForgetPassword from "../containers/accounts/ForgetPass";
import ChangePassword from "../containers/accounts/ChangePass";
import { encrypt } from "../utils/crypt";


const SwitchApp = () => {
  const location = useLocation();

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/sign-in" />
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
            <Route path="/projects/edit/:id" component={ProjectsInfomation} />
            <Route path="/projects/information/:id" component={ProjectsInfomation} />

            <Route path="/roles" exact component={Roles} />
            <Route path="/roles/create" component={RolesForm} />
            <Route path="/roles/edit/:id" component={RolesForm} />
            
            <Route path="/objectives/create/:id" component={ObjectivesForm} />
            <Route path="/objectives/edit/:id" component={ObjectivesForm} />
            
            <Route path="/usersroles/create" component={UsersRolesForm} />
            <Route path="/usersroles/edit/:id" component={UsersRolesForm} />

            <Route path="/deliverables/create/:id" component={DeliverablesForm} />
            <Route path="/deliverables/edit/:id" component={DeliverablesForm} />
            
            <Route path="/indicators/create/:id" component={IndicatorsForm} />
            <Route path="/indicators/edit/:id" component={IndicatorsForm} />

            <Route path="/activities/create/:id" component={ActivitiesForm} />
            <Route path="/activities/edit/:id" component={ActivitiesForm} />
            
            <Route path="/expenses/create" component={ExpensesForm} />
            <Route path="/expenses/edit/:id" component={ExpensesForm} />





            <Route path="/parameters" exact component={Parameters} />
            <Route path="/parameters/create" component={ParametersForm} />
            <Route path="/parameters/edit/:id" component={ParametersForm} />

            <Route path="/permissions" exact component={Permissions} />
            <Route path="/permissions/create" component={PermissionsForm} />
            <Route path="/permissions/edit/:id" component={PermissionsForm} />
            
          </Layout>
        </Switch>
      </Switch>
    </BrowserRouter>
  );
};

export default SwitchApp;
