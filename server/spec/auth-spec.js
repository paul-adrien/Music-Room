var axios = require("axios");

var base_url = "http://localhost:8080/"

userTest = {
    status: true,
    id: "",
    userName: "test",
    email: "test@gmail.com",
    lastName: "test",
    firstName: "test",
    accessToken: "",
    lang: "en"
}

describe("get all playlist", function () {
    it("returns Hello World", function (done) {
        axios.get(base_url, {})
            .then(function (res) {
                console.log(res);
                expect(res).toBe("Hello World");
                done();
            });
    });

    it("create account test", function (done) {
        axios.post(base_url + 'user/register', {
            data: {
                userName: "test",
                email: "test@gmail.com",
                lastName: "test",
                firstName: "test",
                password: "gkjHK56f-hGK"
            }
        })
            .then(function (res) {
                console.log(res);
                expect(res).toBe(Object);
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

    it("get user", function (done) {
        axios.get(base_url + 'user/' + userTest.id, {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            console.log(res);
            expect(res).toBe(Object);
            done();
        });
    });

    it("modif user", function (done) {
        axios.put(base_url + 'user/' + userTest.id, {
            headers: { 'x-access-token': userTest.accessToken },
            data: {
                userName: "test",
                email: "test@gmail.com",
                lastName: "test",
                firstName: "test",
                password: "gkjHK56f-hGK"
            }
        })
            .then(function (res) {
                console.log(res);
                expect(res).toBe(Object);
                done();
            });
    });

    it("check token", function (done) {
        axios.get(base_url + 'token', {
            headers: { 'x-access-token': userTest.accessToken }
        })
            .then(function (res) {
                console.log(res);
                expect(res).toBe(Object);
                done();
            });
    });
})