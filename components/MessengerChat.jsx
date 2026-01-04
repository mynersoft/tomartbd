"use client";

import Script from "next/script";

const PAGE_ID = process.env.NEXT_PUBLIC_FB_PAGE_ID;

export default function FacebookMessenger() {
  if (!PAGE_ID) return null;

  return (
    <>
      {/* FB root */}
      <div id="fb-root"></div>

      {/* Facebook SDK */}
      <Script
        id="facebook-jssdk"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.fbAsyncInit = function() {
              FB.init({
                xfbml: true,
                version: 'v19.0'
              });
            };

            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
          `,
        }}
      />

      {/* Messenger chat */}
      <div
        className="fb-customerchat"
        attribution="biz_inbox"
        page_id={PAGE_ID}
        theme_color="#0084ff"
        logged_in_greeting="Hi! How can we help you?"
        logged_out_greeting="Hi! Please log in to chat with us."
      ></div>
    </>
  );
}