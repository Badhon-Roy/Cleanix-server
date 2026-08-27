import express from 'express';
import { ContactController } from './contact.controller';

const router = express.Router();

router.post('/', ContactController.createContact);
router.get('/', ContactController.getAllContacts);
router.get('/:id', ContactController.getContactById);
router.patch('/:id', ContactController.updateContactStatus);
router.delete('/:id', ContactController.deleteContact);

export const ContactRoutes = router;
