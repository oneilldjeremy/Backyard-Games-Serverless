import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { GameItem } from '../models/GameItem'
import { GameUpdate } from '../models/GameUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class GamesAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly gamesTable = process.env.GAMES_TABLE) {
    }

    async getAllGames(): Promise<GameItem[]> {
      console.log('Getting all games')

  
      const result = await this.docClient.scan({
        TableName: this.gamesTable
      }).promise()
  
      const items = result.Items

      console.log('Returned items: ', items)
      
      return items as GameItem[]
    }

    async getGamesForUser(userId: string): Promise<GameItem[]> {
      console.log('Getting all games for user ', userId)
  
      const result = await this.docClient.query({
        TableName: this.gamesTable,
        KeyConditionExpression: 'createdByUserId = :createdByUserId',
        ExpressionAttributeValues: {
          ':createdByUserId': userId
        },
        ScanIndexForward: false
      }).promise()

      console.log('Returned item: ', result)
  
      const items = result.Items
      return items as GameItem[]
    }
  
    async createGame(game: GameItem): Promise<GameItem> {
      console.log('Creating a new game')

      await this.docClient.put({
        TableName: this.gamesTable,
        Item: game
      }).promise()

      console.log('Created item: ', game)
  
      return game
    }

    async deleteGame(gameId: string, userId: string): Promise<string> {
      console.log('Deleting game item ', gameId)

      const key = {
        createdByUserId: userId,
        gameId: gameId
      }

      await this.docClient.delete({
        TableName: this.gamesTable,
        Key: key,
      }).promise()

      console.log('Deleted game item ', gameId)
  
      return gameId
    }

    async updateGame(game: GameUpdate, gameId: string, userId: string): Promise<GameUpdate> {
        console.log(`Updating a game with id ${gameId} and userid ${userId}`);

        await this.docClient.update({
          TableName: this.gamesTable,
          Key: {
            createdByUserId: userId,
            gameId: gameId
          },
          ExpressionAttributeNames: { "#N": "name" },
          UpdateExpression: 'SET #N=:gameName, instructions = :instructions, players = :players, link = :link',
          ExpressionAttributeValues: {
            ':gameName': game.name,
            ':instructions': game.instructions,
            ':players': game.players,
            ':link': game.link,
          },
          ReturnValues:"UPDATED_NEW" 
        }).promise()

        console.log(`Updated a game with id ${gameId} and userid ${userId}`);
    
        return game
      }
}
  
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}