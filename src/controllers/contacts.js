import createError from "http-errors";
import * as contactsServices from "../services/contacts.js";

export const getContactsController = async (_req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavorite,
  } = _req.query;

  const parsedPage = parseInt(page, 10);
  const parsedPerPage = parseInt(perPage, 10);
  const filter = {};

  if (type) {
    filter.contactType = type;
  }
  if (isFavorite !== undefined) {
    filter.isFavorite = isFavorite === "true";
  }

  const { contacts, totalItems } = await contactsServices.getAllContacts({
    page: parsedPage,
    perPage: parsedPerPage,
    sortBy,
    sortOrder,
    filter,
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
  const contact = await contactsServices.getContactById(contactId);

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
  const contact = await contactsServices.createContact(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsServices.patchContact(contactId, req.body);

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
  const contact = await contactsServices.deleteContact(contactId);

  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.status(204).send();
};
