import createError from "http-errors";
import * as contactsServices from "../services/contacts.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getContactsController = async (_req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite,
  } = _req.query;

  const userId = _req.user._id;
  const parsedPage = parseInt(page, 10);
  const parsedPerPage = parseInt(perPage, 10);
  const filter = {};

  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === "true";
  }

  const { contacts, totalItems } = await contactsServices.getAllContacts({
    page: parsedPage,
    perPage: parsedPerPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  const totalPages = Math.ceil(totalItems / parsedPerPage);
  const hasPreviousPage = parsedPage > 1;
  const hasNextPage = parsedPage < totalPages;

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: {
      data: contacts,
      page: parsedPage,
      perPage: parsedPerPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await contactsServices.getContactById(contactId, userId);

  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  let photoUrl = null;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file);
  }
  const contact = await contactsServices.createContact({ ...req.body, userId, photo: photoUrl });
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  let photoUrl;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file);
  }
  const payload = photoUrl ? { ...req.body, photo: photoUrl } : req.body;
  const contact = await contactsServices.patchContact(contactId, userId, payload);

  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await contactsServices.deleteContact(contactId, userId);

  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.status(204).send();
};
