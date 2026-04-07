import { ContactCollection } from "../db/models/contact.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  filter = {},
  userId,
} = {}) => {
  const skip = (page - 1) * perPage;
  const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
  const finalFilter = { ...filter, userId };
  const totalItems = await ContactCollection.countDocuments(finalFilter);
  const contacts = await ContactCollection.find(finalFilter)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);

  return { contacts, totalItems };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const patchContact = async (contactId, userId, payload) => {
  const contact = await ContactCollection.findOneAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
  });
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactCollection.findOneAndDelete({ _id: contactId, userId });
  return contact;
};
