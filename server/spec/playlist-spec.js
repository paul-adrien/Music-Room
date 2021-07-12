var axios = require("axios");

var base_url = "http://localhost:8080/";

var userTest = {
    status: true,
    id: "",
    userName: "test",
    email: "test@gmail.com",
    lastName: "test",
    firstName: "test",
    accessToken: "",
    lang: "en",
    friends: [{ id: '' }]
};

var playlistIds = [];

describe("get all playlist", function () {
    it("returns Hello World", function (done) {
        axios.get(base_url).then(function (res) {
            expect(res).toBe("Hello World");
            done();
        });
    });

    it("login", function (done) {
        axios.post(base_url + 'user/authenticate', {
            data: {
                userName: 'test',
                password: 'gkjHK56f-hGK'
            }
        }).then(function (res) {
            console.log(res);
            expect(res).toBe(Object);
            done();
        });
    });

    it("get all playlist", function (done) {
        axios.get(base_url + userTest.id + '/playlist', {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("create playlist 1", function (done) {
        axios.post(base_url + userTest.id + '/playlist', {
            headers: { 'x-access-token': userTest.accessToken },
            data: {
                name: '',
                type: '',
                right: '',
                style: ''
            }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("create playlist 2", function (done) {
        axios.post(base_url + userTest.id + '/playlist', {
            headers: { 'x-access-token': userTest.accessToken },
            data: {
                name: '',
                type: '',
                right: '',
                style: ''
            }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("create playlist 3", function (done) {
        axios.post(base_url + userTest.id + '/playlist', {
            headers: { 'x-access-token': userTest.accessToken },
            data: {
                name: '',
                type: '',
                right: '',
                style: ''
            }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("create playlist 4", function (done) {
        axios.post(base_url + userTest.id + '/playlist', {
            headers: { 'x-access-token': userTest.accessToken },
            data: {
                name: '',
                type: '',
                right: '',
                style: ''
            }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("edit playlist", function (done) {
        axios.put(base_url + userTest.id + '/playlist/' + playlistIds[0], {
            headers: { 'x-access-token': userTest.accessToken },
            data: {
                name: '',
                type: '',
                right: '',
                style: ''
            }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("delete playlist", function (done) {
        axios.delete(base_url + userTest.id + '/playlist/' + playlistIds[4], {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("invite to playlist", function (done) {
        axios.post(base_url + userTest.id + '/playlist/' + playlistIds[0] + '/invite/' + userTest.friends[0].id, {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("refuse invite to playlist", function (done) {
        axios.delete(base_url + userTest.id + '/playlist/' + playlistIds[0] + '/refuseInvite', {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("invite to playlist", function (done) {
        axios.post(base_url + userTest.id + '/playlist/' + playlistIds[0] + '/invite/' + userTest.friends[0].id, {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("accept invite to playlist", function (done) {
        axios.post(base_url + userTest.id + '/playlist/' + playlistIds[0] + '/acceptInvite', {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("add music to playlist", function (done) {
        axios.post(base_url + userTest.id + '/playlist/' + playlistIds[0] + '/music/001', {
            headers: { 'x-access-token': userTest.accessToken },
            data: { duration: '10' }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });

    it("del music to playlist", function (done) {
        axios.delete(base_url + userTest.id + '/playlist/' + playlistIds[0] + '/music/001', {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res).toBe();
            done();
        });
    });
})