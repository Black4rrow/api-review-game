import { Body, Controller,Path, Get, Patch, Post, Route, Tags } from "tsoa";
import { ReviewDTO } from "../dto/review.dto";
import { reviewService } from "../services/review.service";
import { notFound } from "../error/NotFoundError";

@Route("reviews")
@Tags("Reviews")
export class ReviewController extends Controller {
    @Get("/")
    public async getAllReview(): Promise<ReviewDTO[]> {
      return reviewService.getAllReviews();
    }

    @Get("{id}")
    public async getReviewById(@Path() id: number): Promise<ReviewDTO | null> {
      const review = await reviewService.getReviewById(id);
      if(review === null){
        notFound("Review with id : "+id);
      }
      return review;
    }
  
    @Post("/")
    public async createReview(
      @Body() requestBody: ReviewDTO
    ): Promise<ReviewDTO> {
      const {rating, review_text, game } = requestBody;
      if(!game?.id){
        notFound("Game with id : "+game?.id);
      }else{
        return reviewService.createReview(game!.id!, rating, review_text);
      }
    }
  
    @Patch("{id}")
    public async updateReview(
      @Path() id: number,
      @Body() requestBody: ReviewDTO
    ): Promise<ReviewDTO | null> {
      const {rating, review_text, game } = requestBody;
      const request = await reviewService.updateReview(id,game!.id!, rating, review_text);
      if(!request){
        notFound("Review with id : "+id);
      }else{
        return request;
      }
    }
}
