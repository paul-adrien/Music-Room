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

describe("action with user", function () {

    beforeAll(() => {
        axios.post(base_url + 'user/authenticate', {
            userName: 'test',
            password: 'gkjHK56f-hGK'
        }).then(function (res) {
            userTest.accessToken = res.data.accessToken;
            userTest.id = res.data.id;
        });
    })

    it("modif user", function (done) {
        axios({
            method: 'put',
            url: base_url + 'user/' + userTest.id,
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
            }).catch((err) => { console.log(err) });
    });

    it("get user", function (done) {
        axios.get(base_url + 'user/' + userTest.id, {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            expect(res.data.id).toEqual(userTest.id);
            done();
        });
    });

    it("get users", function (done) {
        axios.get(base_url + 'user?search=test', {
            headers: { 'x-access-token': userTest.accessToken }
        }).then(function (res) {
            //expect(res.data[0].id).toEqual(userTest.id);
            done();
        });
    });
})