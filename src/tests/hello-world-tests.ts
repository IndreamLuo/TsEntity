import { tests, test } from "./framework/decorators";
import { assert } from "./framework/tools";

@tests()
export class HelloWorldTests {
    @test()
    HelloWorld() {
        assert('Hello, world!' == 'Hello, world!');
    }
}