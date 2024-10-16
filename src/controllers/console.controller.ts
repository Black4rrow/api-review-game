import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch } from "tsoa";
import { consoleService } from "../services/console.service";
import { gameService } from "../services/game.service";
import { ConsoleDTO } from "../dto/console.dto";
import { notFound } from "../error/NotFoundError";
import { GameDTO } from "../dto/game.dto";

@Route("consoles")
@Tags("Consoles")
export class ConsoleController extends Controller {
  // Récupère toutes les consoles
  @Get("/")
  public async getAllConsole(): Promise<ConsoleDTO[]> {
    return consoleService.getAllConsoles();
  }

  // Récupère une console par ID
  @Get("{id}")
  public async getConsoleById(@Path() id: number): Promise<ConsoleDTO | null> {
    const console = await consoleService.getConsoleById(id);
    if(console === null){
      notFound("Console with id : "+id);
    }
    return console;
  }

  @Get("{id}/games")
  public async getConsoleGames(@Path() id: number): Promise<GameDTO[] | null> {
    const console = await consoleService.getConsoleById(id);
    if (!console) {
      notFound("Console with id : " + id);
    }

    const allGames: GameDTO[] = await gameService.getAllGames();
    const filteredGames = allGames.filter(game => game.console?.id === id);
    return filteredGames;
  }

  // Crée une nouvelle console
  @Post("/")
  public async createConsole(
    @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO> {
    const {name, manufacturer } = requestBody;
    return consoleService.createConsole(name, manufacturer);
  }

  // Supprime une console par ID
  @Delete("{id}")
  public async deleteConsole(@Path() id: number): Promise<void> {
    await consoleService.deleteConsole(id);
  }

  // Met à jour une console par ID
  @Patch("{id}")
  public async updateConsole(
    @Path() id: number,
    @Body() requestBody: ConsoleDTO
  ): Promise<ConsoleDTO | null> {
    const { name, manufacturer } = requestBody;
    const request = await consoleService.updateConsole(id, name, manufacturer);
    if(!request){
      notFound("Console with id : "+id);
    }
    return request;
  }
}