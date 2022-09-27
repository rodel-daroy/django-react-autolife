import React, { Component } from "react";
import PropTypes from "prop-types";
import { TweenMax, TimelineMax, CustomEase } from "gsap";
import padStart from "lodash/padStart";
import { COLORS } from "../../utils/style";

const style = ({ dark }) => `.st0{fill-rule:evenodd;clip-rule:evenodd;}
			.st1{fill:${COLORS.BRAND_RED};}
			.st2{fill:${dark ? COLORS.BRAND_WHITE : COLORS.BRAND_BLACK};}
			.st3{font-weight: 300; letter-spacing: 0;}
			.st4{font-size:23.6613px;}
			.st5{font-size:14.4868px;}
			.st6{opacity:0.3;fill-rule:evenodd;clip-rule:evenodd;fill:none;stroke:url(#inner-ring_1_);stroke-miterlimit:10;}
			.st7{opacity:0.4;fill-rule:evenodd;clip-rule:evenodd;fill:none;stroke:url(#path_1_);stroke-width:1.5;stroke-miterlimit:10;}
			.st8{fill-rule:evenodd;clip-rule:evenodd;fill:none;stroke:${
        COLORS.BRAND_RED
      };stroke-width:1.2;stroke-miterlimit:10;}
			.st9{fill-rule:evenodd;clip-rule:evenodd;fill:${COLORS.BRAND_RED};}
			.st10{fill-rule:evenodd;clip-rule:evenodd;fill:none;}`;

