import {
  addCustomCSS,
  bgGetCookie,
  bgSetCookie,
  LANGUAGE_SLUGS,
  loadFont,
  setCssProperties,
  addRTLCSS,
  isRTL,
} from "./bixgrow_helper.js";

var bixgrowReferralUrl = "https://api.bixgrow.com";
var bixgrowTrackingUrl = "https://track.bixgrow.com";
var BG_AFFILIATE_API_BASE_URL = "https://aff-api.bixgrow.com";

// var bixgrowReferralUrl = "http://127.0.0.1:8002";
// var bixgrowTrackingUrl = "http://127.0.0.1:8002";
// var BG_AFFILIATE_API_BASE_URL = "http://127.0.0.1:8002";

var GET_REFERRAL_INFO_URL = `${BG_AFFILIATE_API_BASE_URL}/api/referral/info`;
var GET_INVITE_LINK_URL = `${bixgrowReferralUrl}/api/referral/advocates/register`;
var BG_REFERRAL_INFO_WIDGET_CACHE_TTL_MS = 60 * 1000;
let widgetVersion = null;
let campaign = null;
var myDataSetting = null;

function getReferralInfoCacheKey() {
  return `bg_referral_info:${Shopify.shop}:widget:${Shopify.locale}`;
}

function readReferralInfoCache() {
  try {
    const cached = sessionStorage.getItem(getReferralInfoCacheKey());
    if (!cached) return null;
    const { data, expiresAt } = JSON.parse(cached);
    if (Date.now() >= expiresAt) return null;
    return data;
  } catch (error) {
    return null;
  }
}

function writeReferralInfoCache(data) {
  try {
    sessionStorage.setItem(
      getReferralInfoCacheKey(),
      JSON.stringify({ data, expiresAt: Date.now() + BG_REFERRAL_INFO_WIDGET_CACHE_TTL_MS }),
    );
  } catch (error) {
    // sessionStorage unavailable (private mode/quota) - skip caching
  }
}

