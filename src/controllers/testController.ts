import { Request, Response } from 'express';

import * as service from '../services/testService.js';

export async function create(req: Request, res: Response) {
  const test = req.body;
  const testCreated = await service.create(test);
  res.status(201).send(testCreated);
}
