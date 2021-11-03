const axios = require("axios");
const { room } = require("../models");
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

roomData = {
    id: "",
    musicId: ""
};

describe("action with rooms in socket", function () {

    var socket;

    beforeAll(() => {
        socket = io(base_url, {
            auth: {
                token: 'socketToken'
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

    afterAll(() => {
        if (socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            console.log('no connection to break...');
        }
        axios({
            method: 'delete',
            url: base_url + '/room/' + roomData.id + '/user/' + userTest.id,
            headers: { 'x-access-token': userTest.accessToken },
        }).then(function (res) {
        }).catch((err) => { console.log(err) });
    });

    it('create room', (done) => {
        socket.emit('room create', { name: 'test2', userId: userTest.id });

        socket.once('room create', (data) => {
            let roomIndex = data.map((r) => { return r.name }).indexOf('test2');
            roomData.id = data[roomIndex]._id;
            expect(data).not.toEqual(null);
            done();
        });
    });

    it('add music in room', (done) => {
        socket.emit('room add music', { roomId: roomData.id, userId: userTest.id, trackId: 'test' });

        socket.once(`room update ${roomData.id}`, (data) => {
            roomData.musicId = data.musics[0]._id;
            expect(data.musics.length).not.toEqual(0);
            done();
        });
    });

    it('vote for a music in a room', (done) => {
        socket.emit('room vote music', { roomId: roomData.id, userId: userTest.id, trackId: 'test' });

        socket.once(`room update ${roomData.id}`, (data) => {
            expect(data.musics[0].nb_vote).toEqual(1);
            done();
        });
    });

    it('vote for a music in a room', (done) => {
        socket.emit('room vote music', { roomId: roomData.id, userId: userTest.id, trackId: 'test' });

        socket.once(`room update ${roomData.id}`, (data) => {
            expect(data.musics[0].nb_vote).toEqual(1);
            done();
        });
    });

    it('invite an other user to a room', (done) => {
        socket.emit('room invite', { roomId: roomData.id, userId: userTest.id, friendId: userInviteTest.id });

        socket.once(`user update ${userInviteTest.id}`, (data) => {
            done();
        });
    });

    it('accepte invite to a room', (done) => {
        axios({
            method: 'post',
            url: base_url + '/room/' + roomData.id + '/acceptInvite',
            headers: { 'x-access-token': userTest.accessToken },
            data: {
                userId: userInviteTest.id
            }
        }).then(function (res) {
            console.log(res.data)
            done();
        }).catch((err) => { console.log(err) });
    });

    it('vote for a music in a room', (done) => {
        socket.emit('room vote music', { roomId: roomData.id, userId: userInviteTest.id, trackId: 'test' });

        socket.once(`room update ${roomData.id}`, (data) => {
            expect(data.musics[0].nb_vote).toEqual(2);
            done();
        });
    });

    // it('leave a room', (done) => {
    //     axios({
    //         method: 'delete',
    //         url: base_url + '/room/' + roomData.id + '/quitRoom?userId=' + userInviteTest.id,
    //         headers: { 'x-access-token': userTest.accessToken }
    //     }).then(function (res) {
    //         console.log(res.data)
    //         done();
    //     }).catch((err) => { console.log(err) });
    // });

    it('delete music in room', (done) => {
        socket.emit('room del music', { roomId: roomData.id, trackId: 'test' });

        socket.once(`room update ${roomData.id}`, (data) => {
            expect(data.musics.length).toEqual(0);
            done();
        });
    });

})