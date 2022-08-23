// import React from 'react';

// import { ZoomMtg } from '@zoomus/websdk';
// ZoomMtg.setZoomJSLib('https://source.zoom.us/2.3.0/lib', '/av');
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();
// ZoomMtg.i18n.load('en-US');
// ZoomMtg.i18n.reload('en-US');

// function Meeting(props) {
//   let userConfig: any = Object.fromEntries(new URLSearchParams(window.location.search));
//   let defaultConfig = {
//     apiKey: 'MFvn5W9rS1itKOeFmeaUPQ', // process.env.ZOOM_API_KEY,
//     apiSecret: 'TFGPeR5aUbMrDthi44oohiZ6m2WuXKGGqSBA', // process.env.ZOOM_API_SECRET,
//     leaveUrl: 'https://portal.telepsycrx.com/', // TODO: should ultimately be a wrap-up page
//   };

//   let meetConfig = { ...userConfig, ...defaultConfig };
//   console.log(meetConfig);

//   let signature = ZoomMtg.generateSignature({
//     meetingNumber: meetConfig.meetingId,
//     apiKey: meetConfig.apiKey,
//     apiSecret: meetConfig.apiSecret,
//     role: 1,
//     // role: parseInt(meetConfig.role),
//     success: (success) => {
//       console.log('finished generating signature');
//       console.log(success);
//     }
//   });

//   function startMeeting() {
//     document.getElementById('zmmtg-root').style.display = 'block';

//     ZoomMtg.init({
//       leaveUrl: meetConfig.leaveUrl,
//       isSupportBreakout: false,
//       isSupportPolling: false,
//       disableInvite: true,
//       success: (success) => {
//         console.log(success);
//         document.getElementById('content_container').style.marginLeft = '0';
//         ZoomMtg.join({
//           signature: signature,
//           meetingNumber: meetConfig.meetingId,
//           userName: meetConfig.username,
//           apiKey: meetConfig.apiKey,
//           passWord: "",
//           success: (success) => {
//             console.log(success);
//             if (meetConfig.role === "1") {
//               console.log('is the host');
//               ZoomMtg.showInviteFunction({
//                 show: false
//               });
//               ZoomMtg.showRecordFunction({
//                 show: true
//               });
//               ZoomMtg.showMeetingHeader({
//                 show: false
//               });
//               ZoomMtg.record({
//                 record: true
//               });
//             }
//             console.log('Success');
//           },
//           error: (error) => {
//             console.log(error)
//           }
//         });
//       },
//       error: (error) => {
//         console.log(error)
//       }
//     });
//   }

//   return (
//     <div>
//       <h1>Ready?</h1>
//       <button onClick={startMeeting}>Join</button>
//     </div>
//   );
// }

// export default Meeting;