// API function to retrieve style and text data
async function fetchReferralPopupData() {
  const cached = readReferralInfoCache();
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      shop: Shopify.shop,
      type: "widget",
      customer_id: __st.cid,
      url: window.location.href,
      locale: Shopify.locale,
    });

    const response = await fetch(
      `${GET_REFERRAL_INFO_URL}?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    writeReferralInfoCache(data);
    return data;
  } catch (error) {
    console.error("Error fetching referral popup data:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchReferralPopupData();
  widgetVersion = data?.widget_version ? Number(data?.widget_version) : null;
  campaign = data;

  if (widgetVersion === 2) {
    const FB_ICON = /* HTML */ `<svg
      aria-hidden="true"
      focusable="false"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      data-prefix="fab"
      data-icon="facebook-f"
      viewBox="0 0 264 512"
      width="15px"
      height="15px"
    >
      <path
        fill="#FFF"
        d="M215.8 85H264V3.6C255.7 2.5 227.1 0 193.8 0 124.3 0 76.7 42.4 76.7 120.3V192H0v91h76.7v229h94V283h73.6l11.7-91h-85.3v-62.7c0-26.3 7.3-44.3 45.1-44.3z"
      ></path>
    </svg>`;

    const MESENGER_ICON = /* HTML */ `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FFF"
        d="M12 2C6.48 2 2 6.01 2 11.25c0 2.77 1.18 5.29 3.09 7.05-.13.94-.52 3.32-.55 3.54-.04.3.27.43.52.28.23-.13 3.03-2.35 3.52-2.73A9.64 9.64 0 0 0 12 20c5.52 0 10-4.01 10-9.25S17.52 2 12 2zm1.46 12.19l-2.5-2.64-4.27 2.64 4.46-4.73 2.5 2.64 4.27-2.64-4.46 4.73z"
      />
    </svg>`;

    const X_ICON = /* HTML */ `<svg
      aria-hidden="true"
      focusable="false"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      data-prefix="fab"
      data-icon="twitter"
      viewBox="0 0 50 50"
      width="15px"
      height="15px"
    >
      <path
        fill="#FFF"
        d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"
      ></path>
    </svg>`;

    const EMAIL_ICON = /* HTML */ `<svg
      aria-hidden="true"
      focusable="false"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      data-prefix="fas"
      data-icon="envelope"
      viewBox="0 0 512 512"
      width="15px"
      height="15px"
    >
      <path
        fill="#FFF"
        d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"
      ></path>
    </svg>`;

    const WA_ICON = /* HTML */ `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#FFF"
          d="M12 2a10 10 0 0 0-8.66 15l-1.1 4.02a.5.5 0 0 0 .62.62L6.9 20.5A10 10 0 1 0 12 2zm0 18a7.93 7.93 0 0 1-4.05-1.1l-.29-.17-2.38.65.64-2.32-.19-.3A8 8 0 1 1 12 20zm4.39-5.73c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.42-1.35-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42l-.46-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.15 1.53.09.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"
        />
      </svg>
    `;

    const CHECKMARK_SVG = /* HTML */ `<svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>`;

    const Gift = ({ color, height, width }) => {
      return /* HTML */ `
        <svg
          width=${width}
          height=${height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.667 8.41727H23.1124C23.3302 8.02945 23.4829 7.60479 23.5468 7.15089C23.6844 6.18892 23.4385 5.23236 22.8567 4.45563C22.2739 3.67782 21.4235 3.17409 20.4615 3.03651C19.5027 2.9011 18.5428 3.14484 17.7661 3.72657C17.0121 4.29206 16.4379 5.0222 16.0002 5.76535C15.5625 5.02328 14.9884 4.29206 14.2344 3.72766C13.4576 3.14484 12.4999 2.90218 11.539 3.03759C10.577 3.17517 9.72653 3.67891 9.14477 4.45563C8.56192 5.23236 8.316 6.19 8.45359 7.15089C8.51859 7.60479 8.67026 8.03161 8.88585 8.41727H7.3334C4.94353 8.41727 3 10.3607 3 12.7505V14.9171C3 16.112 3.97177 17.0837 5.1667 17.0837V23.5835C5.1667 26.5702 7.59666 29 10.5835 29H14.9169C15.516 29 16.0002 28.5147 16.0002 27.9167C16.0002 27.3187 15.516 26.8334 14.9169 26.8334H10.5835C8.79159 26.8334 7.3334 25.3753 7.3334 23.5835V17.0837H19.2503C19.8494 17.0837 20.3336 16.5984 20.3336 16.0004C20.3336 15.4024 19.8494 14.9171 19.2503 14.9171H5.1667V12.7505C5.1667 11.5556 6.13847 10.5839 7.3334 10.5839H12.0915H12.0969H12.1034H19.8949H19.9014H19.9068H24.6649C25.8598 10.5839 26.8316 11.5556 26.8316 12.7505V14.9171C26.2325 14.9171 25.7482 15.4024 25.7482 16.0004C25.7482 16.5984 26.2325 17.0837 26.8316 17.0837C28.0265 17.0837 28.9983 16.112 28.9983 14.9171V12.7505C28.9983 10.3607 27.0547 8.41727 24.6649 8.41727H24.667ZM19.065 5.46094C19.3781 5.22586 19.767 5.12511 20.1549 5.18253C20.5427 5.23778 20.8872 5.44144 21.1234 5.7556C21.3596 6.06975 21.4581 6.45649 21.4029 6.84431C21.3476 7.23322 21.144 7.57663 20.7951 7.83879C20.755 7.8702 20.3943 8.13994 19.6923 8.41619H17.1919C17.4324 7.59613 18.0044 6.25608 19.0661 5.45985L19.065 5.46094ZM11.1706 7.81279C10.8575 7.57663 10.6528 7.23322 10.5986 6.84431C10.5434 6.45649 10.642 6.06975 10.8792 5.75451C11.1143 5.44036 11.4577 5.23669 11.8466 5.18145C12.2302 5.12511 12.6223 5.22478 12.9365 5.46094C13.9982 6.25716 14.5691 7.59613 14.8107 8.41727H12.3103C11.6083 8.14103 11.2443 7.86912 11.1728 7.81279H11.1706ZM28.9398 21.0182C29.0828 21.4104 28.9658 21.8502 28.6462 22.1189L26.2964 24.0331L27.2681 26.9926C27.4014 27.3935 27.266 27.8344 26.9312 28.0911C26.5965 28.3478 26.136 28.3663 25.7829 28.1366L23.0485 26.3557L20.3596 28.155C20.1928 28.2666 19.9999 28.3229 19.8071 28.3229C19.5969 28.3229 19.3879 28.2569 19.2113 28.1247C18.8733 27.8723 18.7335 27.4335 18.8592 27.0316L19.793 24.0363L17.4324 22.1156C17.115 21.8459 16.9991 21.4071 17.1431 21.0161C17.2862 20.625 17.6588 20.365 18.0748 20.365H21.0551L22.1103 17.4054C22.2544 17.0165 22.626 16.7587 23.0409 16.7587C23.4558 16.7587 23.8274 17.0165 23.9715 17.4054L25.0267 20.365H28.007C28.4241 20.365 28.7968 20.6272 28.9398 21.0182Z"
            fill=${color}
          />
        </svg>
      `;
    };

    const Medal = ({ color, height, width }) => {
      return /* HTML */ `
        <svg
          width=${width}
          height=${height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.0171 25.9183L25.3143 18.512C26.5263 16.7244 27.2352 14.5692 27.2352 12.2514C27.2352 6.08424 22.2178 1.06689 16.0507 1.06689C9.8835 1.06689 4.86615 6.08424 4.86615 12.2514C4.86615 14.5692 5.57503 16.7246 6.78727 18.5124L3.08402 25.9183C2.94844 26.1896 2.96302 26.5116 3.1223 26.7696C3.2818 27.0275 3.56345 27.1847 3.86673 27.1847H8.11527L10.6644 30.5836C10.8307 30.805 11.0905 30.9336 11.3644 30.9336C11.7274 30.9336 12.0133 30.7171 12.1471 30.4498L15.658 23.4282C15.7884 23.4327 15.9192 23.4359 16.0507 23.4359C16.1821 23.4359 16.3129 23.4327 16.4433 23.4282L19.9542 30.4498C20.0875 30.7166 20.3737 30.9336 20.7369 30.9336C21.0106 30.9336 21.2706 30.805 21.4367 30.5836L23.986 27.1847H28.2346C28.5379 27.1847 28.8195 27.0275 28.9788 26.7696C29.1383 26.5116 29.1529 26.1896 29.0171 25.9183ZM11.2151 28.4008L9.25277 25.7847C9.08757 25.5644 8.82826 25.4347 8.55277 25.4347H5.28246L7.99769 20.0047C9.53942 21.6052 11.5519 22.7493 13.8103 23.2103L11.2151 28.4008ZM6.61615 12.2514C6.61615 7.04925 10.8485 2.81689 16.0507 2.81689C21.2528 2.81689 25.4852 7.04925 25.4852 12.2514C25.4852 17.4535 21.2528 21.6859 16.0507 21.6859C10.8485 21.6859 6.61615 17.4535 6.61615 12.2514ZM23.5483 25.4347C23.273 25.4347 23.0137 25.5644 22.8483 25.7847L20.8862 28.4008L18.2908 23.2103C20.5494 22.7491 22.5621 21.6052 24.1038 20.0043L26.8186 25.4345H23.5483V25.4347Z"
            fill=${color}
          />
          <path
            d="M20.5172 13.7024L22.9608 10.7857C23.1545 10.5547 23.2156 10.2402 23.1224 9.95355C23.0292 9.66667 22.7949 9.44814 22.5026 9.375L18.8114 8.45169L16.7923 5.22627C16.6323 4.97061 16.3521 4.81543 16.0506 4.81543C15.7491 4.81543 15.4689 4.97061 15.3089 5.22627L13.2902 8.45169L9.59929 9.375C9.30671 9.44814 9.07246 9.66667 8.97927 9.95332C8.8863 10.2402 8.94714 10.5547 9.14082 10.7857L11.5844 13.7024L11.3215 17.4979C11.3008 17.7987 11.4361 18.089 11.6799 18.2663C12.0502 18.5354 12.4269 18.408 12.5214 18.37L16.0506 16.9476L19.5798 18.3702C19.8593 18.4827 20.1772 18.4436 20.421 18.2665C20.6651 18.0892 20.8004 17.7989 20.7797 17.4981L20.5172 13.7024ZM18.9493 12.8488C18.8039 13.0224 18.7314 13.2453 18.7471 13.4711L18.9374 16.2244L16.3778 15.1926C16.0941 15.0782 15.8453 15.1434 15.7236 15.1926L13.164 16.2244L13.3547 13.4713C13.3702 13.2455 13.2978 13.0224 13.1524 12.8488L11.38 10.7335L14.0572 10.0638C14.2769 10.0089 14.4665 9.87106 14.5866 9.6792L16.0508 7.33971L17.5153 9.6792C17.6354 9.87106 17.825 10.0089 18.0446 10.0638L20.7218 10.7335L18.9493 12.8488Z"
            fill=${color}
          />
        </svg>
      `;
    };

    const Crown = ({ color, height, width }) => {
      return /* HTML */ `
        <svg
          width=${width}
          height=${height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 8.24805C32 6.49536 30.5623 5.06934 28.7954 5.06934C27.0283 5.06934 25.5906 6.49536 25.5906 8.24805C25.5906 9.26392 26.0742 10.1694 26.8245 10.7517L20.7786 15.0996L17.3418 9.02588C18.397 8.50513 19.124 7.4248 19.124 6.17847C19.124 4.42578 17.6865 3 15.9194 3C14.1523 3 12.7148 4.42578 12.7148 6.17847C12.7148 7.43994 13.4595 8.53198 14.5354 9.04517L11.3633 15.1064L5.15894 10.5352C5.9187 9.95337 6.40942 9.04199 6.40942 8.01855C6.40942 6.26587 4.97168 4.83984 3.20459 4.83984C1.43774 4.83984 0 6.26587 0 8.01855C0 9.51611 1.05005 10.7744 2.45801 11.1089L6.06567 24.8804V28.0764C6.06567 28.5942 6.48535 29.0139 7.00317 29.0139H25.2595C25.7771 29.0139 26.197 28.5942 26.197 28.0764V24.874L29.5513 11.3364C30.9546 10.9983 32 9.74243 32 8.24805ZM28.7954 6.94434C29.5286 6.94434 30.125 7.52905 30.125 8.2478C30.125 8.9668 29.5286 9.55151 28.7954 9.55151C28.062 9.55151 27.4656 8.96655 27.4656 8.2478C27.4656 7.52905 28.062 6.94434 28.7954 6.94434ZM15.9194 4.875C16.6526 4.875 17.249 5.45972 17.249 6.17847C17.249 6.89404 16.6577 7.47632 15.9292 7.48169C15.9265 7.48145 15.9238 7.48145 15.9211 7.48145C15.9163 7.48145 15.9111 7.48145 15.9062 7.48145C15.179 7.47461 14.5896 6.89307 14.5896 6.17847C14.5896 5.45972 15.186 4.875 15.9194 4.875ZM1.875 8.01855C1.875 7.29956 2.47144 6.71484 3.20459 6.71484C3.93799 6.71484 4.53442 7.29956 4.53442 8.01855C4.53442 8.7373 3.93799 9.32202 3.20459 9.32202C2.47144 9.32202 1.875 8.7373 1.875 8.01855ZM7.94067 27.1389V25.6978L24.322 25.6973V27.1389H7.94067ZM24.5259 23.8223L7.72705 23.8228L4.78369 12.5874L11.1309 17.2642C11.3511 17.4265 11.6313 17.4846 11.8977 17.4231C12.1643 17.3616 12.3909 17.1865 12.5176 16.9441L15.9534 10.3794L19.6616 16.9326C19.7927 17.1643 20.0161 17.3293 20.2764 17.3865C20.5364 17.4436 20.8086 17.3875 21.0249 17.2319L27.272 12.7393L24.5259 23.8223Z"
            fill=${color}
          />
        </svg>
      `;
    };

    const Celebration = ({ color, height, width }) => {
      return /* HTML */ `
        <svg
          width=${width}
          height=${height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.2699 9.6118C9.81913 9.161 9.05013 9.32582 8.82556 9.92461L1.3682 29.8108C1.10401 30.5153 1.79391 31.2071 2.49969 30.9423C3.49848 30.5678 21.5845 23.7855 22.3858 23.485C22.9819 23.2616 23.1518 22.4937 22.6987 22.0407L10.2699 9.6118ZM9.99203 11.8198L13.6036 15.4313C13.8535 18.4347 14.9661 21.322 16.7803 23.7098L13.0208 25.1196C10.2087 22.1945 8.77359 18.1047 9.15583 14.0497L9.99203 11.8198ZM7.62252 27.144C6.75556 26.1593 6.03449 25.0619 5.47256 23.8717L7.59493 18.212C8.12206 21.1068 9.42224 23.6965 11.2459 25.7852L7.62252 27.144ZM4.653 26.0572C5.02071 26.6649 5.42908 27.2462 5.87601 27.799L3.69288 28.6176L4.653 26.0572ZM18.5078 23.062C17.1898 21.4584 16.2437 19.5721 15.7361 17.5638L20.4907 22.3184L18.5078 23.062Z"
            fill=${color}
          />
          <path
            d="M21.7316 17.4148C22.0748 17.758 22.6312 17.758 22.9744 17.4148C26.2808 14.1084 29.5003 15.1306 29.5324 15.1413C29.9929 15.2947 30.4906 15.0459 30.6441 14.5854C30.7977 14.1251 30.5487 13.6273 30.0883 13.4737C29.915 13.416 25.7976 12.1058 21.7316 16.1719C21.3883 16.515 21.3883 17.0716 21.7316 17.4148Z"
            fill=${color}
          />
          <path
            d="M14.8956 10.579C15.2388 10.9222 15.7953 10.9222 16.1385 10.579C20.2045 6.51298 18.8943 2.39561 18.8366 2.2223C18.6831 1.76184 18.1853 1.51289 17.7249 1.66646C17.2645 1.81997 17.0156 2.31769 17.1691 2.77815C17.1798 2.81032 18.202 6.02979 14.8956 9.33615C14.5524 9.67931 14.5524 10.2358 14.8956 10.579Z"
            fill=${color}
          />
          <path
            d="M18.0025 12.4435C17.6593 12.7867 17.6593 13.3431 18.0025 13.6863C18.3426 14.0264 18.8952 14.0309 19.2402 13.6915C19.6942 13.4653 21.1034 14.3138 21.8866 13.5309C22.6613 12.7562 21.8382 11.3756 22.0438 10.8918C22.5283 10.6856 23.9083 11.5092 24.683 10.7345C25.458 9.9597 24.6348 8.57914 24.8404 8.09524C25.3255 7.88907 26.7048 8.71273 27.4796 7.93799C28.2545 7.16319 27.4313 5.78263 27.6369 5.29873C28.1192 5.09361 29.5019 5.9154 30.2762 5.14142C31.059 4.35848 30.2121 2.94675 30.4367 2.49508C30.7747 2.1515 30.7729 1.59894 30.4314 1.25742C30.0883 0.914195 29.5318 0.914195 29.1886 1.25742C28.4959 1.95013 28.6314 2.92806 28.7619 3.62721C28.0627 3.49673 27.0848 3.36121 26.3921 4.05387C25.6994 4.74658 25.8349 5.72451 25.9654 6.42367C25.2663 6.29324 24.2883 6.15761 23.5956 6.85038C22.9029 7.54309 23.0385 8.52102 23.169 9.22018C22.4697 9.08969 21.4918 8.95412 20.7992 9.64683C20.1064 10.3395 20.242 11.3175 20.3724 12.0166C19.6732 11.8863 18.6951 11.7507 18.0025 12.4435Z"
            fill=${color}
          />
          <path
            d="M22.9744 4.98613C23.3176 4.64291 23.3176 4.08648 22.9744 3.74326C22.6312 3.40003 22.0748 3.40003 21.7315 3.74326C21.3883 4.08648 21.3883 4.64291 21.7315 4.98613C22.0747 5.32935 22.6312 5.32935 22.9744 4.98613Z"
            fill=${color}
          />
          <path
            d="M28.5673 11.4579C29.0527 11.4579 29.4462 11.0644 29.4462 10.579C29.4462 10.0937 29.0527 9.7002 28.5673 9.7002C28.082 9.7002 27.6885 10.0937 27.6885 10.579C27.6885 11.0644 28.082 11.4579 28.5673 11.4579Z"
            fill=${color}
          />
          <path
            d="M26.7027 18.6578C26.3595 19.001 26.3595 19.5575 26.7027 19.9007C27.0459 20.2439 27.6024 20.2439 27.9456 19.9007C28.2888 19.5575 28.2888 19.001 27.9456 18.6578C27.6024 18.3146 27.0459 18.3146 26.7027 18.6578Z"
            fill=${color}
          />
          <path
            d="M14.2742 6.22881C14.6174 5.88558 14.6174 5.32915 14.2742 4.98593C13.931 4.64271 13.3746 4.64271 13.0313 4.98593C12.6881 5.32909 12.6881 5.88558 13.0313 6.22881C13.3746 6.57203 13.9311 6.57203 14.2742 6.22881Z"
            fill=${color}
          />
        </svg>
      `;
    };

    const Star = ({ color, height, width }) => {
      return /* HTML */ `
        <svg
          width=${width}
          height=${height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5528 19.9261L10.1323 19.8185L8.97309 16.5987C8.76291 16.015 8.22622 15.6378 7.60584 15.6378C6.98534 15.6378 6.44866 16.015 6.23866 16.5987L5.07941 19.8185L1.65884 19.9261C1.03878 19.9456 0.514281 20.3395 0.322593 20.9296C0.130906 21.5195 0.323718 22.1466 0.813968 22.5268L3.51791 24.6244L2.56328 27.9106C2.39016 28.5065 2.60266 29.1271 3.10459 29.4917C3.60659 29.8565 4.26247 29.8668 4.77547 29.518L7.60597 27.5946L10.4364 29.518C10.6864 29.6879 10.9703 29.7726 11.2538 29.7725C11.5521 29.7725 11.85 29.6787 12.1073 29.4917C12.6093 29.127 12.8218 28.5064 12.6487 27.9107L11.694 24.6244L14.3981 22.5268C14.8882 22.1465 15.0811 21.5195 14.8893 20.9296C14.6975 20.3396 14.173 19.9457 13.5528 19.9261ZM10.5195 23.637C10.1852 23.8963 10.0454 24.3265 10.1635 24.733L11.1718 28.2041L8.18222 26.1725C8.00716 26.0535 7.80653 25.994 7.60591 25.994C7.40534 25.994 7.20472 26.0535 7.02972 26.1725L4.03997 28.2041L5.04834 24.733C5.16641 24.3265 5.02653 23.8963 4.69216 23.6369L1.83603 21.4213L5.44878 21.3077C5.87191 21.2945 6.23791 21.0286 6.38134 20.6303L7.60584 17.2294L8.83034 20.6303C8.97372 21.0286 9.33978 21.2945 9.76272 21.3077L13.3757 21.4213L10.5195 23.637ZM31.6774 20.9296C31.4857 20.3396 30.9612 19.9457 30.341 19.9261L26.9205 19.8185L25.7613 16.5988C25.5512 16.015 25.0145 15.6378 24.3941 15.6378C23.7737 15.6378 23.237 16.015 23.0268 16.5987L21.8676 19.8185L18.447 19.9261C17.827 19.9456 17.3025 20.3395 17.1108 20.9296C16.9191 21.5195 17.1119 22.1465 17.6022 22.5268L20.3062 24.6244L19.3515 27.9108C19.1784 28.5065 19.3909 29.127 19.8928 29.4917C20.3948 29.8565 21.0507 29.8668 21.5637 29.518L24.3942 27.5945L27.2246 29.518C27.4746 29.6879 27.7585 29.7726 28.0419 29.7725C28.3402 29.7725 28.6382 29.6787 28.8955 29.4917C29.3974 29.1271 29.6099 28.5065 29.4368 27.9107L28.4822 24.6244L31.1862 22.5268C31.6762 22.1465 31.8691 21.5196 31.6774 20.9296ZM27.3078 23.6369C26.9734 23.8963 26.8336 24.3265 26.9517 24.733L27.96 28.2041L24.9703 26.1724C24.6202 25.9344 24.1678 25.9346 23.8179 26.1725L20.8282 28.2041L21.8366 24.7329C21.9547 24.3265 21.8148 23.8962 21.4804 23.6368L18.6243 21.4213L22.2371 21.3077C22.6602 21.2945 23.0262 21.0286 23.1696 20.6303L24.3941 17.2294L25.6186 20.6303C25.762 21.0286 26.128 21.2945 26.551 21.3077L30.1639 21.4213L27.3078 23.6369ZM19.6477 16.3632C19.946 16.3632 20.2439 16.2694 20.5012 16.0824C21.0032 15.7178 21.2157 15.0972 21.0427 14.5013L20.088 11.215L22.792 9.11745C23.2822 8.73727 23.475 8.11033 23.2833 7.5202C23.0917 6.9302 22.5671 6.53633 21.947 6.51683L18.5265 6.4092L17.3672 3.18945C17.157 2.6057 16.6203 2.22852 16 2.22852C15.3796 2.22852 14.8429 2.6057 14.6328 3.18939L13.4735 6.4092L10.053 6.51683C9.43303 6.53633 8.90847 6.93014 8.71666 7.52027C8.52503 8.11033 8.71791 8.73727 9.20809 9.11745L11.912 11.215L10.9573 14.5013C10.7843 15.0971 10.9968 15.7176 11.4987 16.0823C12.0005 16.447 12.6564 16.4573 13.1696 16.1086L16 14.1851L18.8304 16.1086C19.0804 16.2785 19.3643 16.3632 19.6477 16.3632ZM16 12.5847C15.7994 12.5847 15.5988 12.6442 15.4238 12.7631L12.4341 14.7948L13.4425 11.3235C13.5605 10.9171 13.4207 10.4869 13.0863 10.2275L10.2303 8.01195L13.8432 7.89833C14.2662 7.88502 14.6321 7.61914 14.7755 7.22095L16 3.82008L17.2245 7.22089C17.3678 7.61914 17.7337 7.88508 18.1568 7.89839L21.7697 8.01202L18.9137 10.2276C18.5792 10.487 18.4394 10.9173 18.5575 11.3236L19.5658 14.7948L16.5762 12.7631C16.4011 12.6442 16.2005 12.5847 16 12.5847Z"
            fill=${color}
          />
        </svg>
      `;
    };

    const isMobile = window.innerWidth <= 576;

    function getLauncherIconByType(type, color, height, width) {
      switch (type) {
        case "Gift":
          return Gift({ color, height, width });
        case "Medal":
          return Medal({ color, height, width });
        case "Crown":
          return Crown({ color, height, width });
        case "Celebration":
          return Celebration({ color, height, width });
        case "Star":
          return Star({ color, height, width });
        default:
          return GiftCard({ color, height, width });
      }
    }

    let referralPopupData = {
      pageType: "before_sign_in_page",
      styles: {
        banner_url: "",
        corner_type: "rounded",
        launcher_display_type: "text_icon",
        launcher_icon_url: "",
        launcher_text_color: "#fff",
        launcher_color: "#000",
        button_color: "#000",
        button_text_color: "#fff",
        footer_color: "#f9f9f9",
        footer_text_color: "#333",
      },
      texts: {
        editor_content:
          "Invite your friends and earn {{advocate_reward}} while your friend gets {{friend_reward}} off their first purchase!",
        email_placeholder: "Email",
        name_placeholder: "Name",
        button_text: "Join Now",
        after_login_button_text: "Copy Link",
        how_it_work: "How it work",
      },
      campain: {
        advocate: { amount: 10 },
        friend: { discount_type: "percentage", discount_amount: 20 },
      },
      campainId: "mock_campain_id",
      showHowItWork: false,
    };

    async function getInviteLink(
      email,
      name,
      enableMarketingConsentRequest = 0,
    ) {
      try {
        const response = await fetch(GET_INVITE_LINK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: name,
            shop: Shopify.shop,
            campain_id: referralPopupData?.campainId,
            locale: Shopify.locale,
            enable_marketing_consent_request: enableMarketingConsentRequest,
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching referral popup data:", error);
      }
    }

    // Main render function for popup footer
    function renderFooter(state) {
      const footerEle = document.querySelector(
        ".bixgrow-referral-advocate-popup-footer",
      );
      if (!footerEle) return;
      const { showHowItWork = false, texts = {}, styles = {} } = state;
      footerEle.innerHTML = showHowItWork
        ? /* HTML */ `
            <div class="bixgrow-referral-advocate-popup-back">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 28 24"
                width="40"
                height="34"
                fill="none"
              >
                <path
                  d="M25 12H3M10 19L3 12L10 5"
                  stroke=${styles.footer_text_color}
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          `
        : /* HTML */ `
            <span class="bixgrow-referral-advocate-popup-footer__text">
              ${texts.how_it_work}
            </span>
          `;
    }

    function renderContentInner(state) {
      const {
        pageType = "before_sign_in_page",
        styles = {},
        texts = {},
        referralLink,
        showHowItWork = false,
        enable_marketing_consent_request,
        marketing_consent_text,
      } = state;
      const isBeforeSignInPage = pageType === "before_sign_in_page";
      const contentInner = showHowItWork
        ? `
     <div>
        ${texts.how_it_works_content_v2}
     </div>
  `
        : /* HTML */ `
            <h2
              class="bixgrow-referral-advocate-popup-headline"
              style="color: ${styles.headline_color}; font-size: ${styles.headline_size}px; font-weight: ${styles.headline_font_weight};"
            >
              ${texts.headline}
            </h2>
            <div
              class="bixgrow-referral-advocate-popup-description"
              style="color: ${styles.description_color}; font-size: ${styles.description_size}px; font-weight: ${styles.description_font_weight};"
            >
              ${texts.description_v2}
            </div>
            ${isBeforeSignInPage
              ? /* HTML */ `
                  <input
                    id="bixgrow-referral-advocate-popup-name"
                    type="text"
                    placeholder="${texts.name_placeholder || "Name"}"
                    class="bixgrow-referral-advocate-popup-input"
                    style="color: ${styles.input_text_color};background-color: ${styles.input_color};border: 1px solid ${styles.input_border_color};border-radius: ${styles.input_corner_radius}px;"
                  />
                  <div class="bixgrow-referral-advocate-popup-email-wrapper">
                    <input
                      id="bixgrow-referral-advocate-popup-email"
                      type="email"
                      placeholder="${texts.email_placeholder || "Email"}"
                      class="bixgrow-referral-advocate-popup-input"
                      style="color: ${styles.input_text_color};background-color: ${styles.input_color};border: 1px solid ${styles.input_border_color};border-radius: ${styles.input_corner_radius}px;"
                    />
                    <div
                      id="bixgrow-referral-advocate-popup-email-error"
                      class="bixgrow-referral-advocate-popup-email-error"
                    ></div>
                  </div>
                  ${enable_marketing_consent_request
                    ? /* HTML */ `
                        <label
                          class="bixgrow-referral-advocate-popup-checkbox-container"
                          id="bixgrow-referral-advocate-popup-enable-marketing-consent-request"
                        >
                          ${marketing_consent_text}
                          <input type="checkbox" />
                          <span
                            class="bixgrow-referral-advocate-popup-checkmark"
                          ></span>
                        </label>
                      `
                    : ``}
                `
              : /* HTML */ `
                  <div
                    class="bixgrow-referral-advocate-popup-referral-link-wrapper"
                  >
                    <input
                      type="text"
                      placeholder="https://online234b.myshopify.com?ad_id=example"
                      class="bixgrow-referral-advocate-popup-input"
                      style="pointer-events: none; color: ${styles.after_sign_in_input_text_color};background-color: ${styles.input_color};border: 1px solid ${styles.input_border_color};border-radius: ${styles.input_corner_radius}px;"
                      value="${referralLink}"
                    />
                    <div
                      id="bixgrow-copy-referral-link-button"
                      class="bixgrow-referral-advocate-popup-copy-icon"
                      title="Copy to clipboard"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 1H4C2.89543 1 2 1.89543 2 3V17H4V3H16V1Z"
                          fill="currentColor"
                        />
                        <path
                          d="M20 5H8C6.89543 5 6 5.89543 6 7V21C6 22.1046 6.89543 23 8 23H20C21.1046 23 22 22.1046 22 21V7C22 5.89543 21.1046 5 20 5ZM20 21H8V7H20V21Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                `}
            ${isBeforeSignInPage
              ? /* HTML */ `
                  <button
                    id="bixgrow-referral-advocate-popup-button"
                    class="bixgrow-referral-advocate-popup-button"
                    style="background-color: ${styles.button_color ||
                    "#000"}; color: ${styles.button_text_color ||
                    "#fff"}; font-size: ${styles.button_text_size}px; font-weight: ${styles.button_font_weight}; border-radius: ${styles.button_corner_radius}px;"
                  >
                    ${texts.button_text}
                  </button>
                `
              : ``}
            ${!isBeforeSignInPage && styles.social_sharing?.length > 0
              ? /* HTML */ `
                  <div class="bixgrow-referral-advocate-popup-social-grid">
                    ${styles.social_sharing
                      .map((social, index) => {
                        let style = "";
                        let icon = "";

                        switch (social) {
                          case "email":
                            style = "background-color:#333333;";
                            icon = EMAIL_ICON;
                            break;
                          case "facebook":
                            style = "background-color:#3B5998;";
                            icon = FB_ICON;
                            break;
                          case "messenger":
                            style = "background-color:#339dff;";
                            icon = MESENGER_ICON;
                            break;
                          case "x":
                            style = "background-color:#000;";
                            icon = X_ICON;
                            break;
                          case "whatsapp":
                            style = "background-color:#25D366;";
                            icon = WA_ICON;
                            break;
                        }

                        if (
                          index === 0 &&
                          styles.social_sharing.length % 2 !== 0
                        ) {
                          style += isMobile
                            ? "grid-column:1;"
                            : "grid-column:1 / 3;";
                        }
                        style += `border-radius: ${styles.social_corner_radius}px;`;

                        return /* HTML */ `
                          <div
                            class="bixgrow-referral-advocate-popup-social-item bixgrow-referral-advocate-popup-social-item-${social}"
                            style="${style}"
                          >
                            ${icon}
                            <span
                              style="flex:1;text-align:center;font-weight:700;"
                            >
                              ${String(social).toUpperCase()}
                            </span>
                          </div>
                        `;
                      })
                      .join("")}
                  </div>
                `
              : ""}
          `;
      const contentInnerEle = document.querySelector(
        ".bixgrow-referral-advocate-popup-content-inner",
      );
      if (!contentInner) return;
      contentInnerEle.innerHTML = contentInner;
    }
    function renderPreview(state) {
      const { styles = {}, texts = {}, showHowItWork = false } = state;
      const bannerUrl =
        isMobile && styles.enable_banner_url_mobile
          ? styles.banner_url_mobile
          : styles.banner_url;

      const overlay = document.querySelector(
        ".bixgrow-referral-advocate-popup-overlay",
      );
      if (overlay) overlay.remove();

      const htmlContent = /* HTML */ `
        <div class="bixgrow-referral-advocate-popup-overlay">
          <div
            class="bixgrow-referral-advocate-popup-container animate"
            style="border-radius: ${styles.popup_corner_radius}px;max-width: ${bannerUrl
              ? "900px"
              : "512px"}; background-color: ${styles.popup_background};"
          >
            <button
              id="bixgrow-advocate-popup-close"
              class="bixgrow-referral-advocate-popup-close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L5 15M5 5l10 10"
                  stroke="#666"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            ${bannerUrl
              ? /* HTML */ `
                  <div
                    class="bixgrow-referral-advocate-popup-banner"
                    style="background-image: ${bannerUrl
                      ? `url(${bannerUrl})`
                      : "none"};"
                  ></div>
                `
              : ``}
            <div class="bixgrow-referral-advocate-popup-content">
              <div class="bixgrow-referral-advocate-popup-content-inner"></div>
              <div
                class="bixgrow-referral-advocate-popup-footer"
                style="background-color: ${styles.footer_color ||
                "#f9f9f9"}; color: ${styles.footer_text_color ||
                "#333"}; font-size: ${styles.footer_text_size}px; font-weight: ${styles.footer_font_weight}; display: flex; align-items: center; justify-content: center; min-height: 40px;"
              ></div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", htmlContent);
    }

    function renderPLauncherButton(state) {
      const { styles = {}, texts = {} } = state;
      const launcherPlacement =
        (isMobile
          ? styles.launcher_placement_mobile
          : styles.launcher_placement) || "left";

      let launcherIconHtml = "";
      const displayType = isMobile
        ? styles.launcher_display_type_mobile
        : styles.launcher_display_type;
      if (displayType === "text_icon" || displayType === "icon") {
        launcherIconHtml = styles.launcher_icon_url
          ? /* HTML */ `
              <img
                height="20"
                width="20"
                src="${styles.launcher_icon_url}"
                alt="launcher-icon"
                class="bixgrow-referral-advocate-popup-launcher-icon"
              />
            `
          : /* HTML */ `
              <div class="bixgrow-referral-advocate-popup-launcher-icon">
                ${getLauncherIconByType(
                  styles.launcher_icon_type,
                  styles.launcher_text_color,
                  30,
                  30,
                )}
              </div>
            `;
      }

      let launcherTextHtml = "";
      if (displayType === "text_icon" || displayType === "text") {
        launcherTextHtml = `<span class="bixgrow-referral-advocate-popup-launcher-text">${texts.launcher_text || ""}</span>`;
      }

      const htmlContent = /* HTML */ `
        <div
          id="bixgrow-referral-advocate-popup-launcher-button"
          class="bixgrow-referral-advocate-popup-launcher animate ${launcherPlacement}"
          style="background-color: ${styles.launcher_color ||
          "#000"}; color: ${styles.launcher_text_color ||
          "#fff"}; font-size: ${styles.launcher_text_size}px; font-weight: ${styles.launcher_font_weight}; border-top-left-radius: ${styles.launcher_corner_radius}px; border-top-right-radius: ${styles.launcher_corner_radius}px;"
        >
          ${launcherIconHtml} ${launcherTextHtml}
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", htmlContent);
    }

    // Function to display error message under email input
    function showEmailError(message) {
      const errorElement = document.getElementById(
        "bixgrow-referral-advocate-popup-email-error",
      );
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add("show");
      }
    }

    // Attach click handlers for social sharing buttons. Each time the popup is
    // rendered we clone the element before attaching a listener to avoid duplicates.
    function addSocialShareEventListeners() {
      const rlink = referralPopupData.referralLink || "";
      if (!rlink) return;
      const shareLink = encodeURIComponent(rlink);

      const socialPostContent = referralPopupData?.share_content?.social_post
        ?.replaceAll("{store_name}", window.bixgrowShopData?.name)
        ?.replaceAll("{referral_link}", rlink);

      const emailSubject = bgGetCookie("bg_referral_advocate_name")
        ? referralPopupData?.share_content?.email?.subject?.replaceAll(
            "{customer_name}",
            bgGetCookie("bg_referral_advocate_name"),
          )
        : referralPopupData?.share_content?.email?.subject_2;

      const emailBody = referralPopupData?.share_content?.email?.body
        ?.replaceAll("{store_name}", window.bixgrowShopData?.name)
        ?.replaceAll("{referral_link}", rlink);

      const setupShare = (selector, handler) => {
        const el = document.querySelector(selector);
        if (el && el.parentNode) {
          const newEl = el.cloneNode(true);
          el.parentNode.replaceChild(newEl, el);
          newEl.addEventListener("click", handler);
        }
      };

      setupShare(
        ".bixgrow-referral-advocate-popup-social-item-facebook",
        () => {
          window.open(
            `https://www.facebook.com/sharer.php?u=${shareLink}`,
            "_blank",
            "width=600,height=400",
          );
        },
      );

      setupShare(
        ".bixgrow-referral-advocate-popup-social-item-messenger",
        () => {
          window.open(
            `https://www.facebook.com/dialog/send?link=${shareLink}`,
            "_blank",
            "width=600,height=400",
          );
        },
      );

      setupShare(".bixgrow-referral-advocate-popup-social-item-x", () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialPostContent)}`,
          "_blank",
          "width=600,height=400",
        );
      });

      setupShare(
        ".bixgrow-referral-advocate-popup-social-item-whatsapp",
        () => {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(socialPostContent)}`,
            "_blank",
            "width=600,height=400",
          );
        },
      );

      setupShare(".bixgrow-referral-advocate-popup-social-item-email", () => {
        const subject = encodeURIComponent(emailSubject);
        const body = encodeURIComponent(emailBody);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      });
    }

    // Function to add event listeners for popup elements
    function addPopupEventListeners() {
      // Handle invite button click
      const inviteButton = document.getElementById(
        "bixgrow-referral-advocate-popup-button",
      );
      if (inviteButton) {
        // Clone to remove old event listeners
        const newInviteButton = inviteButton.cloneNode(true);
        inviteButton.parentNode.replaceChild(newInviteButton, inviteButton);

        newInviteButton.addEventListener("click", async () => {
          const emailValue = document.getElementById(
            "bixgrow-referral-advocate-popup-email",
          ).value;
          const nameValue = document.getElementById(
            "bixgrow-referral-advocate-popup-name",
          ).value;

          const checkboxValue = document.querySelector(
            "#bixgrow-referral-advocate-popup-enable-marketing-consent-request input",
          )?.checked;

          // Validate email
          if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            showEmailError(referralPopupData?.texts?.email_error_message);
            return;
          }

          // Show loading state
          newInviteButton.disabled = true;
          newInviteButton.textContent = referralPopupData?.texts?.loading_text;
          newInviteButton.style.opacity = "0.6";

          try {
            const inviteLink = await getInviteLink(
              emailValue,
              nameValue,
              checkboxValue ? 1 : 0,
            );
            const referralLink = inviteLink?.advocate?.link || "";

            // update global state before re-render so share handlers see link
            referralPopupData = {
              ...referralPopupData,
              pageType: "after_sign_in_page",
              referralLink: referralLink,
            };

            renderContentInner(referralPopupData);
            bgSetCookie("bg_referral_advocate_link", referralLink, 30);
            bgSetCookie("bg_referral_advocate_email", emailValue, 30);
            bgSetCookie("bg_referral_advocate_name", nameValue, 30);
            // Re-add listeners after re-render
            addPopupEventListeners();
          } catch (error) {
            console.error("Error getting invite link:", error);
            // Reset button state on error
            newInviteButton.disabled = false;
            newInviteButton.textContent =
              referralPopupData?.texts?.button_text || "Join Now";
            newInviteButton.style.opacity = "1";
          }
        });
      }

      // Handle copy referral link button click
      const copyReferralLinkButton = document.getElementById(
        "bixgrow-copy-referral-link-button",
      );
      if (copyReferralLinkButton) {
        // Clone to remove old event listeners
        const newCopyButton = copyReferralLinkButton.cloneNode(true);
        copyReferralLinkButton.parentNode.replaceChild(
          newCopyButton,
          copyReferralLinkButton,
        );

        newCopyButton.addEventListener("click", () => {
          const referralLink = referralPopupData.referralLink || "";
          // copy to clipboard
          navigator.clipboard.writeText(referralLink);

          // swap icon to checkmark for 5 seconds
          const iconWrapper = newCopyButton;
          const originalHtml = iconWrapper.innerHTML;
          iconWrapper.innerHTML = CHECKMARK_SVG;
          setTimeout(() => {
            iconWrapper.innerHTML = originalHtml;
          }, 2000);
        });
      }

      // Handle close button click
      const closeButton = document.getElementById(
        "bixgrow-advocate-popup-close",
      );
      if (closeButton) {
        // Clone to remove old event listeners
        const newCloseButton = closeButton.cloneNode(true);
        closeButton.parentNode.replaceChild(newCloseButton, closeButton);

        newCloseButton.addEventListener("click", () => {
          const overlay = document.querySelector(
            ".bixgrow-referral-advocate-popup-overlay",
          );
          if (overlay) {
            referralPopupData = {
              ...referralPopupData,
              showHowItWork: false,
            };
            overlay.remove();
            history.replaceState(null, "", location.pathname + location.search);
          }
        });
      }

      // Handle footer clicks (both for "how it works" text and back button)
      const footerElement = document.querySelector(
        ".bixgrow-referral-advocate-popup-footer",
      );
      if (footerElement) {
        // Clone to remove old event listeners
        const newFooterElement = footerElement.cloneNode(true);
        footerElement.parentNode.replaceChild(newFooterElement, footerElement);

        newFooterElement.addEventListener("click", () => {
          referralPopupData = {
            ...referralPopupData,
            showHowItWork: !referralPopupData.showHowItWork,
          };
          renderContentInner(referralPopupData);
          renderFooter(referralPopupData);
          addPopupEventListeners();
        });
      }

      // wire up social buttons after other listeners are attached
      addSocialShareEventListeners();
    }

    // Function to setup launcher button listener
    function setupLauncherButtonListener() {
      const launcherButton = document.getElementById(
        "bixgrow-referral-advocate-popup-launcher-button",
      );
      if (launcherButton) {
        const newButton = launcherButton.cloneNode(true);
        launcherButton.parentNode.replaceChild(newButton, launcherButton);

        newButton.addEventListener("click", () => {
          const overlay = document.querySelector(
            ".bixgrow-referral-advocate-popup-overlay",
          );
          if (overlay) {
            overlay.remove();
          } else {
            renderPreview(referralPopupData);
            renderContentInner(referralPopupData);
            renderFooter(referralPopupData);
            addPopupEventListeners();
          }
        });
      }
    }
    const referralLink = bgGetCookie("bg_referral_advocate_link");
    referralPopupData = {
      pageType: referralLink ? "after_sign_in_page" : "before_sign_in_page",
      styles: campaign?.page_settings?.appearance ?? {},
      texts: campaign?.page_settings?.content ?? {},
      campainId: campaign?.campain_id,
      referralLink: referralLink,
      showHowItWork: false,
      enable_marketing_consent_request:
        campaign?.enable_marketing_consent_request,
      marketing_consent_text: campaign?.marketing_consent_text,
      share_content: campaign?.share_content,
    };
    addCustomCSS(referralPopupData.styles?.custom_css);
    // loadFont(referralPopupData.styles?.custom_font_family, [
    //   "bixgrow-referral-advocate-popup-overlay",
    //   "bixgrow-referral-advocate-popup-launcher",
    // ]);
    renderPLauncherButton(referralPopupData);
    setupLauncherButtonListener();

    function checkHash() {
      if (location.hash === "#open_referral_popup") {
        renderPreview(referralPopupData);
        renderContentInner(referralPopupData);
        renderFooter(referralPopupData);
        addPopupEventListeners();
      }
    }
    checkHash();
    window.addEventListener("hashchange", checkHash);
  } else if (widgetVersion === 1) {
    initWigetVersion1();
  }
  initFriendPopup();
});

