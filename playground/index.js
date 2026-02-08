
//es module
import { get_encoding } from "tiktoken";


//token id --> token
//904 --> hello
const encoding =  get_encoding('cl100k_base');
const token = encoding.encode("Hello world! this is first test");
console.log(token);
