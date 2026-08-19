import { Request, Response } from 'express';
import { MetastructClient } from '../clients/MetastructClient.js';

export class ServiceTaskController {
  constructor(private readonly metastructClient: MetastructClient) {}

  public mutateEntity = async (req: Request, res: Response): Promise<Response> => {
    const { entityName, action, data, entityId } = req.body;

    if (!entityName || !action || !data) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Missing required parameters: entityName, action (CREATE|UPDATE), and data are required.',
      });
    }

    if (action !== 'CREATE' && action !== 'UPDATE') {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Action must be either CREATE or UPDATE.',
      });
    }

    try {
      const result = await this.metastructClient.mutateEntity({
        entityName,
        action,
        data,
        entityId,
      });

      return res.status(200).json({
        status: 'MUTATION_SUCCESS',
        entityName,
        action,
        data: result,
      });
    } catch (error: any) {
      return res.status(502).json({
        error: 'BAD_GATEWAY',
        message: error.message,
      });
    }
  };
}