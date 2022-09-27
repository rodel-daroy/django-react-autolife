import React, { Component } from "react";
import { connect } from "react-redux";
// import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import FeatureSpot from "../../../../../../components/common/FeatureSpot";

class SpotB extends Component {
  componentDidMount() {
    const htmlDiv = document.getElementById("bSpotVideo");
    const { previewData } = this.props;
    if (previewData && previewData.data && previewData.data.assets) {
      console.log(previewData.data.assets, "testingg spot-b");
      previewData.data.assets.map(data => {
        if (
          data.template_location === "spot_B" &&
          (data.asset_type === "Ad-VeuHub" || data.asset_type === "Ad-Internal")
        ) {
          if (data.Source.includes("script")) {
            const sourceTag = document.createElement(
              data.Source.split("<")[1].split(" ")[0]
            );
            sourceTag.src = data.Source.split("<")[1]
              .split(" ")[1]
              .split("src=")[1]
              .replace(/['"]+/g, "");
            htmlDiv.appendChild(sourceTag);
          } else {
            htmlDiv.innerHTML = data.Source;
          }
        }
      });
    }
  }

  renderSpotBImages() {
    var spot_B_image = null;
    var spot_B_video = "";
    var spot_B_careousl = [];
    var image_attribution = "";
    const { previewData } = this.props;
    if (previewData && previewData.data && previewData.data.assets) {
      previewData &&
        previewData.data &&
        previewData.data.assets.map(data => {
          if (data.template_location == "spot_B") {
            image_attribution = data.content_attribution;
          }
          if (
            data
              ? data.asset_type == "image" && data.template_location == "spot_B"
              : ""
          ) {
            spot_B_image = {
              url: data.asset_content[0].url,
              alt: data.asset_content[0].alternate_text
            };
          } else if (
            data
              ? data.asset_type == "carousel" &&
                data.template_location == "spot_B"
              : ""
          ) {
            data.asset_content.map(newData => {
              if (data.order != undefined)
                spot_B_careousl[data.order] = newData;
              else {
                spot_B_careousl = data.asset_content;
                return;
              }
            });
            spot_B_careousl = data.asset_content;
          } else if (
            data
              ? data.asset_type == "video" && data.template_location == "spot_B"
              : ""
          ) {
            spot_B_video = data.asset_content[0].url;
          }
        });
    }
    if (spot_B_image) {
      return (
        <FeatureSpot spot="B" images={spot_B_image} kind="image" scrim={null}>
          <div className="ques_mark">
            <i className="fa fa-question-circle q_mark" />
            <span className="img_attribution"> {image_attribution}</span>
          </div>
        </FeatureSpot>
      );
    } else if (spot_B_careousl != "") {
      return (
        <FeatureSpot
          spot="B"
          kind="image"
          images={spot_B_careousl.map(img => ({
            url: img.url,
            alt: img.alternate_text
          }))}
          scrim={null}
        />
      );
    } else if (spot_B_video != "") {
      return (
        <FeatureSpot
          spot="B"
          video={spot_B_video}
          videoType="video/webm"
          kind="video"
          scrim={null}
        />
      );
    }
  }

  render() {
    return (
      <div id="bSpotVideo" className="content-container">
        {this.renderSpotBImages()}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    previewData: state.editorial.previewData
  };
}

export default connect(mapStateToProps)(SpotB);
