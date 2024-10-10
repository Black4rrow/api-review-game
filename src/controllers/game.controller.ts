import { Body, Controller,Path, Get, Patch, Post, Route, Tags, Delete } from "tsoa";
import { GameDTO } from "../dto/game.dto";
import { gameService } from "../services/game.service";
import { notFound } from "../error/NotFoundError";

@Route("games")
@Tags("Games")
export class GameController extends Controller {
  @Get("/")
  public async getAllGames(): Promise<GameDTO[]> {
    return gameService.getAllGames();
  }

  @Get("{id}")
  public async getGameById(@Path() id: number): Promise<GameDTO | null> {
    const game = await gameService.getGameById(id);
    if(game === null){
      notFound("Game with id : "+id);
    }
    return game;
  }

  @Post("/")
  public async createGame(
    @Body() requestBody: GameDTO
  ): Promise<GameDTO> {
    const {title, console } = requestBody;
    if(!console?.id){
      notFound("Console with id : "+console?.id);
    }else{
      return gameService.createGame(title, console!.id!);
    }
  }

  @Patch("{id}")
  public async updateGame(
    @Path() id: number,
    @Body() requestBody: GameDTO
  ): Promise<GameDTO | null> {
    const { title, console } = requestBody;
    const request = await gameService.updateGame(id,title, console?.id);
    if(!request){
      notFound("Game with id : "+id);
    }else{
      return request;
    }
  }

  @Delete("{id}")
  public async deleteGame(@Path() id: number): Promise<void> {
    await gameService.deleteGame(id);
  }
}