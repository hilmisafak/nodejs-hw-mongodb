import { Router } from "express";
import * as contactsControllers from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactSchemas.js";

const router = Router();

router.get("/", ctrlWrapper(contactsControllers.getContactsController));
router.get("/:contactId", isValidId, contactsControllers.getContactByIdController);
router.post("/", validateBody(createContactSchema), contactsControllers.createContactController);
router.patch(
  "/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  contactsControllers.patchContactController,
);
router.delete("/:contactId", isValidId, contactsControllers.deleteContactController);

export default router;
