import { tests, test } from "./_framework/decorators";
import { Assert } from "./_framework/assert";

@tests()
export class HelloWorldTests {
    @test()
    HelloWorld() {
        Assert.AreEqual('Hello, world!', 'Hello, world!');
    }
}