interface CompletionProvider {
    name(): string;
    models(): string[];

    completion(request: ModelCompletionRequest): Promise<ModelCompletionResponse>;
}

enum ModelProvider {
    OPENAI = 'openai',
    COHERE = 'cohere',
}

export const MODEL = {
    // OpenAI
    OPENAI_TEXT_DAVINCI_003: 'text-davinci-003',
    OPENAI_TEXT_DAVINCI_002: 'text-davinci-002',
    OPENAI_TEXT_CURIE_001: 'text-curie-001',
    OPENAI_TEXT_BABBAGE_001: 'text-babbage-001',
    OPENAI_TEXT_ADA_001: 'text-ada-001',

    // Cohere
    COHERE_COMMAND_NIGHTLY: 'command-nightly',
    COHERE_COMMAND: 'command',
    COHERE_COMMAND_LIGHT: 'command-light',
    COHERE_COMMAND_LIGHT_NIGHTLY: 'command-light-nightly',

    // Huggingface
    HF_GPT2: 'gpt2',
    HF_BLOOM_560M: 'bloom-560m',
    HF_BLOOM_1B: 'bloom-1b',
    HF_BLOOM_3B: 'bloom-3b',
    HF_BLOOM_7B: 'bloom-7b1',
    HF_LLAMA_7B: 'llama-7b',
    HF_LLAMA_13B: 'llama-13b',
    HF_LLAMA_30B: 'llama-30b',
    HF_LLAMA_65B: 'llama-65b',
    HF_GPTJ_6B: 'gptj-6b',
    HF_GPTJ_2_7B: 'gptj-2.7b',
    HF_GPT_NEO_125M: 'gpt-neo-125m',
    HF_GPT_NEO_1_3B: 'gpt-neo-1.3b',
    HF_GPT_NEOX_20B: 'gpt-neox-20b',
    HF_CEREBRAS_GPT_111M: 'cerebras-gpt-111m',
    HF_CEREBRAS_GPT_1_3B: 'cerebras-gpt-1.3b',
    HF_CEREBRAS_GPT_2_7B: 'cerebras-gpt-2.7b',
    HF_SANTACODER_1B: 'santacoder',
    HF_CODEGEN_350M: 'codegen-350m',
    HF_CODEGEN_2B: 'codegen-2b',
    HF_STABLE_LM_3B: 'stablelm-tuned-3b',
    HF_STABLE_LM_7B: 'stablelm-tuned-7b',
    HF_PYTHIA_12B: 'pythia-12b',
    HF_PYTHIA_160M: 'pythia-160m',
    HF_PYTHIA_70M: 'pythia-70m',
}

type CompletionRequest = MultiCompletionRequest & CompletionOptions;
type ModelCompletionRequest = SingleCompletionRequest & CompletionOptions;

type MultiCompletionRequest = {
    prompt: string | string[];
    model: string | string[];
}

type SingleCompletionRequest = {
    prompt: string;
    model: string;
}

type CompletionOptions = {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    stopSequences?: string[];
    frequencyPenalty?: number;
    presencePenalty?: number;
}

type CompletionChoice = {
    text: string;
    index: number;
    model: string;
    promptIndex: number;
    created: number;
    error?: string;
}

type CompletionResponse = {
    created: number;
    choices: CompletionChoice[];
}

type ModelCompletionResponse = {
    created: number;
    completion: string;
}

export {
    CompletionProvider,
    CompletionChoice,
    CompletionRequest,
    CompletionResponse,
    ModelCompletionRequest,
    ModelCompletionResponse,
    ModelProvider,
};
