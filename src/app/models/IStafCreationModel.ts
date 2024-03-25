import { ICountry } from "./ICountry"
import { IMovie } from "./IMovie"
import { IStafRole } from "./IStafRole"

export interface IStafCreationModel
{
  id:number
  name:string
  surname:string
  description:string
  imageName:string
  file:File
  countryId:number
  birthdate:string
  isOscar:boolean
  movies:number[] | undefined
  roles:number [] | undefined

}
