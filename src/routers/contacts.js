import { Router } from "express";
import {
  getContactByIdController,
  getContactsController,
} from "../controllers/contacts.js";

const router = Router();

router.get("/", getContactsController);
router.get("/:contactId", getContactByIdController);

export const contactsRouter = router;
