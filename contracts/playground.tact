import "@stdlib/deploy";

message Player {
    id: Int;
    name: String;
}

contract Playground with Deployable {
    // Empty init() function is present by default in all Tact contracts
    // since v1.3.0, so the following may be omitted:
    //
    // init() {}

    receive("player") {
        emit("Time to play.".asComment());
    }

    receive(msg: Player) {
        let output: StringBuilder = beginString()
            .concat("Player ID: ")
            .concat(msg.id.toString())
            .concat(" Name: ")
            .concat(msg.name);
        emit(output.toString().asComment());
    }

    get fun get_sample(): String {
        return "sample";
    }
}
