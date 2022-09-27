import last from "lodash/last";

export const getASpotProps = (assets = []) => {
  if (assets.length > 0) {
    const asset = last(
      assets.filter(
        asset => asset.template_location === "spot_A"
      )
    );
    if (asset != undefined) {
      let assetArray = new Array(asset.asset_content.length);
      asset.asset_content.forEach((data, i) => {
        if (data.order != undefined) assetArray[data.order] = data;
        else {
          assetArray = asset.asset_content;
        }
      });
      switch (asset.asset_type) {
        case "image": {
          return {
            kind: "image",
            images: {
              url: asset.asset_content[0].url,
              alt: asset.asset_content[0].alternate_text
            }
          };
        }
        case "carousel": {
          return {
            kind: "image",
            images: assetArray.map(({ url, alternate_text }) => ({
              url,
              alt: alternate_text
            }))
          };
        }
        case "video": {
          return {
            kind: "video",
            video: asset.asset_content[0].url,
            videoType: "video/webm",
            muteVideo: true
          };
        }

        default:
          return null;
      }
    }
  }

  return null;
};

export const getBSpotProps = (assets = []) => {
  for(const data of assets) {
    if (data.template_location === "spot_B") {
      if (data.asset_type === "image") {
        return {
          kind: "image",
          images: {
            url: data.asset_content[0].url,
            alt: data.asset_content[0].alternate_text
          }
        };
      }
      else {
        if (data.asset_type === "carousel") {
          let images = [];
          for(const newData of data.asset_content) {
            if (data.order != undefined)
              images[data.order] = newData;
            else {
              images = data.asset_content;
              break;
            }
          }

          return {
            images,
            kind: "image"
          };
        }
        else {
          if(data.asset_type === "video") {
            return {
              kind: "video",
              video: data.asset_content[0].url
            };
          }
        }
      }
    }
  }

  return null;
};