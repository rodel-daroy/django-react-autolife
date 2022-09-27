import moment from "moment";

export const DRAFT_PUBLISH_STATE = 1;
export const READY_TO_PUBLISH_STATE = 2;
export const PUBLISHED_STATE = 3;
export const UNAVAILABLE_PUBLISH_STATE = 4;

export const PUBLISH_STATES = {
  [DRAFT_PUBLISH_STATE]: "Draft",
  [READY_TO_PUBLISH_STATE]: "Ready to Publish",
  [PUBLISHED_STATE]: "Published"
};

export const ALL_PUBLISH_STATES = {
  ...PUBLISH_STATES,
  [UNAVAILABLE_PUBLISH_STATE]: "Published but unavailable"
}

export const getEffectivePublishState = ({ publish_state, do_not_publish_until, unpublishing_on }) => {
  if(publish_state === PUBLISHED_STATE) {
    const currentDate = moment();

    if(do_not_publish_until && moment(do_not_publish_until).isAfter(currentDate))
      return UNAVAILABLE_PUBLISH_STATE;

    if(unpublishing_on && moment(unpublishing_on).isBefore(currentDate))
      return UNAVAILABLE_PUBLISH_STATE;
  }

  return publish_state;
};