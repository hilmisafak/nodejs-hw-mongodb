import { ContactCollection } from "../db/models/contact.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  filter = {},
} = {}) => {
  const skip = (page - 1) * perPage;
  const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
  const totalItems = await ContactCollection.countDocuments(filter);
  const contacts = await ContactCollection.find(filter).sort(sortOptions).skip(skip).limit(perPage);

  return { contacts, totalItems };
};

export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const patchContact = async (contactId, payload) => {
  const contact = await ContactCollection.findOneAndUpdate({ _id: contactId }, payload, {
    new: true,
  });
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactCollection.findOneAndDelete({ _id: contactId });
  return contact;
};