function initWigetVersion1() {
  window.bgIsEmbedWidgetLoaded = true;
  if (!window.bgIsScripttagWidgetLoaded) {
    bgGetDataReferral();
  }
}
function initFriendPopup() {
  let bgAdParameter = bgGetParameterByName("ad_id");
  if (!bgAdParameter) {
    return;
  }

  let xhttp = new XMLHttpRequest();
  xhttp.open(
    "POST",
    BG_AFFILIATE_API_BASE_URL + "/api/referral/friends/reward",
    true,
  );
  xhttp.setRequestHeader("Content-Type", "application/json");
  let data = {
    shop: Shopify.shop,
    advocate_id: bgAdParameter,
    url: window.location.href,
    visitor_id: bgGetCookie("bgrf_visitor_id"),
    is_same_browser: bgGetCookie("bg_is_same_browser") ? true : false,
    locale: Shopify.locale,
  };
  xhttp.send(JSON.stringify(data));
  xhttp.onload = function () {
    let obj = null;
    if (this.status === 200) {
      obj = JSON.parse(this.responseText);
      if (Object.keys(obj).length > 0) {
        bgSetCookie("bgrf_visitor_id", obj.visitor_id, 30);
        myDataSetting = obj;
        if (obj.discount?.code) {
          initFriendPopupCssProperties(obj);
          createFriendRewardPopup(obj);
          autoAppliedCoupon(obj.discount.code);
        } else {
          initFriendPopupCssProperties(obj);
          createBeforeRedemFriendRewardPopup(obj);
        }
        addCustomCSS(obj?.page_settings?.appearance?.custom_css);
        if (addRTLCSS && isRTL()) {
          addRTLCSS();
        }
      }
    } else if (this.status == 400) {
      let errorObj = JSON.parse(this.responseText);
      obj = errorObj.data;
      if (errorObj.status == "INVALID_REFERRAL_LINK") {
        initFriendPopupCssProperties(obj);
        createInvalidReferralLinkPopup(obj);
        addCustomCSS(obj?.page_settings?.appearance?.custom_css);
      }
    }
  };
}

//Global function version
function initFriendPopupCssProperties(obj) {
  const cssProperties = {
    "--bixgrow_refferral_friend_pupup_bg_primary_color":
      obj?.page_settings?.appearance?.background,
    "--bixgrow_refferral_friend_pupup_bg_secondary_color":
      obj?.page_settings?.appearance?.background_type == 2
        ? obj?.page_settings?.appearance?.secondary_background
        : obj?.page_settings?.appearance?.background,
    "--bixgrow_refferral_friend_pupup_card_border_radius": `${obj?.page_settings?.appearance?.card_corner}px`,
    "--bixgrow_refferral_friend_pupup_button_bg":
      obj?.page_settings?.appearance?.button?.background,
    "--bixgrow_refferral_friend_pupup_button_text_color":
      obj?.page_settings?.appearance?.button?.text,
    "--bixgrow_refferral_friend_pupup_title_color":
      obj?.page_settings?.appearance?.text,
    "--bixgrow_refferral_friend_pupup_desc_color":
      obj?.page_settings?.appearance?.description_color,
    "--bixgrow_refferral_friend_pupup_bg": `linear-gradient(180deg, var(--bixgrow_refferral_friend_pupup_bg_secondary_color) 0%, var(--bixgrow_refferral_friend_pupup_bg_primary_color) 100%`,
  };
  setCssProperties(cssProperties);
}

function getLogoByType(type, height, width) {
  switch (type) {
    case "Gift":
      return /* HTML */ `
        <svg
          width=${width}
          height=${height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.711 13.7778L28.5332 16.2667L28.0888 23.7334C27.9999 24.9778 27.1999 26.1334 26.0444 26.5778C16.8888 30.1334 17.1555 30.1334 16.7999 30.2223C16.3555 30.3112 15.8221 30.3112 15.2888 30.2223C14.8444 30.1334 15.1999 30.2223 6.04435 26.5778C4.8888 26.1334 4.0888 24.9778 3.99991 23.7334L3.55546 16.2667L3.37769 13.7778L15.9999 17.7778L28.711 13.7778Z"
            fill="#F45170"
          />
          <path
            d="M16.7111 19.3774V30.133C16.2666 30.2219 15.7333 30.2219 15.2 30.133V19.3774C15.7333 19.6441 16.2666 19.6441 16.7111 19.3774Z"
            fill="#FA5F7F"
          />
          <path
            d="M3.28882 13.7778L3.4666 16.2667L15.2888 21.3334C15.7333 21.5112 16.2666 21.5112 16.7999 21.3334L28.6222 16.2667L28.7999 13.7778L15.9999 17.7778L3.28882 13.7778Z"
            fill="#CC104A"
          />
          <g opacity="0.5">
            <path
              d="M15.2888 19.3774V21.2441C15.7333 21.4219 16.2666 21.4219 16.7999 21.2441V19.3774C16.2666 19.6441 15.7333 19.6441 15.2888 19.3774Z"
              fill="#93073A"
            />
          </g>
          <path
            d="M29.3333 14.2222L16.7999 19.5555C16.6222 19.6444 16.3555 19.7333 16.0888 19.7333C15.8222 19.7333 15.6444 19.6444 15.3777 19.5555L2.66661 14.2222C1.77772 13.8666 1.59995 11.2888 1.9555 9.59996C2.04439 9.2444 2.13328 8.97773 2.22217 8.71107C2.39995 8.4444 2.48883 8.26662 2.66661 8.17773H29.3333C29.5111 8.26662 29.5999 8.35551 29.6888 8.53329C29.8666 8.79996 29.9555 9.15551 30.0444 9.51107C30.3999 11.2888 30.1333 13.8666 29.3333 14.2222Z"
            fill="#E93565"
          />
          <path
            d="M30.0444 9.59983C29.8666 9.06649 29.0666 9.33316 29.0666 9.33316L17.3332 14.3109C16.9777 14.4887 16.711 14.8443 16.711 15.2887V19.5554C16.5332 19.6443 16.2666 19.7332 15.9999 19.7332C15.7332 19.7332 15.5555 19.6443 15.2888 19.5554V15.1998C15.2888 14.7554 15.0221 14.3998 14.6666 14.222L2.84436 9.24427C2.57769 9.15538 2.04435 9.06649 1.86658 9.51094C1.95547 9.15538 2.04436 8.88872 2.13324 8.62205C2.31102 8.44427 2.4888 8.26649 2.66658 8.1776L15.1999 2.84427C15.6444 2.66649 16.1777 2.66649 16.711 2.84427L29.2444 8.1776C29.4221 8.26649 29.511 8.35538 29.5999 8.53316C29.8666 8.79983 29.9555 9.15538 30.0444 9.59983Z"
            fill="#FA5F7F"
          />
          <path
            d="M16.3555 13.7776L28.0888 8.88875C28.2666 8.79986 28.2666 8.53319 28.0888 8.4443L16.3555 3.6443C16.0888 3.55541 15.8222 3.55541 15.5555 3.6443L3.91104 8.4443C3.73327 8.53319 3.73327 8.79986 3.91104 8.88875L15.5555 13.6887C15.8222 13.8665 16.1777 13.8665 16.3555 13.7776Z"
            fill="#E93565"
          />
          <path
            d="M22.2222 12.1774L21.1555 12.6218C20.9777 12.4441 20.7999 12.3552 20.2666 12.0885L21.511 11.5552C21.7777 11.8218 22.0444 11.9996 22.2222 12.1774Z"
            fill="#DF3260"
          />
          <path
            d="M10.8444 12.7107L9.77771 12.1774C9.95549 11.9107 10.2222 11.733 10.4888 11.5552L11.7333 12.0885C11.2888 12.3552 11.0222 12.533 10.8444 12.7107Z"
            fill="#DF3260"
          />
          <path
            d="M15.9999 8.62207C17.2443 9.24429 19.911 10.6665 21.511 11.6443L20.2665 12.1776C19.0221 11.4665 17.3332 10.6665 15.9999 10.1332C14.3999 10.8443 12.9777 11.4665 11.7332 12.1776L10.4888 11.6443C11.911 10.7554 14.4888 9.33318 15.9999 8.62207Z"
            fill="#CC104A"
          />
          <path
            d="M11.7333 6.3999C9.77773 7.46657 7.91106 8.44435 6.22217 9.42212C5.24439 10.0443 4.62217 11.111 4.71106 12.2666L5.77773 26.2221C5.86661 26.9332 6.22217 27.6443 6.7555 27.9999C8.08884 28.9777 10.3111 30.311 11.3777 29.4221L10.2222 28.6221L9.9555 11.911L15.9999 8.53324V6.3999H11.7333Z"
            fill="#FFD475"
          />
          <g opacity="0.5">
            <path
              d="M10.4889 14.3111L10.5777 28L9.95552 26.9333C9.42218 13.9555 9.06663 13.2444 9.77774 12.1777L10.8444 12.6222C10.4888 13.0666 10.4889 13.6888 10.4889 14.3111Z"
              fill="#93073A"
            />
          </g>
          <path
            d="M8.97768 13.7778L9.59991 28.5333C9.59991 29.2444 10.311 29.8667 11.0221 29.6889C11.3777 29.6 11.7332 29.3333 11.9999 28.9778L10.8443 28.4444C10.6666 28.3556 10.5777 28.1778 10.5777 28L10.1332 13.6C10.1332 12.8889 10.4888 12.0889 11.111 11.7333C12.6221 10.8444 14.1332 10.1333 15.911 9.33333V8C14.2221 8.8 11.9999 10.0444 10.3999 11.0222C9.51102 11.5556 8.88879 12.6222 8.97768 13.7778Z"
            fill="#F3A250"
          />
          <path
            d="M20.2667 6.3999C22.2222 7.37768 24.0889 8.44435 25.7778 9.42212C26.7556 10.0443 27.3778 11.111 27.2889 12.2666L26.2222 26.2221C26.1333 26.9332 25.7778 27.6443 25.2444 27.9999C23.9111 28.9777 21.6889 30.311 20.6222 29.4221L21.7778 28.6221L22.0444 11.911L16 8.53324V6.3999H20.2667Z"
            fill="#FFD475"
          />
          <g opacity="0.5">
            <path
              d="M21.5111 14.311L21.4222 28.0888L22.1333 26.9333C22.4889 13.9555 22.9333 13.3333 22.2222 12.2666L21.1555 12.711C21.5111 13.0666 21.5111 13.6888 21.5111 14.311Z"
              fill="#93073A"
            />
          </g>
          <path
            d="M23.0222 13.7778L22.4 28.5333C22.4 29.2444 21.6889 29.8667 20.9778 29.6889C20.6222 29.6 20.2666 29.3333 20 28.9778L21.1555 28.5333C21.3333 28.4444 21.4222 28.3556 21.4222 28.1778L21.8666 13.7778C21.8666 13.0667 21.5111 12.2667 20.8889 11.9111C20.4444 11.6444 19.9111 11.3778 19.4666 11.1111C18.4889 10.5778 17.4222 10.1333 16.4444 9.68889C16.2666 9.6 16.1778 9.6 16.0889 9.51111V8C16.5333 8.26667 16.9778 8.44444 17.4222 8.71111C18.8444 9.42222 20.0889 10.1333 21.6 11.0222C21.6889 11.1111 21.7778 11.2 21.8666 11.2C22.5778 11.8222 23.1111 12.8 23.0222 13.7778Z"
            fill="#F3A250"
          />
          <path
            d="M14.5777 6.84401C14.5777 6.9329 14.4888 7.11068 14.4888 7.19957C14.0443 8.5329 13.4221 9.24401 11.9999 8.88845C11.111 8.62179 7.55546 9.42179 7.28879 9.3329C6.48879 8.97734 6.22212 8.08845 6.31101 7.11068C6.31101 5.86623 6.84435 4.44401 7.28879 3.55512C7.73323 2.66623 8.44435 1.95512 9.24435 1.77734H9.5999C10.8443 1.77734 12.9777 3.82179 13.6888 4.71068C14.3999 5.59957 13.7777 4.79957 13.7777 4.79957C14.2221 5.3329 14.4888 5.86623 14.5777 6.31068V6.84401Z"
            fill="#FFD475"
          />
          <path
            d="M14.5777 6.84401C14.5777 6.9329 14.4888 7.11068 14.4888 7.19957C14.311 6.66623 13.7777 5.86623 13.5999 5.68845C12.7999 4.71068 10.7555 2.75512 9.51104 2.75512C7.73326 2.75512 6.5777 5.3329 6.31104 7.11068C6.31104 5.86623 6.84437 4.44401 7.28881 3.55512C7.64437 2.75512 8.53326 1.95512 9.24437 1.77734H9.59992C10.8444 1.77734 12.9777 3.82179 13.6888 4.71068C14.3999 5.59957 13.7777 4.79957 13.7777 4.79957C14.311 5.51068 14.4888 5.95512 14.5777 6.31068V6.84401Z"
            fill="#FFDE9B"
          />
          <g opacity="0.5">
            <path
              d="M15.5555 9.59989C15.2889 9.68878 14.9333 9.86656 14.6666 9.95545C13.6 9.86656 13.4222 9.86656 13.1555 9.68878C13.2444 9.68878 13.3333 9.59989 13.3333 9.511C13.6889 9.15545 13.5111 8.79989 13.2444 8.44434H14.4L14.5777 8.62211L15.5555 9.59989Z"
              fill="#DD8536"
            />
          </g>
          <path
            d="M6.31104 7.91074C6.31104 8.44408 6.31104 10.133 8.26659 10.3996C8.9777 10.4885 10.3999 10.4885 11.1999 10.4885C12.3555 10.3996 14.0444 10.2219 14.0444 9.0663C14.0444 8.88852 13.9555 8.62185 13.8666 8.44408C13.6888 8.08852 13.0666 7.55519 12.9777 7.55519C11.5555 6.48852 9.33326 5.59963 8.35548 5.51074C7.11103 5.51074 6.31104 6.6663 6.31104 7.91074Z"
            fill="#FFB961"
          />
          <path
            d="M10.3111 10.1329C17.9555 10.1329 10.4 5.9551 8.35551 5.86621C7.37774 5.86621 6.66663 6.7551 6.66663 7.91066C6.66663 10.2218 7.99996 10.1329 10.3111 10.1329Z"
            fill="#F3A250"
          />
          <path
            d="M13.4221 9.59956C13.511 9.51068 13.511 9.59956 13.4221 9.59956V9.59956Z"
            fill="#F3A250"
          />
          <path
            d="M6.66663 7.91066C6.66663 8.3551 6.75551 8.97732 7.02218 9.33288C7.11107 8.3551 7.82218 7.46621 8.71107 7.46621C9.59996 7.46621 11.9111 8.3551 13.3333 9.59954C14.7555 10.844 13.3333 9.59954 13.4222 9.51066C14.5777 8.3551 9.95552 5.9551 8.26663 5.86621C7.37774 5.9551 6.66663 6.7551 6.66663 7.91066Z"
            fill="#DD8536"
          />
          <path
            d="M17.4221 6.8441C17.7777 8.26632 18.4888 9.33299 19.9999 8.79965C20.8888 8.53299 24.4443 9.33299 24.711 9.2441C25.3332 8.97743 25.5999 8.35521 25.6888 7.6441C25.8665 5.68854 24.4443 1.2441 21.8665 1.86632C20.9777 2.13299 19.2888 3.46632 18.2221 4.79965C17.1554 6.13299 18.1332 4.88854 18.1332 4.88854C17.5999 5.59965 17.2443 6.31076 17.4221 6.8441Z"
            fill="#FFD475"
          />
          <path
            d="M25.6888 7.11089C25.3333 5.06645 23.9999 2.31089 21.9555 2.75534C20.6222 3.19978 17.8666 5.68867 17.511 7.11089C17.3333 6.57756 17.1555 6.04423 18.1333 4.79978L18.2222 4.71089C19.2888 3.37756 20.9777 2.13312 21.8666 1.77756C24.3555 1.24423 25.6888 5.33312 25.6888 7.11089Z"
            fill="#FFDE9B"
          />
          <g opacity="0.5">
            <path
              d="M26.0444 9.59989C25.3332 11.111 23.6444 11.1999 21.8666 11.1999C21.4221 11.1999 21.0666 11.1999 20.6221 11.1999C19.911 11.1999 19.6444 11.111 19.3777 11.0221C18.3999 10.4888 17.3332 10.0443 16.3555 9.59989L17.2444 8.62211L17.4221 8.44434H23.9999C24.6221 8.79989 25.7777 9.42211 26.0444 9.59989Z"
              fill="#DD8536"
            />
          </g>
          <path
            d="M17.9554 9.15517C17.9554 10.3107 19.6443 10.4885 20.7999 10.5774C23.7332 10.6663 25.6888 10.7552 25.6888 7.99961C25.6888 6.75516 24.8888 5.59961 23.6443 5.59961C22.1332 5.59961 17.9554 7.55517 17.9554 9.15517Z"
            fill="#FFB961"
          />
          <path
            d="M21.6888 10.1329C14.0444 10.1329 21.6888 5.9551 23.6444 5.86621C24.6222 5.86621 25.3333 6.7551 25.3333 7.91066C25.3333 10.2218 23.911 10.1329 21.6888 10.1329Z"
            fill="#F3A250"
          />
          <path
            d="M25.3332 7.91066C25.3332 8.3551 25.2443 8.88843 24.9777 9.33288C24.8888 8.26621 24.1777 7.46621 23.2888 7.46621C22.3999 7.46621 20.0888 8.3551 18.6666 9.59954C17.2443 10.844 18.6666 9.59954 18.5777 9.51066C17.4221 8.3551 22.0444 5.9551 23.7332 5.86621C24.6221 5.9551 25.3332 6.7551 25.3332 7.91066Z"
            fill="#DD8536"
          />
          <g opacity="0.1">
            <path
              d="M19.111 7.99979C18.8443 8.17757 18.4888 8.62201 18.3999 8.97757C18.3999 9.15535 18.3999 9.33312 18.5777 9.5109C18.5777 9.5109 18.5777 9.59979 18.6666 9.59979C18.7555 9.68868 18.7555 9.68868 18.8444 9.77757C18.6666 9.95535 18.3999 9.95535 17.3332 10.0442C16.8888 9.77757 16.4443 9.59979 15.9999 9.42201C15.8221 9.5109 15.7332 9.5109 15.6443 9.59979C15.3777 9.68868 15.0221 9.86646 14.7555 9.95535C13.6888 9.86646 13.511 9.86646 13.2443 9.68868C13.5999 9.5109 13.8666 9.06646 13.3332 8.44424C13.1555 8.26646 13.0666 8.08868 12.8888 7.99979C12.8888 7.82201 13.3332 5.42201 13.3332 5.33312C13.4221 5.06646 13.511 4.88868 13.6888 4.79979C13.8666 4.7109 13.7777 4.88868 13.7777 4.88868C14.311 5.59979 14.6666 6.3109 14.4888 6.84424C14.311 7.46646 14.1332 8.08868 13.6888 8.44424C13.7777 8.62201 13.8666 8.79979 13.8666 8.97757C14.0443 8.88868 14.311 8.7109 14.5777 8.62201C15.111 8.44424 15.5555 8.17757 15.9999 7.99979C16.711 8.35535 17.3332 8.7109 18.0443 9.06646C18.0443 8.88868 18.1332 8.7109 18.2221 8.53312C17.8666 8.08868 17.5999 7.55535 17.4221 6.93312C17.2443 6.39979 17.5999 5.68868 18.2221 4.97757C18.2221 4.97757 18.2221 4.88868 18.311 4.88868C18.4888 4.88868 18.5777 5.06646 18.6666 5.33312C18.6666 5.5109 19.111 7.9109 19.111 7.99979Z"
              fill="#111D33"
            />
          </g>
          <path
            d="M13.1555 8.79961C13.0666 9.15516 13.3333 9.42183 13.5999 9.42183C15.6444 9.6885 16.1777 9.6885 18.3111 9.42183C18.6666 9.42183 18.8444 9.06628 18.7555 8.79961L18.3111 6.66628C18.3111 6.39961 18.0444 6.31072 17.7777 6.31072C16.6222 6.57739 15.1111 6.57739 13.9555 6.31072C13.6888 6.22183 13.5111 6.39961 13.4222 6.66628L13.1555 8.79961Z"
            fill="#FFB961"
          />
          <path
            d="M13.4221 7.3777C13.3332 7.64437 13.5999 7.99992 13.8665 7.99992C15.6443 8.26659 16.3554 8.26659 18.1332 7.99992C18.3999 7.99992 18.6665 7.73326 18.5777 7.3777L18.2221 5.42215C18.2221 5.24437 17.9554 5.06659 17.7777 5.15548C16.7999 5.42215 15.2888 5.42215 14.311 5.15548C14.1332 5.06659 13.8665 5.24437 13.8665 5.42215L13.4221 7.3777Z"
            fill="#FFD475"
          />
        </svg>
      `;
    case "Star":
      return /* HTML */ `
        <svg
          width=${width}
          height=${height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_8740_35547)">
            <path
              d="M16.5661 26.1827L22.4445 27.4382C22.8164 27.5176 23.2009 27.5179 23.5729 27.439C23.9449 27.3601 24.2962 27.2038 24.6038 26.9803C24.9115 26.7568 25.1687 26.471 25.3586 26.1416C25.5486 25.8121 25.6672 25.4464 25.7065 25.0682L26.3293 19.0894C26.3688 18.7099 26.4881 18.3429 26.6793 18.0127L29.6896 12.8097C29.88 12.4806 29.999 12.115 30.0389 11.7369C30.0789 11.3587 30.0388 10.9764 29.9213 10.6148C29.8038 10.2531 29.6115 9.92026 29.357 9.63779C29.1024 9.35531 28.7913 9.12955 28.4438 8.97518L22.9501 6.53518C22.6013 6.38042 22.2891 6.15372 22.034 5.86993L18.0161 1.40018C17.7619 1.11734 17.451 0.891155 17.1037 0.736319C16.7563 0.581483 16.3803 0.501465 16.0001 0.501465C15.6198 0.501465 15.2438 0.581483 14.8964 0.736319C14.5491 0.891155 14.2382 1.11734 13.9841 1.40018L9.96605 5.86993C9.71098 6.15372 9.39883 6.38042 9.05005 6.53518L3.5563 8.97518C3.20879 9.12955 2.89766 9.35531 2.64311 9.63779C2.38856 9.92026 2.19629 10.2531 2.0788 10.6148C1.96131 10.9764 1.92122 11.3587 1.96115 11.7369C2.00108 12.115 2.12012 12.4806 2.31055 12.8097L5.3208 18.0127C5.51203 18.3429 5.6313 18.7099 5.6708 19.0894L6.29355 25.0682C6.33294 25.4464 6.45147 25.8121 6.64146 26.1416C6.83144 26.471 7.08862 26.7568 7.39627 26.9803C7.70393 27.2038 8.05518 27.3601 8.42719 27.439C8.7992 27.5179 9.18365 27.5176 9.55555 27.4382L15.4341 26.1827C15.8072 26.1032 16.1929 26.1032 16.5661 26.1827Z"
              fill="#FFC107"
            />
            <path
              d="M22.4555 6.24822L16 15.1387V0.501967C16.3804 0.500741 16.7567 0.58034 17.1041 0.735496C17.4514 0.890651 17.7618 1.11782 18.0147 1.40197L22.0355 5.86872C22.16 6.0114 22.301 6.13879 22.4555 6.24822Z"
              fill="#FFA000"
            />
            <path
              d="M5.55005 18.5314L16 15.1387L7.39855 26.9792C7.08949 26.757 6.83105 26.4717 6.64028 26.1423C6.44951 25.8129 6.33074 25.4468 6.2918 25.0682L5.67305 19.0917C5.65292 18.9009 5.61167 18.713 5.55005 18.5314Z"
              fill="#FFA000"
            />
            <path
              d="M16 15.1385L2.08154 10.612C2.19794 10.2511 2.38932 9.91875 2.64313 9.6369C2.89693 9.35504 3.20744 9.13001 3.55429 8.97655L9.05204 6.5373C9.22502 6.45674 9.38994 6.35989 9.54454 6.24805L16 15.1385Z"
              fill="#FFA000"
            />
            <path
              d="M24.6015 26.9792C24.2955 27.2043 23.9451 27.3619 23.5735 27.4413C23.202 27.5207 22.8178 27.5203 22.4465 27.4399L16.5648 26.1842C16.3792 26.1442 16.1898 26.1244 16 26.1252V15.1387L24.6015 26.9792Z"
              fill="#FFA000"
            />
            <path
              d="M29.6882 12.8077L26.6795 18.0119C26.5844 18.1764 26.5071 18.3506 26.449 18.5314L16 15.1387L29.9185 10.6167C30.0372 10.9774 30.0781 11.3592 30.0384 11.7369C29.9987 12.1146 29.8794 12.4795 29.6882 12.8077Z"
              fill="#FFA000"
            />
            <path
              d="M16.875 30.75V28.5C16.875 28.0168 16.4832 27.625 16 27.625C15.5168 27.625 15.125 28.0168 15.125 28.5V30.75C15.125 31.2332 15.5168 31.625 16 31.625C16.4832 31.625 16.875 31.2332 16.875 30.75Z"
              fill="#FFC107"
            />
            <path
              d="M30.9641 19.139L28.8243 18.4437C28.3647 18.2944 27.8711 18.5459 27.7218 19.0055C27.5725 19.465 27.824 19.9586 28.2836 20.108L30.4233 20.8032C30.8829 20.9525 31.3765 20.701 31.5258 20.2415C31.6751 19.7819 31.4236 19.2883 30.9641 19.139Z"
              fill="#FFC107"
            />
            <path
              d="M1.54973 20.806L3.68948 20.1107C4.14905 19.9614 4.40056 19.4678 4.25123 19.0082C4.10191 18.5486 3.6083 18.2971 3.14873 18.4465L1.00898 19.1417C0.549412 19.291 0.297908 19.7846 0.447232 20.2442C0.596556 20.7038 1.09016 20.9553 1.54973 20.806Z"
              fill="#FFC107"
            />
            <path
              d="M24.4737 1.99531L23.1507 3.81556C22.8666 4.20651 22.9532 4.75379 23.3441 5.03794C23.7351 5.32209 24.2823 5.23551 24.5665 4.84456L25.8895 3.02431C26.1736 2.63336 26.0871 2.08609 25.6961 1.80194C25.3052 1.51779 24.7579 1.60436 24.4737 1.99531Z"
              fill="#FFC107"
            />
            <path
              d="M6.11404 3.02266L7.43704 4.84291C7.72119 5.23385 8.26846 5.32043 8.65941 5.03628C9.05036 4.75213 9.13694 4.20486 8.85279 3.81391L7.52979 1.99366C7.24564 1.60271 6.69836 1.51613 6.30741 1.80028C5.91646 2.08443 5.82989 2.63171 6.11404 3.02266Z"
              fill="#FFC107"
            />
          </g>
          <defs>
            <clipPath id="clip0_8740_35547">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      `;
    case "StarCircle":
      return /* HTML */ `
        <svg
          width=${width}
          height=${height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_8740_35563)">
            <path
              d="M17.7549 0.592115C19.2643 -0.55501 21.4505 0.0307399 22.1841 1.77893C22.6882 2.98011 23.9314 3.69787 25.2237 3.5338C27.1045 3.29505 28.7049 4.89543 28.4661 6.77624C28.3021 8.06855 29.0198 9.31168 30.221 9.8158C31.9692 10.5494 32.5549 12.7356 31.4078 14.2451C30.6196 15.2822 30.6196 16.7177 31.4078 17.7549C32.5549 19.2643 31.9692 21.4505 30.221 22.1841C29.1078 22.6512 28.4099 23.7531 28.4441 24.9406C28.4467 25.0346 28.4541 25.129 28.4661 25.2237L27.6355 27.1792L25.2236 27.9036L23.3948 28.397L22.1841 29.6586L19.9817 31.4505L17.7548 30.5556H14.245L12.0997 31.467L9.81575 29.6586L8.56093 28.3716L6.77618 27.9036L4.36437 27.1793L3.53375 25.2237C3.54575 25.1289 3.55306 25.0345 3.55575 24.9406C3.58993 23.7531 2.892 22.6513 1.77881 22.1841C0.0307454 21.4505 -0.555005 19.2644 0.59212 17.7549C1.38031 16.7177 1.38031 15.2822 0.59212 14.2451C-0.555005 12.7356 0.0307453 10.5494 1.77893 9.8158C2.98012 9.31168 3.69787 8.06855 3.53381 6.77624C3.29506 4.89543 4.89543 3.29505 6.77625 3.5338C8.06856 3.69787 9.31168 2.98011 9.81581 1.77893C10.5495 0.0307399 12.7356 -0.55501 14.2451 0.592115C15.2822 1.3803 16.7177 1.3803 17.7549 0.592115Z"
              fill="#FFCB5B"
            />
            <path
              d="M28.4661 25.2236C28.4541 25.1288 28.4474 25.0344 28.4447 24.9404C28.1828 26.4096 26.8023 27.5051 25.2237 27.3047C23.9314 27.1406 22.6882 27.8584 22.1841 29.0596C21.4504 30.8077 19.2643 31.3935 17.7549 30.2464C16.7177 29.4582 15.2823 29.4582 14.2451 30.2464C12.7356 31.3935 10.5494 30.8077 9.81582 29.0596C9.3117 27.8584 8.06857 27.1406 6.77626 27.3047C5.19763 27.5051 3.81713 26.4096 3.55526 24.9404C3.55257 25.0344 3.54582 25.1288 3.53382 25.2236C3.29507 27.1044 4.89545 28.7047 6.77626 28.466C8.06857 28.3019 9.31176 29.0197 9.81582 30.2209C10.5495 31.9691 12.7356 32.5548 14.2451 31.4077C15.2823 30.6195 16.7177 30.6195 17.7549 31.4077C19.2643 32.5548 21.4505 31.9691 22.1841 30.2209C22.6883 29.0197 23.9314 28.3019 25.2237 28.466C27.1044 28.7047 28.7048 27.1043 28.4661 25.2236Z"
              fill="#F7B737"
            />
            <path
              d="M16 27.7238C3.45449 27.7238 3.45893 15.6118 3.46774 15.4194C3.77112 8.76028 9.26593 3.45459 16 3.45459C22.7341 3.45459 28.2289 8.76028 28.5322 15.4194C28.5411 15.6118 28.5323 27.7238 16 27.7238Z"
              fill="#FF4755"
            />
            <path
              d="M16 27.3843C9.26597 27.3843 3.77178 22.0785 3.46834 15.4194C3.45959 15.6119 3.45447 15.8054 3.45447 16.0001C3.45447 22.9287 9.07128 28.5456 16 28.5456C22.9287 28.5456 28.5455 22.9288 28.5455 16.0001C28.5455 15.8054 28.5404 15.612 28.5316 15.4195C28.2282 22.0785 22.734 27.3843 16 27.3843Z"
              fill="#FC2B3A"
            />
            <path
              d="M16 25.3021C5.9308 25.3021 5.9363 15.6114 5.94724 15.4192C6.24805 10.1284 10.6339 5.93066 16 5.93066C21.3662 5.93066 25.7521 10.1284 26.0529 15.4193C26.0638 15.6114 26.0529 25.3021 16 25.3021Z"
              fill="#C61926"
            />
            <path
              d="M16 24.9081C10.6338 24.9081 6.24872 20.7102 5.94785 15.4194C5.93691 15.6116 5.93079 15.8051 5.93079 16.0001C5.93079 21.5612 10.4389 26.0693 16 26.0693C21.5612 26.0693 26.0693 21.5612 26.0693 16.0001C26.0693 15.8051 26.0632 15.6116 26.0522 15.4194C25.7513 20.7102 21.3662 24.9081 16 24.9081Z"
              fill="#AD1729"
            />
            <path
              d="M16.9133 11.1298L17.8437 13.015C17.9921 13.3156 18.2789 13.5239 18.6106 13.5722L20.6912 13.8745C21.5266 13.9959 21.8601 15.0225 21.2556 15.6118L19.7501 17.0793C19.5101 17.3133 19.4006 17.6504 19.4572 17.9808L19.8126 20.0529C19.8529 20.2878 19.8122 20.5069 19.7162 20.6916H18.3347L16 19.5376L13.6651 20.6916H12.2836C12.1877 20.5069 12.147 20.2878 12.1873 20.0529L12.5427 17.9808C12.5994 17.6504 12.4898 17.3133 12.2497 17.0793L10.7442 15.6118C10.1397 15.0225 10.4733 13.9959 11.3087 13.8745L13.3892 13.5722C13.721 13.524 14.0077 13.3156 14.1561 13.0151L15.0866 11.1298C15.4602 10.3728 16.5397 10.3728 16.9133 11.1298Z"
              fill="#FFE27A"
            />
            <path
              d="M15.8498 18.8168L12.2837 20.6916C12.5276 21.1613 13.1288 21.4086 13.6651 21.1267L15.526 20.1483C15.8227 19.9923 16.1772 19.9923 16.4739 20.1483L18.3348 21.1267C18.8711 21.4086 19.4723 21.1613 19.7162 20.6916L16.1501 18.8168C16.0561 18.7674 15.9438 18.7674 15.8498 18.8168Z"
              fill="#F9CF58"
            />
          </g>
          <defs>
            <clipPath id="clip0_8740_35563">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      `;
    case "Cup":
      return /* HTML */ `
        <svg
          width=${width}
          height=${height}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.4737 17.6842C12.4484 17.6842 1 12.352 1 5.89474C1 3.57305 2.88884 1.68421 5.21053 1.68421C7.53221 1.68421 9.42105 3.57305 9.42105 5.89474H7.73684C7.73684 4.50189 6.60337 3.36842 5.21053 3.36842C3.81768 3.36842 2.68421 4.50189 2.68421 5.89474C2.68421 11.2143 13.2232 16 14.4737 16V17.6842Z"
            fill="#E19214"
          />
          <path
            d="M22.8947 5.89474C22.8947 3.57305 24.7836 1.68421 27.1053 1.68421C29.4269 1.68421 31.3158 3.57305 31.3158 5.89474C31.3158 12.352 19.8674 17.6842 17.8421 17.6842V16C19.0926 16 29.6316 11.2143 29.6316 5.89474C29.6316 4.50189 28.4981 3.36842 27.1053 3.36842C25.7124 3.36842 24.5789 4.50189 24.5789 5.89474H22.8947Z"
            fill="#E19214"
          />
          <path
            d="M14.4737 18.5263H17.8421V25.2632H14.4737V18.5263Z"
            fill="#F99F10"
          />
          <path
            d="M17.8421 20.2105V18.5263H14.4737V23.5789L17.8421 20.2105Z"
            fill="#F9C900"
          />
          <path
            d="M24.5789 30.3158H7.73684V24.4211C7.73684 23.9562 8.1141 23.5789 8.57895 23.5789H23.7368C24.2017 23.5789 24.5789 23.9562 24.5789 24.4211V30.3158Z"
            fill="#BC9C73"
          />
          <path
            d="M18.6842 23.5789H8.57895C8.1141 23.5789 7.73684 23.9562 7.73684 24.4211V30.3158H11.9474L18.6842 23.5789Z"
            fill="#CCB9AE"
          />
          <path
            d="M24.5655 0C25.0354 0 25.4219 0.388211 25.4126 0.858105C25.2072 11.6219 21.1423 20.2105 16.1579 20.2105C11.1735 20.2105 7.10863 11.6219 6.90316 0.858105C6.89389 0.388211 7.27958 0 7.74947 0H24.5655Z"
            fill="#F99F10"
          />
          <path
            d="M24.5655 0H7.74947C7.27958 0 6.89389 0.388211 6.90316 0.858105C7.01937 6.9339 8.36505 12.3158 10.4114 15.8518L25.4118 0.851369C25.4168 0.384842 25.0337 0 24.5655 0Z"
            fill="#F9C900"
          />
          <path
            d="M25.4211 32H6.89474C6.42989 32 6.05263 31.6227 6.05263 31.1579V29.4737C6.05263 29.0088 6.42989 28.6316 6.89474 28.6316H25.4211C25.8859 28.6316 26.2632 29.0088 26.2632 29.4737V31.1579C26.2632 31.6227 25.8859 32 25.4211 32Z"
            fill="#BC9C73"
          />
          <path
            d="M17.8421 28.6316H6.89474C6.42989 28.6316 6.05263 29.0088 6.05263 29.4737V31.1579C6.05263 31.6227 6.42989 32 6.89474 32H14.4737L17.8421 28.6316Z"
            fill="#CCB9AE"
          />
        </svg>
      `;
    default:
      return ``;
  }
}

