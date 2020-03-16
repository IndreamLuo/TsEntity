import { tests, test } from "./framework/decorators";
import { Assert } from "./framework/tools";

@tests()
export class HelloWorldTests {
    @test()
    HelloWorld() {
        Assert.AreEqual('Hello, world!', 'Hello, world!');
    }
}