const axios = require("axios");

var base_url = "http://localhost:8080/"

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
}

roomData = {
    id: ""
}

describe("action with rooms", function () {

    beforeAll(() => {
        axios.post(base_url + 'user/authenticate', {
            userName: 'test',
            password: 'gkjHK56f-hGK'
        }).then(function (res) {
            userTest.accessToken = res.data.accessToken;
            userTest.id = res.data.id;
        });
    });

    afterAll(() => {
        axios({
            method: 'delete',
            url: base_url + 'room/' + roomData.id + '/user/' + userTest.id,
            headers: { 'x-access-token': userTest.accessToken },
        }).then(function (res) {
        }).catch((err) => { });
    });

    it("get rooms", function (done) {
        axios.get(base_url + 'room', {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res.data.status).toEqual(true);
            done();
        });
    });

    it("create room", function (done) {
        axios({
            method: 'post',
            url: base_url + 'room',
            headers: { 'x-access-token': userTest.accessToken },
            data: {
                name: "test",
                userId: userTest.id
            }
        }).then(function (res) {
            roomData.id = res.data.room._id;
            expect(res.data.status).toBe(true);
            done();
        }).catch((err) => {  });
    });

    it("check room name", function (done) {
        axios.get(base_url + 'room/test/check-name', {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res.data.room).not.toEqual(null);
            done();
        });
    });

    it("get the new room", function (done) {
        axios.get(base_url + 'room/' + roomData.id, {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res.data.status).toEqual(true);
            done();
        });
    });
})