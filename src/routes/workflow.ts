import express from "express";
import { authMiddleware } from "../authMiddleware.js";
import { prismaClient } from "../db/prismaClient.js";

const router = express.Router();

// here, workflow should be created and a webhook should be attached to this workflow immedeiately.
router.post("/", authMiddleware, async (req, res) => {
  const email = req.email;
  try {
    const { title, nodes, edges } = req.body;
    if (!email) {
      res.status(400).json({
        message: "fail, email is not being passed by authMiddleware",
      });
      return;
    }
    const workflow = await prismaClient.workflow.create({
      data: {
        title,
        active: true,
        nodes,
        edges,
        email,
      },
    });
    const workflowId = workflow.workflowId;
    const webhook = await prismaClient.webhook.create({
      data: {
        title,
        method: "POST",
        path: "/abc/cdf",
        header: { something: "something" },
        secret: "whatSECRET",
        workflowId,
      },
    });

    res.status(200).json({
      message: "Success",
      workflow,
      webhook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error encountered",
      error,
    });
  }
});

// get /workflow

router.get("/", authMiddleware, async (req, res) => {
  const email = req.email;
  if (!email) {
    res.status(400).json({
      message: "invalid email",
    });
    return;
  }
  try {
    const workflows = await prismaClient.workflow.findMany({
      where: {
        email,
      },
    });
    if (!workflows) {
      res.status(500).json({
        message: "unable to get workflows for the given mail at the moment",
      });
      return;
    }

    res.status(200).json({
      message: "success",
      workflows,
    });
  } catch (error) {
    res.status(400).json({
      message: "error while getting workflows related to an email",
      error,
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  const email = req.email;
  try {
    const workflowId = req.params.id;
    if (!workflowId) {
      res.status(400).json({
        message: "workflowId is required",
      });
      return;
    }

    const workflow = await prismaClient.workflow.findFirst({
      where: {
        workflowId,
        email,
      },
    });

    if (!workflow) {
      res.status(400).json({
        message: "there is no workflow with given workflowId",
      });
      return;
    }

    res.status(200).json({
      message: "success",
      workflow,
    });
  } catch (error) {
    res.status(500).json({
      message: "unable to get the workflow at the moment",
      error,
    });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const email = req.email;

  try {
    const workflowId = req.params.id;
    if (!workflowId) {
      res.status(400).json({
        message: "id is required",
      });
      return;
    }

    const workflow = await prismaClient.workflow.update({
      where: {
        workflowId,
        email,
      },
      data: {
        ...req.body,
      },
    });
    // check above, might cause some issues.
    res.status(200).json({
      message: "success",
      workflow,
    });
  } catch (error) {
    res.status(500).json({
      message: "unable to update workflow at the moment",
      error,
    });
  }
});

export default router;