function createFriendRewardPopup(obj) {
  let myBgModal = document.getElementById("myBgModal");
  if (myBgModal) {
    myBgModal.remove();
  }
  let referralDiv = document.createElement("div");
  referralDiv.id = "myBgModal";
  referralDiv.classList.add("bg-modal");
  document.body.appendChild(referralDiv);
  let bgModalContent = /* HTML */ `${!obj.page_settings.appearance
      .is_hide_brand_bixgrow
      ? /* HTML */ `
          <div class="bg-powered-by-container">
            <span class="bg-powered-by-text">Powered by BixGrow</span>
          </div>
        `
      : ""}
    <div class="bg-modal-content">
      <svg
        id="bg-close"
        class="bg-close"
        style="width:12px;height:12px"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M7.06045 5.99999L11.7803 1.28068C12.0732 0.987705 12.0732 0.512692 11.7803 0.219735C11.4873 -0.0732451 11.0123 -0.0732451 10.7193 0.219735L5.99999 4.93953L1.28068 0.219735C0.987705 -0.0732451 0.512692 -0.0732451 0.219735 0.219735C-0.0732217 0.512716 -0.0732451 0.987728 0.219735 1.28068L4.93953 5.99999L0.219735 10.7193C-0.0732451 11.0123 -0.0732451 11.4873 0.219735 11.7803C0.512716 12.0732 0.987728 12.0732 1.28068 11.7803L5.99999 7.06045L10.7193 11.7803C11.0123 12.0732 11.4873 12.0732 11.7802 11.7803C12.0732 11.4873 12.0732 11.0123 11.7802 10.7193L7.06045 5.99999Z"
          fill="#1B283F"
        />
      </svg>
      ${obj?.page_settings?.appearance?.icon_url &&
      obj?.page_settings?.appearance?.enable_icon
        ? /* HTML */ `
            <div class="bixgrow-refferral-friend-pupup-logo">
              <img
                height="90"
                width="90"
                src=${obj?.page_settings?.appearance?.icon_url}
                alt="bixgrow-fiend-popup-icon-url"
              />
            </div>
          `
        : ``}
      ${obj?.page_settings?.appearance?.icon_type &&
      obj?.page_settings?.appearance?.enable_icon
        ? /* HTML */ `
            <div class="bixgrow-refferral-friend-pupup-logo">
              ${getLogoByType(
                obj?.page_settings?.appearance?.icon_type,
                90,
                90,
              )}
            </div>
          `
        : ``}
      <div class="bg-heading">
        ${obj.page_settings.content.coupon_display_page.headline}
      </div>
      <div class="bg-content">
        ${obj.page_settings.content.coupon_display_page.description}
      </div>
      <div
        id="bg-input-wrapper"
        class="bg-input-wrapper"
        data-copy="${obj.page_settings.content.coupon_display_page.copy}"
      >
        <input
          id="bg-input"
          class="bg-input bg-input__border-dashed"
          readonly
          value="${obj.discount.code}"
        />
      </div>
      <button type="button" id="bg-btn-shop-now" class="bg-btn bg-btn-dark">
        ${obj.page_settings.content.coupon_display_page.button}
      </button>
      ${obj.discount.price_rule.ends_at &&
      obj.page_settings.content.coupon_display_page.expire
        ? /* HTML */ `
            <div class="bg-discount-expired">
              ${obj.page_settings.content.coupon_display_page.expire.replace(
                "{end_date}",
                detectDateFormat(obj.discount.price_rule.ends_at),
              )}
            </div>
          `
        : ""}
    </div>`;
  referralDiv.insertAdjacentHTML("beforeend", bgModalContent);
  let bgClose = document.getElementById("bg-close");
  bgClose.addEventListener("click", function ($event) {
    referralDiv.style.display = "none";
  });
  let myBtn = document.getElementById("bg-btn-shop-now");
  myBtn.addEventListener("click", function () {
    referralDiv.style.display = "none";
  });
  let bgInputWrapper = document.getElementById("bg-input-wrapper");
  bgInputWrapper.addEventListener("click", function ($event) {
    let bgInput = document.getElementById("bg-input");
    bgInput.select();
    document.execCommand("copy");
    bgInputWrapper.setAttribute(
      "data-copy",
      obj.page_settings.content.coupon_display_page.copied,
    );
    setTimeout(() => {
      bgInputWrapper.setAttribute(
        "data-copy",
        obj.page_settings.content.coupon_display_page.copy,
      );
    }, 1500);
  });
  loadFont(obj?.page_settings?.appearance?.custom_font_family, ["bg-modal"]);
  referralDiv.style.display = "block";
}

function createInvalidReferralLinkPopup(obj) {
  let myBgModal = document.getElementById("myBgModal");
  if (myBgModal) {
    myBgModal.remove();
  }
  let referralDiv = document.createElement("div");
  referralDiv.id = "myBgModal";
  referralDiv.classList.add("bg-modal");
  document.body.appendChild(referralDiv);
  let bgModalContent = /* HTML */ ` <div class="bg-modal-content">
    <svg
      id="bg-close"
      class="bg-close"
      style="width:12px;height:12px"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M7.06045 5.99999L11.7803 1.28068C12.0732 0.987705 12.0732 0.512692 11.7803 0.219735C11.4873 -0.0732451 11.0123 -0.0732451 10.7193 0.219735L5.99999 4.93953L1.28068 0.219735C0.987705 -0.0732451 0.512692 -0.0732451 0.219735 0.219735C-0.0732217 0.512716 -0.0732451 0.987728 0.219735 1.28068L4.93953 5.99999L0.219735 10.7193C-0.0732451 11.0123 -0.0732451 11.4873 0.219735 11.7803C0.512716 12.0732 0.987728 12.0732 1.28068 11.7803L5.99999 7.06045L10.7193 11.7803C11.0123 12.0732 11.4873 12.0732 11.7802 11.7803C12.0732 11.4873 12.0732 11.0123 11.7802 10.7193L7.06045 5.99999Z"
        fill="#1B283F"
      />
    </svg>
    <div class="bg-heading">${obj.page_settings.content.headline}</div>
    <div class="bg-content">${obj.page_settings.content.description}</div>
    <button type="button" id="bg-btn-shop-now" class="bg-btn bg-btn-dark">
      ${obj.page_settings.content.button}
    </button>
  </div>`;
  referralDiv.insertAdjacentHTML("beforeend", bgModalContent);
  let bgClose = document.getElementById("bg-close");
  bgClose.addEventListener("click", function ($event) {
    referralDiv.style.display = "none";
  });
  let myBtn = document.getElementById("bg-btn-shop-now");
  myBtn.addEventListener("click", function () {
    referralDiv.style.display = "none";
  });
  loadFont(obj?.page_settings?.appearance?.custom_font_family, ["bg-modal"]);
  referralDiv.style.display = "block";
}

