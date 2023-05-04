import { MODEL, ModelCompletionRequest, ModelCompletionResponse } from "../shared/types";

type HuggingfaceCompletionRequest = {
    inputs: string;
    parameters?: {
        top_k?: number;
        top_p?: number;
        temperature?: number;
        repetition_penalty?: number;
        max_new_tokens?: number;
        max_time?: number;
        return_full_text?: boolean;
        num_return_sequences?: number;
        do_sample?: boolean;
        options?: {
            use_cache?: boolean;
            wait_for_model?: boolean;
        }
    }
}

type HuggingfaceCompletionResponse = {
    generated_text: string;
}

const modelMap = {
    [MODEL.HF_GPT2]: 'gpt2',
    [MODEL.HF_BLOOM_560M]: 'bigscience/bloom-560m',
    [MODEL.HF_BLOOM_1B]: 'bigscience/bloom-1b',
    [MODEL.HF_BLOOM_3B]: 'bigscience/bloom-3b',
    [MODEL.HF_BLOOM_7B]: 'bigscience/bloom-7b1',
    [MODEL.HF_LLAMA_7B]: 'decapoda-research/llama-7b-hf',
    [MODEL.HF_LLAMA_13B]: 'decapoda-research/llama-13b-hf',
    [MODEL.HF_LLAMA_30B]: 'decapoda-research/llama-30b-hf',
    [MODEL.HF_LLAMA_65B]: 'decapoda-research/llama-65b-hf',
    [MODEL.HF_GPTJ_6B]: 'EleutherAI/gpt-j-6B',
    [MODEL.HF_GPTJ_2_7B]: 'EleutherAI/gpt-j-2.7B',
    [MODEL.HF_GPT_NEO_125M]: 'EleutherAI/gpt-neo-125M',
    [MODEL.HF_GPT_NEO_1_3B]: 'EleutherAI/gpt-neo-1.3B',
    [MODEL.HF_GPT_NEOX_20B]: 'EleutherAI/gpt-neox-20B',
    [MODEL.HF_CEREBRAS_GPT_111M]: 'cerebras/Cerebras-GPT-111M',
    [MODEL.HF_CEREBRAS_GPT_1_3B]: 'cerebras/Cerebras-GPT-1.3B',
    [MODEL.HF_CEREBRAS_GPT_2_7B]: 'cerebras/Cerebras-GPT-2.7B',
    [MODEL.HF_SANTACODER_1B]: 'bigcode/santacoder',
    [MODEL.HF_CODEGEN_350M]: 'Salesforce/codegen-350M-multi',
    [MODEL.HF_CODEGEN_2B]: 'Salesforce/codegen-2b-multi',
    [MODEL.HF_STABLE_LM_3B]: 'stabilityai/stablelm-tuned-alpha-3b',
    [MODEL.HF_STABLE_LM_7B]: 'stabilityai/stablelm-tuned-alpha-7b',
    [MODEL.HF_PYTHIA_12B]: 'EleutherAI/pythia-12b',
    [MODEL.HF_PYTHIA_160M]: 'EleutherAI/pythia-160m',
    [MODEL.HF_PYTHIA_70M]: 'EleutherAI/pythia-70m',
    [MODEL.HF_DISTILGPT2]: 'distilgpt2'

}

export class Huggingface {
    apiKey: string;
    baseUrl: string;

    constructor(apiKey: string, baseUrl = 'https://api-inference.huggingface.co/models') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    name(): string {
        return 'huggingface';
    }

    models(): string[] {
        return [
            MODEL.HF_GPT2,
            MODEL.HF_BLOOM_560M,
            MODEL.HF_BLOOM_1B,
            MODEL.HF_BLOOM_3B,
            MODEL.HF_BLOOM_7B,
            MODEL.HF_LLAMA_7B,
            MODEL.HF_LLAMA_13B,
            MODEL.HF_LLAMA_30B,
            MODEL.HF_LLAMA_65B,
            MODEL.HF_GPTJ_6B,
            MODEL.HF_GPTJ_2_7B,
            MODEL.HF_GPT_NEO_125M,
            MODEL.HF_GPT_NEO_1_3B,
            MODEL.HF_GPT_NEOX_20B,
            MODEL.HF_CEREBRAS_GPT_111M,
            MODEL.HF_CEREBRAS_GPT_1_3B,
            MODEL.HF_CEREBRAS_GPT_2_7B,
            MODEL.HF_SANTACODER_1B,
            MODEL.HF_CODEGEN_350M,
            MODEL.HF_CODEGEN_2B,
            MODEL.HF_STABLE_LM_3B,
            MODEL.HF_STABLE_LM_7B,
            MODEL.HF_PYTHIA_12B,
            MODEL.HF_PYTHIA_160M,
            MODEL.HF_PYTHIA_70M,
            MODEL.HF_DISTILGPT2
        ];
    }

    public async completion(request: ModelCompletionRequest): Promise<ModelCompletionResponse> {
        const data = {
            inputs: request.prompt,
            parameters: {
                top_p: request.topP,
                top_k: request.topK,
                temperature: request.temperature,
                maxNewTokens: request.maxTokens,
                repetition_penalty: request.presencePenalty,
                return_full_text: false,
            }
        } as HuggingfaceCompletionRequest;
        const modelEndpoint = modelMap[request.model.toString()];
        try {
            return fetch(`${this.baseUrl}/${modelEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.apiKey,
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }
                    return response.json();
                })
                .then((responseData) => {
                    return {
                        created: Date.now(),
                        completion: responseData[0].generated_text,
                    } as ModelCompletionResponse;
                });
        } catch (error) {
            console.error(error);
        }

    }
}