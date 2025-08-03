import { useEffect } from 'react';

export default function FacebookPagePlugin() {
  useEffect(() => {
    // Load Facebook SDK
    const loadFacebookSDK = () => {
      if (window.FB) return;
      
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: 'your-app-id', // Replace with your Facebook App ID
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    loadFacebookSDK();
  }, []);

  return (
    <div className="">
      <div 
        className="fb-page" 
        data-href="https://www.facebook.com/JBSUSA"
        data-tabs=""
        data-width="320"
        data-height="100"
        data-small-header="false"
        data-hide-cover="false"
        data-show-facepile="false"
        data-lazy="true"
      >
        <blockquote cite="https://www.facebook.com/JBSUSA" className="fb-xfbml-parse-ignore">
          <a href="https://www.facebook.com/JBSUSA">JBS Investment</a>
        </blockquote>
      </div>
    </div>
  );
} 