import {Request, Response, Router} from 'express'
import DbHelper from 'src/api/db-helper'
import {TokenController} from 'src/controller'
import {body} from 'express-validator'

// TODO: Safely close connection
const db = new DbHelper()

const createCollection = async (req: Request, res: Response) => {
  const {title, description, link, rate, maxMint, collectionImage, tokenType} = req.body

  // server-side uuid in the session object
  const ownerUUID = req.session.userUuid

  if (!ownerUUID) {
    // todo: refactor protected path using express-session
    return res.status(400).send({message: 'Login as creator first'})
  }

  res.json(
    await TokenController.createCollection(
      title,
      description,
      link,
      rate,
      maxMint,
      ownerUUID!,
      collectionImage,
      +tokenType
    )
  )
}

const getCollection = async (req: Request, res: Response) => {
  const uuid = req.params.uuid

  return res.json(await TokenController.getCollectionByUUID(uuid))
}

const getCollectionsByUser = async (req: Request, res: Response) => {
  const uuid = req.params.userUuid
  return res.json(await TokenController.getCollectionByUser(uuid))
}

const getUserDetailsWithCollections = async (req: Request, res: Response) => {
  // fetch your collections (by your uuid)
  // if no uuid we will throw exception
  if (!req.session.userUuid) {
    return res.status(400).send({message: 'Login as creator first'})
  }
  return res.json(await TokenController.getUserDetailsWithCollections(req.session.userUuid!))
}

const getCollections = async (req: Request, res: Response) => {
  return res.json(await TokenController.getCollections())
}

const init = (app: Router) => {
  app.get('/all', getCollections)
  app.get('/mycollections', getUserDetailsWithCollections)
  app.get('/:uuid', getCollection)
  app.get('/user/:userUuid', body('userUuid').isUUID(), getCollectionsByUser)
  app.post(
    '/create',
    body('title').isString().isLength({min: 1}),
    body('description').isString().default(''),
    body('link').isURL(),
    body('rate').isNumeric().default(0),
    body('maxMint').isNumeric().default(1),
    body('owner').isString().isLength({min: 1}),
    body('tokenType').isNumeric().isIn([1, 2, 3]),
    createCollection
  )
}

export default init
