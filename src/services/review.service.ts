import { not } from "joi";
import { ReviewDTO } from "../dto/review.dto";
import { notFound } from "../error/NotFoundError";
import { Game } from "../models/game.model";
import { Review } from "../models/review.model";
import { Console } from "../models/console.model";

export class ReviewService {
    public async getAllReviews(): Promise<ReviewDTO[]> {
        return Review.findAll({
          include: [
            {
              model: Game,
              as: "game",
              include: [
                {
                model: Console,
                as: "console",
                }
              ],
            },
          ],
        });
      }

      public async getReviewById(id: number): Promise<Review | null> {
        return Review.findByPk(id,{
          include: [
            {
              model: Game,
              as: "game",
              include: [
                {
                model: Console,
                as: "console",
                }
              ],
            },
          ],
        });
      }
    
      public async createReview(
        game_id: number,
        rating: number,
        review_text: string
      ): Promise<Review> {
        const game = await Game.findByPk(game_id);
        if(!game){
          notFound("Game whith id : "+game_id+" don't exists");
        }else{
          return Review.create({ rating: rating, review_text: review_text, game_id:game_id });
        }
      }
    
      public async updateReview(
        id: number,
        game_id: number,
        rating: number,
        review_text: string
      ): Promise<Review | null> {
        const review = await Review.findByPk(id);
        const game = await Game.findByPk(game_id);
        if(!game){
          notFound("Game whith id : "+game_id+" don't exists");
        }
        if (review != null) {
          if (rating) review.rating = rating;
          if (review_text) review.review_text = review_text;
          if (game_id) review.game_id = game_id;
          await review.save();
          return review;
        }
        return null;
      }

      public async deleteReview(id: number): Promise<void> {
        const review = await Review.findByPk(id);

        if(!review){
          notFound("Review with id : "+id);
        }

        review.destroy();
      }
}

export const reviewService = new ReviewService();