const LoaderImage = ({
  dark,
  percentRef,
  ticksRef,
  pathRef,
  fillRef,
  dotRef,
  pathGuideRef,
  ticksGuideRef
}) => {
  return (
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 150 128.985"
      style={{ enableBackground: "new 0 0 150 128.985" }}
    >
      <style type="text/css">{style({ dark })}</style>
      <g id="background">
        <rect
          className="st0"
          width="150"
          height="128.985"
          style={{ display: "none" }}
        />
      </g>
      <g id="loader">
        <g id="labels">
          <path
            className="st1"
            d="M29.023,114.743v1.489h2.013v0.229h-2.013v1.468h2.262v0.229h-2.501v-3.642h2.501v0.228H29.023z"
          />
          <path
            className="st2"
            d="M119.414,114.743v1.583h2.065v0.228h-2.065v1.604h-0.238v-3.642h2.5v0.228H119.414z"
          />
        </g>
        <g id="logo">
          <polygon
            className="st2"
            points="75.81,99.407 75.047,97.881 69.426,108.666 70.981,108.666 		"
          />
          <polygon
            className="st1"
            points="80.574,108.666 76.608,101.035 75.832,102.536 77.412,105.574 74.563,105.574 73.75,107.129
						78.22,107.129 79.019,108.666 		"
          />
        </g>
        <g id="percent_1_">
          <text
            ref={percentRef}
            id="value"
            transform="matrix(1 0 0 1 56.2253 80.1629)"
            className="st2 st3 st4"
          >
            38
          </text>
          <text
            id="percent-symbol"
            transform="matrix(1 0 0 1 84.301 73.3555)"
            className="st2 st3 st5"
          >
            %
          </text>
        </g>
        <g ref={ticksRef} id="ticks_1_">
          <path
            className="st2"
            d="M120.674,109.029l0.121-0.164l1.41,1.036l-0.12,0.164L120.674,109.029z"
          />
          <path
            className="st2"
            d="M121.714,107.573l0.115-0.167l1.442,0.993l-0.115,0.167L121.714,107.573z"
          />
          <path
            className="st2"
            d="M122.699,106.102l0.11-0.171l1.474,0.95l-0.11,0.171L122.699,106.102z"
          />
          <path
            className="st2"
            d="M123.638,104.596l0.104-0.174l1.496,0.897l-0.104,0.174L123.638,104.596z"
          />
          <path
            className="st2"
            d="M124.522,103.072l0.099-0.178l1.527,0.854l-0.099,0.178L124.522,103.072z"
          />
          <path
            className="st2"
            d="M125.377,101.49l0.093-0.181l1.56,0.801l-0.093,0.181L125.377,101.49z"
          />
          <path
            className="st2"
            d="M126.167,99.911l0.087-0.184l1.581,0.759l-0.087,0.183L126.167,99.911z"
          />
          <path
            className="st2"
            d="M126.909,98.303l0.082-0.187l1.602,0.705l-0.082,0.187L126.909,98.303z"
          />
          <path
            className="st2"
            d="M127.603,96.669l0.076-0.188l1.624,0.651l-0.076,0.188L127.603,96.669z"
          />
          <path
            className="st2"
            d="M128.245,95.011l0.07-0.191l1.645,0.599l-0.07,0.19L128.245,95.011z"
          />
          <path
            className="st2"
            d="M128.832,93.342l0.064-0.192l1.656,0.556l-0.064,0.192L128.832,93.342z"
          />
          <path
            className="st2"
            d="M129.367,91.65l0.058-0.194l1.677,0.502l-0.058,0.195L129.367,91.65z"
          />
          <path
            className="st2"
            d="M129.846,89.956l0.052-0.196l1.688,0.449l-0.052,0.196L129.846,89.956z"
          />
          <path
            className="st2"
            d="M130.272,88.239l0.045-0.197l1.709,0.395l-0.045,0.198L130.272,88.239z"
          />
          <path
            className="st2"
            d="M130.646,86.5l0.04-0.199l1.72,0.342l-0.04,0.199L130.646,86.5z"
          />
          <path
            className="st2"
            d="M130.967,84.745L131,84.544l1.73,0.289l-0.033,0.2L130.967,84.745z"
          />
          <path
            className="st2"
            d="M131.23,83.007l0.026-0.201l1.73,0.235l-0.027,0.2L131.23,83.007z"
          />
          <path
            className="st2"
            d="M131.44,81.231l0.021-0.202l1.741,0.171l-0.021,0.202L131.44,81.231z"
          />
          <path
            className="st2"
            d="M131.594,79.46l0.014-0.203l1.741,0.118l-0.014,0.202L131.594,79.46z"
          />
          <path
            className="st2"
            d="M131.693,77.692l0.008-0.203l1.751,0.063l-0.008,0.203L131.693,77.692z"
          />
          <path
            className="st2"
            d="M131.736,75.929l0.001-0.203l1.752,0.011l-0.001,0.202L131.736,75.929z"
          />
          <path
            className="st2"
            d="M131.726,74.15l-0.004-0.203l1.752-0.043l0.004,0.203L131.726,74.15z"
          />
          <path
            className="st2"
            d="M131.661,72.376l-0.011-0.203l1.751-0.096l0.011,0.203L131.661,72.376z"
          />
          <path
            className="st2"
            d="M131.542,70.616l-0.017-0.202l1.741-0.15l0.017,0.203L131.542,70.616z"
          />
          <path
            className="st2"
            d="M131.365,68.827l-0.023-0.202l1.741-0.203l0.023,0.202L131.365,68.827z"
          />
          <path
            className="st2"
            d="M131.136,67.077l-0.03-0.201l1.73-0.256l0.03,0.201L131.136,67.077z"
          />
          <path
            className="st2"
            d="M130.852,65.321l-0.036-0.2l1.72-0.31l0.036,0.2L130.852,65.321z"
          />
          <path
            className="st2"
            d="M130.512,63.585l-0.042-0.199l1.709-0.363l0.042,0.198L130.512,63.585z"
          />
          <path
            className="st2"
            d="M130.116,61.847l-0.048-0.197l1.698-0.417l0.049,0.197L130.116,61.847z"
          />
          <path
            className="st2"
            d="M129.673,60.149l-0.055-0.196l1.688-0.47l0.055,0.196L129.673,60.149z"
          />
          <path
            className="st2"
            d="M129.167,58.433l-0.062-0.194l1.667-0.523l0.061,0.194L129.167,58.433z"
          />
          <path
            className="st2"
            d="M128.615,56.759l-0.067-0.191l1.656-0.577l0.067,0.191L128.615,56.759z"
          />
          <path
            className="st2"
            d="M128.004,55.088l-0.073-0.189l1.634-0.63l0.073,0.189L128.004,55.088z"
          />
          <path
            className="st2"
            d="M127.345,53.443l-0.079-0.187l1.613-0.684l0.079,0.187L127.345,53.443z"
          />
          <path
            className="st2"
            d="M126.634,51.823l-0.084-0.185l1.591-0.726l0.085,0.185L126.634,51.823z"
          />
          <path
            className="st2"
            d="M125.868,50.211l-0.09-0.182l1.57-0.78l0.09,0.182L125.868,50.211z"
          />
          <path
            className="st2"
            d="M125.061,48.646l-0.096-0.179l1.538-0.833l0.096,0.179L125.061,48.646z"
          />
          <path
            className="st2"
            d="M124.198,47.091l-0.102-0.176l1.517-0.876l0.102,0.176L124.198,47.091z"
          />
          <path
            className="st2"
            d="M123.287,45.567l-0.107-0.172l1.485-0.919l0.107,0.173L123.287,45.567z"
          />
          <path
            className="st2"
            d="M122.332,44.073l-0.112-0.169l1.453-0.972l0.112,0.169L122.332,44.073z"
          />
          <path
            className="st2"
            d="M121.331,42.613l-0.118-0.166l1.431-1.015l0.118,0.166L121.331,42.613z"
          />
          <path
            className="st2"
            d="M120.272,41.167l-0.123-0.162l1.389-1.058l0.123,0.162L120.272,41.167z"
          />
          <path
            className="st2"
            d="M119.197,39.792l-0.127-0.158l1.356-1.1l0.127,0.158L119.197,39.792z"
          />
          <path
            className="st2"
            d="M118.053,38.417l-0.132-0.154l1.324-1.143l0.133,0.154L118.053,38.417z"
          />
          <path
            className="st2"
            d="M116.867,37.081l-0.137-0.15l1.292-1.186l0.137,0.149L116.867,37.081z"
          />
          <path
            className="st2"
            d="M115.655,35.796l-0.142-0.146l1.25-1.228l0.142,0.145L115.655,35.796z"
          />
          <path
            className="st2"
            d="M114.404,34.551l-0.146-0.141l1.218-1.26l0.146,0.141L114.404,34.551z"
          />
          <path
            className="st2"
            d="M113.099,33.33l-0.151-0.136l1.175-1.303l0.151,0.136L113.099,33.33z"
          />
          <path
            className="st2"
            d="M111.773,32.165l-0.155-0.131l1.132-1.335l0.155,0.131L111.773,32.165z"
          />
          <path
            className="st2"
            d="M110.411,31.039l-0.159-0.126l1.09-1.367l0.159,0.126L110.411,31.039z"
          />
          <path
            className="st2"
            d="M108.995,29.943l-0.163-0.122l1.046-1.399l0.163,0.121L108.995,29.943z"
          />
          <path
            className="st2"
            d="M107.563,28.905l-0.167-0.116l1.004-1.431l0.167,0.116L107.563,28.905z"
          />
          <path
            className="st2"
            d="M106.097,27.91l-0.17-0.111l0.961-1.463l0.17,0.111L106.097,27.91z"
          />
          <path
            className="st2"
            d="M104.599,26.96l-0.173-0.106l0.908-1.495l0.173,0.105L104.599,26.96z"
          />
          <path
            className="st2"
            d="M103.07,26.054l-0.176-0.101l0.865-1.517l0.176,0.101L103.07,26.054z"
          />
          <path
            className="st2"
            d="M101.53,25.208l-0.18-0.094l0.812-1.549l0.179,0.095L101.53,25.208z"
          />
          <path
            className="st2"
            d="M99.941,24.398l-0.182-0.089l0.769-1.57l0.182,0.089L99.941,24.398z"
          />
          <path
            className="st2"
            d="M98.325,23.637l-0.185-0.083l0.716-1.591l0.185,0.083L98.325,23.637z"
          />
          <path
            className="st2"
            d="M96.701,22.935l-0.188-0.077l0.662-1.613l0.188,0.077L96.701,22.935z"
          />
          <path
            className="st2"
            d="M95.05,22.282l-0.19-0.072l0.62-1.634l0.19,0.071L95.05,22.282z"
          />
          <path
            className="st2"
            d="M93.396,21.686l-0.192-0.065l0.566-1.656l0.192,0.065L93.396,21.686z"
          />
          <path
            className="st2"
            d="M91.72,21.14l-0.194-0.06l0.513-1.677l0.194,0.06L91.72,21.14z"
          />
          <path
            className="st2"
            d="M89.999,20.641l-0.196-0.053l0.459-1.688l0.196,0.053L89.999,20.641z"
          />
          <path
            className="st2"
            d="M88.298,20.204l-0.197-0.047l0.406-1.698l0.197,0.047L88.298,20.204z"
          />
          <path
            className="st2"
            d="M86.556,19.814l-0.199-0.041l0.353-1.72l0.199,0.041L86.556,19.814z"
          />
          <path
            className="st2"
            d="M84.794,19.479l-0.2-0.035l0.299-1.72l0.2,0.035L84.794,19.479z"
          />
          <path
            className="st2"
            d="M83.058,19.205l-0.201-0.028l0.246-1.73l0.201,0.028L83.058,19.205z"
          />
          <path
            className="st2"
            d="M81.305,18.983l-0.202-0.022l0.192-1.741l0.202,0.022L81.305,18.983z"
          />
          <path
            className="st2"
            d="M79.535,18.816L79.333,18.8l0.139-1.741l0.202,0.016L79.535,18.816z"
          />
          <path
            className="st2"
            d="M77.75,18.702l-0.202-0.009l0.085-1.751l0.203,0.009L77.75,18.702z"
          />
          <path
            className="st2"
            d="M75.972,18.645l-0.203-0.003l0.032-1.751l0.203,0.003L75.972,18.645z"
          />
          <path
            className="st2"
            d="M74.232,18.642l-0.203,0.003l-0.032-1.752L74.2,16.89L74.232,18.642z"
          />
          <path
            className="st2"
            d="M72.456,18.694l-0.203,0.009l-0.085-1.752l0.202-0.009L72.456,18.694z"
          />
          <path
            className="st2"
            d="M70.668,18.799l-0.202,0.016l-0.139-1.741l0.202-0.016L70.668,18.799z"
          />
          <path
            className="st2"
            d="M68.898,18.961l-0.201,0.022l-0.192-1.741l0.202-0.022L68.898,18.961z"
          />
          <path
            className="st2"
            d="M67.144,19.175l-0.201,0.028l-0.246-1.73l0.201-0.028L67.144,19.175z"
          />
          <path
            className="st2"
            d="M65.385,19.447l-0.201,0.035l-0.299-1.72l0.2-0.034L65.385,19.447z"
          />
          <path
            className="st2"
            d="M63.642,19.774l-0.198,0.041l-0.353-1.719l0.198-0.041L63.642,19.774z"
          />
          <path
            className="st2"
            d="M61.921,20.151l-0.197,0.047L61.319,18.5l0.197-0.047L61.921,20.151z"
          />
          <path
            className="st2"
            d="M60.199,20.586l-0.196,0.053l-0.459-1.688l0.195-0.053L60.199,20.586z"
          />
          <path
            className="st2"
            d="M58.497,21.074l-0.194,0.059l-0.513-1.677l0.194-0.059L58.497,21.074z"
          />
          <path
            className="st2"
            d="M56.816,21.613l-0.192,0.065l-0.565-1.655l0.192-0.065L56.816,21.613z"
          />
          <path
            className="st2"
            d="M55.139,22.21l-0.19,0.072l-0.619-1.634l0.189-0.071L55.139,22.21z"
          />
          <path
            className="st2"
            d="M53.487,22.857l-0.188,0.077l-0.662-1.613l0.188-0.077L53.487,22.857z"
          />
          <path
            className="st2"
            d="M51.862,23.554l-0.185,0.083l-0.716-1.591l0.185-0.083L51.862,23.554z"
          />
          <path
            className="st2"
            d="M50.241,24.31l-0.183,0.089l-0.769-1.57l0.183-0.089L50.241,24.31z"
          />
          <path
            className="st2"
            d="M48.65,25.113l-0.179,0.094l-0.813-1.548l0.18-0.095L48.65,25.113z"
          />
          <path
            className="st2"
            d="M47.108,25.955l-0.177,0.101l-0.865-1.517l0.177-0.1L47.108,25.955z"
          />
          <path
            className="st2"
            d="M45.575,26.853l-0.174,0.106l-0.907-1.496l0.173-0.105L45.575,26.853z"
          />
          <path
            className="st2"
            d="M44.074,27.798l-0.17,0.111l-0.961-1.463l0.17-0.111L44.074,27.798z"
          />
          <path
            className="st2"
            d="M42.586,28.8l-0.167,0.116l-1.004-1.431l0.167-0.117L42.586,28.8z"
          />
          <path
            className="st2"
            d="M41.167,29.822l-0.162,0.122l-1.047-1.399l0.163-0.121L41.167,29.822z"
          />
          <path
            className="st2"
            d="M39.75,30.914l-0.158,0.126l-1.09-1.367l0.159-0.126L39.75,30.914z"
          />
          <path
            className="st2"
            d="M38.383,32.032l-0.154,0.131l-1.133-1.335l0.155-0.131L38.383,32.032z"
          />
          <path
            className="st2"
            d="M37.052,33.194l-0.15,0.136l-1.176-1.303l0.151-0.136L37.052,33.194z"
          />
          <path
            className="st2"
            d="M35.743,34.41l-0.146,0.141l-1.218-1.26l0.146-0.141L35.743,34.41z"
          />
          <path
            className="st2"
            d="M34.487,35.651l-0.142,0.146l-1.25-1.229l0.143-0.145L34.487,35.651z"
          />
          <path
            className="st2"
            d="M33.272,36.93l-0.138,0.15l-1.292-1.186l0.137-0.15L33.272,36.93z"
          />
          <path
            className="st2"
            d="M32.082,38.264l-0.133,0.154l-1.324-1.143l0.133-0.154L32.082,38.264z"
          />
          <path
            className="st2"
            d="M30.933,39.634l-0.128,0.158l-1.356-1.1l0.128-0.158L30.933,39.634z"
          />
          <path
            className="st2"
            d="M29.852,41.007l-0.123,0.162l-1.388-1.057l0.122-0.162L29.852,41.007z"
          />
          <path
            className="st2"
            d="M28.79,42.447l-0.118,0.166l-1.431-1.015l0.117-0.166L28.79,42.447z"
          />
          <path
            className="st2"
            d="M27.782,43.904l-0.111,0.169l-1.453-0.972l0.112-0.169L27.782,43.904z"
          />
          <path
            className="st2"
            d="M26.821,45.395l-0.106,0.172l-1.485-0.918l0.107-0.172L26.821,45.395z"
          />
          <path
            className="st2"
            d="M25.906,46.916l-0.102,0.176l-1.517-0.876l0.102-0.176L25.906,46.916z"
          />
          <path
            className="st2"
            d="M25.036,48.467l-0.096,0.179l-1.538-0.833l0.096-0.179L25.036,48.467z"
          />
          <path
            className="st2"
            d="M24.224,50.028l-0.09,0.182l-1.57-0.78l0.09-0.182L24.224,50.028z"
          />
          <path
            className="st2"
            d="M23.449,51.64l-0.085,0.185l-1.591-0.727l0.085-0.185L23.449,51.64z"
          />
          <path
            className="st2"
            d="M22.737,53.256l-0.079,0.187l-1.613-0.684l0.079-0.187L22.737,53.256z"
          />
          <path
            className="st2"
            d="M22.069,54.9l-0.073,0.189l-1.634-0.63l0.072-0.189L22.069,54.9z"
          />
          <path
            className="st2"
            d="M21.455,56.568l-0.066,0.191l-1.656-0.577l0.067-0.191L21.455,56.568z"
          />
          <path
            className="st2"
            d="M20.895,58.24l-0.061,0.194l-1.666-0.523l0.061-0.194L20.895,58.24z"
          />
          <path
            className="st2"
            d="M20.383,59.955l-0.055,0.196l-1.688-0.47l0.055-0.196L20.383,59.955z"
          />
          <path
            className="st2"
            d="M19.933,61.65l-0.048,0.197l-1.699-0.417l0.049-0.197L19.933,61.65z"
          />
          <path
            className="st2"
            d="M19.531,63.388l-0.043,0.199l-1.709-0.363l0.043-0.199L19.531,63.388z"
          />
          <path
            className="st2"
            d="M19.186,65.123l-0.036,0.2l-1.72-0.31l0.036-0.2L19.186,65.123z"
          />
          <path
            className="st2"
            d="M18.894,66.876l-0.03,0.201l-1.73-0.256l0.03-0.201L18.894,66.876z"
          />
          <path
            className="st2"
            d="M18.66,68.626l-0.023,0.202l-1.741-0.203l0.023-0.202L18.66,68.626z"
          />
          <path
            className="st2"
            d="M18.477,70.415l-0.018,0.202l-1.741-0.149l0.018-0.202L18.477,70.415z"
          />
          <path
            className="st2"
            d="M18.351,72.173l-0.011,0.203l-1.752-0.096l0.011-0.203L18.351,72.173z"
          />
          <path
            className="st2"
            d="M18.28,73.946l-0.005,0.203l-1.752-0.042l0.005-0.203L18.28,73.946z"
          />
          <path
            className="st2"
            d="M18.263,75.725l0.002,0.203l-1.752,0.011l-0.002-0.203L18.263,75.725z"
          />
          <path
            className="st2"
            d="M18.302,77.489l0.008,0.203l-1.752,0.064l-0.008-0.203L18.302,77.489z"
          />
          <path
            className="st2"
            d="M18.393,79.258l0.014,0.203l-1.74,0.117l-0.015-0.202L18.393,79.258z"
          />
          <path
            className="st2"
            d="M18.542,81.03l0.021,0.202l-1.741,0.171L16.8,81.201L18.542,81.03z"
          />
          <path
            className="st2"
            d="M18.746,82.804l0.027,0.201l-1.73,0.235l-0.027-0.201L18.746,82.804z"
          />
          <path
            className="st2"
            d="M19,84.544l0.032,0.199l-1.729,0.289l-0.033-0.2L19,84.544z"
          />
          <path
            className="st2"
            d="M19.315,86.303l0.04,0.199l-1.72,0.342l-0.04-0.199L19.315,86.303z"
          />
          <path
            className="st2"
            d="M19.683,88.041l0.045,0.197l-1.709,0.396l-0.045-0.198L19.683,88.041z"
          />
          <path
            className="st2"
            d="M20.105,89.76l0.052,0.196l-1.688,0.448l-0.052-0.196L20.105,89.76z"
          />
          <path
            className="st2"
            d="M20.579,91.458l0.058,0.194l-1.677,0.502l-0.059-0.194L20.579,91.458z"
          />
          <path
            className="st2"
            d="M21.107,93.148l0.064,0.192l-1.656,0.556l-0.063-0.192L21.107,93.148z"
          />
          <path
            className="st2"
            d="M21.686,94.819l0.07,0.189l-1.646,0.599l-0.069-0.19L21.686,94.819z"
          />
          <path
            className="st2"
            d="M22.323,96.481l0.076,0.188l-1.623,0.651L20.7,97.133L22.323,96.481z"
          />
          <path
            className="st2"
            d="M23.009,98.117l0.081,0.187l-1.602,0.704l-0.082-0.186L23.009,98.117z"
          />
          <path
            className="st2"
            d="M23.746,99.728l0.087,0.184l-1.58,0.758l-0.088-0.183L23.746,99.728z"
          />
          <path
            className="st2"
            d="M24.532,101.311l0.094,0.181l-1.56,0.801l-0.094-0.18L24.532,101.311z"
          />
          <path
            className="st2"
            d="M25.379,102.896l0.099,0.178l-1.527,0.854l-0.099-0.178L25.379,102.896z"
          />
          <path
            className="st2"
            d="M26.258,104.421l0.104,0.174l-1.496,0.897l-0.104-0.175L26.258,104.421z"
          />
          <path
            className="st2"
            d="M27.194,105.929l0.109,0.171l-1.474,0.95l-0.11-0.17L27.194,105.929z"
          />
          <path
            className="st2"
            d="M28.171,107.406l0.115,0.167l-1.441,0.993l-0.115-0.167L28.171,107.406z"
          />
          <path
            className="st2"
            d="M29.206,108.865l0.12,0.164l-1.409,1.036l-0.121-0.164L29.206,108.865z"
          />
        </g>
        <linearGradient
          id="inner-ring_1_"
          gradientUnits="userSpaceOnUse"
          x1="75"
          y1="99.3316"
          x2="75"
          y2="35.8379"
        >
          <stop
            offset="0"
            style={{
              stopColor: dark ? COLORS.BRAND_WHITE : COLORS.BRAND_BLACK,
              stopOpacity: 0
            }}
          />
          <stop
            offset="1"
            style={{
              stopColor: dark ? COLORS.BRAND_WHITE : COLORS.BRAND_BLACK
            }}
          />
        </linearGradient>
        <path
          id="inner-ring"
          className="st6"
          d="M106.058,99.028c5.006-6.563,7.98-14.761,7.98-23.653c0-21.56-17.478-39.037-39.037-39.037
					S35.963,53.815,35.963,75.375c0,8.874,2.961,17.057,7.95,23.614"
        />
        <g id="gauge_1_">
          <linearGradient
            id="path_1_"
            gradientUnits="userSpaceOnUse"
            x1="75"
            y1="114.0039"
            x2="75"
            y2="11.4539"
          >
            <stop
              offset="0"
              style={{
                stopColor: dark ? COLORS.BRAND_WHITE : COLORS.BRAND_BLACK,
                stopOpacity: 0
              }}
            />
            <stop
              offset="1"
              style={{
                stopColor: dark ? COLORS.BRAND_WHITE : COLORS.BRAND_BLACK
              }}
            />
          </linearGradient>
          <path
            ref={pathRef}
            id="path_2_"
            className="st7"
            d="M24.646,113.527c-8.044-10.6-12.818-23.818-12.818-38.152c0-34.888,28.283-63.171,63.171-63.171
			s63.171,28.283,63.171,63.171c0,14.344-4.781,27.571-12.835,38.175"
          />
          <path
            ref={fillRef}
            id="fill_2_"
            className="st8"
            d="M24.646,113.527c-8.044-10.6-12.818-23.818-12.818-38.152c0-34.888,28.283-63.171,63.171-63.171
			s63.171,28.283,63.171,63.171c0,14.344-4.781,27.571-12.835,38.175"
          />
          <g id="dot_1_">
            <g>
              <circle
                ref={dotRef}
                className="st9"
                cx="125.385"
                cy="113.55"
                r="1.958"
              />
            </g>
          </g>
        </g>
        <g id="guides">
          <g id="path-guide">
            <circle
              ref={pathGuideRef}
              className="st10"
              cx="75"
              cy="75.375"
              r="63.171"
            />
          </g>
          <g id="ticks-guide">
            <circle
              ref={ticksGuideRef}
              className="st10"
              cx="75"
              cy="75.375"
              r="56.738"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

class Loader extends Component {
  componentDidMount() {
    this.percent = 0;

    const { play } = this.props;
    if (play) this.animate();
  }

  componentWillUnmount() {
    if (this._timeline) {
      this._timeline.kill();
      delete this._timeline;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.play && !prevProps.play) this.animate();
  }

  animate() {
    if (this._timeline) {
      this._timeline.kill();
      delete this._timeline;
    }

    const { duration, delay, onFinished } = this.props;
    const timeline = new TimelineMax();

    timeline.fromTo(this, 5, { percent: 0 }, { percent: 1 });

    timeline.timeScale(timeline.totalDuration() / duration);
    timeline.delay(delay);
    if (onFinished) timeline.eventCallback("onComplete", onFinished);

    this._timeline = timeline;
  }

  set percent(value) {
    const { dark } = this.props;

    this._pathLength = this._pathLength || this._path.getTotalLength();
    this._tickElements =
      this._tickElements || [...this._ticks.childNodes].reverse();

    const offset = value * this._pathLength;
    const position = this._path.getPointAtLength(offset);

    TweenMax.set(this._dot, { attr: { cx: position.x, cy: position.y } });

    const percentText = padStart(Math.min(99, Math.round(value * 100)), 2, "0");
    this._percentText.textContent = percentText;

    const activeTickCount = Math.round(value * this._tickElements.length);
    for (let i = 0; i < this._tickElements.length; ++i) {
      if (i < activeTickCount) {
        TweenMax.set(this._tickElements[i], { fill: COLORS.BRAND_RED });
      } else
        TweenMax.set(this._tickElements[i], {
          fill: dark ? COLORS.BRAND_WHITE : COLORS.BRAND_BLACK
        });
    }

    this._fill.style.strokeDasharray = `${this._pathLength}px`;
    this._fill.style.strokeDashoffset = `${(1 - value) * this._pathLength}px`;

    this._percent = value;
  }

  get percent() {
    return isNaN(this._percent) ? 0 : this._percent;
  }

  render() {
    const { dark } = this.props;

    return (
      <div className={`loader ${dark ? "dark" : ""}`}>
        <LoaderImage
          dark={dark}
          pathGuideRef={ref => (this._pathGuide = ref)}
          ticksGuideRef={ref => (this._ticksGuide = ref)}
          dotRef={ref => (this._dot = ref)}
          percentRef={ref => (this._percentText = ref)}
          pathRef={ref => (this._path = ref)}
          fillRef={ref => (this._fill = ref)}
          ticksRef={ref => (this._ticks = ref)}
        />
      </div>
    );
  }
}

Loader.propTypes = {
  duration: PropTypes.number,
  play: PropTypes.bool,
  delay: PropTypes.number,
  onFinished: PropTypes.func,
  dark: PropTypes.bool
};

Loader.defaultProps = {
  duration: 5,
  delay: 0.5
};

export default Loader;
