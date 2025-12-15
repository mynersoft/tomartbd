"use client";

import { useEffect } from "react";

export default function MessengerChat({ pageId }) {
  useEffect(() => {
    if (document.getElementById("facebook-jssdk")) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: "v19.0",
      });
    };

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src =
      "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div id="fb-root"></div>

      <div
        className="fb-customerchat"
        attribution="biz_inbox"
        page_id={pageId}
        theme_color="#2563eb"
        logged_in_greeting="Hi 👋 How can we help you?"
        logged_out_greeting="Hi 👋 Please message us"
      ></div>
    </>
  );
}