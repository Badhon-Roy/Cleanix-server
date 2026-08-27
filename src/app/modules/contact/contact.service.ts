import AppError from '../../errors/AppError';
import { IContact } from './contact.interface';
import { Contact } from './contact.model';
import { emitContactCreated, emitContactUpdated } from '../../socket/socket';

const createContactInDB = async (payload: Partial<IContact>) => {
  const result = await Contact.create({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    status: 'NEW',
    isDeleted: false,
  });

  emitContactCreated(result);
  return result;
};

const getAllContactsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  // Status Filter
  if (query.status && query.status !== 'ALL') {
    filter.status = query.status;
  }

  // SearchTerm Filter across name, email, phone, subject, message
  const searchTerm = (query.searchTerm || query.query || query.search) as string;
  if (searchTerm && searchTerm.trim() !== '') {
    const regex = new RegExp(searchTerm.trim(), 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { subject: regex },
      { message: regex },
    ];
  }

  const result = await Contact.find(filter).sort({ createdAt: -1 });
  return result;
};

const getContactByIdFromDB = async (id: string) => {
  const result = await Contact.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(404, 'Contact inquiry not found');
  }
  return result;
};

const updateContactStatusInDB = async (id: string, payload: Partial<IContact>) => {
  const isExists = await Contact.findById(id);
  if (!isExists || isExists.isDeleted) {
    throw new AppError(404, 'Contact inquiry not found');
  }

  const result = await Contact.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  emitContactUpdated(result);
  return result;
};

const deleteContactFromDB = async (id: string) => {
  const isExists = await Contact.findById(id);
  if (!isExists) {
    throw new AppError(404, 'Contact inquiry not found');
  }

  const result = await Contact.findByIdAndDelete(id);

  emitContactUpdated({ id, isDeleted: true });
  return result;
};

export const ContactService = {
  createContactInDB,
  getAllContactsFromDB,
  getContactByIdFromDB,
  updateContactStatusInDB,
  deleteContactFromDB,
};
