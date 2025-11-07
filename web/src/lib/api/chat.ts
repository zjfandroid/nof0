export {};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const API_BASE_URL = 'https://api.siliconflow.cn/v1';
const API_TOKEN = 'sk-qbgprwdaepibubgbpqybdjxaiwlnxxfjiunvzbwsfrrwdwrk';
// const FREE_MODULE = 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B'
const FREE_MODULE = 'Qwen/Qwen2.5-7B-Instruct'

export async function chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
  const url = `${API_BASE_URL}/chat/completions`;
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chat completion error:', error);
    throw error;
  }
}

export async function transContent(msg: string) {
  try {
    const request: ChatCompletionRequest = {
      model: FREE_MODULE,
      messages: [
        {"role": "system", "content": '你是专业金融交易员和翻译官，能专业翻译用户输入的内容为中文，并直接输出浅显易懂的翻译内容'},
        {
          role: 'user',
          content: msg
        }
      ],
    };
    
    const response = await chatCompletion(request);
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Example error:', error);
  }
}