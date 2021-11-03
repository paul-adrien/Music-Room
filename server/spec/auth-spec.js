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

describe("simple creation of an user", function () {

    beforeAll(() => {
        axios.post(base_url + 'user/register', {
            userName: "test",
            email: "test@gmail.com",
            lastName: "test",
            firstName: "test",
            password: "gkjHK56f-hGK"
        }).then(function (res) {
        }).catch((err) => {
        });
    })

    it("returns Hello World", function (done) {
        axios.get(base_url, {})
            .then(function (res) {
                expect(res.data).toBe("Hello World");
                done();
            });
    });

    it("login", function (done) {
        axios.post(base_url + 'user/authenticate', {
            userName: 'test',
            password: 'gkjHK56f-hGK'
        }).then(function (res) {
            userTest.accessToken = res.data.accessToken;
            userTest.id = res.data.id;
            expect(res.data.status).toBe(true);
            done();
        });
    });

    it("check token", function (done) {
        axios.get(base_url + 'token', {
            headers: { 'x-access-token': userTest.accessToken }
        })
            .then(function (res) {
                expect(res.data.status).toBe(true);
                done();
            });
    });
})