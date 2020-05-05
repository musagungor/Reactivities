import React, {  useEffect, Fragment,  useContext } from "react";
import { Container } from "semantic-ui-react";
import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import NavBar from "../../features/nav/NavBar";

const App = () => {

  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) {
    return <LoadingComponent content='Loading activities...' />
  }

  return (
    <Fragment>
      <NavBar />
      <Container className="margin-top-7">    
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
};

export default observer(App) ;
