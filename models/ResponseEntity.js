class ResponseEntity {
    code = 0;
    message = null;
    data = null;

    static builder() {
        return new ResponseEntityBuilder();
    }
}

class ResponseEntityBuilder {
    object;
    constructor() {
        this.object = new ResponseEntity();
    }
    code(code) {
        this.object.code = code;
        return this;
    }
    message(message) {
        this.object.message = message;
        return this;
    }
    data(data) {
        this.object.data = data;
        return this;
    }
    build() {
        return this.object;
    }
}
module.exports = {
    ResponseEntity: ResponseEntity,
    ResponseEntityBuilder: ResponseEntityBuilder,
};
