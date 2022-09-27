import {
  timeTo12HrFormat,
  timeToMinutes,
  userLoggedInSession
} from "utils/format";
import { get } from "lodash/get";
import { isEmpty } from "lodash/isEmpty";

export const checkLoggedInSession = props => {
  console.log(props);
  const authToken = props.user.authUser.accessToken;
  const sessionTime = props.user.sessionTime;
  const loggedInTime = timeTo12HrFormat(sessionTime);
  const loggedTimeInMinutes = timeToMinutes(loggedInTime);
  const currentTime = timeTo12HrFormat(new Date().toLocaleTimeString());
  const currentTimeInMin = timeToMinutes(currentTime);
  const checkLogInSession = userLoggedInSession(
    currentTimeInMin,
    loggedTimeInMinutes
  );
  const params = { token: authToken };
  if (checkLogInSession) {
    props.refreshUserToken(params);
  } else if (authToken) props.verifyUserToken(params);
};
