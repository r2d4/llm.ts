import { MODEL, ModelCompletionRequest, ModelCompletionResponse } from "../shared/types";
import { AbstractBaseModel } from "./base";

type OpenAICompletionRequest = {
    model: string;
    prompt: string | string[];
    suffix?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    n?: number;
    stream?: boolean;
    logprobs?: number;
    echo?: boolean;
    stop?: string | string[];
    presence_penalty?: number;
    frequency_penalty?: number;
    best_of?: number;
    logit_bias?: { [key: string]: number };
    user?: string;
}

type OpenAICompletionResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        text: string;
        index: number;
        logprobs: {
            tokenLogprobs: number[];
            topLogprobs: { [key: string]: number };
            textOffset: number[];
            finishedTokens: string;
        };
        finishReason: string;
    }[];
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    }
}

export class OpenAI extends AbstractBaseModel {
    constructor(apiKey: string, baseUrl = 'https://api.openai.com/v1/completions') {
        super(apiKey, baseUrl);
    }

    name(): string {
        return 'openai';
    }

    models(): string[] {
        return [
            MODEL.OPENAI_TEXT_DAVINCI_003,
            MODEL.OPENAI_TEXT_DAVINCI_002,
            MODEL.OPENAI_TEXT_CURIE_001,
            MODEL.OPENAI_TEXT_BABBAGE_001,
            MODEL.OPENAI_TEXT_ADA_001,
        ];
    }

    convertRequest(request: ModelCompletionRequest): OpenAICompletionRequest {
        return {
            model: request.model,
            prompt: request.prompt,
            max_tokens: request.maxTokens,
            temperature: request.temperature,
            top_p: request.topP,
            n: request.topK,
            presence_penalty: request.presencePenalty,
            frequency_penalty: request.frequencyPenalty,
            stop: request.stopSequences,
        }
    }

    convertResponse(response: OpenAICompletionResponse): ModelCompletionResponse {
        return {
            created: response.created,
            completion: response.choices[0].text,
        }
    }
}