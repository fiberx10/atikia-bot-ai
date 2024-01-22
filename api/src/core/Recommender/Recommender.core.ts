import AzureOpenAIService from '../../services/azure/openai.service'
import CarbonService from '../../services/carbon.service'
import LoggerService from '../../services/logger.service'
import config from './config'
import { RecommendProperty, foundMatchedProperty } from './functions'
import CorePrompts from '../prompt'
import { JustifyPreferences } from './helpers'
import { Message } from '../../types/Message.type'

class RecommenderCore {
  private _openai: typeof AzureOpenAIService
  private _carbon: CarbonService
  private _logger: LoggerService
  constructor() {
    this._openai = AzureOpenAIService
    this._carbon = new CarbonService()
    this._logger = new LoggerService({ scope: 'Recommender' })
  }

  public async *chat(messages: Message[]): AsyncGenerator<Message> {
    try {
      // chat completion
      const completion = await this._openai.chat.completions.create(
        {
          messages: [
            ...messages.map((message: Message) => {
              return {
                role: message.role,
                content: message.content ?? 'something went wrong',
              }
            }),
            {
              role: 'system',
              content: CorePrompts.completer(),
            },
          ],
          model: config.model,
          temperature: config.temperature,
          functions: [RecommendProperty],
          stream: true,
        },
        {
          query: {
            'api-version': process.env.AZURE_OPENAI_API_VERSION,
          },
        },
      )

      // vars
      let recommendFunctionCalled = false
      let funcName = ''
      let funcArgs = ''

      // loop through the completion
      for await (const chunk of completion) {
        const choice = chunk.choices[0]
        // if (chunk.choices[0]?.delta.content) console.log(chunk.choices[0]?.delta.content)
        if (choice?.delta?.function_call?.name === 'recommendProperty') {
          recommendFunctionCalled = true
          funcName = choice.delta.function_call?.name
        }

        if (
          choice?.finish_reason === 'function_call' &&
          recommendFunctionCalled
        ) {
          recommendFunctionCalled = false
        }

        if (
          recommendFunctionCalled &&
          choice?.delta?.function_call?.arguments
        ) {
          // get called function name and args
          funcArgs = funcArgs + choice.delta.function_call?.arguments
          // console.log('funcName :', funcName)
          // console.log('funcArgs :', funcArgs)
        }

        if (chunk?.choices[0]?.delta?.content)
          yield {
            role: 'assistant',
            content: chunk.choices[0]?.delta.content ?? '',
            date: new Date(),
            properties: [],
            isError: false,
          }
      }

      if (funcName !== '' && funcArgs !== '') {
        // TODO: get data from embeddings and synthetize it
        const argsParsed = JSON.parse(funcArgs);
        const argsJustified = JustifyPreferences(argsParsed);
        const data = await this._carbon.getEmbedding(argsJustified);
        const properties = data.documents[0];

        const recommender = await this._openai.chat.completions.create(
          {
            messages: [
              ...messages.map((message: Message) => {
                return {
                  role: message.role,
                  content: message.content ?? 'something went wrong',
                }
              }),
              {
                role: 'system',
                content: CorePrompts.recommender({
                  args: argsParsed,
                  properties,
                }),
              },
            ],
            model: config.model,
            temperature: config.temperature,
            functions: [foundMatchedProperty],
          },
          {
            query: {
              'api-version': '2023-07-01-preview',
            },
          }
        );

        if (recommender.choices[0].finish_reason === 'function_call' && recommender.choices[0].message.function_call?.name === 'foundMatchedProperty') {
          const recommendedProperty = JSON.parse(recommender.choices[0].message.function_call?.arguments ?? '{}') as { message: string, id: string } | Record<string, never>;
          this._logger.log('recommender :' + JSON.stringify(recommendedProperty));
          return {
            role: 'assistant',
            content: recommendedProperty.message,
            date: new Date(),
            properties: [recommendedProperty.id],
            isError: false,
          }
        }
      }


      return {
        role: 'assistant',
        content: '<|endofmessage|>',
        date: new Date(),
        properties: [],
        isError: false,
      }

    } catch (error) {
      this._logger.error(error as string)
      yield {
        role: 'assistant',
        content: '<|error|>',
        date: new Date(),
        properties: [],
        isError: true,
      }
    }
  }
}

export default RecommenderCore
