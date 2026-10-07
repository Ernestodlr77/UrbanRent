import { Request, Response } from 'express';
import { PropertyService } from '../services/property.service.js';
import { validateProperty } from '../utils/validators.js';

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  // GET /api/properties
  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const properties = await this.propertyService.getAllProperties({ page:Number(req.query.page)||1, limit:Number(req.query.limit)||12, search:String(req.query.search||''), status:String(req.query.status||''), type:String(req.query.type||''), country:String(req.query.country||'') });
      res.status(200).json(properties);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error al obtener propiedades.' });
    }
  };

  // GET /api/properties/rentals
  public getRentals = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(await this.propertyService.getRentalProperties());
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error al obtener inmuebles de alquiler.' });
    }
  };

  // GET /api/properties/:id
  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const property = await this.propertyService.getPropertyById(id);

      if (!property) {
        res.status(404).json({ message: 'Propiedad no encontrada.' });
        return;
      }

      res.status(200).json(property);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error al obtener la propiedad.' });
    }
  };

  // POST /api/properties
  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const propertyData = req.body;
      const validation = validateProperty(propertyData);
      if (!validation.valid) { res.status(400).json({ message: 'message' in validation ? validation.message : 'Datos inválidos' }); return; }
      const newProperty = await this.propertyService.createProperty(propertyData);
      res.status(201).json({ message: 'Propiedad creada con éxito.', property: newProperty });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error al crear la propiedad.' });
    }
  };

  // PUT /api/properties/:id
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const propertyData = req.body;
      const validation = validateProperty(propertyData, true);
      if (!validation.valid) { res.status(400).json({ message: 'message' in validation ? validation.message : 'Datos inválidos' }); return; }
      const updated = await this.propertyService.updateProperty(id, propertyData);

      if (!updated) {
        res.status(404).json({ message: 'No se pudo actualizar o propiedad no encontrada.' });
        return;
      }

      res.status(200).json({ message: 'Propiedad actualizada correctamente.' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error al actualizar la propiedad.' });
    }
  };

  // DELETE /api/properties/:id
  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleted = await this.propertyService.deleteProperty(id);

      if (!deleted) {
        res.status(404).json({ message: 'Propiedad no encontrada.' });
        return;
      }

      res.status(200).json({ message: 'Propiedad eliminada correctamente.' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error al eliminar la propiedad.' });
    }
  };
}