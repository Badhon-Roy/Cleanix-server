import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactService } from './contact.service';

const createContact = catchAsync(async (req, res) => {
  const result = await ContactService.createContactInDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Contact inquiry submitted successfully to Cleanix HQ!',
    data: result,
  });
});

const getAllContacts = catchAsync(async (req, res) => {
  const result = await ContactService.getAllContactsFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact inquiries retrieved successfully',
    data: result,
  });
});

const getContactById = catchAsync(async (req, res) => {
  const result = await ContactService.getContactByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact inquiry fetched successfully',
    data: result,
  });
});

const updateContactStatus = catchAsync(async (req, res) => {
  const result = await ContactService.updateContactStatusInDB(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact status updated successfully',
    data: result,
  });
});

const deleteContact = catchAsync(async (req, res) => {
  const result = await ContactService.deleteContactFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact deleted successfully',
    data: result,
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};
