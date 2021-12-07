const axios = require("axios");
var io = require('socket.io-client');

var base_url = "http://localhost:8080"

userTest = {
    status: true,
    id: "",
    userName: "test",
    email: "test@gmail.com",
    lastName: "test",
    firstName: "test",
    accessToken: "",
    lang: "en",
    password: "gkjHK56f-hGK"
};

userInviteTest = {
    status: true,
    id: "",
    userName: "InviteTest",
    email: "InviteTest@gmail.com",
    lastName: "InviteTest",
    firstName: "InviteTest",
    accessToken: "",
    lang: "en",
    password: "gkjHK56f-hGK"
};

delegationToken = "";

describe("action with user", function () {

    var socket;

    beforeAll(() => {
        socket = io(base_url, {
            query: {
                token: 'secret-token'
            }
        });
        axios.post(base_url + '/user/authenticate', {
            userName: 'test',
            password: 'gkjHK56f-hGK'
        }).then(function (res) {
            userTest.accessToken = res.data.accessToken;
            userTest.id = res.data.id;
        });
        axios.post(base_url + '/user/authenticate', {
            userName: 'InviteTest',
            password: 'gkjHK56f-hGK'
        }).then(function (res) {
            if (res.data.status === true) {
                userInviteTest.accessToken = res.data.accessToken;
                userInviteTest.id = res.data.id;
            } else {
                axios.post(base_url + '/user/register', {
                    userName: "InviteTest",
                    email: "InviteTest@gmail.com",
                    lastName: "InviteTest",
                    firstName: "InviteTest",
                    password: "gkjHK56f-hGK"
                }).then(function (res) {
                    userInviteTest.accessToken = res.data.accessToken;
                    userInviteTest.id = res.data.id;
                }).catch((err) => {
                });
            }
        });
    });

    it("modif user", function (done) {
        axios({
            method: 'put',
            url: base_url + '/user/' + userTest.id,
            headers: { 'x-access-token': userTest.accessToken },
            data: {
                user: {
                    userName: "test",
                    email: "test2@gmail.com",
                    lastName: "test",
                    firstName: "test"
                }
            }
        })
            .then(function (res) {
                userTest.email = res.data.email;
                expect(res.data.email).toEqual("test2@gmail.com");
                done();
            }).catch((err) => { });
    });

    it("get user", function (done) {
        axios.get(base_url + '/user/' + userTest.id, {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res.data.id).toEqual(userTest.id);
            done();
        });
    });

    it("get users", function (done) {
        axios.get(base_url + '/user?search=test', {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            //expect(res.data[0].id).toEqual(userTest.id);
            done();
        });
    });

    it('friend invite', (done) => {
        socket.emit('friend invite', { userId: userTest.id, friendId: userInviteTest.id });

        socket.once(`user update ${userInviteTest.id}`, (data) => {
            expect(data).not.toEqual(null);
            done();
        });
    });

    it('friend accepte invite', (done) => {
        socket.emit('friend accept invite', { userId: userInviteTest.id, friendId: userTest.id });

        socket.once(`user update ${userInviteTest.id}`, (data) => {
            expect(data).not.toEqual(null);
            done();
        });
    });

    it('friend delete', (done) => {
        socket.emit('friend delete', { userId: userInviteTest.id, friendId: userTest.id });

        socket.once(`user update ${userInviteTest.id}`, (data) => {
            expect(data).not.toEqual(null);
            done();
        });
    });

    it('give delegation permission', (done) => {
        socket.emit('give delegation permission', { userId: userTest.id, friendId: userInviteTest.id, userName: userInviteTest.userName });

        socket.once(`give delegation permission to ${userInviteTest.id}`, (data) => {
            delegationToken = data.token
            expect(data).not.toEqual(null);
            done();
        });
    });

    it('action delegation', (done) => {
        socket.emit('action delegation', { userId: userInviteTest.id, friendId: userTest.id, action: 'test', token: delegationToken });

        socket.once(`action delegation ${userTest.id}`, (data) => {
            expect(data).not.toEqual(null);
            done();
        });
    });
})