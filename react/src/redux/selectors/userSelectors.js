import get from "lodash/get";

export const accessToken = state => get(state, "user.authUser.accessToken");