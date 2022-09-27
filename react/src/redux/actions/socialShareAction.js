export const socialShare = url => {
  return fetch("https://api.prerender.io/recache", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      prerenderToken: "14QiaL8pfcKsnDHP4Hzk",
      url
    })
  });
};
