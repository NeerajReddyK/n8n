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

router.put("/update/nodes/:workflowId", authMiddleware, async (req, res) => {
  const email = req.email;
  try {
    const { newNode } = req.body;
    if (!newNode) {
      res.status(404).json({ message: "pass newNode as JSON" });
      return;
    }
    const workflowId = req.params.workflowId;
    if (!workflowId) {
      res.status(404).json({ message: "workflowId required" });
      return;
    }

    const workflow = await prismaClient.workflow.findFirst({
      where: {
        workflowId,
        email,
      },
      select: {
        nodes: true,
      },
    });

    if (!workflow) {
      res
        .status(500)
        .json({ message: "Unable to fetch workflow at the moment" });
      return;
    }
    const existingNodes = workflow.nodes;
    let updatedNodes = [];
    if (!existingNodes || existingNodes.length == 0) {
      updatedNodes = [newNode];
    } else {
      updatedNodes = [...existingNodes, newNode];
    }

    const db = await prismaClient.workflow.update({
      where: {
        workflowId,
        email,
      },
      data: {
        nodes: updatedNodes,
      },
    });
    res.status(200).json({ message: "success", nodes: updatedNodes });
  } catch (error) {
    console.error("Unable to udpate backend at the moment", error);
    res.status(500).json({ message: "Error while updating. try in a moment" });
  }
});

router.put("/update/edges/:workflowId", authMiddleware, async (req, res) => {
  const email = req.email;
  try {
    const workflowId = req.params.workflowId;
    const { newEdge } = req.body;
    if (!workflowId) {
      res.status(400).json({
        message: "WorkflowId required. Bad request",
      });
      return;
    }
    const workflow = await prismaClient.workflow.findFirst({
      where: { workflowId, email },
      select: { edges: true },
    });
    if (!workflow) {
      res.status(404).json({ message: "unable to get workflow from database" });
      return;
    }
    const existingEdges = workflow.edges;
    const updatedEdges = [...existingEdges, newEdge];

    const db = await prismaClient.workflow.update({
      data: {
        edges: updatedEdges,
      },
      where: {
        workflowId,
        email,
      },
    });

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "server error: ", error });
  }
});

export default router;
