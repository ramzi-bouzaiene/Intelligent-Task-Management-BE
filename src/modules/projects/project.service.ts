import * as projectRepo from './project.repository';
import { Project } from '../../database/models/project.model';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import {
  buildPaginatedResponse,
  getPagination,
  PaginatedResponse,
  PaginationParams,
} from '../../shared/utils/pagination';
import PDFDocument from "pdfkit";

export const createProject = async (userId: number, dto: CreateProjectDto): Promise<Project> => {
  return projectRepo.createProject({ ...dto, user_id: userId });
};

export const getProjectsByUser = async (
  userId: number,
  pagination: PaginationParams = {},
): Promise<PaginatedResponse<Project>> => {
  const { page, limit, offset } = getPagination(pagination.page, pagination.limit);
  const { rows, total } = await projectRepo.getProjectsByUser(userId, limit, offset);
  return buildPaginatedResponse(rows, total, page, limit);
};

export const getProjectById = async (id: number): Promise<Project | null> => {
  return projectRepo.getProjectById(id);
};

export const updateProject = async (id: number, dto: UpdateProjectDto): Promise<Project | null> => {
  return projectRepo.updateProject(id, dto);
};

export const deleteProject = async (id: number): Promise<void> => {
  return projectRepo.deleteProject(id);
};

export const addMembersToProject = async (projectId: number, userIds: number[]): Promise<void> => {
  return projectRepo.addMemberToProject(projectId, userIds);
};

export const removeMemberFromProject = async (projectId: number, userId: number): Promise<void> => {
  return projectRepo.removeMemberFromProject(projectId, userId);
}

export const getProjectWithMembers = async (projectId: number) => {
  return projectRepo.getProjectWithMembers(projectId);
};

export const getProjectsWithMembersByUser = async (
  userId: number,
  pagination: PaginationParams = {},
) => {
  const { page, limit, offset } = getPagination(pagination.page, pagination.limit);
  const { rows, total } = await projectRepo.getProjectsWithMembersByUser(
    userId,
    limit,
    offset,
  );
  return buildPaginatedResponse(rows, total, page, limit);
};

export const generateProjectsPdf = (projects: any[]): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fillColor("#1a365d").fontSize(20).font("Helvetica-Bold").text("Projects Report");
    doc.fillColor("#718096").fontSize(9).font("Helvetica").text(`Generated on: ${new Date().toLocaleDateString()} | Total Projects: ${projects.length}`);
    doc.moveDown(1.5);

    const tableTop = doc.y;
    const startX = 40;

    const columnWidths = { id: 40, name: 130, description: 225, user: 120 };
    const columnPositions = {
      id: startX,
      name: startX + columnWidths.id,
      description: startX + columnWidths.id + columnWidths.name,
      user: startX + columnWidths.id + columnWidths.name + columnWidths.description,
    };

    const rowPadding = 8;
    const footerMargin = 50;

    doc.fillColor("#2FA084").rect(startX, doc.y, 515, 24).fill();
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);

    const headerY = doc.y + 7;
    doc.text("Project Name", columnPositions.name + 6, headerY, { width: columnWidths.name - 12 });
    doc.text("Description", columnPositions.description + 6, headerY, { width: columnWidths.description - 12 });
    doc.text("Assigned User", columnPositions.user + 6, headerY, { width: columnWidths.user - 12 });

    doc.y = tableTop + 24;

    doc.font("Helvetica").fontSize(9);

    projects.forEach((p, index) => {
      const idText = String(p.id ?? "-");
      const nameText = String(p.name ?? "-");
      const descText = String(p.description ?? "-");
      const userText = String(p.user_name ?? "Unknown");

      const idHeight = doc.heightOfString(idText, { width: columnWidths.id - 12 });
      const nameHeight = doc.heightOfString(nameText, { width: columnWidths.name - 12 });
      const descHeight = doc.heightOfString(descText, { width: columnWidths.description - 12 });
      const userHeight = doc.heightOfString(userText, { width: columnWidths.user - 12 });

      const maxCellHeight = Math.max(idHeight, nameHeight, descHeight, userHeight);
      const rowHeight = maxCellHeight + (rowPadding * 2);

      if (doc.y + rowHeight > doc.page.height - footerMargin) {
        doc.addPage();
        doc.y = 40;
      }

      const currentY = doc.y;

      if (index % 2 === 1) {
        doc.fillColor("#f7fafc").rect(startX, currentY, 515, rowHeight).fill();
      }

      doc.fillColor("#2d3748");
      doc.text(nameText, columnPositions.name + 6, currentY + rowPadding, { width: columnWidths.name - 12 });
      doc.text(descText, columnPositions.description + 6, currentY + rowPadding, { width: columnWidths.description - 12 });
      doc.text(userText, columnPositions.user + 6, currentY + rowPadding, { width: columnWidths.user - 12 });

      doc.strokeColor("#e2e8f0").lineWidth(0.5)
         .moveTo(startX, currentY + rowHeight)
         .lineTo(startX + 515, currentY + rowHeight)
         .stroke();

      doc.y = currentY + rowHeight;
    });

    doc.end();
  });
};

export const getProjectPdfReport = async (projectIds: number[]): Promise<Buffer> => {
  const projects = await projectRepo.getProjectsByIds(projectIds);

  return generateProjectsPdf(projects);
};