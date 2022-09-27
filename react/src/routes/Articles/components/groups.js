import memoizeOne from "memoize-one";

export const COMMON_GROUPS = [
  {
    title: "Recently added articles",
    shortTitle: "Recently added",
    mappingKey: "RECENT",
    isFeatured: true
  },
  {
    title: "Most popular articles",
    shortTitle: "Most popular",
    mappingKey: "POPULAR"
  }
];

export const USER_GROUPS = [
  {
    title: "Articles you've liked in the past",
    shortTitle: "Articles you've liked",
    mappingKey: "LIKED"
  },
  {
    title: "Articles you might like",
    shortTitle: "Articles you might like",
    mappingKey: "MIGHT_LIKE"
  }
];

const getLink = (mappingId, userRelated) => {
  let link = `/articles/allarticles/${mappingId}/`;
  if (userRelated) link += "?user_related";

  return link;
};

export const expandGroup = (group, mappingIds, userRelated = false) => {
  const mappingId = (mappingIds || {})[group.mappingKey];

  return {
    ...group,

    mappingId,
    link: getLink(mappingId, userRelated),
    userRelated
  };
};

export const expandCommonGroups = memoizeOne(mappingIds =>
  COMMON_GROUPS.map(g => expandGroup(g, mappingIds)).filter(g => !!g.mappingId)
);
export const expandUserGroups = memoizeOne(mappingIds =>
  USER_GROUPS.map(g => expandGroup(g, mappingIds)).filter(g => !!g.mappingId)
);

export const expandInterestGroups = memoizeOne(interests => {
  const activeInterests = (interests || []).filter(i => i.is_checked);

  return activeInterests.map(interest => ({
    title: `Because you like ${interest.name}`,
    mappingId: interest.id,
    userRelated: true,
    link: getLink(interest.id, true)
  }));
});

export const expandScoreGroups = memoizeOne(scoreMappingIds => {
  return Object.keys(scoreMappingIds).map(key => ({
    title: `Because you like ${key}`,
    mappingId: scoreMappingIds[key],
    userRelated: true,
    score: 1,
    link: getLink(scoreMappingIds[key], true)
  }));
});

export const expandAllGroups = memoizeOne(
  (mappingIds, loggedIn, interests, scoreMappingIds) => {
    let groups = expandCommonGroups(mappingIds);

    if (loggedIn) {
      groups = [
        ...groups,

        ...expandUserGroups(mappingIds),
        ...expandInterestGroups(interests),
        ...expandScoreGroups(scoreMappingIds)
      ];
    }

    return groups;
  }
);

export const getFeaturedMappingId = memoizeOne(mappingIds => {
  const featuredGroup = COMMON_GROUPS.find(g => g.isFeatured);

  return (mappingIds || {})[featuredGroup.mappingKey];
});

export const isCurrentGroup = (group, location, match) => {
  const {
    params: { mappingId: currentMappingId }
  } = match;

  const userRelated = location.search.indexOf("user_related") !== -1;

  return (
    group.mappingId == currentMappingId && group.userRelated === userRelated
  );
};
