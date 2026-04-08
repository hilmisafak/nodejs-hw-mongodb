import { Router } from "express";
import * as contactsControllers from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import { upload } from "../middlewares/multer.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();
router.use(authenticate);
router.get("/", ctrlWrapper(contactsControllers.getContactsController));
router.get("/:contactId", isValidId, ctrlWrapper(contactsControllers.getContactByIdController));
router.post(
  "/",
  upload.single("photo"),
  validateBody(createContactSchema),
  ctrlWrapper(contactsControllers.createContactController),
);
router.patch(
  "/:contactId",
  isValidId,
  upload.single("photo"),
  (req, _res, next) => {
    if (req.file) {
      req.body.photo = req.file.originalname;
    }
    next();
  },
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.patchContactController),
);
router.delete("/:contactId", isValidId, ctrlWrapper(contactsControllers.deleteContactController));
export default router;
