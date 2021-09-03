import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateGameRequest } from '../../requests/CreateGameRequest'
import { getUserId } from '../utils';
import { createGame } from '../../businessLogic/games'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Caller event', event)

    const newGame: CreateGameRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const newItem = await createGame(newGame, userId)

    console.log('Created new item: ', newItem)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
