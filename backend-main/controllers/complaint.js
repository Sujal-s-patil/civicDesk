import {
    getActiveComplaints,
    createComplaint,
    getComplaintById,
    getLastComplaintId,
    updateComplaintStatus,
    addComplaintComment,
    getCommentsByComplaintId,
} from "../query/complaintQueries.js";
import { releasePoliceFromComplaint } from "../query/policeQueries.js";
import { createError } from "../utils/createError.js";

export const listComplaints = async (req, res, next) => {
    try {
        const rows = await getActiveComplaints();
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};

export const createComplaintHandler = async (req, res, next) => {
    try {
        const complaintData = {
            ...req.validatedData,
            complainant_name: req.user.full_name,
            citizen_id: req.user.id,
        };

        const id = await createComplaint(complaintData);
        res.status(201).json({ message: "Complaint created successfully", id });
    } catch (error) {
        next(error);
    }
};

export const getComplaint = async (req, res, next) => {
    try {
        const { id } = req.params;
        const complaint = await getComplaintById(id);
        if (!complaint) throw createError("Complaint not found", 404);
        res.status(200).json(complaint);
    } catch (error) {
        next(error);
    }
};

export const lastComplaintId = async (req, res, next) => {
    try {
        const id = await getLastComplaintId();
        res.status(200).json({ id });
    } catch (error) {
        next(error);
    }
};


export const setComplaintStatus = async (req, res, next) => {
    try {
        const { complaint_id, status } = req.validatedData;
        const affected = await updateComplaintStatus(complaint_id, status);
        if (affected === 0) throw createError("No complaint found with the given ID", 404);

        if (status === "Resolved" || status === "Closed") {
            await releasePoliceFromComplaint(complaint_id);
        }

        res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const addComment = async (req, res, next) => {
    try {
        const { complaint_id, police_id, comment } = req.validatedData;
        const id = await addComplaintComment(complaint_id, police_id, comment);
        res.status(201).json({ message: "Comment added successfully", id });
    } catch (error) {
        next(error);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rows = await getCommentsByComplaintId(id);
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
};