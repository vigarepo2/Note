const AppConfig = {
    domain: "opplex.org:8080",
    username: "aalokgh",
    password: "pass54321",
    getStreamUrl: function(id) {
        return `http://${this.domain}/${this.username}/${this.password}/${id}`;
    }
};
