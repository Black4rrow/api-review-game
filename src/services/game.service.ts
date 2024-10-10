import { GameDTO } from "../dto/game.dto";
import { notFound } from "../error/NotFoundError";
import { Console } from "../models/console.model";
import { Game } from "../models/game.model";
import { Review } from "../models/review.model";

export class GameService {
  public async getAllGames(): Promise<GameDTO[]> {
    return Game.findAll({
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });
  }

  public async getGameById(id: number): Promise<Game | null> {
    return Game.findByPk(id,{
      include: [
        {
          model: Console,
          as: "console",
        },
      ],
    });
  }

  public async createGame(
    title: string,
    console_id: number
  ): Promise<Game> {
    const console = await Console.findByPk(console_id);
    if(!console){
      notFound("Console whith id : "+console_id+" don't exists");
    }else{
      return Game.create({ title, console_id });
    }
  }

  public async updateGame(
    id: number,
    title?: string,
    console_id?: number
  ): Promise<Game | null> {
    const game = await Game.findByPk(id);
    const console = await Console.findByPk(console_id);
    if(!console){
      notFound("Console whith id : "+console_id+" don't exists");
    }
    if (game !== null) {
      if (title) game.title = title;
      if (console_id) game.console_id = console_id;
      await game.save();
      return game;
    }
    return null;
  }

  public async deleteGame(id: number): Promise<void> {
    const game = await Game.findByPk(id);

    const reviews = await Review.findAll({
      where: {game_id: {id}}
    });

    if(!game){
      notFound("Console with id : "+id);
    }

    if(reviews.length > 0){
      const error = new Error("Can't delete game which has reviews");
      (error as any).status = 404;
      throw error;
    }

    game.destroy();
  }
}

export const gameService = new GameService();
