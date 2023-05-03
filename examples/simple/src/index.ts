import { LLM, MODEL } from 'llm.ts';

(async function () {
    await new LLM({
        apiKeys: {
            openAI: process.env.OPENAI_API_KEY ?? '',
            cohere: process.env.COHERE_API_KEY ?? '',
            huggingface: process.env.HF_API_TOKEN ?? '',
        }
    }).completion({
        prompt: [
            'Repeat the following sentence: "I am a robot."',
            'Repeat the following sentence: "I am a human."',
        ],
        model: [
            // use the model name
            'text-ada-001',

            // or specify a specific provider
            'cohere/command-nightly',

            // or use enums to avoid typos
            MODEL.HF_GPT2,
        ],
    }).then(resp => {
        console.log(JSON.stringify(resp, null, 2));
    })
})()
