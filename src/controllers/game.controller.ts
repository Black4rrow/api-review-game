import { Body, Controller,Path, Get, Patch, Post, Route, Tags, Delete } from "tsoa";
import { GameDTO } from "../dto/game.dto";
import { ReviewDTO } from "../dto/review.dto";
import { gameService } from "../services/game.service";
import { reviewService } from "../services/review.service";
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

  @Get("{id}/reviews")
  public async getConsoleGames(@Path() id: number): Promise<ReviewDTO[] | null> {
    const game = await gameService.getGameById(id);
    if (!game) {
      notFound("Game with id : " + id);
    }

    const allReviews: ReviewDTO[] = await reviewService.getAllReviews();
    const filteredReviews = allReviews.filter(review => review.game?.id === id);
    return filteredReviews;
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