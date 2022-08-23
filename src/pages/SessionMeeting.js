import React, { Fragment, useEffect } from "react";
// import ZoomVideo from "@zoom/videosdk";
import axiosInstance from "../api/TelePsyAPI";
// const client = ZoomVideo.createClient();

// client.init(
//   "en-US",
//   `http://localhost:3000/node_modules/@zoom/videosdk/dist/lib/`
// );
// const signatureEndpoint =
//   "http://localhost:3000/authTOKEN/userID/sessionMeeting/";
// const sessionName = "VideoSDK-Test";
// const userName = "VideoSDK";
// const sessionPasscode = "1234ABC";
// let stream;
// const signature =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJhcHBfa2V5IjoiVklERU9fU0RLX0tFWV9IRVJFIiwiaWF0IjoxNjIzNDQyNTYzLCJleHAiOjE2MjM0NDk3NjMsInRwYyI6IlZpZGVvU0RLLVRlc3QiLCJwd2QiOiIxMjM0QUJDIn0=";

//******** change this to point to the correct Api Gateway URL **************************
// const apiUrl =
//   " https://rxau5e0db8.execute-api.us-east-1.amazonaws.com/Prod/meetingInfo";
//******** change this to point to the correct Api Gateway URL **************************

// const DeviceSelection = () => {
//  
// };

// const AudioInputDeviceSelection = () => {
//   
// };

// const VideoInputDeviceSelection = () => {
//   
// };

const SessionMeeting = () => {
  
  // async function getMeetingInfo() {
  //   const response = await fetch(apiUrl);
  //   return await response.json();
  // }
// const signatureEndpoint =
//   "telePsycRxMeeting/meetings/";
const sessionName = "VideoSDK-Test";
const userName = "VideoSDK";
const sessionPasscode = "1234ABC";
let stream;
const signature =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJhcHBfa2V5IjoiVklERU9fU0RLX0tFWV9IRVJFIiwiaWF0IjoxNjIzNDQyNTYzLCJleHAiOjE2MjM0NDk3NjMsInRwYyI6IlZpZGVvU0RLLVRlc3QiLCJwd2QiOiIxMjM0QUJDIn0=";

  useEffect(() => {
    joinMeeting();
  }, []);

  const joinMeeting = async () => {
    // try {
    //   const data = await client.join(sessionName, signature, userName, sessionPasscode);
    //   console.log(data);
    // } catch (error) {
    //   console.error(error);
    // }

    try {
      const data = await client.join(
        sessionName,
        signature,
        userName,
        sessionPasscode
      );
      stream = zmClient.getMediaStream();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const canvas = document.querySelector('#my-video')
const canvasWidth = 640;
const canvasHeight = 360;
const xOffset = 0;
const yOffset = 0;
const videoQuality = 2;   // equivalent to 360p; refer to the API reference for more info

async function startVideo() {
  if (!stream.isCapturingVideo()) {
    try {
      await stream.startVideo();

      const session = client.getSessionInfo();
      stream.renderVideo(canvas, session.userId, canvasWidth, canvasHeight, xOffset, yOffset, videoQuality);
    } catch (error) {
      console.log(error);
    }
  }
}

async function stopVideo() {
  if (stream.isCapturingVideo()) {
    try {
      await stream.stopVideo();

      const session = client.getSessionInfo();
      stream.stopRenderVideo(canvas, session.userId);
    } catch (error) {
      console.log(error);
    }
  }
}
  <>
    <button onclick={startVideo()}>Start Video</button>
    <button onclick={stopVideo()}>Stop Video</button>

    <canvas id="my-video" width="640" height="360"></canvas>
  </>;
 
  return;
};

export default SessionMeeting;
