import { Request, Response } from 'express';

import * as service from '../services/testService.js';

export async function create(req: Request, res: Response) {
  const test = await service.testFactory(req.body);

  const testCreated = await service.create(test);
  res.status(201).send(testCreated);
}

export async function getByTeacher(req: Request, res: Response) {
  const id = Number(req.params.id);
  const tests = await service.getByTeacher(id);
  res.status(200).send(tests);
}