function createBeforeRedemFriendRewardPopup(obj) {
  let myBgModal = document.getElementById("myBgModal");
  if (myBgModal) {
    myBgModal.remove();
  }
  let referralDiv = document.createElement("div");
  referralDiv.id = "myBgModal";
  referralDiv.classList.add("bg-modal");
  document.body.appendChild(referralDiv);

  let bgModalContent = /* HTML */ ` ${!obj.page_settings.appearance
      .is_hide_brand_bixgrow
      ? /* HTML */ `
          <div class="bg-powered-by-container">
            <span class="bg-powered-by-text">Powered by BixGrow</span>
          </div>
        `
      : ""}
    <div class="bg-modal-content">
      <svg
        id="bg-close"
        class="bg-close"
        style="width:12px;height:12px"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M7.06045 5.99999L11.7803 1.28068C12.0732 0.987705 12.0732 0.512692 11.7803 0.219735C11.4873 -0.0732451 11.0123 -0.0732451 10.7193 0.219735L5.99999 4.93953L1.28068 0.219735C0.987705 -0.0732451 0.512692 -0.0732451 0.219735 0.219735C-0.0732217 0.512716 -0.0732451 0.987728 0.219735 1.28068L4.93953 5.99999L0.219735 10.7193C-0.0732451 11.0123 -0.0732451 11.4873 0.219735 11.7803C0.512716 12.0732 0.987728 12.0732 1.28068 11.7803L5.99999 7.06045L10.7193 11.7803C11.0123 12.0732 11.4873 12.0732 11.7802 11.7803C12.0732 11.4873 12.0732 11.0123 11.7802 10.7193L7.06045 5.99999Z"
          fill="#1B283F"
        />
      </svg>
      ${obj?.page_settings?.appearance?.icon_url &&
      obj?.page_settings?.appearance?.enable_icon
        ? /* HTML */ `
            <div class="bixgrow-refferral-friend-pupup-logo">
              <img
                height="90"
                width="90"
                src=${obj?.page_settings?.appearance?.icon_url}
                alt="bixgrow-fiend-popup-icon-url"
              />
            </div>
          `
        : ``}
      ${obj?.page_settings?.appearance?.icon_type &&
      obj?.page_settings?.appearance?.enable_icon
        ? /* HTML */ `
            <div class="bixgrow-refferral-friend-pupup-logo">
              ${getLogoByType(
                obj?.page_settings?.appearance?.icon_type,
                90,
                90,
              )}
            </div>
          `
        : ``}
      <div id="before-redeem">
        <div class="bg-heading">
          ${obj.page_settings.content.coupon_display_page
            .before_redeem_headline}
        </div>
        <div class="bg-content">
          ${obj.page_settings.content.coupon_display_page
            .before_redeem_description}
        </div>
        <div class="bg-input-wrapper">
          <input
            id="bg-input"
            class="bg-input"
            placeholder="${obj.page_settings.content.coupon_display_page
              .before_redeem_your_email}"
          />
          <div
            id="bg-before-redeem-friend-reward-error-text"
            class="bg-error-message bg-text-left bg-d-none"
          >
            ${obj.page_settings.content.coupon_display_page.email_error_message}
          </div>
        </div>
        ${obj.enable_marketing_consent_request == 1
          ? /* HTML */ `
              <label
                class="bixgrow-referral-friend-popup-checkbox-container"
                id="bgMyCheckbox"
              >
                ${obj.marketing_consent_text}
                <input type="checkbox" />
                <span class="bixgrow-referral-friend-popup-checkmark"></span>
              </label>
            `
          : ""}

        <button
          type="button"
          id="bg-clainm-discount-btn"
          onclick="handleClaimDiscount()"
          class="bg-btn bg-btn-dark"
          style="display:flex;align-items:center;justify-content:center;"
        >
          <span class="bixgrow-button-text">
            ${obj.page_settings.content.coupon_display_page
              .before_redeem_button}</span
          >
          <span class="bixgrow-spinner"></span>
        </button>
      </div>

      <div id="after-redeem" class="bg-d-none">
        <div class="bg-heading">
          ${obj.page_settings.content.coupon_display_page.headline}
        </div>
        <div class="bg-content">
          ${obj.page_settings.content.coupon_display_page.description}
        </div>
        <div
          id="bg-input-wrapper"
          class="bg-input-wrapper"
          data-copy="${obj.page_settings.content.coupon_display_page.copy}"
        >
          <input
            id="bg-after-redeem-input"
            class="bg-input"
            readonly
            value=""
            style="border: 2px dashed #81868B;"
          />
        </div>
        <button type="button" id="bg-btn-shop-now" class="bg-btn bg-btn-dark">
          ${obj.page_settings.content.coupon_display_page.button}
        </button>
      </div>
    </div>`;
  referralDiv.insertAdjacentHTML("beforeend", bgModalContent);
  let bgClose = document.getElementById("bg-close");
  bgClose.addEventListener("click", function ($event) {
    referralDiv.style.display = "none";
  });

  let myBtn = document.getElementById("bg-btn-shop-now");
  myBtn.addEventListener("click", function () {
    referralDiv.style.display = "none";
  });
  let bgInputWrapper = document.getElementById("bg-input-wrapper");
  bgInputWrapper.addEventListener("click", function ($event) {
    let bgInput = document.getElementById("bg-after-redeem-input");
    bgInput.select();
    document.execCommand("copy");
    bgInputWrapper.setAttribute(
      "data-copy",
      obj.page_settings.content.coupon_display_page.copied,
    );
    setTimeout(() => {
      bgInputWrapper.setAttribute(
        "data-copy",
        obj.page_settings.content.coupon_display_page.copy,
      );
    }, 1500);
  });
  loadFont(obj?.page_settings?.appearance?.custom_font_family, ["bg-modal"]);
  referralDiv.style.display = "block";
}

async function handleClaimDiscount() {
  const advocateId = myDataSetting.advocate_id;
  const emailErrorMessage =
    myDataSetting.page_settings.content.coupon_display_page.email_error_message;
  const referralInvalidMessage =
    myDataSetting.page_settings.content.coupon_display_page.referral_invalid;

  const redeemBtn = document.getElementById("bg-clainm-discount-btn");
  const emailInputElement = document.getElementById("bg-input");
  const emailInput = emailInputElement.value.trim();
  const checkBox = document.getElementById("bgMyCheckbox");
  const checkBoxValue = checkBox ? (checkBox.checked ? 1 : 0) : 0;

  const errorNote = document.getElementById(
    "bg-before-redeem-friend-reward-error-text",
  );

  if (!validateEmail(emailInput)) {
    errorNote.textContent = emailErrorMessage;
    errorNote.classList.remove("bg-d-none");
    emailInputElement.classList.add("bg-border-error");
    return;
  } else {
    errorNote.classList.add("bg-d-none");
    emailInputElement.classList.remove("bg-border-error");
  }

  redeemBtn.classList.add("bg-disabled", "bixgrow-loading");

  const payload = {
    shop: Shopify.shop,
    email: emailInput,
    visitor_id: bgGetCookie("bgrf_visitor_id"),
    advocate_id: advocateId,
    enable_marketing_consent_request: checkBoxValue,
  };

  try {
    const responseData = await bgReferralUseFetch(
      `${BG_AFFILIATE_API_BASE_URL}/api/referral/friends/discount`,
      "POST",
      payload,
      { "Content-Type": "application/json", Accept: "application/json" },
    );
    if (responseData) {
      myDataSetting.discount = responseData.discount;
      myDataSetting.share_coupon = responseData.share_coupon;
      // createFriendRewardPopup(myDataSetting);
      document.getElementById("bg-after-redeem-input").value =
        responseData.discount.code;
      document.getElementById("before-redeem").classList.add("bg-d-none");
      document.getElementById("after-redeem").classList.remove("bg-d-none");
      errorNote.classList.add("bg-d-none");
      emailInputElement.classList.remove("bg-border-error");
      redeemBtn.classList.remove("bg-disabled", "bixgrow-loading");
      autoAppliedCoupon(responseData.discount.code);
      // redeemBtn.classList.add("bgDisplayNone");
      // redeemBtn.classList.remove('bgDisabled','bixgrow-loading');
      // shopNowBtn.classList.remove("bgDisplayNone");
      // bgInput.innerHTML = responseData?.discount_code;
      // autoAppliedCoupon(responseData?.discount_code);
      // bgInputWrapper.classList.remove("bgDisplayNone");
      // document.getElementById('bgShopNowContent').classList.remove("bgDisplayNone");
      // document.getElementById('bgRedeemContent').classList.add("bgDisplayNone");
      // if(isDynamicCoupon){
      //   bgSetCookie('bixgrow_affiliate_referral', bgRefHashCode, 30);
      // }
    }
  } catch (error) {
    if (error?.status == 422) {
      const knownErrors = [
        "referral_invalid", // trùng email với người giới thiệu
        "email_linked_to_customer_account",
        "email_used_for_purchase",
      ];

      if (knownErrors.includes(error?.message)) {
        errorNote.textContent =
          myDataSetting.page_settings.content.coupon_display_page[
            error.message
          ];
        errorNote.classList.remove("bg-d-none");
        emailInputElement.classList.add("bg-border-error");
        redeemBtn.classList.remove("bg-disabled", "bixgrow-loading");
      }
    }
  }
}
window.handleClaimDiscount = handleClaimDiscount;

async function autoAppliedCoupon(discountCode) {
  // let couponCodePath = encodeURI("/discount/" + discountCode);
  // couponCodePath = couponCodePath.replace("#", "%2523");
  // let iframeBixgrow = document.createElement("iframe");
  // iframeBixgrow.style.cssText = "height: 0; width: 0; display: none;";
  // iframeBixgrow.src = couponCodePath;
  // iframeBixgrow.innerHTML = "Your browser does not support iframes";
  // let app = document.querySelector("body");
  // app.prepend(iframeBixgrow);

  discountCode = encodeURIComponent(discountCode);
  try {
    const url = `${window.location.origin}/discount/${discountCode}`;
    await bgReferralUseFetch(url, "GET");
  } catch (error) {
    console.log(error);
  }
}

function bgGetParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function bgGetDataReferral() {
  if (Object.keys(campaign).length > 0) {
    if (
      bgIsShowWidget(
        campaign?.page_settings?.appearance_v2?.launcher.target,
        campaign?.page_settings?.appearance_v2?.launcher.target_urls,
      )
    ) {
      createWidget(
        campaign?.page_settings,
        campaign?.campain_id,
        campaign?.customer_email,
        campaign?.customer_name,
        campaign?.locale,
        campaign,
      );
    }
  }
}

