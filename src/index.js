import { PanoViewer } from "@egjs/view360";
import Swal from "sweetalert2";

const images = [
  {
    url:
      "https://doc-14-4k-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/6cvq8t4av2ud5gvtuvbmc1jnf08tsnfo/1695571650000/11121322236929815512/*/1qSl8p6PVB9SwvKs1S0ym3Pcm1_c0Pxo5?uuid=bcdb95d8-baf1-47fd-a86c-add20b196c7e",
    smallUrl:
      "https://doc-0g-4k-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/ncm3r3sfsgt99q63ldlhbtb6ikeni4cn/1695571950000/11121322236929815512/*/1SAryXbGXDiqMazXIiPzLBMv0ftjmFx24?uuid=e6e15498-84fc-47ec-aca7-ab2652c941d9"
  }
];

let maxImageNumber = 1;
let currentImageNumber = 1;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const getImage = () => {
  const rootPath = `../static/${isMobile ? "imagesSmall" : "images"}`;

  return `${rootPath}/360-${currentImageNumber}.jpg`;
};

const getNextImage = () => {
  if (currentImageNumber !== maxImageNumber) {
    currentImageNumber++;
  }

  return getImage();
};

const getPrevImage = () => {
  if (currentImageNumber !== 1) {
    currentImageNumber--;
  }

  return getImage();
};

new window.WebXRPolyfill({
  allowCardboardOnDesktop: true,
  cardboardConfig: {
    // CARDBOARD_UI_DISABLED: true
  }
});

const iOSVersion = (() => {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    var v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
})();

const panoEl = document.querySelector("#pano");
const panoViewer = new PanoViewer(panoEl, {
  image:
    "https://doc-14-4k-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/6cvq8t4av2ud5gvtuvbmc1jnf08tsnfo/1695571650000/11121322236929815512/*/1qSl8p6PVB9SwvKs1S0ym3Pcm1_c0Pxo5?uuid=bcdb95d8-baf1-47fd-a86c-add20b196c7e",
  projectionType: "equirectangular"
}).on("error", (e) => {
  Swal.fire("ERROR!", e.message, "error");
});

// For iOS 13+
panoViewer.enableSensor().catch(() => {
  Swal.fire({
    title: "Permission needed! (iOS13+)",
    icon: "question",
    text:
      "Please give me a permission to access Device motion & Orientation :3",
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: "Allow",
    cancelButtonText: "Deny"
  }).then((result) => {
    if (result.value) {
      // Granted
      panoViewer
        .enableSensor()
        .then(() => {
          Swal.fire("Thank you!", "", "success");
        })
        .catch(() => {
          Swal.fire(
            "You've denied a permission!",
            "You have to completely close out your browser and reconnect this page to enable sensor again!",
            "error"
          );
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // User dismissed
      Swal.fire("AWW :(", "", "error");
    }
  });
});

// For iOS 12.2 ~ 13
if (iOSVersion && iOSVersion[0] === 12 && iOSVersion[1] >= 2) {
  PanoViewer.isGyroSensorAvailable((available) => {
    if (!available) {
      Swal.fire({
        title: "Please enable the Motion Sensor! (iOS12.2~13)",
        icon: "warning",
        text: "This website requires a permission for your device sensor.",
        html: `
        <div style="text-align: left;">
          <div>
            1. Open <img src="https://developer.apple.com/design/human-interface-guidelines/ios/images/icons/app_icons/Settings_2x.png" width="20" /> <b>Settings</b>
          </div>
          <div>
            2. Select <img src="https://km.support.apple.com/resources/sites/APPLE/content/live/IMAGES/0/IM26/en_US/safari-240.png" width="20" /> <b>Safari</b>
          </div>
          <div>
            3. Enable <b>Motion & Orientation Access</b>
          </div>
          <div>4. Reload the page</div>
        </div>
        `
      });
    }
  });
}

const nextButton = document.querySelector("#next");
nextButton.addEventListener("click", () => panoViewer.setImage(getNextImage()));

const prevButton = document.querySelector("#prev");
prevButton.addEventListener("click", () => panoViewer.setImage(getPrevImage()));

const input = document.querySelector("#input");
input.addEventListener("change", function () {
  var imageUrl = URL.createObjectURL(this.files[0]);
  console.log(imageUrl);
  panoViewer.setImage(imageUrl);
});
