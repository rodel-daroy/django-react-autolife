export const loadFacebook = () => {
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
      return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");

  window.fbAsyncInit = () => {
    window.FB.init({
      appId: "2009066502454251",
      cookie: true,
      // the session
      xfbml: true,
      version: "v2.10"
    });
  };
};