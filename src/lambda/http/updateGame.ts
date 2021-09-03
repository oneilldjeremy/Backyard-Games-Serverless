import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateGame } from '../../businessLogic/games'
import { UpdateGameRequest } from '../../requests/UpdateGameRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Caller event', event)
    
    const gameId = event.pathParameters.gameId
    const updatedGame: UpdateGameRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    
    const newItem = await updateGame(updatedGame, gameId, userId)

    console.log('Updated item: ', newItem)

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

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
