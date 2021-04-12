// import { localStorageStream, waitForLocalStorage } from '@shared/messages';

// waitForLocalStorage().then(() => {
//   console.log('first!');
// });

// localStorageStream.subscribe(([localStorage, sender]) => {
//   console.log('the data passed to sendLocalStorage', localStorage);
//   console.log('the message sender', sender);
// });

// const headers = {
//   Accept: `text/plain, */*; q=0.01`,
//   Pragma: `no-cache`,
//   Connection: `keep-alive`,
//   Host: `hub.predictit.org`,
//   Origin: `https://www.predictit.org`,
//   Referer: `https://www.predictit.org/`,
//   'Accept-Encoding': `gzip, deflate, br`,
//   'Accept-Language': `en-US,en;q=0.9`,
//   'Cache-Control': `no-cache`,
//   'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`,
//   'Sec-Fetch-Dest': `empty`,
//   'Sec-Fetch-Mode': `cors`,
//   'Sec-Fetch-Site': `same-site`,
//   'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36`,
// };

// const params = new URLSearchParams({
//   _: Date.now(),
//   clientProtocol: '1.5',
//   transport: 'webSockets',
//   connectionData: '[{"name":"markethub"}]',
//   tid: Math.floor(Math.random() * (10 - 1 + 1) + 1),
// });

// const setBearerToken = async () => {
//   try {
//     params.set('bearer', token);
//   } catch (error) {}
// };

// const setConnectionToken = async () => {
//   try {
//     const url = `https://hub.predictit.org/signalr/negotiate?${params.toString()}`;
//     const response = await fetch(url, { headers });
//     const data = await response.json();

//     params.set('connectionToken', data.ConnectionToken);
//   } catch (error) {
//     throw new Error(`Refreshing session and trying again`);
//   }
// };

// const getUrl = async () => {
//   try {
//     await setBearerToken();
//     await setConnectionToken();

//     const url = `wss://hub.predictit.org/signalr/connect?${params.toString()}`;

//     return url;
//   } catch (error) {
//     return null;
//   }
// };

// // session {
// //   '990a6d8eb6cbb8ea44b73d21f1e473b43b9c74ea': 'prod',
// //   eng_mt: '{"ver":27,"sessionStartTime":1616546060298,"scrollDepth":19,"sessionDepth":[],"timeOnSite":0,"numOfTimesMetricsSent":1}',
// //   token: '{"value":"_NzBd8z5H2UwnUT_tuBuNZOp8nAuGeQPUVQPticiEAdqIiO7bN57TqzPsCZDRuSganI3pSrvTPFqLZwfmP-2FqT45--HJXvWrUw-5Fip6FVX9NY4qq82qDYBRH1yNvryhyU2R82BElhAIrgQ0dt_jF7whKzBtP8A62TeloOKB22O0l_tAz7-ZOMaOneXHSIydWpITqUq66w163yjCaG48cOXYnk8OVSp9euXFialrQIM1ZEqdEfl6UnNYMDfIMdWwycJGNLVMyKN4Dz82l7_6fsy2VXXAYIHd2n9gT_pZ1vxa6Wvcm4zqumMPNgXnmzYDPnh41bBPl-YBXh_w4BGVpXxfq7EOz4CAPVtfLspVchHdfIYArzw1jQ8MNXl3fL8KsL6xDrg7_Nty9NYeoJ3J0h88pe270LAiLjveMS0lSrmN5T8oPwKDk83ffzYTPnm-VJ9sog05YlLwa7qytwZj2qq23ojp0b2QsHP16dYBjG3x6h9UuJb4BRMK-lw2jrYYFPO9F1TR_CThDTAacuCrLOkRv8xZ_sxbtFcK8vsrynzLYSSK1bdl8h8cTp3M-ZlhiN-Zcysl6_KmTdIvny262xj4TJl3foo_16e-S69xiO5x1eyPMkfrT8PU4OTtX1I","expires_at":null}',
// //   refreshToken: '{"value":"926227a294f1425aa956bdfc64b36e10","expires_at":null}',
// //   '85bdeae0a9e0dad7fdd022d8f90da5d3a241b3d0': 'Mac OS 11.0.0',
// //   '511a26f4be2047a348064e4abe8ce2a9': '2021-03-24T00:34:20.447Z',
// //   tokenExpires: '{"value":"2021-03-24 07:34:22","expires_at":null}',
// //   browseHeaders: '{"value":[{"headerId":2,"name":"Congress","urlFriendlyName":null,"imageUrl":"https://az620379.vo.msecnd.net/images/89f19679-f5eb-4e02-8be7-5ef20e24d6db.svg","sortOrder":4,"seoTitle":"Congress","seoDescription":"PredictIt tests your knowledge of political and financial events by letting you make and trade predictions. We’re a university-sponsored project set up to research the potential value of prediction markets in understanding the future. Our job is to study the wisdom of the crowd, yours is to make your most educated prediction.","headerUrl":"Congress"},{"headerId":3,"name":"Biden Administration","urlFriendlyName":null,"imageUrl":"https://az620379.vo.msecnd.net/images/9dc55d13-2163-44b0-ab76-ecce4b5f2210.svg","sortOrder":1,"seoTitle":"Biden Administration","seoDescription":"PredictIt tests your knowledge of political and financial events by letting you make and trade predictions. We’re a university-sponsored project set up to research the potential value of prediction markets in understanding the future. Our job is to study the wisdom of the crowd, yours is to make your most educated prediction.","headerUrl":"Biden-Administration"},{"headerId":5,"name":"World","urlFriendlyName":null,"imageUrl":"https://az620379.vo.msecnd.net/images/e136f1f6-fc78-4adf-a7c3-a2acc38ecfd9.svg","sortOrder":7,"seoTitle":"World","seoDescription":"PredictIt tests your knowledge of political and financial events by letting you make and trade predictions. We’re a university-sponsored project set up to research the potential value of prediction markets in understanding the future. Our job is to study the wisdom of the crowd, yours is to make your most educated prediction.","headerUrl":"World"},{"headerId":16,"name":"State/Local","urlFriendlyName":null,"imageUrl":"https://az620379.vo.msecnd.net/images/","sortOrder":5,"seoTitle":"State/Local","seoDescription":"PredictIt tests your knowledge of political and financial events by letting you make and trade predictions. We’re a university-sponsored project set up to research the potential value of prediction markets in understanding the future. Our job is to study the wisdom of the crowd, yours is to make your most educated prediction.","headerUrl":"State-Local"},{"headerId":17,"name":"U.S. Elections","urlFriendlyName":null,"imageUrl":"https://az620379.vo.msecnd.net/images/","sortOrder":3,"seoTitle":"U.S. Elections","seoDescription":"2022 Elections","headerUrl":"US-Elections"}],"expires_at":1616549660148}',
// //   '0b006d8eb623b8ea11b73d61f1e483b47b9d7422': 'Mac OS',
// //   d0df7f0a4c2724ff587c1cfb3e315b432e2d1f50: 'false',
// //   '19a826c7f361268a43da3a46a12047f3': '2ba2af70-b2d7-4195-ab36-ebe16f7910d1',
// //   '647a3d19ac2647f361068a43df3a4da1': '2ba2af70-b2d7-4195-ab36-ebe16f7910d1',
// //   '4ba302311571f45d57f1aa75e428b9b78d59a7a2': 'desktop'
// // }
