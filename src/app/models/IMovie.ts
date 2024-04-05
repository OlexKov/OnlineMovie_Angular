import { IGenre } from "./IGenre"

export interface IMovie
{
  id:number
  name:string
  originalName:string
  date:Date
  duration:string
  description:string
  qualityId:number
  qualityName:string
  countryId:number
  countryName:string
  poster:string
  movieUrl:string
  trailerUrl:string
  premiumId:number
  premiumName:string
  rating:number
  genres:IGenre[]
}