function createWidget(
  obj,
  campainId,
  customerEmail,
  customerName,
  locale,
  responseData,
) {
  let head = document.head || document.getElementsByTagName("head")[0];
  let bixgrow_referral_widget_container = document.getElementById(
    "bixgrow_referral_widget_container",
  );
  if (bixgrow_referral_widget_container) {
    bixgrow_referral_widget_container.remove();
  }
  let referralDiv = document.createElement("div");
  referralDiv.id = "bixgrow_referral_widget_container";
  document.body.appendChild(referralDiv);
  let style = document.createElement("style");

  let css = "";
  if (obj.appearance_v2.launcher.desktop.type == "float") {
    css += `
    #bixgrow_referral_widget_container{
     position: fixed;
     bottom: ${obj.appearance_v2.launcher.desktop.bottom || 20}px;
     ${
       obj.appearance_v2.launcher.desktop.position == "right" ||
       !obj.appearance_v2.launcher.desktop.position
         ? `right: ${obj.appearance_v2.launcher.desktop.side || 20}px;`
         : `left: ${obj.appearance_v2.launcher.desktop.side || 20}px;`
     } 
     z-index:1101199308121998;
    }
    #bixgrow-refer{
     webkit-animation: .3s linear fadeIn forwards;
       animation: .3s linear fadeIn forwards;
    }
    .bixgrow-refer-banner-image {
     display: inline-block;
     width: 100%;
     height: auto;
     border-top-left-radius: 6px;
     border-top-right-radius: 6px;
   }
   
     .bixgrow-form-group-widget {
     text-align: left !important;
     margin-bottom: 16px;
     }
     .bixgrow-input-icon .bixgrow-form-control-widget {
     padding-left: 38px;
     }
     
     .bixgrow-form-control-widget {
     display: block;
     width: 100%;
     height: 41px;
     padding: 10px 16px;
     font-weight: 400;
     line-height: 1.5;
     color: #616161;
     background-color: #ffffff;
     background-clip: padding-box;
     border: 1px solid #E3E3E3;
     border-radius: 0.42rem;
     -webkit-box-shadow: none;
     box-shadow: none;
     -webkit-transition: border-color 0.15s ease-in-out,
     -webkit-box-shadow 0.15s ease-in-out;
     transition: border-color 0.15s ease-in-out,
     -webkit-box-shadow 0.15s ease-in-out;
     transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
     transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
     -webkit-box-shadow 0.15s ease-in-out;
     box-sizing: border-box;
     -webkit-box-sizing: border-box;
     font-size:14px;
     }
   
     
     @media (prefers-reduced-motion: reduce) {
     .bixgrow-form-control-widget {
     transition: none;
     }
     }
     
     .bixgrow-form-control-widget::-ms-expand {
     background-color: transparent;
     border: 0;
     }
     
     .bixgrow-form-control-widget:-moz-focusring {
     color: transparent;
     text-shadow: 0 0 0 #495057;
     }
     .bixgrow-refer-widget-icon__container{
       display:flex;
       align-items:center;
       width:32px;
       height:32px;
       margin-right: ${
         obj.appearance_v2.launcher.desktop.display_method == "icon_only"
           ? "0px"
           : "5px"
       };
     }
     
     .bixgrow-form-control-widget:focus {
     color: #495057;
     background-color: #fff;
     border-color: #80bdff;
     outline: 0;
     box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
     }
     
     .bixgrow-form-control-widget::-webkit-input-placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-form-control-widget::-moz-placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-form-control-widget:-ms-input-placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-form-control-widget::-ms-input-placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-form-control-widget::placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-input-icon span {
     left: 0;
     top: 0;
     bottom: 0;
     position: absolute;
     display: -webkit-box;
     display: -ms-flexbox;
     display: flex;
     -webkit-box-align: center;
     -ms-flex-align: center;
     align-items: center;
     -webkit-box-pack: center;
     -ms-flex-pack: center;
     justify-content: center;
     width: calc(1.5em + 1.3rem + 2px);
     }
     .bixgrow-btn-widget {
       border: 1px solid ${obj.appearance.button_launcher.stroke};
       user-select: none;
       white-space: nowrap;
       border-radius: ${obj.appearance_v2.button_radius}px !important;
       width: 100%;
       padding: 10px 20px;
       color: ${obj.appearance.button_launcher.text};
       background-color: ${obj.appearance.button_launcher.background} !important;
       cursor: pointer;
       font-weight:500;
       font-size:14px;
       height: 41px;
       line-height: normal !important;
       display: flex;
       align-items: center;
       justify-content: center;
     }
     .bixgrow-btn-widget:hover {
       opacity:0.8;
     }
     
    .bixgrow-loading .bixgrow-spinner {
      display: inline-block; 
    }
    .bixgrow-loading .bixgrow-button-text {
      display:none;
    }
     .bixgrow-refer-widget {
     min-width:50px;
     cursor: pointer;
     height: 56px;
     border-radius: 30px;
     box-shadow: 0 0 2px rgb(0 0 0 / 10%), 0 4px 20px rgb(0 0 0 / 14%);
     transition: all 0.3s;
     -webkit-user-select: none;
     -moz-user-select: none;
     -ms-user-select: none;
     user-select: none;
     overflow: hidden;
     background-color: ${obj.appearance_v2.launcher.background};
     -webkit-animation: bixgrowFadeUp .3s;
     animation: bixgrowFadeUp .3s;
     position: absolute;
     ${
       obj.appearance_v2.launcher.desktop.position == "right"
         ? `right: 0px;`
         : `left: 0px;`
     }
       bottom: 0px;
   
     }
   
     .bixgrow-refer-widget-content {
     display: flex;
     justify-content: center;
     align-items: center;
     padding: 16px 19px;
     color: #ffff;
     white-space: nowrap;
    height:100%;
   
     }
     .bixgrow-refer-widget-content span {
       font-size:16px;
       font-weight: 400;
       color:${obj.appearance_v2.launcher.text};
     }
     .bixgrow-refer-widget-close{
       position: absolute;
       top: 0;
       bottom: 0;
       opacity: 0;
       display: flex;
       align-items: center;
       justify-content: center;
       height:100%;
       left: 19px;
     }
     .bixgrow-container{
     width: 100%;
     margin-right: auto;
     margin-left: auto;
     }
     .bixgrow-d-flex{
       display:flex;
     
     }
     .bixgrow-align-items-center{
       align-items: center;
     }
     .bixgrow-justify-content-center{
       justify-content: center;
     }
     .bixgrow-margin-top-10{
       margin-top:10px;
     }
     #bixgrow-close-popup{
       position: absolute;
       right: 15px;
       top: 15px;
       cursor: pointer;
     }
   
     #bixgrow-popup-referral{
       width: 360px;
       position: absolute;
       bottom: 63px;
       ${
         obj.appearance_v2.launcher.desktop.position == "right" ||
         !obj.appearance_v2.launcher.desktop.position
           ? `right: 0px;left:unset;`
           : `left: 0px;right:unset;`
       }
       box-shadow: 0 4px 10px 1px rgb(0 0 0 / 10%);
       background-color: white;
       border-radius:${obj.appearance_v2.card_radius}px;
       overflow:scroll;
     }
   
     .bixgrow-label-name-widget{
       font-size:13px;
       text-align:left;
     }
   
     .bixgrow-refer-content-description-widget{
       font-size: ${obj.appearance_v2.description_text_size}px;
       word-break: break-word;
       margin-bottom: 18px;
       margin-top:0px;
     }
   
     #bixgrow-copy-overlay-widget{
       position: absolute;
       background-color: #000000;
       top: 0px;
       left: 0;
       height: 45px;
       justify-content: center;
       align-items: center;
       width: 100%;
       color: white;
       font-size: 16px;
       display: flex;
     }
     .bixgrow-refer-content-title-widget{
       display: block;
       font-weight: 600;
       font-size: ${obj.appearance_v2.heading_text_size}px;
       color: #000;
       text-align: center;
       margin-bottom: 10px;
       margin-top: 13px;
     }
     .bixgrow-refer-widget{
       border-radius: ${obj.appearance_v2.launcher.button_radius}px;
       }
     .bixgrow-widget-icon {
       width: 100%;
       height: 100%;
     }
     ${
       obj.appearance_v2.launcher.desktop.display_method == "icon_only"
         ? ".bixgrow-refer-widget-content{padding:10px 12px !important;}"
         : ""
     }
     .bixgrow-refer-widget-side{
      z-index: 9999;
       min-width:unset;
       width: 40px;
       height: auto!important;
       border-radius: 8px!important;
       writing-mode: vertical-rl;
       position: fixed;
       ${
         obj.appearance_v2.launcher.desktop.vertical_position == "low"
           ? "bottom:20px;"
           : `${
               obj.appearance_v2.launcher.desktop.vertical_position == "middle"
                 ? "bottom:50%;"
                 : "bottom:unset;top:50px;"
             }`
       } 
       ${
         obj.appearance_v2.launcher.desktop.position == "right"
           ? " border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important;right:0px;left:unset;"
           : "border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important;left:0px;right:unset;"
       }
     }
     .bixgrow-refer-widget-side .bixgrow-refer-widget-content {
       padding: 12px 6px;
   }
   .bixgrow-refer-widget-side .bixgrow-refer-widget-icon__container{
     margin-right: 0px;
     margin-bottom: ${
       obj.appearance_v2.launcher.desktop.display_method == "icon_only"
         ? "0px"
         : "5px"
     };
   }
   ${
     obj.appearance_v2.launcher.desktop.type == "side"
       ? `${
           obj.appearance_v2.launcher.desktop.position == "right"
             ? "#bixgrow_referral_widget_container{right: 50%;bottom:60px;}#bixgrow-popup-referral{transform: translateX(50%);bottom:0px;}"
             : "#bixgrow_referral_widget_container{left: 50%;bottom:60px;}#bixgrow-popup-referral{transform: translateX(-50%);bottom:0px;}"
         }`
       : ""
   }
   #bixgrow_referral_widget_container
   #bixgrow-popup-referral{
     -webkit-animation: fadeIn .3s ease;
    animation: fadeIn .3s ease;
    border-radius:6px;
   }
   
     .bixgrow-inactive{
       display:none;
     }
     .bixgrow-active {
       width:56px !important;
       border-radius: 30px !important;
     }
     
     .bixgrow-active .bixgrow-refer-widget-content {
       -webkit-animation: fadeOut .3s ease;
       animation: fadeOut .3s ease;
       -webkit-animation-fill-mode: forwards;
       animation-fill-mode: forwards;
     }
   
     .bixgrow-active .bixgrow-refer-widget-close {
       -webkit-animation: fadeIn .3s ease;
       animation: fadeIn .3s ease;
       -webkit-animation-fill-mode: forwards;
       animation-fill-mode: forwards;
     }
     .bixgrow-border-red{
       border: 1px solid #d72c0d !important;
     }
     .bixgrow-refer-widget-content svg [fill],.bixgrow-refer-widget-close svg [fill]{ fill:${
       obj.appearance_v2.launcher.text
     } !important;}
     
     @-webkit-keyframes fadeIn {
     from {opacity: 0}
     to {opacity: 1}
     }
   
     @keyframes fadeIn {
     from {opacity: 0} 
     to {opacity: 1}
     }
   
     @ - webkit - keyframes fadeOut {
       from {
           opacity: 1
       }
       to {
           opacity: 0
       }
   }
   @keyframes fadeOut {
       from {
         opacity: 1
       }
       to {
         opacity: 0
       }
   }
   @ - webkit - keyframes bixgrowFadeOutNoDisplay {
       from {
           opacity: 1
       }
       to {
           opacity: 0
       }
   }
   @keyframes bixgrowFadeOutNoDisplay {
       from {
           opacity: 1
       }
       to {
           opacity: 0
       }
   }
   @ - webkit - keyframes bixgrowFadeUp {
       from {
           transform: scale(.8)
       }
       to {
           transform: scale(1)
       }
   }
   
   @keyframes bixgrowFadeUp {
       from {
           transform: scale(.8)
       }
       to {
           transform: scale(1)
       }
   }
   
   @ - webkit - keyframes bixgrowfadeSlideIn {
       from{
           bottom:15px
       }
   
       to {
           bottom:20px
       }
   }
   @keyframes bixgrowfadeSlideIn {
     from{
       bottom:15px
   }
   
   to {
       bottom:20px
   }
   }
     
     @media (min-width: 576px) {
       .bixgrow-container {
         max-width: 540px;
       }
     
     }
   
     @media only screen and (max-height: 450px), only screen and (max-width: 450px){
       #bixgrow-popup-referral{
         height: 100%!important;
       left: 0!important;
       max-height: 100vh!important;
       max-width: 100vw!important;
       right: 0!important;
       top: 0!important;
       width: 100%!important;
       position:fixed !important;
       z-index:99999;
       transform: unset!important;
       border-radius: 0px !important;
       }
   
       .bixgrow-refer-banner-image {
         border-top-left-radius: 0px;
         border-top-right-radius: 0px;
       }
       #bixgrow-close-popup-widget-mobile{
         display:block !important;
       }
   
     }
   
     #bixgrow-popup-referral::-webkit-scrollbar {
       display: none;
     }
     
     /* Hide scrollbar for IE, Edge and Firefox */
     #bixgrow-popup-referral {
       -ms-overflow-style: none;  /* IE and Edge */
       scrollbar-width: none;  /* Firefox */
     }
     
     .bixgrow-refer-content-main-widget{
       background: ${obj.appearance.background || "#fff"};
     }
     .bixgrow-refer-content-title-widget,.bixgrow-refer-content-description-widget{
       color: ${obj.appearance.text || "rgb(0, 0, 0)"};
     }
   
     @media (min-width: 768px) {
       .bixgrow-container {
         max-width: 720px;
       }
     }
     
     @media (min-width: 992px) {
       .bixgrow-container {
         max-width: 960px;
       }
     }
     
     @media (min-width: 1200px) {
       .bixgrow-container {
         max-width: 1140px;
       }
     }
     .b-powered-by-container-widget{
       text-align: center;
       margin-top: 10px;
       margin-bottom: 10px;
       position: absolute;
       top: -48px;
       left: 85px;
     }
     .b-powered-by-text-widget{
         color: #ffff;
         padding: 4px 19px;
         font-size: 14px;
         background: rgba(0,0,0,.15);
         font-weight: 600;
         border-radius: 15px;
         text-decoration: none;
     }
     .how-it-works-widget-heading{
       font-size:16px;
       font-weight:600;
     }
     .how-it-works-step-widget{
      padding:5px;
      flex: 1 1 0;
     }
     .how-it-works-step-image-widget{
       display: flex;
       align-items: center;
       justify-content: center;
     }
     .how-it-works-steps-widget{
       display: flex;
       align-items: center;
       justify-content: center;
       flex-direction: column;font-size:13px;
     }
     .how-it-works-step-image-widget,.how-it-works-widget-heading,.bixgrow-refer-content-title-widget,.bixgrow-refer-content-description-widget{
       color: ${obj.appearance.text || "rgb(0, 0, 0)"};
     }
     @media (max-width: 450px){
       #bixgrow-refer-widget-desktop-id{
         display:none;
       }
       #bixgrow-refer-widget-mobile-id{
        display: ${
          obj.appearance_v2.hide_on_mobile ? "none" : "block"
        } !important;
       }
       .bixgrow-refer-widget-icon__container {
         margin-right: ${
           obj.appearance_v2.launcher.mobile.display_method == "icon_only"
             ? "0px"
             : "5px"
         };
       }
       ${
         obj.appearance_v2.launcher.mobile.display_method == "icon_only"
           ? ".bixgrow-refer-widget-content{padding:10px 12px !important;}"
           : ""
       }
       #bixgrow_referral_widget_container{
         position: fixed;
         bottom: ${obj.appearance_v2.launcher.mobile.bottom || 20}px;
         ${
           obj.appearance_v2.launcher.mobile.position == "right" ||
           !obj.appearance_v2.launcher.mobile.position
             ? `right: ${
                 obj.appearance_v2.launcher.mobile.side || 20
               }px;left:unset;`
             : `left: ${
                 obj.appearance_v2.launcher.mobile.side || 20
               }px;right:unset;`
         } 
         z-index:1101199308121998;
        }
        .bixgrow-refer-widget {
         ${
           obj.appearance_v2.launcher.mobile.position == "right"
             ? `right: 0px;left:unset;`
             : `left: 0px;right:unset`
         }
         }
         #bixgrow-popup-referral{
           ${
             obj.appearance_v2.launcher.mobile.position == "right" ||
             !obj.appearance_v2.launcher.mobile.position
               ? `right: 0px;left: unset;`
               : `left: 0px;right:unset;`
           }
         }
         .bixgrow-refer-widget-side{
          z-index: 9999;
           min-width:unset;
           width: 40px;
           height: auto!important;
           border-radius: 8px!important;
           writing-mode: vertical-rl;
           position: fixed;
           ${
             obj.appearance_v2.launcher.mobile.vertical_position == "low"
               ? "bottom:20px;"
               : `${
                   obj.appearance_v2.launcher.mobile.vertical_position ==
                   "middle"
                     ? "bottom:50%;"
                     : "bottom:unset;top:50px;"
                 }`
           } 
           ${
             obj.appearance_v2.launcher.mobile.position == "right"
               ? " border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important;right:0px"
               : "border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important;left:0px;"
           }
         }
         .bixgrow-refer-widget-side .bixgrow-refer-widget-content {
           padding: 12px 6px;
       }
       .bixgrow-refer-widget-side .bixgrow-refer-widget-icon__container{
         margin-right: 0px;
         margin-bottom: ${
           obj.appearance_v2.launcher.mobile.display_method == "icon_only"
             ? "0px"
             : "5px"
         };
       }
       ${
         obj.appearance_v2.launcher.desktop.type == "side"
           ? `${
               obj.appearance_v2.launcher.desktop.position == "right"
                 ? "#bixgrow_referral_widget_container{right: 50%;bottom:60px;}#bixgrow-popup-referral{transform: translateX(50%);bottom:0px;}"
                 : "#bixgrow_referral_widget_container{left: 50%;bottom:60px;}#bixgrow-popup-referral{transform: translateX(-50%);bottom:0px;}"
             }`
           : ""
       }
     }
     .how-it-works-step-image-widget svg [fill]{fill:${
       obj.appearance.text || "rgb(0, 0, 0)"
     } !important;}
     ${obj.appearance.custom_css ? obj.appearance.custom_css : ""}`;
  } else {
    css += `
    #bixgrow_referral_widget_container{
      left: 0;
      top: 0;
      overflow:auto;
      z-index:1101199308121998;
      width:100%;
      height:100%;
     }
    #bixgrow-refer{
     webkit-animation: .3s linear fadeIn forwards;
       animation: .3s linear fadeIn forwards;
    }
    .bixgrow-refer-banner-image {
     display: inline-block;
     width: 100%;
     height: auto;
     border-top-left-radius: 6px;
     border-top-right-radius: 6px;
   }
   
   .bixgrow-wrapper-active{
    position: fixed;
    padding-top:100px;
    background-color:rgb(0,0,0,0.25);
   }

     .bixgrow-form-group-widget {
     text-align: left !important;
     margin-bottom: 16px;
     }
     .bixgrow-input-icon .bixgrow-form-control-widget {
     padding-left: 38px;
     }
     
     .bixgrow-form-control-widget {
     display: block;
     width: 100%;
     height: 41px;
     padding: 10px 16px;
     font-weight: 400;
     line-height: 1.5;
     color: #616161;
     background-color: #ffffff;
     background-clip: padding-box;
     border: 1px solid #E3E3E3;
     border-radius: 0.42rem;
     -webkit-box-shadow: none;
     box-shadow: none;
     -webkit-transition: border-color 0.15s ease-in-out,
     -webkit-box-shadow 0.15s ease-in-out;
     transition: border-color 0.15s ease-in-out,
     -webkit-box-shadow 0.15s ease-in-out;
     transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
     transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
     -webkit-box-shadow 0.15s ease-in-out;
     box-sizing: border-box;
     -webkit-box-sizing: border-box;
     font-size:14px;
     }
   
     
     @media (prefers-reduced-motion: reduce) {
     .bixgrow-form-control-widget {
     transition: none;
     }
     }
     
     .bixgrow-form-control-widget::-ms-expand {
     background-color: transparent;
     border: 0;
     }
     
     .bixgrow-form-control-widget:-moz-focusring {
     color: transparent;
     text-shadow: 0 0 0 #495057;
     }
     .bixgrow-refer-widget-icon__container{
       display:flex;
       align-items:center;
       width:32px;
       height:32px;
       margin-right: ${
         obj.appearance_v2.launcher.desktop.display_method == "icon_only"
           ? "0px"
           : "5px"
       };
     }
     
     .bixgrow-form-control-widget:focus {
     color: #495057;
     background-color: #fff;
     border-color: #80bdff;
     outline: 0;
     box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
     }
     
     .bixgrow-form-control-widget::-webkit-input-placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-form-control-widget::-moz-placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-form-control-widget:-ms-input-placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-form-control-widget::-ms-input-placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-form-control-widget::placeholder {
     color: #6c757d;
     opacity: 1;
     }
     
     .bixgrow-input-icon span {
     left: 0;
     top: 0;
     bottom: 0;
     position: absolute;
     display: -webkit-box;
     display: -ms-flexbox;
     display: flex;
     -webkit-box-align: center;
     -ms-flex-align: center;
     align-items: center;
     -webkit-box-pack: center;
     -ms-flex-pack: center;
     justify-content: center;
     width: calc(1.5em + 1.3rem + 2px);
     }
     .bixgrow-btn-widget {
       border: 1px solid ${obj.appearance.button_launcher.stroke};
       user-select: none;
       white-space: nowrap;
       border-radius: ${obj.appearance_v2.button_radius}px !important;
       width: 100%;
       padding: 10px 20px;
       color: ${obj.appearance.button_launcher.text};
       background-color: ${obj.appearance.button_launcher.background} !important;
       cursor: pointer;
       font-weight:500;
       font-size:14px;
       height: 41px;
       line-height: normal !important;
     }
     .bixgrow-btn-widget:hover {
       opacity:0.8;
     }
     .bixgrow-refer-widget {
     min-width:50px;
     cursor: pointer;
     height: 56px;
     border-radius: 30px;
     box-shadow: 0 0 2px rgb(0 0 0 / 10%), 0 4px 20px rgb(0 0 0 / 14%);
     transition: all 0.3s;
     -webkit-user-select: none;
     -moz-user-select: none;
     -ms-user-select: none;
     user-select: none;
     overflow: hidden;
     background-color: ${obj.appearance_v2.launcher.background};
     -webkit-animation: ${
       obj.appearance_v2.launcher.desktop.position == "right"
         ? "rightIn"
         : "leftIn"
     } .3s;
     animation: ${
       obj.appearance_v2.launcher.desktop.position == "right"
         ? "rightIn"
         : "leftIn"
     } .3s;
     position: absolute;
     ${
       obj.appearance_v2.launcher.desktop.position == "right"
         ? `right: 0px;`
         : `left: 0px;`
     }
       bottom: 0px;
   
     }
   
     .bixgrow-refer-widget-content {
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100%;
     padding: 16px 19px;
     color: #ffff;
     white-space: nowrap;
   
   
     }
     .bixgrow-refer-widget-content span {
       font-size:16px;
       font-weight: 400;
       color:${obj.appearance_v2.launcher.text};
     }
     .bixgrow-refer-widget-close{
       position: absolute;
       top: 0;
       bottom: 0;
       opacity: 0;
       display: flex;
       align-items: center;
       justify-content: center;
       height:100%;
       left: 19px;
     }
     .bixgrow-container{
     width: 100%;
     margin-right: auto;
     margin-left: auto;
     }
     .bixgrow-d-flex{
       display:flex;
     
     }
     .bixgrow-align-items-center{
       align-items: center;
     }
     .bixgrow-justify-content-center{
       justify-content: center;
     }
     .bixgrow-margin-top-10{
       margin-top:10px;
     }
     #bixgrow-close-popup{
       position: absolute;
       right: 15px;
       top: 15px;
       cursor: pointer;
     }
   
     #bixgrow-popup-referral{
      width: 360px;
      margin: auto;
      box-shadow: 0 4px 10px 1px rgb(0 0 0 / 10%);
      background-color: white;
      border-radius:${obj.appearance_v2.card_radius}px;
      overflow:scroll;
     }
   
     .bixgrow-label-name-widget{
       font-size:13px;
       text-align:left;
     }
   
     .bixgrow-refer-content-description-widget{
       font-size: ${obj.appearance_v2.description_text_size}px;
       word-break: break-word;
       margin-bottom: 18px;
       margin-top:0px;
     }
   
     #bixgrow-copy-overlay-widget{
       position: absolute;
       background-color: #000000;
       top: 0px;
       left: 0;
       height: calc(1.5em + 1.3rem);
       justify-content: center;
       align-items: center;
       width: 100%;
       color: white;
       font-size: 16px;
     }
     .bixgrow-refer-content-title-widget{
       display: block;
       font-weight: 600;
       font-size: ${obj.appearance_v2.heading_text_size}px;
       color: #000;
       text-align: center;
       margin-bottom: 10px;
       margin-top: 13px;
     }
     .bixgrow-refer-widget{
       border-radius: ${obj.appearance_v2.launcher.button_radius}px;
       }
     .bixgrow-widget-icon {
       width: 100%;
       height: 100%;
     }
     ${
       obj.appearance_v2.launcher.desktop.display_method == "icon_only"
         ? ".bixgrow-refer-widget-content{padding:10px 12px !important;}"
         : ""
     }
     .bixgrow-refer-widget-side{
      z-index: 9999;
       min-width:unset;
       width: 40px;
       height: auto!important;
       border-radius: 8px!important;
       writing-mode: vertical-rl;
       position: fixed;
       ${
         obj.appearance_v2.launcher.desktop.vertical_position == "low"
           ? "bottom:20px;"
           : `${
               obj.appearance_v2.launcher.desktop.vertical_position == "middle"
                 ? "bottom:50%;"
                 : "bottom:unset;top:50px;"
             }`
       } 
       ${
         obj.appearance_v2.launcher.desktop.position == "right"
           ? " border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important;right:0px;left:unset;"
           : "border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important;left:0px;right:unset;"
       }
     }
     .bixgrow-refer-widget-side .bixgrow-refer-widget-content {
       padding: 12px 6px;
   }
   .bixgrow-refer-widget-side .bixgrow-refer-widget-icon__container{
     width:24px;
     height: 24px;
     margin-right: 0px;
     margin-bottom: ${
       obj.appearance_v2.launcher.desktop.display_method == "icon_only"
         ? "0px"
         : "5px"
     };
   }
   #bixgrow_referral_widget_container
   #bixgrow-popup-referral{
     -webkit-animation: fadeIn .3s ease;
    animation: fadeIn .3s ease;
    border-radius:6px;
   }

   .bixgrow-side-active{
    -webkit-animation: ${
      obj.appearance_v2.launcher.desktop.position == "right"
        ? "rightOut"
        : "leftOut"
    } .3s;
    animation: ${
      obj.appearance_v2.launcher.desktop.position == "right"
        ? "rightOut"
        : "leftOut"
    } .3s;
    ${
      obj.appearance_v2.launcher.desktop.position == "right"
        ? "right:-56px;"
        : "left:-56px;"
    };
   }
   
     .bixgrow-inactive{
       display:none;
     }
     .bixgrow-active {
       width:56px !important;
       border-radius: 30px !important;
     }
     
     .bixgrow-active .bixgrow-refer-widget-content {
       -webkit-animation: fadeOut .3s ease;
       animation: fadeOut .3s ease;
       -webkit-animation-fill-mode: forwards;
       animation-fill-mode: forwards;
     }
   
     .bixgrow-active .bixgrow-refer-widget-close {
       -webkit-animation: fadeIn .3s ease;
       animation: fadeIn .3s ease;
       -webkit-animation-fill-mode: forwards;
       animation-fill-mode: forwards;
     }
     .bixgrow-border-red{
       border: 1px solid #d72c0d !important;
     }
     .bixgrow-refer-widget-content svg [fill],.bixgrow-refer-widget-close svg [fill]{ fill:${
       obj.appearance_v2.launcher.text
     } !important;}
     
     @-webkit-keyframes rightOut {
      0% {right: 0;}
      100% {right: -56px}
     }
   
     @keyframes rightOut {
      0% {right: 0;}
      100% {right: -56px}
     }
     @-webkit-keyframes rightIn {
      0% {right: -56px}
      100% {right: 0}
     }
   
     @keyframes rightIn {
      0% {right: -56px}
      100% {right: 0 }
     }

     @-webkit-keyframes leftOut {
      0% {left: 0;}
      100% {left: -56px}
     }
   
     @keyframes leftOut {
      0% {left: 0;}
      100% {left: -56px}
     }
     @-webkit-keyframes leftIn {
      0% {left: -56px}
      100% {left: 0}
     }
   
     @keyframes leftIn {
      0% {left: -56px}
      100% {left: 0 }
     }

     @-webkit-keyframes fadeIn {
     from {opacity: 0}
     to {opacity: 1}
     }
   
     @keyframes fadeIn {
     from {opacity: 0} 
     to {opacity: 1}
     }
   
     @ - webkit - keyframes fadeOut {
       from {
           opacity: 1
       }
       to {
           opacity: 0
       }
   }
   @keyframes fadeOut {
       from {
         opacity: 1
       }
       to {
         opacity: 0
       }
   }
   @ - webkit - keyframes bixgrowFadeOutNoDisplay {
       from {
           opacity: 1
       }
       to {
           opacity: 0
       }
   }
   @keyframes bixgrowFadeOutNoDisplay {
       from {
           opacity: 1
       }
       to {
           opacity: 0
       }
   }
   @ - webkit - keyframes bixgrowFadeUp {
       from {
           transform: scale(.8)
       }
       to {
           transform: scale(1)
       }
   }
   
   @keyframes bixgrowFadeUp {
       from {
           transform: scale(.8)
       }
       to {
           transform: scale(1)
       }
   }
   
   @ - webkit - keyframes bixgrowfadeSlideIn {
       from{
           bottom:15px
       }
   
       to {
           bottom:20px
       }
   }
   @keyframes bixgrowfadeSlideIn {
     from{
       bottom:15px
   }
   
   to {
       bottom:20px
   }
   }
     
     @media (min-width: 576px) {
       .bixgrow-container {
         max-width: 540px;
       }
     
     }
   
     @media only screen and (max-height: 450px), only screen and (max-width: 450px){
       #bixgrow-popup-referral{
         height: 100%!important;
       left: 0!important;
       max-height: 100vh!important;
       max-width: 100vw!important;
       right: 0!important;
       top: 0!important;
       width: 100%!important;
       position:fixed !important;
       z-index:99999;
       transform: unset!important;
       border-radius: 0px !important;
       }
   
       .bixgrow-refer-banner-image {
         border-top-left-radius: 0px;
         border-top-right-radius: 0px;
       }
       #bixgrow-close-popup-widget-mobile{
         display:block !important;
       }
   
     }
   
     #bixgrow-popup-referral::-webkit-scrollbar {
       display: none;
     }
     
     /* Hide scrollbar for IE, Edge and Firefox */
     #bixgrow-popup-referral {
       -ms-overflow-style: none;  /* IE and Edge */
       scrollbar-width: none;  /* Firefox */
     }
     
     .bixgrow-refer-content-main-widget{
       background: ${obj.appearance.background || "#fff"};
     }
     .bixgrow-refer-content-title-widget,.bixgrow-refer-content-description-widget{
       color: ${obj.appearance.text || "rgb(0, 0, 0)"};
     }
   
     @media (min-width: 768px) {
       .bixgrow-container {
         max-width: 720px;
       }
     }
     
     @media (min-width: 992px) {
       .bixgrow-container {
         max-width: 960px;
       }
     }
     
     @media (min-width: 1200px) {
       .bixgrow-container {
         max-width: 1140px;
       }
     }
     .b-powered-by-container-widget{
       text-align: center;
       margin-top: 10px;
       margin-bottom: 10px;
       position: absolute;
       top: -48px;
       left: 85px;
     }
     .b-powered-by-text-widget{
         color: #ffff;
         padding: 4px 19px;
         font-size: 14px;
         background: rgba(0,0,0,.15);
         font-weight: 600;
         border-radius: 15px;
         text-decoration: none;
     }
     .how-it-works-widget-heading{
       font-size:16px;
       font-weight:600;
     }
     .how-it-works-step-widget{
      padding:5px;
      flex: 1 1 0;
     }
     .how-it-works-step-image-widget{
       display: flex;
       align-items: center;
       justify-content: center;
     }
     .how-it-works-steps-widget{
       display: flex;
       align-items: center;
       justify-content: center;
       flex-direction: column;font-size:13px;
     }
     .how-it-works-step-image-widget,.how-it-works-widget-heading,.bixgrow-refer-content-title-widget,.bixgrow-refer-content-description-widget{
       color: ${obj.appearance.text || "rgb(0, 0, 0)"};
     }
     #bixgrow-popup-referral{
      position:relative;
     }
     #bixgrow-close-popup-widget-desktop{
      display:block !important;
     }
     @media (max-width: 450px){
       #bixgrow-refer-widget-desktop-id{
         display:none;
       }
       #bixgrow-close-popup-widget-desktop{
        display: none !important;
       }
       .bixgrow-wrapper-active{
        padding-top:unset !important;
        background-color:unset !important;
       }
       #bixgrow-refer-widget-mobile-id{
        display: ${
          obj.appearance_v2.hide_on_mobile ? "none" : "block"
        } !important;
       }
       .bixgrow-refer-widget-icon__container {
         margin-right: ${
           obj.appearance_v2.launcher.mobile.display_method == "icon_only"
             ? "0px"
             : "5px"
         };
       }
       ${
         obj.appearance_v2.launcher.mobile.display_method == "icon_only"
           ? ".bixgrow-refer-widget-content{padding:10px 12px !important;}"
           : ""
       }
       #bixgrow_referral_widget_container{
         position: fixed;
         bottom: ${obj.appearance_v2.launcher.mobile.bottom || 20}px;
         ${
           obj.appearance_v2.launcher.mobile.position == "right" ||
           !obj.appearance_v2.launcher.mobile.position
             ? `right: ${
                 obj.appearance_v2.launcher.mobile.side || 20
               }px;left:unset;`
             : `left: ${
                 obj.appearance_v2.launcher.mobile.side || 20
               }px;right:unset;`
         } 
         z-index:1101199308121998;  
         top: unset;
         padding-top: 0;
         background-color: unset;
         overflow: unset;
         width: 0;
         height: 0;
        }
        .bixgrow-refer-widget {
         ${
           obj.appearance_v2.launcher.mobile.position == "right"
             ? `right: 0px;left:unset;`
             : `left: 0px;right:unset`
         }
         }
         #bixgrow-popup-referral{
           ${
             obj.appearance_v2.launcher.mobile.position == "right" ||
             !obj.appearance_v2.launcher.mobile.position
               ? `right: 0px;left: unset;`
               : `left: 0px;right:unset;`
           }
         }
         .bixgrow-refer-widget-side{
          z-index: 9999;
           min-width:unset;
           width: 40px;
           height: auto!important;
           border-radius: 8px!important;
           writing-mode: vertical-rl;
           position: fixed;
           ${
             obj.appearance_v2.launcher.mobile.vertical_position == "low"
               ? "bottom:20px;"
               : `${
                   obj.appearance_v2.launcher.mobile.vertical_position ==
                   "middle"
                     ? "bottom:50%;"
                     : "bottom:unset;top:50px;"
                 }`
           } 
           ${
             obj.appearance_v2.launcher.mobile.position == "right"
               ? " border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important;right:0px"
               : "border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important;left:0px;"
           }
         }
         .bixgrow-refer-widget-side .bixgrow-refer-widget-content {
           padding: 12px 6px;
       }
       .bixgrow-refer-widget-side .bixgrow-refer-widget-icon__container{
         margin-right: 0px;
         margin-bottom: ${
           obj.appearance_v2.launcher.mobile.display_method == "icon_only"
             ? "0px"
             : "5px"
         };
       }
     }
     .how-it-works-step-image-widget svg [fill]{fill:${
       obj.appearance.text || "rgb(0, 0, 0)"
     } !important;}
     ${obj.appearance.custom_css ? obj.appearance.custom_css : ""}`;
  }

  style.type = "text/css";
  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  let divContent = `
 <div id="bixgrow-popup-referral" class="bixgrow-inactive">
 ${
   !obj.appearance.is_hide_brand_bixgrow
     ? ` <div id="b-powered-by-widget-id" class="b-powered-by-container-widget bixgrow-inactive">
 <span class="b-powered-by-text-widget">Powered by BixGrow</span>
 </div>`
     : ""
 }
 <span style=" position: absolute;top: 10px;right: 14px;cursor: pointer;display:none;" id="bixgrow-close-popup-widget-mobile"><svg style="width:30px;height:30px;" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16" fill="none">
 <circle cx="8" cy="8" r="8" fill="#81868B" fill-opacity="1"/>
 <path d="M10.7951 5.2049C10.6639 5.0737 10.4859 5 10.3003 5C10.1147 5 9.93678 5.0737 9.80554 5.2049L7.99577 7.01466L6.18601 5.2049C6.05402 5.07742 5.87724 5.00688 5.69375 5.00848C5.51026 5.01007 5.33473 5.08367 5.20498 5.21343C5.07522 5.34318 5.00162 5.51871 5.00003 5.7022C4.99843 5.88569 5.06897 6.06247 5.19645 6.19446L7.00621 8.00422L5.19645 9.81399C5.06897 9.94598 4.99843 10.1228 5.00003 10.3062C5.00162 10.4897 5.07522 10.6653 5.20498 10.795C5.33473 10.9248 5.51026 10.9984 5.69375 11C5.87724 11.0016 6.05402 10.931 6.18601 10.8035L7.99577 8.99379L9.80554 10.8035C9.93753 10.931 10.1143 11.0016 10.2978 11C10.4813 10.9984 10.6568 10.9248 10.7866 10.795C10.9163 10.6653 10.9899 10.4897 10.9915 10.3062C10.9931 10.1228 10.9226 9.94598 10.7951 9.81399L8.98534 8.00422L10.7951 6.19446C10.9263 6.06322 11 5.88525 11 5.69968C11 5.51411 10.9263 5.33614 10.7951 5.2049Z" fill="white"/>
 </svg></span>
 ${
   obj.appearance_v2.launcher.desktop.type == "side"
     ? `<span style=" position: absolute;top: 10px;right: 14px;cursor: pointer;display:none;" id="bixgrow-close-popup-widget-desktop"><svg style="width:30px;height:30px;" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16" fill="none">
 <circle cx="8" cy="8" r="8" fill="#81868B" fill-opacity="1"/>
 <path d="M10.7951 5.2049C10.6639 5.0737 10.4859 5 10.3003 5C10.1147 5 9.93678 5.0737 9.80554 5.2049L7.99577 7.01466L6.18601 5.2049C6.05402 5.07742 5.87724 5.00688 5.69375 5.00848C5.51026 5.01007 5.33473 5.08367 5.20498 5.21343C5.07522 5.34318 5.00162 5.51871 5.00003 5.7022C4.99843 5.88569 5.06897 6.06247 5.19645 6.19446L7.00621 8.00422L5.19645 9.81399C5.06897 9.94598 4.99843 10.1228 5.00003 10.3062C5.00162 10.4897 5.07522 10.6653 5.20498 10.795C5.33473 10.9248 5.51026 10.9984 5.69375 11C5.87724 11.0016 6.05402 10.931 6.18601 10.8035L7.99577 8.99379L9.80554 10.8035C9.93753 10.931 10.1143 11.0016 10.2978 11C10.4813 10.9984 10.6568 10.9248 10.7866 10.795C10.9163 10.6653 10.9899 10.4897 10.9915 10.3062C10.9931 10.1228 10.9226 9.94598 10.7951 9.81399L8.98534 8.00422L10.7951 6.19446C10.9263 6.06322 11 5.88525 11 5.69968C11 5.51411 10.9263 5.33614 10.7951 5.2049Z" fill="white"/>
 </svg></span>`
     : ""
 }
 
     ${
       !obj.appearance.is_hide_image
         ? `<div class="bixgrow-refer-widget-banner" style="line-height: 0;">
     <img src="${obj.appearance.banner}" class="bixgrow-refer-banner-image">
 </div>`
         : ""
     } 
     <div
       class="bixgrow-refer-content-main-widget"
       style="text-align: center"
     >
       <div id="bixgrow-refer-content-main-widget__container" style="width: 85%; display: inline-block;max-width:320px;margin-bottom:28px">

         
         <div id="bixgrow_refer_content_input_invite_widget" class="bixgrow-refer-content-input">
         <div
         class="bixgrow-refer-content-title-widget"
       >
       ${obj.content.join_page.headline || ""}
       </div>
         <p
           class="bixgrow-refer-content-description-widget"
         >
         ${obj.content.join_page.description || ""}
         </p>
           <div class="bixgrow-form-group-widget" >
             <div
               class="bixgrow-input-icon"
               style="position: relative"
             >
               <input
                 type="text"
                 class="bixgrow-form-control-widget"
                 name="email"
                 required
                 placeholder="${
                   obj.content.join_page.your_email
                     ? obj.content.join_page.your_email
                     : "Your email"
                 }"
                 id="bixgrow-email-advocate-widget"
               />
               <span>
                 <svg style="width:18px;height:18px;"
                   xmlns="http://www.w3.org/2000/svg"
                   width="18"
                   height="18"
                   viewBox="0 0 20 20"
                   fill="none"
                 >
                   <path
                     d="M15.8333 0.833344H4.16667C3.062 0.834667 2.00296 1.27408 1.22185 2.05519C0.440735 2.83631 0.00132321 3.89535 0 5.00001L0 15C0.00132321 16.1047 0.440735 17.1637 1.22185 17.9448C2.00296 18.7259 3.062 19.1654 4.16667 19.1667H15.8333C16.938 19.1654 17.997 18.7259 18.7782 17.9448C19.5593 17.1637 19.9987 16.1047 20 15V5.00001C19.9987 3.89535 19.5593 2.83631 18.7782 2.05519C17.997 1.27408 16.938 0.834667 15.8333 0.833344ZM4.16667 2.50001H15.8333C16.3323 2.50099 16.8196 2.65127 17.2325 2.93151C17.6453 3.21175 17.9649 3.60913 18.15 4.07251L11.7683 10.455C11.2987 10.9228 10.6628 11.1854 10 11.1854C9.33715 11.1854 8.70131 10.9228 8.23167 10.455L1.85 4.07251C2.03512 3.60913 2.35468 3.21175 2.76754 2.93151C3.1804 2.65127 3.66768 2.50099 4.16667 2.50001ZM15.8333 17.5H4.16667C3.50363 17.5 2.86774 17.2366 2.3989 16.7678C1.93006 16.2989 1.66667 15.6631 1.66667 15V6.25001L7.05333 11.6333C7.83552 12.4136 8.89521 12.8517 10 12.8517C11.1048 12.8517 12.1645 12.4136 12.9467 11.6333L18.3333 6.25001V15C18.3333 15.6631 18.0699 16.2989 17.6011 16.7678C17.1323 17.2366 16.4964 17.5 15.8333 17.5Z"
                     fill="#8e959b"
                   />
                 </svg>
               </span>
             </div>
             <div id="note-bixgrow-email-advocate-widget" style="display:none;color:#d72c0d;font-size:12px;"></div>
           </div>
           <div class="bixgrow-form-group-widget" >
         
             <div
               class="bixgrow-input-icon"
               style="position: relative"
             >
               <input
                 type="text"
                 class="bixgrow-form-control-widget"
                 placeholder="${
                   obj.content.join_page.your_name
                     ? obj.content.join_page.your_name
                     : "Your name (optional)"
                 }"
                 id="bixgrow-name-advocate-widget"
               />
               <span>
                 <svg style="width:18px;height:18px;"
                   xmlns="http://www.w3.org/2000/svg"
                   width="18"
                   height="18"
                   viewBox="0 0 20 20"
                   fill="none"
                 >
                   <g
                     clip-path="url(#clip0_4082_2860)"
                   >
                     <path
                       d="M17.5 20H15.8333V15.7975C15.8327 15.1442 15.5728 14.5178 15.1109 14.0558C14.6489 13.5938 14.0225 13.334 13.3692 13.3333H6.63083C5.9775 13.334 5.35111 13.5938 4.88914 14.0558C4.42716 14.5178 4.16733 15.1442 4.16667 15.7975V20H2.5V15.7975C2.50132 14.7023 2.93696 13.6524 3.71135 12.878C4.48575 12.1036 5.53567 11.668 6.63083 11.6667H13.3692C14.4643 11.668 15.5143 12.1036 16.2886 12.878C17.063 13.6524 17.4987 14.7023 17.5 15.7975V20Z"
                       fill="#8e959b"
                     />
                     <path
                       d="M10 10C9.0111 10 8.0444 9.70676 7.22215 9.15735C6.39991 8.60794 5.75904 7.82705 5.3806 6.91342C5.00217 5.99979 4.90315 4.99446 5.09608 4.02455C5.289 3.05465 5.76521 2.16373 6.46447 1.46447C7.16373 0.765206 8.05465 0.289002 9.02455 0.0960758C9.99446 -0.0968503 10.9998 0.00216643 11.9134 0.380605C12.8271 0.759043 13.6079 1.39991 14.1574 2.22215C14.7068 3.0444 15 4.0111 15 5C14.9987 6.32568 14.4715 7.59668 13.5341 8.53407C12.5967 9.47147 11.3257 9.99868 10 10ZM10 1.66667C9.34073 1.66667 8.69627 1.86217 8.1481 2.22844C7.59994 2.59471 7.1727 3.1153 6.9204 3.72439C6.66811 4.33348 6.6021 5.0037 6.73072 5.6503C6.85934 6.29691 7.1768 6.89085 7.64298 7.35703C8.10915 7.8232 8.7031 8.14067 9.3497 8.26929C9.9963 8.3979 10.6665 8.33189 11.2756 8.0796C11.8847 7.82731 12.4053 7.40007 12.7716 6.8519C13.1378 6.30374 13.3333 5.65927 13.3333 5C13.3333 4.11595 12.9821 3.2681 12.357 2.64298C11.7319 2.01786 10.8841 1.66667 10 1.66667Z"
                       fill="#8e959b"
                     />
                   </g>
                   <defs>
                     <clipPath id="clip0_4082_2860">
                       <rect
                         width="20"
                         height="20"
                         fill="white"
                       />
                     </clipPath>
                   </defs>
                 </svg>
               </span>
             </div>
           </div>
           ${
             responseData.enable_marketing_consent_request == 1
               ? `<label class="bg-checkbox bg-checkbox--small">
<input type="checkbox" id="bgWidgetMyCheckbox" class="bg-checkbox__input">
<span class="bg-checkbox__label">${responseData.marketing_consent_text}</span>
</label>`
               : ""
           }
           <button type="submit" id="bixgrow_btn_invite_widget" class="w-100 bixgrow-btn-widget">
           <span class="bixgrow-button-text">  ${
             obj.content.join_page.button || ""
           }</span>
          <span class="bixgrow-spinner"></span>
           </button>
         </div>
         <div id="bixgrow_refer_content_input_share_widget" style='display:none' class="bixgrow-refer-content-input">
         <div
         class="bixgrow-refer-content-title-widget"
       >
       ${obj.content.share_page.headline || ""}
       </div>
       <p
       class="bixgrow-refer-content-description-widget"
     >
     ${obj.content.share_page.description || ""}
     </p>
         <div class="bixgrow-form-group-widget">
           <input
              id="bixgrow-referral-link-text-copy-widget"
             type="text"
             readonly
             class="bixgrow-form-control-widget"
             value="https://mytestdrive.bixgrow.com/register"
           />
         </div>
        <div class='bixgrow-copy-main' style="position:relative;margin-top: 15px;">
         <button type="button" id="bixgrow_btn_copy_widget" class="bixgrow-btn-widget">
         ${obj.content.share_page.button || ""}
         </button>
         <div id="bixgrow-copy-overlay-widget" style="display:none"> ${
           obj.content.share_page.copied || "Copied"
         }</div>
         </div>
         ${
           obj.appearance_v2.show_social_share == 1
             ? `<div class="bg-social-icons">
     
         <a id="bg-facebook" class="bg-social-icon bg-facebook" rel="noopener noreferrer" href=""  target="_blank">
             <img style="width:37px;height:37px;"
                 src="https://d2xrtfsb9f45pw.cloudfront.net/general/facebook-48.png"
                 alt="Facebook"
             />
             </a>
  
     
         <a id="bg-twitter" class="bg-social-icon bg-twitter" rel="noopener noreferrer" href=""  target="_blank">
             <img style="width:30px;height:30px;"
                 src="https://d2xrtfsb9f45pw.cloudfront.net/general/twitter-48.png"
                 alt="Twitter"
             />
             </a>
     
     
       
         <a id="bg-linkedin" class="bg-social-icon bg-linkedin" rel="noopener noreferrer" href="" target="_blank">
             <img style="width:37px;height:37px;"
                 src="https://d2xrtfsb9f45pw.cloudfront.net/general/linkedin-48.png"
                 alt="LinkedIn"
             />
             </a>
         <a id="bg-whatsapp" class="bg-social-icon bg-whatsapp" rel="noopener noreferrer" href="" target="_blank">
             <img style="width:40px;height:40px;"
                 src="https://d2xrtfsb9f45pw.cloudfront.net/general/whatsapp_icon.png"
                 alt="WhatsApp"
             />
    </a>
     </div>`
             : ""
         }
         <div id="bixgrow_how_it_works_widget"
         style="
         padding-top: 4px;
         padding-bottom: 10px; display:none
         "            
       >
      <div class="how-it-works-widget-heading"  >${
        obj.how_it_works.share_page.content.how_it_works || ""
      }</div>
      <div class="how-it-works-steps-widget">
       <div class="how-it-works-step-widget">
       <div class="how-it-works-step-image-widget" > 
       <svg style="margin-right: 8px;width:16px;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 14" fill="none">
      <path d="M0 13.3328V8.66619C0.00176457 7.07543 0.634472 5.55034 1.75931 4.4255C2.88414 3.30067 4.40924 2.66796 6 2.6662H9.22V1.60887C9.22006 1.3452 9.29829 1.08747 9.4448 0.868255C9.59131 0.649042 9.79953 0.47819 10.0431 0.377296C10.2867 0.276403 10.5548 0.249999 10.8134 0.301423C11.072 0.352846 11.3095 0.479788 11.496 0.6662L15.416 4.58553C15.7909 4.96058 16.0016 5.4692 16.0016 5.99953C16.0016 6.52985 15.7909 7.03847 15.416 7.41352L11.496 11.3329C11.3095 11.5193 11.072 11.6462 10.8134 11.6976C10.5548 11.7491 10.2867 11.7226 10.0431 11.6218C9.79953 11.5209 9.59131 11.35 9.4448 11.1308C9.29829 10.9116 9.22006 10.6539 9.22 10.3902V9.33285H5.33333C4.27279 9.33391 3.25599 9.75568 2.50608 10.5056C1.75616 11.2555 1.33439 12.2723 1.33333 13.3328C1.33333 13.5097 1.2631 13.6792 1.13807 13.8043C1.01305 13.9293 0.843478 13.9995 0.666667 13.9995C0.489856 13.9995 0.320286 13.9293 0.195262 13.8043C0.0702379 13.6792 0 13.5097 0 13.3328ZM10.5533 3.33286C10.5533 3.50967 10.4831 3.67924 10.3581 3.80427C10.233 3.92929 10.0635 3.99953 9.88667 3.99953H6C4.76276 4.00094 3.57659 4.49306 2.70173 5.36792C1.82686 6.24278 1.33475 7.42895 1.33333 8.66619V9.80885C1.83305 9.24015 2.44833 8.78459 3.1381 8.47258C3.82788 8.16057 4.57627 7.9993 5.33333 7.99952H9.88667C10.0635 7.99952 10.233 8.06976 10.3581 8.19479C10.4831 8.31981 10.5533 8.48938 10.5533 8.66619V10.3902L14.4727 6.47086C14.5976 6.34584 14.6679 6.1763 14.6679 5.99953C14.6679 5.82275 14.5976 5.65321 14.4727 5.52819L10.5533 1.60887V3.33286Z" fill="#4A4B68"/>
      </svg>    
      ${obj.how_it_works.share_page.content.share_your_link || ""}
          </div>
 
       </div>
    <div class="how-it-works-step-widget" >
    <div class="how-it-works-step-image-widget">     
    <svg style="margin-right: 8px;width:16px;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
   <g clip-path="url(#clip0_687_4309)">
   <path d="M4.66683 16.0004C5.40321 16.0004 6.00016 15.4035 6.00016 14.6671C6.00016 13.9307 5.40321 13.3338 4.66683 13.3338C3.93045 13.3338 3.3335 13.9307 3.3335 14.6671C3.3335 15.4035 3.93045 16.0004 4.66683 16.0004Z" fill="#4A4B68"/>
   <path d="M11.3333 16.0004C12.0697 16.0004 12.6667 15.4035 12.6667 14.6671C12.6667 13.9307 12.0697 13.3338 11.3333 13.3338C10.597 13.3338 10 13.9307 10 14.6671C10 15.4035 10.597 16.0004 11.3333 16.0004Z" fill="#4A4B68"/>
   <path d="M15.7899 0.890259C15.6649 0.765279 15.4954 0.695068 15.3186 0.695068C15.1418 0.695068 14.9723 0.765279 14.8473 0.890259L11.4079 4.33293L10.3739 3.25359C10.3133 3.19047 10.2407 3.13992 10.1605 3.10482C10.0803 3.06972 9.99399 3.05076 9.90646 3.04903C9.81892 3.04729 9.73191 3.06282 9.65037 3.09471C9.56884 3.12661 9.49438 3.17426 9.43126 3.23493C9.36814 3.2956 9.31758 3.36811 9.28248 3.44831C9.24738 3.52852 9.22843 3.61486 9.22669 3.70239C9.22319 3.87918 9.29006 4.05011 9.41259 4.17759L10.4886 5.29693C10.6032 5.42076 10.7418 5.52006 10.8959 5.58881C11.0501 5.65756 11.2165 5.69434 11.3853 5.69693H11.4073C11.5726 5.69747 11.7365 5.66516 11.8892 5.60188C12.042 5.53859 12.1807 5.44558 12.2973 5.32826L15.7899 1.83293C15.9149 1.70791 15.9851 1.53837 15.9851 1.36159C15.9851 1.18482 15.9149 1.01528 15.7899 0.890259V0.890259Z" fill="#4A4B68"/>
   <path d="M14.6 6.01067C14.5138 5.99509 14.4254 5.99666 14.3398 6.01527C14.2542 6.03388 14.1731 6.06918 14.1012 6.11914C14.0292 6.16911 13.9679 6.23276 13.9205 6.30646C13.8732 6.38016 13.8408 6.46246 13.8253 6.54867L13.74 7.02133C13.6568 7.48288 13.4141 7.90053 13.0543 8.20128C12.6944 8.50203 12.2403 8.66675 11.7713 8.66667H3.612L2.98533 3.33333H7.33333C7.51014 3.33333 7.67971 3.2631 7.80474 3.13807C7.92976 3.01305 8 2.84348 8 2.66667C8 2.48986 7.92976 2.32029 7.80474 2.19526C7.67971 2.07024 7.51014 2 7.33333 2H2.828L2.8 1.76533C2.74255 1.27907 2.50871 0.830769 2.14279 0.505403C1.77688 0.180036 1.30432 0.000208558 0.814667 0L0.666667 0C0.489856 0 0.320286 0.0702379 0.195262 0.195262C0.0702379 0.320286 0 0.489856 0 0.666667C0 0.843478 0.0702379 1.01305 0.195262 1.13807C0.320286 1.2631 0.489856 1.33333 0.666667 1.33333H0.814667C0.977955 1.33335 1.13556 1.3933 1.25758 1.50181C1.3796 1.61032 1.45756 1.75983 1.47667 1.922L2.394 9.722C2.48923 10.5332 2.87898 11.2812 3.48927 11.824C4.09956 12.3668 4.8879 12.6667 5.70467 12.6667H12.6667C12.8435 12.6667 13.013 12.5964 13.1381 12.4714C13.2631 12.3464 13.3333 12.1768 13.3333 12C13.3333 11.8232 13.2631 11.6536 13.1381 11.5286C13.013 11.4036 12.8435 11.3333 12.6667 11.3333H5.70467C5.29101 11.3334 4.88751 11.2052 4.54974 10.9664C4.21197 10.7276 3.95655 10.39 3.81867 10H11.7713C12.5529 10 13.3096 9.72549 13.9092 9.22429C14.5089 8.7231 14.9134 8.02713 15.052 7.258L15.1373 6.78467C15.1686 6.61079 15.1296 6.4316 15.0288 6.28648C14.9281 6.14135 14.7738 6.04215 14.6 6.01067Z" fill="#4A4B68"/>
   </g>
   <defs>
   <clipPath id="clip0_687_4309">
   <rect width="16" height="16" fill="white"/>
   </clipPath>
   </defs>
   </svg>${obj.how_it_works.share_page.content.your_friend_buys || ""}
       </div>
 
       </div>
         <div class="how-it-works-step-widget"  >
         <div class="how-it-works-step-image-widget" >     
         <svg style="margin-right: 8px;width:16px;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
        <g clip-path="url(#clip0_687_4301)">
        <path d="M13.3333 4.66667H12.1747C12.5516 4.3344 12.8508 3.92325 13.051 3.4624C13.2513 3.00154 13.3477 2.50227 13.3333 2C13.3333 1.82319 13.2631 1.65362 13.1381 1.5286C13.013 1.40357 12.8435 1.33333 12.6667 1.33333C12.4899 1.33333 12.3203 1.40357 12.1953 1.5286C12.0702 1.65362 12 1.82319 12 2C12 3.748 10.4193 4.35333 9.21733 4.56067C9.66099 3.77404 9.92806 2.90025 10 2C10 1.46957 9.78929 0.960859 9.41421 0.585786C9.03914 0.210714 8.53043 0 8 0C7.46957 0 6.96086 0.210714 6.58579 0.585786C6.21071 0.960859 6 1.46957 6 2C6.07194 2.90025 6.33901 3.77404 6.78267 4.56067C5.58067 4.35333 4 3.748 4 2C4 1.82319 3.92976 1.65362 3.80474 1.5286C3.67971 1.40357 3.51014 1.33333 3.33333 1.33333C3.15652 1.33333 2.98695 1.40357 2.86193 1.5286C2.7369 1.65362 2.66667 1.82319 2.66667 2C2.65234 2.50227 2.74872 3.00154 2.94896 3.4624C3.1492 3.92325 3.4484 4.3344 3.82533 4.66667H2.66667C1.95942 4.66667 1.28115 4.94762 0.781049 5.44772C0.280952 5.94781 0 6.62609 0 7.33333L0 8C0 8.35362 0.140476 8.69276 0.390524 8.94281C0.640573 9.19286 0.979711 9.33333 1.33333 9.33333V12.6667C1.33439 13.5504 1.68592 14.3976 2.31081 15.0225C2.93571 15.6474 3.78294 15.9989 4.66667 16H11.3333C12.2171 15.9989 13.0643 15.6474 13.6892 15.0225C14.3141 14.3976 14.6656 13.5504 14.6667 12.6667V9.33333C15.0203 9.33333 15.3594 9.19286 15.6095 8.94281C15.8595 8.69276 16 8.35362 16 8V7.33333C16 6.62609 15.719 5.94781 15.219 5.44772C14.7189 4.94762 14.0406 4.66667 13.3333 4.66667ZM8 1.33333C8.17681 1.33333 8.34638 1.40357 8.47141 1.5286C8.59643 1.65362 8.66667 1.82319 8.66667 2C8.58619 2.70855 8.35915 3.39261 8 4.00867C7.64085 3.39261 7.41381 2.70855 7.33333 2C7.33333 1.82319 7.40357 1.65362 7.5286 1.5286C7.65362 1.40357 7.82319 1.33333 8 1.33333ZM1.33333 7.33333C1.33333 6.97971 1.47381 6.64057 1.72386 6.39052C1.97391 6.14048 2.31304 6 2.66667 6H7.33333V8H1.33333V7.33333ZM2.66667 12.6667V9.33333H7.33333V14.6667H4.66667C4.13623 14.6667 3.62753 14.456 3.25245 14.0809C2.87738 13.7058 2.66667 13.1971 2.66667 12.6667ZM13.3333 12.6667C13.3333 13.1971 13.1226 13.7058 12.7475 14.0809C12.3725 14.456 11.8638 14.6667 11.3333 14.6667H8.66667V9.33333H13.3333V12.6667ZM8.66667 8V6H13.3333C13.687 6 14.0261 6.14048 14.2761 6.39052C14.5262 6.64057 14.6667 6.97971 14.6667 7.33333V8H8.66667Z" fill="#4A4B68"/>
        </g>
        <defs>
        <clipPath id="clip0_687_4301">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
        </svg>${obj.how_it_works.share_page.content.you_get_rewarded || ""}
            </div>
 
       </div>
      </div>
        </div> 
       </div>
       </div>
     </div>
   </div>
</div> 
  <div
 id="bixgrow-refer-widget-desktop-id"
 class="bixgrow-refer-widget ${
   obj.appearance_v2.launcher.desktop.type == "float"
     ? ""
     : "bixgrow-refer-widget-side"
 }" 
>
 <div
   id="bixgrow-refer-widget-content-id"
   class="
     bixgrow-refer-widget-content
   "

 >
 ${
   obj.appearance_v2.launcher.desktop.display_method.includes("icon")
     ? `<span class="bixgrow-refer-widget-icon__container"> ${
         obj.appearance_v2.launcher.icon_type == "existing"
           ? `<img  class="bixgrow-widget-icon"
 src="${
   "https://d2xrtfsb9f45pw.cloudfront.net/general/referral/" +
   obj.appearance_v2.launcher.icon +
   ".svg"
 }"
 alt="">`
           : `${
               obj.appearance_v2.launcher.icon_type == "upload" &&
               obj.appearance_v2.launcher.icon_upload
                 ? `<img
 class="bixgrow-widget-icon" src="${obj.appearance_v2.launcher.icon_upload}" alt="">`
                 : ""
             }`
       }               
</span>
`
     : ""
 }
${
  obj.appearance_v2.launcher.desktop.display_method.includes("text")
    ? ` <span class="bixgrow-refer-widget-content-text"> ${
        obj.content.join_page.launcher || ""
      }</span>`
    : ""
}
  
 </div>
 <div
   id="bixgrow-refer-widget-close-id"
   class="bixgrow-refer-widget-close"
 >
   <svg
     xmlns="http://www.w3.org/2000/svg"
     height="18"
     viewBox="0 0 329.26933 329"
     width="18" style="width:18px;height:18px;"
   >
     <path
       d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"
       fill="#ffff"
     />
   </svg>
 </div> 
 </div>
 <div
 id="bixgrow-refer-widget-mobile-id"    style="display:none;"
 class="bixgrow-refer-widget ${
   obj.appearance_v2.launcher.mobile.type == "float"
     ? ""
     : "bixgrow-refer-widget-side"
 }" 
>
 <div
   id="bixgrow-refer-widget-mobile-content-id"
   class="
     bixgrow-refer-widget-content
   "

 >
 ${
   obj.appearance_v2.launcher.mobile.display_method.includes("icon")
     ? `<span class="bixgrow-refer-widget-icon__container"> ${
         obj.appearance_v2.launcher.icon_type == "existing"
           ? `<img  class="bixgrow-widget-icon"
 src="${
   "https://d2xrtfsb9f45pw.cloudfront.net/general/referral/" +
   obj.appearance_v2.launcher.icon +
   ".svg"
 }"
 alt="">`
           : `${
               obj.appearance_v2.launcher.icon_type == "upload" &&
               obj.appearance_v2.launcher.icon_upload
                 ? `<img
 class="bixgrow-widget-icon" src="${obj.appearance_v2.launcher.icon_upload}" alt="">`
                 : ""
             }`
       }               
</span>
`
     : ""
 }
${
  obj.appearance_v2.launcher.mobile.display_method.includes("text")
    ? ` <span class="bixgrow-refer-widget-content-text"> ${
        obj.content_v2.mobile_launcher || ""
      }</span>`
    : ""
}
  
 </div>
 <div
   id="bixgrow-refer-widget-close-mobile-id"
   class="bixgrow-refer-widget-close"
 >
   <svg
     xmlns="http://www.w3.org/2000/svg"
     height="18"
     viewBox="0 0 329.26933 329"
     width="18" style="width:18px;height:18px;"
   >
     <path
       d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"
       fill="#ffff"
     />
   </svg>
 </div> 
 
 `;
  referralDiv.insertAdjacentHTML("beforeend", divContent);

  let linkReferralExist = bgGetCookie("bg_referral_advocate_link");
  if (!linkReferralExist) {
    if (customerEmail) {
      document.getElementById("bixgrow-email-advocate-widget").value =
        customerEmail;
      document.getElementById("bixgrow-name-advocate-widget").value =
        customerName;
    }
    let bixgrow_btn_invite_widget = document.getElementById(
      "bixgrow_btn_invite_widget",
    );
    bixgrow_btn_invite_widget.addEventListener("click", function ($event) {
      let noteEmail = document.getElementById(
        "note-bixgrow-email-advocate-widget",
      );
      let emailAdvocate = document.getElementById(
        "bixgrow-email-advocate-widget",
      );
      emailAdvocate.classList.remove("bixgrow-border-red");
      noteEmail.style.display = "none";
      let emailValue = emailAdvocate.value;
      let nameValue = document.getElementById(
        "bixgrow-name-advocate-widget",
      ).value;
      const checkBox = document.getElementById("bgWidgetMyCheckbox");
      const checkBoxValue = checkBox ? (checkBox.checked ? 1 : 0) : 0;
      if (!validateEmail(emailValue)) {
        noteEmail.innerHTML =
          obj.content.join_page.email_error_message ||
          "Please enter your correct email address";
        noteEmail.style.display = "block";
        emailAdvocate.classList.add("bixgrow-border-red");
      } else {
        bixgrow_btn_invite_widget.classList.add("bixgrow-loading");
        let xhttp = new XMLHttpRequest();
        xhttp.open(
          "POST",
          bixgrowReferralUrl + "/api/referral/advocates/register",
          true,
        );
        xhttp.setRequestHeader("Content-Type", "application/json");
        let dataRegister = {
          email: emailValue,
          name: nameValue,
          shop: Shopify.shop,
          campain_id: campainId,
          locale: locale,
          enable_marketing_consent_request: checkBoxValue,
        };
        xhttp.send(JSON.stringify(dataRegister));
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            let objRegister = JSON.parse(this.responseText);
            if (Object.keys(objRegister).length > 0) {
              bgSetCookie(
                "bg_referral_advocate_link",
                objRegister.advocate.link,
                30,
              );
              bgSetCookie("bg_referral_advocate_email", emailValue, 30);
              bgSetCookie("bg_referral_advocate_name", nameValue, 30);
              bgSetCookie("bg_is_same_browser", true, 30);
              document.getElementById(
                "bixgrow-referral-link-text-copy-widget",
              ).value = objRegister.advocate.link;

              let shareLink = encodeURIComponent(objRegister.advocate.link);
              let fbShareBtn = document.getElementById("bg-facebook");
              let twitterShareBtn = document.getElementById("bg-twitter");
              let linkedinShareBtn = document.getElementById("bg-linkedin");
              let pinterestShareBtn = document.getElementById("bg-pinterest");
              let whatsappShareBtn = document.getElementById("bg-whatsapp");

              const socialPostContent = responseData?.share_content?.social_post
                ?.replaceAll("{store_name}", window.bixgrowShopData?.name)
                ?.replaceAll("{referral_link}", objRegister.advocate.link);

              const emailSubject = bgGetCookie("bg_referral_advocate_name")
                ? responseData?.share_content?.email?.subject?.replaceAll(
                    "{customer_name}",
                    bgGetCookie("bg_referral_advocate_name"),
                  )
                : responseData?.share_content?.email?.subject_2;

              const emailBody = responseData?.share_content?.email?.body
                ?.replaceAll("{store_name}", window.bixgrowShopData?.name)
                ?.replaceAll("{referral_link}", objRegister.advocate.link);

              if (fbShareBtn) {
                fbShareBtn.href = `https://www.facebook.com/sharer.php?u=${shareLink}`;
              }
              if (twitterShareBtn) {
                twitterShareBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialPostContent)}`;
              }
              if (linkedinShareBtn) {
                linkedinShareBtn.href = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(socialPostContent)}`;
              }
              if (pinterestShareBtn) {
                pinterestShareBtn.href = `http://pinterest.com/pin/create/link/?url=${shareLink}&description=${encodeURIComponent(socialPostContent)}`;
              }
              if (whatsappShareBtn) {
                whatsappShareBtn.href = `https://wa.me/?text=${encodeURIComponent(socialPostContent)}`;
              }
              let bixgrow_refer_content_input_invite = document.getElementById(
                "bixgrow_refer_content_input_invite_widget",
              );
              bixgrow_refer_content_input_invite.style.display = "none";
              if (obj.how_it_works.share_page.is_enable) {
                let bixgrow_how_it_works_widget = document.getElementById(
                  "bixgrow_how_it_works_widget",
                );
                bixgrow_how_it_works_widget.style.display = "block";
              }
              let bixgrow_refer_content_input_share = document.getElementById(
                "bixgrow_refer_content_input_share_widget",
              );
              bixgrow_refer_content_input_share.style.display = "block";
            } else {
              noteEmail.innerHTML = "An error occurred. Please try again later";
              noteEmail.style.display = "block";
              emailAdvocate.classList.add("bixgrow-border-red");
            }
          }
          if (this.readyState == 4 && this.status == 422) {
            let noteEmail = document.getElementById(
              "note-bixgrow-email-advocate-widget",
            );
            noteEmail.innerHTML = JSON.parse(this.responseText).message;
            noteEmail.style.display = "block";
            document
              .getElementById("bixgrow-email-advocate-widget")
              .classList.add("bixgrow-border-red");
            document
              .getElementById("bixgrow_btn_invite_widget")
              .classList.remove("bixgrow-loading");
          }
        };
        xhttp.onload = function () {};
      }
    });
  } else {
    document.getElementById("bixgrow-referral-link-text-copy-widget").value =
      bgGetCookie("bg_referral_advocate_link");

    let shareLink = bgGetCookie("bg_referral_advocate_link");
    let fbShareBtn = document.getElementById("bg-facebook");
    let twitterShareBtn = document.getElementById("bg-twitter");
    let linkedinShareBtn = document.getElementById("bg-linkedin");
    let pinterestShareBtn = document.getElementById("bg-pinterest");
    let whatsappShareBtn = document.getElementById("bg-whatsapp");

    const socialPostContent = responseData?.share_content?.social_post
      ?.replaceAll("{store_name}", window.bixgrowShopData?.name)
      ?.replaceAll("{referral_link}", shareLink);

    const emailSubject = bgGetCookie("bg_referral_advocate_name")
      ? responseData?.share_content?.email?.subject?.replaceAll(
          "{customer_name}",
          bgGetCookie("bg_referral_advocate_name"),
        )
      : responseData?.share_content?.email?.subject_2;

    const emailBody = responseData?.share_content?.email?.body
      ?.replaceAll("{store_name}", window.bixgrowShopData?.name)
      ?.replaceAll("{referral_link}", shareLink);

    if (fbShareBtn) {
      fbShareBtn.href = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(shareLink)}`;
    }
    if (twitterShareBtn) {
      twitterShareBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialPostContent)}`;
        window.open(twitterUrl, "_blank", "width=600,height=400");
      });
    }
    if (linkedinShareBtn) {
      linkedinShareBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(socialPostContent)}`;
        window.open(linkedinUrl, "_blank", "width=600,height=400");
      });
    }
    if (pinterestShareBtn) {
      pinterestShareBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const pinterestUrl = `http://pinterest.com/pin/create/link/?url=${encodeURIComponent(shareLink)}&description=${encodeURIComponent(socialPostContent)}`;
        window.open(pinterestUrl, "_blank", "width=600,height=400");
      });
    }
    if (whatsappShareBtn) {
      whatsappShareBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(socialPostContent)}`;
        window.open(whatsappUrl, "_blank", "width=600,height=400");
      });
    }

    let bixgrow_refer_content_input_invite = document.getElementById(
      "bixgrow_refer_content_input_invite_widget",
    );
    bixgrow_refer_content_input_invite.style.display = "none";
    if (obj.how_it_works.share_page.is_enable) {
      let bixgrow_how_it_works_widget = document.getElementById(
        "bixgrow_how_it_works_widget",
      );
      bixgrow_how_it_works_widget.style.display = "block";
    }
    let bixgrow_refer_content_input_share = document.getElementById(
      "bixgrow_refer_content_input_share_widget",
    );
    bixgrow_refer_content_input_share.style.display = "block";
  }

  let bixgrowReferWidgetId = document.getElementById(
    "bixgrow-refer-widget-desktop-id",
  );
  let bixgrowReferWidgetMobileId = document.getElementById(
    "bixgrow-refer-widget-mobile-id",
  );
  let bixgrowPopupReferral = document.getElementById("bixgrow-popup-referral");
  bixgrowReferWidgetId.addEventListener("click", function ($event) {
    if (obj.appearance_v2.launcher.desktop.type == "float") {
      bixgrowReferWidgetId.classList.toggle("bixgrow-active");
    }
    if (obj.appearance_v2.launcher.desktop.type == "side") {
      bixgrowReferWidgetId.classList.toggle("bixgrow-side-active");
    }
    referralDiv.classList.toggle("bixgrow-wrapper-active");
    bixgrowPopupReferral.classList.toggle("bixgrow-inactive");
    let bPoweredBy = document.getElementById("b-powered-by-widget-id");
    if (bPoweredBy) {
      bPoweredBy.classList.toggle("bixgrow-inactive");
    }
  });
  bixgrowReferWidgetMobileId.addEventListener("click", function ($event) {
    if (obj.appearance_v2.launcher.mobile.type == "float") {
      bixgrowReferWidgetMobileId.classList.toggle("bixgrow-active");
    }
    if (obj.appearance_v2.launcher.mobile.type == "side") {
      bixgrowReferWidgetId.classList.toggle("bixgrow-side-active");
    }
    bixgrowPopupReferral.classList.toggle("bixgrow-inactive");
    let bPoweredBy = document.getElementById("b-powered-by-widget-id");
    if (bPoweredBy) {
      bPoweredBy.classList.toggle("bixgrow-inactive");
    }
  });

  let bixgrow_close_popup_widget_mobile = document.getElementById(
    "bixgrow-close-popup-widget-mobile",
  );
  bixgrow_close_popup_widget_mobile.addEventListener("click", function () {
    bixgrowPopupReferral.classList.add("bixgrow-inactive");
    bixgrowReferWidgetId.classList.remove("bixgrow-active");
    bixgrowReferWidgetMobileId.classList.remove("bixgrow-active");
    referralDiv.classList.remove("bixgrow-wrapper-active");
    let bPoweredBy = document.getElementById("b-powered-by-widget-id");
    if (bPoweredBy) {
      bPoweredBy.classList.toggle("bixgrow-inactive");
    }
  });

  let bixgrow_close_popup_widget_desktop = document.getElementById(
    "bixgrow-close-popup-widget-desktop",
  );
  if (bixgrow_close_popup_widget_desktop) {
    bixgrow_close_popup_widget_desktop.addEventListener("click", function () {
      if (obj.appearance_v2.launcher.desktop.type == "side") {
        bixgrowReferWidgetId.classList.remove("bixgrow-side-active");
      }
      bixgrowPopupReferral.classList.add("bixgrow-inactive");
      referralDiv.classList.remove("bixgrow-wrapper-active");
      let bPoweredBy = document.getElementById("b-powered-by-widget-id");
      if (bPoweredBy) {
        bPoweredBy.classList.toggle("bixgrow-inactive");
      }
    });
  }

  let bixgrow_btn_copy_widget = document.getElementById(
    "bixgrow_btn_copy_widget",
  );
  bixgrow_btn_copy_widget.addEventListener("click", function ($event) {
    let bixgrowCopyOverlay = document.getElementById(
      "bixgrow-copy-overlay-widget",
    );
    let textBoxCopy = document.getElementById(
      "bixgrow-referral-link-text-copy-widget",
    );
    textBoxCopy.select();
    document.execCommand("copy");
    bixgrowCopyOverlay.style.display = "flex";
    setTimeout(() => {
      bixgrowCopyOverlay.style.display = "none";
    }, 1500);
  });

  referralDiv.style.display = "block";
}

function validateEmail(emailValue) {
  let bixgrow_reg =
    /^([A-Za-z0-9_\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (bixgrow_reg.test(emailValue) == false) {
    return false;
  }
  return true;
}

function bgIsShowWidget(target, targetUrls = []) {
  let pathname = window.location.pathname;
  if (target == "all_page") {
    return true;
  }
  if (target == "specific_page") {
    let isShow = false;
    let languages = LANGUAGE_SLUGS;
    for (let i = 0; i < targetUrls.length; i++) {
      if (
        targetUrls[i] == "home_page" &&
        (pathname == "/" || languages.includes(pathname))
      ) {
        isShow = true;
        break;
      }
      if (
        targetUrls[i] == "product_pages" &&
        pathname &&
        pathname.includes("/products")
      ) {
        isShow = true;
        break;
      }
      if (
        targetUrls[i] == "collection_pages" &&
        pathname &&
        pathname.includes("/collections")
      ) {
        isShow = true;
        break;
      }
      if (
        targetUrls[i] == "cart_pages" &&
        pathname &&
        pathname.includes("/cart")
      ) {
        isShow = true;
        break;
      }
      if (
        targetUrls[i] == "blog_pages" &&
        pathname &&
        pathname.includes("/blogs")
      ) {
        isShow = true;
        break;
      }
    }
    return isShow;
  }
}
function detectDateFormat(dateString) {
  let d = new Date(dateString);
  return d.toLocaleDateString();
}
async function bgReferralUseFetch(
  url,
  method = "GET",
  params = null,
  headers = { "Content-Type": "application/json" },
) {
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
    const errorData = await response.json();
    const error = new Error(
      errorData.message || response.statusText || "Request failed",
    );
    error.status = response.status;
    throw error;
  }
  const responseData = await response.json();
  return responseData;
}
