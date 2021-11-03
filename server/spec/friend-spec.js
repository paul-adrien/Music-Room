// var axios = require("axios");

// var base_url = "http://localhost:8080/"

// userTest = {
//     status: true,
//     id: "",
//     userName: "test",
//     email: "test@gmail.com",
//     lastName: "test",
//     firstName: "test",
//     accessToken: "",
//     lang: "en"
// }

// userTest2 = {
//     status: true,
//     id: "",
//     userName: "test2",
//     email: "test2@gmail.com",
//     lastName: "test2",
//     firstName: "test2",
//     accessToken: "",
//     lang: "en"
// }

// userTest3 = {
//     status: true,
//     id: "",
//     userName: "test3",
//     email: "test3@gmail.com",
//     lastName: "test3",
//     firstName: "test3",
//     accessToken: "",
//     lang: "en"
// }

// describe("get all playlist", function () {
//     it("returns Hello World", function (done) {
//         axios.get(base_url, {})
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe("Hello World");
//                 done();
//             });
//     });

//     it("login", function (done) {
//         axios.post(base_url + 'user/authenticate', {
//             data: {
//                 userName: 'test',
//                 password: 'gkjHK56f-hGK'
//             }
//         }).then(function (res) {
//             console.log(res);
//             expect(res).toBe(Object);
//             done();
//         });
//     });

//     it("create account test 2", function (done) {
//         axios.post(base_url + 'user/register', {
//             data: {
//                 userName: "test2",
//                 email: "test2@gmail.com",
//                 lastName: "test2",
//                 firstName: "test2",
//                 password: "gkjHK56f-hGK"
//             }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });

//     it("create account test 3", function (done) {
//         axios.post(base_url + 'user/register', {
//             data: {
//                 userName: "test3",
//                 email: "test3@gmail.com",
//                 lastName: "test3",
//                 firstName: "test3",
//                 password: "gkjHK56f-hGK"
//             }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });

//     it("get friend list", function (done) {
//         axios.get(base_url + 'user/' + userTest.id + '/friends', {
//             headers: { 'x-access-token': userTest.accessToken }
//         }).then(function (res) {
//             console.log(res);
//             expect(res).toBe(Object);
//             done();
//         });
//     });

//     it("userTest1 Invite friend userTest2", function (done) {
//         axios.post(base_url + 'user/' + userTest.id + '/friends/' + userTest2.id, {
//             headers: { 'x-access-token': userTest.accessToken }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });

//     it("userTest2 Invite friend userTest3", function (done) {
//         axios.post(base_url + 'user/' + userTest2.id + '/friends/' + userTest3.id, {
//             headers: { 'x-access-token': userTest.accessToken }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });

//     it("userTest1 Invite friend userTest3", function (done) {
//         axios.post(base_url + 'user/' + userTest.id + '/friends/' + userTest3.id, {
//             headers: { 'x-access-token': userTest.accessToken }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });

//     it("userTest3 Invite friend userTest1", function (done) {
//         axios.post(base_url + 'user/' + userTest3.id + '/friends/' + userTest.id, {
//             headers: { 'x-access-token': userTest.accessToken }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });

//     it("userTest3 accepte invite", function (done) {
//         axios.post(base_url + 'user/' + userTest.id + '/friends/' + userTest3.id + '/acceptInvitation', {
//             headers: { 'x-access-token': userTest.accessToken }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });

//     it("userTest2 accepte invite", function (done) {
//         axios.post(base_url + 'user/' + userTest2.id + '/friends/' + userTest1.id + '/acceptInvitation', {
//             headers: { 'x-access-token': userTest.accessToken }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });

//     it("userTest3 refuse invite of userTest2", function (done) {
//         axios.delete(base_url + 'user/' + userTest3.id + '/friends/' + userTest2.id + '/refuseInvitation', {
//             headers: { 'x-access-token': userTest.accessToken }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });

//     it("userTest3 delete friend userTest1", function (done) {
//         axios.delete(base_url + 'user/' + userTest3.id + '/friends/' + userTest1.id, {
//             headers: { 'x-access-token': userTest.accessToken }
//         })
//             .then(function (res) {
//                 console.log(res);
//                 expect(res).toBe(Object);
//                 done();
//             });
//     });
// })