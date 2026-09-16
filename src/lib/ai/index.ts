import { AIProvider } from './providerAdapter';
import { DemoProvider } from './demoProvider';
import { RealLLMProvider } from './realProvider';

export function getAIProvider(): AIProvider {
  const isDemoExplicit = process.env.DEMO_MODE === 'true';
  const hasKey = Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY);

  if (isDemoExplicit || !hasKey) {
    return new DemoProvider();
  }

  return new RealLLMProvider();
}
