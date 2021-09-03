import { GamesAccess } from '../dataLayer/gamesAcess'
import { GameItem } from '../models/GameItem'
import { GameUpdate } from '../models/GameUpdate';
import { CreateGameRequest } from '../requests/CreateGameRequest'
import { UpdateGameRequest } from '../requests/UpdateGameRequest'
import * as uuid from 'uuid'

const bucketName = process.env.ATTACHMENT_S3_BUCKET

const gamesAccess = new GamesAccess()

export async function getAllGames(): Promise<GameItem[]> {
    return gamesAccess.getAllGames()
  }

export async function getGamesForUser(userId: string): Promise<GameItem[]> {
    return gamesAccess.getGamesForUser(userId)
  }
  
export async function createGame(
  createGameRequest: CreateGameRequest,
  userId: string
): Promise<GameItem> {

    const itemId = uuid.v4()

    return await gamesAccess.createGame({
      gameId: itemId,
      createdByUserId: userId,
      name: createGameRequest.name,
      instructions: createGameRequest.instructions,
      players: createGameRequest.players,
      link: createGameRequest.link,
      createdAt: new Date().toISOString(),
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
    })
  }

export async function deleteGame(
  gameId: string,
  userId: string
): Promise<string> {

    return await gamesAccess.deleteGame(gameId, userId)
  }

export async function updateGame(
  updateGameRequest: UpdateGameRequest,
  itemId: string,
  userId: string
): Promise<GameUpdate> {
  
    return await gamesAccess.updateGame({
      name: updateGameRequest.name,
      instructions: updateGameRequest.instructions,
      players: updateGameRequest.players,
      link: updateGameRequest.link
    },
      itemId, 
      userId)
}
