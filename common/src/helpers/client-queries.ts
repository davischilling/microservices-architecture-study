import { Request } from 'express'

type Dictionary = { [index: string]: string }

export const clientQueries = (req: Request) => {
  const match: Dictionary = {}
  const queryElements = Object.keys(req.query)
  let page: string = '1' // default page
  let perPage: string = '2' // default limit per page
  let sortby: [string, number] = ['createdAt', 1]
  if (queryElements.length > 0){
      queryElements.forEach((e, index, elements) => {
          if (e === 'page'){
              page = req.query[e] as string
          } else if (e === 'per-page'){
              perPage = req.query[e] as string
          } else if (e === 'sortby'){
              sortby[0] = (<string>req.query[e]!).split('_')[0]
              if ((<string>req.query[e]!).split('_')[1] === 'DESC'){
                  sortby[1] = -1
              }
          } else {
              if ((<string>req.query[e]!).includes('-')){
                  match[e] = (<string>req.query[e]!).split('-').join(' ')
              } else {
                  match[e] = (<string>req.query[e]!)
              }
          }
      })
  }
  return [match, page, perPage, sortby]
}