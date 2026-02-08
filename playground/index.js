
// //es module
// import { get_encoding } from "tiktoken";


// //token id --> token
// //904 --> hello
// const encoding =  get_encoding('cl100k_base');
// const token = encoding.encode("Hello world! this is first test");
// console.log(token);


import OpenAI from "openai";

const OPEN_API_KEY = 'sk-proj-yBhVj_-9A0EopT1A06bxRFdqBSUx-YbRVGsJUE8-KkvWx-9v7NqBDlovQgbFs9LEaO2Xu3rYrz1gRdnW62MeDpwYvl7Lqi0udMiUJJYovnBGAA';

const client = new OpenAI({
    apiKey: OPEN_API_KEY
});

const stream = await client.responses.create({
    model: 'gpt-4.1',
    input:'Write a story about a robot',
    temperature:0.7,
    max_output_tokens: 250,
    stream: true
})

// console.log(answer);
for await(const event of stream){
    if(event.delta)
        process.stdout.write(event.delta);
}