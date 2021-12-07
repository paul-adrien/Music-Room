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

playlistData = {
    id: "",
    musicId: ""
};

describe("action with playlist in socket", function () {

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

    afterAll(() => {
        if (socket.connected) {
            
            socket.disconnect();
        } else {
            
        }
        axios({
            method: 'delete',
            url: base_url + '/playlist/' + playlistData.id + '/' + userTest.id,
            headers: { 'x-access-token': userTest.accessToken },
        }).then(function (res) {
        }).catch((err) => {});
    });

    it('create playlist', (done) => {
        socket.emit('playlist create', { userId: userTest.id, name: 'testPlaylist' });

        socket.once('playlist create', (data) => {
            let playlistIndex = data.map((r) => { return r.name }).indexOf('testPlaylist');
            playlistData.id = data[playlistIndex]._id;
            expect(data).not.toEqual(null);
            done();
        });
    });

    it('add music in playlist', (done) => {
        socket.emit('playlist add music', { playlistId: playlistData.id, userId: userTest.id, trackId: 'test' });

        socket.once(`playlist update ${playlistData.id}`, (data) => {
            roomData.musicId = data.musics[0]._id;
            expect(data.musics.length).not.toEqual(0);
            done();
        });
    });

    it('delete a music in a playlist', (done) => {
        socket.emit('playlist del music', { playlistId: playlistData.id, trackId: 'test' });

        socket.once(`playlist update ${playlistData.id}`, (data) => {
            expect(data.musics.length).toEqual(0);
            done();
        });
    });

    it('add music in playlist public with other user', (done) => {
        socket.emit('playlist add music', { playlistId: playlistData.id, userId: userInviteTest.id, trackId: 'test2' });

        socket.once(`playlist update ${playlistData.id}`, (data) => {
            roomData.musicId = data.musics[0]._id;
            expect(data.musics.length).not.toEqual(0);
            done();
        });
    });

    it('change type of a playlist to private', (done) => {
        socket.emit('playlist change type', { playlistId: playlistData.id, userId: userTest.id, type: 'private' });

        socket.once(`playlist update ${playlistData.id}`, (data) => {
            expect(data.type).toEqual('private');
            done();
        });
    });

    it('add music in playlist private with other user', (done) => {
        socket.emit('playlist add music', { playlistId: playlistData.id, userId: userInviteTest.id, trackId: 'test3' });

        socket.once(`playlist update ${playlistData.id}`, (data) => {
            done();
        });
    });

    it('invite an other user to a playlist', (done) => {
        socket.emit('playlist invite', { playlistId: playlistData.id, userId: userTest.id, friendId: userInviteTest.id });

        socket.once(`user update ${userInviteTest.id}`, (data) => {
            done();
        });
    });

    it('accepte invite to a playlist', (done) => {
        socket.emit('playlist accept invite', { playlistId: playlistData.id, userId: userInviteTest.id });

        socket.once(`playlist update ${playlistData.id}`, (data) => {
            done();
        });
    });

})