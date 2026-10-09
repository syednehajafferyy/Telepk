(function () {
const BG_TRACKER_BASE_URL = "https://track.bixgrow.com/api";

// bg_ref is always tracked by default; this only returns extra identifiers
// configured by the merchant to migrate from other referral apps.
function bgGetExtraReferralIdentifiers() {
  try {
    const raw =
      typeof bgReferralIdentifiersRaw !== "undefined"
        ? bgReferralIdentifiersRaw
        : "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

let bgRefCode = bgGetParameterByName("bg_ref");
if (!bgRefCode) {
  for (const referralIdentifier of bgGetExtraReferralIdentifiers()) {
    bgRefCode = bgGetParameterByName(referralIdentifier);
    if (bgRefCode) break;
  }
}

let bgVisitorId = bgGetCookie("bgvisitor_id");
let affiliateId = bgGetCookie("bgaffilite_id");
let lastClick = bgGetCookie("bglast_click");

(function () {
  const PROPERTY_KEY = "_bg_aff";
  const PROPERTY_VALUE = bgRefCode || affiliateId;

  function injectHiddenInputs(form) {
    if (!form) return;

    const existingAffInput = form.querySelector(`input[name="properties[${PROPERTY_KEY}]"]`);

    if (PROPERTY_VALUE) {
      // Nếu có affiliate → thêm hoặc cập nhật giá trị
      if (!existingAffInput) {
        const hiddenAff = document.createElement("input");
        hiddenAff.type = "hidden";
        hiddenAff.name = `properties[${PROPERTY_KEY}]`;
        hiddenAff.value = PROPERTY_VALUE;
        form.appendChild(hiddenAff);
      } else {
        existingAffInput.value = PROPERTY_VALUE;
      }
    } else {
      if (existingAffInput) {
        existingAffInput.remove();
      }
    }

    // Xử lý Click ID
    const clickId = bgGetCookie("bgclick_id");
    const existingClickInput = form.querySelector('input[name="properties[_bg_click_id]"]');

    if (clickId) {
      if (!existingClickInput) {
        const hiddenClick = document.createElement("input");
        hiddenClick.type = "hidden";
        hiddenClick.name = "properties[_bg_click_id]";
        hiddenClick.value = clickId;
        form.appendChild(hiddenClick);
      } else {
        existingClickInput.value = clickId;
      }
    } else {
      if (existingClickInput) {
        existingClickInput.remove();
      }
    }
  }

  function attachToForms() {
    const forms = document.querySelectorAll('form[action*="/cart/add"]');
    forms.forEach((form) => {
      injectHiddenInputs(form);

      // Hook vào button để đảm bảo cập nhật input trước khi submit
      const buttons = form.querySelectorAll('button, input[type="submit"]');
      buttons.forEach((btn) => {
        if (btn._bg_hooked) return;
        btn._bg_hooked = true;
        btn.addEventListener("mousedown", () => injectHiddenInputs(form));
        btn.addEventListener("touchstart", () => injectHiddenInputs(form));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", attachToForms);
})();

applyAutomaticDiscount(bgRefCode, affiliateId);
if (bgRefCode) {
  if (bgVisitorId === "") {
    console.log(1);
    let payload = {
      aff_id: bgRefCode,
      event_type: "click",
      referral_site: document.referrer,
      destination_url: window.location.href,
    };
    bgPostEventOnce("click", payload);
  } else {
    if (affiliateId != bgRefCode) {
      console.log(2);
      let payload = {
        aff_id: bgRefCode,
        visitor_id: bgVisitorId,
        event_type: "click",
        referral_site: document.referrer,
        destination_url: window.location.href,
      };
      bgPostEventOnce("click", payload);
    } else {
      if (new Date().getTime() - lastClick > 60 * 1000) {
        console.log(3);
        let payload = {
          aff_id: bgRefCode,
          visitor_id: bgVisitorId,
          event_type: "click",
          referral_site: document.referrer,
          destination_url: window.location.href,
        };
        bgPostEventOnce("click", payload);
      }
    }
  }
}

var bgSetInterval = setInterval(function () {
  let currentShopifyCart = bgGetCookie("cart");
  if (
    bgGetCookie("bgvisitor_id") !== "" &&
    currentShopifyCart !== "" &&
    bgGetCookie("bgcart") != bgGetCookie("cart")
  ) {
    console.log("aaaaa");
    bgSetCookie("bgcart", currentShopifyCart, 100);
    clearInterval(bgSetInterval);
    let payload = {
      aff_id: bgGetCookie("bgaffilite_id"),
      visitor_id: bgGetCookie("bgvisitor_id"),
      event_type: "add_to_cart",
      cart_token: sanitizeCartCookie(currentShopifyCart),
      click_id: bgGetCookie("bgclick_id"),
    };
    bgPostEventOnce("add_to_cart", payload);
  }
}, 1000);

function sanitizeCartCookie(cartValue) {
  if (!cartValue) return cartValue;
  return cartValue.split("?")[0];
}

async function bgPostEvent(data) {
  const apiURl = `${BG_TRACKER_BASE_URL}/bg_trackv2`;
  try {
    const response = await fetch(apiURl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log("Bixgrow - network response was not ok");
    }

    const responseData = await response.json();
    if (
      responseData.event_type == "click" &&
      typeof responseData.visitor_id !== "undefined"
    ) {
      bgSetCookieByUnixTime(
        "bgvisitor_id",
        responseData.visitor_id,
        responseData.expire_at
      );
      bgSetCookieByUnixTime(
        "bgaffilite_id",
        data.aff_id,
        responseData.expire_at
      );
      bgSetCookieByUnixTime(
        "bglast_click",
        new Date().getTime(),
        responseData.expire_at
      );
      bgSetCookieByUnixTime(
        "bgexpire_time",
        responseData.expire_at,
        responseData.expire_at
      );
      bgSetCookieByUnixTime(
        "bgclick_id",
        responseData.click_id,
        responseData.expire_at
      );
    } else if (responseData.event_type == "add_to_cart") {
      clearInterval(bgSetInterval);
    }
  } catch (error) {
    console.error("Bixgrow - error:", error);
  }
}

function bgSetCookieByUnixTime(cname, cvalue, unixTime) {
  var d = new Date(unixTime * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

console.log(
  `%c ► Bixgrow:App embed tracker`,
  "background-color: #f90; color: #fff; padding: 5px;"
);

async function applyAutomaticDiscount(bgRefCode, affiliateIdFromCookies) {
  let affiliateId = bgRefCode || affiliateIdFromCookies;
  if (!affiliateId) {
    return 1;
  }
  const apiURl = `${BG_TRACKER_BASE_URL}/automatic-coupon-customer?shop=${Shopify.shop}&affiliateId=${affiliateId}`;
  try {
    const response = await fetch(apiURl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.log("Bixgrow - network response was not ok");
    }

    const responseData = await response.json().catch(() => null);
    if (!responseData) {
      return;
    }
    if (responseData?.couponCode) {
      autoAppliedCoupon(responseData?.couponCode);
    }
  } catch (error) {
    console.error("Bixgrow - error:", error);
  }
}

async function autoAppliedCoupon(discountCode) {
  discountCode = encodeURIComponent(discountCode);
  try {
    const url = `${window.location.origin}/discount/${discountCode}`;
    await bgUseFetch(url, "GET");
  } catch (error) {
    console.log(error);
  }
}

async function bgUseFetch(
  url,
  method = "GET",
  params = null,
  headers = { "Content-Type": "application/json" }
) {
  try {
    const options = {
      method: method,
      headers: {
        ...headers,
      },
    };
    if (params) {
      if (method == "GET") {
        const queryString = new URLSearchParams(params).toString();
        url += "?" + queryString;
      } else {
        options.body = JSON.stringify(params);
      }
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responseData = await response.json().catch(() => null);
    if (responseData) {
      return responseData;
    }
  } catch (error) {
    throw error;
  }
}

function bgGetCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function bgSetCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function bgGetParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function bgPostEventOnce(eventType, payload) {
  const appKey = `bg_flag_app_${eventType}`;
  const pixelKey = `bg_flag_pixel_${eventType}`;

  // Nếu pixel đã gọi → xóa cờ pixel, skip API
  if (localStorage.getItem(pixelKey) === "called") {
    console.log(`[AppEmbed] Pixel handled ${eventType}, skip`);
    localStorage.removeItem(pixelKey);
    return;
  }

  localStorage.setItem(appKey, "called");
  return bgPostEvent(payload);
}
})();
