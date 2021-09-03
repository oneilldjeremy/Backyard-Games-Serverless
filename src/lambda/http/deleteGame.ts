import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteGame } from '../../businessLogic/games'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Caller event', event)
    
    const gameId = event.pathParameters.gameId
    const userId = getUserId(event)
    const results =  await deleteGame(gameId, userId)

    console.log('Deleted item: ', gameId)

    if (results) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: gameId
      }
    }
   
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
